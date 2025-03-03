
import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onChange: (category: string | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onChange,
}: CategoryFilterProps) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium mb-2">Categories</h3>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onChange(null)}
          className={cn(
            "py-1.5 px-3 text-sm rounded-full transition-all",
            selectedCategory === null
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          All
          {selectedCategory === null && (
            <Check className="ml-1 h-3.5 w-3.5 inline" />
          )}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onChange(category)}
            className={cn(
              "py-1.5 px-3 text-sm rounded-full transition-all",
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            )}
          >
            {category}
            {selectedCategory === category && (
              <Check className="ml-1 h-3.5 w-3.5 inline" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
