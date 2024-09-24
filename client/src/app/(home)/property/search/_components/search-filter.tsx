"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription
} from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";

import { Slider } from "@nextui-org/slider";

import { FilterList, type Filter } from "@/components/layout/filter-list";

interface SearchFilterProps extends React.HTMLAttributes<HTMLElement> {
  isOnDesktop: boolean;
}

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
    value: "Sale",
    label: "Buy"
  },
  {
    value: "Rent",
    label: "Rent"
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

const landTypeFilter: Filter[] = [
  {
    value: "residential",
    label: "Residential - To build home"
  },
  {
    value: "agricultural",
    label: "Agricultural - To grow crops"
  },
  {
    value: "plotting",
    label: "Plotting - Can build home"
  },
  {
    value: "industrial",
    label: "Industrial - To start business"
  }
];

export default function SearchFilter({ isOnDesktop }: SearchFilterProps) {
  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<Filter | null>(null);
  const [isRentOpen, setIsRentOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState<Filter | null>(null);
  //For range slider
  const [value, setValue] = useState([1, 4]);

  //House Filtering
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
  const [isHouseConnectedToRoadOptionOpen, setIsHouseConnectedToRoadOptionOpen] = useState(false);
  const [selectedHouseConnectedToRoad, setSelectedHouseConnectedToRoad] = useState<Filter | null>(
    null
  );
  const [isHouseDistanceToRoadOptionOpen, setIsHouseDistanceToRoadOptionOpen] = useState(false);
  const [selectedHouseDistanceToRoad, setSelectedHouseDistanceToRoad] = useState<Filter | null>(
    null
  );
  //Land filtering
  const [isLandTypeOptionOpen, setIsLandTypeOptionOpen] = useState(false);
  const [selectedLandTypeOption, setSelectedLandTypeOption] = useState<Filter | null>(null);
  const [isLandConnectedToRoadOptionOpen, setIsLandConnectedToRoadOptionOpen] = useState(false);
  const [selectedLandConnectedToRoad, setSelectedLandConnectedToRoad] = useState<Filter | null>(
    null
  );
  const [isLandDistanceToRoadOptionOpen, setIsLandDistanceToRoadOptionOpen] = useState(false);
  const [selectedLandDistanceToRoad, setSelectedLandDistanceToRoad] = useState<Filter | null>(null);

  const yearList = useMemo(() => {
    const thisYear = new Date().getFullYear();
    const years: Filter[] = [];

    for (let i = 1970; i <= thisYear; i++) {
      years.push({ value: String(i), label: String(i) });
    }

    return years;
  }, []);

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
      if (selectedPropertyType?.value === "House") {
        //Setting default value of null if the user switches from "Land" to "House", the applied filters will disappear
        const newQueryString = createQueryString({
          propertytype: selectedPropertyType?.value ? selectedPropertyType.value : null,
          landtype: null,
          landconnectedtoroad: null,
          landdistancetoroad: null
        });

        router.push(`${pathname}?${newQueryString}`, {
          scroll: false
        });
      } else if (selectedPropertyType?.value === "Land") {
        //Setting default value of null if the user switches from "House" to "Land", the applied filters will disappear
        const newQueryString = createQueryString({
          propertytype: selectedPropertyType?.value ? selectedPropertyType.value : null,
          housetype: null,
          roomcount: null,
          minroomcount: null,
          maxroomcount: null,
          floorcount: null,
          minfloorcount: null,
          maxfloorcount: null,
          kitchencount: null,
          minkitchencount: null,
          maxkitchencount: null,
          sharedbathroom: null,
          minbathroomcount: null,
          maxbathroomcount: null,
          furnished: null,
          facing: null,
          carparking: null,
          bikeparking: null,
          evcharging: null,
          builtat: null,
          houseconnectedtoroad: null,
          housedistancetoroad: null
        });

        router.push(`${pathname}?${newQueryString}`, {
          scroll: false
        });
      }
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
      let houseConnectedToRoad = selectedHouseConnectedToRoad?.value
        ? selectedHouseConnectedToRoad.value
        : null;

      let houseDistance = selectedHouseDistanceToRoad?.value
        ? selectedHouseDistanceToRoad.value
        : null;

      if (selectedHouseConnectedToRoad?.value) {
        if (selectedHouseConnectedToRoad.value === "true") {
          // setSelectedHouseDistanceToRoad(null);
          houseDistance = null;
        }
      }

      const newQueryString = createQueryString({
        houseconnectedtoroad: houseConnectedToRoad,
        housedistancetoroad: houseDistance
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedHouseConnectedToRoad, selectedHouseDistanceToRoad]);

  useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        landtype: selectedLandTypeOption?.value ? selectedLandTypeOption.value : null
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedLandTypeOption]);

  useEffect(() => {
    startTransition(() => {
      let landConnectedToRoad = selectedLandConnectedToRoad?.value
        ? selectedLandConnectedToRoad.value
        : null;

      let landDistance = selectedLandDistanceToRoad?.value
        ? selectedLandDistanceToRoad.value
        : null;

      if (selectedLandConnectedToRoad?.value) {
        if (selectedLandConnectedToRoad.value === "true") {
          // setSelectedHouseDistanceToRoad(null);
          landDistance = null;
        }
      }

      const newQueryString = createQueryString({
        landconnectedtoroad: landConnectedToRoad,
        landdistancetoroad: landDistance
      });

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });
    });
  }, [selectedLandConnectedToRoad, selectedLandDistanceToRoad]);

  const ParentShell = isOnDesktop ? Popover : Drawer;
  const ChildrenShell = isOnDesktop ? PopoverTrigger : DrawerTrigger;
  const ContentShell = isOnDesktop ? PopoverContent : DrawerContent;

  return (
    <div
      className={
        isOnDesktop
          ? `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-2 lg:gap:3`
          : `grid grid-cols-2 gap-1`
      }
    >
      <div>
        <p className="text-sm">Property Type:</p>
        <ParentShell open={isPropertyTypeOpen} onOpenChange={setIsPropertyTypeOpen}>
          <ChildrenShell asChild>
            <Button
              variant="outline"
              className={
                isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
              }
            >
              {selectedPropertyType ? <>{selectedPropertyType.label}</> : <>House/Land:</>}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </ChildrenShell>
          <ContentShell
            className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
            align="start"
          >
            {!isOnDesktop && (
              <DrawerHeader>
                <DrawerTitle>Property Type</DrawerTitle>
                <DrawerDescription>Specify the type of property</DrawerDescription>
              </DrawerHeader>
            )}
            <FilterList
              setIsOpen={setIsPropertyTypeOpen}
              setSelectedFilter={setSelectedPropertyType}
              toFilter={propertyFilter}
            />
          </ContentShell>
        </ParentShell>
      </div>
      <div>
        <p className="text-sm">Buy or Rent:</p>
        <ParentShell open={isRentOpen} onOpenChange={setIsRentOpen}>
          <ChildrenShell asChild>
            <Button
              variant="outline"
              className={
                isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
              }
            >
              {selectedRent ? <>{selectedRent.label}</> : <>Buy/Rent:</>}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </ChildrenShell>
          <ContentShell
            className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
            align="start"
          >
            {!isOnDesktop && (
              <DrawerHeader>
                <DrawerTitle>Status</DrawerTitle>
                <DrawerDescription>Do you want to buy or rent?</DrawerDescription>
              </DrawerHeader>
            )}
            <FilterList
              setIsOpen={setIsRentOpen}
              setSelectedFilter={setSelectedRent}
              toFilter={rentFilter}
            />
          </ContentShell>
        </ParentShell>
      </div>
      {selectedPropertyType && selectedPropertyType.value === "House" ? (
        <>
          <div>
            <p className="text-sm">House Type:</p>
            <ParentShell open={isHouseTypeOpen} onOpenChange={setIsHouseTypeOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedHouseType ? <>{selectedHouseType.label}</> : <>House Type:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>House Type</DrawerTitle>
                    <DrawerDescription>Select the type of house</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsHouseTypeOpen}
                  setSelectedFilter={setSelectedHouseType}
                  toFilter={houseTypeFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          {/* <div>
            <p className="text-sm">Number of rooms:</p>
            <Slider
              label="Room Count"
              step={1}
              minValue={1}
              maxValue={25}
              value={value}
              onChange={setValue}
              className="max-w-md"
            />
          </div> */}
          <div>
            <p className="text-sm">Number of rooms:</p>
            <ParentShell open={isRoomCountOpen} onOpenChange={setIsRoomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedRoomCount ? <>{selectedRoomCount.label}</> : <>Room Count:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Number of rooms</DrawerTitle>
                    <DrawerDescription>
                      Specify the number of rooms that you are looking for
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsRoomCountOpen}
                  setSelectedFilter={setSelectedRoomCount}
                  toFilter={roomCountFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Minimum number of rooms:</p>
            <ParentShell open={isMinRoomCountOpen} onOpenChange={setIsMinRoomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedMinRoomCount ? <>{selectedMinRoomCount.label}</> : <>Min Room:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Minimum number of rooms</DrawerTitle>
                    <DrawerDescription>Select the minimum number of rooms</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsMinRoomCountOpen}
                  setSelectedFilter={setSelectedMinRoomCount}
                  toFilter={roomCountFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Maximum number of rooms:</p>
            <ParentShell open={isMaxRoomCountOpen} onOpenChange={setIsMaxRoomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedMaxRoomCount ? <>{selectedMaxRoomCount.label}</> : <>Max Room:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Maximum number of rooms</DrawerTitle>
                    <DrawerDescription>Select the maximum number of rooms</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsMaxRoomCountOpen}
                  setSelectedFilter={setSelectedMaxRoomCount}
                  toFilter={roomCountFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Number of floors:</p>
            <ParentShell open={isFloorCountOpen} onOpenChange={setIsFloorCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedFloorCount ? <>{selectedFloorCount.label}</> : <>Floors:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Number of floors</DrawerTitle>
                    <DrawerDescription>
                      Select the number of floors the house needs to have
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsFloorCountOpen}
                  setSelectedFilter={setSelectedFloorCount}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Minimum number of floors:</p>
            <ParentShell open={isMinFloorCountOpen} onOpenChange={setIsMinFloorCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedMinFloorCount ? <>{selectedMinFloorCount.label}</> : <>Min Floor:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Minimum number of floors</DrawerTitle>
                    <DrawerDescription>Select the minimum number of floors</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsMinFloorCountOpen}
                  setSelectedFilter={setSelectedMinFloorCount}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Maximum number of floors:</p>
            <ParentShell open={isMaxFloorCountOpen} onOpenChange={setIsMaxFloorCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedMaxFloorCount ? <>{selectedMaxFloorCount.label}</> : <>Max Floor:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Maximum number of floors</DrawerTitle>
                    <DrawerDescription>Select the maximum number of floors</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsMaxFloorCountOpen}
                  setSelectedFilter={setSelectedMaxFloorCount}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Number of Kitchen:</p>
            <ParentShell open={isKitchenCountOpen} onOpenChange={setIsKitchenCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedKitchenCount ? <>{selectedKitchenCount.label}</> : <>Kitchen:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Number of Kitchen</DrawerTitle>
                    <DrawerDescription>Select number of Kitchen</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsKitchenCountOpen}
                  setSelectedFilter={setSelectedKitchenCount}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Minimum number of Kitchen:</p>
            <ParentShell open={isMinKitchenCountOpen} onOpenChange={setIsMinKitchenCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedMinKitchenCount ? (
                    <>{selectedMinKitchenCount.label}</>
                  ) : (
                    <>Min Kitchen:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Minimum number of Kitchen</DrawerTitle>
                    <DrawerDescription>Select minimum number of Kitchen</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsMinKitchenCountOpen}
                  setSelectedFilter={setSelectedMinKitchenCount}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Maximum number of Kitchen:</p>
            <ParentShell open={isMaxKitchenCountOpen} onOpenChange={setIsMaxKitchenCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedMaxKitchenCount ? (
                    <>{selectedMaxKitchenCount.label}</>
                  ) : (
                    <>Max Kitchen:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Maximum number of Kitchen</DrawerTitle>
                    <DrawerDescription>Select maximum number of Kitchen</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsMaxKitchenCountOpen}
                  setSelectedFilter={setSelectedMaxKitchenCount}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Shared Bathroom:</p>
            <ParentShell
              open={isSharedBathroomOptionOpen}
              onOpenChange={setIsSharedBathroomOptionOpen}
            >
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedSharedBathroomOption ? (
                    <>{selectedSharedBathroomOption.label}</>
                  ) : (
                    <>Shared Bathroom:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Shared Bathroom</DrawerTitle>
                    <DrawerDescription>
                      Do you want to have share bathroom with other?
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsSharedBathroomOptionOpen}
                  setSelectedFilter={setSelectedBathroomOption}
                  toFilter={sharedBathroomFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Minimum number of Bathroom:</p>
            <ParentShell open={isMinBathroomCountOpen} onOpenChange={setIsMinBathroomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedMinBathroomCount ? (
                    <>{selectedMinBathroomCount.label}</>
                  ) : (
                    <>Min Bathroom:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Minimum number of bathroom</DrawerTitle>
                    <DrawerDescription>Select the minimum number of bathroom</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsMinBathroomCountOpen}
                  setSelectedFilter={setSelectedMinBathroomCount}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Maximum number of bathroom:</p>
            <ParentShell open={isMaxBathroomCountOpen} onOpenChange={setIsMaxBathroomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedMaxBathroomCount ? (
                    <>{selectedMaxBathroomCount.label}</>
                  ) : (
                    <>Max Bathroom:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Maximum number of bathroom</DrawerTitle>
                    <DrawerDescription>Select the maximum number of bathroom</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsMaxBathroomCountOpen}
                  setSelectedFilter={setSelectedMaxBathroomCount}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Furnished:</p>
            <ParentShell open={isFurnishedOptionOpen} onOpenChange={setIsFurnishedOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedFurnishedOption ? <>{selectedFurnishedOption.label}</> : <>Furnished:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Furnished</DrawerTitle>
                    <DrawerDescription>Do you want the house to be furnished?</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsFurnishedOptionOpen}
                  setSelectedFilter={setSelectedFurnishedOption}
                  toFilter={furnishedFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Facing direction:</p>
            <ParentShell open={isFacingOptionOpen} onOpenChange={setIsFacingOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedFacingOption ? <>{selectedFacingOption.label}</> : <>Facing:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>House Facing</DrawerTitle>
                    <DrawerDescription>
                      What direction do you want the house to face?
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsFacingOptionOpen}
                  setSelectedFilter={setSelectedFacingOption}
                  toFilter={facingFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Car Parking:</p>
            <ParentShell open={isCarParkingOptionOpen} onOpenChange={setIsCarParkingOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedCarParkingOption ? (
                    <>{selectedCarParkingOption.label}</>
                  ) : (
                    <>Car Parking:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Car Parking</DrawerTitle>
                    <DrawerDescription>
                      Select number of car parking spaces that you need
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsCarParkingOptionOpen}
                  setSelectedFilter={setSelectedCarParkingOption}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Bike Parking:</p>
            <ParentShell open={isBikeParkingOptionOpen} onOpenChange={setIsBikeParkingOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedBikeParkingOption ? (
                    <>{selectedBikeParkingOption.label}</>
                  ) : (
                    <>Bike Parking:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Bike Parking</DrawerTitle>
                    <DrawerDescription>
                      Select number of bike parking spaces that you need
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsBikeParkingOptionOpen}
                  setSelectedFilter={setSelectedBikeParkingOption}
                  toFilter={uptoTenCount}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">EV Charging:</p>
            <ParentShell open={isEVChargingOptionOpen} onOpenChange={setIsEVChargingOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedEVChargingOption ? (
                    <>{selectedEVChargingOption.label}</>
                  ) : (
                    <>EV Charging:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>EV Charging Facility</DrawerTitle>
                    <DrawerDescription>
                      Do you want to have EV Charging Facility already available?
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsEVChargingOptionOpen}
                  setSelectedFilter={setSelectedEVChargingOption}
                  toFilter={evChargingFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Built Year:</p>
            <ParentShell open={isCalendarOptionOpen} onOpenChange={setIsCalendarOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedEVChargingOption ? (
                    <>{selectedEVChargingOption.label}</>
                  ) : (
                    <>Built Year:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Built year</DrawerTitle>
                    <DrawerDescription>
                      Only the house that are built after the year that you chose will be displayed
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  withCommandInput
                  withCommandText="Search Year"
                  setIsOpen={setIsCalendarOptionOpen}
                  setSelectedFilter={setSelectedCalendarYear}
                  toFilter={yearList}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Connected to road:</p>
            <ParentShell
              open={isHouseConnectedToRoadOptionOpen}
              onOpenChange={setIsHouseConnectedToRoadOptionOpen}
            >
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedHouseConnectedToRoad ? (
                    <>{selectedHouseConnectedToRoad.label}</>
                  ) : (
                    <>Connected to road:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>House connected to road</DrawerTitle>
                    <DrawerDescription>
                      Does the house needs to be connected with the road?
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsHouseConnectedToRoadOptionOpen}
                  setSelectedFilter={setSelectedHouseConnectedToRoad}
                  toFilter={roadConnected}
                />
              </ContentShell>
            </ParentShell>
          </div>
          {selectedHouseConnectedToRoad?.value ? (
            selectedHouseConnectedToRoad.value === "false" ? (
              <div>
                <p className="text-sm">Distance to road:</p>
                <ParentShell
                  open={isHouseDistanceToRoadOptionOpen}
                  onOpenChange={setIsHouseDistanceToRoadOptionOpen}
                >
                  <ChildrenShell asChild>
                    <Button
                      variant="outline"
                      className={
                        isOnDesktop
                          ? "w-[175px] justify-between p-2"
                          : "w-[165px] justify-between p-2"
                      }
                    >
                      {selectedHouseDistanceToRoad ? (
                        <>{selectedHouseDistanceToRoad.label}</>
                      ) : (
                        <>Distance to road:</>
                      )}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </ChildrenShell>
                  <ContentShell
                    className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                    align="start"
                  >
                    {!isOnDesktop && (
                      <DrawerHeader>
                        <DrawerTitle>Distance to road</DrawerTitle>
                        <DrawerDescription>
                          Select the distance the house needs to be from the road
                        </DrawerDescription>
                      </DrawerHeader>
                    )}
                    <FilterList
                      setIsOpen={setIsHouseDistanceToRoadOptionOpen}
                      setSelectedFilter={setSelectedHouseDistanceToRoad}
                      toFilter={distanceToRoad}
                    />
                  </ContentShell>
                </ParentShell>
              </div>
            ) : null
          ) : null}
        </>
      ) : selectedPropertyType?.value === "Land" ? (
        <>
          <div>
            <p className="text-sm">Land Type:</p>
            <ParentShell open={isLandTypeOptionOpen} onOpenChange={setIsLandTypeOptionOpen}>
              <ChildrenShell asChild>
                <Button variant="outline" className="w-[175px] justify-between p-2 overflow-hidden">
                  {selectedLandTypeOption ? <>{selectedLandTypeOption.label}</> : <>Land Type:</>}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[250px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Land Type</DrawerTitle>
                    <DrawerDescription>Select the type of land</DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsLandTypeOptionOpen}
                  setSelectedFilter={setSelectedLandTypeOption}
                  toFilter={landTypeFilter}
                />
              </ContentShell>
            </ParentShell>
          </div>
          <div>
            <p className="text-sm">Connected to road:</p>
            <ParentShell
              open={isLandConnectedToRoadOptionOpen}
              onOpenChange={setIsLandConnectedToRoadOptionOpen}
            >
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-[165px] justify-between p-2"
                  }
                >
                  {selectedLandConnectedToRoad ? (
                    <>{selectedLandConnectedToRoad.label}</>
                  ) : (
                    <>Connected to road:</>
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </ChildrenShell>
              <ContentShell
                className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                align="start"
              >
                {!isOnDesktop && (
                  <DrawerHeader>
                    <DrawerTitle>Connected to road</DrawerTitle>
                    <DrawerDescription>
                      Do you want the land to be connected to the road?
                    </DrawerDescription>
                  </DrawerHeader>
                )}
                <FilterList
                  setIsOpen={setIsLandConnectedToRoadOptionOpen}
                  setSelectedFilter={setSelectedLandConnectedToRoad}
                  toFilter={roadConnected}
                />
              </ContentShell>
            </ParentShell>
          </div>
          {selectedLandConnectedToRoad?.value ? (
            selectedLandConnectedToRoad.value === "false" ? (
              <div>
                <p className="text-sm">Distance to road:</p>
                <ParentShell
                  open={isLandDistanceToRoadOptionOpen}
                  onOpenChange={setIsLandDistanceToRoadOptionOpen}
                >
                  <ChildrenShell asChild>
                    <Button
                      variant="outline"
                      className={
                        isOnDesktop
                          ? "w-[175px] justify-between p-2"
                          : "w-[165px] justify-between p-2"
                      }
                    >
                      {selectedLandDistanceToRoad ? (
                        <>{selectedLandDistanceToRoad.label}</>
                      ) : (
                        <>Distance to road:</>
                      )}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </ChildrenShell>
                  <ContentShell
                    className={isOnDesktop ? `w-[175px] p-0` : "mt-10 mb-5 border-t"}
                    align="start"
                  >
                    {!isOnDesktop && (
                      <DrawerHeader>
                        <DrawerTitle>Distance to road</DrawerTitle>
                        <DrawerDescription>
                          Select the distance the land needs to be from the road
                        </DrawerDescription>
                      </DrawerHeader>
                    )}
                    <FilterList
                      setIsOpen={setIsLandDistanceToRoadOptionOpen}
                      setSelectedFilter={setSelectedLandDistanceToRoad}
                      toFilter={distanceToRoad}
                    />
                  </ContentShell>
                </ParentShell>
              </div>
            ) : null
          ) : null}
        </>
      ) : null}
    </div>
  );
}
