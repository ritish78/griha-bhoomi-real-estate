"use client";

import { cn, isDesktop } from "@/lib/utlis";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import SearchFilter from "./search-filter";

interface SearchSheetProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function SearchSheet({ className, ...props }: SearchSheetProps) {
  const isOnDesktop = isDesktop();

  if (isOnDesktop) {
    return <SearchFilter isOnDesktop={isOnDesktop} className={cn("mt-2", className)} {...props} />;
  } else {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Advanced Search</Button>
        </SheetTrigger>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Apply any of these filters</SheetTitle>
            <SheetDescription>
              You can apply any amount of filters to search your perfect property
            </SheetDescription>
          </SheetHeader>
          <SearchFilter isOnDesktop={isOnDesktop} className={cn("mt-2", className)} {...props} />
        </SheetContent>
      </Sheet>
    );
  }
}
