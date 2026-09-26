import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import { Shell } from "@/components/shell";
import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatAddress } from "@/lib/formatAddress";
import { formatPrice } from "@/lib/formatPrice";
import { getMyProperties, type MyProperty, type MyPropertyFilter } from "@/lib/getMyProperties";
import PropertyActions from "../[propertySlug]/_components/property-action";

const filters: { value: MyPropertyFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unexpired", label: "Unexpired" },
  { value: "expired", label: "Expired" }
];

function getListingsUrl(filter: MyPropertyFilter, page = 1) {
  return `/property/my-listings?${new URLSearchParams({ filter, page: String(page) })}`;
}

//We use the same Featured badge and award icon as the search property card.
function FeaturedBadge() {
  return (
    <Badge variant="default" className="p-2 border-0 shadow-sm whitespace-nowrap">
      <Icons.award className="size-4" aria-hidden="true" />
      <span className="ml-2 font-semibold text-shadow-sm">Featured</span>
    </Badge>
  );
}

function PropertyDetails({ property }: { property: MyProperty }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <Link
        href={`/property/${property.slug}`}
        className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted"
      >
        {property.imageUrl?.[0] ? (
          <Image
            src={property.imageUrl[0]}
            alt={property.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center" aria-label={property.title}>
            <Icons.house className="size-6 text-muted-foreground" aria-hidden="true" />
          </span>
        )}
      </Link>
      <div className="min-w-0 space-y-1">
        <Link
          href={`/property/${property.slug}`}
          className="line-clamp-2 font-semibold hover:underline break-words"
        >
          {property.title}
        </Link>
        <p className="text-sm text-muted-foreground break-words">
          {formatAddress(property) || "Location not provided"}
        </p>
        {property.private && <Badge variant="outline">Private</Badge>}
      </div>
    </div>
  );
}

function PropertyPrice({ property }: { property: MyProperty }) {
  return (
    <div className="font-semibold tabular-nums">
      Rs. {formatPrice(property.price, "en-US")}
      {property.toRent && (
        <span className="block text-xs font-normal text-muted-foreground">per month</span>
      )}
    </div>
  );
}

function PropertyExpiry({ property }: { property: MyProperty }) {
  //Expiry is separate from Sale, Rent, Hold or Sold status.
  const date = property.expiresOn.slice(0, 10);
  return (
    <div className="space-y-1">
      {property.isExpired && <Badge variant="outline">Expired</Badge>}
      <p className="text-sm text-muted-foreground">
        {property.isExpired ? "Expired on " : "Expires on "}
        <time dateTime={date}>{date}</time>
      </p>
    </div>
  );
}

interface MyListingsPageProps {
  searchParams: Promise<{
    filter?: string | string[];
    page?: string | string[];
  }>;
}

export default async function MyListingsPage({ searchParams }: MyListingsPageProps) {
  const query = await searchParams;

  //We only accept the filters that are available on this page.
  //If the filter is not provided or is invalid, we show all listings.
  const filter = filters.find((item) => item.value === query.filter)?.value ?? "all";

  const requestedPage = typeof query.page === "string" ? Number(query.page) : 1;

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 && requestedPage <= 1000000
      ? requestedPage
      : 1;

  const result = await getMyProperties(filter, page);

  //The backend gets the current user from their session.
  //If the session has expired, we ask the user to sign in again.
  if (!result.success && (result.status === 401 || result.status === 403)) {
    redirect(`/login?redirect=${encodeURIComponent(getListingsUrl(filter, page))}`);
  }

  //After deleting a listing, we return to the same filter and page.
  //The backend adjusts the page if the last listing on that page was deleted.
  const returnTo = getListingsUrl(filter, result.success ? result.data.page : page);

  return (
    <Shell className="pb-12 md:pb-14 bg-slate-50 dark:bg-transparent/5">
      <div className="container max-w-7xl min-w-0 px-0 sm:px-4 py-6 lg:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">My Listings</h1>
            <p className="mt-2 text-muted-foreground">Manage your property listings.</p>
          </div>

          <Button asChild className="font-medium tracking-wide group">
            <Link href="/property/new">
              <Icons.plus className="mr-2 size-4" aria-hidden="true" />
              Post Property
            </Link>
          </Button>
        </div>

        {!result.success ? (
          <Card>
            <CardContent className="p-6 space-y-4">
              <p role="alert">{result.error}</p>

              <Button asChild variant="outline">
                <Link href={returnTo}>Try again</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* We keep the selected filter in the URL so it is preserved when refreshing. */}
            <nav aria-label="Filter your listings" className="mb-6 flex flex-wrap gap-2">
              {filters.map((item) => (
                <Button
                  key={item.value}
                  asChild
                  size="sm"
                  variant={filter === item.value ? "default" : "outline"}
                >
                  <Link
                    href={getListingsUrl(item.value)}
                    aria-current={filter === item.value ? "page" : undefined}
                  >
                    {item.label} ({result.data.counts[item.value]})
                  </Link>
                </Button>
              ))}
            </nav>

            {result.data.properties.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center space-y-2">
                  <h2 className="text-lg font-semibold">
                    {filter === "all"
                      ? "You have not posted any listings yet."
                      : `No ${filter} listings.`}
                  </h2>

                  <p className="text-muted-foreground">
                    {filter === "all"
                      ? "Create your first property listing using Post Property above."
                      : "Try another filter to see your other listings."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* We show the listings as a table on desktop. */}
                <Card className="hidden lg:block overflow-hidden rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <caption className="sr-only">
                        Your property listings, featured status and expiry
                      </caption>

                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th scope="col" className="p-4 font-medium text-muted-foreground">
                            Property
                          </th>
                          <th scope="col" className="p-4 font-medium text-muted-foreground">
                            Price
                          </th>
                          <th scope="col" className="p-4 font-medium text-muted-foreground">
                            Status
                          </th>
                          <th scope="col" className="p-4 font-medium text-muted-foreground">
                            Featured
                          </th>
                          <th scope="col" className="p-4 font-medium text-muted-foreground">
                            Expiry
                          </th>
                          <th scope="col" className="p-4 font-medium text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {result.data.properties.map((property) => (
                          <tr
                            key={property.id}
                            className="border-b last:border-0 hover:bg-muted/50"
                          >
                            <td className="p-4 max-w-xs">
                              <PropertyDetails property={property} />
                            </td>

                            <td className="p-4">
                              <PropertyPrice property={property} />
                            </td>

                            <td className="p-4">
                              <Badge variant="default" className="p-2">
                                {property.status}
                              </Badge>
                            </td>

                            <td className="p-4">
                              {property.featured ? (
                                <FeaturedBadge />
                              ) : (
                                <span className="text-muted-foreground">No</span>
                              )}
                            </td>

                            <td className="p-4">
                              <PropertyExpiry property={property} />
                            </td>

                            <td className="p-4">
                              {/* was planning to add edit and delete listing on the table itself. But
                              went with three dots which is same in /[propertySlug] page */}
                              {/* <div className="flex items-center"> */}
                              <PropertyActions
                                propertyId={property.id}
                                slug={property.slug}
                                sellerId={property.sellerId}
                                returnToEndpoint={returnTo}
                              />
                              {/* </div> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* On smaller screens, we show the same information in compact cards. */}
                <div className="grid grid-cols-1 gap-4 lg:hidden">
                  {result.data.properties.map((property) => (
                    <Card key={property.id} className="rounded-md overflow-hidden">
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-start justify-between gap-2">
                          <PropertyDetails property={property} />

                          <PropertyActions
                            propertyId={property.id}
                            slug={property.slug}
                            sellerId={property.sellerId}
                            returnToEndpoint={returnTo}
                          />
                        </div>

                        <PropertyPrice property={property} />

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="default" className="p-2">
                            {property.status}
                          </Badge>

                          {property.featured && <FeaturedBadge />}
                        </div>

                        <div className="border-t pt-3">
                          <PropertyExpiry property={property} />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Showing {result.data.counts[filter]} listings. Page {result.data.page} of{" "}
                {result.data.totalPages}
              </p>

              <nav aria-label="Listings pages" className="flex gap-2">
                {result.data.page > 1 ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={getListingsUrl(filter, result.data.page - 1)}>Previous</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                )}

                {result.data.page < result.data.totalPages ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={getListingsUrl(filter, result.data.page + 1)}>Next</Link>
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" disabled>
                    Next
                  </Button>
                )}
              </nav>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
