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

  // Add a new state variable for the link preview
  const [linkPreview, setLinkPreview] = useState("");

  // Add a state variable for print mode
  const [isPrinting, setIsPrinting] = useState(false);

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
            <div className="bg-cover bg-center h-80 w-full rounded-lg overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="w-full mb-6">
            <div className="flex justify-between mb-4">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handlePrint}>
                  <Printer className="h-4 w-4" />
                  Print
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1" 
                  onClick={handleShare}
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ShoppingCart className="h-4 w-4" />
                  Add to Shopping List
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <CalendarPlus className="h-4 w-4" />
                  Add to Meal Plan
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="ingredients" className="w-full mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>
            <TabsContent value="ingredients" className="mt-4 space-y-4">
              <div className="bg-card rounded-lg p-6 border border-border">
                <ul className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span className="text-base">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="instructions" className="mt-4 space-y-4">
              <div className="bg-card rounded-lg p-6 border border-border">
                <ol className="space-y-5">
                  {instructions.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </span>
                      <span className="flex-1 pt-0.5 text-base">{instruction}</span>
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
              width: 80pt;
              height: 80pt;
              border-radius: 50%;
              object-fit: cover;
              margin: 0 auto 10pt;
              display: block;
            }
            
            .print-site-name {
              font-size: 40pt !important;
              font-weight: bold;
              margin-bottom: 15pt !important;
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
              break-inside: avoid-column;
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
              column-count: 2;
              column-gap: 20pt;
            }
            
            .print-list-item {
              display: flex;
              align-items: flex-start;
              gap: 6pt;
              margin-bottom: 6pt;
              line-height: 1.3;
              font-size: 9pt !important;
              break-inside: avoid;
            }
            
            .print-bullet {
              width: 3pt;
              height: 3pt;
              border-radius: 50%;
              background-color: #000;
              margin-top: 6pt;
              flex-shrink: 0;
            }
            
            .print-section:last-child .print-list {
              column-count: 1;
            }
            
            .print-list-item-numbered {
              display: flex;
              align-items: flex-start;
              gap: 6pt;
              margin-bottom: 8pt;
              line-height: 1.3;
              font-size: 9pt !important;
              break-inside: avoid;
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
        `}
      </style>
    </Layout>
  );
};

export default Recipe;
