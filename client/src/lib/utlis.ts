import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isMacOS() {
  if (typeof window === "undefined") return false;

  return window.navigator.userAgent.includes("Mac");
}
