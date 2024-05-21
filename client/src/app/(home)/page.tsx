import { getListOfProperties } from "@/actions/property";
import { ContentSection } from "@/components/content-section";
import PropertyCard from "@/components/property-card";
import { dummyPropertyData } from "@/dummy-data";

export default async function Home() {
  const listOfProperties = await getListOfProperties();

  console.log("List of properties:", listOfProperties);

  return (
    <main className="container bg-slate-50 dark:bg-transparent pb-8 pt-6">
      <ContentSection
        title="Featured Property"
        description="View properties that we think you might be interested in"
        href="/property"
        linkText="View other featured properties"
      >
        {dummyPropertyData.map((property, index: number) => (
          <PropertyCard link={property.imageUrl[0]} key={index} />
        ))}
      </ContentSection>
      <p className="font-bold text-2xl mt-12 mb-3">Trending Property:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listOfProperties.properties.map((property: any, index: number) => (
          <PropertyCard link={property.imageUrl[0]} key={index} />
        ))}
      </div>
    </main>
  );
}
