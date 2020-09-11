FROM minio/minio

COPY photos /data/photos

ENTRYPOINT ["minio", "server", "/data"]