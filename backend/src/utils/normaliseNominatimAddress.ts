import type { NominatimAddress } from "../types/address";
import { extractWardNumber } from "./extractWardNumber";

const provinces = ["Koshi", "Madhesh", "Bagmati", "Gandaki", "Lumbini", "Karnali", "Sudurpaschim"];

const firstText = (...values: (string | undefined)[]) =>
  values.map((value) => value?.trim()).find((value) => !!value) ?? null;

function normaliseProvince(...values: (string | undefined)[]): string | null {
  for (const value of values) {
    const name = value
      ?.trim()
      .replace(/\s+province$/i, "")
      .trim()
      .replace(/^bagamati$/i, "Bagmati");
    const province = provinces.find((candidate) => candidate.toLowerCase() === name?.toLowerCase());
    if (province) return province;
  }
  // Do not guess a province or return a value the province select cannot represent.
  return null;
}

export function normaliseNominatimAddress(address: NominatimAddress) {
  const localityParts = [firstText(address.neighbourhood, address.quarter), firstText(address.suburb)].filter(
    (value, index, values): value is string =>
      Boolean(value) &&
      !/\bward\b|[-–]\s*\d+$/i.test(value!) &&
      values.findIndex((candidate) => candidate?.toLowerCase() === value?.toLowerCase()) === index
  );

  const locality = localityParts.join(", ");

  return {
    houseNumber: firstText(address.house_number),
    street: firstText(address.road, address.pedestrian, address.residential),
    city: firstText(
      locality,
      address.hamlet,
      address.village,
      address.town,
      address.city,
      address.municipality
    ),

    municipality: firstText(address.municipality, address.city, address.town, address.village),

    district: firstText(address.county),
    province: normaliseProvince(address.state, address.province),
    wardNumber: extractWardNumber(address)
  };
}
