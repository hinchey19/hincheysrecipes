
import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RecipeProps } from "./RecipeCard";

interface MealPlan {
  date: Date;
  meals: {
    id: string;
    name: string;
    type: "breakfast" | "lunch" | "dinner";
    recipeId: string | null;
  }[];
}

interface MealPlannerCalendarProps {
  recipes: RecipeProps[];
  mealPlans: MealPlan[];
  onAddMeal: (date: Date, type: "breakfast" | "lunch" | "dinner", recipeId: string) => void;
  onRemoveMeal: (date: Date, mealId: string) => void;
}

export const MealPlannerCalendar = ({
  recipes,
  mealPlans,
  onAddMeal,
  onRemoveMeal,
}: MealPlannerCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner">("dinner");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  
  const days = [...Array(7)].map((_, i) => {
    const date = addDays(startOfCurrentWeek, i);
    return {
      date,
      day: format(date, "EEEE"),
      dayShort: format(date, "EEE"),
      dayOfMonth: format(date, "d"),
    };
  });

  const prevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  const getMealsForDate = (date: Date) => {
    const mealPlan = mealPlans.find((mp) => isSameDay(mp.date, date));
    return mealPlan?.meals || [];
  };

  const handleAddMeal = (date: Date, recipeId: string) => {
    if (selectedMealType) {
      onAddMeal(date, selectedMealType, recipeId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Meal Planner</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={prevWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(startOfCurrentWeek, "MMM d")} - {format(addDays(startOfCurrentWeek, 6), "MMM d, yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={nextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {days.map(({ date, dayShort, dayOfMonth }) => (
          <div key={dayShort} className="flex flex-col items-center">
            <span className="text-xs font-medium text-muted-foreground mb-1">{dayShort}</span>
            <span className="h-8 w-8 flex items-center justify-center text-sm font-medium rounded-full mb-2">
              {dayOfMonth}
            </span>
          </div>
        ))}

        {days.map(({ date }) => (
          <div key={date.toISOString()} className="border border-border rounded-md p-2 h-[180px] overflow-y-auto">
            <div className="space-y-2">
              {["breakfast", "lunch", "dinner"].map((type) => {
                const meals = getMealsForDate(date).filter((m) => m.type === type);
                return (
                  <div key={type} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium capitalize">{type}</span>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5"
                            onClick={() => {
                              setSelectedDate(date);
                              setSelectedMealType(type as "breakfast" | "lunch" | "dinner");
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-60 p-2" align="center">
                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            <h4 className="text-sm font-medium mb-1">Select Recipe</h4>
                            {recipes.map(recipe => (
                              <button
                                key={recipe.id}
                                className="w-full text-left px-2 py-1 text-sm rounded-md hover:bg-accent transition-colors"
                                onClick={() => {
                                  handleAddMeal(date, recipe.id);
                                }}
                              >
                                {recipe.title}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {meals.map((meal) => {
                      const recipe = recipes.find(r => r.id === meal.recipeId);
                      return recipe ? (
                        <div 
                          key={meal.id} 
                          className="text-xs p-1.5 rounded bg-accent flex items-center justify-between"
                        >
                          <span className="truncate">{recipe.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-1"
                            onClick={() => onRemoveMeal(date, meal.id)}
                          >
                            <X className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MealPlannerCalendar;
