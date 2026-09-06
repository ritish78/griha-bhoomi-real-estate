"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./server"));
const config_1 = require("./config");
const logger_1 = __importDefault(require("./utils/logger"));
server_1.default.listen(config_1.EXPRESS_SERVER_PORT, () => {
    logger_1.default.info(`Server running on port ${config_1.EXPRESS_SERVER_PORT}`);
});
