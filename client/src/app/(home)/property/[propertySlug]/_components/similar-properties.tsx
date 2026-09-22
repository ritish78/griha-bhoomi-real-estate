import { getSimilarProperties } from "@/actions/property";
import PropertyCard from "@/components/property-card";

interface SimilarPropertiesProps {
  slug: string;
}

export default async function SimilarProperties({ slug }: SimilarPropertiesProps) {
  const result = await getSimilarProperties(slug);

  //A failed recommendations request should not prevent the listing from opening.
  if (result.error !== undefined) {
    console.error("Could not load similar listings:", result.error);
    return null;
  }

  if (result.properties.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="similar-properties-heading" className="min-w-0 border-t pt-8">
      <div className="mb-6">
        <h2 id="similar-properties-heading" className="text-2xl font-bold">
          Similar listings
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Ordered from nearest to farthest from this property.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {result.properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
