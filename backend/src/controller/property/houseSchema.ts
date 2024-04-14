import { z } from "zod";
import { HouseType } from "src/model/house";

const ZodHouseTypeEnum = z.enum(HouseType.enumValues);
export type HouseTypeEnum = z.infer<typeof ZodHouseTypeEnum>;

export const newHouseSchema = z
  .object({
    type: ZodHouseTypeEnum,
    floorCount: z.number().nonnegative(),
    kitchenCount: z.number().nonnegative(),
    roomCount: z.number().nonnegative(),
    bathroomCount: z.number().nonnegative(),
    toiletCount: z.number().nonnegative(),
    sharedToilet: z.boolean(),
    facilities: z.array(z.string()),
    area: z.number().nonnegative(),
    furnished: z.boolean(),
    facing: z.string().optional(),
    carParking: z.number().nonnegative(),
    bikeParking: z.number().nonnegative(),
    evCharging: z.boolean(),
    builtAt: z.string().datetime(),
    connectedToRoad: z.boolean(),
    distanceToRoad: z.number().nonnegative()
  })
  .strict();
