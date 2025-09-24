import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { CardContent } from "@/components/ui/card";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Cocktail, fetchRandomCocktails } from "@/lib/api";
import { RandomCocktailGallery } from "@/components/random-cocktail-gallery";

export default async function Home() {
  const result = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/random.php"
  );
  const { drinks } = (await result.json()) as { drinks: Cocktail[] };

  const drink = drinks[0];

  console.log(drink);

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="font-modern-negra mt-32 text-center text-6xl leading-none md:mt-20 md:text-[6vw]">
        COCKTAILS
      </h1>
      <Image
        src="/images/hero-left-leaf.png"
        alt="left-leaf"
        className="absolute -bottom-20 left-0 w-1/3 md:top-20 md:bottom-auto md:w-fit xl:top-36 2xl:top-52"
        width={266}
        height={461}
      />
      <Image
        src="/images/hero-right-leaf.png"
        alt="right-leaf"
        className="absolute top-1/2 right-0 w-24 md:bottom-0 md:w-fit xl:top-0 2xl:top-12"
        width={228}
        height={478}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <RandomCocktailGallery />
      </Suspense>
      <div className="container mx-auto mt-10 flex items-end justify-between">
        <div className="mx-auto flex w-full flex-col items-center justify-between gap-10 lg:flex-row lg:items-end">
          <div className="hidden space-y-5 md:block">
            <p className="font-sans font-semibold">Cool. Crisp. Classic.</p>
            <p className="font-modern-negra text-yellow-text max-w-xl text-6xl">
              Sip the Spirit <br /> of Summer
            </p>
          </div>

          <div className="w-full space-y-5 text-lg md:max-w-xs lg:max-w-2xs">
            <p className="text-left">
              Every cocktail on our menu is a blend of premium ingredients,
              creative flair, and timeless recipes — designed to delight your
              senses.
            </p>
            <Link
              href="/search"
              className="hover:text-yellow-text text-center font-sans font-semibold opacity-80 2xl:text-start"
            >
              View cocktails
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
