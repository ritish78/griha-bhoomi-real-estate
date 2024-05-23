export type Property = {
  id: string;
  sellerId: string;
  propertyTypeId: string;
  title: string;
  slug: string;
  description: string;
  toRent: boolean;
  street?: string;
  municipality?: string;
  city?: string;
  district?: string;
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
  roomCount?: number | null;
  bathroomCount?: number | null;
  houseArea?: string | null;
  length?: string | null;
  breadth?: string | null;
  landArea?: string | null;
};

export type PartialProperty = Partial<Property>;

export type ListOfProperties = {
  currentPageNumber: number;
  numberOfPages?: number;
  limit?: number;
  properties: [] | Property[];
};
