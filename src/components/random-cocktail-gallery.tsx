"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
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
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "./ui/card";

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
      "https://www.thecocktaildb.com/images/media/drink/sxtxrp1454514223.jpg"
  },
  {
    id: "12618",
    name: "Orangeade",
    category: "Cocktail",
    image:
      "https://www.thecocktaildb.com/images/media/drink/ytsxxw1441167732.jpg"
  },
  {
    id: "13196",
    name: "Long vodka",
    category: "Ordinary Drink",
    image:
      "https://www.thecocktaildb.com/images/media/drink/9179i01503565212.jpg"
  },
  {
    id: "17268",
    name: "Blue Hurricane",
    category: "Cocktail",
    image:
      "https://www.thecocktaildb.com/images/media/drink/nwx02s1515795822.jpg"
  },
  {
    id: "14586",
    name: "Orange Push-up",
    category: "Ordinary Drink",
    image:
      "https://www.thecocktaildb.com/images/media/drink/mgf0y91503565781.jpg"
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
          <CarouselContent className="ml-0">
            {items.map((item, index) => (
              <CarouselItem
                key={item.id}
                className={cn("group max-w-[300px] pl-5 lg:max-w-[320px]", {
                  "pl-0": index === 0
                })}
              >
                <div className="group bg-yellow-text/15 group-hover:bg-yellow-text/20 flex flex-col rounded-xl transition-colors duration-300">
                  <div className="group relative min-h-[15rem] max-w-full overflow-hidden rounded-xl rounded-b-none md:aspect-[5/4] lg:aspect-[16/9]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="absolute h-1/2 w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-primary flex flex-col items-start p-2">
                    <div className="mb-2 pt-4 text-xl font-semibold md:mb-3 md:pt-4 lg:pt-4">
                      {item.name}
                    </div>
                    <div className="mb-8 line-clamp-2 md:mb-12 lg:mb-9">
                      {item.category}
                    </div>
                  </div>
                </div>
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
