import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, X, Users, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RecipeProps } from "./RecipeCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface MealPlan {
  date: Date;
  meals: {
    id: string;
    name: string;
    type: "breakfast" | "lunch" | "dinner";
    recipeId: string | null;
  }[];
  servingSize?: number;
}

interface MealPlannerCalendarProps {
  recipes: RecipeProps[];
  mealPlans: MealPlan[];
  onAddMeal: (date: Date, type: "breakfast" | "lunch" | "dinner", recipeId: string) => void;
  onRemoveMeal: (date: Date, mealId: string) => void;
  onUpdateServingSize: (date: Date, servingSize: number) => void;
  onSelectMealForCalculation: (meal: {id: string, name: string, recipeId: string, date: Date}, isSelected: boolean) => void;
  selectedMeals: {id: string, name: string, recipeId: string, date: Date}[];
}

export const MealPlannerCalendar = ({
  recipes,
  mealPlans,
  onAddMeal,
  onRemoveMeal,
  onUpdateServingSize,
  onSelectMealForCalculation,
  selectedMeals,
}: MealPlannerCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMealType, setSelectedMealType] = useState<"breakfast" | "lunch" | "dinner">("dinner");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openPopoverMealId, setOpenPopoverMealId] = useState<string | null>(null);

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

  const getServingSizeForDate = (date: Date) => {
    const mealPlan = mealPlans.find((mp) => isSameDay(mp.date, date));
    return mealPlan?.servingSize || 4;
  };

  const handleAddMeal = (date: Date, recipeId: string) => {
    if (selectedMealType) {
      onAddMeal(date, selectedMealType, recipeId);
    }
  };

  const handleServingSizeChange = (date: Date, value: string) => {
    const servingSize = parseInt(value);
    if (!isNaN(servingSize) && servingSize > 0) {
      onUpdateServingSize(date, servingSize);
    }
  };

  const isMealSelected = (mealId: string) => {
    return selectedMeals.some(meal => meal.id === mealId);
  };

  const getMealTypeId = (date: Date, type: string) => {
    return `${date.toISOString()}-${type}`;
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

        {days.map(({ date }) => {
          const hasMeals = getMealsForDate(date).length > 0;
          
          return (
            <div key={date.toISOString()} className="border border-border rounded-md p-2 h-[220px] overflow-y-auto">
              {hasMeals && (
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={getServingSizeForDate(date)}
                      onChange={(e) => handleServingSizeChange(date, e.target.value)}
                      className="h-6 w-12 text-xs px-1"
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                {["breakfast", "lunch", "dinner"].map((type) => {
                  const meals = getMealsForDate(date).filter((m) => m.type === type);
                  return (
                    <div key={type} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium capitalize">{type}</span>
                        <Popover 
                          open={openPopoverMealId === getMealTypeId(date, type)}
                          onOpenChange={(open) => {
                            if (open) {
                              setOpenPopoverMealId(getMealTypeId(date, type));
                              setSelectedDate(date);
                              setSelectedMealType(type as "breakfast" | "lunch" | "dinner");
                            } else {
                              setOpenPopoverMealId(null);
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-5 w-5"
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
                            <div className="mt-2 flex justify-end">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => setOpenPopoverMealId(null)}
                                className="text-xs"
                              >
                                Done
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      {meals.map((meal) => {
                        const recipe = recipes.find(r => r.id === meal.recipeId);
                        const isSelected = isMealSelected(meal.id);
                        
                        return recipe ? (
                          <div 
                            key={meal.id} 
                            className={cn(
                              "text-xs p-1.5 rounded flex items-center justify-between",
                              isSelected ? "bg-primary/20" : "bg-accent"
                            )}
                          >
                            <div className="flex items-center gap-1.5 flex-1 min-w-0">
                              <Checkbox 
                                id={`meal-${meal.id}`}
                                checked={isSelected}
                                onCheckedChange={(checked) => {
                                  onSelectMealForCalculation({
                                    id: meal.id,
                                    name: recipe.title,
                                    recipeId: recipe.id,
                                    date: date
                                  }, !!checked);
                                }}
                                className="h-3 w-3"
                              />
                              <span className="truncate">{recipe.title}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4 ml-1 flex-shrink-0"
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
          );
        })}
      </div>
    </div>
  );
};

export default MealPlannerCalendar;
