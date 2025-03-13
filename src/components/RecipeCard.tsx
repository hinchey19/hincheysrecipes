import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Users, Tag } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Helper function to generate a slug from a string
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};

export interface RecipeProps {
  id: string;
  title: string;
  description: string;
  image: string;
  prepTime: number;
  servings: number;
  category: string;
  dateAdded?: string;
  ingredients?: string[];
  instructions?: string[];
}

interface RecipeCardProps {
  recipe: RecipeProps;
  className?: string;
}

export const RecipeCard = ({ recipe, className }: RecipeCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const recipeSlug = generateSlug(recipe.title);

  return (
    <Link to={`/recipe/${recipeSlug}`}>
      <Card 
        className={cn(
          "recipe-card overflow-hidden h-full transition-all border border-border/40 hover:border-border/80 hover:shadow-md",
          className
        )}
      >
        <div 
          className={cn(
            "relative h-48 w-full overflow-hidden",
            !imageLoaded && "image-loading bg-muted"
          )}
        >
          <img
            src={recipe.image}
            alt={recipe.title}
            className={cn(
              "w-full h-full object-cover transition-opacity duration-500",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="glass font-medium">
              <Tag className="h-3.5 w-3.5 mr-1" />
              {recipe.category}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{recipe.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2">{recipe.description}</p>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0 flex items-center justify-between">
          <div className="flex items-center text-muted-foreground text-xs">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{recipe.prepTime} min</span>
          </div>
          <div className="flex items-center text-muted-foreground text-xs">
            <Users className="h-3.5 w-3.5 mr-1" />
            <span>{recipe.servings} servings</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default RecipeCard;
