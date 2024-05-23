"use server";

import { ListOfProperties, Property } from "@/types/property";

export async function getListOfProperties(pageNumber: number = 1): Promise<ListOfProperties> {
  const response = await fetch(`http://localhost:5000/api/v1/property?page=${pageNumber}`, {
    next: { revalidate: 60 } //Cache in seconds to revalidate
  });

  const data = await response.json();

  return data;
}

export async function getPropertyBySlug(slug: string): Promise<Property> {
  const response = await fetch(`http://localhost:5000/api/v1/property/${slug}`, {
    next: { revalidate: 60 } //Cache in seconds to revalidate
  });

  const data = await response.json();

  return data;
}

export async function getListOfFeaturedProperties(): Promise<ListOfProperties> {
  const response = await fetch(`http://localhost:5000/api/v1/property/featured`, {
    next: { revalidate: 60 } //Cache in seconds to revalidate
  });

  const data = await response.json();

  return data;
}
