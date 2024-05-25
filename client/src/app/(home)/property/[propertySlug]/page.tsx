import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

import { Separator } from "@/components/ui/separator";
import PropertyCard from "@/components/property-card";
import { Shell } from "@/components/shell";
import { PropertyImageCarousel } from "@/components/property-image-carousel";
import { getPropertyBySlug } from "@/actions/property";
import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import House from "./_components/house";

interface PropertyPageProps {
  params: {
    propertySlug: string;
  };
}

//TODO: Generate Metada for individual property page

export default async function PropertyPage({ params }: PropertyPageProps) {
  const propertySlug = params.propertySlug;

  //TODO: Implement fetching of property by its slug
  const property = await getPropertyBySlug(propertySlug);

  console.log(property);

  if (!property) {
    return notFound();
  }

  return (
    <Shell className="pb-12 md:pb-14 bg-slate-50 dark:bg-transparent">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <div className="w-full md:w-1/2">
          <PropertyImageCarousel
            className="w-full"
            imageUrls={property.imageUrl ?? ["https://placehold.co/1800x1200.png"]}
            options={{ loop: true }}
          />
          <div className="mt-8 p-4 rounded-lg flex justify-center">
            <Avatar className="mr-4 h-20 w-20">
              <AvatarImage
                alt="Profile Image"
                fill
                src={property.profilePicUrl ?? "https://ui.shadcn.com/avatars/04.png"}
              />
              <AvatarFallback>
                {property.firstName?.[0]}
                {property.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col justify-center">
              <p className="text-lg font-medium">
                {property.firstName} {property.lastName}
              </p>
              <div className="flex items-center mt-1">
                <Icons.phone className="mr-2"></Icons.phone>
                <p className="text-sm text-muted-foreground">{property.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="mt-4 md:hidden" />
        {property.propertyType === "House" && <House property={property} />}
      </div>
    </Shell>
  );
}
