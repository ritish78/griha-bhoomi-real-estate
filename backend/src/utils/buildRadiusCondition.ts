import { sql } from "drizzle-orm";
import { address } from "src/model/address";
import { BadRequestError } from "src/utils/error";

export function buildRadiusCondition(filters: Record<string, unknown>) {
  const keys = ["latitude", "longitude", "radius"] as const;

  const hasLocationFilter = keys.some((key) => filters[key] !== undefined);

  if (!hasLocationFilter) return undefined;

  function readNumber(key: (typeof keys)[number]) {
    const value = filters[key];

    if (typeof value !== "string" || value.trim() === "" || !Number.isFinite(Number(value))) {
      throw new BadRequestError("Location search requires valid latitude, longitude and radius.");
    }

    return Number(value);
  }

  const latitude = readNumber("latitude");
  const longitude = readNumber("longitude");
  const radiusKm = readNumber("radius");

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    throw new BadRequestError("Invalid search coordinates.");
  }

  if (radiusKm <= 0 || radiusKm > 50) {
    throw new BadRequestError("Search radius must be greater than 0 and at most 50 km.");
  }

  return sql<boolean>`
    ST_DWithin(
      CASE
        WHEN ${address.latitude} BETWEEN -90 AND 90
         AND ${address.longitude} BETWEEN -180 AND 180
        THEN ST_SetSRID(
          ST_MakePoint(
            ${address.longitude},
            ${address.latitude}
          ),
          4326
        )::geography
        ELSE NULL::geography
      END,
      ST_SetSRID(
        ST_MakePoint(${longitude}, ${latitude}),
        4326
      )::geography,
      ${radiusKm * 1000}
    )
  `;
}
