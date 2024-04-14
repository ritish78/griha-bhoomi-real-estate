import { z } from "zod";
import { PropertyStatus, PropertyType } from "src/model/property";

const ZodPropertyTypeEnum = z.enum(PropertyType.enumValues);
export type PropertyTypeEnum = z.infer<typeof ZodPropertyTypeEnum>;

const ZodPropertyStatusEnum = z.enum(PropertyStatus.enumValues);
export type PropertyStatusEnum = z.infer<typeof ZodPropertyStatusEnum>;

export const newPropertySchema = z.object({
  body: z.object({
    title: z.string().min(1, { message: "Please enter title to set for the property!" }),
    description: z.string().min(1, { message: "Please describe your property in atleast few words!" }),
    toRent: z.boolean(),
    address: z.string().min(1, { message: "Please enter address of the property!" }),
    closeLandmark: z.string().min(1, { message: "Please add nearest landmark name!" }),
    propertyType: ZodPropertyTypeEnum,
    availableFrom: z.string().datetime(),
    availableTill: z.string().datetime(),
    price: z.number().gte(1),
    negotiable: z.boolean(),
    imageUrl: z.array(z.string()).nonempty(),
    status: ZodPropertyStatusEnum
  })
});

// export const newPropertySchema = z.object({
//   body: z
//     .object({
//       title: z.string().min(1, { message: "Please enter title to set for the property!" }),
//       description: z.string().min(1, { message: "Please describe your property in atleast few words!" }),
//       toRent: z.boolean(),
//       address: z.string().min(1, { message: "Please enter address of the property!" }),
//       closeLandmark: z.string().min(1, { message: "Please add nearest landmark name!" }),
//       propertyType: z.string().min(1, { message: "Please provide the property type!" }),
//       availableFrom: z.string().datetime(),
//       availableTill: z.string().datetime(),
//       price: z.number().gte(1),
//       negotiable: z.boolean(),
//       imageUrl: z.array(z.string()).nonempty(),
//       status: z.string().min(1, { message: "Please enter valid status of property!" }),
//       expiresOn: z.string().datetime()
//     })
//     .strict()
// });

export const updatePropertySchema = z.object({
  body: z
    .object({
      title: z.string().min(1, { message: "Please enter title to set for the property!" }).optional(),
      description: z
        .string()
        .min(1, { message: "Please describe your property in atleast few words!" })
        .optional(),
      toRent: z.boolean().optional(),
      address: z.string().min(1, { message: "Please enter address of the property!" }).optional(),
      closeLandmark: z.string().min(1, { message: "Please add nearest landmark name!" }).optional(),
      propertyType: z.string().min(1, { message: "Please provide the property type!" }).optional(),
      availableFrom: z.string().datetime().optional(),
      availableTill: z.string().datetime().optional(),
      price: z.number().gte(1).optional(),
      negotiable: z.boolean().optional(),
      imageUrl: z.array(z.string()).nonempty().optional(),
      status: z.string().min(1, { message: "Please enter valid status of property!" }).optional(),
      expiresOn: z.string().datetime().optional()
    })
    .strict()
});
