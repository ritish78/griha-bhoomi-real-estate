"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropertySchema = exports.newPropertySchema = void 0;
const zod_1 = require("zod");
const property_1 = require("src/model/property");
const ZodPropertyTypeEnum = zod_1.z.enum(property_1.PropertyType.enumValues);
const ZodPropertyStatusEnum = zod_1.z.enum(property_1.PropertyStatus.enumValues);
exports.newPropertySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: "Please enter title to set for the property!" }),
        description: zod_1.z.string().min(1, { message: "Please describe your property in atleast few words!" }),
        toRent: zod_1.z.boolean(),
        closeLandmark: zod_1.z.string().min(1, { message: "Please add nearest landmark name!" }),
        propertyType: ZodPropertyTypeEnum,
        availableFrom: zod_1.z.string().datetime(),
        availableTill: zod_1.z.string().datetime(),
        price: zod_1.z.number().gte(1),
        negotiable: zod_1.z.boolean(),
        imageUrl: zod_1.z.array(zod_1.z.string()).nonempty(),
        status: ZodPropertyStatusEnum
    })
});
exports.updatePropertySchema = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1, { message: "Please enter title to set for the property!" }).optional(),
        description: zod_1.z
            .string()
            .min(1, { message: "Please describe your property in atleast few words!" })
            .optional(),
        toRent: zod_1.z.boolean().optional(),
        address: zod_1.z.string().min(1, { message: "Please enter address of the property!" }).optional(),
        closeLandmark: zod_1.z.string().min(1, { message: "Please add nearest landmark name!" }).optional(),
        propertyType: zod_1.z.string().min(1, { message: "Please provide the property type!" }).optional(),
        availableFrom: zod_1.z.string().datetime().optional(),
        availableTill: zod_1.z.string().datetime().optional(),
        price: zod_1.z.number().gte(1).optional(),
        negotiable: zod_1.z.boolean().optional(),
        imageUrl: zod_1.z.array(zod_1.z.string()).nonempty().optional(),
        status: zod_1.z.string().min(1, { message: "Please enter valid status of property!" }).optional(),
        private: zod_1.z.boolean().optional()
    })
        .refine((data) => Object.values(data).some((field) => field !== undefined), {
        message: "Please provide atleast one field to update!",
        path: [
            "title, description, toRent, address, closeLandmark, propertyType, availableFrom, availableTill, price, negotiable, imageUrl, status, private"
        ]
    })
});
