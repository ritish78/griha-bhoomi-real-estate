import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getFilteredListOfProperties } from "@/actions/property";
import { Shell } from "@/components/shell";
import {
  getFilteredMapProperties,
  type FilteredMapProperties
} from "@/lib/getFilteredMapProperties";
import type { ListOfPropertiesResponse } from "@/types/property";

import SearchSheet from "./_components/search-sheet";
import SearchResults from "./_components/search-results";

export interface SearchPropertyPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = {
  title: "Search Properties - GrihaBhoomi",
  description: "Search your perfect properties at GrihaBhoomi"
};

export default async function SearchPropertyPage({ searchParams }: SearchPropertyPageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  //Each search field has one value. We also keep the selected view in the URL.
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      query.set(key, value);
    }
  }

  const requestedPage = Number(query.get("page") || 1);

  if (!Number.isSafeInteger(requestedPage) || requestedPage < 1) {
    query.set("page", "1");
    redirect(`/property/search?${query.toString()}`);
  }

  query.set("page", String(requestedPage));

  const showMap = query.get("view") === "map";

  //The view only controls the frontend layout.
  const filters = new URLSearchParams(query);
  filters.delete("view");

  const emptyMapProperties: FilteredMapProperties = {
    properties: [],
    hasMore: false
  };

  //The cards are paginated. The map independently requests matching markers.
  //Both requests receive the same search filters.
  const [propertyResponse, mapProperties] = await Promise.all([
    getFilteredListOfProperties(filters.toString()),
    showMap ? getFilteredMapProperties(filters.toString()) : Promise.resolve(emptyMapProperties)
  ]);

  const listOfFilteredProperty: ListOfPropertiesResponse = propertyResponse;

  if ("error" in listOfFilteredProperty) {
    return (
      <Shell className="pb-12 md:pb-14">
        <div className="rounded-md border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold">Could not load properties</h1>

          <p className="mt-2 text-muted-foreground">{listOfFilteredProperty.error}</p>
        </div>
      </Shell>
    );
  }

  //We preserve the filters and view when correcting an unavailable page.
  if (
    requestedPage > listOfFilteredProperty.numberOfPages &&
    listOfFilteredProperty.numberOfPages > 0
  ) {
    query.set("page", String(listOfFilteredProperty.numberOfPages));
    redirect(`/property/search?${query.toString()}`);
  }

  return (
    <Shell className="bg-slate-50 pb-12 dark:bg-transparent/5 md:pb-14">
      <div className="min-w-0 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">Find your next property</h1>

          <p className="text-muted-foreground">
            Search by location, price and the details that matter to you.
          </p>
        </div>

        <SearchSheet>
          <SearchResults propertyList={listOfFilteredProperty} mapProperties={mapProperties} />
        </SearchSheet>
      </div>
    </Shell>
  );
}
