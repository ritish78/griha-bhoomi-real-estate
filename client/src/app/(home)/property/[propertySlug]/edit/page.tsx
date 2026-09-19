import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shell } from "@/components/shell";
import { getEditProperty } from "@/lib/getEditProperty";
import { PropertyForm } from "../../_components/property-form";

export const metadata = {
  title: "Edit Property - GrihaBhoomi"
};

export default async function EditPropertyPage({
  params
}: {
  params: Promise<{ propertySlug: string }>;
}) {
  const { propertySlug } = await params;
  const result = await getEditProperty(propertySlug);

  if (!result.success) {
    if (result.status === 401) {
      const destination = `/property/${propertySlug}/edit`;

      redirect(`/login?redirect=${encodeURIComponent(destination)}`);
    }

    if (result.status === 404) {
      notFound();
    }

    return (
      <Shell className="bg-slate-50 pb-12 dark:bg-transparent/5 md:pb-14">
        <div className="container max-w-4xl py-6 lg:py-10">
          <Card className="overflow-hidden border-t-4 border-t-black shadow-sm dark:border-t-white">
            <CardHeader className="space-y-3 p-6 pb-0 sm:p-8 sm:pb-0">
              <CardTitle className="text-xl font-semibold leading-snug sm:text-2xl">
                {result.status === 403
                  ? "You cannot edit this listing"
                  : "Could not load the listing"}
              </CardTitle>

              <CardDescription className="text-base leading-relaxed text-muted-foreground">
                {result.error}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 pt-6 sm:p-8 sm:pt-6">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href={`/property/${propertySlug}`}>Back to property</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Shell>
    );
  }

  const { property } = result;

  return (
    <Shell className="pb-12 md:pb-14 bg-slate-50 dark:bg-transparent/5">
      <div className="container max-w-4xl py-6 lg:py-10">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8 mb-8">
          <div className="flex-1 space-y-4">
            <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
              Edit Property
            </h1>

            <p className="text-xl text-muted-foreground">
              Update the details below to edit your property listing.
            </p>
          </div>
        </div>

        <PropertyForm
          key={property.id}
          editSlug={property.slug}
          initialValues={property.initialValues}
        />
      </div>
    </Shell>
  );
}
