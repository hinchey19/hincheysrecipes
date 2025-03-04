import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, Users, ChevronLeft, Printer, Share, Plus, 
  Check, ShoppingCart, Calendar, Trash2, CheckSquare, AlertCircle
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { mockRecipes } from "@/data/mockData";
import { sushiBakeIngredients, sushiBakeInstructions } from "@/data/sushiBakeRecipe";
import { roastedLambIngredients, roastedLambInstructions } from "@/data/roastedLambRecipe";
import { cn } from "@/lib/utils";

// Type for shopping list items
interface ShoppingListItem {
  ingredient: string;
  recipeId: string;
  recipeName: string;
}

const Recipe = () => {
  const { id } = useParams<{ id: string }>();
  const recipe = mockRecipes.find(r => r.id === id);
  
  const [activeTab, setActiveTab] = useState("ingredients");
  const [ingredientsToAdd, setIngredientsToAdd] = useState<string[]>([]);
  
  // Get shopping list from localStorage or initialize empty array
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    const savedList = localStorage.getItem('shoppingList');
    return savedList ? JSON.parse(savedList) : [];
  });

  // Save shopping list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Default recipe data
  let ingredients = [
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

  let instructions = [
    "Heat oil in a large pot over medium heat. Add onion and cook until soft, about 5 minutes.",
    "Add garlic and bell pepper, cook for another 2 minutes.",
    "Add ground beef and cook until browned, breaking it up as it cooks.",
    "Stir in tomato sauce, diced tomatoes, chili powder, cumin, salt, and pepper.",
    "Bring to a simmer, reduce heat to low, and cook for 20 minutes, stirring occasionally.",
    "Add kidney beans and cook for another 10 minutes.",
    "Taste and adjust seasoning if needed. Serve hot with your favorite toppings.",
  ];

  // Set recipe-specific data
  if (recipe?.ingredients && recipe?.instructions) {
    // Use ingredients and instructions directly from the recipe object if they exist
    ingredients = recipe.ingredients;
    instructions = recipe.instructions;
  } else if (id === "0") {
    ingredients = sushiBakeIngredients;
    instructions = sushiBakeInstructions;
  } else if (id === "13") {
    ingredients = roastedLambIngredients;
    instructions = roastedLambInstructions;
  }

  // Check if an ingredient is already in the shopping list
  const isIngredientInShoppingList = (ingredient: string) => {
    return shoppingList.some(item => 
      item.ingredient === ingredient && item.recipeId === recipe?.id
    );
  };

  const handleSelectAllIngredients = () => {
    // Filter out ingredients that are already in the shopping list
    const newIngredientsToAdd = ingredients.filter(ingredient => 
      !isIngredientInShoppingList(ingredient)
    );
    
    setIngredientsToAdd(newIngredientsToAdd);
  };

  const handleAddToShoppingList = () => {
    if (ingredientsToAdd.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to add to your shopping list.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for duplicates
    const duplicates: string[] = [];
    const newItems: ShoppingListItem[] = [];
    
    ingredientsToAdd.forEach(ingredient => {
      const isDuplicate = shoppingList.some(
        item => item.ingredient === ingredient && item.recipeId === recipe?.id
      );
      
      if (isDuplicate) {
        duplicates.push(ingredient);
      } else {
        newItems.push({
          ingredient,
          recipeId: recipe?.id || '',
          recipeName: recipe?.title || ''
        });
      }
    });
    
    // Add non-duplicate items
    if (newItems.length > 0) {
      setShoppingList(prev => [...prev, ...newItems]);
      
      toast({
        title: "Added to shopping list",
        description: `${newItems.length} ingredients have been added to your shopping list.`,
      });
    }
    
    // Notify about duplicates if any
    if (duplicates.length > 0) {
      toast({
        title: "Duplicate ingredients",
        description: `${duplicates.length} ingredients were already in your shopping list from this recipe.`,
        variant: "default",
      });
    }
    
    // Clear selection
    setIngredientsToAdd([]);
  };

  const handleClearShoppingList = () => {
    setShoppingList([]);
    toast({
      title: "Shopping list cleared",
      description: "All items have been removed from your shopping list.",
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
                <div className="flex justify-end mb-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSelectAllIngredients}
                    className="text-xs"
                  >
                    <CheckSquare className="h-3.5 w-3.5 mr-1" />
                    Select All New
                  </Button>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {ingredients.map((ingredient, index) => {
                    const alreadyInList = isIngredientInShoppingList(ingredient);
                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`ingredient-${index}`}
                          checked={ingredientsToAdd.includes(ingredient)}
                          onCheckedChange={() => toggleIngredient(ingredient)}
                          disabled={alreadyInList}
                        />
                        <label 
                          htmlFor={`ingredient-${index}`}
                          className={cn(
                            "text-sm cursor-pointer flex items-center",
                            alreadyInList && "text-muted-foreground line-through"
                          )}
                        >
                          {ingredient}
                          {alreadyInList && (
                            <span className="ml-2 inline-flex items-center text-xs text-amber-500">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Already in list
                            </span>
                          )}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <DialogFooter className="flex justify-between items-center mt-4">
                  <Button 
                    variant="outline" 
                    onClick={handleClearShoppingList}
                    className="flex items-center gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear All
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIngredientsToAdd([])}>
                      Clear Selection
                    </Button>
                    <Button onClick={handleAddToShoppingList}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Selected
                    </Button>
                  </div>
                </DialogFooter>
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
                {ingredients.map((ingredient, index) => (
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
                {instructions.map((instruction, index) => (
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
