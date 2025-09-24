import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import SearchPage from "../page";

// Mock the components
vi.mock("@/components/cocktail-card", () => ({
  CocktailCard: ({ item }: { item: { idDrink: string; strDrink: string } }) => (
    <div data-testid={`cocktail-card-${item.idDrink}`}>
      <h3>{item.strDrink}</h3>
    </div>
  )
}));

vi.mock("@/components/search-input", () => ({
  SearchInput: () => (
    <input data-testid="search-input" placeholder="Search..." />
  )
}));

vi.mock("@/components/no-result", () => ({
  NoResultsState: ({ query }: { query: string }) => (
    <div data-testid="no-results">No results for "{query}"</div>
  )
}));

vi.mock("@/components/empty-query-state", () => ({
  EmptyQueryState: () => (
    <div data-testid="empty-query-state">Enter a search term</div>
  )
}));

vi.mock("@/components/loading", () => ({
  default: () => <div data-testid="loading">Loading...</div>
}));

vi.mock("@/lib/search-params", () => ({
  loadSearchParams: vi.fn()
}));

// Mock environment variable
vi.stubEnv("NEXT_PUBLIC_BASE_URL", "http://localhost:3000");

// Mock fetch
global.fetch = vi.fn();

describe("SearchPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should render cocktail cards when there is a valid query with results", async () => {
    const mockCocktails = [
      {
        idDrink: "1",
        strDrink: "Margarita",
        strCategory: "Ordinary Drink",
        strAlcoholic: "Alcoholic"
      },
      {
        idDrink: "2",
        strDrink: "Mojito",
        strCategory: "Cocktail",
        strAlcoholic: "Alcoholic"
      }
    ];

    // Mock search params
    const { loadSearchParams } = await import("@/lib/search-params");
    vi.mocked(loadSearchParams).mockResolvedValue({ query: "margarita" });

    // Mock successful fetch response
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockCocktails })
    } as Response);

    const searchParams = Promise.resolve({ query: "margarita" });
    render(await SearchPage({ searchParams }));

    // Check that the search results are displayed
    expect(screen.getByText('Results for "margarita"')).toBeInTheDocument();

    // Check that cocktail cards are rendered
    expect(screen.getByTestId("cocktail-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("cocktail-card-2")).toBeInTheDocument();
    expect(screen.getByText("Margarita")).toBeInTheDocument();
    expect(screen.getByText("Mojito")).toBeInTheDocument();

    // Verify fetch was called with correct URL
    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:3000/api/drink/search?query=margarita",
      { cache: "no-store" }
    );
  });

  it("should show empty query state when no search query is provided", async () => {
    // Mock search params with empty query
    const { loadSearchParams } = await import("@/lib/search-params");
    vi.mocked(loadSearchParams).mockResolvedValue({ query: "" });

    // Mock successful fetch response (though it shouldn't be called)
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ data: [] })
    } as Response);

    const searchParams = Promise.resolve({ query: "" });
    render(await SearchPage({ searchParams }));

    // Check that the empty query state is displayed
    expect(screen.getByTestId("empty-query-state")).toBeInTheDocument();
    expect(screen.getByText("Enter a search term")).toBeInTheDocument();

    // Check that search input is present
    expect(screen.getByTestId("search-input")).toBeInTheDocument();

    // Check that page header is present
    expect(screen.getByText("Cocktail Explorer")).toBeInTheDocument();

    // Verify no cocktail cards are rendered
    expect(screen.queryByTestId(/cocktail-card-/)).not.toBeInTheDocument();
  });
});
