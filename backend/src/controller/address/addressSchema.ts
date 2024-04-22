import { z } from "zod";

export const newAddressSchema = z
  .object({
    body: z.object({
      houseNumber: z.string().min(1, { message: "Please add house number!" }),
      street: z.string().min(1, { message: "Please enter your street!" }),
      wardNumber: z.number().nonnegative(),
      municipality: z.string().min(1, { message: "Please enter municipality name!" }),
      city: z.string().min(1, { message: "Please enter city name!" }),
      district: z.string().min(1, { message: "Please enter district name!" }),
      province: z.string().min(1, { message: "Please enter province name!" }),
      latitude: z.number().optional(),
      longitude: z.number().optional()
    })
  })
  .refine((data) => Object.values(data).some((field) => field !== undefined), {
    message: "Please provide atleast one field to update!",
    path: ["landType, area, length, breadth, connectedToRoad, distanceToRoad"]
  });
