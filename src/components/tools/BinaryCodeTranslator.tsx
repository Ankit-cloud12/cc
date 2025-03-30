import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CodeTranslationLayout from "./CodeTranslationLayout";
import { FileUploader } from "./shared/FileUploader";
import { HistoryManager, HistoryItem } from "./shared/HistoryManager";

interface BinaryOptions {
  spaceBetweenBytes: boolean;
  bytePadding: boolean;
  removeNonBinary: boolean;
}

const BinaryCodeTranslator = () => {
  // Basic state
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"textToBinary" | "binaryToText">("textToBinary");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Advanced options
  const [options, setOptions] = useState<BinaryOptions>({
    spaceBetweenBytes: true,
    bytePadding: true,
    removeNonBinary: true
  });
  
  // History feature
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Process the translation when options change
  useEffect(() => {
    if (inputText) {
      processTranslation();
    }
  }, [mode, options.spaceBetweenBytes, options.bytePadding, options.removeNonBinary]);
  
  const processTranslation = () => {
    if (!inputText) {
      setOutputText("");
      setError("");
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      let result = "";
      
      if (mode === "textToBinary") {
        // Convert text to binary
        result = inputText
          .split("")
          .map((char) => {
            const binary = char.charCodeAt(0).toString(2);
            // Apply byte padding if option is enabled
            return options.bytePadding ? binary.padStart(8, "0") : binary;
          })
          .join(options.spaceBetweenBytes ? " " : "");
      } else {
        // Convert binary to text
        // Clean input if the option is enabled
        let processedInput = inputText;
        
        if (options.removeNonBinary) {
          const cleanedInput = inputText.replace(/[^01\s]/g, "");
          if (cleanedInput !== inputText) {
            setError("Warning: Non-binary characters were removed from your input.");
          }
          processedInput = cleanedInput;
        }
        
        // Split by spaces or process as continuous string
        const binaryGroups = options.spaceBetweenBytes 
          ? processedInput.split(/\s+/)
          : processedInput.match(/.{1,8}/g) || [];
        
        result = binaryGroups
          .filter(bin => bin.length > 0) // Filter out empty strings
          .map(bin => {
            try {
              return String.fromCharCode(parseInt(bin, 2));
            } catch (e) {
              // Handle invalid binary gracefully
              return '?';
            }
          })
          .join("");
      }
      
      setOutputText(result);
      
      // Add to history (only if there's a result and it's different from last entry)
      if (result && (!history.length || history[0].input !== inputText || history[0].output !== result)) {
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          input: inputText,
          output: result,
          timestamp: new Date(),
          options: {
            mode,
            ...options
          }
        };
        
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // Keep last 20 items
      }
    } catch (err) {
      setError(
        mode === "textToBinary"
          ? "Error: Could not convert text to binary. Please check your input."
          : "Error: Invalid binary format. Please check your input."
      );
      setOutputText("");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
  };

  const handleModeChange = (value: "textToBinary" | "binaryToText") => {
    setMode(value);
    setError("");
    // Processing will be triggered by useEffect
  };
  
  const handleOptionChange = (key: keyof BinaryOptions, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
    // Processing will be triggered by useEffect
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setError("");
    setOptions({
      spaceBetweenBytes: true,
      bytePadding: true,
      removeNonBinary: true
    });
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `binary-${mode === "textToBinary" ? "encoded" : "decoded"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleFileContent = (content: string) => {
    setInputText(content);
    processTranslation();
  };
  
  const handleHistoryItemSelect = (item: HistoryItem) => {
    setInputText(item.input);
    setOutputText(item.output);
    
    if (item.options) {
      const { mode: historyMode, ...historyOptions } = item.options as any;
      setMode(historyMode || "textToBinary");
      setOptions({
        spaceBetweenBytes: !!historyOptions.spaceBetweenBytes,
        bytePadding: historyOptions.bytePadding !== false,
        removeNonBinary: historyOptions.removeNonBinary !== false
      });
    }
  };
  
  const handleHistoryClear = () => {
    setHistory([]);
  };
  
  const handleSwapDirection = () => {
    // Swap the input and output
    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
    
    // Also swap the direction
    setMode(mode === "textToBinary" ? "binaryToText" : "textToBinary");
  };
  
  // About content
  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        Binary code is a way of representing text or computer processor
        instructions using a two-symbol system, typically using 0 and 1. In this translator,
        each character is converted to its ASCII value and then to binary.
      </p>
      <p className="text-gray-300 mb-4">
        Each character in the ASCII standard is represented by 8 bits (a byte) of binary code.
        For example, the letter "A" is represented as 01000001 in binary.
      </p>
      <p className="text-gray-300 mb-4">
        <span className="font-medium text-blue-400">Advanced Options:</span>
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>
          <span className="font-medium">Space Between Bytes:</span> Adds a space between each 8-bit binary grouping for
          better readability, e.g., "01000001 01000010" instead of "0100000101000010".
        </li>
        <li>
          <span className="font-medium">Byte Padding:</span> Ensures each byte is represented with a full 8 bits by
          adding leading zeros if needed. For example, "1000001" becomes "01000001".
        </li>
        <li>
          <span className="font-medium">Remove Non-Binary:</span> When decoding, automatically removes any characters
          that aren't 0s, 1s, or spaces to help fix common input errors.
        </li>
      </ul>
      <p className="text-gray-300">
        Binary is the foundation of all digital data, and understanding it provides insights
        into how computers fundamentally process and store information.
      </p>
    </>
  );

  return (
    <CodeTranslationLayout
      title="Binary Code Translator"
      description="Convert text to binary code or translate binary code back to text with advanced options."
      onProcess={processTranslation}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      processButtonText={mode === "textToBinary" ? "Convert to Binary" : "Convert to Text"}
      copyButtonText="Copy Result"
      resetButtonText="Reset"
      copied={copied}
      result={outputText}
      error={error}
      isProcessing={isProcessing}
      toolHistory={history}
      onHistoryClear={handleHistoryClear}
      onHistoryItemSelect={handleHistoryItemSelect}
      themeColor="purple"
    >
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="w-full bg-zinc-800 text-gray-200 border-b border-zinc-700">
          <TabsTrigger 
            value="text" 
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            Text Input
          </TabsTrigger>
          <TabsTrigger 
            value="file" 
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            File Upload
          </TabsTrigger>
          <TabsTrigger 
            value="options" 
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            Options
          </TabsTrigger>
          <TabsTrigger 
            value="history" 
            className="data-[state=active]:bg-zinc-700 data-[state=active]:text-white"
          >
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <RadioGroup
                value={mode}
                onValueChange={(value) => handleModeChange(value as "textToBinary" | "binaryToText")}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="textToBinary" id="textToBinary" />
                  <Label htmlFor="textToBinary" className="text-gray-200">Text to Binary</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="binaryToText" id="binaryToText" />
                  <Label htmlFor="binaryToText" className="text-gray-200">Binary to Text</Label>
                </div>
              </RadioGroup>
              
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                onClick={handleSwapDirection}
              >
                ↔ Swap Direction
              </Button>
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <Label className="text-gray-200 mb-2 block">Input</Label>
                <Textarea
                  placeholder={
                    mode === "textToBinary"
                      ? "Type or paste your text here to convert to binary"
                      : "Type or paste binary code here to convert to text"
                  }
                  className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 resize"
                  value={inputText}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="w-full md:w-1/2 flex flex-col">
                <Label className="text-gray-200 mb-2 block">Output</Label>
                <Textarea
                  readOnly
                  className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 resize"
                  value={outputText}
                  placeholder={
                    mode === "textToBinary"
                      ? "Binary code will appear here"
                      : "Decoded text will appear here"
                  }
                />
                
                <div className="flex justify-between mt-2">
                  <Button 
                    variant="outline" 
                    className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                    onClick={handleCopy}
                    disabled={!outputText}
                  >
                    {copied ? "Copied!" : "Copy Result"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="file">
          <FileUploader 
            onFileContent={handleFileContent} 
            acceptedFormats={mode === "textToBinary" ? ".txt,.json,.xml,.html,.js,.css,.md" : ".bin,.txt"}
            maxSizeMB={2}
            onError={setError}
          />
          
          {outputText && (
            <div className="mt-4">
              <Label className="text-gray-200 mb-2 block">Output</Label>
              <Textarea
                readOnly
                className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 resize"
                value={outputText}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="options">
          <Card className="bg-zinc-800 border-zinc-700 p-4">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Advanced Options</h3>
            
            <div className="space-y-4">
              <TooltipProvider>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="space-between" className="text-gray-200">Space Between Bytes</Label>
                    <p className="text-xs text-gray-400">Add spaces between 8-bit groups</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch 
                        id="space-between" 
                        checked={options.spaceBetweenBytes} 
                        onCheckedChange={(v) => handleOptionChange('spaceBetweenBytes', v)} 
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                      <p>Makes output more readable</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="byte-padding" className="text-gray-200">Byte Padding</Label>
                    <p className="text-xs text-gray-400">Ensure each byte is 8 bits</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch 
                        id="byte-padding" 
                        checked={options.bytePadding} 
                        onCheckedChange={(v) => handleOptionChange('bytePadding', v)} 
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                      <p>Adds leading zeros as needed</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                {mode === "binaryToText" && (
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="remove-non-binary" className="text-gray-200">Remove Non-Binary</Label>
                      <p className="text-xs text-gray-400">Remove any characters that aren't 0, 1, or spaces</p>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Switch 
                          id="remove-non-binary" 
                          checked={options.removeNonBinary} 
                          onCheckedChange={(v) => handleOptionChange('removeNonBinary', v)} 
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                        <p>Helps fix common input errors</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                )}
              </TooltipProvider>
            </div>
          </Card>
          
          {outputText && (
            <div className="mt-4">
              <Label className="text-gray-200 mb-2 block">Output</Label>
              <Textarea
                readOnly
                className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 resize"
                value={outputText}
              />
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          <HistoryManager
            history={history}
            onHistoryItemSelect={handleHistoryItemSelect}
            onHistoryClear={handleHistoryClear}
          />
        </TabsContent>
      </Tabs>
    </CodeTranslationLayout>
  );
};

export default BinaryCodeTranslator;
