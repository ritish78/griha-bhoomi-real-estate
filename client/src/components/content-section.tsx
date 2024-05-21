import { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Icons } from "./icons";
import { Slot } from "@radix-ui/react-slot";

import { Button } from "./ui/button";
import { cn } from "@/lib/utlis";

interface ContentSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  href: string;
  linkText?: string;
  children: ReactNode;
  asChild?: boolean;
}

export function ContentSection({
  title,
  description,
  href,
  linkText = "View more",
  children,
  className,
  asChild = false,
  ...props
}: ContentSectionProps) {
  const ChildrenShell = asChild ? Slot : "div";
  return (
    <section className={cn("space-y-6", className)} {...props}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex max-w-[61.25rem] flex-1 flex-col gap-0.5">
          <h2 className="text-2xl font-bold leading-[1.1] md:text-3xl">{title}</h2>
          {description ? (
            <p className="max-w-[46.875rem] text-balance text-sm leading-normal text-muted-foreground sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
        <Button variant="outline" className="hidden sm:flex group" asChild>
          <Link href={href}>
            {linkText}
            <Icons.rightArrow
              className="ml-1 size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
            <span className="sr-only"> {linkText}</span>
          </Link>
        </Button>
      </div>
      <div className="space-y-8">
        <ChildrenShell
          className={cn(!asChild && "grid gap-4 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3")}
        >
          {children}
        </ChildrenShell>
        <Button variant="ghost" className="mx-auto flex w-fit sm:hidden group" asChild>
          <Link href={href}>
            {linkText}
            <Icons.rightArrow
              className="ml-1 size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
            <span className="sr-only"> {linkText}</span>
          </Link>
        </Button>
      </div>
    </section>
  );
}
