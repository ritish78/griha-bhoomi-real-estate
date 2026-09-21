"use client";
import { cn } from "@/lib/utlis";
import { Icons } from "./icons";

import Image from "next/image";
import Link from "next/link";

import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { Property } from "@/types/property";
import { formatPrice } from "@/lib/formatPrice";
import { formatAddress } from "@/lib/formatAddress";
import { ReactNode } from "react";

interface PropertyCardProps {
  property: Property;
}

function PropertyStat({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <div className="flex min-w-0 items-center justify-center gap-1 px-1.5" title={text}>
      <span aria-hidden="true" className="shrink-0 text-muted-foreground [&_svg]:size-4">
        {icon}
      </span>

      <span className="truncate text-sm font-semibold tabular-nums">{text}</span>
    </div>
  );
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card
      className={cn(
        "border shadow-md size-full relative overflow-hidden rounded-md flex flex-col transition-all duration-300",
        property.featured && "shadow-xl shadow-gold/20 hover:shadow-2xl hover:shadow-gold/30"
      )}
    >
      <Link aria-label="A house" href={`/property/${property.slug}`}>
        <CardHeader className="relative overflow-hidden">
          <AspectRatio ratio={4 / 3}>
            <Image
              src={property.imageUrl[0] ?? "https://placehold.co/1800x1200.png"}
              alt="A house"
              className="object-cover h-full"
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              fill
              loading="eager"
            />
            <Badge
              variant="default"
              className={"absolute top-2 right-2 p-2"}

              //I wanted to have Badge of different color depending upon the status of the property
              //If on sale, then one color and if it is for rent, then another color but it
              //didn't look nice. Might visit this later and change it
              // className={`absolute top-2 right-2 p-2 ${property.status === "Rent" ? "bg-orange-300 text-orange-600" : "bg-green-300 text-green-600"}`}
              //I prefer the second one to the one just above
              // className={`absolute top-2 right-2 p-2 ${property.status === "Sale" ? "text-green-400 dark:text-green-600" : "text-orange-400 dark:text-orange-600"}`}
            >
              {property.status}
            </Badge>
            {property.featured ? (
              <Badge
                variant="default"
                className="absolute top-2 left-2 p-2 flex mr-auto border-0 shadow-sm"
              >
                <Icons.award className="mb-1 size-4"></Icons.award>
                {/* <span className="ml-2 text-gold dark:text-yellow-600">Featured</span> */}
                <span className="ml-2 font-semibold text-shadow-sm">Featured</span>
              </Badge>
            ) : null}
          </AspectRatio>
        </CardHeader>
      </Link>
      <CardContent className="flex flex-grow flex-col border-b-2 px-4 pt-4 pb-2">
        {" "}
        <div className="flex-grow">
          <CardTitle className="text-lg mb-2">
            <strong>
              Rs. {formatPrice(property.price, "en-US")} {property.status === "Rent" && "per month"}
            </strong>
          </CardTitle>
          <Link href={`/property/${property.slug}`}>
            <CardDescription className="mb-4 text-lg font-bold">{property.title}</CardDescription>
          </Link>
        </div>
        <CardDescription className="mt-2 flex items-start gap-2">
          {" "}
          <Icons.mapPin
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-muted-foreground"
          />
          <span
            className="line-clamp-2 text-sm leading-5 text-muted-foreground"
            title={formatAddress(property)}
          >
            {formatAddress(property) || "Location not provided"}
          </span>
        </CardDescription>
      </CardContent>
      <CardFooter className="mt-auto grid grid-cols-3 divide-x divide-border px-2 py-3">
        {" "}
        {property.propertyType === "House" ? (
          <>
            <PropertyStat
              icon={<Icons.bedroom />}
              text={
                property.roomCount == null
                  ? "— rooms"
                  : `${property.roomCount} ${property.roomCount === 1 ? "room" : "rooms"}`
              }
            />

            <PropertyStat
              icon={<Icons.bathroom />}
              text={
                property.bathroomCount == null
                  ? "— baths"
                  : `${property.bathroomCount} ${property.bathroomCount === 1 ? "bathroom" : "bathrooms"}`
              }
            />

            <PropertyStat icon={<Icons.land />} text={property.houseArea?.trim() || "Area —"} />
          </>
        ) : (
          <>
            <PropertyStat
              icon={<Icons.pencilRuler />}
              text={property.length?.trim() ? `Length ${property.length.trim()}` : "Length —"}
            />

            <PropertyStat
              icon={<Icons.ruler />}
              text={property.breadth?.trim() ? `Width ${property.breadth.trim()}` : "Width —"}
            />

            <PropertyStat icon={<Icons.land />} text={property.landArea?.trim() || "Area —"} />
          </>
        )}
      </CardFooter>
    </Card>
  );
}
