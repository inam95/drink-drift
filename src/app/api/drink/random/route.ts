import { NextRequest, NextResponse } from "next/server";

import { Cocktail } from "@/lib/api";
import { API_BASE } from "@/constants/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const count = parseInt(searchParams.get("count") || "5");

    if (count < 1 || count > 10) {
      return NextResponse.json(
        { error: "Count must be between 1 and 10" },
        { status: 400 }
      );
    }

    const uniqueDrinks = new Map<string, Cocktail>();
    const maxAttempts = count * 5;
    let attempts = 0;

    // Keep fetching until we have the requested count of unique drinks
    while (uniqueDrinks.size < count && attempts < maxAttempts) {
      attempts++;

      try {
        const res = await fetch(`${API_BASE}/random.php`);
        if (!res.ok) {
          throw new Error("Failed to fetch random cocktail");
        }

        const data = (await res.json()) as { drinks: Cocktail[] };

        if (data.drinks && data.drinks.length > 0) {
          const drink = data.drinks[0];
          uniqueDrinks.set(drink.idDrink, drink);
        }

        // Small delay to avoid rapid-fire requests
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Attempt ${attempts} failed:`, error);
      }
    }

    const result = Array.from(uniqueDrinks.values());

    return NextResponse.json({
      data: {
        drinks: result
      }
    });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Failed to fetch random drinks" },
      { status: 500 }
    );
  }
}
