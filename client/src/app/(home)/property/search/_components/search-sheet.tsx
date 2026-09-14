"use client";

import { useId, useState, useTransition, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import CountRange, { COUNT_FILTERS } from "./count-range";
import LocationSearch from "./location-search";

type Patch = Record<string, string>;

const HOUSE_KEYS = [
  "housetype",
  ...COUNT_FILTERS.flatMap(([key]) => [key, `min${key}`, `max${key}`]),
  "roomcountrange",
  "sharedbathroom",
  "furnished",
  "facing",
  "carparking",
  "bikeparking",
  "evcharging",
  "builtat",
  "houseconnectedtoroad",
  "housedistancetoroad"
];

const LAND_KEYS = ["landtype", "landconnectedtoroad", "landdistancetoroad"];

const MORE_KEYS = [
  "sharedbathroom",
  "furnished",
  "facing",
  "carparking",
  "bikeparking",
  "evcharging",
  "builtat",
  "houseconnectedtoroad",
  "housedistancetoroad"
];

const NUMBER_KEYS = [
  "minprice",
  "maxprice",
  ...COUNT_FILTERS.flatMap(([key]) => [`min${key}`, `max${key}`]),
  "carparking",
  "bikeparking",
  "builtat",
  "housedistancetoroad",
  "landdistancetoroad"
];

function readFilters(query: string) {
  const params = new URLSearchParams(query);

  // Support old links such as roomcount=3 and price=5000000.
  // An exact value takes precedence over old range parameters.
  for (const key of ["price", ...COUNT_FILTERS.map(([key]) => key)]) {
    const exact = params.get(key);
    const legacyRange = params.get(`${key}range`);

    if (exact !== null && exact.trim() !== "") {
      params.set(`min${key}`, exact);
      params.set(`max${key}`, exact);
    } else if (legacyRange) {
      const parts = legacyRange.split("-");
      const [minimum, maximum] = parts;

      if (parts.length === 2 && minimum !== undefined && maximum !== undefined) {
        if (!params.has(`min${key}`)) {
          params.set(`min${key}`, minimum);
        }

        if (!params.has(`max${key}`)) {
          params.set(`max${key}`, maximum);
        }
      }
    }

    params.delete(key);
    params.delete(`${key}range`);
  }

  // Match the values used by the listing form.
  const facing = params.get("facing");

  if (facing) {
    params.set("facing", facing.replace(/^(North|South)\s+(East|West)$/, "$1-$2"));
  }

  return params;
}

function validateFilters(params: URLSearchParams) {
  const locationKeys = ["location", "latitude", "longitude", "radius"];

  const hasLocation = locationKeys.some((key) => params.has(key));

  if (hasLocation) {
    const latitudeText = params.get("latitude");
    const longitudeText = params.get("longitude");
    const radiusText = params.get("radius");

    if (!latitudeText?.trim() || !longitudeText?.trim() || !radiusText?.trim()) {
      return "Choose a location and search radius, or clear the location.";
    }

    const latitude = Number(latitudeText);
    const longitude = Number(longitudeText);
    const radius = Number(radiusText);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return "Please choose a valid search location.";
    }

    if (!Number.isFinite(radius) || radius <= 0 || radius > 50) {
      return "Search radius must be greater than 0 and at most 50 km.";
    }
  }

  for (const key of NUMBER_KEYS) {
    const value = params.get(key);

    if (value === null || value.trim() === "") continue;

    const number = Number(value);

    if (!Number.isFinite(number) || number < 0) {
      return "Please enter valid, non-negative numbers.";
    }

    const allowsDecimals = key.includes("price") || key.includes("distancetoroad");

    if (!allowsDecimals && !Number.isInteger(number)) {
      return "Rooms, floors, parking and years must use whole numbers.";
    }
  }

  for (const [key, label] of [
    ["price", "Price"],
    ...COUNT_FILTERS.map(([key, label]) => [key, label])
  ]) {
    const min = params.get(`min${key}`);
    const max = params.get(`max${key}`);

    if (min !== null && max !== null && min !== "" && max !== "" && Number(min) > Number(max)) {
      return `${label}: the minimum cannot exceed the maximum.`;
    }
  }

  return null;
}

function Choice({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}) {
  const id = useId();

  const optionLabel = (option: string) => {
    if (option === "true") return "Yes";
    if (option === "false") return "No";
    if (option === "Sale") return "Buy";

    return option.charAt(0).toUpperCase() + option.slice(1);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Select value={value || "any"} onValueChange={(next) => onChange(next === "any" ? "" : next)}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue placeholder="Any" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="any">Any</SelectItem>

          {options.map((option) => (
            <SelectItem key={option} value={option}>
              {optionLabel(option)}
            </SelectItem>
          ))}

          {/* Keep an existing URL value visible even if not in the list. */}
          {value && !options.includes(value) && (
            <SelectItem value={value}>{optionLabel(value)}</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}

function FilterForm({
  draft,
  update,
  apply,
  reset,
  pending,
  error
}: {
  draft: URLSearchParams;
  update: (patch: Patch) => void;
  apply: () => void;
  reset: () => void;
  pending: boolean;
  error: string | null;
}) {
  const id = useId();
  const get = (key: string) => draft.get(key) ?? "";
  const propertyType = get("propertytype");
  const isHouse = propertyType === "House";
  const isLand = propertyType === "Land";

  const choice = (key: string, label: string, options: readonly string[]) => (
    <Choice
      key={key}
      label={label}
      value={get(key)}
      options={options}
      onChange={(value) => update({ [key]: value })}
    />
  );

  const numeric = (key: string, label: string, step: number | "any" = 1) => (
    <div className="space-y-2" key={key}>
      <Label htmlFor={`${id}-${key}`}>{label}</Label>
      <Input
        id={`${id}-${key}`}
        type="number"
        min={0}
        step={step}
        placeholder="Any"
        value={get(key)}
        onChange={(event) => update({ [key]: event.target.value })}
      />
    </div>
  );

  const roadFields = (prefix: "house" | "land") => (
    <>
      {choice(`${prefix}connectedtoroad`, "Connected to road", ["true", "false"])}

      {get(`${prefix}connectedtoroad`) === "false" &&
        numeric(`${prefix}distancetoroad`, "Maximum distance to road (ft)", "any")}
    </>
  );

  return (
    <form
      className="min-w-0"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        apply();
      }}
    >
      <fieldset disabled={pending} inert={pending} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor={`${id}-keyword`}>Keyword</Label>
          <Input
            id={`${id}-keyword`}
            placeholder="Area, title or description"
            value={get("keyword")}
            onChange={(event) => update({ keyword: event.target.value })}
          />
        </div>
        <LocationSearch
          label={get("location")}
          latitude={get("latitude")}
          longitude={get("longitude")}
          onSelect={(location) => {
            update({
              location: location.label,
              latitude: String(location.latitude),
              longitude: String(location.longitude),
              radius: get("radius") || "3"
            });
          }}
          onClear={() => {
            update({
              location: "",
              latitude: "",
              longitude: "",
              radius: ""
            });
          }}
        />

        {get("latitude") !== "" && get("longitude") !== "" && (
          <div className="space-y-2">
            <Label htmlFor={`${id}-radius`}>Search radius</Label>

            <Select value={get("radius")} onValueChange={(value) => update({ radius: value })}>
              <SelectTrigger id={`${id}-radius`}>
                <SelectValue placeholder="Choose a radius" />
              </SelectTrigger>

              <SelectContent>
                {["1", "3", "5", "10", "25", "50"].map((radius) => (
                  <SelectItem key={radius} value={radius}>
                    Within {radius} km
                  </SelectItem>
                ))}

                {/* Restore valid custom distances from copied URLs. */}
                {get("radius") && !["1", "3", "5", "10", "25", "50"].includes(get("radius")) && (
                  <SelectItem value={get("radius")}>Within {get("radius")} km</SelectItem>
                )}
              </SelectContent>
            </Select>

            <p className="text-xs text-muted-foreground">
              Straight-line distance from the selected location.
            </p>
          </div>
        )}

        {choice("status", "Looking to", ["Sale", "Rent"])}

        <div className="space-y-2">
          <span className="text-sm font-medium">Property type</span>

          <div className="grid grid-cols-3 gap-2">
            {["", "House", "Land"].map((type) => (
              <Button
                key={type || "any"}
                type="button"
                variant={propertyType === type ? "default" : "outline"}
                aria-pressed={propertyType === type}
                onClick={() => update({ propertytype: type })}
              >
                {type || "Any"}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3 border-t pt-5">
          <p className="text-sm font-medium">Price (NPR)</p>

          <div className="grid grid-cols-2 gap-3">
            {numeric("minprice", "From", "any")}
            {numeric("maxprice", "To", "any")}
          </div>
        </div>

        {isHouse && (
          <div className="space-y-6 border-t pt-5">
            {choice("housetype", "House type", [
              "House",
              "Flat",
              "Shared",
              "Room",
              "Apartment",
              "Bungalow",
              "Villa"
            ])}

            {COUNT_FILTERS.map(([key, label, limit]) => (
              <CountRange
                key={key}
                label={label}
                limit={limit}
                minimum={get(`min${key}`)}
                maximum={get(`max${key}`)}
                disabled={pending}
                onChange={(min, max) =>
                  update({
                    [`min${key}`]: min,
                    [`max${key}`]: max
                  })
                }
              />
            ))}

            <Accordion
              type="single"
              collapsible
              defaultValue={MORE_KEYS.some((key) => get(key)) ? "more" : undefined}
            >
              <AccordionItem value="more">
                <AccordionTrigger>More filters</AccordionTrigger>

                <AccordionContent>
                  <div className="space-y-5 pt-2">
                    {choice("furnished", "Furnished", ["true", "false"])}

                    {choice("sharedbathroom", "Shared bathroom", ["true", "false"])}

                    {choice("facing", "Facing direction", [
                      "North",
                      "North-East",
                      "East",
                      "South-East",
                      "South",
                      "South-West",
                      "West",
                      "North-West"
                    ])}

                    {numeric("carparking", "Minimum car spaces")}

                    {numeric("bikeparking", "Minimum bike spaces")}

                    {choice("evcharging", "EV charging", ["true", "false"])}

                    {numeric("builtat", "Built in or after")}

                    {roadFields("house")}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {isLand && (
          <div className="space-y-5 border-t pt-5">
            {choice("landtype", "Land type", [
              "residential",
              "agricultural",
              "industrial",
              "commercial",
              "plotting"
            ])}

            {roadFields("land")}
          </div>
        )}

        <div className="sticky bottom-0 space-y-3 border-t bg-background py-4">
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] gap-2">
            {" "}
            <Button type="button" variant="outline" onClick={reset}>
              Reset
            </Button>
            <Button type="submit">{pending ? "Searching…" : "Apply filters"}</Button>
          </div>

          <p className="text-xs text-muted-foreground">Changes take effect when you apply.</p>
        </div>
      </fieldset>
    </form>
  );
}

function FilterLayout({ initialQuery, children }: { initialQuery: string; children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const [draft, setDraft] = useState(() => readFilters(initialQuery));
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function update(patch: Patch) {
    setError(null);

    setDraft((current) => {
      const next = new URLSearchParams(current);

      for (const [key, value] of Object.entries(patch)) {
        if (value === "") next.delete(key);
        else next.set(key, value);
      }

      // Clear incompatible filters only after a user changes type.
      if ("propertytype" in patch) {
        if (patch.propertytype !== "House") {
          HOUSE_KEYS.forEach((key) => next.delete(key));
        }

        if (patch.propertytype !== "Land") {
          LAND_KEYS.forEach((key) => next.delete(key));
        }
      }

      for (const prefix of ["house", "land"]) {
        const connected = `${prefix}connectedtoroad`;

        if (connected in patch && patch[connected] !== "false") {
          next.delete(`${prefix}distancetoroad`);
        }
      }

      return next;
    });
  }

  function reset() {
    const next = new URLSearchParams();

    // Keep the current result ordering.
    const appliedParams = new URLSearchParams(initialQuery);

    for (const key of ["sortby", "order"]) {
      const value = appliedParams.get(key);
      if (value) next.set(key, value);
    }

    next.set("page", "1");

    setDraft(next);
    setError(null);
    setOpen(false);

    if (next.toString() === initialQuery) return;

    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, {
        scroll: false
      });
    });
  }

  function apply() {
    const next = new URLSearchParams(draft);

    for (const [key, value] of Array.from(next.entries())) {
      if (value.trim() === "") next.delete(key);
      else next.set(key, value.trim());
    }

    const validationError = validateFilters(next);

    if (validationError) {
      setError(validationError);
      return;
    }

    next.set("page", "1");

    setOpen(false);

    if (next.toString() === initialQuery) return;

    startTransition(() => {
      router.push(`${pathname}?${next.toString()}`, {
        scroll: false
      });
    });
  }

  const formProps = {
    draft,
    update,
    apply,
    reset,
    pending,
    error
  };

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] overflow-y-auto rounded-xl border bg-card p-5 lg:block">
        <h2 className="mb-5 text-lg font-semibold">Search filters</h2>

        <FilterForm {...formProps} />
      </aside>

      <div className="min-w-0 space-y-5" aria-busy={pending}>
        <div className="lg:hidden">
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="size-4" />
                Search and filters
              </Button>
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Search filters</DrawerTitle>
                <DrawerDescription>Find properties that match your needs.</DrawerDescription>
              </DrawerHeader>

              <div className="px-5 pb-5">
                <FilterForm {...formProps} />
              </div>
            </DrawerContent>
          </Drawer>
        </div>

        {children}
      </div>
    </div>
  );
}

export default function SearchSheet({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  // A new URL creates a fresh draft, including browser Back/Forward.
  // There is no effect that writes empty initial state into the URL.
  return (
    <FilterLayout key={query} initialQuery={query}>
      {children}
    </FilterLayout>
  );
}
