import { formatPrice } from "@/lib/formatPrice";
import { MapProperty } from "@/types/property";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Icons } from "../icons";

export default function PropertyPopup({ property: p }: { property: MapProperty }) {
  return (
    <div>
      <div className="w-full h-40 bg-zinc-100 relative overflow-hidden">
        {p.imageUrl && p.imageUrl.length > 0 ? (
          <Link
            href={`/property/${p.slug}`}
            className="text-sm font-medium leading-snug"
            style={{ margin: 0 }}
          >
            <Image
              src={p.imageUrl[0] ?? "https://placehold.co/600x400.png"}
              alt={p.title}
              sizes="200px"
              className="object-cover"
              fill
            />
          </Link>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xs text-zinc-500">No image available</span>
          </div>
        )}

        {/*We leave space on the right for the popup's close button.*/}
        <div className="absolute left-2 right-9 top-2 flex items-start justify-between gap-2 pointer-events-none">
          {p.featured && (
            <Badge variant="default" className="p-2 flex mr-auto border-0 shadow-sm">
              <Icons.award className="mb-1 size-4" aria-hidden="true" />
              <span className="ml-2 font-semibold text-shadow-sm">Featured</span>
            </Badge>
          )}

          <Badge variant="default" className="ml-auto p-2">
            {p.status}
          </Badge>
        </div>
      </div>

      <div className="px-3.5 py-3 flex flex-col gap-0.5">
        <Link
          href={`/property/${p.slug}`}
          className="font-bold leading-snug line-clamp-2 text-zinc-800"
          style={{ margin: 0 }}
        >
          {p.title}
        </Link>

        <p className="text-xs text-zinc-500" style={{ margin: 0 }}>
          {p.propertyType}
          {p.closeLandmark ? ` · Near ${p.closeLandmark}` : ""}
        </p>

        <p className="text-xs text-zinc-500" style={{ margin: 0 }}>
          {p.municipality}, {p.province}
        </p>

        <div className="flex justify-between items-center mt-1">
          <p className="text-sm font-medium" style={{ margin: 0 }}>
            Rs. {formatPrice(p.price)}
            {p.toRent && <span className="text-[11px] font-normal text-zinc-500 ml-1">/month</span>}
            {p.negotiable && (
              <span className="text-[11px] font-normal text-zinc-500 ml-1"> · Negotiable</span>
            )}
          </p>

          {p.distanceKm != null && (
            <span className="text-[11px] text-zinc-500">{p.distanceKm} km away</span>
          )}
        </div>
      </div>
    </div>
  );
}
