import express from "express";
import { config } from "./config/config";
import { healthRoutes } from './controllers/health/routes'
import { rootRoutes } from './controllers/root/routes'

const app = express();

healthRoutes(app);
rootRoutes(app);

app.listen(config.EXPRESS_PORT, () => {
    console.log(`Server listenng at http://localhost:${config.EXPRESS_PORT}`);
});
