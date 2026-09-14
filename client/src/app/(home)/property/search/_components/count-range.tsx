"use client";

import { useState } from "react";
import { Slider } from "radix-ui";
import { Button } from "@/components/ui/button";

export const COUNT_FILTERS = [
  ["roomcount", "Rooms", 20],
  ["bathroomcount", "Bathrooms", 10],
  ["floorcount", "Floors", 10],
  ["kitchencount", "Kitchens", 10]
] as const;

interface CountRangeProps {
  label: string;
  minimum: string;
  maximum: string;
  limit: number;
  disabled?: boolean;
  onChange: (minimum: string, maximum: string) => void;
}

function numberOr(value: string, fallback: number) {
  const parsed = Number(value);

  return value !== "" && Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export default function CountRange({
  label,
  minimum,
  maximum,
  limit,
  disabled,
  onChange
}: CountRangeProps) {
  //Keep the scale stable while dragging.
  //Expand it for copied URLs containing larger counts.
  const [ceiling] = useState(() =>
    Math.max(limit, numberOr(minimum, 0) + 1, numberOr(maximum, 0) + 1)
  );

  const lower = numberOr(minimum, 0);
  const upper = numberOr(maximum, ceiling);

  const summary =
    minimum === "" && maximum === ""
      ? "Any"
      : maximum === ""
        ? `${lower}+`
        : minimum === ""
          ? `Up to ${upper}`
          : lower === upper
            ? `${lower} exactly`
            : `${lower}-${upper}`;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>

        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums text-muted-foreground">{summary}</span>

          {(minimum !== "" || maximum !== "") && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-1 text-xs"
              disabled={disabled}
              onClick={() => onChange("", "")}
              aria-label={`Clear ${label.toLowerCase()} filter`}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      <Slider.Root
        value={[Math.min(lower, upper), Math.max(lower, upper)]}
        min={0}
        max={ceiling}
        step={1}
        minStepsBetweenThumbs={0}
        disabled={disabled}
        data-vaul-no-drag
        onValueChange={([nextMin, nextMax]) => {
          onChange(
            nextMin === 0 ? "" : String(nextMin),
            nextMax === ceiling ? "" : String(nextMax)
          );
        }}
        className="relative flex h-6 w-full touch-none select-none items-center"
      >
        <Slider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <Slider.Range className="absolute h-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb
          aria-label={`Minimum ${label.toLowerCase()}`}
          className="block size-5 rounded-full border-2 border-primary bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
        />

        <Slider.Thumb
          aria-label={`Maximum ${label.toLowerCase()}`}
          aria-valuetext={maximum === "" ? "No maximum" : String(upper)}
          className="block size-5 rounded-full border-2 border-primary bg-background shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none"
        />
      </Slider.Root>

      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0</span>
        <span>No maximum</span>
      </div>
    </div>
  );
}
