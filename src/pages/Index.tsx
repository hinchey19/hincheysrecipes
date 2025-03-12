import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Clock, Users, Search } from "lucide-react";
import { Layout } from "@/components/Layout";
import { RecipeCard, RecipeProps } from "@/components/RecipeCard";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockRecipes } from "@/data/mockData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter recipes based on search query
  const filteredRecipes = mockRecipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get featured recipe (Roasted Leg of Lamb)
  const featuredRecipe = mockRecipes.find(recipe => recipe.id === "13") || mockRecipes[0];
  
  // Get latest 4 recipes sorted by dateAdded (newest first)
  const latestRecipes = [...mockRecipes]
    .sort((a, b) => {
      // If dateAdded is available, use it for sorting
      if (a.dateAdded && b.dateAdded) {
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      }
      // Fallback to ID sorting if dateAdded is not available
      return parseInt(b.id) - parseInt(a.id);
    })
    .slice(0, 4);
  
  // Group recipes by category
  const recipesByCategory = mockRecipes.reduce((acc, recipe) => {
    if (!acc[recipe.category]) {
      acc[recipe.category] = [];
    }
    acc[recipe.category].push(recipe);
    return acc;
  }, {} as Record<string, RecipeProps[]>);

  // Determine what to display based on search query
  const showSearchResults = searchQuery.trim() !== "";

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero Section - Hide when searching */}
        {!showSearchResults && (
          <section className="relative rounded-xl overflow-hidden h-[300px] md:h-[400px]">
            {featuredRecipe && (
              <>
                <div className="absolute inset-0">
                  <img 
                    src={featuredRecipe.image} 
                    alt={featuredRecipe.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="max-w-3xl">
                    <span className="inline-block mb-2 text-sm font-medium px-3 py-1 rounded-full bg-primary/80 backdrop-blur-sm">
                      Featured Recipe
                    </span>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{featuredRecipe.title}</h1>
                    <p className="text-white/80 mb-4 line-clamp-2">{featuredRecipe.description}</p>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center text-white/80">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">{featuredRecipe.prepTime} min</span>
                      </div>
                      <div className="flex items-center text-white/80">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">{featuredRecipe.servings} servings</span>
                      </div>
                    </div>
                    <Link to={`/recipe/${featuredRecipe.id}`}>
                      <Button variant="default">
                        View Recipe
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </section>
        )}

        {/* Search Section */}
        <section className="max-w-xl mx-auto">
          <div className="relative">
            <SearchBar
              onSearch={setSearchQuery}
              className="w-full"
              placeholder="Search recipes, ingredients, or categories..."
            />
          </div>
        </section>

        {/* Search Results - Show only when searching */}
        {showSearchResults && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchQuery("")}
                className="text-sm"
              >
                Clear Search
              </Button>
            </div>
            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredRecipes.map(recipe => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No recipes found matching "{searchQuery}"</p>
              </div>
            )}
          </section>
        )}

        {/* Latest Recipes - Hide when searching */}
        {!showSearchResults && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Latest Recipes</h2>
              <Link to="/recipes" className="text-sm text-primary flex items-center hover:underline">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </section>
        )}

        {/* Categories Section - Hide when searching */}
        {!showSearchResults && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recipe Categories</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(recipesByCategory).map(([category, recipes]) => (
                <Link to={`/recipes?category=${category}`} key={category}>
                  <Card className="h-32 overflow-hidden group relative transition-all hover:shadow-md">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                    {recipes[0] && (
                      <img
                        src={recipes[0].image}
                        alt={category}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-white text-xl font-semibold">{category}</h3>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Index;
