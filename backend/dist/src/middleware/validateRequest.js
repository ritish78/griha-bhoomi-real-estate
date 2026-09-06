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
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasLandFields = exports.hasHouseFields = exports.validatePropertySchema = exports.validateRequest = void 0;
const houseSchema_1 = require("src/controller/property/houseSchema");
const landSchema_1 = require("src/controller/property/landSchema");
const error_1 = require("src/utils/error");
const zod_1 = require("zod");
/**
 * @param schema  Schema Object to compare against ZodSchema
 * @param req     Request object from express
 * @param res     Response object from express
 * @param next    Next middleware function from express
 * @returns       Response object from express || calls next middleware function
 */
const validateRequest = (schema) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    }
    catch (error) {
        //Example of ZodError when min() is not satisfied for firstName
        /**
         * [
              {
                  code: "too_small",
                  message: "Please enter your first name!",
                  path: ["firstName"],
                  minimum: 1,
                  type: "string",
                  inclusive: true,
                  received: 0
              }
          ];
         */
        if (error instanceof zod_1.ZodError) {
            console.log(error);
            //We return error of status code 422 - Unprocessable Content
            //We map throught the error object to get the path and set it as field
            //message is what we have set as error message in our ZodSchema
            //Used https://github.com/colinhacks/zod/discussions/3217 as reference
            return res
                .status(422)
                .send({ errors: error.issues.map((error) => ({ field: error.path[1], message: error.message })) });
            //Example of response from above return statement
            // {
            //   "errors": [
            //     {
            //       "field": "lastName",
            //       "message": "Please enter your last name!"
            //     },
            //     {
            //       "field": "password",
            //       "message": "Please enter password of length 8 or more!"
            //     }
            //   ];
            // }
        }
        //If the error occurred isn't from Zod's parse
        next(error);
    }
});
exports.validateRequest = validateRequest;
const validatePropertySchema = (data, type) => {
    // let schema: AnyZodObject;
    let schema;
    switch (type) {
        case "HOUSE":
            schema = houseSchema_1.newHouseSchema;
            break;
        case "LAND":
            schema = landSchema_1.newLandSchema;
            break;
        default:
            throw new error_1.BadRequestError(`Invalid Property type: ${type}`);
    }
    schema.parse(data);
};
exports.validatePropertySchema = validatePropertySchema;
const hasHouseFields = (data) => {
    try {
        houseSchema_1.updateHouseSchema.parse(data);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.hasHouseFields = hasHouseFields;
const hasLandFields = (data) => {
    try {
        landSchema_1.updateLandSchema.parse(data);
        return true;
    }
    catch (error) {
        return false;
    }
};
exports.hasLandFields = hasLandFields;
