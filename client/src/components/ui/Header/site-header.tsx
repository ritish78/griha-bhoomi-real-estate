import Link from "next/link";

import { siteConfig } from "@/config/siteConfig";
import { Icons } from "@/components/icons";
import { SearchBox } from "@/components/search-box";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { AuthNav } from "../auth-nav";
import PostProperty from "./post-property";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      {/* Mobile and tablet */}
      <div className="grid h-16 grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-2 px-4 lg:hidden">
        <MobileNav items={siteConfig.mainNav} />

        <Link href="/" className="flex min-w-0 items-center justify-center gap-2 font-bold">
          <Icons.logo className="size-5 shrink-0" aria-hidden="true" />
          <span className="truncate text-lg">GrihaBhoomi</span>
        </Link>

        <div className="flex justify-center">
          <ThemeToggle />
        </div>
      </div>

      {/* Desktop */}
      <div className="container hidden h-16 items-center gap-4 lg:flex">
        <MainNav items={siteConfig.mainNav} />

        <nav
          aria-label="Account and property actions"
          className="ml-auto flex shrink-0 items-center gap-2"
        >
          <SearchBox />
          <PostProperty />
          <ThemeToggle />

          <div className="flex w-36 shrink-0 items-center justify-end">
            <AuthNav />
          </div>
        </nav>
      </div>
    </header>
  );
}
