import React, { useState } from "react";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { RecipeProps } from "./RecipeCard";
import { Input } from "@/components/ui/input";
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

  const handleAddMeal = (date: Date, mealType: "breakfast" | "lunch" | "dinner", recipeId: string) => {
    onAddMeal(date, mealType, recipeId);
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
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Meal Planner</h2>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevWeek}>
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <span className="text-[10px] sm:text-xs font-medium inline">
            {format(startOfCurrentWeek, "MMM d")} - {format(addDays(startOfCurrentWeek, 6), "MMM d")}
          </span>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextWeek}>
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Mobile-optimized table layout with horizontal scroll if needed */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="border rounded-md overflow-hidden min-w-[300px] w-full" style={{ maxWidth: "calc(100vw - 32px)" }}>
          {/* Header row */}
          <div className="grid grid-cols-4 border-b bg-muted text-[9px] sm:text-xs" style={{ gridTemplateColumns: "80px 1fr 1fr 1fr" }}>
            <div className="py-1 px-1 font-semibold text-center border-r">Day</div>
            <div className="py-1 px-1 font-semibold text-center border-r">Breakfast</div>
            <div className="py-1 px-1 font-semibold text-center border-r">Lunch</div>
            <div className="py-1 px-1 font-semibold text-center">Dinner</div>
          </div>

          {/* Day rows */}
          {days.map(({ date, day, dayOfMonth }) => (
            <div key={date.toISOString()} className="grid grid-cols-4 border-b last:border-b-0" style={{ gridTemplateColumns: "80px 1fr 1fr 1fr" }}>
              {/* Day column */}
              <div className="py-1 px-1 border-r flex flex-col justify-start">
                <div className="font-medium text-[12px] sm:text-sm">{day}</div>
                <div className="text-[14px] sm:text-base font-bold">{dayOfMonth}</div>
                
                {/* Serving size control */}
                <div className="flex items-center gap-1 mt-1">
                  <Users className="h-2 w-2 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={getServingSizeForDate(date)}
                    onChange={(e) => handleServingSizeChange(date, e.target.value)}
                    className="h-4 w-8 text-[9px] px-1"
                  />
                </div>
              </div>

              {/* Meal type columns */}
              {["breakfast", "lunch", "dinner"].map((mealType, index) => {
                const meals = getMealsForDate(date).filter((m) => m.type === mealType);
                const typedMealType = mealType as "breakfast" | "lunch" | "dinner";
                
                return (
                  <div 
                    key={`${date.toISOString()}-${mealType}`} 
                    className={cn(
                      "py-1 px-1 relative min-h-[40px] sm:min-h-[80px]",
                      index < 2 ? "border-r" : ""
                    )}
                  >
                    {/* Add meal button */}
                    <Popover 
                      open={openPopoverMealId === getMealTypeId(date, mealType)}
                      onOpenChange={(open) => {
                        if (open) {
                          setOpenPopoverMealId(getMealTypeId(date, mealType));
                          setSelectedDate(date);
                          setSelectedMealType(typedMealType);
                        } else {
                          setOpenPopoverMealId(null);
                        }
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="absolute top-0 right-0 h-3 w-3 p-0 sm:h-5 sm:w-5"
                        >
                          <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
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
                                handleAddMeal(date, typedMealType, recipe.id);
                                setOpenPopoverMealId(null);
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
                    
                    {/* Meal list */}
                    <div className="space-y-1 mt-3">
                      {meals.map((meal) => {
                        const recipe = recipes.find(r => r.id === meal.recipeId);
                        const isSelected = isMealSelected(meal.id);
                        
                        return recipe ? (
                          <div 
                            key={meal.id} 
                            className={cn(
                              "text-[8px] sm:text-xs py-0.5 px-1 rounded flex items-start justify-between h-auto min-h-[18px] sm:min-h-[22px]",
                              isSelected ? "bg-primary/20" : "bg-accent"
                            )}
                          >
                            <div className="flex-1 min-w-0 pr-1">
                              <div className="break-words hyphens-auto" style={{ wordBreak: "break-word" }}>{recipe.title}</div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-3 w-3 ml-0.5 flex-shrink-0 mt-0"
                              onClick={() => onRemoveMeal(date, meal.id)}
                            >
                              <X className="h-2 w-2" />
                            </Button>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealPlannerCalendar;
