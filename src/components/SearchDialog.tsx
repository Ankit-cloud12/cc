import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "./SearchIcon";
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem,
  CommandSeparator,
  CommandShortcut
} from "@/components/ui/command";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import menuConfig from "@/data/menu-config.json";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ToolItem {
  name: string;
  path: string;
  category: string;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allTools, setAllTools] = useState<ToolItem[]>([]);

  // Process menu config to flat list with category info
  useEffect(() => {
    const tools: ToolItem[] = [];
    menuConfig.categories.forEach(category => {
      category.items.forEach(item => {
        tools.push({
          ...item,
          category: category.name
        });
      });
    });
    setAllTools(tools);
  }, []);

  // Filter tools based on search query
  const filteredTools = searchQuery.trim() === "" 
    ? allTools 
    : allTools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Check if device is mobile
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Group tools by category
  const groupedTools = filteredTools.reduce<Record<string, ToolItem[]>>((acc, tool) => {
    if (!acc[tool.category]) {
      acc[tool.category] = [];
    }
    acc[tool.category].push(tool);
    return acc;
  }, {});

  // Handle selection
  const handleSelect = useCallback((path: string) => {
    navigate(path);
    onOpenChange(false);
  }, [navigate, onOpenChange]);

  // Clear search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <CommandDialog 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <div className={isMobile ? "w-full max-w-full" : ""}>
      <CommandInput 
        placeholder="Search tools..." 
        value={searchQuery}
        onValueChange={setSearchQuery}
        className={isMobile ? "h-12" : ""}
      />
      <CommandList className={isMobile ? "max-h-[60vh]" : ""}>
        <CommandEmpty>No tools found.</CommandEmpty>
        {filteredTools.length === 0 && searchQuery.trim() === "" && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Type to search for tools...
          </div>
        )}
        
        {Object.entries(groupedTools).map(([category, tools], index, array) => (
          <React.Fragment key={category}>
            <CommandGroup heading={category}>
              {tools.map(tool => (
                <CommandItem
                  key={tool.path}
                  onSelect={() => handleSelect(tool.path)}
                  className={`cursor-pointer ${isMobile ? "py-3" : ""}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <SearchIcon category={tool.category} />
                      <span className={isMobile ? "text-base" : ""}>
                        {tool.name}
                      </span>
                    </div>
                    {!isMobile && <CommandShortcut>↩</CommandShortcut>}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {index < array.length - 1 && <CommandSeparator />}
          </React.Fragment>
        ))}
      </CommandList>
      </div>
    </CommandDialog>
  );
};

export default SearchDialog;
