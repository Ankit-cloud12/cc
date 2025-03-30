import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CodeTranslationLayout from "./CodeTranslationLayout";
import { FileUploader } from "./shared/FileUploader";
import { HistoryManager, HistoryItem } from "./shared/HistoryManager";

interface Base64Options {
  urlSafe: boolean;
  padding: boolean;
  lineBreaks: boolean;
}

const Base64Converter = () => {
  // Basic state
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Advanced options
  const [options, setOptions] = useState<Base64Options>({
    urlSafe: false,
    padding: true,
    lineBreaks: false
  });
  
  // History feature
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Process the conversion when options change
  useEffect(() => {
    if (inputText) {
      processConversion();
    }
  }, [mode, options.urlSafe, options.padding, options.lineBreaks]);
  
  const processConversion = () => {
    if (!inputText) {
      setOutputText("");
      setError("");
      return;
    }
    
    setIsProcessing(true);
    setError("");
    
    try {
      let result = "";
      
      if (mode === "encode") {
        // Encode text to Base64
        result = window.btoa(unescape(encodeURIComponent(inputText)));
        
        // Apply URL-safe transformation if needed
        if (options.urlSafe) {
          result = result.replace(/\+/g, '-').replace(/\//g, '_');
        }
        
        // Remove padding if not desired
        if (!options.padding) {
          result = result.replace(/=+$/, '');
        }
        
        // Add line breaks every 76 characters if desired
        if (options.lineBreaks) {
          result = result.replace(/.{76}/g, '$&\n');
        }
      } else {
        // Pre-process input for decoding
        let input = inputText;
        
        // Handle URL-safe characters
        if (options.urlSafe) {
          input = input.replace(/-/g, '+').replace(/_/g, '/');
        }
        
        // Add padding if missing
        if (options.padding && input.length % 4 !== 0) {
          input += '='.repeat(4 - (input.length % 4));
        }
        
        // Remove line breaks
        input = input.replace(/\n/g, '');
        
        // Decode
        const decodedData = window.atob(input);
        result = decodeURIComponent(escape(decodedData));
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
        mode === "encode"
          ? "Error: Could not encode the text. Make sure it contains valid characters."
          : "Error: Invalid Base64 format. Please check your input."
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

  const handleModeChange = (value: "encode" | "decode") => {
    setMode(value);
    setError("");
    // Processing will be triggered by useEffect
  };
  
  const handleOptionChange = (key: keyof Base64Options, value: boolean) => {
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
      urlSafe: false,
      padding: true,
      lineBreaks: false
    });
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `base64-${mode === "encode" ? "encoded" : "decoded"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleFileContent = (content: string) => {
    setInputText(content);
    processConversion();
  };
  
  const handleHistoryItemSelect = (item: HistoryItem) => {
    setInputText(item.input);
    setOutputText(item.output);
    
    if (item.options) {
      const { mode: historyMode, ...historyOptions } = item.options as any;
      setMode(historyMode || "encode");
      setOptions({
        urlSafe: !!historyOptions.urlSafe,
        padding: historyOptions.padding !== false,
        lineBreaks: !!historyOptions.lineBreaks
      });
    }
  };
  
  const handleHistoryClear = () => {
    setHistory([]);
  };
  
  // About content
  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        Base64 is a binary-to-text encoding scheme that represents binary data
        using a set of 64 characters. It's commonly used when binary data needs
        to be stored or transferred over systems that are designed to handle
        text.
      </p>
      <p className="text-gray-300 mb-4">Common uses of Base64 include:</p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Email attachments (MIME)</li>
        <li>Storing complex data in XML or JSON</li>
        <li>Embedding image data directly in HTML or CSS</li>
        <li>Transferring data in URLs</li>
        <li>Storing binary data in databases that only support text</li>
      </ul>
      <p className="text-gray-300 mb-4">
        <span className="font-medium text-blue-400">Advanced Options:</span>
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li><span className="font-medium">URL-Safe:</span> Replaces + with - and / with _ to make the output safe for use in URLs.</li>
        <li><span className="font-medium">Padding:</span> Controls whether to include the = padding characters at the end of the encoded string.</li>
        <li><span className="font-medium">Line Breaks:</span> Inserts line breaks every 76 characters (useful for email and some legacy systems).</li>
      </ul>
      <p className="text-gray-300 mb-4">
        The encoding process converts every 3 bytes of binary data into 4
        ASCII characters, making it approximately 33% larger than the original
        data.
      </p>
    </>
  );

  return (
    <CodeTranslationLayout
      title="Base64 Encoder/Decoder"
      description="Convert text to Base64 encoding or decode Base64 back to text with advanced options."
      onProcess={processConversion}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      processButtonText={mode === "encode" ? "Encode" : "Decode"}
      copyButtonText="Copy Result"
      resetButtonText="Reset"
      copied={copied}
      result={outputText}
      error={error}
      isProcessing={isProcessing}
      toolHistory={history}
      onHistoryClear={handleHistoryClear}
      onHistoryItemSelect={handleHistoryItemSelect}
      themeColor="blue"
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
            <div className="mb-6">
              <RadioGroup
                value={mode}
                onValueChange={(value) => handleModeChange(value as "encode" | "decode")}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="encode" id="encode" />
                  <Label htmlFor="encode" className="text-gray-200">Encode to Base64</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="decode" id="decode" />
                  <Label htmlFor="decode" className="text-gray-200">Decode from Base64</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label className="text-gray-200 mb-2 block">Input</Label>
              <Textarea
                placeholder={
                  mode === "encode"
                    ? "Type or paste your text here to encode"
                    : "Type or paste Base64 encoded text here to decode"
                }
                className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 resize-y"
                value={inputText}
                onChange={handleInputChange}
              />
            </div>
            
            <div>
              <Label className="text-gray-200 mb-2 block">Output</Label>
              <Textarea
                readOnly
                className="min-h-[150px] bg-zinc-700 text-white border-zinc-600 resize-y"
                value={outputText}
                placeholder={
                  mode === "encode"
                    ? "Base64 encoded text will appear here"
                    : "Decoded text will appear here"
                }
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="file">
          <FileUploader 
            onFileContent={handleFileContent} 
            acceptedFormats=".txt,.json,.xml,.html,.js,.css,.md" 
            maxSizeMB={2}
            onError={setError}
          />
          
          {outputText && (
            <div className="mt-4">
              <Label className="text-gray-200 mb-2 block">Output</Label>
              <Textarea
                readOnly
                className="min-h-[150px] bg-zinc-700 text-white border-zinc-600 resize-y"
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
                    <Label htmlFor="url-safe" className="text-gray-200">URL-Safe Characters</Label>
                    <p className="text-xs text-gray-400">Replace + with - and / with _</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch 
                        id="url-safe" 
                        checked={options.urlSafe} 
                        onCheckedChange={(v) => handleOptionChange('urlSafe', v)} 
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                      <p>Makes output safe for URLs and filenames</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="padding" className="text-gray-200">Include Padding</Label>
                    <p className="text-xs text-gray-400">Add = characters at the end</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch 
                        id="padding" 
                        checked={options.padding} 
                        onCheckedChange={(v) => handleOptionChange('padding', v)} 
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                      <p>Standard Base64 uses = padding characters</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="line-breaks" className="text-gray-200">Insert Line Breaks</Label>
                    <p className="text-xs text-gray-400">Break lines every 76 characters</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Switch 
                        id="line-breaks" 
                        checked={options.lineBreaks} 
                        onCheckedChange={(v) => handleOptionChange('lineBreaks', v)} 
                      />
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                      <p>Used for email encoding (MIME)</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </Card>
          
          {outputText && (
            <div className="mt-4">
              <Label className="text-gray-200 mb-2 block">Output</Label>
              <Textarea
                readOnly
                className="min-h-[150px] bg-zinc-700 text-white border-zinc-600 resize-y"
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

export default Base64Converter;
