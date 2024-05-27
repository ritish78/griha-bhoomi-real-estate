import * as React from "react";

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
  page?: number;
}

export default function PaginationButton({ totalPages, page = 1 }: PaginationButtonProps) {
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const hasNextPage = totalPages > currentPage;
  const hasPrevPage = page > 1;
  const canShowNextEllipsis = currentPage + 3 <= totalPages;
  const canShowPrevEllipsis = currentPage - 3 >= 1;

  console.log({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    canShowNextEllipsis,
    canShowPrevEllipsis
  });

  const getPagesToShow = () => {
    // let startPage = currentPage === 1 ? 1 : currentPage - 1;
    // let endPage = totalPages > currentPage ? currentPage + 1 : totalPages;
    let startPage = currentPage - 2;
    let endPage = totalPages > currentPage ? currentPage + 2 : totalPages;

    if (currentPage <= 3) {
      startPage = 1;
    } else if (currentPage >= totalPages - 2) {
      startPage = currentPage === 1 ? 1 : currentPage - 2;
      endPage = totalPages;
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  const pages = getPagesToShow();

  return (
    <Pagination>
      <PaginationContent>
        {hasPrevPage ? (
          <PaginationItem>
            <PaginationPrevious href={`?page=${currentPage - 1}`} />
          </PaginationItem>
        ) : null}
        {canShowPrevEllipsis ? (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        ) : null}
        {pages.map((p, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href={`?page=${p}`}
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
              <PaginationNext href={`?page=${currentPage + 1}`} />
            </PaginationItem>
          </>
        ) : null}
      </PaginationContent>
    </Pagination>
  );
}
