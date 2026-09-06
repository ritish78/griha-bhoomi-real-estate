"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Icons } from "@/components/icons";

export default function KeywordSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("keyword")?.toString() || ""
  );

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    const currentKeyword = params.get("keyword") || "";

    if (term === currentKeyword) return;

    if (term) {
      params.set("keyword", term);
    } else {
      params.delete("keyword");
    }
    // Reset page to 1 when searching
    params.set("page", "1");

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="grid w-full items-center gap-2 mb-6">
      <Label htmlFor="keyword" className="text-sm font-medium">
        Search by Keyword
      </Label>
      <div className="relative">
        <Icons.search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          id="keyword"
          placeholder="Search by title, description, address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
