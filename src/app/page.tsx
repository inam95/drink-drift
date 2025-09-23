import { Cocktail, fetchRandomCocktails } from "@/lib/api";
import Image from "next/image";
import { Suspense } from "react";

export default async function Home() {
  const result = await fetch(
    "https://www.thecocktaildb.com/api/json/v1/1/random.php"
  );
  const { drinks } = (await result.json()) as { drinks: Cocktail[] };

  return (
    <main className="flex min-h-screen justify-center pt-24">
      <h1 className="font-modern-negra max-w-40 text-center text-3xl md:text-6xl">
        COCKTAILS
      </h1>
      <Suspense fallback={<div>Loading...</div>}>
        {drinks.map((drink) => (
          <div key={drink.idDrink}>
            <Image
              src={drink.strDrinkThumb}
              alt={drink.strDrink}
              width={100}
              height={100}
            />
            <h2>{drink.strDrink}</h2>
            <p>{drink.strCategory}</p>
          </div>
        ))}
      </Suspense>
    </main>
  );
}
