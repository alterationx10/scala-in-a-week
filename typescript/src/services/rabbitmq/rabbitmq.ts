import * as AMQP from "amqplib/callback_api";
import { config } from "../../config/config";
import { RedisService } from "../redis/redis";
import * as WebSocket from "ws";
import { PostgresService } from "../postgres/postgres";

/**
 * A RabbitMQ namespace to as as a Singelton access to 
 */
export namespace RabbitMQService {

  // The connection string built from the config object
  const _url = `amqp://${config.AMQP_USER}:${config.AMQP_PASSWORD}@${config.AMQP_HOST}:${config.AMQP_PORT}`;
  
  // The common exchange messages will be routed through
  const _EXCHANGE = "scalathisweek";
  
  // A variable to hold our active channel
  var _channel: AMQP.Channel | undefined;

  // Our RabbitMQ connection.
  const connection = AMQP.connect(_url, (error, conn) => {
    if (error) {
      console.error("Couln't connect to RMQ!", error);
    }
    conn.createChannel(function (error1, channel) {
      if (error1) {
        console.error("Couln't create RMQ Channel!", error1);
      }
      channel.assertExchange(_EXCHANGE, "fanout", { durable: false });
      _channel = channel;
    });
  });


  /**
   * Gather and publish the latest stats about a given imagee
   * @param id The id of the image to look up the stats for
   * @param routing Queeue rrouting parameter (default :'')
   */
  export async function publishStat(id: string, routing: string = "") {
    if (_channel) {
      // Get the stats
      const views = await RedisService.hgetInt(id, "views");
      const likes = await RedisService.hgetInt(id, "likes");
      const comments = await PostgresService.getCommentCount(id);
      // Stringify and publish our messagee
      const msg = JSON.stringify({ id, views, likes, comments });
      _channel.publish(_EXCHANGE, routing, Buffer.from(msg));
    } else {
      console.warn("RMQ Channel is undefined!");
    }
  }

  /**
   * Subscribes a WebSocket to our stat events exchange via a dynamic exclusive queue.
   * Also attaches a callback to clean up the queue on disconnect.
   * @param ws The websocket
   */
  export async function subscribe(ws: WebSocket) {
    if (_channel) {
      // Create a dynamic, exclusive queue
      _channel.assertQueue("", { exclusive: true }, (error, queue) => {
        if (error) {
          console.error("Couldn't subscribe queue to RMQ!", error);
          return;
        }
        // Bind the queue to our excahnge
        _channel?.bindQueue(queue.queue, _EXCHANGE, "");
        // Start consuming messages...
        _channel?.consume(
          queue.queue,
          (msg) => {
            if (msg?.content) {
              // ... on a message, dump it straight to our webscoket.
              ws.send(msg.content.toString());
            }
          },
          {
            noAck: true,
          }
        );
        // Attach a callback to clean up our queue when our websocket disconnects.
        ws.onclose = (event) => {
          _channel?.deleteQueue(queue.queue);
          return;
        };
      });
    } else {
      console.warn("RMQ Channel is undefined!");
      return;
    }
  }
}
