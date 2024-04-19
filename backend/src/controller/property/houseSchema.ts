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

export const updateHouseSchema = z
  .object({
    houseType: ZodHouseTypeEnum.optional(),
    roomCount: z.number().nonnegative().optional(),
    floorCount: z.number().nonnegative().optional(),
    kitchenCount: z.number().nonnegative().optional(),
    sharedBathroom: z.boolean().optional(),
    bathroomCount: z.number().nonnegative().optional(),
    facilities: z.array(z.string()).optional(),
    area: z.string().optional().optional(),
    furnished: z.boolean().optional(),
    facing: z.string().optional().optional(),
    carParking: z.number().nonnegative().optional(),
    bikeParking: z.number().nonnegative().optional(),
    evCharging: z.boolean().optional(),
    builtAt: z.string().datetime().optional(),
    connectedToRoad: z.boolean().optional(),
    distanceToRoad: z.number().nonnegative().optional()
  })
  .refine((data) => Object.values(data).some((field) => field !== undefined), {
    message: "Please provide atleast one field to update!",
    path: [
      "houseType, roomCount, floorCount, kitchenCount, sharedbathroom, bathroomCount, facilites, area, furnished, facing, carParking, bikeParking, evCharging, builtAt, connectedToRoad, distanceToRoad"
    ]
  });
