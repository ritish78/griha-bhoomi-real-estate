"use server";

import { getErrorMessage } from "@/lib/getErrorMessage";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import z from "zod";

export async function getListOfProperties(pageNumber: number = 1, limit: number = 6) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/property?page=${pageNumber}&limit=${limit}`,
      {
        next: { revalidate: 60 } //Cache in seconds to revalidate
      }
    );

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getPropertyBySlug(slug: string) {
  try {
    const response = await fetch(`http://localhost:5000/api/v1/property/${slug}`, {
      next: { revalidate: 60 } //Cache in seconds to revalidate
    });

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getListOfFeaturedProperties(page: number, limit: number = 18) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/property/featured?page=${page}&limit=${limit}`,
      {
        next: { revalidate: 60 } //Cache in seconds to revalidate
      }
    );

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export async function getFilteredListOfProperties(filters: string, limit: number = 18) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/v1/property/filter?${filters}&limit=${limit}`,
      {
        next: { revalidate: 60 } //Cache in seconds to revalidate
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || "Could not search properties."
      };
    }

    return data;
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}

export type CreatePropertyResponse =
  | { success: true; slug: string; error?: never }
  | { success: false; error: string; slug?: never };

export async function createProperty(data: any): Promise<CreatePropertyResponse> {
  try {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch("http://localhost:5000/api/v1/property/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || "Failed to list property" };
    }

    return { success: true, slug: result.slug };
  } catch (error: any) {
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function updateProperty(
  slug: string,
  payload: Record<string, unknown>
): Promise<CreatePropertyResponse> {
  try {
    const cookieStore = await cookies();

    const response = await fetch(
      `http://localhost:5000/api/v1/property/edit/${encodeURIComponent(slug)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookieStore.toString()
        },
        cache: "no-store",
        body: JSON.stringify(payload)
      }
    );

    //Check that the backend returned JSON before trying to read it.
    if (!response.headers.get("content-type")?.includes("json")) {
      throw new Error(
        `The property service returned an unexpected response (HTTP ${response.status}).`
      );
    }

    const body: unknown = await response.json();

    if (!response.ok) {
      //The backend can return a single message or an array of validation errors.
      const parsedError = z
        .object({
          message: z.string().optional(),
          errors: z.array(z.object({ message: z.string() })).optional()
        })
        .safeParse(body);

      const errorMessage = parsedError.success
        ? parsedError.data.message ||
          parsedError.data.errors?.map((error) => error.message).join(" ")
        : undefined;

      return {
        success: false,
        error: errorMessage || "Could not save your changes."
      };
    }

    const saved = z
      .object({
        slug: z.string().min(1)
      })
      .parse(body);

    revalidatePath(`/property/${saved.slug}`);
    revalidatePath(`/property/${saved.slug}/edit`);
    revalidatePath("/property/search");
    revalidatePath("/");

    return {
      success: true,
      slug: saved.slug
    };
  } catch (error) {
    return {
      success: false,
      error: getErrorMessage(error)
    };
  }
}