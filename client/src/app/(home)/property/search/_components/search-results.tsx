"use client";

import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import PropertyCard from "@/components/property-card";
import PaginationButton from "@/components/pagination-button";
import { cn } from "@/lib/utlis";

import type { FilteredMapProperties } from "@/lib/getFilteredMapProperties";
import type { ListOfPropertiesSuccess, MapBounds } from "@/types/property";
import AppliedSearchFilters from "./applied-search-filters";

const SearchPropertyMap = dynamic(() => import("@/components/map/search-property-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">Loading map...</p>
    </div>
  )
});

const mapBoundsKeys = ["minlatitude", "maxlatitude", "minlongitude", "maxlongitude"];

const sortOptions = [
  { value: "views:desc", label: "Most viewed" },
  { value: "listedAt:desc", label: "Newest first" },
  { value: "price:asc", label: "Price: Low to high" },
  { value: "price:desc", label: "Price: High to low" }
];

interface SearchResultsProps {
  propertyList: ListOfPropertiesSuccess;
  mapProperties: FilteredMapProperties;
}

export default function SearchResults({ propertyList, mapProperties }: SearchResultsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [pending, startTransition] = useTransition();
  const [activePropertyId, setActivePropertyId] = useState<string | null>(null);

  const showMap = searchParams.get("view") === "map";
  const hasMapBounds = searchParams.has("minlatitude");

  const requestedSort = `${searchParams.get("sortby") || "views"}:${
    searchParams.get("order") || "desc"
  }`;

  const selectedSort = sortOptions.some((option) => option.value === requestedSort)
    ? requestedSort
    : "views:desc";

  function navigate(params: URLSearchParams) {
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, {
        scroll: false
      });
    });
  }

  function changeView(view: "list" | "map") {
    const params = new URLSearchParams(searchParams.toString());

    params.set("view", view);

    navigate(params);
  }

  function changeSort(value: string) {
    //We use the same default ordering as the search page.
    const [sortby = "views", order = "desc"] = value.split(":");

    const params = new URLSearchParams(searchParams.toString());

    params.set("sortby", sortby);
    params.set("order", order);
    params.set("page", "1");

    navigate(params);
  }

  function searchMapArea(bounds: MapBounds) {
    const params = new URLSearchParams(searchParams.toString());

    //The selected map area replaces the previous location-radius search.
    //All other filters remain in place.
    for (const key of ["location", "latitude", "longitude", "radius"]) {
      params.delete(key);
    }

    params.set("minlatitude", String(bounds.minLatitude));
    params.set("maxlatitude", String(bounds.maxLatitude));
    params.set("minlongitude", String(bounds.minLongitude));
    params.set("maxlongitude", String(bounds.maxLongitude));
    params.set("view", "map");
    params.set("page", "1");

    navigate(params);
  }

  function clearMapArea() {
    const params = new URLSearchParams(searchParams.toString());

    mapBoundsKeys.forEach((key) => params.delete(key));
    params.set("page", "1");

    navigate(params);
  }

  return (
    <div className="space-y-4" aria-busy={pending}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Search results</h2>

          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {pending
              ? "Updating results..."
              : `Showing ${propertyList.properties.length} listings on this page`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedSort} onValueChange={changeSort} disabled={pending}>
            <SelectTrigger className="w-44" aria-label="Sort properties">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            className="hidden gap-2 lg:inline-flex"
            disabled={pending}
            aria-pressed={showMap}
            onClick={() => changeView(showMap ? "list" : "map")}
          >
            <Icons.mapPin className="size-4" aria-hidden="true" />
            {showMap ? "Hide map" : "Show map"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:hidden">
        <Button
          type="button"
          variant={showMap ? "outline" : "default"}
          disabled={pending}
          aria-pressed={!showMap}
          onClick={() => changeView("list")}
        >
          List
        </Button>

        <Button
          type="button"
          variant={showMap ? "default" : "outline"}
          disabled={pending}
          aria-pressed={showMap}
          onClick={() => changeView("map")}
        >
          Map
        </Button>
      </div>

      <AppliedSearchFilters />

      {hasMapBounds && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Searching the selected map area.</span>

          <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={clearMapArea}>
            Clear map area
          </Button>
        </div>
      )}

      <div
        className={cn(
          "grid items-start gap-4",
          showMap && "lg:grid-cols-[minmax(300px,0.9fr)_minmax(0,1.1fr)]"
        )}
      >
        <div className={cn("min-w-0 space-y-6", showMap && "hidden lg:block")}>
          {propertyList.properties.length > 0 ? (
            <>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] items-stretch gap-4">
                {propertyList.properties.map((property) => (
                  <div
                    key={property.id}
                    className="min-w-0"
                    onMouseEnter={() => setActivePropertyId(property.id)}
                    onMouseLeave={() => setActivePropertyId(null)}
                    onFocusCapture={() => setActivePropertyId(property.id)}
                    onBlurCapture={() => setActivePropertyId(null)}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>

              {propertyList.numberOfPages > 1 && (
                <PaginationButton
                  searchParams={Object.fromEntries(searchParams.entries())}
                  totalPages={propertyList.numberOfPages}
                  page={propertyList.currentPageNumber}
                />
              )}
            </>
          ) : (
            <div className="rounded-md border border-dashed px-6 py-12 text-center">
              <h3 className="text-lg font-semibold">No matching properties</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Try another area or adjust your filters.
              </p>
            </div>
          )}
        </div>
        {showMap && (
          <div className="min-w-0 space-y-2 lg:sticky lg:top-24">
            <div className="relative isolate h-[65dvh] min-h-96 overflow-hidden rounded-md border bg-card lg:h-[calc(100dvh-8rem)]">
              {mapProperties.error ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p role="alert" className="text-sm text-muted-foreground">
                    {mapProperties.error}
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={pending}
                    onClick={() => {
                      startTransition(() => router.refresh());
                    }}
                  >
                    Try again
                  </Button>
                </div>
              ) : (
                <SearchPropertyMap
                  properties={mapProperties.properties}
                  query={searchParams.toString()}
                  activePropertyId={activePropertyId}
                  pending={pending}
                  onSearchArea={searchMapArea}
                />
              )}
            </div>

            {!mapProperties.error && (
              <p className="text-xs text-muted-foreground" aria-live="polite">
                {mapProperties.hasMore
                  ? "Showing 200 matching locations. Zoom in and search this area, or narrow your filters."
                  : `${mapProperties.properties.length} matching listings on the map.`}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
