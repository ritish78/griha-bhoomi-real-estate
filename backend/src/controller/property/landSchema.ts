import { z } from "zod";
import { LandType } from "src/model/land";

const ZodLandTypeEnum = z.enum(LandType.enumValues);
export type LandTypeEnum = z.infer<typeof ZodLandTypeEnum>;

export const newLandSchema = z.object({
  landType: ZodLandTypeEnum,
  area: z.string(),
  length: z.string(),
  breadth: z.string(),
  connectedToRoad: z.boolean(),
  distanceToRoad: z.number().nonnegative()
});

export const updateLandSchema = z
  .object({
    landType: ZodLandTypeEnum.optional(),
    area: z.string().optional(),
    length: z.string().optional(),
    breadth: z.string().optional(),
    connectedToRoad: z.boolean().optional(),
    distanceToRoad: z.number().nonnegative().optional()
  })
  .refine((data) => Object.values(data).some((field) => field !== undefined), {
    message: "Please provide atleast one field to update!",
    path: ["landType, area, length, breadth, connectedToRoad, distanceToRoad"]
  });
