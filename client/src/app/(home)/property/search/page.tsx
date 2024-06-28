import { redirect } from "next/navigation";
import { getFilteredListOfProperties } from "@/actions/property";
import { ListOfPropertiesResponse } from "@/types/property";
import { PropertyPageContent } from "@/components/property-page-content";
import { Suspense, useCallback, useMemo } from "react";
import PropertyCardSkeletonList from "../../_components/property-skeleton-list";
import PropertyListPage from "../_components/properties-list-page";
import PaginationButton from "@/components/pagination-button";

import SearchSheet from "./_components/search-sheet";

export interface SearchPropertyPageProps {
  params: { [key: string]: string | string[] | undefined };
  // searchParams: { [key: string]: string | string[] | undefined };
  searchParams: Record<string, string | number | null>;
}

export default async function SearchPropertyPage(props: SearchPropertyPageProps) {
  const searchParams = props.searchParams;
  const pageNumber = Number(props?.searchParams?.page) || 1;

  // if (
  //   pageNumber <= 0 ||
  //   Number(props?.searchParams?.page) === 0 ||
  //   isNaN(Number(props?.searchParams?.page))
  // ) {
  //   redirect("/property/search?page=1");
  // }

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>, newPage: number) => {
      const newSearchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          newSearchParams.append(key, String(value));
        }
      }
      newSearchParams.set("page", String(newPage));
      return newSearchParams.toString();
    },
    [searchParams]
  );

  const queryString = createQueryString(searchParams, pageNumber);

  console.log("Page Number", pageNumber);
  console.log("Query String", queryString);

  let listOfFilteredProperty: ListOfPropertiesResponse =
    await getFilteredListOfProperties(queryString);

  if ("error" in listOfFilteredProperty) {
    return <p>Oops! An error occurred! {listOfFilteredProperty.error}</p>;
  }

  console.log("Number of pages in filtered property", listOfFilteredProperty.numberOfPages);

  if (listOfFilteredProperty.currentPageNumber > listOfFilteredProperty.numberOfPages) {
    redirect(`/property/search?${createQueryString(searchParams, 1)}`);
  }

  console.log("Current page number", listOfFilteredProperty.currentPageNumber);

  return (
    <div className="container bg-slate-50 dark:bg-transparent pb-8 flex flex-col space-y-8">
      <div>
        <div className="mt-4 pb-4">
          <h2 className="text-lg font-bold leading-[1.1] md:text-xl mb-2">
            Apply filters to get your perfect property
          </h2>
          <SearchSheet />
        </div>
        <PropertyPageContent
          title="Your properties search result"
          description="View properties that you filtered"
          className="pt-6"
        >
          <Suspense fallback={<PropertyCardSkeletonList numberOfSkeletons={6} />}>
            <PropertyListPage propertyList={listOfFilteredProperty} />
          </Suspense>
        </PropertyPageContent>
        <PaginationButton
          searchParams={searchParams}
          totalPages={listOfFilteredProperty.numberOfPages}
          page={pageNumber}
        />
      </div>
    </div>
  );
}
