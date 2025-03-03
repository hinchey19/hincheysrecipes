
import React from "react";
import { RecipeCard, RecipeProps } from "@/components/RecipeCard";

interface RecipeGridProps {
  recipes: RecipeProps[];
}

export const RecipeGrid = ({ recipes }: RecipeGridProps) => {
  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-muted-foreground text-center">
          No recipes found. Try adjusting your search or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default RecipeGrid;
