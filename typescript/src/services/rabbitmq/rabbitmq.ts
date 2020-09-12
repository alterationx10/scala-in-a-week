import * as AMQP from "amqplib/callback_api";
import { config } from "../../config/config";
import { RedisService } from "../redis/redis";
import * as WebSocket from "ws";
import { PostgresService } from "../postgres/postgres";

export namespace RabbitMQService {
  const _url = `amqp://${config.AMQP_USER}:${config.AMQP_PASSWORD}@${config.AMQP_HOST}:${config.AMQP_PORT}`;
  const _EXCHANGE = "scalathisweek";
  var _channel: AMQP.Channel | undefined;

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

  export async function publishStat(id: string, routing: string = "") {
    if (_channel) {
      const views = await RedisService.hgetInt(id, "views");
      const likes = await RedisService.hgetInt(id, "likes");
      const comments = await PostgresService.getCommentCount(id);
      const msg = JSON.stringify({ id, views, likes, comments });
      _channel.publish(_EXCHANGE, routing, Buffer.from(msg));
    } else {
      console.warn("RMQ Channel is undefined!");
    }
  }

  export async function subscribe(ws: WebSocket) {
    if (_channel) {
      _channel.assertQueue("", { exclusive: true }, (error, queue) => {
        if (error) {
          console.error("Couldn't subscribe queue to RMQ!", error);
        }
        _channel?.bindQueue(queue.queue, _EXCHANGE, "");
        _channel?.consume(
          queue.queue,
          (msg) => {
            if (msg?.content) {
              ws.send(msg.content.toString());
            }
          },
          {
            noAck: true,
          }
        );
        ws.onclose = (event) => {
          _channel?.deleteQueue(queue.queue);
          return;
        };
      });
    } else {
      console.warn("RMQ Channel is undefined!");
    }
  }
}
