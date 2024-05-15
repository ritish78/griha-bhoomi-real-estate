import { siteConfig } from "@/config/siteConfig";
import { MainNav } from "./main-nav";
import { MobileNav } from "./mobile-nav";
import { SearchBox } from "@/components/search-box";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import Link from "next/link";
import { Icons } from "@/components/icons";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        <div className="mobile-nav-title lg:hidden absolute inset-x-0 top-0 flex justify-center items-center h-full">
          <Link className="font-bold text-lg flex items-center" href="/">
            <Icons.logo className="mr-2 size-4" aria-hidden="true" />
            GrihaBhoomi
          </Link>
        </div>
        <MobileNav items={siteConfig.mainNav} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <SearchBox />
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
