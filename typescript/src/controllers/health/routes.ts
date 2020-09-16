import { Router } from "express";

export function healthRoutes(app: Router) {

    app.get('/_health', (req, res) => {
        res.status(200).send();
    });

}