"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/authContext";

interface PropertyActionsProps {
  slug: string;
  sellerId: string | null;
}

export default function PropertyActions({ slug, sellerId }: PropertyActionsProps) {
  const { user, loading } = useAuth();

  //We wait until the current user has been loaded before checking
  //whether they can edit the property listing.
  if (loading || !user) {
    return null;
  }

  //The original poster, admin and moderator can edit the property listing.
  const currentUserCanEdit =
    user.id === sellerId || user.isAdmin || user.role === "ADMIN" || user.role === "MODERATOR";

  if (!currentUserCanEdit) {
    return null;
  }

  //This menu links to the edit page.
  //The backend checks the user's permission when loading and saving the listing.
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0"
          aria-label="Listing actions"
        >
          <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem asChild>
          <Link href={`/property/${encodeURIComponent(slug)}/edit`}>
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
            Edit listing
          </Link>
        </DropdownMenuItem>

        {/* We can add delete button when we implement it later. */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
