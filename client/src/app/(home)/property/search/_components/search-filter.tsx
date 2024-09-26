"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { isDesktop } from "@/lib/utlis";

import { FilterList, type Filter } from "@/components/layout/filter-list";

const propertyFilter: Filter[] = [
  {
    value: "House",
    label: "House"
  },
  {
    value: "Land",
    label: "Land"
  }
];

const rentFilter: Filter[] = [
  {
    value: "Rent",
    label: "Rent"
  },
  {
    value: "Buy",
    label: "Buy"
  }
];

const houseTypeFilter: Filter[] = [
  {
    value: "House",
    label: "House"
  },
  {
    value: "Flat",
    label: "Flat"
  },
  {
    value: "Shared",
    label: "Shared"
  },
  {
    value: "Room",
    label: "Room"
  },
  {
    value: "Apartment",
    label: "Apartment"
  }
];

const roomCountFilter: Filter[] = [
  {
    value: "1",
    label: "1"
  },
  {
    value: "2",
    label: "2"
  },
  {
    value: "3",
    label: "3"
  },
  {
    value: "4",
    label: "4"
  },
  {
    value: "5",
    label: "5"
  },
  {
    value: "6",
    label: "6"
  },
  {
    value: "7",
    label: "7"
  },
  {
    value: "8",
    label: "8"
  }
];

export default function SearchFilter() {
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<Filter | null>(null);
  const [isRentOpen, setIsRentOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState<Filter | null>(null);
  const [isHouseTypeOpen, setIsHouseTypeOpen] = useState(false);
  const [selectedHouseType, setSelectedHouseType] = useState<Filter | null>(null);
  const [isRoomCountOpen, setIsRoomCountOpen] = useState(false);
  const [selectedRoomCount, setSelectedRoomCount] = useState<Filter | null>(null);
  const isOnDesktop = isDesktop();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        propertytype: selectedPropertyType?.value ? selectedPropertyType.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedPropertyType]);

  if (isOnDesktop) {
    return (
      <div className="flex flex-row gap-2">
        <Popover open={isPropertyTypeOpen} onOpenChange={setIsPropertyTypeOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[125px] justify-between p-2">
              {selectedPropertyType ? <>{selectedPropertyType.label}</> : <>House/Land:</>}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[125px] p-0" align="start">
            <FilterList
              setIsOpen={setIsPropertyTypeOpen}
              setSelectedFilter={setSelectedPropertyType}
              toFilter={propertyFilter}
            />
          </PopoverContent>
        </Popover>
        <Popover open={isRentOpen} onOpenChange={setIsRentOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[125px] justify-between p-2">
              {selectedRent ? <>{selectedRent.label}</> : <>Rent/Buy:</>}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[125px] p-0" align="start">
            <FilterList
              setIsOpen={setIsRentOpen}
              setSelectedFilter={setSelectedRent}
              toFilter={rentFilter}
            />
          </PopoverContent>
        </Popover>
        {selectedPropertyType && selectedPropertyType.value === "House" ? (
          <>
            <Popover open={isHouseTypeOpen} onOpenChange={setIsHouseTypeOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedHouseType ? <>{selectedHouseType.label}</> : <>House Type:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsHouseTypeOpen}
                  setSelectedFilter={setSelectedHouseType}
                  toFilter={houseTypeFilter}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isRoomCountOpen} onOpenChange={setIsRoomCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedRoomCount ? <>{selectedRoomCount.label}</> : <>Room Count:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsRoomCountOpen}
                  setSelectedFilter={setSelectedRoomCount}
                  toFilter={roomCountFilter}
                />
              </PopoverContent>
            </Popover>
          </>
        ) : null}
      </div>
    );
  }

  return <div className="flex items-center space-x-2"></div>;
}
