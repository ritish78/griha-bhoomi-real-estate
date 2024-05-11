"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { TooltipProvider } from "./ui/tooltip";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider {...props}>
      <TooltipProvider>{children}</TooltipProvider>
    </NextThemeProvider>
  );
}
