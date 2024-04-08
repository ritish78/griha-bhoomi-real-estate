import { Logger as WinstonLogger, createLogger, transports, format } from "winston";
//We need to import chalk from chalk@4.1.2
//https://github.com/chalk/chalk/issues/612
import chalk from "chalk";

class Logger {
  private errorLogger: WinstonLogger;
  private debugLogger: WinstonLogger;
  private infoLogger: WinstonLogger;

  constructor() {
    this.errorLogger = createLogger({
      level: "error",
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.File({ filename: "logs/error.log", level: "error" })]
    });

    this.debugLogger = createLogger({
      level: "debug",
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.File({ filename: "logs/debug.log", level: "error" })]
    });

    this.infoLogger = createLogger({
      level: "info",
      format: format.combine(format.timestamp(), format.json()),
      transports: [new transports.File({ filename: "logs/info.log", level: "info" })]
    });
  }

  error(message: string, data?: unknown, printData?: boolean) {
    if (process.env.NODE_ENV === "test") return;

    this.errorLogger.error(message, printData && data);
    chalkPrint("error", message, printData && data);
  }

  debug(message: string, data?: unknown, printData?: boolean) {
    if (process.env.NODE_ENV === "test") return;

    this.debugLogger.debug(message, printData && data);
    chalkPrint("debug", message, printData && data);
  }

  info(message: string, data?: unknown, printData?: boolean) {
    if (process.env.NODE_ENV === "test") return;

    this.infoLogger.info(message, printData && data);
    chalkPrint("info", message, printData && data);
  }
}

function chalkPrint(level: string, message: string, data?: unknown) {
  let tagLevel = "";

  if (level === "error") tagLevel = `[${chalk.red.bold("ERROR")}]`;
  if (level === "debug") tagLevel = `[${chalk.green.bold("DEBUG")}]`;
  if (level === "info") tagLevel = `[${chalk.cyan.bold("INFO")}]`;

  const formattedDate = chalk.white(new Date().toISOString());
  const formattedData = data ? `${chalk.white(data)}` : "";

  console.log(`${tagLevel}`, formattedDate, message, formattedData);
}

export default new Logger();
