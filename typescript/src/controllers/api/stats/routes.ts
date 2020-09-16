import { Router } from "express";
import { BucketItem } from "minio";
import { MinioService } from "../../../services/minio/minio";
import { PostgresService } from "../../../services/postgres/postgres";
import { RabbitMQService } from "../../../services/rabbitmq/rabbitmq";
import { RedisService } from "../../../services/redis/redis";

/**
 * A collection of endpoints to GET stats about our images
 * @param app The express app to add the enpoints to
 */
export function apiStats(app: Router) {

    /**
     * This gets a list of all images in our S3 bucket, and then
     * maps them to the appropriate set of stats.
     */
    app.get('/api/stats', (req, res) => {
        MinioService.bucketList('photos')
        .then( async (data: BucketItem[]) => {            
            const result: any[] = [];
            for (const thing of data) {
                const views = await RedisService.hgetInt(thing.name, 'views');
                const likes = await RedisService.hgetInt(thing.name, 'likes');
                const comments = await PostgresService.getCommentCount(thing.name);
                result.push({id: thing.name, views, likes, comments});
            }
            res.send(result);
        })
        .catch((error) => res.status(500).send(error));
    });

    /**
     * Returns the stats of the specified photo
     */
    app.get('/api/stats/:id', async (req, res) => {
        const id = req.params['id'];
        const views = await RedisService.hgetInt(id, 'views');
        const likes = await RedisService.hgetInt(id, 'likes');;
        const comments = await PostgresService.getCommentCount(id);
        res.send({id, views, likes, comments});
    });

}