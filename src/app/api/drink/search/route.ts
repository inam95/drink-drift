import { NextRequest, NextResponse } from "next/server";

import { API_BASE } from "@/constants/api";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json({ data: [] }, { status: 200 });
    }

    const response = await fetch(`${API_BASE}/search.php?s=${query}`);
    if (!response.ok) {
      throw new Error("Failed to fetch cocktails");
    }
    const data = await response.json();
    return NextResponse.json({ data: data.drinks || [] });
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    return NextResponse.json(
      { error: "Failed to fetch cocktails" },
      { status: 500 }
    );
  }
}
