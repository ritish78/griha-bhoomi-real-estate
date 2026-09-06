"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        firstName: zod_1.z.string().min(1, { message: "Please enter your first name!" }),
        lastName: zod_1.z.string().min(1, { message: "Please enter your last name!" }),
        email: zod_1.z
            .string()
            .min(1, { message: "Please enter email address!" })
            .email("Please enter valid email address!"),
        password: zod_1.z.string().min(8, { message: "Please enter password of length 8 or more!" }),
        confirmPassword: zod_1.z.string().min(8, { message: "Please enter password of length 8 or more!" }),
        phone: zod_1.z.string().min(10, { message: "Please enter a valid phone number!" }),
        dob: zod_1.z.string().min(10, { message: "Please enter a valid date of birth!" })
    })
        .strict()
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        email: zod_1.z
            .string()
            .min(1, { message: "Please enter email address!" })
            .email("Please enter valid email address!"),
        password: zod_1.z.string().min(8, { message: "Please enter password of length 8 or more!" })
    })
        .strict()
});
