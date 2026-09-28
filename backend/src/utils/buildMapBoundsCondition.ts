import { and, gte, lte } from "drizzle-orm";

import { address } from "src/model/address";
import { BadRequestError } from "src/utils/error";

export function buildMapBoundsCondition(filters: Record<string, unknown>) {
  const keys = ["minlatitude", "maxlatitude", "minlongitude", "maxlongitude"] as const;

  //If the user has not searched a map area, we do not add a bounds condition.
  const hasMapBounds = keys.some((key) => filters[key] !== undefined);

  if (!hasMapBounds) {
    return undefined;
  }

  function readNumber(key: (typeof keys)[number]) {
    const value = filters[key];

    if (typeof value !== "string" || value.trim() === "" || !Number.isFinite(Number(value))) {
      throw new BadRequestError("Please select a valid area on the map.");
    }

    return Number(value);
  }

  const minLatitude = readNumber("minlatitude");
  const maxLatitude = readNumber("maxlatitude");
  const minLongitude = readNumber("minlongitude");
  const maxLongitude = readNumber("maxlongitude");

  if (
    minLatitude < -90 ||
    maxLatitude > 90 ||
    minLongitude < -180 ||
    maxLongitude > 180 ||
    minLatitude >= maxLatitude ||
    minLongitude >= maxLongitude
  ) {
    throw new BadRequestError("Please select a valid area on the map.");
  }

  //Both the property cards and map markers use this condition.
  return and(
    gte(address.latitude, minLatitude),
    lte(address.latitude, maxLatitude),
    gte(address.longitude, minLongitude),
    lte(address.longitude, maxLongitude)
  );
}
