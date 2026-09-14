import { redirect } from "next/navigation";
import { getFilteredListOfProperties } from "@/actions/property";
import { ListOfPropertiesResponse } from "@/types/property";
import PropertyListPage from "../_components/properties-list-page";
import PaginationButton from "@/components/pagination-button";
import { Shell } from "@/components/shell";
import SearchSheet from "./_components/search-sheet";
import { Metadata } from "next";

export interface SearchPropertyPageProps {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams: Promise<Record<string, string | number | null>>;
}

export const metadata: Metadata = {
  title: "Search Properties - GrihaBhoomi",
  description: "Search your perfect properties at GrihaBhoomi"
};

function createQueryString(
  params: Record<string, string | number | null>,
  newPage: number
): string {
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
  const searchParams = await props.searchParams;
  const pageNumber = Number(searchParams.page) || 1;

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
  if (
    listOfFilteredProperty.currentPageNumber > listOfFilteredProperty.numberOfPages &&
    listOfFilteredProperty.numberOfPages > 0
  ) {
    redirect(
      `/property/search?${createQueryString(searchParams, listOfFilteredProperty.numberOfPages || 1)}`
    );
  }

  const hasResults = listOfFilteredProperty.properties.length > 0;
  const totalResults = listOfFilteredProperty.properties.length;

  return (
    <Shell className="pb-12 md:pb-14">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">Find your next property</h1>

          <p className="text-muted-foreground">
            Search by location, price and the details that matter to you.
          </p>
        </div>

        <SearchSheet>
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Search results</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Showing {totalResults} {totalResults === 1 ? "property" : "properties"}
                {listOfFilteredProperty.numberOfPages > 1 &&
                  ` · Page ${pageNumber} of ${listOfFilteredProperty.numberOfPages}`}
              </p>
            </div>

            {hasResults ? (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] items-stretch gap-4">
                  <PropertyListPage propertyList={listOfFilteredProperty} />
                </div>

                {listOfFilteredProperty.numberOfPages > 1 && (
                  <div className="flex justify-center pt-4">
                    <PaginationButton
                      searchParams={searchParams}
                      totalPages={listOfFilteredProperty.numberOfPages}
                      page={pageNumber}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-xl border border-dashed px-6 py-16 text-center">
                <h3 className="text-lg font-semibold">No matching properties</h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  Try widening your price or room range, or reset your filters and apply again.
                </p>
              </div>
            )}
          </div>
        </SearchSheet>
      </div>
    </Shell>
  );
}
