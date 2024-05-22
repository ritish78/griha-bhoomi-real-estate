export type Property = {
  id: string;
  sellerId: string;
  propertyTypeId: string;
  title: string;
  slug: string;
  description: string;
  toRent: boolean;
  address: string;
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
};

export type PartialProperty = Partial<Property>;

export type ListOfProperties = {
  currentPageNumber: number;
  numberOfPages?: number;
  limit?: number;
  properties: [] | Property[];
};
