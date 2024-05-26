"use server";

import { TrendingPageProps } from "./page";
import { getListOfProperties } from "@/actions/property";
import { Suspense } from "react";
import PropertyCardSkeletonList from "../../_components/property-skeleton-list";
import PropertyList from "../../_components/properties-list";
import { PropertyPageContent } from "@/components/property-page-content";

export default async function TrendingPageSection(props: TrendingPageProps) {
  let pageNumber = Number(props?.searchParams?.page) || 1;

  if (pageNumber <= 0) {
    pageNumber = 1;
  }

  //getListOfProperties fetches properties and sorts it by views count by default
  const listOfTrendingProperties = getListOfProperties(pageNumber);

  return (
    <PropertyPageContent
      title="Trending Properties"
      description="View properties that are trending right now"
      className="pt-6"
    >
      <Suspense fallback={<PropertyCardSkeletonList numberOfSkeletons={6} />}>
        <PropertyList propertyListPromise={listOfTrendingProperties} />
      </Suspense>
    </PropertyPageContent>
  );
}
