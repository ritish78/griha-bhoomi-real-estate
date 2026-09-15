export type FacilityPropertyType = "House" | "Land";

export type FacilityGroup =
  "Water & sanitation" | "Power & connectivity" | "Outdoor space" | "Security & access" | "Site features";

export interface FacilityDefinition {
  id: string;
  label: string;
  group: FacilityGroup;
  propertyTypes: readonly FacilityPropertyType[];
}

const BOTH: readonly FacilityPropertyType[] = ["House", "Land"];
const HOUSE: readonly FacilityPropertyType[] = ["House"];
const LAND: readonly FacilityPropertyType[] = ["Land"];

export const FACILITIES: readonly FacilityDefinition[] = [
  {
    id: "water_connection",
    label: "Water connection",
    group: "Water & sanitation",
    propertyTypes: BOTH
  },
  {
    id: "water_storage",
    label: "Water storage tank",
    group: "Water & sanitation",
    propertyTypes: HOUSE
  },
  {
    id: "well_borewell",
    label: "Well / borewell",
    group: "Water & sanitation",
    propertyTypes: BOTH
  },
  {
    id: "solar_hot_water",
    label: "Solar hot water",
    group: "Water & sanitation",
    propertyTypes: HOUSE
  },
  {
    id: "geyser",
    label: "Geyser",
    group: "Water & sanitation",
    propertyTypes: HOUSE
  },
  {
    id: "sewer_connection",
    label: "Sewer connection",
    group: "Water & sanitation",
    propertyTypes: BOTH
  },
  {
    id: "septic_tank",
    label: "Septic tank",
    group: "Water & sanitation",
    propertyTypes: BOTH
  },
  {
    id: "electricity_connection",
    label: "Electricity connection",
    group: "Power & connectivity",
    propertyTypes: BOTH
  },
  {
    id: "inverter_backup",
    label: "Inverter / battery backup",
    group: "Power & connectivity",
    propertyTypes: HOUSE
  },
  {
    id: "generator_backup",
    label: "Generator backup",
    group: "Power & connectivity",
    propertyTypes: HOUSE
  },
  {
    id: "solar_electricity",
    label: "Solar electricity",
    group: "Power & connectivity",
    propertyTypes: HOUSE
  },
  {
    id: "internet_connection",
    label: "Installed internet connection",
    group: "Power & connectivity",
    propertyTypes: HOUSE
  },
  {
    id: "balcony",
    label: "Balcony",
    group: "Outdoor space",
    propertyTypes: HOUSE
  },
  {
    id: "terrace_access",
    label: "Terrace access",
    group: "Outdoor space",
    propertyTypes: HOUSE
  },
  {
    id: "garden",
    label: "Garden",
    group: "Outdoor space",
    propertyTypes: HOUSE
  },
  {
    id: "boundary_wall",
    label: "Boundary wall",
    group: "Site features",
    propertyTypes: BOTH
  },
  {
    id: "boundary_fence",
    label: "Boundary fence",
    group: "Site features",
    propertyTypes: BOTH
  },
  {
    id: "gate",
    label: "Gate",
    group: "Site features",
    propertyTypes: BOTH
  },
  {
    id: "irrigation_access",
    label: "Irrigation access",
    group: "Site features",
    propertyTypes: LAND
  },
  {
    id: "drainage_channel",
    label: "Drainage channel",
    group: "Site features",
    propertyTypes: LAND
  },
  {
    id: "cctv",
    label: "CCTV in common areas",
    group: "Security & access",
    propertyTypes: HOUSE
  },
  {
    id: "security_guard",
    label: "Security guard",
    group: "Security & access",
    propertyTypes: HOUSE
  },
  {
    id: "lift",
    label: "Lift",
    group: "Security & access",
    propertyTypes: HOUSE
  }
];

export const FACILITY_GROUPS: readonly FacilityGroup[] = [
  "Water & sanitation",
  "Power & connectivity",
  "Outdoor space",
  "Security & access",
  "Site features"
];

export function facilitiesForType(propertyType: FacilityPropertyType) {
  return FACILITIES.filter((facility) => facility.propertyTypes.includes(propertyType));
}

export function isFacilityAllowed(id: string, propertyType: FacilityPropertyType) {
  return FACILITIES.some((facility) => facility.id === id && facility.propertyTypes.includes(propertyType));
}
