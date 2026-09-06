"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLandSchema = exports.newLandSchema = void 0;
const zod_1 = require("zod");
const land_1 = require("src/model/land");
const ZodLandTypeEnum = zod_1.z.enum(land_1.LandType.enumValues);
exports.newLandSchema = zod_1.z.object({
    landType: ZodLandTypeEnum,
    area: zod_1.z.string(),
    length: zod_1.z.string(),
    breadth: zod_1.z.string(),
    connectedToRoad: zod_1.z.boolean(),
    distanceToRoad: zod_1.z.number().nonnegative()
});
exports.updateLandSchema = zod_1.z
    .object({
    landType: ZodLandTypeEnum.optional(),
    area: zod_1.z.string().optional(),
    length: zod_1.z.string().optional(),
    breadth: zod_1.z.string().optional(),
    connectedToRoad: zod_1.z.boolean().optional(),
    distanceToRoad: zod_1.z.number().nonnegative().optional()
})
    .refine((data) => Object.values(data).some((field) => field !== undefined), {
    message: "Please provide atleast one field to update!",
    path: ["landType, area, length, breadth, connectedToRoad, distanceToRoad"]
});
