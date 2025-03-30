import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface HistoryItem {
  id: string;
  input: string;
  output: string;
  timestamp: Date;
  options?: Record<string, any>;
}

interface CodeTranslationLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onProcess?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onReset?: () => void;
  processButtonText?: string;
  copyButtonText?: string;
  downloadButtonText?: string;
  resetButtonText?: string;
  copied?: boolean;
  result?: string | string[] | number | number[] | null;
  aboutContent?: ReactNode;
  error?: string;
  isProcessing?: boolean;
  showProcessButton?: boolean;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  showResetButton?: boolean;
  actionButtonsPosition?: 'top' | 'bottom' | 'both';
  additionalActions?: ReactNode;
  toolHistory?: HistoryItem[];
  onHistoryClear?: () => void;
  onHistoryItemSelect?: (item: HistoryItem) => void;
  themeColor?: string;
}

const CodeTranslationLayout: React.FC<CodeTranslationLayoutProps> = ({
  title,
  description,
  children,
  onProcess,
  onCopy,
  onDownload,
  onReset,
  processButtonText = "Process",
  copyButtonText = "Copy to Clipboard",
  downloadButtonText = "Download",
  resetButtonText = "Reset",
  copied = false,
  result,
  aboutContent,
  error,
  isProcessing = false,
  showProcessButton = true,
  showCopyButton = true,
  showDownloadButton = true,
  showResetButton = true,
  actionButtonsPosition = 'bottom',
  additionalActions,
  toolHistory,
  onHistoryClear,
  onHistoryItemSelect,
  themeColor = "blue", // Default theme color
}) => {
  // Primary color based on theme
  const getThemeClasses = () => {
    const themes = {
      blue: "bg-blue-600 hover:bg-blue-700",
      green: "bg-emerald-600 hover:bg-emerald-700",
      purple: "bg-purple-600 hover:bg-purple-700",
      amber: "bg-amber-600 hover:bg-amber-700",
      rose: "bg-rose-600 hover:bg-rose-700",
    };
    return themes[themeColor as keyof typeof themes] || themes.blue;
  };
  const renderActionButtons = () => (
    <div className="flex flex-wrap gap-2">
      {showProcessButton && onProcess && (
        <Button
          onClick={onProcess}
          className={`${getThemeClasses()} text-white font-medium shadow-sm`}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : processButtonText}
        </Button>
      )}
      
      {showCopyButton && onCopy && result && (
        <Button
          variant="outline"
          className="bg-zinc-800 hover:bg-zinc-700 text-gray-100 border-zinc-700 shadow-sm transition-colors"
          onClick={onCopy}
        >
          {copied ? "Copied!" : copyButtonText}
        </Button>
      )}
      
      {showDownloadButton && onDownload && result && (
        <Button
          variant="outline"
          className="bg-zinc-800 hover:bg-zinc-700 text-gray-100 border-zinc-700 shadow-sm transition-colors"
          onClick={onDownload}
        >
          {downloadButtonText}
        </Button>
      )}
      
      {showResetButton && onReset && (
        <Button
          variant="outline"
          className="bg-zinc-800 hover:bg-zinc-700 text-gray-100 border-zinc-700 shadow-sm transition-colors"
          onClick={onReset}
        >
          {resetButtonText}
        </Button>
      )}
      
      {additionalActions}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 text-white">{title}</h1>
      <p className="text-gray-200 mb-6">{description}</p>

      {error && (
        <div className="bg-red-900/60 border border-red-600 text-red-100 px-4 py-3 rounded mb-4 shadow-sm">
          {error}
        </div>
      )}

      {actionButtonsPosition === 'top' && renderActionButtons()}
      
      <div className="my-6">
        {children}
      </div>
      
      {actionButtonsPosition === 'bottom' || actionButtonsPosition === 'both' ? renderActionButtons() : null}

      {/* History Section */}
      {toolHistory && toolHistory.length > 0 && (
        <Card className="mt-8 bg-zinc-800 border-zinc-700 p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-white">History</h3>
            {onHistoryClear && (
              <Button variant="ghost" size="sm" onClick={onHistoryClear} 
                      className="text-gray-300 hover:text-white hover:bg-zinc-700">
                Clear History
              </Button>
            )}
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {toolHistory.map((item) => (
              <div 
                key={item.id}
                onClick={() => onHistoryItemSelect && onHistoryItemSelect(item)}
                className="bg-zinc-900 p-2 rounded text-sm cursor-pointer hover:bg-zinc-700 transition-colors"
              >
                <div className="text-gray-200 truncate">{item.input.substring(0, 50)}{item.input.length > 50 ? '...' : ''}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {new Date(item.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {aboutContent && (
        <div className="mt-8 mb-12">
          <h2 className="text-xl font-bold mb-4 text-white">About {title}</h2>
          {aboutContent}
        </div>
      )}
    </div>
  );
};

export default CodeTranslationLayout;
