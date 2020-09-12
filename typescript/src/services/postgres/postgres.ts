import { Client, Pool } from "pg";
import { config } from "../../config/config";

export namespace PostgresService {
  export const pool = new Pool({
    host: config.PG_HOST,
    port: config.PG_PORT as number,
    user: config.PG_USER,
    password: config.PG_PASS,
    database: config.PG_DB,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  export async function getCommentCount(id: string): Promise<number> {
    const client = await pool.connect();
    const resultSet = await client.query(
      'SELECT COUNT(1) from "comments" where "imageId" = $1 ',
      [id]
    );
    if (resultSet.rows.length > 0) {
      return resultSet.rows[0].count as number;
    } else {
      return 0;
    }
  }

  export async function getComments(id: string): Promise<PgComment[]> {
    const client = await pool.connect();
    const resultSet = await client.query(
      'SELECT * from "comments" where "imageId" = $1 ',
      [id]
    );
    return resultSet.rows as PgComment[];
  }

}
