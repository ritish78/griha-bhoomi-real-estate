"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn, isDesktop } from "@/lib/utlis";
import { Icons } from "@/components/icons";

import { FilterList, type Filter } from "@/components/layout/filter-list";
import { format } from "date-fns";

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
    value: "Sale",
    label: "Sale"
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
  },
  {
    value: "9",
    label: "9"
  },
  {
    value: "10",
    label: "10"
  },
  {
    value: "11",
    label: "11"
  },
  {
    value: "12",
    label: "12"
  },
  {
    value: "12",
    label: "12"
  },
  {
    value: "13",
    label: "13"
  },
  {
    value: "14",
    label: "14"
  },
  {
    value: "15",
    label: "15"
  }
];

const uptoTenCount: Filter[] = [
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
  },
  {
    value: "9",
    label: "9"
  },
  {
    value: "10",
    label: "10"
  }
];

const sharedBathroomFilter: Filter[] = [
  {
    value: "true",
    label: "Sharing"
  },
  {
    value: "false",
    label: "Non Sharing"
  }
];

const furnishedFilter: Filter[] = [
  {
    value: "true",
    label: "Furnished"
  },
  {
    value: "false",
    label: "Non Furnished"
  }
];

const facingFilter: Filter[] = [
  {
    value: "North",
    label: "North"
  },
  {
    value: "North East",
    label: "North East"
  },
  {
    value: "East",
    label: "East"
  },
  {
    value: "South East",
    label: "South East"
  },
  {
    value: "South",
    label: "South"
  },
  {
    value: "South West",
    label: "South West"
  },
  {
    value: "West",
    label: "West"
  },
  {
    value: "North West",
    label: "North West"
  }
];

const evChargingFilter: Filter[] = [
  {
    value: "true",
    label: "Yes - available"
  },
  {
    value: "false",
    label: "No - unavailable"
  }
];

const roadConnected: Filter[] = [
  {
    value: "true",
    label: "Yes - connected"
  },
  {
    value: "false",
    label: "No - not connected"
  }
];

const distanceToRoad: Filter[] = [
  {
    value: "10",
    label: "less than 10 meters"
  },
  {
    value: "20",
    label: "less than 20 meters"
  },
  {
    value: "30",
    label: "less than 30 meters"
  },
  {
    value: "40",
    label: "less than 40 meters"
  },
  {
    value: "50",
    label: "less than 50 meters"
  },
  {
    value: "75",
    label: "less than 75 meters"
  },
  {
    value: "100",
    label: "less than 100 meters"
  },
  {
    value: "150",
    label: "less than 150 meters"
  },
  {
    value: "200",
    label: "less than 200 meters"
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
  const [isMinRoomCountOpen, setIsMinRoomCountOpen] = useState(false);
  const [selectedMinRoomCount, setSelectedMinRoomCount] = useState<Filter | null>(null);
  const [isMaxRoomCountOpen, setIsMaxRoomCountOpen] = useState(false);
  const [selectedMaxRoomCount, setSelectedMaxRoomCount] = useState<Filter | null>(null);
  const [isFloorCountOpen, setIsFloorCountOpen] = useState(false);
  const [selectedFloorCount, setSelectedFloorCount] = useState<Filter | null>(null);
  const [isMinFloorCountOpen, setIsMinFloorCountOpen] = useState(false);
  const [selectedMinFloorCount, setSelectedMinFloorCount] = useState<Filter | null>(null);
  const [isMaxFloorCountOpen, setIsMaxFloorCountOpen] = useState(false);
  const [selectedMaxFloorCount, setSelectedMaxFloorCount] = useState<Filter | null>(null);
  const [isKitchenCountOpen, setIsKitchenCountOpen] = useState(false);
  const [selectedKitchenCount, setSelectedKitchenCount] = useState<Filter | null>(null);
  const [isMinKitchenCountOpen, setIsMinKitchenCountOpen] = useState(false);
  const [selectedMinKitchenCount, setSelectedMinKitchenCount] = useState<Filter | null>(null);
  const [isMaxKitchenCountOpen, setIsMaxKitchenCountOpen] = useState(false);
  const [selectedMaxKitchenCount, setSelectedMaxKitchenCount] = useState<Filter | null>(null);
  const [isSharedBathroomOptionOpen, setIsSharedBathroomOptionOpen] = useState(false);
  const [selectedSharedBathroomOption, setSelectedBathroomOption] = useState<Filter | null>(null);
  const [isMinBathroomCountOpen, setIsMinBathroomCountOpen] = useState(false);
  const [selectedMinBathroomCount, setSelectedMinBathroomCount] = useState<Filter | null>(null);
  const [isMaxBathroomCountOpen, setIsMaxBathroomCountOpen] = useState(false);
  const [selectedMaxBathroomCount, setSelectedMaxBathroomCount] = useState<Filter | null>(null);
  const [isFurnishedOptionOpen, setIsFurnishedOptionOpen] = useState(false);
  const [selectedFurnishedOption, setSelectedFurnishedOption] = useState<Filter | null>(null);
  const [isFacingOptionOpen, setIsFacingOptionOpen] = useState(false);
  const [selectedFacingOption, setSelectedFacingOption] = useState<Filter | null>(null);
  const [isCarParkingOptionOpen, setIsCarParkingOptionOpen] = useState(false);
  const [selectedCarParkingOption, setSelectedCarParkingOption] = useState<Filter | null>(null);
  const [isBikeParkingOptionOpen, setIsBikeParkingOptionOpen] = useState(false);
  const [selectedBikeParkingOption, setSelectedBikeParkingOption] = useState<Filter | null>(null);
  const [isEVChargingOptionOpen, setIsEVChargingOptionOpen] = useState(false);
  const [selectedEVChargingOption, setSelectedEVChargingOption] = useState<Filter | null>(null);
  const [isCalendarOptionOpen, setIsCalendarOptionOpen] = useState(false);
  const [selectedCalendarYear, setSelectedCalendarYear] = useState<Filter | null>(null);
  const [isConnectedToRoadOptionOpen, setIsConnectedToRoadOptionOpen] = useState(false);
  const [selectedConnectedToRoad, setSelectedConnectedToRoad] = useState<Filter | null>(null);
  const [isDistanceToRoadOptionOpen, setIsDistanceToRoadOptionOpen] = useState(false);
  const [selectedDistanceToRoad, setSelectedDistanceToRoad] = useState<Filter | null>(null);

  const yearList = useMemo(() => {
    const thisYear = new Date().getFullYear();
    const years: Filter[] = [];

    for (let i = 1970; i <= thisYear; i++) {
      years.push({ value: String(i), label: String(i) });
    }

    return years;
  }, []);

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

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        status: selectedRent?.value ? selectedRent.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedRent]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        housetype: selectedHouseType?.value ? selectedHouseType.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedHouseType]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        roomcount: selectedRoomCount?.value ? selectedRoomCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedRoomCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        minroomcount: selectedMinRoomCount?.value ? selectedMinRoomCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedMinRoomCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        maxroomcount: selectedMaxRoomCount?.value ? selectedMaxRoomCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedMaxRoomCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        floorcount: selectedFloorCount?.value ? selectedFloorCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedFloorCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        minfloorcount: selectedMinFloorCount?.value ? selectedMinFloorCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedMinFloorCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        maxfloorcount: selectedMaxFloorCount?.value ? selectedMaxFloorCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedMaxFloorCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        kitchencount: selectedKitchenCount?.value ? selectedKitchenCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedKitchenCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        minkitchencount: selectedMinKitchenCount?.value ? selectedMinKitchenCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedMinKitchenCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        maxkitchencount: selectedMaxKitchenCount?.value ? selectedMaxKitchenCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedMaxKitchenCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        sharedbathroom: selectedSharedBathroomOption?.value
          ? selectedSharedBathroomOption.value
          : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedSharedBathroomOption]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        minbathroomcount: selectedMinBathroomCount?.value ? selectedMinBathroomCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedMinBathroomCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        maxbathroomcount: selectedMaxBathroomCount?.value ? selectedMaxBathroomCount.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedMaxBathroomCount]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        furnished: selectedFurnishedOption?.value ? selectedFurnishedOption.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedFurnishedOption]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        facing: selectedFacingOption?.value ? selectedFacingOption.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedFacingOption]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        carparking: selectedCarParkingOption?.value ? selectedCarParkingOption.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedCarParkingOption]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        bikeparking: selectedBikeParkingOption?.value ? selectedBikeParkingOption.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedBikeParkingOption]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        evcharging: selectedEVChargingOption?.value ? selectedEVChargingOption.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedEVChargingOption]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        builtat: selectedCalendarYear?.value ? selectedCalendarYear.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedCalendarYear]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        connectedtoroad: selectedConnectedToRoad?.value ? selectedConnectedToRoad.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedConnectedToRoad]);

  useEffect(() => {
    startTransition(() => {
      if (Boolean(selectedConnectedToRoad?.value)) {
        //If the house is connected to road, we don't send in distance to road request
        return;
      }
      const newQueryString = createQueryString({
        distancetoroad: selectedDistanceToRoad?.value ? selectedDistanceToRoad.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedConnectedToRoad, selectedDistanceToRoad]);

  if (isOnDesktop) {
    return (
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
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
            <Popover open={isMinRoomCountOpen} onOpenChange={setIsMinRoomCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedMinRoomCount ? <>{selectedMinRoomCount.label}</> : <>Min Room:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsMinRoomCountOpen}
                  setSelectedFilter={setSelectedMinRoomCount}
                  toFilter={roomCountFilter}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isMaxRoomCountOpen} onOpenChange={setIsMaxRoomCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedMaxRoomCount ? <>{selectedMaxRoomCount.label}</> : <>Max Room:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsMaxRoomCountOpen}
                  setSelectedFilter={setSelectedMaxRoomCount}
                  toFilter={roomCountFilter}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isFloorCountOpen} onOpenChange={setIsFloorCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedFloorCount ? <>{selectedFloorCount.label}</> : <>Floors:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsFloorCountOpen}
                  setSelectedFilter={setSelectedFloorCount}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isMinFloorCountOpen} onOpenChange={setIsMinFloorCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedMinFloorCount ? <>{selectedMinFloorCount.label}</> : <>Min Floor:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsMinFloorCountOpen}
                  setSelectedFilter={setSelectedMinFloorCount}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isMaxFloorCountOpen} onOpenChange={setIsMaxFloorCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedMaxFloorCount ? <>{selectedMaxFloorCount.label}</> : <>Max Floor:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsMaxFloorCountOpen}
                  setSelectedFilter={setSelectedMaxFloorCount}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isKitchenCountOpen} onOpenChange={setIsKitchenCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedKitchenCount ? <>{selectedKitchenCount.label}</> : <>Kitchen:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsKitchenCountOpen}
                  setSelectedFilter={setSelectedKitchenCount}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isMinKitchenCountOpen} onOpenChange={setIsMinKitchenCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedMinKitchenCount ? (
                    <>{selectedMinKitchenCount.label}</>
                  ) : (
                    <>Min Kitchen:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsMinKitchenCountOpen}
                  setSelectedFilter={setSelectedMinKitchenCount}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isMaxKitchenCountOpen} onOpenChange={setIsMaxKitchenCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedMaxKitchenCount ? (
                    <>{selectedMaxKitchenCount.label}</>
                  ) : (
                    <>Max Kitchen:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsMaxKitchenCountOpen}
                  setSelectedFilter={setSelectedMaxKitchenCount}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isSharedBathroomOptionOpen} onOpenChange={setIsSharedBathroomOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[160px] justify-between p-2">
                  {selectedSharedBathroomOption ? (
                    <>{selectedSharedBathroomOption.label}</>
                  ) : (
                    <>Shared Bathroom:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[160px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsSharedBathroomOptionOpen}
                  setSelectedFilter={setSelectedBathroomOption}
                  toFilter={sharedBathroomFilter}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isMinBathroomCountOpen} onOpenChange={setIsMinBathroomCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedMinBathroomCount ? (
                    <>{selectedMinBathroomCount.label}</>
                  ) : (
                    <>Min Bathroom:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsMinBathroomCountOpen}
                  setSelectedFilter={setSelectedMinBathroomCount}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isMaxBathroomCountOpen} onOpenChange={setIsMaxBathroomCountOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedMaxBathroomCount ? (
                    <>{selectedMaxBathroomCount.label}</>
                  ) : (
                    <>Max Bathroom:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsMaxBathroomCountOpen}
                  setSelectedFilter={setSelectedMaxBathroomCount}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isFurnishedOptionOpen} onOpenChange={setIsFurnishedOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedFurnishedOption ? <>{selectedFurnishedOption.label}</> : <>Furnished:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsFurnishedOptionOpen}
                  setSelectedFilter={setSelectedFurnishedOption}
                  toFilter={furnishedFilter}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isFacingOptionOpen} onOpenChange={setIsFacingOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedFacingOption ? <>{selectedFacingOption.label}</> : <>Facing:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsFacingOptionOpen}
                  setSelectedFilter={setSelectedFacingOption}
                  toFilter={facingFilter}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isFacingOptionOpen} onOpenChange={setIsFacingOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedFacingOption ? <>{selectedFacingOption.label}</> : <>Facing:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsFacingOptionOpen}
                  setSelectedFilter={setSelectedFacingOption}
                  toFilter={facingFilter}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isCarParkingOptionOpen} onOpenChange={setIsCarParkingOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedCarParkingOption ? (
                    <>{selectedCarParkingOption.label}</>
                  ) : (
                    <>Car Parking:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsCarParkingOptionOpen}
                  setSelectedFilter={setSelectedCarParkingOption}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isBikeParkingOptionOpen} onOpenChange={setIsBikeParkingOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[125px] justify-between p-2">
                  {selectedBikeParkingOption ? (
                    <>{selectedBikeParkingOption.label}</>
                  ) : (
                    <>Bike Parking:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[125px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsBikeParkingOptionOpen}
                  setSelectedFilter={setSelectedBikeParkingOption}
                  toFilter={uptoTenCount}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isEVChargingOptionOpen} onOpenChange={setIsEVChargingOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[135px] justify-between p-2">
                  {selectedEVChargingOption ? (
                    <>{selectedEVChargingOption.label}</>
                  ) : (
                    <>EV Charging:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[135px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsEVChargingOptionOpen}
                  setSelectedFilter={setSelectedEVChargingOption}
                  toFilter={evChargingFilter}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isCalendarOptionOpen} onOpenChange={setIsCalendarOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[135px] justify-between p-2">
                  {selectedEVChargingOption ? (
                    <>{selectedEVChargingOption.label}</>
                  ) : (
                    <>Built Year:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[135px] p-0" align="start">
                <FilterList
                  withCommandInput
                  withCommandText="Search Year"
                  setIsOpen={setIsCalendarOptionOpen}
                  setSelectedFilter={setSelectedCalendarYear}
                  toFilter={yearList}
                />
              </PopoverContent>
            </Popover>
            <Popover open={isCalendarOptionOpen} onOpenChange={setIsCalendarOptionOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[135px] justify-between p-2">
                  {selectedEVChargingOption ? (
                    <>{selectedEVChargingOption.label}</>
                  ) : (
                    <>Built Year:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[135px] p-0" align="start">
                <FilterList
                  withCommandInput
                  withCommandText="Search Year"
                  setIsOpen={setIsCalendarOptionOpen}
                  setSelectedFilter={setSelectedCalendarYear}
                  toFilter={yearList}
                />
              </PopoverContent>
            </Popover>
            <Popover
              open={isConnectedToRoadOptionOpen}
              onOpenChange={setIsConnectedToRoadOptionOpen}
            >
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-between p-2">
                  {selectedConnectedToRoad ? (
                    <>{selectedConnectedToRoad.label}</>
                  ) : (
                    <>Connected to road:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[150px] p-0" align="start">
                <FilterList
                  setIsOpen={setIsConnectedToRoadOptionOpen}
                  setSelectedFilter={setSelectedConnectedToRoad}
                  toFilter={roadConnected}
                />
              </PopoverContent>
            </Popover>
            {selectedConnectedToRoad?.value ? (
              selectedConnectedToRoad.value === "false" ? (
                <Popover
                  open={isDistanceToRoadOptionOpen}
                  onOpenChange={setIsDistanceToRoadOptionOpen}
                >
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[200px] justify-between p-2">
                      {selectedDistanceToRoad ? (
                        <>{selectedDistanceToRoad.label}</>
                      ) : (
                        <>Distance to road:</>
                      )}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <FilterList
                      setIsOpen={setIsDistanceToRoadOptionOpen}
                      setSelectedFilter={setSelectedDistanceToRoad}
                      toFilter={distanceToRoad}
                    />
                  </PopoverContent>
                </Popover>
              ) : null
            ) : null}
            {/* <Popover open={isCalendarOptionOpen} onOpenChange={setIsCalendarOptionOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <Icons.calendar className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover> */}
          </>
        ) : null}
      </div>
    );
  }

  return <div className="flex items-center space-x-2"></div>;
}
