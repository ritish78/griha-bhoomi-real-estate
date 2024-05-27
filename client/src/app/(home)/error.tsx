"use client";

import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  error: Error;
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  return (
    <main className="container bg-slate-50 dark:bg-slate-900 pb-8 pt-6 text-center">
      <p className="text-2xl font-bold">An Error Occurred!</p>
      <p className="text-lg text-red-500">{error.message}</p>
      <p>
        <Button variant="link" onClick={reset}>
          Try again?
        </Button>
      </p>
    </main>
  );
}
