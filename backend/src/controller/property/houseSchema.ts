import { z } from "zod";
import { HouseType } from "src/model/house";

const ZodHouseTypeEnum = z.enum(HouseType.enumValues);
export type HouseTypeEnum = z.infer<typeof ZodHouseTypeEnum>;

export const newHouseSchema = z.object({
  houseType: ZodHouseTypeEnum,
  roomCount: z.number().nonnegative(),
  floorCount: z.number().nonnegative(),
  kitchenCount: z.number().nonnegative(),
  sharedBathroom: z.boolean(),
  bathroomCount: z.number().nonnegative(),
  facilities: z.array(z.string()),
  area: z.string().optional(),
  furnished: z.boolean(),
  facing: z.string().optional(),
  carParking: z.number().nonnegative(),
  bikeParking: z.number().nonnegative(),
  evCharging: z.boolean(),
  builtAt: z.string().datetime(),
  connectedToRoad: z.boolean(),
  distanceToRoad: z.number().nonnegative()
});
