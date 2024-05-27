import { redirect } from "next/navigation";
import { getListOfProperties } from "@/actions/property";
import { PropertyPageContent } from "@/components/property-page-content";
import { Suspense } from "react";
import PropertyCardSkeletonList from "../../_components/property-skeleton-list";
import PropertyListPage from "../_components/properties-list-page";
import { ListOfPropertiesResponse } from "@/types/property";
import PaginationButton from "@/components/pagination-button";

export interface TrendingPageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function TrendingPage(props: TrendingPageProps) {
  const pageNumber = Number(props?.searchParams?.page) || 1;

  if (pageNumber <= 0) {
    redirect("/property/featured?page=1");
  }

  //getListOfProperties fetches properties and sorts it by views count by default
  const listOfTrendingProperties: ListOfPropertiesResponse = await getListOfProperties(
    pageNumber,
    12
  );

  if ("error" in listOfTrendingProperties) {
    return <p>Oops! An error occurred! {listOfTrendingProperties.error}</p>;
  }

  return (
    <div className="container bg-slate-50 dark:bg-transparent pb-8 flex flex-col space-y-8">
      <PropertyPageContent
        title="Trending Properties"
        description="View properties that are trending right now"
        className="pt-6"
      >
        <Suspense fallback={<PropertyCardSkeletonList numberOfSkeletons={6} />}>
          <PropertyListPage propertyList={listOfTrendingProperties} />
        </Suspense>
      </PropertyPageContent>
      <PaginationButton totalPages={listOfTrendingProperties.numberOfPages} page={pageNumber} />
    </div>
  );
}
