import { Suspense } from "react";

import { CocktailCard } from "@/components/cocktail-card";
import Loading from "@/components/loading";
import { NoResultsState } from "@/components/no-result";
import { SearchInput } from "@/components/search-input";
import { Cocktail } from "@/lib/types";
import { loadSearchParams } from "@/lib/search-params";
import { EmptyQueryState } from "@/components/empty-query-state";

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ query: string }>;
}) {
  const { query } = await loadSearchParams(searchParams);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/drink/search?query=${query}`,
    {
      cache: "no-store"
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch cocktails:", response.statusText);
    return (
      <div className="flex flex-col items-center gap-10">
        <h1 className="font-modern-negra mt-32 text-center text-6xl leading-none md:mt-24 md:text-[6vw]">
          COCKTAILS
        </h1>
        <p className="text-center text-lg">Error loading drinks</p>
      </div>
    );
  }

  const data = await response.json();
  const cocktails: Cocktail[] = data.data;

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
              <Suspense fallback={<Loading />}>
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
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
