
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { SearchBar } from "@/components/SearchBar";
import { CategoryFilter } from "@/components/CategoryFilter";
import { RecipeGrid } from "@/components/RecipeGrid";
import { RecipeProps } from "@/components/RecipeCard";
import { mockRecipes } from "@/data/mockData";

const Recipes = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extract categories from recipes
  const categories = Array.from(new Set(mockRecipes.map(recipe => recipe.category)));
  
  // Get category from URL params if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryParam = params.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Filter recipes based on search query and selected category
  const filteredRecipes = mockRecipes.filter(recipe => {
    const matchesSearch = 
      searchQuery === "" || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === null || 
      recipe.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Recipes</h1>
          <div className="w-full max-w-sm">
            <SearchBar onSearch={setSearchQuery} placeholder="Search recipes..." />
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 space-y-6">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
          
          <div className="flex-1">
            <RecipeGrid recipes={filteredRecipes} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Recipes;
