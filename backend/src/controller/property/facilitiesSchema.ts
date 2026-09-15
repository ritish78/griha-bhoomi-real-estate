import { z } from "zod";
import { BadRequestError } from "src/utils/error";
import { FACILITIES, FacilityPropertyType, isFacilityAllowed } from "src/types/facilities";

export const facilitiesSchema = z
  .array(z.string())
  .max(FACILITIES.length)
  .refine((ids) => new Set(ids).size === ids.length, "Duplicate facilities are not allowed.")
  .refine(
    (ids) => ids.every((id) => FACILITIES.some((facility) => facility.id === id)),
    "One or more facilities are not recognized."
  );

export function parseFacilities(value: unknown, propertyType: FacilityPropertyType): string[] {
  const result = facilitiesSchema.safeParse(value === undefined ? [] : value);

  if (!result.success) {
    throw new BadRequestError("Please select valid facilities without duplicates.");
  }

  const incompatible = result.data.filter((id) => !isFacilityAllowed(id, propertyType));

  if (incompatible.length > 0) {
    throw new BadRequestError(
      `Some selected facilities do not apply to ${propertyType.toLowerCase()} listings.`
    );
  }

  return result.data;
}
