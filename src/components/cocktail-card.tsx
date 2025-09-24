import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Cocktail } from "@/lib/api";
import { FavoriteButton } from "@/components/favorite-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export function CocktailCard({ item }: { item: Cocktail }) {
  return (
    <Card className="group relative gap-2 overflow-hidden border-0 bg-gradient-to-br from-yellow-50/20 to-yellow-100/10 p-0 shadow-lg transition-all duration-500 hover:shadow-yellow-500/10">
      {/* Image Container with Overlay */}
      <div className="relative h-80 overflow-hidden">
        <Image
          src={item.strDrinkThumb}
          alt={item.strDrink}
          fill
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4 translate-y-2 font-sans opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-lg backdrop-blur-sm">
            {item.strCategory}
          </span>
        </div>

        {/* Heart Button */}
        <div className="absolute top-4 right-4">
          <FavoriteButton item={item} />
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="line-clamp-2 h-6 font-sans text-base leading-tight font-bold text-gray-900 uppercase transition-colors duration-300 group-hover:text-yellow-600">
            {item.strDrink}
          </h3>
        </div>
      </CardContent>

      {/* Footer with Action */}
      <CardFooter className="p-6 pt-0">
        <Button
          variant="outline"
          className="w-full border-yellow-200 font-sans text-yellow-700 transition-all duration-300 group-hover:shadow-md hover:border-yellow-300 hover:bg-yellow-50"
        >
          View
          <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}
