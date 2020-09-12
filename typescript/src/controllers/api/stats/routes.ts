import { Router } from "express";
import { BucketItem } from "minio";
import { MinioService } from "../../../services/minio/minio";
import { RabbitMQService } from "../../../services/rabbitmq/rabbitmq";
import { RedisService } from "../../../services/redis/redis";

const minioService = new MinioService();

export function apiStats(app: Router) {

    app.get('/api/stats', (req, res) => {
        minioService.bucketList('photos')
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

    app.post('api/like/:id', async (req, res) => {
        try  {
            const id = req.params['id'];
            RedisService.redisClient.hincrby(id, 'likes', 1);
            // Now send an event that the stats for an ID has changed!
            await RabbitMQService.publishStat(id);
            res.status(200).send();
        } catch (e) {
            res.status(500).send(e);
        }
    });

}