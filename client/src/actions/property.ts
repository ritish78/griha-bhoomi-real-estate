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

export async function getListOfFeaturedProperties(page: number, limit: number = 3) {
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
