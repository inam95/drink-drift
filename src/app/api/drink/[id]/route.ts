import { NextRequest, NextResponse } from "next/server";

import { API_BASE } from "@/constants/api";

export async function GET(req: NextRequest) {
  try {
    const id = req.nextUrl.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const response = await fetch(`${API_BASE}/lookup.php?i=${id}`);
    const data = await response.json();
    return NextResponse.json({ data: data.drinks[0] });
  } catch (error) {
    console.error("Error fetching cocktail:", error);
    return NextResponse.json(
      { error: "Failed to fetch cocktail" },
      { status: 500 }
    );
  }
}
