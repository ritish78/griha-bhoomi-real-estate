import PropertyCard from "@/components/property-card";
import { ListOfProperties } from "@/types/property";
import { redirect } from "next/navigation";

interface PropertyListProps {
  currentPage?: number;
  page?: string;
  propertyListPromise: Promise<ListOfProperties>;
}
//Just for testing purpose
function simulateNetworkDelay(milliseconds: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default async function PropertyList({
  currentPage = 1,
  page = "home",
  propertyListPromise
}: PropertyListProps) {
  const listOfProperties = await propertyListPromise;

  if (currentPage > listOfProperties.numberOfPages) {
    //TODO: Is it better to redirect user here or in server actions?
    //https://nextjs.org/docs/app/building-your-application/routing/redirecting
    redirect(`/property/${page}?page=${listOfProperties.numberOfPages}`);
  }

  await simulateNetworkDelay(1000);

  return listOfProperties.properties.map((property) => (
    <PropertyCard property={property} key={property.id} />
  ));
}
