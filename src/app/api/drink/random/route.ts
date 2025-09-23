import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({
    data: {
      drinks: [
        {
          idDrink: "123",
          strDrink: "Drink 1",
          strDrinkThumb: "https://www.thecocktaildb.com/images/drink/123.jpg",
          strCategory: "Category 1"
        }
      ]
    }
  });
}
