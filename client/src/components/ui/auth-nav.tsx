"use client";

import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "@/components/icons";
import { Skeleton } from "./skeleton";

export function AuthNav() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const pathname = usePathname();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  //when the page refreshes, we don't want to display Login button for a second
  //before showing user's avatar and their name. we will show skeleton instead
  if (loading) {
    return (
      <div role="status" className="flex h-10 w-full items-center gap-2 px-2">
        <Skeleton
          aria-hidden="true"
          className="size-8 shrink-0 rounded-full motion-reduce:animate-none"
        />
        <Skeleton
          aria-hidden="true"
          className="hidden h-7 w-16 md:block motion-reduce:animate-none"
        />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <Button asChild size="default" className="z-30">
        <Link href={`/login?redirect=${encodeURIComponent(pathname)}`}>
          {/* <Icons.user className="mr-2 h-4 w-4" /> */}
          <span>Login</span>
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-fit rounded-md px-2 flex items-center gap-2"
          size="sm"
        >
          <Avatar className="h-8 w-8 shrink-0">
            {user.profilePicUrl && (
              <AvatarImage src={user.profilePicUrl} alt={`${user.firstName} ${user.lastName}`} />
            )}
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden md:inline-block">{user.firstName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()}>
          <Icons.logout className="mr-2 size-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
