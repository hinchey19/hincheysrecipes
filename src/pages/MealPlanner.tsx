
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { MealPlannerCalendar } from "@/components/MealPlannerCalendar";
import { mockRecipes } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  recipeId: string | null;
}

interface MealPlan {
  date: Date;
  meals: Meal[];
}

const MealPlanner = () => {
  // Initialize with current week and empty meal plans
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

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
      } else {
        // Create new meal plan for this date
        newPlans.push({
          date: new Date(date),
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

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Meal Planner</h1>
        </div>

        <MealPlannerCalendar
          recipes={mockRecipes}
          mealPlans={mealPlans}
          onAddMeal={addMealToDate}
          onRemoveMeal={removeMealFromDate}
        />
      </div>
    </Layout>
  );
};

export default MealPlanner;
