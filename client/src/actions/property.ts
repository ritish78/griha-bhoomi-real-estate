"use server";

import { getErrorMessage } from "@/lib/getErrorMessage";

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
    const cookieStore = cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch("http://localhost:5000/api/v1/property/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify(data),
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
