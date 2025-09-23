const API_BASE = "https://www.thecocktaildb.com/api/json/v1/1";

export interface Cocktail {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strCategory: string;
}

export async function fetchCocktail(endpoint: string) {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) throw new Error("API fetch failed");
  const data = (await res.json()) as { drinks: Cocktail[] };
  return data.drinks || [];
}

export async function fetchRandomCocktails(count: number) {
  // const cocktails: Cocktail[] = [];
  // Promise.all(
  //   Array.from({ length: count }, async () => {
  //     const random = await fetch(`${API_BASE}/random.php`);
  //     console.log(random);
  //     const id = (await random.json()) as { drinks: Cocktail[] };
  //     if (id) {
  //       cocktails.push(id.drinks[0]);
  //     }
  //   })
  // );
  // console.log(cocktails);
  // return cocktails;
}
