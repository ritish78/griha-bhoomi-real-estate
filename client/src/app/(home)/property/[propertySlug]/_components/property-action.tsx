"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteProperty } from "@/actions/property";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/authContext";
import { Icons } from "@/components/icons";

interface PropertyActionsProps {
  propertyId: string;
  slug: string;
  sellerId: string | null;
}

export default function PropertyActions({ propertyId, slug, sellerId }: PropertyActionsProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isDeleting = useRef(false);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  async function onDelete() {
    if (isDeleting.current) {
      return;
    }

    isDeleting.current = true;
    setIsLoading(true);

    try {
      const result = await deleteProperty(propertyId);

      if (!result.success) {
        throw new Error(result.error);
      }

      setIsDeleteDialogOpen(false);

      toast.success("Property deleted", {
        description: "Your property listing has been deleted."
      });

      //We replace the current page because the listing no longer exists.
      router.replace("/property/search");
      router.refresh();
    } catch (error) {
      toast.error("Could not delete property", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      isDeleting.current = false;
      setIsLoading(false);
    }
  }

  //This menu links to the edit page.
  //The backend checks the user's permission when loading and saving the listing.
  //It also checks permission again before deleting the listing.
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            ref={menuButtonRef}
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0"
            aria-label="Listing actions"
            disabled={isLoading}
          >
            <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-44"
          onCloseAutoFocus={(event) => {
            //The confirmation dialog manages focus when it opens.
            if (isDeleteDialogOpen) {
              event.preventDefault();
            }
          }}
        >
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={`/property/${encodeURIComponent(slug)}/edit`}>
              <Pencil className="mr-2 h-4 w-4" aria-hidden="true" />
              Edit listing
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950/50 dark:focus:text-red-300"
            onSelect={() => setIsDeleteDialogOpen(true)}
          >
            <Icons.bin className="mr-2 h-4 w-4" aria-hidden="true" />
            Delete listing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* We ask for confirmation before deleting the property listing. */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          //We keep the dialog open while the deletion is being processed.
          if (!isDeleting.current) {
            setIsDeleteDialogOpen(open);
          }
        }}
      >
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-md rounded-lg"
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            cancelButtonRef.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            menuButtonRef.current?.focus();
          }}
        >
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="pr-6">Delete property listing?</DialogTitle>

            <DialogDescription className="leading-relaxed">
              This will permanently delete the listing and its saved details. This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 pt-2 sm:gap-0">
            <Button
              ref={cancelButtonRef}
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              variant="destructive"
              disabled={isLoading}
              className="min-w-36 font-medium tracking-wide group"
              onClick={onDelete}
            >
              {isLoading ? "Deleting listing..." : "Delete listing"}
              <Icons.rightArrow
                className="ml-1 size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
                aria-hidden="true"
              />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
