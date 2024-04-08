import { migrate } from "drizzle-orm/node-postgres/migrator";
import db from "./index";

(async function migrateSchema() {
  try {
    console.log("Migration Started!");
    await migrate(db, { migrationsFolder: "drizzle" });
    console.log("Migration Finished!");
  } catch (error) {
    console.error("Error occurred during migration", error);
    //We stop the application with exit code 1 if we can't connect to DB
    process.exit(1);
  }
})();
