import { Router } from "express";
import { BucketItem } from "minio";
import { MinioService } from "../../../services/minio/minio";
import { RabbitMQService } from "../../../services/rabbitmq/rabbitmq";
import { RedisService } from "../../../services/redis/redis";


export function apiStats(app: Router) {

    app.get('/api/stats', (req, res) => {
        MinioService.bucketList('photos')
        .then( async (data: BucketItem[]) => {            
            const result: any[] = [];
            for (const thing of data) {
                const views = await RedisService.hgetInt(thing.name, 'views');
                const likes = await RedisService.hgetInt(thing.name, 'likes');;
                result.push({id: thing.name, views, likes});
            }
            res.send(result);
        })
        .catch((error) => res.status(500).send(error));
    });

    app.get('/api/stats/:id', async (req, res) => {
        const id = req.params['id'];
        const views = await RedisService.hgetInt(id, 'views');
        const likes = await RedisService.hgetInt(id, 'likes');;
        res.send({id, views, likes});
    });

}