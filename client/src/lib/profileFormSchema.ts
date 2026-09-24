import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name!"),
  lastName: z.string().trim().min(1, "Please enter your last name!"),
  currentPassword: z
    .string()
    // .min(8, { message: "Please enter your current password of length 8 or more!" })
    .optional(),
  password: z
    .string()
    //   .min(8, { message: "Please enter password of length 8 or more!" })
    .optional(),
  confirmPassword: z
    .string()
    // .min(8, { message: "Please enter password of length 8 or more!" })
    .optional(),
  phone: z.string().min(10, { message: "Please enter a valid phone number!" }).optional(),
  dob: z.string().min(10, { message: "Please enter a valid date of birth!" }).optional(),
  bio: z.string().min(1, { message: "Please enter a valid bio for your profile!" }).optional(),
  //   secondEmail: z.email({ error: "Please enter valid email address!" }).optional(),
  profilePicUrl: z.string().url().max(2048).or(z.literal(""))
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
