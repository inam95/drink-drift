"use client";

import { CocktailCard } from "@/components/cocktail-card";
import { EmptyQueryState } from "@/components/empty-query-state";
import { useFavoritesStore } from "@/lib/store";

export default function FavoritesPage() {
  const favorites = useFavoritesStore((state) => state.favorites);

  const isFavoritesEmpty = favorites.length === 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="mt-24 space-y-2 text-center md:mt-16">
            <h1 className="text-center font-sans text-4xl font-bold md:text-left md:text-5xl">
              Favorites
            </h1>
          </div>
        </div>

        <div className="space-y-8">
          {isFavoritesEmpty && (
            <div className="text-center text-lg">No favorites yet</div>
          )}
          <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((cocktail) => (
              <div key={cocktail.idDrink} className="group w-full">
                <CocktailCard key={cocktail.idDrink} item={cocktail} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
