import PropertyCard from "@/components/property-card";
import { ListOfProperties } from "@/types/property";

interface PropertyListProps {
  propertyListPromise: Promise<ListOfProperties>;
}
//Just for testing purpose
function simulateNetworkDelay(milliseconds: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default async function PropertyList({ propertyListPromise }: PropertyListProps) {
  const listOfProperties = await propertyListPromise;

  await simulateNetworkDelay(1000);

  return listOfProperties.properties.map((property) => (
    <PropertyCard property={property} key={property.id} />
  ));
}
