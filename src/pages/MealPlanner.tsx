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
      
      // Get recipe ingredients based on recipe ID
      let recipeIngredients: string[] = [];
      
      // Import ingredients from the appropriate recipe file based on recipe ID
      if (meal.recipeId === "0") { // Sushi Bake
        recipeIngredients = sushiBakeIngredients;
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
      } else if (meal.recipeId === "7") { // Green Papaya Salad
        recipeIngredients = greenPapayaSaladIngredients.map(item => 
          `${item.amount} ${item.unit} ${item.name}${item.notes ? ` (${item.notes})` : ''}`
        );
      } else if (meal.recipeId === "13") { // Roasted Leg of Lamb
        recipeIngredients = roastedLambIngredients;
      }
      
      // Calculate the total quantity of each ingredient
      recipeIngredients.forEach(ingredient => {
        const [quantity, unit, name] = ingredient.split(' ');
        const totalQuantity = parseFloat(quantity) * servingRatio;
        ingredients.push({
          name,
          quantity: totalQuantity.toString(),
          category: "ingredient"
        });
      });
    });
    
    setCalculatedIngredients(ingredients);
    setShowCalculateDialog(true);
  };

  return (
    <Layout>
      {/* Rest of the component content */}
    </Layout>
  );
};

export default MealPlanner;