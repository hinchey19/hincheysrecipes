import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { ShoppingListItem, ShoppingItemProps } from "@/components/ShoppingListItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Check, ShoppingCart, Download, Share } from "lucide-react";
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
  const [items, setItems] = useState<ShoppingItemProps[]>(initialItems);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [showChecked, setShowChecked] = useState(true);
  const [showInstacartDialog, setShowInstacartDialog] = useState(false);

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

    setItems(prevItems => [...prevItems, newItem]);
    setNewItemName("");
    setNewItemQuantity("");
    
    toast({
      title: "Item added",
      description: `${newItem.name} has been added to your shopping list.`,
    });
  };

  const handleToggleItem = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleDeleteItem = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    
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
    
    setItems(prevItems => prevItems.filter(item => !item.checked));
    
    toast({
      title: "Checked items cleared",
      description: `${checkedCount} checked items have been removed.`,
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

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Shopping List</h1>
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
