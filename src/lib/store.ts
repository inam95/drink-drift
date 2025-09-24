import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { Cocktail } from "./types";

export type FavoritesStore = {
  favorites: Cocktail[];
  addFavorite: (id: Cocktail) => void;
  removeFavorite: (id: Cocktail) => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  devtools(
    persist(
      (set) => ({
        favorites: [],
        addFavorite: (id: Cocktail) =>
          set((state) => ({ favorites: [...state.favorites, id] })),
        removeFavorite: (id: Cocktail) =>
          set((state) => ({
            favorites: state.favorites.filter(
              (favorite) => favorite.idDrink !== id.idDrink
            )
          }))
      }),
      {
        name: "favorites-storage"
      }
    ),
    {
      name: "favorites-store"
    }
  )
);
