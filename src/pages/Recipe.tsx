
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, Users, ChevronLeft, Printer, Share, Plus, 
  Check, ShoppingCart, Calendar 
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { mockRecipes } from "@/data/mockData";
import { cn } from "@/lib/utils";

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = mockRecipes.find(r => r.id === id);
  
  const [activeTab, setActiveTab] = useState("ingredients");
  const [ingredientsToAdd, setIngredientsToAdd] = useState<string[]>([]);

  // Mock ingredients and instructions for the demo
  const mockIngredients = [
    "2 tablespoons olive oil",
    "1 large onion, diced",
    "2 garlic cloves, minced",
    "1 red bell pepper, diced",
    "1 pound ground beef",
    "1 (15-ounce) can tomato sauce",
    "1 (15-ounce) can diced tomatoes",
    "2 tablespoons chili powder",
    "1 teaspoon cumin",
    "1 teaspoon salt",
    "1/2 teaspoon black pepper",
    "1 (15-ounce) can kidney beans, drained",
  ];

  const mockInstructions = [
    "Heat oil in a large pot over medium heat. Add onion and cook until soft, about 5 minutes.",
    "Add garlic and bell pepper, cook for another 2 minutes.",
    "Add ground beef and cook until browned, breaking it up as it cooks.",
    "Stir in tomato sauce, diced tomatoes, chili powder, cumin, salt, and pepper.",
    "Bring to a simmer, reduce heat to low, and cook for 20 minutes, stirring occasionally.",
    "Add kidney beans and cook for another 10 minutes.",
    "Taste and adjust seasoning if needed. Serve hot with your favorite toppings.",
  ];

  const handleAddToShoppingList = () => {
    if (ingredientsToAdd.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to add to your shopping list.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Added to shopping list",
      description: `${ingredientsToAdd.length} ingredients have been added to your shopping list.`,
    });
  };

  const handleAddToMealPlan = () => {
    toast({
      title: "Added to meal plan",
      description: `${recipe?.title} has been added to your meal plan.`,
    });
  };

  const toggleIngredient = (ingredient: string) => {
    setIngredientsToAdd(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  if (!recipe) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-muted-foreground text-center">Recipe not found.</p>
          <Link to="/recipes">
            <Button variant="outline" className="mt-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/recipes">
            <Button variant="ghost" className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-muted-foreground mb-4">{recipe.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{recipe.prepTime} minutes</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-sm">{recipe.servings} servings</span>
            </div>
            <Badge variant="secondary">{recipe.category}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Shopping List
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Ingredients to Shopping List</DialogTitle>
                </DialogHeader>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {mockIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`ingredient-${index}`}
                        checked={ingredientsToAdd.includes(ingredient)}
                        onCheckedChange={() => toggleIngredient(ingredient)}
                      />
                      <label 
                        htmlFor={`ingredient-${index}`}
                        className="text-sm cursor-pointer"
                      >
                        {ingredient}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setIngredientsToAdd([])}>
                    Clear
                  </Button>
                  <Button onClick={handleAddToShoppingList}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Selected
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={handleAddToMealPlan}>
              <Calendar className="h-4 w-4 mr-2" />
              Add to Meal Plan
            </Button>
          </div>
        </div>
        
        <div className="mb-8 rounded-xl overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-auto object-cover max-h-[400px]" 
          />
        </div>
        
        <Tabs defaultValue="ingredients" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="mt-4 space-y-4">
            <div className="bg-card rounded-lg p-4 border border-border">
              <ul className="space-y-2">
                {mockIngredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
          <TabsContent value="instructions" className="mt-4 space-y-4">
            <div className="bg-card rounded-lg p-4 border border-border">
              <ol className="space-y-4">
                {mockInstructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="flex-1 pt-0.5">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Recipe;
