
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  className?: string;
  placeholder?: string;
}

export const SearchBar = ({
  onSearch,
  className,
  placeholder = "Search recipes..."
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    setQuery("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, onSearch]);

  return (
    <form 
      onSubmit={handleSearch}
      className={cn(
        "relative flex items-center transition-all group",
        isFocused ? "ring-2 ring-ring/20 rounded-lg" : "",
        className
      )}
    >
      <div className="absolute left-3 flex items-center pointer-events-none text-muted-foreground">
        <Search className="h-4 w-4" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "pl-9 pr-8 py-2 h-10 border border-input bg-background rounded-lg",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "transition-all duration-200"
        )}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {query && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7"
          onClick={handleClear}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      )}
    </form>
  );
};

export default SearchBar;
