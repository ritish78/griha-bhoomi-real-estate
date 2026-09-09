"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utlis";

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn(
        "group/tabs flex gap-2",
        "data-[orientation=horizontal]:flex-col",
        "data-[orientation=vertical]:flex-row",
        className
      )}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  [
    "group/tabs-list",
    "inline-flex w-fit items-center justify-center",
    "rounded-lg p-1",
    "text-muted-foreground",

    // Horizontal
    "group-data-[orientation=horizontal]/tabs:flex-row",

    // Vertical
    "group-data-[orientation=vertical]/tabs:flex-col",

    "data-[variant=line]:rounded-none"
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={(state) =>
        cn(
          // Base trigger
          "relative inline-flex h-7 flex-1 items-center justify-center gap-1.5",
          "rounded-md border border-transparent px-2.5 py-1",
          "text-sm font-medium whitespace-nowrap",
          "text-muted-foreground transition-all",

          // Hover / focus
          "hover:text-foreground",
          "focus-visible:border-ring",
          "focus-visible:ring-[3px]",
          "focus-visible:ring-ring/50",
          "focus-visible:outline-none",

          // Disabled
          "disabled:pointer-events-none",
          "disabled:opacity-50",

          // Icons
          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
          "[&_svg:not([class*='size-'])]:size-4",

          // Vertical orientation
          "group-data-[orientation=vertical]/tabs:w-full",
          "group-data-[orientation=vertical]/tabs:justify-start",

          // ACTIVE TAB
          state.active && "bg-background text-foreground shadow-sm border-border",

          // Dark mode active
          state.active && "dark:bg-input/30 dark:text-foreground dark:border-input",

          typeof className === "function" ? className(state) : className
        )
      }
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("w-full flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
