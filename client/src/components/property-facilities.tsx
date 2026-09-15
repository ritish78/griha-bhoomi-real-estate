"use client";

import { ReactElement, useId } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utlis";
import {
  FACILITY_GROUPS,
  facilitiesForType,
  type FacilityGroup,
  type FacilityPropertyType
} from "@/types/facilities";
import { Icons } from "./icons";

const FACILITY_ICONS: Record<string, ReactElement> = {
  water_connection: <Icons.droplets />,
  water_storage: <Icons.container />,
  well_borewell: <Icons.waves />,
  solar_hot_water: <Icons.sun />,
  geyser: <Icons.heater />,
  sewer_connection: <Icons.network />,
  septic_tank: <Icons.cylinder />,

  electricity_connection: <Icons.plug />,
  inverter_backup: <Icons.batteryCharging />,
  generator_backup: <Icons.fuel />,
  solar_electricity: <Icons.sun />,
  internet_connection: <Icons.wifi />,

  balcony: <Icons.balcony />,
  terrace_access: <Icons.building />,
  garden: <Icons.trees />,

  boundary_wall: <Icons.brickWall />,
  boundary_fence: <Icons.fence />,
  gate: <Icons.gate />,
  irrigation_access: <Icons.sprout />,
  drainage_channel: <Icons.trendingDown />,

  cctv: <Icons.camera />,
  security_guard: <Icons.shieldCheck />,
  lift: <Icons.arrowUpDown />
};

interface FacilitiesPickerProps {
  propertyType: FacilityPropertyType;
  value: readonly string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function FacilitiesPicker({
  propertyType,
  value,
  onChange,
  disabled = false
}: FacilitiesPickerProps) {
  const prefix = useId();
  const available = facilitiesForType(propertyType);

  function toggle(id: string, checked: boolean) {
    const next = new Set(value);

    if (checked) next.add(id);
    else next.delete(id);

    onChange(Array.from(next));
  }

  return (
    <div className="space-y-6">
      {FACILITY_GROUPS.map((group) => {
        const options = available.filter((facility) => facility.group === group);

        if (options.length === 0) return null;

        return (
          <fieldset key={group} disabled={disabled} className="min-w-0 space-y-3">
            <legend className="text-sm font-semibold">{group}</legend>

            <div className="grid grid-cols-1 gap-2 min-[380px]:grid-cols-2 lg:grid-cols-3">
              {options.map((facility) => {
                const checked = value.includes(facility.id);
                const id = `${prefix}-${facility.id}`;

                return (
                  <Label
                    key={facility.id}
                    htmlFor={id}
                    className={cn(
                      "flex min-h-14 min-w-0 cursor-pointer items-center gap-2 rounded-lg border px-3 py-2",
                      "transition-colors hover:bg-muted/50",
                      "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                      checked ? "border-primary bg-primary/5" : "border-border",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "shrink-0 [&_svg]:size-4",
                        checked ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {FACILITY_ICONS[facility.id] ?? <Icons.circleCheck />}
                    </span>

                    <span className="min-w-0 flex-1 text-sm font-normal leading-5">
                      {facility.label}
                    </span>

                    <Checkbox
                      id={id}
                      checked={checked}
                      disabled={disabled}
                      className="shrink-0"
                      onCheckedChange={(next) => toggle(facility.id, next === true)}
                    />
                  </Label>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

export function FacilitiesDisplay({
  propertyType,
  value
}: {
  propertyType: FacilityPropertyType;
  value?: readonly string[] | null;
}) {
  const selected = facilitiesForType(propertyType).filter((facility) =>
    value?.includes(facility.id)
  );

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">
        {propertyType === "Land" ? "Utilities & site features" : "Facilities & amenities"}
      </h2>

      {selected.length === 0 ? (
        <p className="text-sm text-muted-foreground">Facilities not specified.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
          {selected.map((facility) => {
            return (
              <li key={facility.id} className="flex items-start gap-2 text-sm">
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-4"
                >
                  {FACILITY_ICONS[facility.id] ?? <Icons.circleCheck />}
                </span>
                <span>{facility.label}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
