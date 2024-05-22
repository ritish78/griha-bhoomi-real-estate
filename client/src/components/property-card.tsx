"use client";
import { cn } from "@/lib/utlis";
import { Icons } from "./icons";

import Image from "next/image";
import Link from "next/link";

import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "./ui/card";
import { AspectRatio } from "./ui/aspect-ratio";
import { Badge } from "./ui/badge";
import { Property } from "@/types/property";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className={cn("border shadow-md size-full relative overflow-hidden rounded-md")}>
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
            <Badge variant="default" className="absolute top-2 right-2 p-2">
              {property.status}
            </Badge>
          </AspectRatio>
        </CardHeader>
      </Link>
      <CardContent className="p-4 border-b border-gray-200">
        <CardTitle className="text-lg mb-2">
          <strong>${property.price}</strong>
        </CardTitle>
        <Link href={`/property/${property.slug}`}>
          <CardDescription className="mb-4 text-lg font-bold">
            {property.description}
          </CardDescription>
        </Link>
        <CardDescription className="flex h-5 mr-auto">
          <Icons.pin className="size-1 max-h-1" />
          <span className="text-muted-foreground mt-1">{property.address}</span>
        </CardDescription>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-y-4 p-2">
        <Badge variant="secondary" className="mr-2">
          <Icons.bedroom className="mb-1 size-5"></Icons.bedroom>
          <strong className="ml-1">3</strong>
          <span className="ml-1">Bedrooms</span>
        </Badge>
        <Badge variant="secondary" className="mr-2">
          <Icons.bathroom className="mb-1 size-4"></Icons.bathroom>
          <strong className="ml-1">2</strong>
          <span className="ml-1">Bathrooms</span>
        </Badge>
        <Badge variant="secondary" className="">
          <Icons.land className="mb-1 size-5"></Icons.land>
          <strong className="ml-1">3450</strong>
          <span className="ml-1">Sq ft</span>
        </Badge>
      </CardFooter>
    </Card>
  );
}
