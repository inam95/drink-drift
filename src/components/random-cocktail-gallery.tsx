"use client";

import { useEffect, useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { CocktailCard } from "@/components/cocktail-card";
import { Cocktail } from "@/lib/api";
import { RefreshCw } from "lucide-react";

export interface RandomCocktailGalleryProps {
  initialItems?: Cocktail[];
}

export function RandomCocktailGallery({
  initialItems = []
}: RandomCocktailGalleryProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [items, setItems] = useState<Cocktail[]>(initialItems);

  const [isPending, startTransition] = useTransition();

  const fetchNewCocktails = async () => {
    startTransition(async () => {
      try {
        const response = await fetch("/api/drink/random?count=5");
        if (!response.ok) {
          throw new Error("Failed to fetch new cocktails");
        }
        const data = await response.json();
        setItems(data.data.drinks);
      } catch (error) {
        console.error("Error fetching new cocktails:", error);
      }
    });
  };

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
  }, [carouselApi]);

  return (
    <section className="container mx-auto">
      <div className="mx-auto w-[70%]">
        <div className="mb-4 flex justify-center">
          <Button
            onClick={fetchNewCocktails}
            disabled={isPending}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isPending && "animate-spin")} />
            {isPending ? "Loading..." : "Refresh Cocktails"}
          </Button>
        </div>
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true
              }
            }
          }}
        >
          <CarouselContent className="my-2 ml-0">
            {items.map((item, index) => (
              <CarouselItem
                key={item.idDrink}
                className={cn("group max-w-[300px] pl-5 lg:max-w-[320px]", {
                  "pl-0": index === 0
                })}
              >
                <CocktailCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
