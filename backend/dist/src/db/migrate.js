"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const migrator_1 = require("drizzle-orm/node-postgres/migrator");
const index_1 = __importDefault(require("./index"));
(function migrateSchema() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("Migration Started!");
            yield (0, migrator_1.migrate)(index_1.default, { migrationsFolder: "drizzle" });
            console.log("Migration Finished!");
        }
        catch (error) {
            console.error("Error occurred during migration", error);
            //We stop the application with exit code 1 if we can't connect to DB
            process.exit(1);
        }
    });
})();
