"use client";

import { useState, useCallback, HTMLAttributes, KeyboardEvent, useEffect } from "react";
import Image from "next/image";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

import { cn } from "@/lib/utlis";
import { Button } from "./ui/button";
import { Icons } from "./icons";

type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters["0"];

interface PropertyImageCarouselProps extends HTMLAttributes<HTMLDivElement> {
  imageUrls: string[];
  options?: CarouselOptions;
  //TODO:
  //   options?: EmblaOptionsType
}

export function PropertyImageCarousel({
  imageUrls,
  className,
  options,
  ...props
}: PropertyImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  //   https://www.embla-carousel.com/guides/previous-and-next-buttons/#with-react
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (imageIndex: number) => emblaApi && emblaApi.scrollTo(imageIndex),
    [emblaApi]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowLeft") {
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  const onSelect = useCallback((emblaApi: any) => {
    if (!emblaApi) return;

    setSelectedImageIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (imageUrls.length === 0) {
    return (
      <div
        aria-label="Property Placeholder"
        role="img"
        aria-roledescription="placeholder"
        className="flex aspect-square size-full flex-1 items-center justify-center bg-secondary"
      >
        <Icons.placeholder className="size-9 text-muted-foreground" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      aria-label="Property images carousel"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="-ml-4 flex touch-pan-y" style={{ backfaceVisibility: "hidden" }}>
          {imageUrls.map((imageUrl, index) => (
            <div className="relative aspect-square min-w-0 flex-[0_0_100%] pl-4" key={index}>
              <Image
                aria-label={`Slide ${index + 1} of ${imageUrls.length} property image`}
                role="group"
                key={index}
                src={imageUrl}
                alt="An image of the property"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
      </div>
      {imageUrls.length > 1 ? (
        <div className="flex w-full items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="mr-0.5 aspect-square size-7 rounded-none sm:mr-2 sm:size-8"
            disabled={prevBtnDisabled}
            onClick={scrollPrev}
          >
            <ChevronLeftIcon className="size-3 sm:size-4" aria-hidden="true" />
            <span className="sr-only">Previous slide</span>
          </Button>
          {imageUrls.map((imageUrl, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className={cn(
                "group relative aspect-square size-full max-w-[100px] rounded-none shadow-sm hover:bg-transparent focus-visible:ring-foreground",
                index === selectedImageIndex && "ring-1 ring-foreground"
              )}
              onClick={() => scrollTo(index)}
              onKeyDown={handleKeyDown}
            >
              <div className="absolute inset-0 z-10 bg-zinc-950/20 group-hover:bg-zinc-950/60 transition ease-in-out duration-500" />
              <Image
                src={imageUrl}
                alt="A thumbnail image of the property"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                fill
              />
              <span className="sr-only">
                Slide {index + 1} of {imageUrls.length} property images.
              </span>
            </Button>
          ))}
          <Button
            variant="outline"
            size="icon"
            className="ml-0.5 aspect-square size-7 rounded-none sm:ml-2 sm:size-8"
            disabled={nextBtnDisabled}
            onClick={scrollNext}
          >
            <ChevronRightIcon className="size-3 sm:size-4" aria-hidden="true" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      ) : null}
    </div>
  );
}
