import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RecipeProps } from "@/components/RecipeCard";
import { cn } from "@/lib/utils";

// Declare global window property for TypeScript
declare global {
  interface Window {
    selectedRecipe: RecipeProps | null;
  }
}

interface SpinWheelProps {
  recipes: RecipeProps[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMinimize: () => void;
}

// Pink/Red theme colors for the wheel segments (alternating)
const SEGMENT_COLORS = [
  "#FF5252", // Bright red
  "#FF8A80", // Light pink
  "#FF5252", // Bright red
  "#FF8A80", // Light pink
  "#FF5252", // Bright red
  "#FF8A80", // Light pink
];

// Categories to exclude from the spin wheel
const EXCLUDED_CATEGORIES = ["Dessert", "Beverage", "Appetizer", "dessert", "beverage", "appetizer"];

// Store the selected recipe in localStorage to persist between sessions
const saveSelectedRecipe = (recipe: RecipeProps | null) => {
  if (recipe) {
    localStorage.setItem('selectedRecipe', JSON.stringify(recipe));
  }
};

// Get the selected recipe from localStorage
const getSelectedRecipe = (): RecipeProps | null => {
  const savedRecipe = localStorage.getItem('selectedRecipe');
  if (savedRecipe) {
    try {
      return JSON.parse(savedRecipe);
    } catch (e) {
      return null;
    }
  }
  return null;
};

// Simple confetti component
const Confetti = () => {
  const [pieces, setPieces] = useState<React.ReactNode[]>([]);
  
  useEffect(() => {
    const confettiPieces = [];
    const colors = ['#FF5252', '#FF9800', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0'];
    
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = Math.random() * 10 + 5;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const animationDuration = Math.random() * 3 + 2;
      const rotation = Math.random() * 360;
      
      confettiPieces.push(
        <div
          key={i}
          className="absolute rounded-sm"
          style={{
            left: `${left}%`,
            top: `${top}%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            transform: `rotate(${rotation}deg)`,
            animation: `fall ${animationDuration}s linear forwards`,
            opacity: 0,
          }}
        />
      );
    }
    
    setPieces(confettiPieces);
    
    // Clean up animation after it's done
    const timer = setTimeout(() => {
      setPieces([]);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {pieces}
    </div>
  );
};

export const SpinWheel = ({ recipes, isOpen, onOpenChange, onMinimize }: SpinWheelProps) => {
  const navigate = useNavigate();
  const [spinning, setSpinning] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<RecipeProps | null>(null);
  const [rotation, setRotation] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [arrowRotation, setArrowRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);
  
  // Filter recipes to include only those with valid IDs and titles
  // Also filter out desserts, beverages, and appetizers
  const validRecipes = recipes.filter(recipe => 
    recipe.id && 
    recipe.title && 
    recipe.image && 
    (!recipe.category || !EXCLUDED_CATEGORIES.includes(recipe.category))
  );
  
  // Calculate the angle for each recipe segment
  const segmentAngle = 360 / validRecipes.length;
  
  // When the component mounts or isOpen changes, update the rotation to match the selected recipe
  useEffect(() => {
    if (isOpen && selectedRecipe && !spinning) {
      // Find the index of the selected recipe
      const selectedIndex = validRecipes.findIndex(recipe => recipe.id === selectedRecipe.id);
      if (selectedIndex !== -1) {
        // Calculate the rotation needed to show this recipe at the top
        const selectedSegmentMiddle = (validRecipes.length - 1 - selectedIndex) * segmentAngle + (segmentAngle / 2);
        setArrowRotation(selectedSegmentMiddle);
      }
    }
  }, [isOpen, selectedRecipe, validRecipes, segmentAngle, spinning]);
  
  const spinWheel = () => {
    if (spinning || validRecipes.length === 0) return;
    
    setSpinning(true);
    setSelectedRecipe(null);
    setShowConfetti(false);
    
    // Generate a random number of rotations (3-5 full rotations)
    const rotations = 3 + Math.random() * 2;
    
    // Generate a random angle for the final position
    const randomAngle = Math.floor(Math.random() * 360);
    
    // Calculate the total rotation
    const newRotation = rotation + (rotations * 360) + randomAngle;
    setRotation(newRotation);
    
    // Calculate which recipe is selected based on the final position
    setTimeout(() => {
      const normalizedAngle = newRotation % 360;
      // Adjust the index calculation to match the visual order
      const selectedIndex = validRecipes.length - 1 - Math.floor(normalizedAngle / segmentAngle);
      const selectedRecipe = validRecipes[selectedIndex];
      setSelectedRecipe(selectedRecipe);
      
      // Save the selected recipe to localStorage
      saveSelectedRecipe(selectedRecipe);
      
      // Calculate the arrow rotation to point to the selected recipe
      // The arrow should point to the opposite of where the segment is
      const selectedSegmentMiddle = normalizedAngle + (segmentAngle / 2);
      setArrowRotation(selectedSegmentMiddle);
      
      setSpinning(false);
      setShowConfetti(true);
    }, 3000); // Match this with the CSS transition duration
  };
  
  const viewRecipe = () => {
    if (selectedRecipe) {
      navigate(`/recipe/${selectedRecipe.id}`);
      onOpenChange(false);
    }
  };
  
  // Prevent closing when clicking inside the dialog
  const handleDialogClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Handle the minimize button click
  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onMinimize();
  };
  
  // Export the selected recipe for other components to use
  useEffect(() => {
    // Make the selected recipe available globally
    window.selectedRecipe = selectedRecipe;
  }, [selectedRecipe]);
  
  return (
    <>
      {showConfetti && <Confetti />}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent 
          className="sm:max-w-xl max-h-[90vh] overflow-visible" 
          style={{ 
            background: '#FFF9C4',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
            width: '36rem',
            maxWidth: '90vw'
          }} 
          hideCloseButton={true}
          onClick={handleDialogClick}
          onPointerDownOutside={(e) => {
            e.preventDefault();
          }}
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-4xl font-bold text-pink-500 mb-4">What's for Dinner?</DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-4 top-4 text-pink-500 hover:bg-yellow-100"
              onClick={handleMinimize}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-4">
            <div className="relative w-[400px] h-[400px] mb-8" onClick={(e) => e.stopPropagation()}>
              {/* Spinner arrow */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 -mt-6 z-10 transition-transform duration-300"
                style={{ transform: `translate(-50%, 0) rotate(${arrowRotation}deg)` }}
              >
                <div className="w-6 h-8 relative">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 
                    border-l-[12px] border-r-[12px] border-t-[16px] 
                    border-transparent border-t-pink-500">
                  </div>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-pink-500"></div>
                </div>
              </div>
              
              {/* Center circle - now clickable */}
              <button 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-white border-4 border-pink-500 z-10 flex items-center justify-center shadow-lg go-button-pulse cursor-pointer hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  spinWheel();
                }}
                disabled={spinning || validRecipes.length === 0}
              >
                <div className="text-2xl font-bold text-pink-500">{spinning ? "..." : "GO!"}</div>
              </button>
              
              {/* Wheel */}
              <div 
                ref={wheelRef}
                className="w-full h-full rounded-full overflow-hidden border-8 border-white relative spin-wheel"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  transition: 'transform 3s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {validRecipes.map((recipe, index) => {
                  const startAngle = index * segmentAngle;
                  const endAngle = (index + 1) * segmentAngle;
                  const colorIndex = index % SEGMENT_COLORS.length;
                  
                  // Calculate the middle angle for image positioning
                  const midAngle = startAngle + (segmentAngle/2);
                  
                  // Calculate position for the image - moved further from center
                  const imageRadius = 170; // Increased distance from center
                  const imageX = imageRadius * Math.cos(midAngle * Math.PI / 180);
                  const imageY = imageRadius * Math.sin(midAngle * Math.PI / 180);
                  
                  return (
                    <div 
                      key={recipe.id}
                      className="absolute top-0 left-0 w-full h-full origin-center"
                      style={{
                        clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(startAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(startAngle * Math.PI / 180)}%, ${50 + 50 * Math.cos(endAngle * Math.PI / 180)}% ${50 + 50 * Math.sin(endAngle * Math.PI / 180)}%)`,
                        backgroundColor: SEGMENT_COLORS[colorIndex],
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Segment divider line */}
                      <div 
                        className="absolute top-0 left-1/2 h-1/2 w-1 bg-white origin-bottom"
                        style={{ transform: `rotate(${startAngle}deg)` }}
                      ></div>
                      
                      {/* Recipe image */}
                      <div 
                        className="absolute"
                        style={{
                          left: `calc(50% + ${imageX * 0.8}px)`,
                          top: `calc(50% + ${imageY * 0.8}px)`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 5,
                        }}
                      >
                        <div 
                          className="recipe-image-container"
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '2px solid white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          }}
                        >
                          <img 
                            src={recipe.image} 
                            alt={recipe.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="space-y-4 w-full" onClick={(e) => e.stopPropagation()}>
              {selectedRecipe && (
                <div className="p-6 border-2 rounded-lg bg-white border-pink-200 shadow-md">
                  <h3 className="font-medium mb-2 text-gray-700">Tonight's dinner:</h3>
                  <p className="text-xl font-bold mb-3 text-pink-600">{selectedRecipe.title}</p>
                  <Button 
                    variant="outline" 
                    className="w-full flex items-center justify-center bg-white hover:bg-pink-50 border-pink-300 text-pink-600" 
                    onClick={(e) => {
                      e.stopPropagation();
                      viewRecipe();
                    }}
                  >
                    View Recipe <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SpinWheel;