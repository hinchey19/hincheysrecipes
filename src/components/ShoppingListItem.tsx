import React, { useState } from "react";
import { Check, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ShoppingItemProps {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
  recipeId?: string;
  recipeName?: string;
  ingredient?: string;
}

interface ShoppingListItemProps {
  item: ShoppingItemProps;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ShoppingListItem = ({ 
  item, 
  onToggle, 
  onDelete 
}: ShoppingListItemProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "group flex items-center justify-between py-2 px-3 rounded-md transition-colors",
        item.checked ? "bg-accent/50" : "hover:bg-accent/20"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center space-x-3 flex-1">
        <Checkbox 
          checked={item.checked} 
          onCheckedChange={() => onToggle(item.id)}
          className={cn(
            "transition-all duration-300",
            item.checked && "bg-primary border-primary"
          )}
        />
        <div className="flex-1">
          <span 
            className={cn(
              "text-sm font-medium transition-all duration-200",
              item.checked && "line-through text-muted-foreground"
            )}
          >
            {item.name}
          </span>
          <div className="flex items-center mt-0.5 gap-2">
            <span className="text-xs text-muted-foreground">{item.quantity}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
            <span className="text-xs text-muted-foreground">{item.category}</span>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "h-8 w-8 opacity-0 transition-opacity duration-200",
          (isHovered || item.checked) && "opacity-100"
        )}
        onClick={() => onDelete(item.id)}
      >
        <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
      </Button>
    </div>
  );
};

export default ShoppingListItem;
