import app from "./server";
import { EXPRESS_SERVER_PORT } from "./config";
import logger from "./utils/logger";

app.listen(EXPRESS_SERVER_PORT, () => {
  logger.info(`Server running on port ${EXPRESS_SERVER_PORT}`);
});
