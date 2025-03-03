
import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { ShoppingListItem, ShoppingItemProps } from "@/components/ShoppingListItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Check } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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

  return (
    <Layout>
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">Shopping List</h1>
          <div className="flex items-center gap-2">
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
      </div>
    </Layout>
  );
};

export default ShoppingList;
