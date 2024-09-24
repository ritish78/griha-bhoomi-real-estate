import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utlis";
import { ThemeProvider } from "@/components/providers";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "sonner";

import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { NextUIProvider } from "@nextui-org/react";

export const metadata: Metadata = {
  title: "GrihaBhoomi",
  description: "A real-estate website to share listings of land or house for sale or rent."
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" }
  ]
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          GeistSans.variable,
          GeistMono.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextUIProvider>{children}</NextUIProvider>
          <TailwindIndicator />
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
