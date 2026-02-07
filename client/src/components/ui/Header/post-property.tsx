import Link from "next/link";
import { Button } from "../button";
import { Icons } from "@/components/icons";

export default function PostProperty() {
  return (
    <Button size="sm" className="z-30" asChild>
      <Link href="/property/new">
        <Icons.plus className="mr-2 size-4" aria-hidden="true" />
        Post Property
      </Link>
    </Button>
  );
}
