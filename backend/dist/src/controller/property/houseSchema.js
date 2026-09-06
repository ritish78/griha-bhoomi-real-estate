"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateHouseSchema = exports.newHouseSchema = void 0;
const zod_1 = require("zod");
const house_1 = require("src/model/house");
const ZodHouseTypeEnum = zod_1.z.enum(house_1.HouseType.enumValues);
exports.newHouseSchema = zod_1.z.object({
    houseType: ZodHouseTypeEnum,
    roomCount: zod_1.z.number().nonnegative(),
    floorCount: zod_1.z.number().nonnegative(),
    kitchenCount: zod_1.z.number().nonnegative(),
    sharedBathroom: zod_1.z.boolean(),
    bathroomCount: zod_1.z.number().nonnegative(),
    facilities: zod_1.z.array(zod_1.z.string()),
    area: zod_1.z.string().optional(),
    furnished: zod_1.z.boolean(),
    facing: zod_1.z.string().optional(),
    carParking: zod_1.z.number().nonnegative(),
    bikeParking: zod_1.z.number().nonnegative(),
    evCharging: zod_1.z.boolean(),
    builtAt: zod_1.z.string().datetime(),
    connectedToRoad: zod_1.z.boolean(),
    distanceToRoad: zod_1.z.number().nonnegative()
});
exports.updateHouseSchema = zod_1.z
    .object({
    houseType: ZodHouseTypeEnum.optional(),
    roomCount: zod_1.z.number().nonnegative().optional(),
    floorCount: zod_1.z.number().nonnegative().optional(),
    kitchenCount: zod_1.z.number().nonnegative().optional(),
    sharedBathroom: zod_1.z.boolean().optional(),
    bathroomCount: zod_1.z.number().nonnegative().optional(),
    facilities: zod_1.z.array(zod_1.z.string()).optional(),
    area: zod_1.z.string().optional().optional(),
    furnished: zod_1.z.boolean().optional(),
    facing: zod_1.z.string().optional().optional(),
    carParking: zod_1.z.number().nonnegative().optional(),
    bikeParking: zod_1.z.number().nonnegative().optional(),
    evCharging: zod_1.z.boolean().optional(),
    builtAt: zod_1.z.string().datetime().optional(),
    connectedToRoad: zod_1.z.boolean().optional(),
    distanceToRoad: zod_1.z.number().nonnegative().optional()
})
    .refine((data) => Object.values(data).some((field) => field !== undefined), {
    message: "Please provide atleast one field to update!",
    path: [
        "houseType, roomCount, floorCount, kitchenCount, sharedbathroom, bathroomCount, facilites, area, furnished, facing, carParking, bikeParking, evCharging, builtAt, connectedToRoad, distanceToRoad"
    ]
});
