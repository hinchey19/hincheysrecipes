import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { MealPlannerCalendar } from "@/components/MealPlannerCalendar";
import { mockRecipes } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { ShoppingCart, Calculator, CheckSquare, AlertCircle, Trash2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  recipeId: string | null;
}

interface MealPlan {
  date: Date;
  meals: Meal[];
  servingSize?: number; // Number of people to serve
}

const MealPlanner = () => {
  // Load meal plans from localStorage if available
  const loadMealPlansFromStorage = () => {
    try {
      const storedMealPlans = localStorage.getItem('mealPlans');
      if (storedMealPlans) {
        // Parse the stored meal plans and convert date strings back to Date objects
        const parsedMealPlans = JSON.parse(storedMealPlans);
        return parsedMealPlans.map((plan: any) => ({
          ...plan,
          date: new Date(plan.date)
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading meal plans from localStorage:', error);
      return [];
    }
  };

  // Initialize with current week and empty meal plans or load from localStorage
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(loadMealPlansFromStorage());
  const [defaultServingSize, setDefaultServingSize] = useState<number>(4);
  const [selectedMeals, setSelectedMeals] = useState<{id: string, name: string, recipeId: string, date: Date}[]>([]);
  const [showCalculateDialog, setShowCalculateDialog] = useState(false);
  const [calculatedIngredients, setCalculatedIngredients] = useState<{name: string, quantity: string, category: string}[]>([]);
  const [ingredientsToAdd, setIngredientsToAdd] = useState<string[]>([]);

  // Add state for shopping list
  const [shoppingList, setShoppingList] = useState<any[]>(() => {
    try {
      const savedList = localStorage.getItem('shoppingList');
      return savedList ? JSON.parse(savedList) : [];
    } catch (error) {
      console.error('Error loading shopping list:', error);
      return [];
    }
  });

  // Update shopping list when it changes in localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedList = localStorage.getItem('shoppingList');
        if (savedList) {
          setShoppingList(JSON.parse(savedList));
        }
      } catch (error) {
        console.error('Error loading shopping list:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save meal plans to localStorage whenever they change
  const saveMealPlansToStorage = (updatedMealPlans: MealPlan[]) => {
    try {
      localStorage.setItem('mealPlans', JSON.stringify(updatedMealPlans));
    } catch (error) {
      console.error('Error saving meal plans to localStorage:', error);
    }
  };

  const addMealToDate = (date: Date, type: "breakfast" | "lunch" | "dinner", recipeId: string) => {
    const recipe = mockRecipes.find(r => r.id === recipeId);
    if (!recipe) return;

    setMealPlans(prevPlans => {
      // Create a new array to avoid mutating the original
      const newPlans = [...prevPlans];
      
      // Find if we already have a meal plan for this date
      const existingPlanIndex = newPlans.findIndex(
        plan => plan.date.toDateString() === date.toDateString()
      );

      if (existingPlanIndex >= 0) {
        // Check if this recipe already exists for this meal type on this date
        const recipeAlreadyExists = newPlans[existingPlanIndex].meals.some(
          meal => meal.type === type && meal.recipeId === recipeId
        );

        // If recipe already exists for this meal type, don't add it again
        if (recipeAlreadyExists) {
          toast({
            title: "Recipe already added",
            description: `${recipe.title} is already added to ${type} on ${date.toLocaleDateString()}`,
          });
          return newPlans;
        }

        // Generate a unique ID for the new meal
        const mealId = `${date.toISOString()}-${type}-${recipeId}-${Date.now()}`;
        
        // Add new meal to existing date
        newPlans[existingPlanIndex].meals.push({
          id: mealId,
          name: recipe.title,
          type,
          recipeId
        });
        
        // Set default serving size if not already set
        if (!newPlans[existingPlanIndex].servingSize) {
          newPlans[existingPlanIndex].servingSize = defaultServingSize;
        }
      } else {
        // Create new meal plan for this date
        newPlans.push({
          date: new Date(date),
          servingSize: defaultServingSize,
          meals: [{
            id: `${date.toISOString()}-${type}-${recipeId}-${Date.now()}`,
            name: recipe.title,
            type,
            recipeId
          }]
        });
      }

      toast({
        title: "Meal added",
        description: `${recipe.title} added to ${type} on ${date.toLocaleDateString()}`,
      });

      // Save to localStorage
      saveMealPlansToStorage(newPlans);
      return newPlans;
    });
  };

  const removeMealFromDate = (date: Date, mealId: string) => {
    setMealPlans(prevPlans => {
      const newPlans = [...prevPlans];
      
      const planIndex = newPlans.findIndex(
        plan => plan.date.toDateString() === date.toDateString()
      );

      if (planIndex >= 0) {
        // Remove the meal
        newPlans[planIndex].meals = newPlans[planIndex].meals.filter(
          meal => meal.id !== mealId
        );

        // If no meals left for this date, remove the entire plan
        if (newPlans[planIndex].meals.length === 0) {
          newPlans.splice(planIndex, 1);
        }

        toast({
          title: "Meal removed",
          description: `Meal removed from ${date.toLocaleDateString()}`,
        });
      }

      // Save to localStorage
      saveMealPlansToStorage(newPlans);
      return newPlans;
    });
  };

  // Add a function to clear all meals from the planner
  const clearAllMeals = () => {
    if (mealPlans.length === 0) {
      toast({
        title: "No meals to clear",
        description: "Your meal planner is already empty.",
      });
      return;
    }

    setMealPlans([]);
    setSelectedMeals([]);
    saveMealPlansToStorage([]);
    
    toast({
      title: "All meals cleared",
      description: "All meals have been removed from your meal planner.",
    });
  };

  const updateServingSize = (date: Date, servingSize: number) => {
    setMealPlans(prevPlans => {
      const newPlans = [...prevPlans];
      
      const planIndex = newPlans.findIndex(
        plan => plan.date.toDateString() === date.toDateString()
      );

      if (planIndex >= 0) {
        newPlans[planIndex].servingSize = servingSize;
      }

      // Save to localStorage
      saveMealPlansToStorage(newPlans);
      return newPlans;
    });
  };

  const handleSelectMealForCalculation = (meal: {id: string, name: string, recipeId: string, date: Date}, isSelected: boolean) => {
    if (isSelected) {
      setSelectedMeals(prev => [...prev, meal]);
    } else {
      setSelectedMeals(prev => prev.filter(m => m.id !== meal.id));
    }
  };

  const calculateIngredients = () => {
    // This is a simplified calculation - in a real app, you would parse ingredients more precisely
    const ingredients: {name: string, quantity: string, category: string}[] = [];
    
    // Get today's date at the start of the day for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // If no meals are selected, use all meals from the meal plans (only from today and future)
    const mealsToCalculate = selectedMeals.length > 0 ? selectedMeals : 
      mealPlans
        .filter(plan => {
          // Convert plan date to start of day for accurate comparison
          const planDate = new Date(plan.date);
          planDate.setHours(0, 0, 0, 0);
          return planDate >= today; // Only include today and future dates
        })
        .flatMap(plan => 
          plan.meals.map(meal => ({
            id: meal.id,
            name: meal.name,
            recipeId: meal.recipeId || "",
            date: plan.date
          }))
        ).filter(meal => meal.recipeId);
    
    // If selected meals are provided, filter them to only include today and future
    if (selectedMeals.length > 0) {
      const filteredSelectedMeals = selectedMeals.filter(meal => {
        const mealDate = new Date(meal.date);
        mealDate.setHours(0, 0, 0, 0);
        return mealDate >= today;
      });
      
      if (filteredSelectedMeals.length < selectedMeals.length) {
        toast({
          title: "Some meals excluded",
          description: "Only meals from today and future dates are included in the calculation.",
        });
      }
    }
    
    mealsToCalculate.forEach(meal => {
      const recipe = mockRecipes.find(r => r.id === meal.recipeId);
      if (!recipe) return;
      
      // Find the meal plan to get the serving size
      const mealPlan = mealPlans.find(plan => plan.date.toDateString() === meal.date.toDateString());
      if (!mealPlan) return;
      
      const servingSize = mealPlan.servingSize || defaultServingSize;
      const servingRatio = servingSize / recipe.servings;
      
      // Get recipe ingredients - this is simplified
      let recipeIngredients: string[] = [];
      
      // For demo purposes, we'll use some mock ingredients
      if (meal.recipeId === "0") { // Sushi Bake
        recipeIngredients = [
          "1/2 lb salmon, seasoned to preference",
          "1/2 lb imitation crab, shredded & cut into smaller pieces",
          "3 oz cream cheese",
          "1/4 cup Japanese mayo",
          "1 TBSP sriracha",
          "2-3 cups cooked rice",
          "2 TBSP rice vinegar",
          "Furikake / shredded seaweed",
          "1 avocado, sliced for topping"
        ];
      } else if (meal.recipeId === "1") { // Pad Thai
        recipeIngredients = [
          "8 oz rice noodles",
          "2 tbsp vegetable oil",
          "2 eggs, beaten",
          "1 lb shrimp or chicken, cut into small pieces",
          "2 cloves garlic, minced",
          "1 cup bean sprouts",
          "3 tbsp fish sauce",
          "2 tbsp sugar",
          "1 lime, cut into wedges",
          "1/4 cup peanuts, crushed",
          "2 green onions, chopped"
        ];
      } else if (meal.recipeId === "13") { // Roasted Leg of Lamb
        recipeIngredients = [
          "1 Lamb leg (about 4-5 lbs)",
          "2 Onions, sliced",
          "4 Green onions, chopped",
          "2-inch piece Ginger, sliced",
          "4 cloves Garlic, chopped",
          "2 TBSP Cooking wine",
          "2 TBSP Light soy sauce",
          "1 TBSP Five spice powder",
          "1 tsp Salt",
          "1/2 tsp Black pepper"
        ];
      } else {
        recipeIngredients = [
          "2 tablespoons olive oil",
          "1 large onion, diced",
          "2 garlic cloves, minced",
          "1 red bell pepper, diced"
        ];
      }
      
      // Process each ingredient
      recipeIngredients.forEach(ingredient => {
        // Very basic parsing - in a real app, you'd use a more sophisticated parser
        const match = ingredient.match(/^(\d+(?:\.\d+)?)\s+(\w+)\s+(.+)$/);
        
        if (match) {
          const [_, quantity, unit, name] = match;
          const adjustedQuantity = parseFloat(quantity) * servingRatio;
          
          // Check if ingredient already exists
          const existingIndex = ingredients.findIndex(i => i.name.toLowerCase().includes(name.toLowerCase()));
          
          if (existingIndex >= 0) {
            // Add quantities - this is simplified
            ingredients[existingIndex].quantity = `${adjustedQuantity} ${unit}`;
          } else {
            ingredients.push({
              name,
              quantity: `${adjustedQuantity} ${unit}`,
              category: getCategoryForIngredient(name)
            });
          }
        } else {
          // For ingredients without quantities
          ingredients.push({
            name: ingredient,
            quantity: "As needed",
            category: getCategoryForIngredient(ingredient)
          });
        }
      });
    });
    
    setCalculatedIngredients(ingredients);
    setShowCalculateDialog(true);
  };
  
  const getCategoryForIngredient = (name: string): string => {
    // Simple categorization logic - in a real app, you'd have a more comprehensive system
    name = name.toLowerCase();
    
    if (name.includes("oil") || name.includes("sauce") || name.includes("vinegar")) {
      return "Oils & Condiments";
    } else if (name.includes("onion") || name.includes("pepper") || name.includes("vegetable") || name.includes("avocado")) {
      return "Vegetables";
    } else if (name.includes("meat") || name.includes("beef") || name.includes("chicken") || name.includes("lamb")) {
      return "Meat";
    } else if (name.includes("rice") || name.includes("pasta") || name.includes("noodle")) {
      return "Grains";
    } else if (name.includes("garlic") || name.includes("ginger") || name.includes("spice")) {
      return "Spices";
    } else {
      return "Other";
    }
  };
  
  const addToShoppingList = () => {
    if (ingredientsToAdd.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to add to your shopping list.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, you would add these to your shopping list state or database
    // For this demo, we'll use localStorage to persist the shopping list
    const existingItems = localStorage.getItem('shoppingList') ? 
      JSON.parse(localStorage.getItem('shoppingList') || '[]') : [];
    
    const newItems = ingredientsToAdd.map(item => {
      const [name, quantity] = item.split(' - ');
      return {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: name,
        quantity: quantity || 'As needed',
        checked: false,
        category: getCategoryForIngredient(name)
      };
    });
    
    localStorage.setItem('shoppingList', JSON.stringify([...existingItems, ...newItems]));
    
    toast({
      title: "Added to shopping list",
      description: `${ingredientsToAdd.length} ingredients have been added to your shopping list.`,
    });
    
    setShowCalculateDialog(false);
    setSelectedMeals([]);
    setIngredientsToAdd([]);
  };
  
  const toggleIngredient = (ingredient: string) => {
    setIngredientsToAdd(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  // Check if an ingredient is already in the shopping list
  const isIngredientInShoppingList = (name: string): boolean => {
    return shoppingList.some(item => 
      item.name.toLowerCase() === name.toLowerCase()
    );
  };

  // Select all ingredients that aren't already in the shopping list
  const handleSelectAllIngredients = () => {
    const newIngredientsToAdd = calculatedIngredients
      .filter(ingredient => !isIngredientInShoppingList(ingredient.name))
      .map(ingredient => `${ingredient.name} - ${ingredient.quantity}`);
    
    setIngredientsToAdd(newIngredientsToAdd);
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="text-2xl font-bold">Meal Planner</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Label htmlFor="defaultServings" className="text-xs sm:text-sm whitespace-nowrap">Default Servings:</Label>
              <Input
                id="defaultServings"
                type="number"
                min="1"
                max="20"
                value={defaultServingSize}
                onChange={(e) => setDefaultServingSize(parseInt(e.target.value) || 4)}
                className="w-12 h-8"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={calculateIngredients}
              disabled={mealPlans.length === 0}
              className="text-xs h-8 px-2 whitespace-nowrap"
            >
              <Calculator className="h-3.5 w-3.5 mr-1" />
              Calculate Ingredients
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearAllMeals}
              disabled={mealPlans.length === 0}
              className="text-xs h-8 px-2 whitespace-nowrap text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        <MealPlannerCalendar
          recipes={mockRecipes}
          mealPlans={mealPlans}
          onAddMeal={addMealToDate}
          onRemoveMeal={removeMealFromDate}
          onUpdateServingSize={updateServingSize}
          onSelectMealForCalculation={handleSelectMealForCalculation}
          selectedMeals={selectedMeals}
        />
        
        {/* Meal Selection Summary */}
        {selectedMeals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Selected Meals</CardTitle>
              <CardDescription>
                You've selected {selectedMeals.length} meals for ingredient calculation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedMeals.map(meal => (
                  <li key={meal.id} className="flex justify-between items-center">
                    <span>{meal.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(meal.date).toLocaleDateString()} 
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={calculateIngredients} className="w-full">
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Ingredients
              </Button>
            </CardFooter>
          </Card>
        )}
        
        {/* Ingredient Calculation Dialog */}
        <Dialog open={showCalculateDialog} onOpenChange={setShowCalculateDialog}>
          <DialogContent className="max-w-md w-[95vw] p-4 sm:p-6">
            <DialogHeader className="pb-2">
              <DialogTitle className="text-lg">Calculated Ingredients</DialogTitle>
              <DialogDescription className="text-xs sm:text-sm">
                Based on your selected meals and serving sizes
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex justify-end mb-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAllIngredients}
                className="text-xs h-7 px-2"
              >
                <CheckSquare className="h-3 w-3 mr-1" />
                Select All
              </Button>
            </div>
            
            <div className="space-y-3 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-2">
              {calculatedIngredients.length === 0 ? (
                <p className="text-center text-muted-foreground">No ingredients to calculate</p>
              ) : (
                calculatedIngredients.map((ingredient, index) => {
                  const ingredientKey = `${ingredient.name} - ${ingredient.quantity}`;
                  const alreadyInList = isIngredientInShoppingList(ingredient.name);
                  
                  return (
                    <div key={index} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`ingredient-${index}`}
                        checked={ingredientsToAdd.includes(ingredientKey)}
                        onCheckedChange={() => toggleIngredient(ingredientKey)}
                        disabled={alreadyInList}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <label 
                          htmlFor={`ingredient-${index}`}
                          className={cn(
                            "text-xs sm:text-sm font-medium cursor-pointer flex items-center flex-wrap"
                          )}
                        >
                          {ingredient.name}
                          {alreadyInList && (
                            <span className="ml-1 inline-flex items-center text-[10px] sm:text-xs text-amber-500">
                              <AlertCircle className="h-2.5 w-2.5 mr-0.5" />
                              Already in list
                            </span>
                          )}
                        </label>
                        <div className="flex items-center mt-0.5 gap-1">
                          <span className="text-[10px] sm:text-xs text-muted-foreground">{ingredient.quantity}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                          <span className="text-[10px] sm:text-xs text-muted-foreground">{ingredient.category}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="flex flex-col gap-2 pt-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={addToShoppingList}
                  className="text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                  disabled={ingredientsToAdd.length === 0}
                >
                  <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="whitespace-nowrap">Add to Shopping List</span>
                </Button>
                <Button
                  variant="outline"
                  className="text-xs sm:text-sm h-8 sm:h-10 px-2 sm:px-4"
                  onClick={() => window.open("https://www.instacart.com", "_blank")}
                >
                  <span className="whitespace-nowrap">Order on Instacart</span>
                </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCalculateDialog(false);
                  setSelectedMeals([]);
                  setIngredientsToAdd([]);
                }}
                className="w-full text-xs sm:text-sm h-8 sm:h-10"
              >
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MealPlanner;
