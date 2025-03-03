import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Book, Calendar, ShoppingCart, Search, Menu, X, ChevronRight, Home
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

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Recipes", href: "/recipes", icon: Book },
    { name: "Meal Planner", href: "/meal-planner", icon: Calendar },
    { name: "Shopping List", href: "/shopping-list", icon: ShoppingCart },
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-border bg-card">
          <SidebarHeader className="p-4">
            <div className="flex flex-col items-center px-2">
              <div className="w-12 h-12 rounded-full overflow-hidden mb-2">
                <img src="/chef-logo.jpg" alt="Chef logo" className="w-full h-full object-cover" />
              </div>
              <h1 className="text-2xl font-bold text-center">Hinchey's Recipes</h1>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-2 mt-4">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        location.pathname === item.href 
                          ? "bg-accent text-accent-foreground" 
                          : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                      {location.pathname === item.href && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center justify-center p-2">
              <span className="text-xs text-muted-foreground">
                Made with Lovable
              </span>
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
    </SidebarProvider>
  );
};

export default Layout;
