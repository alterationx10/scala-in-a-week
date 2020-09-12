import { Router } from "express";
import { BucketItem } from "minio";
import { MinioService } from "../../../services/minio/minio";
import { redisClient, RedisService } from "../../../services/redis/redis";

const minioService = new MinioService();
const redisService = new RedisService();

export function apiStats(app: Router) {

    app.get('/api/stats', (req, res) => {
        minioService.bucketList('photos')
        .then( async (data: BucketItem[]) => {            
            const result: any[] = [];
            for (const thing of data) {
                const views = await redisService.hgetInt(thing.name, 'views');
                const likes = await redisService.hgetInt(thing.name, 'likes');;
                result.push({id: thing.name, views, likes});
            }
            res.send(result);
        })
        .catch((error) => res.status(500).send(error));
    });

    app.get('/api/stats/:id', async (req, res) => {
        const id = req.params['id'];
        const views = await redisService.hgetInt(id, 'views');
        const likes = await redisService.hgetInt(id, 'likes');;
        res.send({id, views, likes});
    });

    app.post('api/like/:id', (req, res) => {
        try  {
            const id = req.params['id'];
            redisClient.hincrby(id, 'likes', 1);
            // Now send an event that the stats for an ID has changed!
            redisClient.publish('stats', id);
            res.status(200).send();
        } catch (e) {
            res.status(500).send(e);
        }
    });

}