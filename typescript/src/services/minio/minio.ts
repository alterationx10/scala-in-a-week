import * as Minio from "minio";
import { BucketItem } from "minio";
import { config } from "../../config/config";

/**
 * A Minio namespace that acts as a Singleton access to our minioClient,
 * along with some helpeer functions
 */
export namespace MinioService {

  /**
   * A configured Minio.Client
   */
  export const minioClient = new Minio.Client({
    endPoint: config.S3_ENDPOINT,
    port: config.S3_PORT as number,
    useSSL: false,
    accessKey: config.S3_ACCESS_KEY,
    secretKey: config.S3_SECRET_KEY,
  });

  /**
   * Return an array of BucketItems as a Promise 
   * from the stream implementation.
   * @param bucket The bucket of interest
   */
  export function bucketList(bucket: string): Promise<BucketItem[]> {
    return new Promise(function (resolve, reject) {
      const files: BucketItem[] = [];
      const loStream = minioClient.listObjects(bucket);
      loStream
        .on("data", (data: BucketItem) => {
          files.push(data);
        })
        .on("error", (error) => {
          reject(error);
        })
        .on("end", async () => {
          resolve(files);
        });
    });
  }
}
