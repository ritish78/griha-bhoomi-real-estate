"use client";

import * as React from "react";
import { useRouter, usePathname } from "next/navigation";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

interface PaginationButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  totalPages: number;
  page: number;
  searchParams: Record<string, string | number | null>;
}

export default function PaginationButton({
  totalPages,
  page,
  searchParams
  // createQueryString
}: PaginationButtonProps) {
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const hasNextPage = totalPages > currentPage;
  const hasPrevPage = page > 1;
  const canShowNextEllipsis = currentPage + 3 <= totalPages;
  const canShowPrevEllipsis = currentPage - 3 >= 1;

  const getPagesToShow = React.useMemo(() => {
    // let startPage = currentPage === 1 ? 1 : currentPage - 1;
    // let endPage = totalPages > currentPage ? currentPage + 1 : totalPages;
    let startPage = currentPage - 2;
    let endPage = totalPages > 2 ? (currentPage ? currentPage + 2 : totalPages) : totalPages;

    if (currentPage <= 3) {
      startPage = 1;
    } else if (currentPage >= totalPages - 2) {
      startPage = currentPage === 1 ? 1 : currentPage - 2;
      endPage = totalPages;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }, [currentPage, totalPages]);

  //   const pages = getPagesToShow();
  const router = useRouter();
  const pathname = usePathname();

  const createQueryString = (params: Record<string, string | number | null>, newPage: number) => {
    const newSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        newSearchParams.append(key, String(value));
      }
    }
    newSearchParams.set("page", String(newPage));
    return newSearchParams.toString();
  };

  return (
    <Pagination>
      <PaginationContent>
        {hasPrevPage ? (
          <PaginationItem>
            <PaginationPrevious
              href={`${pathname}?${createQueryString(searchParams, currentPage - 1)}`}
            />
          </PaginationItem>
        ) : null}
        {canShowPrevEllipsis ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {getPagesToShow.map((p, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={`${pathname}?${createQueryString(searchParams, p)}`}
              isActive={p === currentPage}
              //   className={p === currentPage ? "font-bold border border-foreground" : undefined}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}
        {canShowNextEllipsis ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {hasNextPage ? (
          <>
            <PaginationItem>
              <PaginationNext
                href={`${pathname}?${createQueryString(searchParams, currentPage + 1)}`}
              />
            </PaginationItem>
          </>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
