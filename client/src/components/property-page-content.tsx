import { HTMLAttributes } from "react";
import { cn } from "@/lib/utlis";

interface PropertyPageContentProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function PropertyPageContent({
  title,
  description,
  children,
  className,
  ...props
}: PropertyPageContentProps) {
  return (
    <section className={cn("space-y-6", className)} {...props}>
      <div>
        <div className="flex max-w-[61.25rem] flex-1 flex-col gap-0.5">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold leading-[1.1] md:text-3xl">{title}</h2>
          </div>
          {description ? (
            <p className="max-w-[54rem] text-balance text-sm leading-normal text-muted-foreground sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      <div className="space-y-8">
        <div className="grid gap-4 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">{children}</div>
      </div>
    </section>
  );
}
