import { Wine } from "lucide-react";

export function EmptyQueryState() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-20">
      <div className="rounded-full bg-gradient-to-br from-blue-100 to-purple-100 p-6">
        <Wine className="h-16 w-16 text-blue-600" />
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
