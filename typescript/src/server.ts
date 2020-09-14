import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import { config } from "./config/config";
import { healthRoutes } from "./controllers/health/routes";
import { rootRoutes } from "./controllers/root/routes";
import { apiImages } from "./controllers/api/images/routes";
import { apiStats } from "./controllers/api/stats/routes";
import { RabbitMQService } from "./services/rabbitmq/rabbitmq";
import bodyParser from "body-parser";
import cors from 'cors';

const app = express();
app.use(cors());
app.use(bodyParser.text());

healthRoutes(app);
rootRoutes(app);
apiImages(app);
apiStats(app);

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws: WebSocket) => {
    RabbitMQService.subscribe(ws);
});

server.listen(config.EXPRESS_PORT, () => {
  console.log(`Server listenng at http://localhost:${config.EXPRESS_PORT}`);
});
