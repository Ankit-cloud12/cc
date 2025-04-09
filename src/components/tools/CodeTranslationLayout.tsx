import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

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
  outputContent?: ReactNode; // New prop for custom output area
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
  outputContent, // Destructure new prop
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:flex flex-wrap gap-2">
      {showProcessButton && onProcess && (
        <Button
          onClick={onProcess}
          className={`${getThemeClasses()} text-white font-medium shadow h-10 px-4 text-sm disabled:opacity-50`}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : processButtonText}
        </Button>
      )}
      
      {showCopyButton && onCopy && result && (
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-gray-100 border-zinc-600 shadow transition-colors h-10 px-4 text-sm"
          onClick={onCopy}
        >
          {copied ? "Copied!" : copyButtonText}
        </Button>
      )}
      
      {showDownloadButton && onDownload && result && (
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-gray-100 border-zinc-600 shadow transition-colors h-10 px-4 text-sm"
          onClick={onDownload}
        >
          {downloadButtonText}
        </Button>
      )}
      
      {showResetButton && onReset && (
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-gray-100 border-zinc-600 shadow transition-colors h-10 px-4 text-sm"
          onClick={onReset}
        >
          {resetButtonText}
        </Button>
      )}
      
      {additionalActions}
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-white">{title}</h1>
      <p className="text-gray-300 mb-6 text-base sm:text-sm">{description}</p>

      {error && (
        <div className="bg-red-900/60 border border-red-600 text-red-100 px-4 py-3 rounded mb-4 shadow-sm">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div className="w-full space-y-4">
          {actionButtonsPosition === 'top' && renderActionButtons()}
          {children}
        </div>

        {/* Output Section (Right Column) */}
        <div className="w-full space-y-4">
          {outputContent ? ( // Render custom output if provided
            outputContent
          ) : result ? ( // Otherwise, render default result area if result exists
            <Textarea
              readOnly
              value={typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
              className="w-full min-h-[200px] md:min-h-[424px] bg-zinc-700 text-white border-zinc-600 rounded resize-none font-mono" // Use Textarea for consistency
              placeholder="Output will appear here"
            />
          ) : null} {/* Remove the placeholder div entirely */}
          {actionButtonsPosition === 'bottom' || actionButtonsPosition === 'both' ? renderActionButtons() : null}
        </div>
      </div>

      {/* History Section */}
      {/* History Section */}
      {toolHistory && toolHistory.length > 0 && (
        <div className="mt-8">
          <Card className="bg-zinc-700 border-zinc-600 overflow-hidden rounded-lg">
            <div className="p-4 border-b border-zinc-600">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">History</h3>
                {onHistoryClear && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onHistoryClear}
                    className="text-gray-300 hover:text-white hover:bg-zinc-600"
                  >
                    Clear History
                  </Button>
                )}
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-2 max-h-[70vh] sm:max-h-60 overflow-y-auto">
                {toolHistory.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onHistoryItemSelect && onHistoryItemSelect(item)}
                    className="bg-zinc-800 p-3 rounded-lg text-base sm:text-sm cursor-pointer hover:bg-zinc-600 active:bg-zinc-500 transition-colors"
                  >
                    <div className="text-gray-200 truncate">{item.input.substring(0, 50)}{item.input.length > 50 ? '...' : ''}</div>
                    <div className="text-gray-400 text-xs mt-1">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* About Section */}
      {aboutContent && (
        <div className="mt-8">
          <Card className="bg-zinc-700 border-zinc-600 overflow-hidden rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 text-white">About {title}</h2>
              <div className="text-gray-300 space-y-4">
                {aboutContent}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CodeTranslationLayout;
