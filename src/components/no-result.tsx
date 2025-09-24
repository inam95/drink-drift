import { AlertCircle } from "lucide-react";

export function NoResultsState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-20">
      <div className="rounded-full bg-gradient-to-br from-orange-100 to-red-100 p-6">
        <AlertCircle className="h-16 w-16 text-orange-600" />
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
