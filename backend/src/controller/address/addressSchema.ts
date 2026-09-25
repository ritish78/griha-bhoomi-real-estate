import { z } from "zod";

export const newAddressSchema = z.object({
  body: z.object({
    houseNumber: z.string().optional(),
    street: z.string().min(1, { message: "Please enter your street!" }),
    wardNumber: z.number().nonnegative(),
    municipality: z.string().min(1, { message: "Please enter municipality name!" }),
    city: z.string().min(1, { message: "Please enter city name!" }),
    district: z.string().min(1, { message: "Please enter district name!" }),
    province: z.string().min(1, { message: "Please enter province name!" }),
    latitude: z.number().min(-90).max(180),
    longitude: z.number().min(-90).max(180)
  })
});

//Keep the address field rules in one place. Omitted fields are preserved;
//empty optional text and a null coordinate pair explicitly clear saved values.
export const updateAddressSchema = z.object({
  body: newAddressSchema.shape.body
    .partial()
    .refine(
      ({ latitude, longitude }) =>
        (latitude === undefined && longitude === undefined) ||
        (latitude === null && longitude === null) ||
        (typeof latitude === "number" && typeof longitude === "number"),
      { message: "Provide both latitude and longitude, or clear both.", path: ["latitude"] }
    )
});
