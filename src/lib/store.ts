import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type FavoritesStore = {
  favorites: string[];
  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
};

export const useFavoritesStore = create<FavoritesStore>()(
  devtools(
    persist(
      (set) => ({
        favorites: [],
        addFavorite: (id: string) =>
          set((state) => ({ favorites: [...state.favorites, id] })),
        removeFavorite: (id: string) =>
          set((state) => ({
            favorites: state.favorites.filter((favorite) => favorite !== id)
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
