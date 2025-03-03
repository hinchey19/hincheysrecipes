import React, { useState } from "react";
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
import { ShoppingCart, Calculator } from "lucide-react";
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
  // Initialize with current week and empty meal plans
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [defaultServingSize, setDefaultServingSize] = useState<number>(4);
  const [selectedMeals, setSelectedMeals] = useState<{id: string, name: string, recipeId: string, date: Date}[]>([]);
  const [showCalculateDialog, setShowCalculateDialog] = useState(false);
  const [calculatedIngredients, setCalculatedIngredients] = useState<{name: string, quantity: string, category: string}[]>([]);
  const [ingredientsToAdd, setIngredientsToAdd] = useState<string[]>([]);

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
        // Check if we already have a meal of this type for this date
        const existingMealIndex = newPlans[existingPlanIndex].meals.findIndex(
          meal => meal.type === type
        );

        if (existingMealIndex >= 0) {
          // Update existing meal
          newPlans[existingPlanIndex].meals[existingMealIndex] = {
            id: `${date.toISOString()}-${type}-${recipeId}`,
            name: recipe.title,
            type,
            recipeId
          };
        } else {
          // Add new meal to existing date
          newPlans[existingPlanIndex].meals.push({
            id: `${date.toISOString()}-${type}-${recipeId}`,
            name: recipe.title,
            type,
            recipeId
          });
        }
        
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
            id: `${date.toISOString()}-${type}-${recipeId}`,
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

      return newPlans;
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
    
    selectedMeals.forEach(meal => {
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
          "2 cups sushi rice",
          "3 tbsp rice vinegar",
          "1 lb imitation crab meat",
          "1/2 cup mayonnaise",
          "2 tbsp sriracha",
          "1 avocado",
          "2 sheets nori seaweed"
        ];
      } else if (meal.recipeId === "13") { // Roasted Leg of Lamb
        recipeIngredients = [
          "1 Lamb leg",
          "2 Onion (sliced)",
          "Green onion (chopped)",
          "Ginger (sliced)",
          "Garlic (chopped)",
          "2 TBSP Cooking wine",
          "2 TBSP Light soy sauce"
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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meal Planner</h1>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="defaultServings" className="text-sm whitespace-nowrap">Default Servings:</Label>
              <Input
                id="defaultServings"
                type="number"
                min="1"
                max="20"
                value={defaultServingSize}
                onChange={(e) => setDefaultServingSize(parseInt(e.target.value) || 4)}
                className="w-16 h-8"
              />
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={calculateIngredients}
              disabled={mealPlans.length === 0}
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Ingredients
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Calculated Ingredients</DialogTitle>
              <DialogDescription>
                Based on your selected meals and serving sizes
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {calculatedIngredients.length === 0 ? (
                <p className="text-center text-muted-foreground">No ingredients to calculate</p>
              ) : (
                <>
                  {calculatedIngredients.map((ingredient, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Checkbox 
                        id={`ingredient-${index}`}
                        checked={ingredientsToAdd.includes(`${ingredient.name} - ${ingredient.quantity}`)}
                        onCheckedChange={() => toggleIngredient(`${ingredient.name} - ${ingredient.quantity}`)}
                      />
                      <div>
                        <label 
                          htmlFor={`ingredient-${index}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {ingredient.name}
                        </label>
                        <div className="flex items-center mt-0.5 gap-2">
                          <span className="text-xs text-muted-foreground">{ingredient.quantity}</span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                          <span className="text-xs text-muted-foreground">{ingredient.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowCalculateDialog(false);
                  setSelectedMeals([]);
                  setIngredientsToAdd([]);
                }}
                className="sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={addToShoppingList}
                className="w-full sm:w-auto sm:order-2"
                disabled={ingredientsToAdd.length === 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Shopping List
              </Button>
              <Button
                variant="outline"
                className="w-full sm:w-auto sm:order-3"
                onClick={() => window.open("https://www.instacart.com", "_blank")}
              >
                Order on Instacart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MealPlanner;
