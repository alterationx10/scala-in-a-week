/**
 * A model of the fields on our postgresql comments table
 */
interface PgComment {
    id?: number;
    imageId?: string;
    comment?: string;
}