"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROPERTY_COUNT_LIMIT_PER_PAGE = exports.MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE = exports.MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE = exports.WINDOW_SIZE_IN_SECONDS = exports.JWT_ACCESS_TOKEN = exports.JWT_REFRESH_TOKEN = exports.JWT_SECRET = exports.REDIS_MAX_CONNECTION_DELAY_IN_MS = exports.REDIS_MIN_CONNECTION_DELAY_IN_MS = exports.REDIS_MAX_CONNECTION_RETRY = exports.REDIS_SECRET = exports.REDIS_PORT = exports.REDIS_HOST = exports.REDIS_URL = exports.NUMBER_OF_SALT_ROUNDS = exports.POSTGRES_CONN_TIMEOUT_IN_MS = exports.POSTGRES_IDLE_TIMEOUT_IN_MS = exports.POSTGRES_POOL_MAX_SIZE = exports.POSTGRES_USER = exports.POSTGRES_PASSWORD = exports.POSTGRES_DATABASE = exports.POSTGRES_PORT = exports.POSTGRES_HOST = exports.POSTGRES_URL = exports.EXPRESS_SERVER_PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Express Config
exports.EXPRESS_SERVER_PORT = process.env.EXPRESS_SERVER_PORT || 5000;
//Postgres Config
exports.POSTGRES_URL = process.env.POSTGRES_URL;
exports.POSTGRES_HOST = process.env.POSTGRES_HOST;
exports.POSTGRES_PORT = Number(process.env.POSTGRES_PORT);
exports.POSTGRES_DATABASE = process.env.POSTGRES_DATABASE;
exports.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
exports.POSTGRES_USER = process.env.POSTGRES_USER;
exports.POSTGRES_POOL_MAX_SIZE = Number(process.env.POSTGRES_POOL_MAX_SIZE);
exports.POSTGRES_IDLE_TIMEOUT_IN_MS = Number(process.env.POSTGRES_IDLE_TIMEOUT_IN_MS);
exports.POSTGRES_CONN_TIMEOUT_IN_MS = Number(process.env.POSTGRES_CONN_TIMEOUT_IN_MS);
//Salt Rounds
exports.NUMBER_OF_SALT_ROUNDS = 10;
//Redis Config
exports.REDIS_URL = process.env.REDIS_URL;
exports.REDIS_HOST = process.env.REDIS_HOST;
exports.REDIS_PORT = Number(process.env.REDIS_PORT);
exports.REDIS_SECRET = process.env.REDIS_SECRET || "";
exports.REDIS_MAX_CONNECTION_RETRY = Number(process.env.REDIS_MAX_CONNECTION_RETRY);
exports.REDIS_MIN_CONNECTION_DELAY_IN_MS = Number(process.env.REDIS_MIN_CONNECTION_DELAY_IN_MS);
exports.REDIS_MAX_CONNECTION_DELAY_IN_MS = Number(process.env.REDIS_MAX_CONNECTION_DELAY_IN_MS);
//JWT Secrets
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
exports.JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
//Rate Limit varaibles
exports.WINDOW_SIZE_IN_SECONDS = Number(process.env.WINDOW_SIZE_IN_SECONDS);
exports.MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE = Number(process.env.MAX_NUMBER_OF_REQUESTS_AUTH_USER_PER_WINDOW_SIZE);
exports.MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE = Number(process.env.MAX_NUMBER_OF_REQUESTS_NOT_LOGGEDIN_USER_PER_WINDOW_SIZE);
//Pagination
exports.PROPERTY_COUNT_LIMIT_PER_PAGE = Number(process.env.PROPERTY_COUNT_LIMIT_PER_PAGE);
