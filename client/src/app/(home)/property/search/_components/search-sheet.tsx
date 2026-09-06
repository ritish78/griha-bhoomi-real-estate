"use client";

import { cn } from "@/lib/utlis";
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
  // Use CSS classes to show/hide based on screen size
  // This prevents hydration mismatch and flash of wrong content
  return (
    <>
      {/* Desktop: Always show filters directly */}
      <div className="hidden md:block">
        <SearchFilter isOnDesktop={true} className={cn("mt-2", className)} {...props} />
      </div>
      
      {/* Mobile: Show button that opens sheet */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Advanced Search
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle className="text-xl">Apply Filters</SheetTitle>
              <SheetDescription>
                Use filters to find properties that match your specific requirements
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <SearchFilter isOnDesktop={false} className={cn("mt-2", className)} {...props} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
