import PropertyCard from "@/components/property-card";
import { ListOfPropertiesSuccess } from "@/types/property";

interface PropertyListPage {
  propertyList: ListOfPropertiesSuccess;
}

export default async function PropertyListPage({ propertyList }: PropertyListPage) {
  return propertyList.properties.map((property) => (
    <PropertyCard property={property} key={property.id} />
  ));
}
