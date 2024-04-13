import { z } from "zod";

export const newPropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Please enter title to set for the property!" }),
    description: z.string().min(1, { message: "Please describe your property in atleast few words!" }),
    toRent: z.boolean(),
    address: z.string().min(1, { message: "Please enter address of the property!" }),
    closeLandmark: z.string().min(1, { message: "Please add nearest landmark name!" }),
    propertyType: z.string().min(1, { message: "Please provide the property type!" }),
    availableFrom: z.string().datetime(),
    availableTill: z.string().datetime(),
    price: z.number().gte(1),
    negotiable: z.boolean(),
    imageUrl: z.array(z.string()).nonempty(),
    status: z.string().min(1, { message: "Please enter valid status of property!" }),
    expiresOn: z.string().datetime()
  })
});
