import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface HistoryItem {
  id: string;
  input: string;
  output: string;
  timestamp: Date;
  options?: Record<string, any>;
}

interface HistoryManagerProps {
  history: HistoryItem[];
  onHistoryItemSelect: (item: HistoryItem) => void;
  onHistoryClear: () => void;
  maxHeight?: string;
  emptyMessage?: string;
}

export const HistoryManager: React.FC<HistoryManagerProps> = ({
  history,
  onHistoryItemSelect,
  onHistoryClear,
  maxHeight = "300px",
  emptyMessage = "No history yet. Your recent conversions will appear here."
}) => {
  if (history.length === 0) {
    return (
      <Card className="p-4 bg-zinc-800 border-zinc-700 text-center">
        <p className="text-gray-400 text-sm">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <Card className="bg-zinc-800 border-zinc-700 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-white">Conversion History</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onHistoryClear} 
          className="text-gray-300 hover:text-white hover:bg-zinc-700"
        >
          Clear All
        </Button>
      </div>
      
      <ScrollArea className={`pr-4 max-h-[${maxHeight}]`}>
        <div className="space-y-2">
          {history.map((item) => (
            <div 
              key={item.id}
              onClick={() => onHistoryItemSelect(item)}
              className="bg-zinc-900 hover:bg-zinc-700 p-3 rounded text-sm cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="text-gray-200 font-medium truncate max-w-[80%]">
                  {item.input.substring(0, 50)}{item.input.length > 50 ? '...' : ''}
                </div>
                <div className="text-gray-400 text-xs flex-shrink-0">
                  {new Date(item.timestamp).toLocaleString(undefined, {
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className="text-gray-400 text-xs truncate">
                {item.output.substring(0, 100)}{item.output.length > 100 ? '...' : ''}
              </div>
              
              {item.options && Object.keys(item.options).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {Object.entries(item.options).map(([key, value]) => (
                    <span 
                      key={key} 
                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-zinc-800 text-gray-300"
                    >
                      {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
