import "server-only";

import { cookies } from "next/headers";
import { z } from "zod";

const myPropertySchema = z.object({
  id: z.string().uuid(),
  sellerId: z.string().uuid(),
  title: z.string(),
  slug: z.string().min(1),
  price: z.number(),
  toRent: z.boolean(),
  imageUrl: z.array(z.string()).nullable(),
  status: z.enum(["Sale", "Rent", "Hold", "Sold"]),
  featured: z.boolean().nullable(),
  private: z.boolean().nullable(),
  expiresOn: z.string().refine((value) => Number.isFinite(Date.parse(value))),
  isExpired: z.boolean(),
  city: z.string().nullable(),
  municipality: z.string().nullable(),
  district: z.string().nullable()
});

const myPropertiesSchema = z.object({
  properties: z.array(myPropertySchema),
  counts: z.object({
    all: z.number().int().nonnegative(),
    unexpired: z.number().int().nonnegative(),
    expired: z.number().int().nonnegative()
  }),
  page: z.number().int().positive(),
  totalPages: z.number().int().positive()
});

export type MyProperty = z.infer<typeof myPropertySchema>;
export type MyPropertyFilter = "all" | "unexpired" | "expired";

type MyPropertiesResult =
  | { success: true; data: z.infer<typeof myPropertiesSchema> }
  | { success: false; status: number; error: string };

export async function getMyProperties(
  filter: MyPropertyFilter,
  page: number
): Promise<MyPropertiesResult> {
  try {
    const cookieStore = await cookies();
    const query = new URLSearchParams({ filter, page: String(page) });
    const response = await fetch(`http://localhost:5000/api/v1/property/mine?${query}`, {
      headers: { Accept: "application/json", Cookie: cookieStore.toString() },
      cache: "no-store"
    });

    if (!response.ok) {
      return { success: false, status: response.status, error: "Could not load your listings." };
    }

    const body: unknown = await response.json();
    return { success: true, data: myPropertiesSchema.parse(body) };
  } catch (error) {
    console.error("Could not load your listings:", error);
    return {
      success: false,
      status: 500,
      error: "Could not load your listings. Please try again."
    };
  }
}
