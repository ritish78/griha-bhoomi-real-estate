"use client";

import { useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  useTable,
  tableFeatures,
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature,
  type ColumnDef,
  type SortingState
} from "@tanstack/react-table";

import { Icons } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

import { formatAddress } from "@/lib/formatAddress";
import { formatPrice } from "@/lib/formatPrice";
import type { MyProperty } from "@/lib/getMyProperties";

import PropertyActions from "../../[propertySlug]/_components/property-action";

//These values match the sorting options supported by the backend.
type MyPropertySortBy = "listedAt" | "price" | "title" | "status" | "featured" | "expiresOn";

type MyPropertySortOrder = "asc" | "desc";

interface MyListingsTableProps {
  properties: MyProperty[];
  sortBy: MyPropertySortBy;
  sortOrder: MyPropertySortOrder;
}

//We register the table features used by this component.
//The backend handles the actual sorting and pagination.
const features = tableFeatures({
  rowSortingFeature,
  rowPaginationFeature,
  columnVisibilityFeature
});

type MyListingsTableFeatures = typeof features;

const sortOptions: {
  sortBy: MyPropertySortBy;
  sortOrder: MyPropertySortOrder;
  label: string;
}[] = [
  {
    sortBy: "listedAt",
    sortOrder: "desc",
    label: "Newest first"
  },
  {
    sortBy: "listedAt",
    sortOrder: "asc",
    label: "Oldest first"
  },
  {
    sortBy: "price",
    sortOrder: "asc",
    label: "Price: low to high"
  },
  {
    sortBy: "price",
    sortOrder: "desc",
    label: "Price: high to low"
  },
  {
    sortBy: "title",
    sortOrder: "asc",
    label: "Title: A to Z"
  },
  {
    sortBy: "title",
    sortOrder: "desc",
    label: "Title: Z to A"
  },
  { sortBy: "status", sortOrder: "asc", label: "Status: Rent to Sale" },
  { sortBy: "status", sortOrder: "desc", label: "Status: Sale to Rent" },
  {
    sortBy: "featured",
    sortOrder: "desc",
    label: "Featured first"
  },
  {
    sortBy: "featured",
    sortOrder: "asc",
    label: "Non-featured first"
  },
  {
    sortBy: "expiresOn",
    sortOrder: "asc",
    label: "Expiry: earliest first"
  },
  {
    sortBy: "expiresOn",
    sortOrder: "desc",
    label: "Expiry: latest first"
  }
];

const columns: ColumnDef<MyListingsTableFeatures, MyProperty>[] = [
  {
    accessorKey: "title",
    header: "Property",
    enableSorting: true,
    sortDescFirst: false,
    cell: ({ row }) => {
      const property = row.original;

      return (
        <div className="flex min-w-64 max-w-sm items-start gap-3">
          <Link
            href={`/property/${encodeURIComponent(property.slug)}`}
            className="relative size-16 shrink-0 overflow-hidden rounded-md bg-muted"
            aria-label={`View ${property.title}`}
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
              <span className="flex size-full items-center justify-center">
                <Icons.house className="size-6 text-muted-foreground" aria-hidden="true" />
              </span>
            )}
          </Link>

          <div className="min-w-0 space-y-1">
            <Link
              href={`/property/${encodeURIComponent(property.slug)}`}
              className="line-clamp-2 whitespace-normal break-words font-semibold hover:underline"
            >
              {property.title}
            </Link>

            <p className="whitespace-normal break-words text-sm text-muted-foreground">
              {formatAddress(property) || "Location not provided"}
            </p>

            {property.private && <Badge variant="outline">Private</Badge>}
          </div>
        </div>
      );
    }
  },
  {
    accessorKey: "price",
    header: "Price",
    sortDescFirst: false,
    cell: ({ row }) => {
      const property = row.original;

      return (
        <div className="font-semibold tabular-nums">
          Rs. {formatPrice(property.price, "en-US")}
          {property.toRent && (
            <span className="block text-xs font-normal text-muted-foreground">per month</span>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: true,
    sortDescFirst: false,
    cell: ({ row }) => (
      <Badge variant="default" className="p-2">
        {row.original.status}
      </Badge>
    )
  },
  {
    accessorKey: "featured",
    header: "Featured",
    sortDescFirst: true,
    cell: ({ row }) =>
      row.original.featured ? (
        <Badge variant="default" className="p-2 border-0 shadow-sm whitespace-nowrap">
          <Icons.award className="size-4" aria-hidden="true" />
          <span className="ml-2 font-semibold text-shadow-sm">Featured</span>
        </Badge>
      ) : (
        <span className="text-muted-foreground">No</span>
      )
  },
  {
    accessorKey: "expiresOn",
    header: "Expiry",
    sortDescFirst: false,
    cell: ({ row }) => {
      const property = row.original;
      const date = property.expiresOn.slice(0, 10);

      return (
        <div className="space-y-1">
          {/* Expiry is separate from Sale, Rent, Hold or Sold status. */}
          {property.isExpired && <Badge variant="outline">Expired</Badge>}

          <p className="text-sm text-muted-foreground">
            {property.isExpired ? "Expired on " : "Expires on "}
            <time dateTime={date}>{date}</time>
          </p>
        </div>
      );
    }
  },
  {
    id: "actions",
    header: "Actions",
    enableSorting: false,
    cell: ({ row }) => (
      <PropertyActions
        propertyId={row.original.id}
        slug={row.original.slug}
        sellerId={row.original.sellerId}
      />
    )
  }
];

export default function MyListingsTable({ properties, sortBy, sortOrder }: MyListingsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  //The selected sorting comes from the page's URL.
  //This keeps the controls correct when using the browser's back button.
  //Listed date is available through the dropdown rather than a table column.
  const sorting: SortingState =
    sortBy === "listedAt"
      ? []
      : [
          {
            id: sortBy,
            desc: sortOrder === "desc"
          }
        ];

  function changeSorting(nextSortBy: MyPropertySortBy, nextSortOrder: MyPropertySortOrder) {
    if (isPending) return;

    const query = new URLSearchParams(searchParams.toString());

    query.set("sortBy", nextSortBy);
    query.set("sortOrder", nextSortOrder);

    //Changing the sorting starts from the first page.
    //We preserve the current All, Unexpired or Expired filter.
    query.set("page", "1");

    startTransition(() => {
      router.push(`${pathname}?${query.toString()}`, {
        scroll: false
      });
    });
  }

  const table = useTable({
    features,
    data: properties,
    columns,
    getRowId: (property) => property.id,

    //The backend has already sorted and paginated these listings.
    //We must not sort only the rows on the current page.
    manualSorting: true,
    manualPagination: true,
    enableMultiSort: false,

    state: {
      sorting
    },

    onSortingChange: (updater) => {
      const nextSorting = typeof updater === "function" ? updater(sorting) : updater;

      const selectedSort = nextSorting[0];

      //Clearing the column sorting returns to newest listings first.
      if (!selectedSort) {
        changeSorting("listedAt", "desc");
        return;
      }

      const selectedOption = sortOptions.find(
        (option) =>
          option.sortBy === selectedSort.id &&
          option.sortOrder === (selectedSort.desc ? "desc" : "asc")
      );

      if (selectedOption) {
        changeSorting(selectedOption.sortBy, selectedOption.sortOrder);
      }
    }
  });

  return (
    <div aria-busy={isPending}>
      {/* The sorting dropdown is available on both desktop and mobile.
          On mobile, changing it also updates the cards rendered by the page. */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <Select
          value={`${sortBy}:${sortOrder}`}
          disabled={isPending}
          onValueChange={(value) => {
            const selectedOption = sortOptions.find(
              (option) => `${option.sortBy}:${option.sortOrder}` === value
            );

            if (selectedOption) {
              changeSorting(selectedOption.sortBy, selectedOption.sortOrder);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-56" aria-label="Sort your listings">
            <SelectValue placeholder="Sort listings" />
          </SelectTrigger>

          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem
                key={`${option.sortBy}:${option.sortOrder}`}
                value={`${option.sortBy}:${option.sortOrder}`}
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <span role="status" className="text-sm text-muted-foreground">
          {isPending ? "Updating listings..." : ""}
        </span>
      </div>

      {/* We show the table on desktop.
          The page keeps its existing compact cards on smaller screens. */}
      <Card className="hidden lg:block overflow-hidden rounded-md">
        <Table>
          <TableCaption className="sr-only">
            Your property listings, featured status and expiry
          </TableCaption>

          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const direction = header.column.getIsSorted();

                  return (
                    <TableHead
                      key={header.id}
                      scope="col"
                      className="px-4"
                      aria-sort={
                        direction === "asc"
                          ? "ascending"
                          : direction === "desc"
                            ? "descending"
                            : undefined
                      }
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="-ml-3 gap-2"
                          disabled={isPending}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <table.FlexRender header={header} />

                          {direction === "asc" ? (
                            <Icons.upArrow className="size-4" aria-hidden="true" />
                          ) : direction === "desc" ? (
                            <Icons.downArrow className="size-4" aria-hidden="true" />
                          ) : (
                            <Icons.upDown className="size-4" aria-hidden="true" />
                          )}
                        </Button>
                      ) : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="p-4">
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No listings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
