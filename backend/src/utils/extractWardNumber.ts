import { NominatimAddress } from "src/types/address";

export function extractWardNumber(address: NominatimAddress): number | null {
  const candidates = [address.city_district, address.suburb, address.quarter, address.neighbourhood];

  for (const candidate of candidates) {
    if (!candidate) continue;

    //"Ward 7", "Ward No. 7"
    const wardMatch = candidate.match(/ward(?:\s+no\.?)?\s*(\d+)/i);

    if (wardMatch?.[1]) {
      return Number(wardMatch[1]);
    }

    const dashMatch = candidate.match(/-(\d+)$/);

    if (dashMatch?.[1]) {
      return Number(dashMatch[1]);
    }
  }

  return null;
}
