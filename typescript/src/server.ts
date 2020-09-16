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

/**
 * Here we initalize our Express App, and load in some needed middleware
 * for CORS and parsing the bodies of HTTP requests.
 */
const app = express();
app.use(cors());
app.use(bodyParser.text());

/**
 * These apply our logic to the respective endpoints of our app. They are applied as a
 * function that takes an express app as an agument, jsut as a way to easily apply
 * them in groups.
 */
healthRoutes(app);
rootRoutes(app);
apiImages(app);
apiStats(app);

/**
 * We'll want to initalize out HTTP server as well as a serveer
 * for our WebSocket connetcions!
 */
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

/**
 * When a websocket is connected, subscribe it to our
 * RbbitMQ stats events
 */
wss.on("connection", (ws: WebSocket) => {
    RabbitMQService.subscribe(ws);
});

/**
 * Start accepting traffic
 */
server.listen(config.EXPRESS_PORT, () => {
  console.log(`Server listenng at http://localhost:${config.EXPRESS_PORT}`);
});
