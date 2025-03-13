import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Book, Calendar, ShoppingCart, Search, Menu, X, ChevronRight, Home, BookOpen
} from "lucide-react";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarTrigger, 
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SpinWheel } from "./SpinWheel";
import { SpinWheelTab } from "./SpinWheelTab";
import { mockRecipes } from "@/data/mockData";
import "../styles/spinwheel.css";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [spinWheelOpen, setSpinWheelOpen] = useState(false);
  const [spinWheelMinimized, setSpinWheelMinimized] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if this is the first visit to the site
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    // Check if we have a saved state for the spin wheel
    const savedSpinWheelState = localStorage.getItem('spinWheelState');
    
    if (!hasVisitedBefore) {
      // First visit ever - show the spin wheel
      setSpinWheelOpen(true);
      setSpinWheelMinimized(false);
      localStorage.setItem('hasVisitedBefore', 'true');
      localStorage.setItem('spinWheelState', 'open');
    } else if (savedSpinWheelState) {
      // We have a saved state - use it
      if (savedSpinWheelState === 'open') {
        setSpinWheelOpen(true);
        setSpinWheelMinimized(false);
      } else {
        setSpinWheelOpen(false);
        setSpinWheelMinimized(true);
      }
    } else {
      // Returning visitor with no saved state - show the minimized tab
      setSpinWheelOpen(false);
      setSpinWheelMinimized(true);
      localStorage.setItem('spinWheelState', 'minimized');
    }
  }, []);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Recipes", href: "/recipes", icon: BookOpen },
    { name: "Meal Planner", href: "/meal-planner", icon: Calendar },
    { name: "Shopping List", href: "/shopping-list", icon: ShoppingCart },
  ];

  const handleOpenSpinWheel = () => {
    setSpinWheelOpen(true);
    setSpinWheelMinimized(false);
    localStorage.setItem('spinWheelState', 'open');
  };

  const handleMinimizeSpinWheel = () => {
    setSpinWheelOpen(false);
    setSpinWheelMinimized(true);
    localStorage.setItem('spinWheelState', 'minimized');
  };
  
  // This function handles the state change for the spin wheel dialog
  const handleSpinWheelOpenChange = (open: boolean) => {
    // If the dialog is being closed, minimize it instead of fully closing
    if (!open) {
      handleMinimizeSpinWheel();
    } else {
      setSpinWheelOpen(true);
      localStorage.setItem('spinWheelState', 'open');
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="h-16 flex items-center px-6 border-b border-border">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Book className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">Hinchey's Recipes</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name} className={location.pathname === item.href ? "bg-accent" : ""}>
                  <Link to={item.href} className="flex items-center gap-3 px-3 py-2 rounded-md">
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                    {location.pathname === item.href && (
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    )}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground">
              Made with ❤️ by Hinchey
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="border-b border-border h-16 flex items-center justify-between px-6 bg-card/80 backdrop-blur-md">
            <div className="flex items-center">
              <SidebarTrigger>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SidebarTrigger>
              {mounted && isMobile && (
                <h1 className="text-lg font-medium ml-2">
                  {navigation.find(item => item.href === location.pathname)?.name || 'Home'}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container py-6 md:py-8 lg:py-10 animate-fade-in">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Spin Wheel Components */}
      {spinWheelMinimized && (
        <SpinWheelTab onClick={handleOpenSpinWheel} />
      )}
      
      <SpinWheel 
        recipes={mockRecipes}
        isOpen={spinWheelOpen}
        onOpenChange={handleSpinWheelOpenChange}
        onMinimize={handleMinimizeSpinWheel}
      />
    </SidebarProvider>
  );
};

export default Layout;
