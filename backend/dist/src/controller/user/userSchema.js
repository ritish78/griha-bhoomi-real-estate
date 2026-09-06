"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z.string().min(1, { message: "Please enter your first name!" }).optional(),
        lastName: zod_1.z.string().min(1, { message: "Please enter your last name!" }).optional(),
        password: zod_1.z.string().min(8, { message: "Please enter password of length 8 or more!" }).optional(),
        confirmPassword: zod_1.z
            .string()
            .min(8, { message: "Please enter password of length 8 or more!" })
            .optional(),
        phone: zod_1.z.string().min(10, { message: "Please enter a valid phone number!" }).optional(),
        dob: zod_1.z.string().min(10, { message: "Please enter a valid date of birth!" }).optional(),
        bio: zod_1.z.string().min(1, { message: "Please enter a valid bio for your profile!" }).optional(),
        secondEmail: zod_1.z
            .string()
            .min(1, { message: "Please enter email address!" })
            .email("Please enter valid email address!")
            .optional(),
        profilePicUrl: zod_1.z.string().url().optional()
    })
        .refine((data) => Object.values(data).some((field) => field !== undefined), {
        message: "Please provide atleast one field to update!",
        path: ["firstName, lastName, password, confirmPassword, phone, dob, bio, secondEmail, profilePicUrl"]
    })
});
