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

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card
      className={cn(
        // `${property.featured ? "featured-property" : null} border shadow-md size-full relative overflow-hidden rounded-md`
        "border shadow-md size-full relative overflow-hidden rounded-md flex flex-col"
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
              loading="lazy"
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
              <Badge variant="default" className="absolute top-2 left-2 p-2 flex mr-auto">
                <Icons.award className="mb-1 size-4"></Icons.award>
                {/* <span className="ml-2 text-gold dark:text-yellow-600">Featured</span> */}
                <span className="ml-2">Featured</span>
              </Badge>
            ) : null}
          </AspectRatio>
        </CardHeader>
      </Link>
      <CardContent className="p-4 border-b border-gray-200 flex flex-col flex-grow">
        <div className="flex-grow">
          <CardTitle className="text-lg mb-2">
            <strong>
              ${formatPrice(property.price, "en-US")} {property.status === "Rent" && "per month"}
            </strong>
          </CardTitle>
          <Link href={`/property/${property.slug}`}>
            <CardDescription className="mb-4 text-lg font-bold">{property.title}</CardDescription>
          </Link>
        </div>
        <CardDescription className="flex h-5 mr-auto mb-1">
          <Icons.pin className="size-1 max-h-1" />
          <span className="text-muted-foreground">
            {property.street && `${property.street}, `}
            {property.municipality && `${property.municipality}, `}
            {property.city && `${property.city}, `}
            {property.district && `${property.district}`}
          </span>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-y-4 p-2">
        {property.propertyType === "House" ? (
          <>
            <Badge variant="secondary" className="mr-2">
              <Icons.bedroom className="mb-1"></Icons.bedroom>
              <strong className="ml-1">{property.roomCount}</strong>
              <span className="ml-1">Bedrooms</span>
            </Badge>
            <Badge variant="secondary" className="mr-2">
              <Icons.bathroom className="mb-1"></Icons.bathroom>
              <strong className="ml-1">{property.bathroomCount}</strong>
              <span className="ml-1">Bathrooms</span>
            </Badge>
            <Badge variant="secondary" className="">
              <Icons.land className="size-4"></Icons.land>
              <strong className="ml-1">{property.houseArea?.split(" ")[0]}</strong>
              <span className="ml-1">Sq ft</span>
            </Badge>
          </>
        ) : (
          <>
            <Badge variant="secondary" className="mr-2">
              <Icons.pencilRuler className="mb-1"></Icons.pencilRuler>
              <strong className="ml-1">{property.length}</strong>
              <span className="ml-1">Length</span>
            </Badge>
            <Badge variant="secondary" className="mr-2">
              <Icons.ruler className="mb-1"></Icons.ruler>
              <strong className="ml-1">{property.breadth}</strong>
              <span className="ml-1">Breadth</span>
            </Badge>
            <Badge variant="secondary" className="">
              <Icons.land className="size-5"></Icons.land>
              <strong className="ml-1">{property.landArea?.split(" ")[0]}</strong>
              <span className="ml-1">Sq ft</span>
            </Badge>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
