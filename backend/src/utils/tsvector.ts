// import { sql } from "drizzle-orm";
import { customType } from "drizzle-orm/pg-core";

/**
 * To use the Full Text Search provided by PostgreSQL, we had to run this command
 * after generating and pushing migration:
 * `ALTER TABLE property ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || description || ' ' || close_landmark || ' ' || address)) STORED;`
 * To fix it, this custom type was created to use it while creating the schema of table itself
 * but we can't make it to work as Drizzle generates it with double quotes for the below SQL command
 * And using `sql` to generate it as SQL does not work as dataType needs to return a string
 * So, look at the issue in this github repo in the future to see if it is fixed
 * https://github.com/drizzle-team/drizzle-orm/issues/247
 */

export const tsvector = customType<{ data: string; config: { sources: string[] } }>({
  dataType(config) {
    if (config) {
      const sources = config.sources.join(" || ' ' || ");
      //   return sql`tsvector generated always as (to_tsvector('english', ${sources})) stored`;
      return `tsvector generated always as (to_tsvector('english', ${sources})) stored`;
    } else {
      //   return sql`tsvector`;
      return `tsvector`;
    }
  }
});
