import PropertyCard from "@/components/property-card";
import { ListOfPropertiesResponse } from "@/types/property";

interface PropertyListProps {
  propertyListPromise: Promise<ListOfPropertiesResponse>;
}
//Just for testing purpose
function simulateNetworkDelay(milliseconds: number): Promise<any> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export default async function PropertyList({ propertyListPromise }: PropertyListProps) {
  let listOfProperties: ListOfPropertiesResponse;

  listOfProperties = await propertyListPromise;
  await simulateNetworkDelay(1000);

  if ("error" in listOfProperties) {
    return <p>Oops! An error occurred! {listOfProperties.error}</p>;
  }

  return listOfProperties.properties.map((property) => (
    <PropertyCard property={property} key={property.id} />
  ));
}
