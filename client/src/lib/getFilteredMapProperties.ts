import "server-only";

import { z } from "zod";
import type { MapProperty } from "@/types/property";

const mapPropertiesSchema = z.object({
  properties: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      price: z.number(),
      status: z.enum(["Sale", "Rent", "Hold", "Sold"]),
      propertyType: z.enum(["House", "Land"]),
      toRent: z.boolean(),
      negotiable: z
        .boolean()
        .nullable()
        .transform((value) => value ?? false),
      closeLandmark: z
        .string()
        .nullable()
        .transform((value) => value ?? ""),
      imageUrl: z
        .array(z.string())
        .nullable()
        .transform((value) => value ?? []),
      featured: z
        .boolean()
        .nullable()
        .transform((value) => value ?? false),
      street: z
        .string()
        .nullable()
        .transform((value) => value ?? ""),
      municipality: z.string().nullable(),
      city: z.string().nullable(),
      district: z.string().nullable(),
      province: z.string().nullable(),
      latitude: z.number().finite().min(-90).max(90),
      longitude: z.number().finite().min(-180).max(180)
    })
  ),
  hasMore: z.boolean()
});

export interface FilteredMapProperties {
  properties: MapProperty[];
  hasMore: boolean;
  error?: string;
}

export async function getFilteredMapProperties(filters: string): Promise<FilteredMapProperties> {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/property/filter/map?${filters}`, {
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    });

    //We read the backend response so that we can identify why the request failed.
    const responseText = await response.text();

    let body: unknown;

    try {
      body = JSON.parse(responseText);
    } catch {
      console.error("The property map endpoint returned a non-JSON response:", {
        status: response.status,
        url: response.url,
        response: responseText.slice(0, 500)
      });

      throw new Error(
        `The property map endpoint returned an unexpected response (HTTP ${response.status}).`
      );
    }

    if (!response.ok) {
      const parsedError = z
        .object({
          message: z.string().optional()
        })
        .safeParse(body);

      const errorMessage =
        (parsedError.success && parsedError.data.message) ||
        "Could not load properties on the map.";

      console.error("Property map request failed:", {
        status: response.status,
        url: response.url,
        body
      });

      throw new Error(`${errorMessage} (HTTP ${response.status})`);
    }

    return mapPropertiesSchema.parse(body);
  } catch (error) {
    console.error("Could not load properties on the map:", error);

    return {
      properties: [],
      hasMore: false,
      error: "Could not load the map results. Please try again."
    };
  }
}
