"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export interface LocationOption {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
}

interface LocationSearchProps {
  label: string;
  latitude: string;
  longitude: string;
  onSelect: (location: LocationOption) => void;
  onClear: () => void;
  disabled?: boolean;
  emptyMessage?: string;
}

export default function LocationSearch({
  label,
  latitude,
  longitude,
  onSelect,
  onClear,
  disabled = false,
  emptyMessage = "No places found. Try adding a city or district."
}: LocationSearchProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const controllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  const selected = label || (latitude && longitude ? `${latitude}, ${longitude}` : "");

  function changeQuery(value: string) {
    controllerRef.current?.abort();
    setQuery(value);
    setResults([]);
    setLoading(false);
    setMessage("");
  }

  async function findPlaces() {
    if (disabled) return;

    const term = query.trim();

    if (term.length < 2) {
      setMessage("Enter at least two characters.");
      return;
    }

    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setResults([]);
    setMessage("");

    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(
        /\/$/,
        ""
      );

      const params = new URLSearchParams({ q: term });

      const response = await fetch(`${baseUrl}/api/v1/geo/search?${params.toString()}`, {
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)])
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not search locations.");
      }

      if (!Array.isArray(data)) {
        throw new Error("Could not read location results.");
      }

      if (controller.signal.aborted) return;

      setResults(data);

      if (data.length === 0) {
        setMessage(emptyMessage);
      }
    } catch (error) {
      if (controller.signal.aborted) return;

      setMessage(
        error instanceof Error ? error.message : "Location search failed. Please try again."
      );
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Location</p>

      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);

          if (!next) {
            controllerRef.current?.abort();
            setLoading(false);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            disabled={disabled}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label={selected ? `Search location: ${selected}` : "Choose search location"}
            title={selected || undefined}
            className="h-auto min-h-10 w-full min-w-0 max-w-full items-start justify-start gap-2 whitespace-normal px-3 py-2 text-left"
          >
            <MapPin className="mt-0.5 size-4 shrink-0" />

            <span className="min-w-0 flex-1 line-clamp-3 break-words">
              {selected || "Choose an area or address"}
            </span>
          </Button>
        </PopoverTrigger>

        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] max-w-[calc(100vw-2rem)] overflow-hidden p-0"
        >
          {" "}
          <Command shouldFilter={false}>
            <CommandInput
              disabled={disabled}
              aria-label="Place name"
              placeholder="e.g. Koteshwor, Kathmandu"
              value={query}
              onValueChange={changeQuery}
              onKeyDown={(event) => {
                if (event.key === "Enter" && results.length === 0 && !loading) {
                  event.preventDefault();
                  event.stopPropagation();
                  void findPlaces();
                }
              }}
            />

            <div className="border-b p-2">
              <Button
                type="button"
                size="sm"
                className="w-full"
                disabled={disabled || loading || query.trim().length < 2}
                onClick={() => void findPlaces()}
              >
                {loading ? "Finding places…" : "Find places"}
              </Button>
            </div>

            <CommandList>
              {message && (
                <p role="status" className="p-3 text-sm text-muted-foreground">
                  {message}
                </p>
              )}

              {results.map((location) => (
                <CommandItem
                  key={location.id}
                  value={location.id}
                  disabled={disabled}
                  onSelect={() => {
                    controllerRef.current?.abort();
                    onSelect(location);
                    setOpen(false);
                  }}
                  className="items-start gap-2 py-3"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0 flex-1 whitespace-normal break-words">
                    {location.label}
                  </span>{" "}
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selected && (
        <Button
          type="button"
          variant="ghost"
          disabled={disabled}
          size="sm"
          className="h-7 px-1 text-xs text-muted-foreground"
          onClick={() => {
            changeQuery("");
            onClear();
          }}
        >
          Clear location
        </Button>
      )}
    </div>
  );
}
