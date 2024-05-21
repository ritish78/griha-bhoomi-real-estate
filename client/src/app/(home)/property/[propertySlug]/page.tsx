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
// import { getPropertyBySlug } from "@/actions/property";

interface PropertyPageProps {
  params: {
    propertySlug: string;
  };
}

const imageUrls = [
  "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1584738766473-61c083514bf4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
];

//TODO: Generate Metada for individual property page

export default async function PropertyPage({ params }: PropertyPageProps) {
  const propertySlug = params.propertySlug;

  //TODO: Implement fetching of property by its slug
  // const data = await getPropertyBySlug(propertySlug);

  // console.log(data);

  return (
    <Shell className="pb-12 md:pb-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <PropertyImageCarousel
          className="w-full md:w-1/2"
          // imageUrls={data.imageUrl ?? []}
          imageUrls={imageUrls}
          options={{ loop: true }}
        />
      </div>
    </Shell>
  );
}
