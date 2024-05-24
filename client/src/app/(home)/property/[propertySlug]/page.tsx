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
import { formatPrice } from "@/lib/formatPrice";
import { Icons } from "@/components/icons";
import { formatBuiltDate, formatListedAtDate } from "@/lib/formatDate";

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
    <Shell className="pb-12 md:pb-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <PropertyImageCarousel
          className="w-full md:w-1/2"
          imageUrls={property.imageUrl ?? ["https://placehold.co/1800x1200.png"]}
          options={{ loop: true }}
        />
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 font-bold text-2xl">{property.title}</h2>
            <p className="text-muted-foreground text-base font-medium">
              ${formatPrice(property.price)} {property.toRent && "per month"}
            </p>
            <p className="text-sm text-muted-foreground flex items-center">
              <Icons.eye className="mr-2 size-4" />
              {property.views} views
              <span className="mx-4"></span>
              <Icons.calendar className="mr-2 size-4" />
              Posted: {formatListedAtDate(property.listedAt)} ago
            </p>
          </div>
          <Separator className="my-1.5" />
          <div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2 lg:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                <h3 className="font-bold">House Type</h3>
                <div className="flex items-center">
                  <Icons.bedroom />
                  <p className="text-muted-foreground ml-2">{property.houseType}</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                <h3 className="font-bold">Rooms</h3>
                <div className="flex items-center">
                  <Icons.bedroom />
                  <p className="text-muted-foreground ml-2">{property.roomCount}</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                <h3 className="font-bold">Bathrooms</h3>
                <div className="flex items-center">
                  <Icons.bathroom />
                  <p className="text-muted-foreground ml-2">{property.bathroomCount}</p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                <h3 className="font-bold">Kitchen</h3>
                <div className="flex items-center">
                  <Icons.bedroom />
                  <p className="text-muted-foreground ml-2">{property.kitchenCount}</p>
                </div>
              </div>
            </div>
            {property.furnished && (
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                  <h3 className="font-bold">Furnished</h3>
                  <div className="flex items-center">
                    <Icons.bedroom />
                    <p className="text-muted-foreground ml-2">{property.furnished && "Yes"}</p>
                  </div>
                </div>
              </div>
            )}
            {property.carParking && (
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                  <h3 className="font-bold">Car Parking</h3>
                  <div className="flex items-center">
                    <Icons.bedroom />
                    <p className="text-muted-foreground ml-2">{property.carParking}</p>
                  </div>
                </div>
              </div>
            )}
            {property.bikeParking && (
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                  <h3 className="font-bold">Bike Parking</h3>
                  <div className="flex items-center">
                    <Icons.bedroom />
                    <p className="text-muted-foreground ml-2">{property.bikeParking}</p>
                  </div>
                </div>
              </div>
            )}
            {property.houseFacing && (
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                  <h3 className="font-bold">House Facing</h3>
                  <div className="flex items-center">
                    <Icons.bedroom />
                    <p className="text-muted-foreground ml-2">{property.houseFacing}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                <h3 className="font-bold">EV Charging</h3>
                <div className="flex items-center">
                  <Icons.bedroom />
                  <p className="text-muted-foreground ml-2">
                    {property.evCharging ? "Yes" : "Unavailable"}
                  </p>
                </div>
              </div>
            </div>
            {property.houseArea && (
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                  <h3 className="font-bold">Area</h3>
                  <div className="flex items-center">
                    <Icons.bedroom />
                    <p className="text-muted-foreground ml-2">{property.houseArea}</p>
                  </div>
                </div>
              </div>
            )}
            {property.builtAt && (
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                  <h3 className="font-bold">Built At</h3>
                  <div className="flex items-center">
                    <Icons.bedroom />
                    <p className="text-muted-foreground ml-2">
                      {formatBuiltDate(property.builtAt)}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                <h3 className="font-bold">Connected To Road</h3>
                <div className="flex items-center">
                  <Icons.bedroom />
                  <p className="text-muted-foreground ml-2">
                    {property.houseConnectedToRoad ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>
            {!property.houseConnectedToRoad && (
              <div className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[75px] w-full max-w-[400px] flex-col justify-between rounded-md p-2">
                  <h3 className="font-bold">Distance to road</h3>
                  <div className="flex items-center">
                    <Icons.bedroom />
                    <p className="text-muted-foreground ml-2">{property.houseDistanceToRoad}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Separator className="my-1.5" />
          <div className="mb-4">
            <div className="mb-6">
              <h2 className="font-bold text-xl mb-4">Description</h2>
              <p>{property.description}</p>
            </div>
            <div className="mb-4">
              <h2 className="font-bold text-xl mb-4">Close Landmark</h2>
              <div className="flex items-center">
                <Icons.mapPin className="size-5" />
                <p className="ml-3">{property.closeLandmark}</p>
              </div>
            </div>
          </div>
          <Separator className="my-1.5" />
        </div>
      </div>
    </Shell>
  );
}
