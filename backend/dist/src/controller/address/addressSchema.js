"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newAddressSchema = void 0;
const zod_1 = require("zod");
exports.newAddressSchema = zod_1.z
    .object({
    body: zod_1.z.object({
        houseNumber: zod_1.z.string().min(1, { message: "Please add house number!" }),
        street: zod_1.z.string().min(1, { message: "Please enter your street!" }),
        wardNumber: zod_1.z.number().nonnegative(),
        municipality: zod_1.z.string().min(1, { message: "Please enter municipality name!" }),
        city: zod_1.z.string().min(1, { message: "Please enter city name!" }),
        district: zod_1.z.string().min(1, { message: "Please enter district name!" }),
        province: zod_1.z.string().min(1, { message: "Please enter province name!" }),
        latitude: zod_1.z.number().optional(),
        longitude: zod_1.z.number().optional()
    })
})
    .refine((data) => Object.values(data).some((field) => field !== undefined), {
    message: "Please provide atleast one field to update!",
    path: ["landType, area, length, breadth, connectedToRoad, distanceToRoad"]
});
