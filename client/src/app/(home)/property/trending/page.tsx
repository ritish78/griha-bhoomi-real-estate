import { redirect } from "next/navigation";
import { getListOfProperties } from "@/actions/property";
import { PropertyPageContent } from "@/components/property-page-content";
import { Suspense } from "react";
import PropertyCardSkeletonList from "../../_components/property-skeleton-list";
import PropertyListPage from "../_components/properties-list-page";
import { ListOfPropertiesResponse } from "@/types/property";
import PaginationButton from "@/components/pagination-button";
import { Metadata } from "next";

export interface TrendingPageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams: Record<string, string | number | null>;
}

export const metadata: Metadata = {
  title: "Trending Properties - GrihaBhoomi",
  description: "Browse through trending properties at GrihaBhoomi",
};

export default async function TrendingPage(props: TrendingPageProps) {
  const searchParams = props.searchParams;
  const pageNumber = Number(props?.searchParams?.page) || 1;

  if (
    pageNumber < 1 ||
    Number(props?.searchParams?.page) === 0 ||
    isNaN(Number(props?.searchParams?.page))
  ) {
    redirect("/property/trending?page=1");
  }

  //getListOfProperties fetches properties and sorts it by views count by default
  const listOfTrendingProperties: ListOfPropertiesResponse = await getListOfProperties(
    pageNumber,
    18
  );

  if ("error" in listOfTrendingProperties) {
    return <p>Oops! An error occurred! {listOfTrendingProperties.error}</p>;
  }

  if (pageNumber > listOfTrendingProperties.numberOfPages) {
    redirect(`/property/trending?page=${listOfTrendingProperties.numberOfPages}`);
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
      <PaginationButton
        searchParams={searchParams}
        totalPages={listOfTrendingProperties.numberOfPages}
        page={pageNumber}
      />
    </div>
  );
}
