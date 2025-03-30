import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface RandomGeneratorLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  onGenerate?: () => void;
  onCopy?: () => void;
  onDownload?: () => void;
  onReset?: () => void;
  generateButtonText?: string;
  copyButtonText?: string;
  downloadButtonText?: string;
  resetButtonText?: string;
  copied?: boolean;
  result?: string | string[] | number | number[] | null;
  aboutContent?: ReactNode;
  error?: string;
  isGenerating?: boolean;
  showGenerateButton?: boolean;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  showResetButton?: boolean;
  actionButtonsPosition?: 'top' | 'bottom' | 'both';
  additionalActions?: ReactNode;
}

const RandomGeneratorLayout: React.FC<RandomGeneratorLayoutProps> = ({
  title,
  description,
  children,
  onGenerate,
  onCopy,
  onDownload,
  onReset,
  generateButtonText = "Generate",
  copyButtonText = "Copy to Clipboard",
  downloadButtonText = "Download",
  resetButtonText = "Reset",
  copied = false,
  result,
  aboutContent,
  error,
  isGenerating = false,
  showGenerateButton = true,
  showCopyButton = true,
  showDownloadButton = true,
  showResetButton = true,
  actionButtonsPosition = 'bottom',
  additionalActions,
}) => {
  const renderActionButtons = () => (
    <div className="flex flex-wrap gap-2">
      {showGenerateButton && onGenerate && (
        <Button
          onClick={onGenerate}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : generateButtonText}
        </Button>
      )}
      
      {showCopyButton && onCopy && result && (
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={onCopy}
        >
          {copied ? "Copied!" : copyButtonText}
        </Button>
      )}
      
      {showDownloadButton && onDownload && result && (
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={onDownload}
        >
          {downloadButtonText}
        </Button>
      )}
      
      {showResetButton && onReset && (
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
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
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-300 mb-6">{description}</p>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {actionButtonsPosition === 'top' && renderActionButtons()}
      
      <div className="my-6">
        {children}
      </div>
      
      {actionButtonsPosition === 'bottom' || actionButtonsPosition === 'both' ? renderActionButtons() : null}

      {aboutContent && (
        <div className="mt-8 mb-12">
          <h2 className="text-xl font-bold mb-4">About {title}</h2>
          {aboutContent}
        </div>
      )}
    </div>
  );
};

export default RandomGeneratorLayout;
