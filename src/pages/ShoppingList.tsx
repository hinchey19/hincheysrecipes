import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { ShoppingListItem, ShoppingItemProps } from "@/components/ShoppingListItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Check, ShoppingCart, Download, Share, Trash2, Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";

interface ShoppingItemGroup {
  category: string;
  items: ShoppingItemProps[];
}

const initialItems: ShoppingItemProps[] = [
  { id: "1", name: "Olive oil", quantity: "2 tbsp", category: "Oils & Condiments", checked: false },
  { id: "2", name: "Onion", quantity: "1 large", category: "Vegetables", checked: false },
  { id: "3", name: "Garlic", quantity: "2 cloves", category: "Vegetables", checked: false },
  { id: "4", name: "Red bell pepper", quantity: "1", category: "Vegetables", checked: false },
  { id: "5", name: "Ground beef", quantity: "1 pound", category: "Meat", checked: false },
  { id: "6", name: "Tomato sauce", quantity: "15 oz can", category: "Canned Goods", checked: false },
  { id: "7", name: "Diced tomatoes", quantity: "15 oz can", category: "Canned Goods", checked: false },
  { id: "8", name: "Chili powder", quantity: "2 tbsp", category: "Spices", checked: false },
  { id: "9", name: "Cumin", quantity: "1 tsp", category: "Spices", checked: false },
  { id: "10", name: "Salt", quantity: "1 tsp", category: "Spices", checked: false },
  { id: "11", name: "Black pepper", quantity: "1/2 tsp", category: "Spices", checked: false },
  { id: "12", name: "Kidney beans", quantity: "15 oz can", category: "Canned Goods", checked: false },
];

const ShoppingList = () => {
  // Load items from localStorage if available, otherwise use initialItems
  const loadItemsFromStorage = () => {
    try {
      const storedItems = localStorage.getItem('shoppingList');
      console.log('Loading shopping list from localStorage:', storedItems);
      if (storedItems) {
        const parsedItems = JSON.parse(storedItems);
        console.log('Parsed shopping list items:', parsedItems);
        // Ensure the items have the correct structure
        if (Array.isArray(parsedItems)) {
          return parsedItems.map(item => {
            // Handle both old and new data structures
            if (item.ingredient && !item.name) {
              // This is from the Recipe component
              // Parse the ingredient string to extract quantity and name
              const ingredientParts = parseIngredientString(item.ingredient);
              
              return {
                id: item.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                name: ingredientParts.name || 'Unknown Item',
                quantity: ingredientParts.quantity || '1',
                category: item.category || 'Other',
                checked: item.checked || false,
                recipeId: item.recipeId,
                recipeName: item.recipeName,
                ingredient: item.ingredient // Preserve original ingredient string
              };
            } else {
              // This is already in the correct format or from MealPlanner
              return {
                id: item.id || Date.now().toString(),
                name: item.name || 'Unknown Item',
                quantity: item.quantity || '1',
                category: item.category || 'Other',
                checked: item.checked || false,
                recipeId: item.recipeId,
                recipeName: item.recipeName,
                ingredient: item.ingredient // Preserve original ingredient string if it exists
              };
            }
          });
        }
      }
      console.log('Using initial items for shopping list');
      return initialItems;
    } catch (error) {
      console.error('Error loading shopping list from localStorage:', error);
      return initialItems;
    }
  };
  
  // Helper function to parse ingredient strings
  const parseIngredientString = (ingredient: string) => {
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
      quantity = `${tbspResult[1]} ${tbspResult[2]}`;
      name = tbspResult[3];
      notes = tbspResult[4] || "";
    } else if (basicResult) {
      quantity = `${basicResult[1]} ${basicResult[2]}`;
      name = basicResult[3];
      notes = basicResult[4] || "";
    } else {
      // If no match, just use the whole string as the name
      name = ingredient;
      quantity = "1";
    }
    
    return { quantity, name, notes };
  };

  const [items, setItems] = useState<ShoppingItemProps[]>(loadItemsFromStorage());
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [showChecked, setShowChecked] = useState(true);
  const [showInstacartDialog, setShowInstacartDialog] = useState(false);

  // Save items to localStorage whenever they change
  const saveItemsToStorage = (updatedItems: ShoppingItemProps[]) => {
    try {
      localStorage.setItem('shoppingList', JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error saving shopping list to localStorage:', error);
    }
  };

  // Group the items by category
  const groupedItems: ShoppingItemGroup[] = items
    .filter(item => showChecked || !item.checked)
    .reduce((groups, item) => {
      const group = groups.find(g => g.category === item.category);
      if (group) {
        group.items.push(item);
      } else {
        groups.push({ category: item.category, items: [item] });
      }
      return groups;
    }, [] as ShoppingItemGroup[])
    .sort((a, b) => a.category.localeCompare(b.category));

  // Categories for the dropdown
  const categories = Array.from(new Set(items.map(item => item.category))).sort();

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newItemName.trim()) {
      toast({
        title: "Error",
        description: "Please enter an item name",
        variant: "destructive",
      });
      return;
    }

    const newItem: ShoppingItemProps = {
      id: Date.now().toString(),
      name: newItemName.trim(),
      quantity: newItemQuantity.trim() || "1",
      category: newItemCategory || "Other",
      checked: false,
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    saveItemsToStorage(updatedItems);
    setNewItemName("");
    setNewItemQuantity("");
    
    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your shopping list.`,
    });
  };

  const handleToggleItem = (id: string) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    saveItemsToStorage(updatedItems);
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    const updatedItems = items.filter(item => item.id !== id);
    
    setItems(updatedItems);
    saveItemsToStorage(updatedItems);
    
    if (itemToDelete) {
      toast({
        title: "Item removed",
        description: `${itemToDelete.name} has been removed from your shopping list.`,
      });
    }
  };

  const handleClearChecked = () => {
    const checkedCount = items.filter(item => item.checked).length;
    
    if (checkedCount === 0) {
      toast({
        title: "No items to clear",
        description: "There are no checked items to clear.",
      });
      return;
    }
    
    const updatedItems = items.filter(item => !item.checked);
    setItems(updatedItems);
    saveItemsToStorage(updatedItems);
    
    toast({
      title: "Checked items cleared",
      description: `${checkedCount} checked items have been removed.`,
    });
  };

  const handleClearAll = () => {
    if (items.length === 0) {
      toast({
        title: "No items to clear",
        description: "Your shopping list is already empty.",
      });
      return;
    }
    
    setItems([]);
    saveItemsToStorage([]);
    
    toast({
      title: "Shopping list cleared",
      description: "All items have been removed from your shopping list.",
    });
  };

  const handleExportToInstacart = () => {
    // In a real app, this would integrate with Instacart's API
    // For now, we'll just show a dialog with the items
    setShowInstacartDialog(true);
  };

  const handleSendToInstacart = () => {
    // In a real app, this would send the items to Instacart
    // For now, we'll just redirect to Instacart's website
    window.open("https://www.instacart.com", "_blank");
    setShowInstacartDialog(false);
    
    toast({
      title: "List sent to Instacart",
      description: "Your shopping list has been sent to Instacart.",
    });
  };

  const handleExportList = () => {
    // Create a text version of the shopping list
    const listText = groupedItems
      .map(group => {
        return `${group.category}:\n${group.items
          .map(item => `- ${item.name} (${item.quantity})`)
          .join('\n')}`;
      })
      .join('\n\n');
    
    // Create a blob and download it
    const blob = new Blob([listText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "List exported",
      description: "Your shopping list has been exported as a text file.",
    });
  };

  // Format current date
  const formatDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Shopping List</h1>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <Calendar className="h-3.5 w-3.5 mr-1" />
              {formatDate()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowChecked(!showChecked)}
              className="text-xs"
            >
              {showChecked ? "Hide Checked" : "Show Checked"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearChecked}
              className="text-xs"
            >
              <Trash className="h-3.5 w-3.5 mr-1" />
              Clear Checked
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearAll}
              className="text-xs text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear All
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleExportList}
              className="text-xs"
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Export List
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleExportToInstacart}
              className="text-xs"
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              Order on Instacart
            </Button>
          </div>
        </div>

        <form onSubmit={handleAddItem} className="grid grid-cols-12 gap-2">
          <div className="col-span-12 sm:col-span-5">
            <Input
              placeholder="Item name"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <Input
              placeholder="Quantity"
              value={newItemQuantity}
              onChange={(e) => setNewItemQuantity(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="col-span-6 sm:col-span-3">
            <select
              value={newItemCategory}
              onChange={(e) => setNewItemCategory(e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select category</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="col-span-12 sm:col-span-1">
            <Button type="submit" size="icon" className="w-full h-10">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </form>

        <div className="space-y-6">
          {groupedItems.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              Your shopping list is empty. Add some items!
            </div>
          ) : (
            groupedItems.map(group => (
              <div key={group.category} className="space-y-2">
                <h3 className="font-medium text-sm uppercase text-muted-foreground tracking-wide">
                  {group.category}
                </h3>
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  {group.items.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Separator />}
                      <ShoppingListItem
                        item={item}
                        onToggle={handleToggleItem}
                        onDelete={handleDeleteItem}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Instacart Integration Dialog */}
        <Dialog open={showInstacartDialog} onOpenChange={setShowInstacartDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Order on Instacart</DialogTitle>
              <DialogDescription>
                Review your shopping list before sending to Instacart
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {groupedItems.map(group => (
                <div key={group.category} className="space-y-2">
                  <h3 className="font-medium text-sm">{group.category}</h3>
                  <ul className="space-y-1">
                    {group.items.map(item => (
                      <li key={item.id} className="text-sm flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{item.name} ({item.quantity})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowInstacartDialog(false)}
                className="sm:order-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSendToInstacart}
                className="w-full sm:w-auto sm:order-2"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Send to Instacart
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tips Card */}
        <Card className="bg-accent/30 border-accent">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Shopping List Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>Use the meal planner to automatically calculate ingredients based on recipes and serving sizes.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>Check off items as you shop to keep track of what you've already picked up.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-4 w-4 text-primary mt-0.5" />
                <span>Export your list or send it directly to Instacart for convenient online ordering.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ShoppingList;
