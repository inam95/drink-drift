import { searchCocktails } from "@/lib/api";
import { Suspense } from "react";
import { SearchInput } from "@/components/search-input";
import { CocktailCard } from "@/components/cocktail-card";
import { loadSearchParams } from "@/lib/search-params";
import { Search, Sparkles, Wine, AlertCircle, Loader2 } from "lucide-react";

// Empty Query State Component
function EmptyQueryState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-20">
      <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-6 dark:from-blue-900/20 dark:to-purple-900/20">
        <Wine className="h-16 w-16 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="space-y-3 text-center">
        <h3 className="text-foreground text-2xl font-semibold">
          Ready to Explore?
        </h3>
        <p className="text-muted-foreground max-w-md">
          Start your cocktail journey by typing a cocktail name, ingredient, or
          style in the search bar above.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {["Margarita", "Mojito", "Old Fashioned", "Cosmopolitan"].map(
          (suggestion) => (
            <span
              key={suggestion}
              className="bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer rounded-full px-3 py-1 text-sm transition-colors"
            >
              {suggestion}
            </span>
          )
        )}
      </div>
    </div>
  );
}

// No Results State Component
function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-20">
      <div className="rounded-full bg-gradient-to-br from-orange-100 to-red-100 p-6 dark:from-orange-900/20 dark:to-red-900/20">
        <AlertCircle className="h-16 w-16 text-orange-600 dark:text-orange-400" />
      </div>
      <div className="space-y-3 text-center">
        <h3 className="text-foreground text-2xl font-semibold">
          No Cocktails Found
        </h3>
        <p className="text-muted-foreground max-w-md">
          We couldn't find any cocktails matching "{query}". Try searching with
          different keywords or check your spelling.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {["Martini", "Daiquiri", "Whiskey Sour", "Gin Fizz"].map(
          (suggestion) => (
            <span
              key={suggestion}
              className="bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer rounded-full px-3 py-1 text-sm transition-colors"
            >
              {suggestion}
            </span>
          )
        )}
      </div>
    </div>
  );
}

// Loading State Component
function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-20">
      <div className="rounded-full bg-gradient-to-br from-green-100 to-blue-100 p-6 dark:from-green-900/20 dark:to-blue-900/20">
        <Loader2 className="h-16 w-16 animate-spin text-green-600 dark:text-green-400" />
      </div>
      <div className="space-y-3 text-center">
        <h3 className="text-foreground text-2xl font-semibold">
          Mixing Up Results
        </h3>
        <p className="text-muted-foreground">
          Searching through our cocktail database...
        </p>
      </div>
    </div>
  );
}

// Results Grid Component
function ResultsGrid({ cocktails }: { cocktails: any[] }) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cocktails.map((cocktail) => (
        <div
          key={cocktail.idDrink}
          className="group max-w-[300px] lg:max-w-[320px]"
        >
          <CocktailCard key={cocktail.idDrink} item={cocktail} />
        </div>
      ))}
    </div>
  );
}

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await loadSearchParams(searchParams);
  const cocktails = await searchCocktails(query);

  const isQueryEmpty = query === "";
  const isCocktailsEmpty = query && cocktails.length === 0;
  const hasResults = query && cocktails.length > 0;

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-6">
          <div className="mt-24 space-y-2 text-center md:mt-16">
            <h1 className="text-left font-sans text-4xl font-bold md:text-5xl">
              Cocktail Explorer
            </h1>
          </div>
        </div>

        {/* Search Input Section */}
        <div className="mb-6">
          <div className="mx-auto w-full">
            <SearchInput />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-8">
          {isQueryEmpty && <EmptyQueryState />}

          {isCocktailsEmpty && <NoResultsState query={query} />}

          {hasResults && (
            <div className="space-y-4">
              <div className="text-left">
                <p className="text-muted-foreground font-sans text-sm">
                  Results for "{query}"
                </p>
              </div>
              <Suspense fallback={<LoadingState />}>
                <ResultsGrid cocktails={cocktails} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
