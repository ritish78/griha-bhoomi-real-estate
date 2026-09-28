"use client";

import { createContext, useContext, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/formatPrice";

interface AppliedFilter {
  key: string;
  label: string;
}

interface AppliedFiltersContextValue {
  appliedFilters: AppliedFilter[];
  openFilters: () => void;
}

const AppliedFiltersContext = createContext<AppliedFiltersContextValue | undefined>(undefined);

//We receive the normalized, applied URL parameters from SearchSheet.
//We do not use the draft values that the user is still editing.
export function getAppliedSearchFilters(params: URLSearchParams): AppliedFilter[] {
  const appliedFilters: AppliedFilter[] = [];

  const get = (key: string) => params.get(key)?.trim() ?? "";

  function add(key: string, label: string) {
    appliedFilters.push({ key, label });
  }

  function addText(key: string, label: string) {
    const value = get(key);

    if (value) {
      add(key, `${label}: ${value}`);
    }
  }

  function addBoolean(key: string, trueLabel: string, falseLabel: string) {
    const value = get(key);

    if (value === "true") {
      add(key, trueLabel);
    } else if (value === "false") {
      add(key, falseLabel);
    }
  }

  //We count a minimum and maximum together as one filter.
  function addCountRange(key: string, label: string) {
    const minimum = get(`min${key}`);
    const maximum = get(`max${key}`);

    if (minimum && maximum) {
      add(key, minimum === maximum ? `${minimum} ${label}` : `${minimum}–${maximum} ${label}`);
    } else if (minimum) {
      add(key, `${minimum}+ ${label}`);
    } else if (maximum) {
      add(key, `Up to ${maximum} ${label}`);
    }
  }

  if (get("status")) {
    add("status", get("status"));
  } else {
    addBoolean("torent", "For rent", "For sale");
  }

  if (get("propertytype")) {
    add("propertytype", get("propertytype"));
  }

  const minimumPrice = get("minprice");
  const maximumPrice = get("maxprice");

  if (minimumPrice && maximumPrice) {
    add(
      "price",
      minimumPrice === maximumPrice
        ? `Rs. ${formatPrice(Number(minimumPrice))}`
        : `Rs. ${formatPrice(Number(minimumPrice))}–${formatPrice(Number(maximumPrice))}`
    );
  } else if (minimumPrice) {
    add("price", `From Rs. ${formatPrice(Number(minimumPrice))}`);
  } else if (maximumPrice) {
    add("price", `Up to Rs. ${formatPrice(Number(maximumPrice))}`);
  }

  addCountRange("roomcount", "rooms");
  addCountRange("bathroomcount", "bathrooms");
  addCountRange("floorcount", "floors");
  addCountRange("kitchencount", "kitchens");

  addText("keyword", "Keyword");

  //The location and its radius represent one location filter.
  if (get("latitude") && get("longitude")) {
    const location = get("location") || "Selected location";
    const radius = get("radius");

    add("location", radius ? `${location} · ${radius} km` : location);
  }

  //The four map coordinates represent one selected-area filter.
  if (
    ["minlatitude", "maxlatitude", "minlongitude", "maxlongitude"].every((key) => get(key) !== "")
  ) {
    add("mapArea", "Selected map area");
  }

  addText("housetype", "House type");
  addText("landtype", "Land type");

  addBoolean("furnished", "Furnished", "Unfurnished");
  addBoolean("sharedbathroom", "Shared bathroom", "No shared bathroom");
  addBoolean("evcharging", "EV charging", "No EV charging");
  addBoolean("negotiable", "Negotiable", "Fixed price");

  addText("facing", "Facing");
  addText("builtat", "Built from");

  if (get("carparking")) {
    add("carparking", `${get("carparking")}+ car spaces`);
  }

  if (get("bikeparking")) {
    add("bikeparking", `${get("bikeparking")}+ bike spaces`);
  }

  for (const prefix of ["house", "land"]) {
    const connected = get(`${prefix}connectedtoroad`);
    const distance = get(`${prefix}distancetoroad`);

    if (connected === "true") {
      add(`${prefix}road`, "Connected to road");
    } else if (connected === "false") {
      add(
        `${prefix}road`,
        distance ? `Not connected · within ${distance} m of road` : "Not connected to road"
      );
    } else if (distance) {
      add(`${prefix}road`, `Within ${distance} m of road`);
    }
  }

  //We also display address filters from existing search links.
  addText("street", "Street");
  addText("wardnumber", "Ward");
  addText("municipality", "Municipality");
  addText("city", "City");
  addText("district", "District");
  addText("province", "Province");
  addText("closelandmark", "Landmark");
  addText("availablefrom", "Available from");
  addText("availabletill", "Available till");
  addText("listedat", "Listed from");
  addText("updatedat", "Updated from");

  //Sorting, pagination and list/map view are not search filters.
  return appliedFilters;
}

export function AppliedFiltersProvider({
  appliedFilters,
  openFilters,
  children
}: AppliedFiltersContextValue & { children: ReactNode }) {
  return (
    <AppliedFiltersContext.Provider value={{ appliedFilters, openFilters }}>
      {children}
    </AppliedFiltersContext.Provider>
  );
}

export default function AppliedSearchFilters() {
  const context = useContext(AppliedFiltersContext);

  if (!context) {
    throw new Error("AppliedSearchFilters must be used within AppliedFiltersProvider.");
  }

  const { appliedFilters, openFilters } = context;

  if (appliedFilters.length === 0) {
    return null;
  }

  const visibleFilters = appliedFilters.slice(0, 3);
  const remainingFilters = appliedFilters.length - visibleFilters.length;

  return (
    <div className="space-y-2 lg:hidden">
      <p className="text-xs font-medium text-muted-foreground">Applied filters</p>

      <div className="flex flex-wrap items-center gap-2">
        {visibleFilters.map((filter) => (
          <button
            key={filter.key}
            type="button"
            onClick={openFilters}
            title={filter.label}
            aria-label={`Edit search filters: ${filter.label}`}
            className="max-w-full rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Badge
              variant="outline"
              className="max-w-[220px] cursor-pointer rounded-md px-2.5 py-1.5 font-normal hover:bg-accent"
            >
              <span className="truncate">{filter.label}</span>
            </Badge>
          </button>
        ))}

        {remainingFilters > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-auto px-2.5 py-1.5 text-xs font-normal"
            onClick={openFilters}
            aria-label={`Edit search filters, ${remainingFilters} more applied`}
          >
            +{remainingFilters} more
          </Button>
        )}
      </div>
    </div>
  );
}
