import * as redis from 'redis';
import { RedisClient } from 'redis';
import { config } from '../../config/config';

export const redisClient = redis.createClient({
    host: config.REDIS_HOST
});

export class RedisService {
    redisClient: RedisClient = redisClient;
    RedisService(){};

    newClient = () => redis.createClient({
        host: config.REDIS_HOST
    });

    hgetInt(key: string, field: string, _default: number = 0): Promise<number>  {
        return new Promise(function(resolve, _) {
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