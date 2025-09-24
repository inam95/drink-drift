const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1";

export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
}

export async function searchCocktails(query: string) {
  if (!query) {
    return [];
  }
  const res = await fetch(`${API_BASE}/search.php?s=${query}`);
  if (!res.ok) {
    throw new Error("Failed to search cocktails");
  }
  const data = (await res.json()) as { drinks: Cocktail[] };
  return data.drinks || [];
}

export async function fetchRandomCocktails(count: number) {}
