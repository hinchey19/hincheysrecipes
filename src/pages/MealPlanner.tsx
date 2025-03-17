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
import { ShoppingCart, Calculator, CheckSquare, AlertCircle, Trash2, Users } from "lucide-react";
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
import { sushiBakeIngredients } from "@/data/sushiBakeRecipe";
import { roastedLambIngredients } from "@/data/roastedLambRecipe";
import { padThaiIngredients } from "@/data/padThaiRecipe";
import { chickenTeriyakiIngredients } from "@/data/chickenTeriyakiRecipe";
import { bibimbapIngredients } from "@/data/bibimbapRecipe";
import { mangoStickyRiceIngredients } from "@/data/mangoStickyRiceRecipe";
import { vegetableSpringRollsIngredients, vegetableSpringRollsSauceIngredients } from "@/data/vegetableSpringRollsRecipe";
import { shrimpFriedRiceIngredients } from "@/data/shrimpFriedRiceRecipe";
import { matchaLatteIngredients } from "@/data/matchaLatteRecipe";
import { spicyTunaRollsIngredients } from "@/data/spicyTunaRollsRecipe";
import { greenPapayaSaladIngredients } from "@/data/greenPapayaSaladRecipe";

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

// Type for shopping list items
interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  recipeId?: string;
  recipeName?: string;
  ingredient?: string; // For items added from Recipe page
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

  // Helper function to parse ingredients in string format (like "1/2 lb salmon, seasoned to preference")
  const parseStringIngredient = (ingredient: string) => {
    // Regular expressions to match different formats
    // Format: "1/2 lb salmon, seasoned to preference" or "3 oz cream cheese"
    const basicMatch = /^([\d./]+)\s+(\w+)\s+(.+?)(\s+\(.*\))?$/;
    
    // Format: "1 TBSP sriracha" or "2-3 cups cooked rice"
    const tbspOrCupsMatch = /^([\d./-]+)\s+(TBSP|tbsp|cups|cup)\s+(.+?)(\s+\(.*\))?$/i;
    
    let quantity = "";
    let unit = "";
    let name = "";
    let notes = "";
    
    const basicResult = ingredient.match(basicMatch);
    const tbspResult = ingredient.match(tbspOrCupsMatch);
    
    if (tbspResult) {
      quantity = tbspResult[1];
      unit = tbspResult[2];
      name = tbspResult[3];
      notes = tbspResult[4] || "";
    } else if (basicResult) {
      quantity = basicResult[1];
      unit = basicResult[2];
      name = basicResult[3];
      notes = basicResult[4] || "";
    } else {
      // If no match, just use the whole string as the name
      name = ingredient;
      quantity = "1";
    }
    
    return { quantity, unit, name, notes };
  };

  // Initialize with current week and empty meal plans or load from localStorage
  const [mealPlans, setMealPlans] = useState<MealPlan[]>(loadMealPlansFromStorage());
  const [defaultServingSize, setDefaultServingSize] = useState<number>(4);
  
  // Update all meal plans when default serving size changes
  useEffect(() => {
    if (mealPlans.length > 0) {
      const updatedPlans = mealPlans.map(plan => ({
        ...plan,
        servingSize: defaultServingSize
      }));
      
      // Save to localStorage
      saveMealPlansToStorage(updatedPlans);
      setMealPlans(updatedPlans);
    }
  }, [defaultServingSize]);
  
  const [selectedMeals, setSelectedMeals] = useState<{id: string, name: string, recipeId: string, date: Date}[]>([]);
  const [showCalculateDialog, setShowCalculateDialog] = useState(false);
  const [calculatedIngredients, setCalculatedIngredients] = useState<{
    name: string;
    quantity: string;
    unit?: string;
    notes?: string;
    category: string;
    recipeId: string;
    recipeName: string;
  }[]>([]);
  const [ingredientsToAdd, setIngredientsToAdd] = useState<string[]>([]);

  // Add state for shopping list
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
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
    const ingredients: {
      name: string;
      quantity: string;
      unit?: string;
      notes?: string;
      category: string;
      recipeId: string;
      recipeName: string;
    }[] = [];
    
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
      
      // Get recipe ingredients based on recipe ID
      let recipeIngredients: string[] = [];
      
      // Import ingredients from the appropriate recipe file based on recipe ID
      if (meal.recipeId === "0") { // Sushi Bake
        recipeIngredients = sushiBakeIngredients;
        
        // Process Sushi Bake ingredients that are in string format
        sushiBakeIngredients.forEach(ingredient => {
          // Parse the ingredient string
          const { quantity, unit, name, notes } = parseStringIngredient(ingredient);
          
          // Calculate adjusted quantity based on serving size
          const totalAmount = parseFloat(quantity) * servingRatio;
          
          // Add to ingredients list
          ingredients.push({
            name: name,
            quantity: totalAmount.toString(),
            unit: unit,
            notes: notes,
            category: "ingredient",
            recipeId: meal.recipeId,
            recipeName: recipe.title
          });
        });
        
        // Skip the rest of the processing for Sushi Bake
        return;
      } else if (meal.recipeId === "1") { // Pad Thai
        recipeIngredients = padThaiIngredients;
      } else if (meal.recipeId === "4") { // Korean Bibimbap
        recipeIngredients = bibimbapIngredients;
      } else if (meal.recipeId === "5") { // Mango Sticky Rice
        recipeIngredients = mangoStickyRiceIngredients;
      } else if (meal.recipeId === "6") { // Vegetable Spring Rolls
        // Combine both regular ingredients and sauce ingredients
        recipeIngredients = [
          ...vegetableSpringRollsIngredients.map(item => 
            `${item.amount} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
          ),
          "For the Peanut Sauce:",
          ...vegetableSpringRollsSauceIngredients.map(item => 
            `${item.amount} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
          )
        ];
      } else if (meal.recipeId === "9") { // Shrimp Fried Rice
        recipeIngredients = shrimpFriedRiceIngredients.map(item => 
          `${item.amount} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
        );
      } else if (meal.recipeId === "10") { // Matcha Latte
        recipeIngredients = matchaLatteIngredients.map(item => 
          `${item.amount} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
        );
      } else if (meal.recipeId === "11") { // Spicy Tuna Rolls
        recipeIngredients = spicyTunaRollsIngredients.map(item => 
          `${item.amount} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
        );
      } else if (meal.recipeId === "12") { // Green Papaya Salad (was incorrectly using ID "7")
        recipeIngredients = greenPapayaSaladIngredients.map(item => 
          `${item.amount} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
        );
      } else if (meal.recipeId === "13") { // Roasted Leg of Lamb
        recipeIngredients = roastedLambIngredients;
      } else if (meal.recipeId === "14") { // Korean Braised Beef Short Ribs
        // Use the ingredients from mockRecipes
        recipeIngredients = recipe.ingredients || [];
      } else if (meal.recipeId === "15") { // Chinese Tomato Egg Stir-fry
        // Use the ingredients from mockRecipes
        recipeIngredients = recipe.ingredients || [];
      } else if (meal.recipeId === "17") { // Basque Cheesecake
        // Use the ingredients from mockRecipes
        recipeIngredients = recipe.ingredients || [];
      } else if (meal.recipeId === "18") { // Chicken Teriyaki
        // Use the chickenTeriyakiIngredients which is already in the correct format
        recipeIngredients = chickenTeriyakiIngredients;
      } else if (recipe.ingredients) {
        // Fallback to use ingredients from mockRecipes if available
        recipeIngredients = recipe.ingredients;
      }
      
      // Calculate the total quantity of each ingredient
      recipeIngredients.forEach(ingredient => {
        // Skip section headers like "For the Peanut Sauce:"
        if (ingredient.startsWith("For the") || !ingredient.trim()) {
          return;
        }
        
        try {
          // More robust parsing of ingredients
          const match = ingredient.match(/^([\d./]+)\s+(\w+)?\s+(.+?)(\s+\(.*\))?$/);
          
          if (match) {
            const [_, amount, unit, name, notes] = match;
            const totalAmount = parseFloat(amount) * servingRatio;
            
            // Format the ingredient similar to the recipe page
            const formattedAmount = totalAmount.toString();
            const formattedUnit = unit || '';
            const formattedName = name.trim();
            const formattedNotes = notes || '';
            
            ingredients.push({
              name: formattedName,
              quantity: formattedAmount,
              unit: formattedUnit,
              notes: formattedNotes,
              category: "ingredient",
              recipeId: meal.recipeId,
              recipeName: recipe.title
            });
          } else {
            // Fallback for ingredients that don't match the expected format
            console.warn(`Could not parse ingredient: ${ingredient}`);
            ingredients.push({
              name: ingredient,
              quantity: "1",
              unit: "",
              notes: "",
              category: "ingredient",
              recipeId: meal.recipeId,
              recipeName: recipe.title
            });
          }
        } catch (error) {
          console.error(`Error parsing ingredient: ${ingredient}`, error);
          // Add a fallback ingredient
        ingredients.push({
            name: ingredient,
            quantity: "1",
            unit: "",
            notes: "",
            category: "ingredient",
            recipeId: meal.recipeId,
            recipeName: recipe.title
          });
        }
      });
    });
    
    setCalculatedIngredients(ingredients);
    setShowCalculateDialog(true);
  };

  return (
    <Layout>
      <div className="w-full max-w-full px-2 md:px-4 lg:pl-8 lg:pr-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold tracking-tight">Meal Planner</h1>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-1 mr-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-1">Servings:</span>
                <Input
                  type="number"
                  min="1"
                  max="99"
                  value={defaultServingSize}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value > 0) {
                      setDefaultServingSize(value);
                    }
                  }}
                  className="h-7 w-14 text-xs px-2"
                  title="Serving Size for All Meals"
                />
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={calculateIngredients}
              className="flex items-center gap-1"
            >
              <Calculator className="h-4 w-4" />
              <span>Calculate Ingredients</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllMeals}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
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

        {/* Calculate Ingredients Dialog */}
        <Dialog open={showCalculateDialog} onOpenChange={setShowCalculateDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Calculated Ingredients</DialogTitle>
              <DialogDescription>
                Based on your selected meals and serving sizes
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[300px] overflow-y-auto">
              {calculatedIngredients.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex justify-end mb-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        // Select all ingredients that aren't already in the shopping list
                        const allIndices = calculatedIngredients
                          .map((_, index) => index.toString())
                          .filter(index => {
                            const ingredient = calculatedIngredients[parseInt(index)];
                            return !shoppingList.some(item => {
                              // Check against items added from MealPlanner (using name)
                              if (item.name === ingredient.name && 
                                  item.recipeId === ingredient.recipeId) {
                                return true;
                              }
                              
                              // Check against items added from Recipe page (using ingredient)
                              if (item.ingredient) {
                                const parsedIngredient = parseStringIngredient(item.ingredient);
                                if (parsedIngredient.name === ingredient.name && 
                                    item.recipeId === ingredient.recipeId) {
                                  return true;
                                }
                              }
                              
                              return false;
                            });
                          });
                        setIngredientsToAdd(allIndices);
                      }}
                      className="text-xs"
                    >
                      Select All
                    </Button>
                  </div>
                  {calculatedIngredients.map((ingredient, index) => {
                    // Check if this ingredient is already in the shopping list
                    const isAlreadyInShoppingList = shoppingList.some(item => {
                      // Check against items added from MealPlanner (using name)
                      if (item.name === ingredient.name && 
                          item.recipeId === ingredient.recipeId) {
                        return true;
                      }
                      
                      // Check against items added from Recipe page (using ingredient)
                      if (item.ingredient) {
                        const parsedIngredient = parseStringIngredient(item.ingredient);
                        if (parsedIngredient.name === ingredient.name && 
                            item.recipeId === ingredient.recipeId) {
                          return true;
                        }
                      }
                      
                      return false;
                    });
                    
                    return (
                      <div key={index} className="flex items-start gap-2">
                        <div className="pt-1">
                          <Checkbox 
                            id={`ingredient-${index}`}
                            checked={ingredientsToAdd.includes(index.toString()) || isAlreadyInShoppingList}
                            disabled={isAlreadyInShoppingList}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setIngredientsToAdd(prev => [...prev, index.toString()]);
                              } else {
                                setIngredientsToAdd(prev => prev.filter(item => item !== index.toString()));
                              }
                            }}
                          />
                        </div>
                        <div className="flex flex-col">
                          <Label 
                            htmlFor={`ingredient-${index}`}
                            className="text-sm cursor-pointer"
                          >
                            {ingredient.quantity} {ingredient.unit} {ingredient.name}{ingredient.notes}
                          </Label>
                          {isAlreadyInShoppingList && (
                            <span className="text-xs text-muted-foreground">Already in shopping list</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <AlertCircle className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    No ingredients to calculate. Please select meals first.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowCalculateDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  // Add selected ingredients to shopping list
                  if (ingredientsToAdd.length > 0) {
                    const newShoppingList = [...shoppingList];
                    const duplicates: string[] = [];
                    const newItems: ShoppingListItem[] = [];
                    
                    ingredientsToAdd.forEach(ingredientIndex => {
                      // Get the ingredient by index
                      const calculatedIngredient = calculatedIngredients[parseInt(ingredientIndex)];
                      
                      if (calculatedIngredient) {
                        // Format the ingredient string like in the recipe page
                        const ingredientStr = `${calculatedIngredient.quantity} ${calculatedIngredient.unit || ''} ${calculatedIngredient.name}${calculatedIngredient.notes || ''}`.trim();
                        
                        // Check if this ingredient is already in the shopping list
                        const isDuplicate = shoppingList.some(item => {
                          // Check against items added from MealPlanner (using name)
                          if (item.name === calculatedIngredient.name && 
                              item.recipeId === calculatedIngredient.recipeId) {
                            return true;
                          }
                          
                          // Check against items added from Recipe page (using ingredient)
                          if (item.ingredient) {
                            // Use the same parsing function we defined earlier
                            const parsedIngredient = parseStringIngredient(item.ingredient);
                            if (parsedIngredient.name === calculatedIngredient.name && 
                                item.recipeId === calculatedIngredient.recipeId) {
                              return true;
                            }
                          }
                          
                          return false;
                        });
                        
                        if (isDuplicate) {
                          duplicates.push(ingredientStr);
                        } else {
                          newItems.push({
                            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                            name: calculatedIngredient.name,
                            quantity: calculatedIngredient.quantity,
                            category: calculatedIngredient.category || 'Other',
                            checked: false,
                            recipeId: calculatedIngredient.recipeId,
                            recipeName: calculatedIngredient.recipeName
                          });
                        }
                      }
                    });
                    
                    // Add non-duplicate items
                    if (newItems.length > 0) {
                      setShoppingList(prev => [...prev, ...newItems]);
                      
                      // Save to localStorage
                      localStorage.setItem('shoppingList', JSON.stringify([...shoppingList, ...newItems]));
                      
                      toast({
                        title: "Added to Shopping List",
                        description: `${newItems.length} ingredients added to your shopping list.`,
                      });
                    }
                    
                    // Notify about duplicates if any
                    if (duplicates.length > 0) {
                      toast({
                        title: "Duplicate ingredients",
                        description: `${duplicates.length} ingredients were already in your shopping list.`,
                        variant: "default",
                      });
                    }
                    
                    setIngredientsToAdd([]);
                    setShowCalculateDialog(false);
                  } else {
                    toast({
                      title: "No Ingredients Selected",
                      description: "Please select at least one ingredient to add to your shopping list.",
                    });
                  }
                }}
              >
                Add to Shopping List
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default MealPlanner;