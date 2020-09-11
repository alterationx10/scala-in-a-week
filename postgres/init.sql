CREATE TABLE IF NOT EXISTS "comments" (
    "id" bigserial primary key,
    "userId" text,
    "imageId" text,
    "comment" text
);