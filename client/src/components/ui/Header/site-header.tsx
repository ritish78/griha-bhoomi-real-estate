import { siteConfig } from "@/config/siteConfig";
import { MainNav } from "./main-nav";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        <MainNav items={siteConfig.mainNav} />
        {/* <MobileNav items={siteConfig.mainNav} /> */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2"></nav>
        </div>
      </div>
    </header>
  );
}
