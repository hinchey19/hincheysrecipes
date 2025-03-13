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
  const [spinWheelMinimized, setSpinWheelMinimized] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Check if we've already shown the spin wheel in this session
    const hasShownSpinWheelThisSession = sessionStorage.getItem('hasShownSpinWheelThisSession');
    
    if (!hasShownSpinWheelThisSession) {
      // First time in this session - show the spin wheel
      setSpinWheelOpen(true);
      setSpinWheelMinimized(false);
      // Mark that we've shown the spin wheel in this session
      sessionStorage.setItem('hasShownSpinWheelThisSession', 'true');
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
  };

  const handleMinimizeSpinWheel = () => {
    setSpinWheelOpen(false);
    setSpinWheelMinimized(true);
  };
  
  const handleSpinWheelOpenChange = (open: boolean) => {
    if (!open) {
      handleMinimizeSpinWheel();
    } else {
      setSpinWheelOpen(true);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="h-auto flex flex-col items-center px-6 py-4 border-b border-border">
            <Link to="/" className="flex flex-col items-center w-full">
              <div className="w-16 h-16 rounded-full overflow-hidden mb-2">
                <img 
                  src="https://t3.ftcdn.net/jpg/03/47/39/42/360_F_347394209_Wt66TsKLwVEqjJzxT1ub8tWLuNLTySnK.jpg" 
                  alt="Hinchey's Recipes Logo" 
                  className="w-full h-full object-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="text-center mt-2">
                <h1 className="font-bold text-2xl text-black">Hinchey's Recipes</h1>
              </div>
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
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img 
                      src="https://t3.ftcdn.net/jpg/03/47/39/42/360_F_347394209_Wt66TsKLwVEqjJzxT1ub8tWLuNLTySnK.jpg" 
                      alt="Hinchey's Recipes Logo" 
                      className="w-full h-full object-cover"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <h1 className="text-xl font-bold text-black">
                    Hinchey's Recipes
                  </h1>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <div className="container py-6 md:py-8 lg:py-10 px-4 md:px-6 lg:px-8 animate-fade-in">
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
