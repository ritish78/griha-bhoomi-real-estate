export interface NominatimAddress {
  house_number?: string;
  road?: string;
  pedestrian?: string;
  residential?: string;
  municipality?: string;
  city?: string;
  town?: string;
  village?: string;
  hamlet?: string;
  county?: string;
  state_district?: string;
  state?: string;
  province?: string;
  city_district?: string;
  suburb?: string;
  quarter?: string;
  neighbourhood?: string;
}

export interface NominatimReverseResponse {
  place_id?: number;
  lat?: string;
  lon?: string;
  display_name?: string;
  address?: NominatimAddress;
}
