import { redirect } from "next/navigation";
import { getFilteredListOfProperties } from "@/actions/property";
import { ListOfPropertiesResponse } from "@/types/property";
import { PropertyPageContent } from "@/components/property-page-content";
import { Suspense } from "react";
import PropertyCardSkeletonList from "../../_components/property-skeleton-list";
import PropertyListPage from "../_components/properties-list-page";
import PaginationButton from "@/components/pagination-button";
import { Shell } from "@/components/shell";
import SearchSheet from "./_components/search-sheet";

export interface SearchPropertyPageProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams: Record<string, string | number | null>;
}

function createQueryString(params: Record<string, string | number | null>, newPage: number): string {
  const newSearchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && key !== "page") {
      newSearchParams.append(key, String(value));
    }
  }
  newSearchParams.set("page", String(newPage));
  return newSearchParams.toString();
}

export default async function SearchPropertyPage(props: SearchPropertyPageProps) {
  const searchParams = props.searchParams;
  const pageNumber = Number(props?.searchParams?.page) || 1;

  // Validate page number
  if (pageNumber <= 0 || isNaN(pageNumber)) {
    redirect("/property/search?page=1");
  }

  const queryString = createQueryString(searchParams, pageNumber);

  let listOfFilteredProperty: ListOfPropertiesResponse =
    await getFilteredListOfProperties(queryString);

  if ("error" in listOfFilteredProperty) {
    return (
      <Shell className="pb-12 md:pb-14">
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-destructive">Oops! An error occurred</h2>
            <p className="text-muted-foreground">{listOfFilteredProperty.error}</p>
          </div>
        </div>
      </Shell>
    );
  }

  // Redirect if page number exceeds total pages
  if (listOfFilteredProperty.currentPageNumber > listOfFilteredProperty.numberOfPages && listOfFilteredProperty.numberOfPages > 0) {
    redirect(`/property/search?${createQueryString(searchParams, listOfFilteredProperty.numberOfPages || 1)}`);
  }

  const hasResults = listOfFilteredProperty.properties.length > 0;
  const totalResults = listOfFilteredProperty.properties.length;

  return (
    <Shell className="pb-12 md:pb-14 bg-slate-50 dark:bg-transparent">
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">
              Find Your Perfect Property
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Apply filters to narrow down your search and discover properties that match your needs
            </p>
          </div>
          <div className="border rounded-lg bg-card p-4 md:p-6 shadow-sm">
            <SearchSheet />
          </div>
        </div>
        {hasResults ? (
          <>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl md:text-2xl font-bold">
                    Search Results
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Showing {totalResults} {totalResults === 1 ? "property" : "properties"}
                    {listOfFilteredProperty.numberOfPages > 1 && (
                      <span> • Page {pageNumber} of {listOfFilteredProperty.numberOfPages}</span>
                    )}
                  </p>
                </div>
              </div>

              <PropertyPageContent
                title=""
                description=""
                className="pt-0"
              >
                <Suspense fallback={<PropertyCardSkeletonList numberOfSkeletons={6} />}>
                  <PropertyListPage propertyList={listOfFilteredProperty} />
                </Suspense>
              </PropertyPageContent>

              {listOfFilteredProperty.numberOfPages > 1 && (
                <div className="flex justify-center pt-4">
                  <PaginationButton
                    searchParams={searchParams}
                    totalPages={listOfFilteredProperty.numberOfPages}
                    page={pageNumber}
                  />
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 py-12">
            <div className="text-center space-y-3 max-w-md">
              <h2 className="text-2xl md:text-3xl font-bold">No properties found</h2>
              <p className="text-muted-foreground text-base">
                Try adjusting your filters to see more results. You can modify your search criteria using the filters above.
              </p>
            </div>
          </div>
        )}
      </div>
    </Shell>
  );
}
