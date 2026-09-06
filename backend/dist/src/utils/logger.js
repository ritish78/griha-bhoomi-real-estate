"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
//We need to import chalk from chalk@4.1.2
//https://github.com/chalk/chalk/issues/612
const chalk_1 = __importDefault(require("chalk"));
class Logger {
    constructor() {
        //Creates a log file `error.log` in `logs` folder where we store logs
        //if any error in the app arises, we can view the logs
        this.errorLogger = (0, winston_1.createLogger)({
            level: "error",
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            transports: [new winston_1.transports.File({ filename: "logs/error.log", level: "error" })]
        });
        //Creates a log file `debug.log` in `logs` folder where we store logs
        //if any debug info that we log in the app for debugging purpose,
        //the debug info will be written in that file
        this.debugLogger = (0, winston_1.createLogger)({
            level: "debug",
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            transports: [new winston_1.transports.File({ filename: "logs/debug.log", level: "error" })]
        });
        //Creates a log file `info.log` in `logs` folder where we store logs
        //if any info that we might need like user created account or something
        //that we might need to reference it later, we store it in this file
        this.infoLogger = (0, winston_1.createLogger)({
            level: "info",
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            transports: [new winston_1.transports.File({ filename: "logs/info.log", level: "info" })]
        });
        //Creates a log file `notfound.log` in `logs` folder wher we store logs
        //if any user visits a notfound page which returns in 404, we will store
        //the url and user info in this file. Will be helpful in identifying bots
        //and also track user experience in the frontend application
        this.notFoundLogger = (0, winston_1.createLogger)({
            level: "notfound",
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.json()),
            transports: [new winston_1.transports.File({ filename: "logs/notfound.log", level: "notfound" })]
        });
    }
    error(message, data, printData) {
        if (process.env.NODE_ENV === "test")
            return;
        this.errorLogger.error(message, printData && data);
        chalkPrint("error", message, printData && data);
    }
    debug(message, data, printData) {
        if (process.env.NODE_ENV === "test")
            return;
        this.debugLogger.debug(message, printData && data);
        chalkPrint("debug", message, printData && data);
    }
    info(message, data, printData) {
        if (process.env.NODE_ENV === "test")
            return;
        this.infoLogger.info(message, printData && data);
        chalkPrint("info", message, printData && data);
    }
    notFound(message, data, printData) {
        if (process.env.NODE_ENV === "test")
            return;
        this.notFoundLogger.warn(message, printData && data);
        chalkPrint("notfound", message, printData && data);
    }
}
function chalkPrint(level, message, data) {
    let tagLevel = "";
    if (level === "error")
        tagLevel = `[${chalk_1.default.red.bold("ERROR")}]`;
    if (level === "debug")
        tagLevel = `[${chalk_1.default.green.bold("DEBUG")}]`;
    if (level === "info")
        tagLevel = `[${chalk_1.default.cyan.bold("INFO")}]`;
    if (level === "notfound")
        tagLevel = `[${chalk_1.default.magenta.bold("INFO-NOTFOUND")}]`;
    const formattedDate = chalk_1.default.white(new Date().toISOString());
    const formattedData = data ? `${chalk_1.default.white(data)}` : "";
    console.log(`${tagLevel}`, formattedDate, message, formattedData);
}
exports.default = new Logger();
