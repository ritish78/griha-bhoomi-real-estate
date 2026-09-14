import { NominatimSearchResult } from "src/types/address";

export function isNominatimSearchResult(value: unknown): value is NominatimSearchResult {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.osm_type === "string" &&
    typeof item.osm_id === "number" &&
    typeof item.lat === "string" &&
    typeof item.lon === "string" &&
    typeof item.display_name === "string"
  );
}
