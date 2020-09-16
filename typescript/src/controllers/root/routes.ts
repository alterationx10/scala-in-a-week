import { Router } from "express";

export function rootRoutes(app: Router) {

    app.get('/', (req, res) => {
        res.status(200).send({
            greeting: 'Hello from TypeScript!'
        });
    });

}