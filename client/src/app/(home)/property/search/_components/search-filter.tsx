"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
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

import { Input } from "@/components/ui/input";

// import { Slider } from "@nextui-org/slider";

import { FilterList, type Filter } from "@/components/layout/filter-list";

interface SearchFilterProps extends React.HTMLAttributes<HTMLElement> {
  isOnDesktop: boolean;
}


const propertyFilter: Filter[] = [
  {
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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
    value: null,
    label: "---Any---"
  },
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

// interface SearchFilters {
//   [key: string]: Filter | null;
// [key: string]: string | null;
// propertyType: Filter | null;
// status: Filter | null;
// minprice: Filter | null;
// maxprice: Filter | null;
// houseType: Filter | null;
// roomcount: Filter | null;
// minroomcount: Filter | null;
// maxroomcount: Filter | null;
// floorcount: Filter | null;
// minfloorcount: Filter | null;
// maxfloorcount: Filter | null;
// kitchencount: Filter | null;
// minkitchencount: Filter | null;
// maxkitchencount: Filter | null;
// sharedbathroom: Filter | null;
// minbathroomcount: Filter | null;
// maxbathroomcount: Filter | null;
// furnished: Filter | null;
// facing: Filter | null;
// carparking: Filter | null;
// bikeparking: Filter | null;
// evcharging: Filter | null;
// builtat: Filter | null;
// houseconnectedtoroad: Filter | null;
// landType: Filter | null;
// landconnectedtoroad: Filter | null;
// }

// const defaultParams: SearchFilters = {
//   propertyType: null,
//   status: null,
//   minprice: null,
//   maxprice: null,
//   houseType: null,
//   roomcount: null,
//   minroomcount: null,
//   maxroomcount: null,
//   floorcount: null,
//   minfloorcount: null,
//   maxfloorcount: null,
//   kitchencount: null,
//   minkitchencount: null,
//   maxkitchencount: null,
//   sharedbathroom: null,
//   minbathroomcount: null,
//   maxbathroomcount: null,
//   furnished: null,
//   facing: null,
//   carparking: null,
//   bikeparking: null,
//   evcharging: null,
//   builtat: null,
//   houseconnectedtoroad: null,
//   landType: null,
//   landconnectedtoroad: null
// };

export default function SearchFilter({ isOnDesktop }: SearchFilterProps) {
  const searchParams = useSearchParams();
  const [showMoreFilters, setShowMoreFilters] = useState(false);


  const [isPropertyTypeOpen, setIsPropertyTypeOpen] = useState(false);
  const [selectedPropertyType, setSelectedPropertyType] = useState<Filter | null>(null);
  const [isRentOpen, setIsRentOpen] = useState(false);
  const [selectedRent, setSelectedRent] = useState<Filter | null>(null);

  //For range slider
  // const [value, setValue] = useState([1, 4]);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

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
  // const searchParams = useSearchParams();
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
    const params = new URLSearchParams(window.location.search);

    const propertyTypeFromUrl = params.get('propertytype');
    if (propertyTypeFromUrl) {
      //In the below code, we are checking if the propertytype = House or Land. We could directly
      //check if the property type is House or Land directly but incase we add more property types
      //in the future, we don't need to change the code here
      const propertyType = propertyFilter.find(element => element.value === propertyTypeFromUrl);
      if (propertyType) {
        setSelectedPropertyType(propertyType);
      }
    }

  
    const rentStatusFromUrl = params.get('status');
    if (rentStatusFromUrl) {
      const rentStatus = rentFilter.find(element => element.value === rentStatusFromUrl);
      if (rentStatus) {
        setSelectedRent(rentStatus);
      }
    }

    const minPriceFromUrl = params.get('minprice');
    if (minPriceFromUrl) {
      setMinPrice(minPriceFromUrl);
    }

    const maxPriceFromUrl = params.get('maxprice');
    if (maxPriceFromUrl) {
      setMaxPrice(maxPriceFromUrl);
    }

    const houseTypeFromUrl = params.get('housetype');
    if (houseTypeFromUrl) {
      const houseType = houseTypeFilter.find(element => element.value === houseTypeFromUrl);
      if (houseType) {
        setSelectedHouseType(houseType);
      }
    }
    
    const roomCountFromUrl = params.get('roomcount');
    if (roomCountFromUrl) {
      const roomCount = roomCountFilter.find(element => element.value === roomCountFromUrl);
      if (roomCount) {
        setSelectedRoomCount(roomCount);
      }
    }
    
    const minRoomCountFromUrl = params.get('minroomcount');
    if (minRoomCountFromUrl) {
      const minRoomCount = roomCountFilter.find(element => element.value === minRoomCountFromUrl);
      if (minRoomCount) {
        setSelectedMinRoomCount(minRoomCount);
      }
    }

    const maxRoomCountFromUrl = params.get('maxroomcount');
    if (maxRoomCountFromUrl) {
      const maxRoomCount = roomCountFilter.find(element => element.value === maxRoomCountFromUrl);
      if (maxRoomCount) {
        setSelectedMaxRoomCount(maxRoomCount);
      }
    }

    const floorCountFromUrl = params.get('floorcount');
    if (floorCountFromUrl) {
      const floorCount = uptoTenCount.find(element => element.value === floorCountFromUrl);
      if (floorCount) {
        setSelectedFloorCount(floorCount);
      }
    }

    const minFloorCountFromUrl = params.get('minfloorcount');
    if (minFloorCountFromUrl) {
      const minFloorCount = uptoTenCount.find(element => element.value === minFloorCountFromUrl);
      if (minFloorCount) {
        setSelectedMinFloorCount(minFloorCount);
      }
    }

    const maxFloorCountFromUrl = params.get('maxfloorcount');
    if (maxFloorCountFromUrl) {
      const maxFloorCount = uptoTenCount.find(element => element.value === maxFloorCountFromUrl);
      if (maxFloorCount) {
        setSelectedMaxFloorCount(maxFloorCount);
      }
    }
    
    const kitchenCountFromUrl = params.get('kitchencount');
    if (kitchenCountFromUrl) {
      const kitchenCount = uptoTenCount.find(element => element.value === kitchenCountFromUrl);
      if (kitchenCount) {
        setSelectedKitchenCount(kitchenCount);
      }
    }
    
    const minKitchenCountFromUrl = params.get('minkitchencount');
    if (minKitchenCountFromUrl) {
      const minKitchenCount = uptoTenCount.find(element => element.value === minKitchenCountFromUrl);
      if (minKitchenCount) {
        setSelectedMinKitchenCount(minKitchenCount);
      }
    }

    const maxKitchenCountFromUrl = params.get('maxkitchencount');
    if (maxKitchenCountFromUrl) {
      const maxKitchenCount = uptoTenCount.find(element => element.value === maxKitchenCountFromUrl);
      if (maxKitchenCount) {
        setSelectedMaxKitchenCount(maxKitchenCount);
      }
    }
    const sharedBathroomFromUrl = params.get('sharedbathroom');
    if (sharedBathroomFromUrl) {
      const sharedBathroom = sharedBathroomFilter.find(element => element.value === sharedBathroomFromUrl);
      if (sharedBathroom) {
        setSelectedBathroomOption(sharedBathroom);
      }
    }

    const minBathroomCountFromUrl = params.get('minbathroomcount');
    if (minBathroomCountFromUrl) {
      const minBathroomCount = roomCountFilter.find(element => element.value === minBathroomCountFromUrl);
      if (minBathroomCount) {
        setSelectedMinBathroomCount(minBathroomCount);
      }
    }

    const maxBathroomCountFromUrl = params.get('maxbathroomcount');
    if (maxBathroomCountFromUrl) {
      const maxBathroomCount = roomCountFilter.find(element => element.value === maxBathroomCountFromUrl);
      if (maxBathroomCount) {
        setSelectedMaxBathroomCount(maxBathroomCount);
      }
    }

    const furnishedFromUrl = params.get('furnished');
    if (furnishedFromUrl) {
      const furnished = furnishedFilter.find(element => element.value === furnishedFromUrl);
      if (furnished) {
        setSelectedFurnishedOption(furnished);
      }
    }
  
    const facingFromUrl = params.get('facing');
    if (facingFromUrl) {
      const facing = facingFilter.find(element => element.value === facingFromUrl);
      if (facing) {
        setSelectedFacingOption(facing);
      }
    }
  
    const carParkingFromUrl = params.get('carparking');
    if (carParkingFromUrl) {
      const carParking = uptoTenCount.find(element => element.value === carParkingFromUrl);
      if (carParking) {
        setSelectedCarParkingOption(carParking);
      }
    }
    
    const bikeParkingFromUrl = params.get('bikeparking');
    if (bikeParkingFromUrl) {
      const bikeParking = uptoTenCount.find(element => element.value === bikeParkingFromUrl);
      if (bikeParking) {
        setSelectedBikeParkingOption(bikeParking);
      }
    }
    
    const evChargingFromUrl = params.get('evcharging');
    if (evChargingFromUrl) {
      const evCharging = evChargingFilter.find(element => element.value === evChargingFromUrl);
      if (evCharging) {
        setSelectedEVChargingOption(evCharging);
      }
    }
    
    const builtYearFromUrl = params.get('builtat');
    if (builtYearFromUrl) {
      const builtYear = yearList.find(element => element.value === builtYearFromUrl);
      if (builtYear) {
        setSelectedCalendarYear(builtYear);
      }
    }
    
    const houseConnectedToRoadFromUrl = params.get('houseconnectedtoroad');
    if (houseConnectedToRoadFromUrl) {
      const houseConnectedToRoad = roadConnected.find(element => element.value === houseConnectedToRoadFromUrl);
      if (houseConnectedToRoad) {
        setSelectedHouseConnectedToRoad(houseConnectedToRoad);
      }
    }
    
    const houseDistanceToRoadFromUrl = params.get('housedistancetoroad');
    if (houseDistanceToRoadFromUrl) {
      const houseDistanceToRoad = uptoTenCount.find(element => element.value === houseDistanceToRoadFromUrl);
      if (houseDistanceToRoad) {
        setSelectedHouseDistanceToRoad(houseDistanceToRoad);
      }
    }
    
    const landTypeFromUrl = params.get('landtype');
    if (landTypeFromUrl) {
      const landType = landTypeFilter.find(element => element.value === landTypeFromUrl);
      if (landType) {
        setSelectedLandTypeOption(landType);
      }
    }
    
    const landConnectedToRoadFromUrl = params.get('landconnectedtoroad');
    if (landConnectedToRoadFromUrl) {
      const landConnectedToRoad = roadConnected.find(element => element.value === landConnectedToRoadFromUrl);
      if (landConnectedToRoad) {
        setSelectedLandConnectedToRoad(landConnectedToRoad);
      }
    }
    
    const landDistanceToRoadFromUrl = params.get('landdistancetoroad');
    if (landDistanceToRoadFromUrl) {
      const landDistanceToRoad = uptoTenCount.find(element => element.value === landDistanceToRoadFromUrl);
      if (landDistanceToRoad) {
        setSelectedLandDistanceToRoad(landDistanceToRoad);
      }
    }
  }, [])

  useEffect(() => {
    const hasUrlParams = window.location.search.length > 0;
    const hasState = selectedPropertyType || selectedRent || minPrice || maxPrice || selectedHouseType || 
                              selectedRoomCount || selectedMinRoomCount || selectedMaxRoomCount || selectedFloorCount || 
                              selectedMinFloorCount || selectedMaxFloorCount || selectedKitchenCount || 
                              selectedMinKitchenCount || selectedMaxKitchenCount || selectedSharedBathroomOption || 
                              selectedMinBathroomCount || selectedMaxBathroomCount || selectedFurnishedOption || 
                              selectedFacingOption || selectedCarParkingOption || selectedBikeParkingOption || 
                              selectedEVChargingOption || selectedCalendarYear || selectedHouseConnectedToRoad || 
                              selectedHouseDistanceToRoad || selectedLandTypeOption || selectedLandConnectedToRoad || 
                              selectedLandDistanceToRoad;
  
    if (!hasUrlParams && !hasState) {
      return;
    }

    startTransition(() => {
      const newQueryString = createQueryString({
        propertytype: selectedPropertyType?.value || null,
        status: selectedRent?.value || null,
        minprice: minPrice.trim().length > 0 && (maxPrice.trim().length === 0 || Number(maxPrice) === 0 || Number(minPrice) < Number(maxPrice)) ? minPrice : null,
        maxprice: maxPrice.trim().length > 0 && (minPrice.trim().length === 0 || Number(minPrice) === 0 || Number(maxPrice) > Number(minPrice)) ? maxPrice : null,
        housetype: selectedHouseType?.value ? selectedHouseType.value : null,
        roomcount: selectedRoomCount?.value ? selectedRoomCount.value : null,
        minroomcount: selectedMinRoomCount?.value ? selectedMinRoomCount.value : null,
        maxroomcount: selectedMaxRoomCount?.value ? selectedMaxRoomCount.value : null,
        floorcount: selectedFloorCount?.value ? selectedFloorCount.value : null,
        minfloorcount: selectedMinFloorCount?.value ? selectedMinFloorCount.value : null,
        maxfloorcount: selectedMaxFloorCount?.value ? selectedMaxFloorCount.value : null,
        kitchencount: selectedKitchenCount?.value ? selectedKitchenCount.value : null,
        minkitchencount: selectedMinKitchenCount?.value ? selectedMinKitchenCount.value : null,
        maxkitchencount: selectedMaxKitchenCount?.value ? selectedMaxKitchenCount.value : null,
        sharedbathroom: selectedSharedBathroomOption?.value ? selectedSharedBathroomOption.value : null,
        minbathroomcount: selectedMinBathroomCount?.value ? selectedMinBathroomCount.value : null,
        maxbathroomcount: selectedMaxBathroomCount?.value ? selectedMaxBathroomCount.value : null,
        furnished: selectedFurnishedOption?.value ? selectedFurnishedOption.value : null,
        facing: selectedFacingOption?.value ? selectedFacingOption.value : null,
        carparking: selectedCarParkingOption?.value ? selectedCarParkingOption.value : null,
        bikeparking: selectedBikeParkingOption?.value ? selectedBikeParkingOption.value : null,
        evcharging: selectedEVChargingOption?.value ? selectedEVChargingOption.value : null,
        builtat: selectedCalendarYear?.value ? selectedCalendarYear.value : null,
        houseconnectedtoroad: selectedHouseConnectedToRoad?.value ? selectedHouseConnectedToRoad.value : null,
        housedistancetoroad: selectedHouseDistanceToRoad?.value ? selectedHouseDistanceToRoad.value : null,
        landtype: selectedLandTypeOption?.value ? selectedLandTypeOption.value : null,
        landconnectedtoroad: selectedLandConnectedToRoad?.value ? selectedLandConnectedToRoad.value : null,
        landdistancetoroad: selectedLandDistanceToRoad?.value ? selectedLandDistanceToRoad.value : null,
      });

      //console.log(newQueryString);

      router.push(`${pathname}?${newQueryString}`, {
        scroll: false
      });

    })

  }, [selectedPropertyType, selectedRent, minPrice, maxPrice, selectedHouseType, selectedRoomCount, selectedMinRoomCount, 
      selectedMaxRoomCount, selectedFloorCount, selectedMinFloorCount, selectedMaxFloorCount, selectedKitchenCount, 
      selectedMinKitchenCount, selectedMaxKitchenCount, selectedSharedBathroomOption, selectedMinBathroomCount, 
      selectedMaxBathroomCount, selectedFurnishedOption, selectedFacingOption, selectedCarParkingOption, 
      selectedBikeParkingOption, selectedEVChargingOption, selectedCalendarYear, selectedHouseConnectedToRoad, 
      selectedHouseDistanceToRoad, selectedLandTypeOption, selectedLandConnectedToRoad, selectedLandDistanceToRoad]);


useEffect(() => {
  if (selectedPropertyType === null && !window.location.search.includes('propertytype')) {
    return;
  }

  if (selectedPropertyType?.value == null) {
    setSelectedHouseType(null);
    setSelectedRoomCount(null);
    setSelectedMinRoomCount(null);
    setSelectedMaxRoomCount(null);
    setSelectedFloorCount(null);
    setSelectedMinFloorCount(null);
    setSelectedMaxFloorCount(null);
    setSelectedKitchenCount(null);
    setSelectedMinKitchenCount(null);
    setSelectedMaxKitchenCount(null);
    setSelectedBathroomOption(null);
    setSelectedMinBathroomCount(null);
    setSelectedMaxBathroomCount(null);
    setSelectedFurnishedOption(null);
    setSelectedFacingOption(null);
    setSelectedCarParkingOption(null);
    setSelectedBikeParkingOption(null);
    setSelectedEVChargingOption(null);
    setSelectedCalendarYear(null);
    setSelectedHouseConnectedToRoad(null);
    setSelectedHouseDistanceToRoad(null);
    setSelectedLandTypeOption(null);
    setSelectedLandConnectedToRoad(null);
    setSelectedLandDistanceToRoad(null);
  }
  

  else if (selectedPropertyType?.value === "House") {
    setSelectedLandTypeOption(null);
    setSelectedLandConnectedToRoad(null);
    setSelectedLandDistanceToRoad(null);
  }
  

  else if (selectedPropertyType?.value === "Land") {
    setSelectedHouseType(null);
    setSelectedRoomCount(null);
    setSelectedMinRoomCount(null);
    setSelectedMaxRoomCount(null);
    setSelectedFloorCount(null);
    setSelectedMinFloorCount(null);
    setSelectedMaxFloorCount(null);
    setSelectedKitchenCount(null);
    setSelectedMinKitchenCount(null);
    setSelectedMaxKitchenCount(null);
    setSelectedBathroomOption(null);
    setSelectedMinBathroomCount(null);
    setSelectedMaxBathroomCount(null);
    setSelectedFurnishedOption(null);
    setSelectedFacingOption(null);
    setSelectedCarParkingOption(null);
    setSelectedBikeParkingOption(null);
    setSelectedEVChargingOption(null);
    setSelectedCalendarYear(null);
    setSelectedHouseConnectedToRoad(null);
    setSelectedHouseDistanceToRoad(null);
  }
}, [selectedPropertyType]);



  const ParentShell = isOnDesktop ? Popover : Drawer;
  const ChildrenShell = isOnDesktop ? PopoverTrigger : DrawerTrigger;
  const ContentShell = isOnDesktop ? PopoverContent : DrawerContent;

  return (
    <div
      className={
        isOnDesktop
          ? `grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1 md:gap-2 lg:gap:3`
          : `grid grid-cols-2 gap-3 items-start`
      }
    >
      <div className="flex flex-col gap-2">
        <Label className="text-sm">Property Type:</Label>
        <ParentShell open={isPropertyTypeOpen} onOpenChange={setIsPropertyTypeOpen}>
          <ChildrenShell asChild>
            <Button
              variant="outline"
              className={
                isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
              }
            >
              {selectedPropertyType ? <>{selectedPropertyType.label}</> : <>{"\u00A0"}</>}
              <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
      <div className="flex flex-col gap-2">
        <Label className="text-sm">Buy or Rent:</Label>
        <ParentShell open={isRentOpen} onOpenChange={setIsRentOpen}>
          <ChildrenShell asChild>
            <Button
              variant="outline"
              className={
                isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
              }
            >
              {selectedRent ? <>{selectedRent.label}</> : <>{"\u00A0"}</>}
              <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
      <div className="flex flex-col gap-2">
        <Label htmlFor="minPrice" className="text-sm">Minimum Price:</Label>
        <Input
          type="number"
          id="minPrice"
          min={0}
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          placeholder="0"
          className={isOnDesktop ? "rounded-md p-2 w-[175px]" : "rounded-md p-2 w-full"}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="maxPrice" className="text-sm">Maximum Price:</Label>
        <Input
          type="number"
          id="maxPrice"
          min={0}
          value={maxPrice}
          placeholder="0"
          className={isOnDesktop ? "rounded-md p-2 w-[175px]" : "rounded-md p-2 w-full"}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
      {selectedPropertyType && selectedPropertyType.value === "House" ? (
        <>
          <div className="flex flex-col gap-2">
            <Label className="text-sm">House Type:</Label>
            <ParentShell open={isHouseTypeOpen} onOpenChange={setIsHouseTypeOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedHouseType ? <>{selectedHouseType.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Number of rooms:</Label>
            <ParentShell open={isRoomCountOpen} onOpenChange={setIsRoomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedRoomCount ? <>{selectedRoomCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Number of floors:</Label>
            <ParentShell open={isFloorCountOpen} onOpenChange={setIsFloorCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedFloorCount ? <>{selectedFloorCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Built Year:</Label>
            <ParentShell open={isCalendarOptionOpen} onOpenChange={setIsCalendarOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedCalendarYear ? <>{selectedCalendarYear.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
           {/* Toggle Button */}
            <div className="col-span-full flex justify-center my-2">
              <Button
                variant="ghost"
                onClick={() => setShowMoreFilters(!showMoreFilters)}
                className="flex items-center gap-2"
              >
                {showMoreFilters ? "Show Less Filters" : "Show More Filters"}
                {showMoreFilters ? <Icons.upArrow /> : <Icons.downArrow />}
              </Button>
            </div>
          {showMoreFilters && (
          <>
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Minimum number of rooms:</Label>
            <ParentShell open={isMinRoomCountOpen} onOpenChange={setIsMinRoomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedMinRoomCount ? <>{selectedMinRoomCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Maximum number of rooms:</Label>
            <ParentShell open={isMaxRoomCountOpen} onOpenChange={setIsMaxRoomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedMaxRoomCount ? <>{selectedMaxRoomCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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

          <div className="flex flex-col gap-2">
            <Label className="text-sm">Minimum number of floors:</Label>
            <ParentShell open={isMinFloorCountOpen} onOpenChange={setIsMinFloorCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedMinFloorCount ? <>{selectedMinFloorCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Maximum number of floors:</Label>
            <ParentShell open={isMaxFloorCountOpen} onOpenChange={setIsMaxFloorCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedMaxFloorCount ? <>{selectedMaxFloorCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Number of Kitchen:</Label>
            <ParentShell open={isKitchenCountOpen} onOpenChange={setIsKitchenCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedKitchenCount ? <>{selectedKitchenCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Minimum number of Kitchen:</Label>
            <ParentShell open={isMinKitchenCountOpen} onOpenChange={setIsMinKitchenCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedMinKitchenCount ? <>{selectedMinKitchenCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Maximum number of Kitchen:</Label>
            <ParentShell open={isMaxKitchenCountOpen} onOpenChange={setIsMaxKitchenCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedMaxKitchenCount ? <>{selectedMaxKitchenCount.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Shared Bathroom:</Label>
            <ParentShell
              open={isSharedBathroomOptionOpen}
              onOpenChange={setIsSharedBathroomOptionOpen}
            >
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedSharedBathroomOption ? (
                    <>{selectedSharedBathroomOption.label}</>
                  ) : (
                    <>{"\u00A0"}</>
                  )}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Minimum number of Bathroom:</Label>
            <ParentShell open={isMinBathroomCountOpen} onOpenChange={setIsMinBathroomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedMinBathroomCount ? (
                    <>{selectedMinBathroomCount.label}</>
                  ) : (
                    <>{"\u00A0"}</>
                  )}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Maximum number of bathroom:</Label>
            <ParentShell open={isMaxBathroomCountOpen} onOpenChange={setIsMaxBathroomCountOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedMaxBathroomCount ? (
                    <>{selectedMaxBathroomCount.label}</>
                  ) : (
                    <>{"\u00A0"}</>
                  )}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Furnished:</Label>
            <ParentShell open={isFurnishedOptionOpen} onOpenChange={setIsFurnishedOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedFurnishedOption ? <>{selectedFurnishedOption.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Facing direction:</Label>
            <ParentShell open={isFacingOptionOpen} onOpenChange={setIsFacingOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedFacingOption ? <>{selectedFacingOption.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Car Parking:</Label>
            <ParentShell open={isCarParkingOptionOpen} onOpenChange={setIsCarParkingOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedCarParkingOption ? (
                    <>{selectedCarParkingOption.label}</>
                  ) : (
                    <>{"\u00A0"}</>
                  )}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Bike Parking:</Label>
            <ParentShell open={isBikeParkingOptionOpen} onOpenChange={setIsBikeParkingOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedBikeParkingOption ? (
                    <>{selectedBikeParkingOption.label}</>
                  ) : (
                    <>{"\u00A0"}</>
                  )}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">EV Charging:</Label>
            <ParentShell open={isEVChargingOptionOpen} onOpenChange={setIsEVChargingOptionOpen}>
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedEVChargingOption ? (
                    <>{selectedEVChargingOption.label}</>
                  ) : (
                    <>{"\u00A0"}</>
                  )}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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

          <div className="flex flex-col gap-2">
            <Label className="text-sm">Connected to road:</Label>
            <ParentShell
              open={isHouseConnectedToRoadOptionOpen}
              onOpenChange={setIsHouseConnectedToRoadOptionOpen}
            >
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedHouseConnectedToRoad ? (
                    <>{selectedHouseConnectedToRoad.label}</>
                  ) : (
                    <>{"\u00A0"}</>
                  )}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Distance to road:</Label>
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
                        <>{"\u00A0"}</>
                      )}
                      <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
        )}
        </>
      ) : selectedPropertyType?.value === "Land" ? (
        <>
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Land Type:</Label>
            <ParentShell open={isLandTypeOptionOpen} onOpenChange={setIsLandTypeOptionOpen}>
              <ChildrenShell asChild>
                <Button variant="outline" className="w-[175px] justify-between p-2 overflow-hidden">
                  {selectedLandTypeOption ? <>{selectedLandTypeOption.label}</> : <>{"\u00A0"}</>}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
          <div className="flex flex-col gap-2">
            <Label className="text-sm">Connected to road:</Label>
            <ParentShell
              open={isLandConnectedToRoadOptionOpen}
              onOpenChange={setIsLandConnectedToRoadOptionOpen}
            >
              <ChildrenShell asChild>
                <Button
                  variant="outline"
                  className={
                    isOnDesktop ? "w-[175px] justify-between p-2" : "w-full justify-between p-2"
                  }
                >
                  {selectedLandConnectedToRoad ? (
                    <>{selectedLandConnectedToRoad.label}</>
                  ) : (
                    <>{"\u00A0"}</>
                  )}
                  <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
              <div className="flex flex-col gap-2">
                <Label className="text-sm">Distance to road:</Label>
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
                        <>{"\u00A0"}</>
                      )}
                      <Icons.upDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
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
