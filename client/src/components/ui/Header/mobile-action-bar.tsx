import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { AuthNav } from "../auth-nav";

export default function MobileActionBar() {
  return (
    <nav
      aria-label="Mobile property actions"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgb(0_0_0/0.05)] lg:hidden"
    >
      <div className="bg-muted/40">
        <div className="mx-auto grid h-16 max-w-lg grid-cols-3 items-center">
          <div className="min-w-0 border-r border-border px-2">
            <Link
              href="/property/search"
              className="flex h-12 w-full flex-col items-center justify-center gap-1 rounded-lg text-xs font-medium transition-colors hover:bg-muted active:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Search className="size-5" aria-hidden="true" />
              <span>Search</span>
            </Link>
          </div>

          <div className="min-w-0 px-2">
            <Link
              href="/property/new"
              className="flex h-12 w-full flex-col items-center justify-center gap-1 rounded-lg bg-primary text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Plus className="size-5" aria-hidden="true" />
              <span className="whitespace-nowrap text-xs font-semibold">Post Property</span>
            </Link>
          </div>

          <div className="min-w-0 border-l border-border px-2 [&_button]:h-12 [&_button]:w-full [&_button]:justify-center [&_button]:rounded-lg [&_button]:shadow-none [&_button:hover]:bg-muted [&_a]:flex [&_a]:h-12 [&_a]:w-full [&_a]:items-center [&_a]:justify-center [&_a]:rounded-lg [&_a]:bg-transparent [&_a]:text-foreground [&_a]:shadow-none [&_a:hover]:bg-muted">
            <AuthNav />
          </div>
        </div>
      </div>
    </nav>
  );
}
