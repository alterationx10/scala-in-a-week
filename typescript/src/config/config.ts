const {
    EXPRESS_PORT = 3000,
    S3_ENDPOINT = 'localhost',
    S3_PORT = 9000,
    S3_ACCESS_KEY = 'SCALAINAWEEK',
    S3_SECRET_KEY = 'SCALAINAWEEK',
} = process.env;

export const config  = {
    EXPRESS_PORT,
    S3_ENDPOINT,
    S3_PORT,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
}