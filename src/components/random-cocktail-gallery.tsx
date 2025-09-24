"use client";

import { useEffect, useState } from "react";

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
import { CocktailCard } from "./cocktail-card";

export interface RandomCocktailGalleryItem {
  id: string;
  name: string;
  category: string;
  image: string;
}

export interface RandomCocktailGalleryProps {
  items?: RandomCocktailGalleryItem[];
}

const data = [
  {
    id: "12772",
    name: "Iced Coffee Fillip",
    category: "Coffee / Tea",
    image:
      "https://www.thecocktaildb.com/images/media/drink/sxtxrp1454514223.jpg/large"
  },
  {
    id: "12618",
    name: "Orangeade",
    category: "Cocktail",
    image:
      "https://www.thecocktaildb.com/images/media/drink/ytsxxw1441167732.jpg/large"
  },
  {
    id: "13196",
    name: "Long vodka",
    category: "Ordinary Drink",
    image:
      "https://www.thecocktaildb.com/images/media/drink/9179i01503565212.jpg/large"
  },
  {
    id: "17268",
    name: "Blue Hurricane",
    category: "Cocktail",
    image:
      "https://www.thecocktaildb.com/images/media/drink/nwx02s1515795822.jpg/large"
  },
  {
    id: "14586",
    name: "Orange Push-up",
    category: "Ordinary Drink",
    image:
      "https://www.thecocktaildb.com/images/media/drink/mgf0y91503565781.jpg/large"
  }
];

export function RandomCocktailGallery({
  items = data
}: RandomCocktailGalleryProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
  }, [carouselApi]);

  return (
    <section className="container mx-auto">
      <div className="mx-auto w-[70%]">
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
                key={item.id}
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
