import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function EditPropertyLoading() {
  return (
    <div role="status" className="container max-w-4xl space-y-6 py-6 md:py-10">
      <span className="sr-only">Loading property details…</span>

      <div aria-hidden="true" className="space-y-6">
        <Skeleton className="h-8 w-36" />
        <Skeleton className="h-10 w-56" />

        {[1, 2].map((section) => (
          <Card key={section}>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>

            <CardContent className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4].map((field) => (
                <Skeleton key={field} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
