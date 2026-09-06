"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const error_1 = require("src/utils/error");
const logger_1 = __importDefault(require("src/utils/logger"));
const zod_1 = require("zod");
/**
 * @param error   Error of type unknown - Could be our Error that we extended from GenericError class
 * @param req     Request object from express
 * @param res     Response object from express
 * @param next    Next middleware function from express
 * @returns       next() || redirect || json containing error
 */
const errorHandler = (error, req, res, next) => {
    //If there is header, we ignore and go to next middleware
    //Why? Once the headers are sent, we cannot modify them or send them again
    if (res.headersSent) {
        return next();
    }
    console.log(error);
    //If the error is of class that we created in `/utils/error.ts` then
    //we can utilize its status code and error message
    if (error instanceof error_1.GenericError) {
        logger_1.default.error(`[${error.statusCode}] - ${error.name} (${new Date().toISOString()})`, {
            error: error.message,
            stack: error.stack
        });
        // if (error instanceof AuthError) {
        //   return res.redirect("/login");
        // }
        //Logging if the User visits a page which returns 404
        //Some bots or real users visit page which can be logged
        //to view the metrics of what page they want to visit
        if (error instanceof error_1.NotFoundError) {
            logger_1.default.notFound(`${error.name} (${new Date().toISOString()})`, {
                error: error.message,
                stack: error.stack,
                cause: error.cause
            });
        }
        return res.status(error.statusCode).send({
            message: error.message,
            stack: process.env.NODE_ENV === "production" ? error.name : error.name
        });
    }
    if (error instanceof zod_1.ZodError) {
        return res.status(422).send({
            errors: error.issues.map((error) => ({
                field: error.path[0],
                message: error.message
            }))
        });
    }
    //If the error is something else that we don't know of
    //we send error of status code 500
    logger_1.default.error(`[Unknown Error]`, error);
    return res.status(500).send({
        message: "Internal Server Error!",
        stack: process.env.NODE_ENV === "production" ? "ServerError" : error
    });
};
exports.errorHandler = errorHandler;
