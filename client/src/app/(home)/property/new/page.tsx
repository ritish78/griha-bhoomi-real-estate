import { Shell } from "@/components/shell";
import { Metadata } from "next";
import { PropertyForm } from "./property-form";

export const metadata: Metadata = {
  title: "Add New Property",
  description: "List a new property for sale or rent"
};

export default function NewProperty() {
  return (
    <Shell className="pb-12 md:pb-14 bg-slate-50 dark:bg-transparent/5">
      <div className="container max-w-4xl py-6 lg:py-10">
        <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8 mb-8">
          <div className="flex-1 space-y-4">
            <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
              Add New Property
            </h1>
            <p className="text-xl text-muted-foreground">
              Fill in the details below to list your property.
            </p>
          </div>
        </div>
        <PropertyForm />
      </div>
    </Shell>
  );
}
