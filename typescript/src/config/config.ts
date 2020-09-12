const {
    EXPRESS_PORT = 3000,
    S3_ENDPOINT = 'localhost',
    S3_PORT = 9000,
    S3_ACCESS_KEY = 'SCALAINAWEEK',
    S3_SECRET_KEY = 'SCALAINAWEEK',
    REDIS_HOST = 'localhost',
    AMQP_HOST = 'localhost',
    AMQP_PORT = 5672,
    AMQP_USER = 'scala',
    AMQP_PASSWORD = 'inaweek'
} = process.env;

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
}