import Link from "next/link";

import { siteConfig } from "@/config/siteConfig";
import { cn } from "@/lib/utlis";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { NewsletterForm } from "@/components/newsletter-form";
import { Shell } from "@/components/shell";

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <Shell>
        <section className="flex flex-col gap-10 lg:flex-row lg:gap-20">
          <section>
            <Link href="/" className="flex w-fit items-center space-x-2">
              <Icons.logo className="size-6" aria-hidden="true" />
              <span className="font-bold">{siteConfig.name}</span>
              <span className="sr-only">Home</span>
            </Link>
          </section>
          <section className="grid flex-1 grid-cols-1 gap-10 xxs:grid-cols-2 sm:grid-cols-4">
            {siteConfig.footerNav.map((item) => (
              <div key={item.title} className="space-y-3">
                <h4 className="text-base font-medium">{item.title}</h4>
                <ul className="space-y-2.5">
                  {item.items.map((link) => (
                    <li key={link.title}>
                      <Link
                        href={link.href}
                        target={link?.external ? "_blank" : undefined}
                        rel={link?.external ? "noreferrer" : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.title}
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
          <section className="space-y-3">
            <h4 className="text-base font-medium">Subscribe to our newsletter</h4>
            <NewsletterForm />
          </section>
        </section>
        <section className="flex items-center space-x-4">
          <div className="flex-1 text-left text-sm leading-loose text-muted-foreground">
            Built by{" "}
            <Link
              href="https://github.com/ritish78"
              target="_blank"
              rel="noreferrer"
              className="font-semibold transition-colors hover:text-foreground"
            >
              Ritish
              <span className="sr-only">Github</span>
            </Link>
            .
          </div>
          <div className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "ghost"
                })
              )}
            >
              <Icons.gitHub className="size-4" aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </section>
      </Shell>
    </footer>
  );
}
