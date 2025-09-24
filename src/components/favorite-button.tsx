"use client";

import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Cocktail } from "@/lib/types";
import { useFavoritesStore } from "@/lib/store";

export function FavoriteButton({ item }: { item: Cocktail }) {
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const favorites = useFavoritesStore((state) => state.favorites);

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-10 w-10 rounded-full bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:shadow-xl"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (favorites.includes(item.idDrink)) {
          removeFavorite(item.idDrink);
        } else {
          addFavorite(item.idDrink);
        }
      }}
    >
      <Heart
        fill={favorites.includes(item.idDrink) ? "currentColor" : "none"}
        className="h-5 w-5 text-red-600 transition-colors duration-300 hover:text-red-500"
      />
    </Button>
  );
}
