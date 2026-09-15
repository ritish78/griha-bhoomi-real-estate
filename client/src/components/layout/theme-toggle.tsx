"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { LaptopIcon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type ThemeChoice = "light" | "dark" | "system";

export function ThemeToggle() {
  const { setTheme, forcedTheme } = useTheme();

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  async function changeTheme(nextTheme: ThemeChoice) {
    const root = document.documentElement;

    //this also prevents overlapping reveals from another toggle instance
    if (forcedTheme || root.dataset.themeReveal === "true") {
      return;
    }

    const targetTheme =
      nextTheme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : nextTheme;

    const currentTheme = root.classList.contains("dark") ? "dark" : "light";

    //we close the menu before the browser captures the old page.
    flushSync(() => {
      setOpen(false);
    });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      currentTheme === targetTheme ||
      reducedMotion ||
      typeof document.startViewTransition !== "function" ||
      !CSS.supports("clip-path", "circle(0px at 0px 0px)") ||
      !buttonRef.current
    ) {
      //This also saves "system" when its appearance is unchanged.
      setTheme(nextTheme);
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    //Reach the farthest corner of the viewport.
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    root.style.setProperty("--theme-reveal-x", `${x}px`);
    root.style.setProperty("--theme-reveal-y", `${y}px`);
    root.style.setProperty("--theme-reveal-radius", `${radius + 2}px`);
    root.dataset.themeReveal = "true";

    setBusy(true);

    try {
      const transition = document.startViewTransition(() => {
        //next-themes applies the root class through an effect.
        //Wait until that class changes before capturing the new page.
        return new Promise<void>((resolve, reject) => {
          const matchesTarget = () => root.classList.contains(targetTheme);

          const observer = new MutationObserver(() => {
            if (matchesTarget()) finish();
          });

          const timeout = window.setTimeout(() => {
            finish(new Error("Theme update timed out."));
          }, 1000);

          function finish(error?: unknown) {
            observer.disconnect();
            window.clearTimeout(timeout);

            if (error) reject(error);
            else resolve();
          }

          observer.observe(root, {
            attributes: true,
            attributeFilter: ["class"]
          });

          try {
            flushSync(() => {
              setTheme(nextTheme);
            });

            if (matchesTarget()) finish();
          } catch (error) {
            finish(error);
          }
        });
      });

      //A transition may be skipped if the tab becomes hidden.
      void transition.ready.catch(() => {});
      void transition.updateCallbackDone.catch(() => {});

      await transition.finished;
    } catch {
      //Theme selection must still work if animation fails.
      setTheme(nextTheme);
    } finally {
      delete root.dataset.themeReveal;
      root.style.removeProperty("--theme-reveal-x");
      root.style.removeProperty("--theme-reveal-y");
      root.style.removeProperty("--theme-reveal-radius");

      setBusy(false);
    }
  }

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(nextOpen) => {
        if (!busy) setOpen(nextOpen);
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          type="button"
          variant="ghost"
          size="icon"
          className="relative size-8"
          disabled={busy || Boolean(forcedTheme)}
        >
          <SunIcon
            aria-hidden="true"
            className="rotate-0 scale-100 transition-transform duration-300 dark:-rotate-90 dark:scale-0 motion-reduce:transition-none"
          />

          <MoonIcon
            aria-hidden="true"
            className="absolute rotate-90 scale-0 transition-transform duration-300 dark:rotate-0 dark:scale-100 motion-reduce:transition-none"
          />

          <span className="sr-only">Choose theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="data-[state=closed]:animate-none">
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            void changeTheme("light");
          }}
        >
          <SunIcon className="mr-2 size-4" />
          <span>Light</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            void changeTheme("dark");
          }}
        >
          <MoonIcon className="mr-2 size-4" />
          <span>Dark</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            void changeTheme("system");
          }}
        >
          <LaptopIcon className="mr-2 size-4" />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
