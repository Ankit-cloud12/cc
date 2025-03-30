import { ReactNode, useState, useEffect } from "react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import useTheme from "@/hooks/useTheme";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import menuConfig from "@/data/menu-config.json";
import SearchDialog from "@/components/SearchDialog";
import MobileNavDrawer from "@/components/MobileNavDrawer";
import { Menu, Search } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  // Add keyboard shortcut to open search dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Open search dialog when "/" is pressed
      if (e.key === "/" && !searchOpen) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchOpen]);
  return (
    <div className="min-h-screen flex flex-col bg-zinc-800 text-white">
      <header className="bg-zinc-900 p-4">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-xl font-bold text-white mr-4">
              Convert Case
            </Link>
            <Menubar className="hidden md:flex border-zinc-700 bg-zinc-800 h-8 space-x-0">
              {menuConfig.categories.map((category, index) => (
                <MenubarMenu key={index}>
                  <MenubarTrigger className="text-white px-3 py-1 text-sm">
                    {category.name}
                  </MenubarTrigger>
                  <MenubarContent 
                    className="bg-zinc-800 border-zinc-700 min-w-[400px] max-h-[500px] overflow-y-auto"
                    align="start"
                    sideOffset={5}
                  >
                    {(category.name === "Text Modification/Formatting" || category.name === "Code & Data Translation") ? (
                      <div className="grid grid-cols-2 gap-1 p-1">
                        {(() => {
                          const midPoint = Math.ceil(category.items.length / 2);
                          const firstCol = category.items.slice(0, midPoint);
                          const secondCol = category.items.slice(midPoint);
                          
                          return (
                            <>
                              <div className="flex flex-col">
                                {firstCol.map((item, idx) => (
                                  <MenubarItem 
                                    key={`col1-${idx}`} 
                                    className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm focus:bg-zinc-700 focus:text-white"
                                    asChild
                                  >
                                    <Link to={item.path}>{item.name}</Link>
                                  </MenubarItem>
                                ))}
                              </div>
                              <div className="flex flex-col">
                                {secondCol.map((item, idx) => (
                                  <MenubarItem 
                                    key={`col2-${idx}`} 
                                    className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm focus:bg-zinc-700 focus:text-white"
                                    asChild
                                  >
                                    <Link to={item.path}>{item.name}</Link>
                                  </MenubarItem>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    ) : (
                      category.items.map((item, itemIndex) => (
                        <MenubarItem 
                          key={itemIndex} 
                          className="text-gray-300 hover:text-white hover:bg-zinc-700 text-sm focus:bg-zinc-700 focus:text-white"
                          asChild
                        >
                          <Link to={item.path}>{item.name}</Link>
                        </MenubarItem>
                      ))
                    )}
                  </MenubarContent>
                </MenubarMenu>
              ))}
            </Menubar>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-3">
              <ThemeSwitcher 
                value={theme as 'light' | 'dark' | 'system'} 
                onChange={setTheme} 
                className="bg-zinc-700 ring-zinc-600" 
              />
              <div
                className="bg-zinc-700 text-white px-3 py-1 rounded flex items-center gap-2 cursor-pointer"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={14} />
                <span>Search tools... (Press /)</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              className="text-white md:hidden flex items-center gap-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={18} />
              <span>Menu</span>
            </Button>
            <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
            <MobileNavDrawer 
              open={mobileMenuOpen} 
              onOpenChange={setMobileMenuOpen} 
              onOpenSearch={() => setSearchOpen(true)}
            />
          </div>
        </nav>
      </header>

      <main className="flex-1 container mx-auto p-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-zinc-900 p-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Convert Case. All rights reserved.
      </footer>
      <Toaster />
    </div>
  );
};

export default MainLayout;
