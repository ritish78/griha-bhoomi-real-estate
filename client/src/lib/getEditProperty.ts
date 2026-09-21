import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";
import { propertyFormSchema, PropertyFormValues } from "./propertyFormSchema";
import { parsePropertyDimension } from "./propertyDimension";

const responseSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1),
  values: z.record(z.unknown())
});

export type EditPropertyResult =
  | {
      success: true;
      property: {
        id: string;
        slug: string;
        initialValues: Partial<PropertyFormValues>;
      };
    }
  | {
      success: false;
      status: number;
      error: string;
    };

function toFormValues(values: Record<string, unknown>): Partial<PropertyFormValues> {
  const normalized: Record<string, unknown> = {};

  // Optional database fields can be null.
  for (const [key, value] of Object.entries(values)) {
    normalized[key] =
      value === null && key !== "latitude" && key !== "longitude" ? undefined : value;
  }

  for (const key of ["availableFrom", "availableTill", "builtAt"]) {
    const value = values[key];

    normalized[key] = typeof value === "string" && value ? new Date(value) : undefined;
  }

  const area = typeof values.area === "string" ? values.area.trim() : "";

  const match = area.match(/^(\d+(?:\.\d+)?)\s+(sq[\s-]ft|sq[\s-]m|aana|dhur|kattha|bigha)$/i);

  if (!match) {
    throw new Error("The saved area must contain an amount and a supported unit.");
  }

  normalized.area = match[1];
  normalized.areaUnit = match[2]?.toLowerCase().replace(/\s+/g, "-");

  //Length and breadth now include their units in the database.
  //Older amounts without units are treated as feet.
  if (values.propertyType === "Land") {
    const length = parsePropertyDimension(values.length);
    const breadth = parsePropertyDimension(values.breadth);

    normalized.length = length.amount;
    normalized.lengthUnit = length.unit;

    normalized.breadth = breadth.amount;
    normalized.breadthUnit = breadth.unit;
  }

  // Validate known values instead of silently replacing invalid data.
  return propertyFormSchema.partial().parse(normalized);
}

export async function getEditProperty(slug: string): Promise<EditPropertyResult> {
  try {
    const cookieStore = await cookies();

    const response = await fetch(
      `http://localhost:5000/api/v1/property/edit/${encodeURIComponent(slug)}`,
      {
        headers: {
          Cookie: cookieStore.toString()
        },
        cache: "no-store"
      }
    );

    if (!response.ok) {
      return {
        success: false,
        status: response.status,
        error:
          response.status === 403
            ? "Only the listing owner or an admin can edit this property."
            : "Could not load this property for editing."
      };
    }

    const body: unknown = await response.json();
    const parsed = responseSchema.parse(body);

    return {
      success: true,
      property: {
        id: parsed.id,
        slug: parsed.slug,
        initialValues: toFormValues(parsed.values)
      }
    };
  } catch (error) {
    console.error("Could not load edit property:", error);

    return {
      success: false,
      status: 500,
      error: "The listing could not be loaded. Its saved data may need attention."
    };
  }
}
