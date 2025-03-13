import React from "react";
import { Utensils } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinWheelTabProps {
  onClick: () => void;
  className?: string;
}

export const SpinWheelTab = ({ onClick, className }: SpinWheelTabProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed right-0 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-2 sm:p-3 rounded-l-md shadow-lg z-50 transition-all hover:right-1 spin-wheel-tab",
        className
      )}
      aria-label="What's for dinner?"
    >
      <div className="flex flex-col items-center">
        <Utensils className="h-5 w-5 sm:h-6 sm:w-6 mb-1 sm:mb-2" />
        <div className="writing-vertical text-[10px] sm:text-xs font-medium">
          What's for dinner?
        </div>
      </div>
      <style jsx>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
          transform: rotate(180deg);
        }
        
        @media (max-width: 640px) {
          .spin-wheel-tab {
            top: 60%;
            padding: 8px 6px;
          }
        }
      `}</style>
    </button>
  );
};

export default SpinWheelTab; 