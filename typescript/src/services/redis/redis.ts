import * as redis from "redis";
import { config } from "../../config/config";

/**
 * A Redis namsapce to act as a Singleton access to our redisClient,
 * along with some heper functions.
 */
export namespace RedisService {

  /**
   * A configured RedisClient
   */
  export const redisClient = redis.createClient({
    host: config.REDIS_HOST,
  });

  /**
   * A function that calls hget, but returns a default values
   * if an error occurs.
   * @param key Redis Key
   * @param field Redis Field
   * @param _default Default return value: 0
   */
  export function hgetInt(
    key: string,
    field: string,
    _default: number = 0
  ): Promise<number> {
    return new Promise(function (resolve, _) {
      redisClient.hget(key, field, (_, str) => {
        if (str) {
          try {
            resolve(parseInt(str));
          } catch (e) {
            // do nothing
          }
        }
        resolve(_default);
      });
    });
  }
}
