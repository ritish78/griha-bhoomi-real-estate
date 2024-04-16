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
