"use client";

import { CocktailCard } from "@/components/cocktail-card";
import { useFavoritesStore } from "@/lib/store";

export default function FavoritesPage() {
  const favorites = useFavoritesStore((state) => state.favorites);

  const isFavoritesEmpty = favorites.length === 0;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mt-24 space-y-2 text-center md:mt-16">
          <h1 className="text-left font-sans text-4xl font-bold md:text-5xl">
            Favorites
          </h1>
        </div>

        {isFavoritesEmpty && (
          <div className="text-center text-lg">No favorites yet</div>
        )}
      </div>
      <div className="container mx-auto">
        <div className="">
          <div className="mx-auto w-full">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favorites.map((favorite) => (
                <CocktailCard key={favorite.idDrink} item={favorite} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
