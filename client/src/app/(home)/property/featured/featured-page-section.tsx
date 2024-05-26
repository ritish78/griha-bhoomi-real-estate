"use server";

import { getListOfFeaturedProperties } from "@/actions/property";
import { FeaturedPageProps } from "./page";
import { Suspense } from "react";
import PropertyCardSkeletonList from "../../_components/property-skeleton-list";
import PropertyList from "../../_components/properties-list";
import { PropertyPageContent } from "@/components/property-page-content";

export default async function FeaturedPageSection(props: FeaturedPageProps) {
  let pageNumber = Number(props?.searchParams?.page) || 1;

  if (pageNumber <= 0) {
    pageNumber = 1;
  }

  const listOfFeaturedProperties = getListOfFeaturedProperties(pageNumber);

  return (
    <PropertyPageContent
      title="Featured Properties"
      description="View properties that we think you might be interested in"
      className="pt-6"
    >
      <Suspense fallback={<PropertyCardSkeletonList numberOfSkeletons={6} />}>
        <PropertyList propertyListPromise={listOfFeaturedProperties} />
      </Suspense>
    </PropertyPageContent>
  );
}
