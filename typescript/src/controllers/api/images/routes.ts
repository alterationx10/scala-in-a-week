import { Router } from "express";
import { MinioService } from '../../../services/minio/minio';
import { redisClient } from '../../../services/redis/redis';

const minioService = new MinioService();

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
}

export function apiImages(app: Router) {

    /**
     * Return an array of BucketItem => a list of objects in our
     * S3 photos bucket
     */
    app.get('/api/images', async (req, res) => {
        
        minioService.bucketList('photos')
        .then( (data) => res.send(data))
        .catch( (error) => res.status(500).send(error));

    });

    /**
     * Reirect to a random image from our S3 photos bucket
     */
    app.get('/api/images/random', async (req, res) => {

        minioService.bucketList('photos')
        .then( (data)  => {
            const ranomFile = data[getRandomInt(data.length)];
            res.redirect(`/api/image/${ranomFile.name}`);
        })
        .catch( (error) => res.status(500).send(error));

    });

    /**
     * Serve an image from our S3 photos bucket
     */
    app.get('/api/image/:id', async (req, res) => {
        try {
            const id = req.params['id'];
            // Every time we view an image, increase the stats!
            redisClient.HINCRBY(id, 'views', 1);
            // Now send an event that the stats for an ID has changed!
            redisClient.publish('stats', id);
            (await minioService.minioClient.getObject('photos', id)).pipe(res);
        } catch (e) {
            res.status(404).send(e);
        }
    });

}