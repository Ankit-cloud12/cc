import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Drawer, 
  DrawerContent, 
  DrawerClose,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import menuConfig from "@/data/menu-config.json";
import { ChevronDown, X, Search } from "lucide-react";

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenSearch: () => void;
}

const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ 
  open, 
  onOpenChange,
  onOpenSearch
}) => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-zinc-800 text-white border-t border-zinc-700 max-h-[85vh]">
        <DrawerHeader className="border-b border-zinc-700 flex items-center justify-between">
          <DrawerTitle className="text-white text-xl">Menu</DrawerTitle>
          <DrawerClose asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 text-white hover:bg-zinc-700 rounded-full"
            >
              <X size={18} />
              <span className="sr-only">Close</span>
            </Button>
          </DrawerClose>
        </DrawerHeader>
        
        <div className="p-4 border-b border-zinc-700">
          <Button 
            variant="outline" 
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 flex items-center gap-2"
            onClick={() => {
              onOpenSearch();
              onOpenChange(false);
            }}
          >
            <Search size={16} />
            <span>Search tools...</span>
          </Button>
        </div>

        <div className="overflow-y-auto py-2 flex-1">
          <Accordion 
            type="multiple" 
            className="w-full"
            value={expandedCategories}
          >
            {menuConfig.categories.map((category, index) => (
              <AccordionItem 
                key={index} 
                value={category.name}
                className="border-b border-zinc-700"
              >
                <AccordionTrigger 
                  onClick={() => toggleCategory(category.name)}
                  className="px-4 py-3 text-white hover:bg-zinc-700 font-medium"
                >
                  {category.name}
                </AccordionTrigger>
                <AccordionContent className="bg-zinc-900">
                  {category.items.map((item, itemIndex) => (
                    <Link
                      key={itemIndex}
                      to={item.path}
                      className="block px-6 py-2.5 text-gray-300 hover:text-white hover:bg-zinc-700 text-sm"
                      onClick={handleLinkClick}
                    >
                      {item.name}
                    </Link>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <DrawerFooter className="border-t border-zinc-700 p-4">
          <div className="flex justify-center">
            <a 
              href="https://www.buymeacoffee.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button
                variant="outline"
                className="bg-[#FFDD00] hover:bg-[#FFCC00] text-black border-[#FFDD00] px-6"
              >
                Buy me a Coffee
              </Button>
            </a>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default MobileNavDrawer;
