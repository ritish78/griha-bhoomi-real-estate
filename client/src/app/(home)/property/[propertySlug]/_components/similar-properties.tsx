import { getSimilarProperties } from "@/actions/property";
import SimilarPropertiesCarousel from "../../_components/similar-properties-carousel";

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

  return <SimilarPropertiesCarousel properties={result.properties} />;
}
