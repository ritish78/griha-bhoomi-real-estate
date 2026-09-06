"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_redis_1 = __importDefault(require("connect-redis"));
const helmet_1 = __importDefault(require("helmet"));
const redis_1 = __importDefault(require("./db/redis"));
const config_1 = require("./config");
//import for routes
const auth_1 = __importDefault(require("./routes/api/auth"));
const property_1 = __importDefault(require("./routes/api/property"));
const user_1 = __importDefault(require("./routes/api/user"));
const app = (0, express_1.default)();
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = __importDefault(require("./middleware/rateLimiter"));
//Database imports and connect to it
// import { connectToPostgresDB } from "./db";
// connectToPostgresDB();
redis_1.default.connect();
app.use((0, helmet_1.default)());
app.disable("X-Powered-By");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use((0, express_session_1.default)({
    store: new connect_redis_1.default({ client: redis_1.default }),
    secret: config_1.REDIS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 86400 * 1000, //24 hours and in milliseconds
        httpOnly: false,
        secure: process.env.NODE_ENV === "production"
    }
}));
app.use(rateLimiter_1.default);
app.get("/api/v1/ping", (req, res) => {
    return res.status(200).json({ message: "pong" });
});
app.use("/api/v1/auth", auth_1.default);
app.use("/api/v1/property", property_1.default);
app.use("/api/v1/user", user_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
