import { Router } from "express";

export function rootRoutes(app: Router) {

    app.get('/', (_req, _res) => {
        _res.status(200).send({
            greeting: 'Hello from TypeScript!'
        });
    });

}