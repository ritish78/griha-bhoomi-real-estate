"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "./icons";
import { ListOfPropertiesResponse, ListOfPropertiesSuccess, Property } from "@/types/property";
import { cn, isMacOS } from "@/lib/utlis";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import { useDebounce } from "@/hooks/use-debounce";
import { Kbd } from "@/components/kbd";
import { getFilteredListOfProperties } from "@/actions/property";

// type PropertyGroup = NonNullable<
//   Awaited<ReturnType<typeof getFilteredListOfProperties>>["property"]
// >[number];

export function SearchBox() {
  //TODO: Implement Search functionality
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500); //Current delay is 500ms
  const [propertiesData, setPropertiesData] = useState<ListOfPropertiesSuccess | null>(null);
  const [loading, setLoading] = useState(false);

  //TODO: Implement Search product in useEffect using debounced value
  useEffect(() => {
    if (debouncedQuery.length <= 0) {
      //Then we set the data to null
      //The data variable needs to be one state variable
      setPropertiesData(null);
      return;
    }

    async function fetchData() {
      setLoading(true);

      //Then the logic to fetch data from the server
      const listOfFilteredProperty: ListOfPropertiesResponse = await getFilteredListOfProperties(
        `keyword=${debouncedQuery}`,
        6
      );

      if ("error" in listOfFilteredProperty) {
        setLoading(false);
        return;
      }

      //Then we set the data variable to the value that we received from the server
      setPropertiesData(listOfFilteredProperty);
      setLoading(false);
    }

    void fetchData(); //why `void fetchData()`?
    //In the console, it prints:
    //Warning: An effect function must not return anything besides a function, which is used for clean-up. You returned: Promise
  }, [debouncedQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const onSelect = useCallback((callback: () => unknown) => {
    setOpen(false);
    callback();
  }, []);

  //Remove if search box will be shown instead of redirecting the user
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        router.push("/property/search");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative size-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
        // onClick={() => setOpen(true)}
        onClick={() => router.push("/property/search")}
      >
        <Icons.search className="size-4 xl:mr-2" aria-hidden="true" />
        <span className="hidden xl:inline-flex">Search property...</span>
        <span className="sr-only">Search property</span>
        <Kbd
          title={isMacOS() ? "Command" : "Control"}
          className="pointer-events-none absolute right-1.5 top-1.5 hidden xl:block"
        >
          {isMacOS() ? "⌘" : "Ctrl"} K
        </Kbd>
      </Button>
      {/* <CommandDialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
          if (!open) {
            setQuery("");
          }
        }}
      >
        <CommandInput placeholder="Search property..." value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty className={cn(loading ? "hidden" : "py-6 text-center text-sm")}>
            No property found.
          </CommandEmpty>
          {loading ? (
            <div className="space-y-1 overflow-hidden px-1 py-2">Loading...</div>
          ) : (
            <CommandGroup>
              {propertiesData?.properties?.map((item: Property) => (
                <CommandItem
                  key={item.id}
                  className="h-9 mb-1.5"
                  value={item.title}
                  onSelect={() => onSelect(() => router.push(`/property/${item.slug}`))}
                >
                  {item.property_type == "House" ? (
                    <Icons.house className="mr-3 size-3 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <Icons.land className="mr-3 size-3 text-muted-foreground" aria-hidden="true" />
                  )}

                  <span className="truncate"> {item.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog> */}
    </>
  );
}
