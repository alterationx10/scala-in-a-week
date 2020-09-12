import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import { config } from "./config/config";
import { healthRoutes } from "./controllers/health/routes";
import { rootRoutes } from "./controllers/root/routes";
import { apiImages } from "./controllers/api/images/routes";
import { apiStats } from "./controllers/api/stats/routes";
import { RedisService } from "./services/redis/redis";

const app = express();

healthRoutes(app);
rootRoutes(app);
apiImages(app);
apiStats(app);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const redisService = new RedisService();

wss.on("connection", (ws: WebSocket) => {
  // List to events from Redis
  const subscriber = redisService.newClient();
  subscriber.subscribe("stats");
  subscriber.on("message", async function (channel, message) {
    const id = message; // This should be the ID of the thing that changed
    const views = await redisService.hgetInt(id, "views");
    const likes = await redisService.hgetInt(id, "likes");
    ws.send(JSON.stringify({ id, views, likes })); // Send the most reecents stats
  });
});

server.listen(config.EXPRESS_PORT, () => {
  console.log(`Server listenng at http://localhost:${config.EXPRESS_PORT}`);
});
