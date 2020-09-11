import { Router } from "express";
import * as Minio from 'minio';
import { config } from "../../../config/config";

var minioClient = new Minio.Client({
    endPoint: config.S3_ENDPOINT,
    port: config.S3_PORT as number,
    useSSL: false,
    accessKey: config.S3_ACCESS_KEY,
    secretKey: config.S3_SECRET_KEY
});

function getRandomInt(max: number): number {
    return Math.floor(Math.random() * Math.floor(max));
  }

export function apiImages(app: Router) {

    /**
     * Return an array of BucketItem => a list of objects in our
     * S3 photos bucket
     */
    app.get('/api/images', async (req, res) => {

        const files: Minio.BucketItem[] = [];
        const loStream = minioClient.listObjects('photos');
        loStream.on('data', (data: Minio.BucketItem) => {
            files.push(data);
        })
        .on('error', (error) => {
            res.status(500).send(error);
        })
        .on('end', async () => {
            res.send(files);
        })
        .on('close', () => {
            // closing stream... hopefully it ended first!
        });

    });

    /**
     * Reirect to a random image from our S3 photos bucket
     */
    app.get('/api/images/random', async (req, res) => {

        const files: Minio.BucketItem[] = [];
        const loStream = minioClient.listObjects('photos');
        loStream.on('data', (data: Minio.BucketItem) => {
            files.push(data);
        })
        .on('error', (error) => {
            res.status(500).send(error);
        })
        .on('end', async () => {
            const ranomFile = files[getRandomInt(files.length)];
            res.redirect(`/api/image/${ranomFile.name}`);
        })
        .on('close', () => {
            // closing stream... hopefully it ended first!
        });

    });

    /**
     * Serve an image from our S3 photos bucket
     */
    app.get('/api/image/:id', async (reg, res) => {
        try {
            (await minioClient.getObject('photos', reg.params['id'])).pipe(res);
        } catch  (e) {
            res.status(404).send(e);
        }
    });

}