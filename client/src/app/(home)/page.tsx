import { getListOfFeaturedProperties, getListOfProperties } from "@/actions/property";
import { ContentSection } from "@/components/content-section";
import PropertyCard from "@/components/property-card";
import { dummyPropertyData } from "@/dummy-data";
import { Suspense } from "react";
import PropertyList from "./_components/properties-list";
import PropertyCardSkeletonList from "./_components/property-skeleton-list";
import ErrorBoundary from "./error";

export default async function HomePage() {
  const listOfProperties = getListOfProperties();
  const listOfFeaturedProperties = getListOfFeaturedProperties();

  return (
    <main className="container bg-slate-50 dark:bg-transparent pb-8 pt-6">
      <ContentSection
        title="Featured Property"
        description="View properties that we think you might be interested in"
        href="/property/featured"
        linkText="View other featured properties"
      >
        {dummyPropertyData.map((property) => (
          <PropertyCard property={property} key={property.id} />
        ))}
      </ContentSection>
      <ContentSection
        title="Trending Property"
        description="View properties that are in high demand"
        href="/property/trending"
        linkText="View other trending properties"
        className="mt-20"
      >
        <Suspense fallback={<PropertyCardSkeletonList numberOfSkeletons={6} />}>
          <PropertyList propertyListPromise={listOfProperties} />
        </Suspense>
      </ContentSection>
    </main>
  );
}
