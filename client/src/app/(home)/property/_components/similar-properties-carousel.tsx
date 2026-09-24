"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

import PropertyCard from "@/components/property-card";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/property";

interface SimilarPropertiesCarouselProps {
  properties: Property[];
}

export default function SimilarPropertiesCarousel({ properties }: SimilarPropertiesCarouselProps) {
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    //We update the buttons when the user scrolls or the available width changes.
    const updateScrollButtons = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      setPrevBtnDisabled(scrollLeft <= 1);
      setNextBtnDisabled(scrollLeft + clientWidth >= scrollWidth - 1);
    };

    updateScrollButtons();

    scrollContainer.addEventListener("scroll", updateScrollButtons, {
      passive: true
    });

    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(scrollContainer);

    //The card width also changes at responsive breakpoints.
    if (scrollContainer.firstElementChild) {
      resizeObserver.observe(scrollContainer.firstElementChild);
    }

    return () => {
      scrollContainer.removeEventListener("scroll", updateScrollButtons);
      resizeObserver.disconnect();
    };
  }, [properties]);

  const scrollProperties = (direction: "previous" | "next") => {
    const scrollContainer = scrollContainerRef.current;
    const firstPropertyCard = scrollContainer?.firstElementChild;

    if (!scrollContainer || !firstPropertyCard) {
      return;
    }

    //We move by one card and its gap, keeping the next card aligned.
    const cardWidth = firstPropertyCard.getBoundingClientRect().width;
    const gap = parseFloat(window.getComputedStyle(scrollContainer).columnGap) || 0;
    const scrollDistance = cardWidth + gap;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    scrollContainer.scrollBy({
      left: direction === "next" ? scrollDistance : -scrollDistance,
      behavior: prefersReducedMotion ? "instant" : "smooth"
    });
  };

  if (properties.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="similar-properties-heading"
      className="mx-auto w-full min-w-0 max-w-[1168px] border-t pt-8"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 id="similar-properties-heading" className="text-2xl font-bold">
            Similar listings
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Similar properties, with featured listings shown first.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="aspect-square size-7 rounded-none sm:size-8"
            disabled={prevBtnDisabled}
            onClick={() => scrollProperties("previous")}
            aria-label="Show previous properties"
            aria-controls="similar-properties-list"
          >
            <ChevronLeftIcon className="size-3 sm:size-4" aria-hidden="true" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="aspect-square size-7 rounded-none sm:size-8"
            disabled={nextBtnDisabled}
            onClick={() => scrollProperties("next")}
            aria-label="Show next properties"
            aria-controls="similar-properties-list"
          >
            <ChevronRightIcon className="size-3 sm:size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      {/* Only this row scrolls horizontally. The rest of the page keeps its width. */}
      <ul
        id="similar-properties-list"
        ref={scrollContainerRef}
        tabIndex={0}
        aria-label="Similar property listings"
        className="
          m-0 grid w-full min-w-0 list-none grid-flow-col
          auto-cols-[min(85%,320px)]
          gap-4 overflow-x-auto overscroll-x-contain
          snap-x snap-mandatory pb-4 pt-1
          lg:auto-cols-[calc((100%_-_3rem)/3.5)]
        "
      >
        {properties.map((property) => (
          <li key={property.id} className="min-w-0 snap-start">
            <PropertyCard property={property} />
          </li>
        ))}
      </ul>
    </section>
  );
}
