import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      firstName: z.string().trim().min(1, { message: "Please enter your first name!" }),
      lastName: z.string().trim().min(1, { message: "Please enter your last name!" }),
      email: z
        .email({ error: "Please enter valid email address!" })
        .trim()
        .toLowerCase()
        .min(1, { message: "Please enter email address!" }),
      password: z.string().min(8, { message: "Please enter password of length 8 or more!" }),
      confirmPassword: z.string().min(8, { message: "Please enter password of length 8 or more!" }),
      phone: z.string().min(10, { message: "Please enter a valid phone number!" }),
      dob: z.string().min(10, { message: "Please enter a valid date of birth!" })
    })
    .strict()
});

export const loginSchema = z.object({
  body: z
    .object({
      email: z
        .email({ error: "Please enter valid email address!" })
        .trim()
        .toLowerCase()
        .min(1, { message: "Please enter email address!" }),
      password: z.string().min(8, { message: "Please enter password of length 8 or more!" })
    })
    .strict()
});
