import { z } from "zod";

export const updateUserSchema = z.object({
  body: z
    .object({
      firstName: z.string().min(1, { message: "Please enter your first name!" }).optional(),
      lastName: z.string().min(1, { message: "Please enter your last name!" }).optional(),
      password: z.string().min(8, { message: "Please enter password of length 8 or more!" }).optional(),
      confirmPassword: z
        .string()
        .min(8, { message: "Please enter password of length 8 or more!" })
        .optional(),
      phone: z.string().min(10, { message: "Please enter a valid phone number!" }).optional(),
      dob: z.string().min(10, { message: "Please enter a valid date of birth!" }).optional(),
      bio: z.string().min(1, { message: "Please enter a valid bio for your profile!" }).optional(),
      secondEmail: z
        .string()
        .min(1, { message: "Please enter email address!" })
        .email("Please enter valid email address!")
        .optional(),
      profilePicUrl: z.string().url().optional()
    })
    .refine((data) => Object.values(data).some((field) => field !== undefined), {
      message: "Please provide atleast one field to update!",
      path: ["firstName, lastName, password, confirmPassword, phone, dob, bio, secondEmail, profilePicUrl"]
    })
});
