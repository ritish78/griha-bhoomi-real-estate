import { redirect } from "next/navigation";
import { getListOfFeaturedProperties } from "@/actions/property";
import { PropertyPageContent } from "@/components/property-page-content";
import { Suspense } from "react";
import PropertyCardSkeletonList from "../../_components/property-skeleton-list";
import PropertyListPage from "../_components/properties-list-page";
import { ListOfPropertiesResponse } from "@/types/property";
import PaginationButton from "@/components/pagination-button";

export interface FeaturedPageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function FeaturedPage(props: FeaturedPageProps) {
  const pageNumber = Number(props?.searchParams?.page) || 1;

  if (pageNumber <= 0) {
    redirect("/property/featured?page=1");
  }

  const listOfFeaturedProperties: ListOfPropertiesResponse = await getListOfFeaturedProperties(
    pageNumber,
    12
  );

  if ("error" in listOfFeaturedProperties) {
    return <p>Oops! An error occurred! {listOfFeaturedProperties.error}</p>;
  }

  return (
    <div className="container bg-slate-50 dark:bg-transparent pb-8 flex flex-col space-y-8">
      <PropertyPageContent
        title="Featured Properties"
        description="View properties that we think you might be interested in"
        className="pt-6"
      >
        <Suspense fallback={<PropertyCardSkeletonList numberOfSkeletons={6} />}>
          <PropertyListPage propertyList={listOfFeaturedProperties} />
        </Suspense>
      </PropertyPageContent>
      <PaginationButton totalPages={listOfFeaturedProperties.numberOfPages} page={pageNumber} />
    </div>
  );
}
