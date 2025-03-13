import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  Clock, Users, ChevronLeft, Printer, Share, Plus, 
  Check, ShoppingCart, Calendar, Trash2, CheckSquare, AlertCircle,
  Facebook, Twitter, Linkedin, Copy, Instagram, Mail, CalendarPlus
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
import { padThaiIngredients, padThaiInstructions, padThaiTips } from "@/data/padThaiRecipe";
import { cn } from "@/lib/utils";

// Type for shopping list items
interface ShoppingListItem {
  ingredient: string;
  recipeId: string;
  recipeName: string;
}

// Type for meal plan
interface Meal {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  recipeId: string | null;
}

interface MealPlan {
  date: Date;
  meals: Meal[];
  servingSize?: number;
}

// Helper function to generate a slug from a string
const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};

// Helper function to find a recipe by slug
const findRecipeBySlug = (slug: string) => {
  return mockRecipes.find(recipe => generateSlug(recipe.title) === slug);
};

const Recipe = () => {
  const { slug } = useParams<{ slug: string }>();
  const recipe = findRecipeBySlug(slug ?? '');
  
  const [activeTab, setActiveTab] = useState("ingredients");
  const [ingredientsToAdd, setIngredientsToAdd] = useState<string[]>([]);
  const [showMealTypeDialog, setShowMealTypeDialog] = useState(false);

  // Get shopping list from localStorage or initialize empty array
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>(() => {
    const savedList = localStorage.getItem('shoppingList');
    return savedList ? JSON.parse(savedList) : [];
  });

  // Save shopping list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  }, [shoppingList]);

  // Add a new state variable for the link preview
  const [linkPreview, setLinkPreview] = useState("");

  // Add a state variable for print mode
  const [isPrinting, setIsPrinting] = useState(false);

  // Add a variable for recipe tips
  let tips: string[] = [];

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
  } else if (slug === "0" || slug === "sushi-bake") {
    ingredients = sushiBakeIngredients;
    instructions = sushiBakeInstructions;
  } else if (slug === "13" || slug === "roasted-leg-of-lamb") {
    ingredients = roastedLambIngredients;
    instructions = roastedLambInstructions;
  } else if (slug === "easy-pad-thai" || slug === "1" || slug === "pad-thai") {
    ingredients = padThaiIngredients;
    instructions = padThaiInstructions;
    tips = padThaiTips;
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

  const handleAddToMealPlan = (mealType: "breakfast" | "lunch" | "dinner") => {
    if (!recipe) return;
    
    // Load existing meal plans from localStorage
    let mealPlans: MealPlan[] = [];
    try {
      const storedMealPlans = localStorage.getItem('mealPlans');
      if (storedMealPlans) {
        // Parse the stored meal plans and convert date strings back to Date objects
        const parsedMealPlans = JSON.parse(storedMealPlans);
        mealPlans = parsedMealPlans.map((plan: any) => ({
          ...plan,
          date: new Date(plan.date)
        }));
      }
    } catch (error) {
      console.error('Error loading meal plans from localStorage:', error);
    }
    
    // Get today's date (reset time to start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find if we already have a meal plan for today
    const todayPlanIndex = mealPlans.findIndex(
      plan => new Date(plan.date).toDateString() === today.toDateString()
    );
    
    // Generate a unique ID for the new meal
    const mealId = `${today.toISOString()}-${mealType}-${recipe.id}-${Date.now()}`;
    
    if (todayPlanIndex >= 0) {
      // Check if this recipe already exists for this meal type today
      const recipeAlreadyExists = mealPlans[todayPlanIndex].meals.some(
        meal => meal.type === mealType && meal.recipeId === recipe.id
      );
      
      // If recipe already exists for this meal type, don't add it again
      if (recipeAlreadyExists) {
        toast({
          title: "Recipe already added",
          description: `${recipe.title} is already added to ${mealType} for today`,
        });
        return;
      }
      
      // Add new meal to existing date
      mealPlans[todayPlanIndex].meals.push({
        id: mealId,
        name: recipe.title,
        type: mealType,
        recipeId: recipe.id
      });
    } else {
      // Create new meal plan for today
      mealPlans.push({
        date: today,
        servingSize: 4, // Default serving size
        meals: [{
          id: mealId,
          name: recipe.title,
          type: mealType,
          recipeId: recipe.id
        }]
      });
    }
    
    // Save updated meal plans to localStorage
    try {
      localStorage.setItem('mealPlans', JSON.stringify(mealPlans));
      
    toast({
      title: "Added to meal plan",
        description: `${recipe.title} has been added to today's ${mealType}.`,
      });
      
      setShowMealTypeDialog(false);
    } catch (error) {
      console.error('Error saving meal plans to localStorage:', error);
      toast({
        title: "Error",
        description: "Failed to add recipe to meal plan.",
        variant: "destructive",
      });
    }
  };

  const toggleIngredient = (ingredient: string) => {
    setIngredientsToAdd(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  // Update the handlePrint function
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        setIsPrinting(false);
      }, 500);
    }, 100);
  };

  // Add a function to generate the link preview
  const generateLinkPreview = () => {
    const url = window.location.href;
    setLinkPreview(url);
    return url;
  };

  const handleShare = () => {
    // Implement the share functionality
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
      {/* Regular view (hidden during printing) */}
      <div className={isPrinting ? "hidden" : ""}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img 
                src="https://t3.ftcdn.net/jpg/03/47/39/42/360_F_347394209_Wt66TsKLwVEqjJzxT1ub8tWLuNLTySnK.jpg" 
                alt="Hinchey's Recipes Logo" 
                className="h-32 w-32 rounded-full"
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div className="text-center mb-6">
              <h1 className="text-5xl font-bold text-black">Hinchey's Recipes</h1>
            </div>
            <div className="w-full flex justify-start mb-4">
          <Link to="/recipes">
            <Button variant="ghost" className="mb-2">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Recipes
            </Button>
          </Link>
            </div>
            <div className="w-full flex flex-col items-start">
          <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
          <p className="text-muted-foreground mb-4">{recipe.description}</p>
          
              <div className="w-full flex flex-wrap items-center gap-4 mb-4">
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
            </div>
          </div>
          
          <div className="mb-8">
            <div className="bg-cover bg-center h-64 sm:h-80 w-full rounded-lg overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="w-full mb-6">
            <div className="flex flex-wrap justify-between gap-2 mb-4">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1"
                  onClick={handlePrint}
                >
                  <Printer className="h-4 w-4" />
                  <span className="hidden sm:inline">Print</span>
            </Button>
                
            <Dialog>
              <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Share className="h-4 w-4" />
                      <span className="hidden sm:inline">Share</span>
                </Button>
              </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-w-[95vw]">
                <DialogHeader>
                      <DialogTitle>Share this recipe</DialogTitle>
                </DialogHeader>
                    <div className="flex flex-col space-y-4 py-4">
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Copy link</span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex-1 p-2 bg-muted rounded-md text-xs overflow-hidden text-ellipsis whitespace-nowrap" onClick={() => generateLinkPreview()}>
                            {linkPreview || generateLinkPreview()}
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-shrink-0 flex items-center gap-2"
                            onClick={() => {
                              const url = generateLinkPreview();
                              navigator.clipboard.writeText(url)
                                .then(() => {
                                  toast({
                                    title: "Link copied",
                                    description: "Recipe link has been copied to clipboard",
                                  });
                                })
                                .catch(err => {
                                  // For mobile browsers that don't support clipboard API
                                  const textArea = document.createElement("textarea");
                                  textArea.value = url;
                                  document.body.appendChild(textArea);
                                  textArea.focus();
                                  textArea.select();
                                  try {
                                    document.execCommand('copy');
                                    toast({
                                      title: "Link copied",
                                      description: "Recipe link has been copied to clipboard",
                                    });
                                  } catch (err) {
                                    toast({
                                      title: "Copy failed",
                                      description: "Please manually copy the link",
                                      variant: "destructive",
                                    });
                                  }
                                  document.body.removeChild(textArea);
                                });
                            }}
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                    </div>
                </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <span className="text-sm text-muted-foreground">Share on social media</span>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full bg-[#1877F2] hover:bg-[#1877F2]/90 text-white border-none"
                            onClick={() => {
                              const shareUrl = encodeURIComponent(window.location.href);
                              const shareTitle = encodeURIComponent(recipe.title);
                              window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`, '_blank');
                            }}
                          >
                            <Facebook className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white border-none"
                            onClick={() => {
                              const shareUrl = encodeURIComponent(window.location.href);
                              const shareTitle = encodeURIComponent(recipe.title);
                              window.open(`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`, '_blank');
                            }}
                          >
                            <Twitter className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full bg-[#25D366] hover:bg-[#25D366]/90 text-white border-none"
                            onClick={() => {
                              const shareUrl = encodeURIComponent(window.location.href);
                              const shareText = encodeURIComponent(`Check out this recipe for ${recipe.title}!`);
                              window.open(`https://api.whatsapp.com/send?text=${shareText} ${shareUrl}`, '_blank');
                            }}
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full bg-[#EA4335] hover:bg-[#EA4335]/90 text-white border-none"
                            onClick={() => {
                              const shareSubject = encodeURIComponent(`Check out this recipe: ${recipe.title}`);
                              const shareBody = encodeURIComponent(`I found this amazing recipe for ${recipe.title}. Check it out here: ${window.location.href}`);
                              window.open(`mailto:?subject=${shareSubject}&body=${shareBody}`, '_blank');
                            }}
                          >
                            <Mail className="h-4 w-4" />
                  </Button>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="rounded-full bg-black hover:bg-black/90 text-white border-none"
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: recipe.title,
                                  text: `Check out this recipe for ${recipe.title}!`,
                                  url: window.location.href,
                                })
                                .catch(err => {
                                  toast({
                                    title: "Share failed",
                                    description: "Could not use native sharing",
                                    variant: "destructive",
                                  });
                                });
                              } else {
                                toast({
                                  title: "Share not supported",
                                  description: "Your browser doesn't support native sharing",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Share className="h-4 w-4" />
                  </Button>
                        </div>
                      </div>
                </div>
              </DialogContent>
            </Dialog>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="hidden sm:inline">Add to Shopping List</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-w-[95vw]">
                    <DialogHeader>
                      <DialogTitle>Add Ingredients to Shopping List</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Select ingredients from {recipe?.title} to add to your shopping list:
                      </p>
                      <div className="flex justify-end mb-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={handleSelectAllIngredients}
                        >
                          <CheckSquare className="h-4 w-4" />
                          Select All
            </Button>
          </div>
                      <div className="max-h-[50vh] overflow-y-auto pr-2">
                        <ul className="space-y-2">
                          {ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Checkbox 
                                id={`ingredient-${index}`}
                                checked={ingredientsToAdd.includes(ingredient)}
                                onCheckedChange={() => toggleIngredient(ingredient)}
                                disabled={isIngredientInShoppingList(ingredient)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <label
                                  htmlFor={`ingredient-${index}`}
                                  className={cn(
                                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                                    isIngredientInShoppingList(ingredient) && "line-through text-muted-foreground"
                                  )}
                                >
                                  {ingredient}
                                </label>
                                {isIngredientInShoppingList(ingredient) && (
                                  <p className="text-xs text-muted-foreground">
                                    Already in shopping list
                                  </p>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <DialogFooter className="sm:justify-between">
                      <div className="hidden sm:block">
                        {ingredientsToAdd.length > 0 ? (
                          <p className="text-sm text-muted-foreground">
                            {ingredientsToAdd.length} ingredient{ingredientsToAdd.length !== 1 ? 's' : ''} selected
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No ingredients selected
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Button 
                          variant="outline" 
                          className="flex-1 sm:flex-initial"
                          onClick={() => setIngredientsToAdd([])}
                        >
                          Cancel
                        </Button>
                        <Button 
                          className="flex-1 sm:flex-initial flex items-center gap-1"
                          onClick={handleAddToShoppingList}
                          disabled={ingredientsToAdd.length === 0}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Add to Shopping List
                        </Button>
        </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                
                <Dialog open={showMealTypeDialog} onOpenChange={setShowMealTypeDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-1"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add to Meal Plan</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md max-w-[95vw]">
                    <DialogHeader>
                      <DialogTitle>Add to Today's Meal Plan</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Choose which meal to add <span className="font-medium">{recipe?.title}</span> to:
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <Button 
                          onClick={() => handleAddToMealPlan("breakfast")}
                          className="flex flex-col items-center py-6 h-auto border-2 hover:border-primary hover:bg-primary/5"
                          variant="outline"
                        >
                          <span className="text-2xl mb-2">🍳</span>
                          <span className="font-medium">Breakfast</span>
                        </Button>
                        <Button 
                          onClick={() => handleAddToMealPlan("lunch")}
                          className="flex flex-col items-center py-6 h-auto border-2 hover:border-primary hover:bg-primary/5"
                          variant="outline"
                        >
                          <span className="text-2xl mb-2">🥪</span>
                          <span className="font-medium">Lunch</span>
                        </Button>
                        <Button 
                          onClick={() => handleAddToMealPlan("dinner")}
                          className="flex flex-col items-center py-6 h-auto border-2 hover:border-primary hover:bg-primary/5"
                          variant="outline"
                        >
                          <span className="text-2xl mb-2">🍲</span>
                          <span className="font-medium">Dinner</span>
                        </Button>
                      </div>
                      <div className="mt-4 text-xs text-muted-foreground text-center">
                        This will add the recipe to today's meal plan
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
        </div>
        
          <Tabs defaultValue="ingredients" className="w-full mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          <TabsContent value="ingredients" className="mt-4 space-y-4">
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <ul className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                      <span className="text-base">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="instructions" className="mt-4 space-y-4">
              <div className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <ol className="space-y-5">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-3 sm:gap-4">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="flex-1 text-base">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Print-only view */}
      <div className={isPrinting ? "print-only-view" : "hidden"}>
        <div className="print-container">
          <div className="print-header">
            <img 
              src="https://t3.ftcdn.net/jpg/03/47/39/42/360_F_347394209_Wt66TsKLwVEqjJzxT1ub8tWLuNLTySnK.jpg" 
              alt="Hinchey's Recipes Logo" 
              className="print-logo"
            />
            <div className="print-site-name">Hinchey's Recipes</div>
            <h1 className="print-title">{recipe.title}</h1>
            <p className="print-description">{recipe.description}</p>
            
            <div className="print-meta">
              <div className="print-meta-item">
                <Clock className="print-icon" />
                <span>{recipe.prepTime} minutes</span>
              </div>
              <div className="print-meta-item">
                <Users className="print-icon" />
                <span>{recipe.servings} servings</span>
              </div>
              <span className="print-category">{recipe.category}</span>
            </div>
          </div>
          
          <div className="print-content">
            <div className="print-section">
              <h2 className="print-section-title">Ingredients</h2>
              <ul className="print-list">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="print-list-item">
                    <div className="print-bullet" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="print-section">
              <h2 className="print-section-title">Instructions</h2>
              <ol className="print-list">
                {instructions.map((instruction, index) => (
                  <li key={index} className="print-list-item-numbered">
                    <span className="print-number">{index + 1}</span>
                    <span className="print-instruction">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          <div className="print-footer">
            <p>Recipe from Hinchey's Recipes</p>
          </div>
        </div>
      </div>
      
      {/* Add print styles */}
      <style>
        {`
          @media print {
            header, footer, nav, .no-print {
              display: none !important;
            }
            
            body, html {
              width: 100% !important;
              margin: 0 !important;
              padding: 0 !important;
              font-size: 10pt !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            .print-only-view {
              display: block !important;
            }
            
            .hidden {
              display: none !important;
            }
            
            .print-container {
              max-width: 100%;
              margin: 0 auto;
              padding: 0.3in;
            }
            
            .print-header {
              text-align: center;
              margin-bottom: 15pt;
            }
            
            .print-logo {
              width: 60pt;
              height: 60pt;
              border-radius: 50%;
              object-fit: cover;
              margin: 0 auto 10pt;
              display: block;
            }
            
            .print-site-name {
              font-size: 24pt !important;
              font-weight: bold;
              margin-bottom: 10pt !important;
              color: #000;
            }
            
            .print-title {
              font-size: 18pt !important;
              font-weight: bold;
              margin-bottom: 6pt !important;
            }
            
            .print-description {
              font-size: 10pt !important;
              margin-bottom: 8pt !important;
              color: #666;
            }
            
            .print-meta {
              display: flex;
              justify-content: center;
              flex-wrap: wrap;
              gap: 12pt;
              margin-bottom: 15pt;
            }
            
            .print-meta-item {
              display: flex;
              align-items: center;
              gap: 3pt;
              font-size: 9pt !important;
            }
            
            .print-icon {
              width: 9pt;
              height: 9pt;
            }
            
            .print-category {
              background-color: #f3f4f6;
              padding: 1pt 6pt;
              border-radius: 10pt;
              font-size: 9pt !important;
            }
            
            .print-content {
              display: block;
            }
            
            .print-section {
              margin-bottom: 15pt;
              page-break-inside: avoid;
            }
            
            .print-section-title {
              font-size: 14pt !important;
              font-weight: bold;
              margin-bottom: 8pt !important;
              border-bottom: 1pt solid #ddd;
              padding-bottom: 3pt;
            }
            
            .print-list {
              padding-left: 0;
              list-style-type: none;
            }
            
            .print-list-item {
              display: flex;
              align-items: flex-start;
              gap: 6pt;
              margin-bottom: 6pt;
              line-height: 1.3;
              font-size: 9pt !important;
              page-break-inside: avoid;
            }
            
            .print-bullet {
              width: 3pt;
              height: 3pt;
              border-radius: 50%;
              background-color: #000;
              margin-top: 6pt;
              flex-shrink: 0;
            }
            
            .print-list-item-numbered {
              display: flex;
              align-items: flex-start;
              gap: 6pt;
              margin-bottom: 8pt;
              line-height: 1.3;
              font-size: 9pt !important;
              page-break-inside: avoid;
            }
            
            .print-number {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 14pt;
              height: 14pt;
              border-radius: 50%;
              background-color: #000;
              color: #fff;
              font-size: 8pt;
              font-weight: bold;
              flex-shrink: 0;
            }
            
            .print-instruction {
              flex: 1;
            }
            
            .print-footer {
              margin-top: 15pt;
              text-align: center;
              font-size: 8pt;
              color: #666;
            }
            
            @page {
              margin: 0.4in;
              size: portrait;
            }
          }
          
          @media screen and (max-width: 640px) {
            .print-list {
              column-count: 1 !important;
            }
          }
        `}
      </style>
    </Layout>
  );
};

export default Recipe;
