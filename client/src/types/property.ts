export interface User {
  firstName: string;
  lastName: string;
  phone?: string;
  profilePicUrl?: string;
}

export interface Address {
  street?: string;
  wardNumber?: number | null;
  municipality?: string | null;
  city?: string | null;
  district?: string | null;
  province?: string | null;
  latitude?: string | null;
  longitude?: string | null;
}

export interface Land {
  landType?: string | null;
  landArea?: string | null;
  length?: string | null;
  breadth?: string | null;
  landConnectedToRoad?: boolean | null;
  landDistanceToRoad?: number | null;
}

export interface House {
  houseType?: string | null;
  roomCount?: number | null;
  floorCount?: number | null;
  kitchenCount?: number | null;
  sharedBathroom?: boolean | null;
  bathroomCount?: number | null;
  facilities?: string[] | null;
  houseFacing?: string | null;
  carParking?: number | null;
  bikeParking?: number | null;
  evCharging?: boolean | null;
  builtAt?: string | null;
  houseArea?: string | null;
  furnished?: boolean | null;
  houseConnectedToRoad?: boolean | null;
  houseDistanceToRoad?: number | null;
}

export interface Property extends Address, Land, House, User {
  id: string;
  sellerId: string;
  propertyTypeId: string;
  title: string;
  slug: string;
  description: string;
  toRent: boolean;
  closeLandmark: string;
  propertyType: "House" | "Land";
  availableFrom: string;
  availableTill: string;
  price: number;
  negotiable: boolean;
  imageUrl: string[];
  status: "Sale" | "Rent" | "Hold" | "Sold";
  listedAt: string;
  updatedAt: string;
  featured: boolean;
  private: boolean;
  expiresOn: string;
  views: number;
}

export type PartialProperty = Partial<Property>;

export type ListOfProperties = {
  currentPageNumber: number;
  numberOfPages: number;
  limit?: number;
  properties: Property[];
};
