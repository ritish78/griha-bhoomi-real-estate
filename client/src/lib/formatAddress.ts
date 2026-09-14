import type { Address } from "@/types/property";

export function formatAddress(address: Address): string {
  const clean = (value?: string | null) => (value ?? "").trim().replace(/\s+/g, " ");

  const settlement = (value?: string | null) =>
    clean(value)
      .replace(/\s+(?:(?:sub[ -]?)?metropolitan\s+city|(?:rural\s+)?municipality)$/i, "")
      .trim();

  const locality = clean(address.city) || clean(address.municipality);

  const district = clean(address.district).replace(/\s+district$/i, "");

  const parts = [...locality.split(",").map(settlement), district].filter(Boolean);

  return parts
    .filter(
      (part, index) =>
        parts.findIndex((candidate) => candidate.toLowerCase() === part.toLowerCase()) === index
    )
    .join(", ");
}
