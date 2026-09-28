import Link from "next/link";
import { Button } from "../button";
import { Icons } from "@/components/icons";

export default function PostProperty() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="outline">
        <Link href="/property/map">
          <Icons.mapPin className="mr-2 size-4" aria-hidden="true" />
          See on map
        </Link>
      </Button>

      <Button asChild>
        <Link href="/property/new">
          <Icons.plus className="mr-2 size-4" aria-hidden="true" />
          Post Property
        </Link>
      </Button>
    </div>
  );
}
