import { NominatimAddress } from "src/types/address";

export function extractWardNumber(address: NominatimAddress): number | null {
  const candidates = [address.city_district, address.suburb, address.quarter, address.neighbourhood];

  for (const candidate of candidates) {
    if (!candidate) continue;

    const match = candidate.match(/(?:ward(?:\s+no\.?)?\s*)(\d+)/i);

    if (match?.[1]) {
      return Number(match[1]);
    }
  }

  return null;
}
