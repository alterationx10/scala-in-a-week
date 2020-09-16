/**
 * We assign some default values to our config parameters,
 * which will be overwritten by any set in process.env
 */
const {
    EXPRESS_PORT = 3001,
    S3_ENDPOINT = 'localhost',
    S3_PORT = 9000,
    S3_ACCESS_KEY = 'SCALAINAWEEK',
    S3_SECRET_KEY = 'SCALAINAWEEK',
    REDIS_HOST = 'localhost',
    AMQP_HOST = 'localhost',
    AMQP_PORT = 5672,
    AMQP_USER = 'scala',
    AMQP_PASSWORD = 'inaweek',
    PG_HOST = 'localhost',
    PG_PORT = 5432,
    PG_USER = 'scala',
    PG_PASS = 'scalainaweek',
    PG_DB = 'scala',
} = process.env;

/**
 * We make an object holding default values for our config
 */
export const config  = {
    EXPRESS_PORT,
    S3_ENDPOINT,
    S3_PORT,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
    REDIS_HOST,
    AMQP_HOST,
    AMQP_PORT,
    AMQP_USER,
    AMQP_PASSWORD,
    PG_HOST,
    PG_PORT,
    PG_USER,
    PG_PASS,
    PG_DB,
}
