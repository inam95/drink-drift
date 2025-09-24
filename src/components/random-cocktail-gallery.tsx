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
import { Cocktail } from "@/lib/api";

export interface RandomCocktailGalleryProps {
  items?: Cocktail[];
}

const data = [
  {
    idDrink: "12772",
    strDrink: "Iced Coffee Fillip",
    strCategory: "Coffee / Tea",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/sxtxrp1454514223.jpg/large"
  },
  {
    idDrink: "12618",
    strDrink: "Orangeade",
    strCategory: "Cocktail",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/ytsxxw1441167732.jpg/large"
  },
  {
    idDrink: "13196",
    strDrink: "Long vodka",
    strCategory: "Ordinary Drink",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/9179i01503565212.jpg/large"
  },
  {
    idDrink: "17268",
    strDrink: "Blue Hurricane",
    strCategory: "Cocktail",
    strDrinkThumb:
      "https://www.thecocktaildb.com/images/media/drink/nwx02s1515795822.jpg/large"
  },
  {
    idDrink: "14586",
    strDrink: "Orange Push-up",
    strCategory: "Ordinary Drink",
    strDrinkThumb:
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
