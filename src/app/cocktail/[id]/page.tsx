import { Cocktail } from "@/lib/types";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Wine, Tag, Award, Calendar } from "lucide-react";

export default async function CocktailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/drink/${id}`
  );
  const cocktail = (await data.json()) as { data: Cocktail };
  const drink = cocktail.data;

  const isAlcoholic = drink.strAlcoholic === "Alcoholic";
  const tags = drink.strTags?.split(",") || [];

  return (
    <div>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mt-32 mb-12 grid gap-12 md:mt-24 lg:grid-cols-2">
          <div className="relative">
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src={drink.strDrinkThumb}
                alt={drink.strDrink}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col gap-6">
            {/* Title and Badges */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold lg:text-5xl">
                {drink.strDrink}
              </h1>
              <div className="flex flex-wrap gap-2">
                {isAlcoholic && (
                  <Badge
                    variant="secondary"
                    className="border-yellow-text bg-yellow-text/20"
                  >
                    {drink.strAlcoholic}
                  </Badge>
                )}
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-yellow-text"
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            </div>
            <Card className="gap-2 p-0">
              <CardHeader className="to-yellow-text rounded-t-lg bg-gradient-to-r from-yellow-500 py-1.5">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="prose prose-lg max-w-none">
                  <p className="text-base text-slate-500">
                    {drink.strInstructions}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
