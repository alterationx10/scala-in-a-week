import { Router } from "express";

export function healthRoutes(app: Router) {

    app.get('/_health', (_req, _res) => {
        _res.status(200).send();
    });

}