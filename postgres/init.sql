CREATE TABLE IF NOT EXISTS "comments" (
    "id" bigserial primary key,
    "imageId" text,
    "comment" text
);