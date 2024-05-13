import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/siteConfig";
import { MainNavItem } from "@/types";
import Link from "next/link";

interface MainNavProps {
  items?: MainNavItem[];
}

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="hidden gap-6 lg:flex">
      <Link href="/" className="hidden items-center space-x-2 lg:flex">
        <Icons.logo className="size-6 ms-4" aria-hidden="true" />
        <span className="hidden font-bold lg:inline-block">{siteConfig.name}</span>
        <span className="sr-only">Home</span>
      </Link>
    </div>
  );
}
