import React from "react";
import { Link } from "react-router-dom";
import { Clock, Users, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { RecipeGrid } from "@/components/RecipeGrid";
import { mockRecipes } from "@/data/mockData";

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

export const Home = () => {
  // Featured recipe - use the first recipe from mockData
  const featuredRecipe = mockRecipes[0];
  const recipeSlug = generateSlug(featuredRecipe.title);
  
  // Latest recipes - use the next 4 recipes from mockData
  const latestRecipes = mockRecipes.slice(1, 5);
  
  return (
    <Layout>
      <div className="mb-12">
        <div className="rounded-xl overflow-hidden relative h-96 group">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent z-10" />
          <img 
            src={featuredRecipe.image} 
            alt={featuredRecipe.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
          <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
            <Badge className="mb-2">Featured Recipe</Badge>
            <h2 className="text-white text-3xl font-bold mb-2">{featuredRecipe.title}</h2>
            <p className="text-white/90 mb-4 max-w-2xl line-clamp-2">{featuredRecipe.description}</p>
            
            <div className="flex flex-wrap items-center text-white/80 gap-4 mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{featuredRecipe.prepTime} min</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{featuredRecipe.servings} servings</span>
              </div>
            </div>
            
            <Link to={`/recipe/${recipeSlug}`}>
              <Button className="bg-primary hover:bg-primary/90">
                View Recipe
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}; 