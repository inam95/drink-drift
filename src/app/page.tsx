import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { RandomCocktailGallery } from "@/components/random-cocktail-gallery";
import { Cocktail } from "@/lib/api";

export default async function Home() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/drink/random?count=5`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch drinks:", response.statusText);
    return (
      <div className="flex flex-col items-center gap-10">
        <h1 className="font-modern-negra mt-32 text-center text-6xl leading-none md:mt-24 md:text-[6vw]">
          COCKTAILS
        </h1>
        <p className="text-center text-lg">Error loading drinks</p>
      </div>
    );
  }

  const data = await response.json();
  const drinks: Cocktail[] = data.data.drinks;

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="font-modern-negra mt-32 text-center text-6xl leading-none md:mt-24 md:text-[6vw]">
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
        <RandomCocktailGallery initialItems={drinks} />
      </Suspense>
      <div className="container mx-auto mt-10 flex items-end justify-between">
        <div className="mx-auto flex w-full flex-col items-center justify-between gap-10 md:mb-16 lg:flex-row lg:items-end">
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
