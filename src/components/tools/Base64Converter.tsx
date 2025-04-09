import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ToolLayout } from "./ToolLayout"; 
import { FileUploader } from "./shared/FileUploader";
import { HistoryManager, HistoryItem } from "./shared/HistoryManager";
import { Copy, Check, Download, Trash2, RotateCcw } from "lucide-react"; 
import { ScrollArea } from "@/components/ui/scroll-area"; 

interface Base64Options {
  urlSafe: boolean;
  padding: boolean;
  lineBreaks: boolean;
}

// Function to check if a string is likely Base64
const isBase64 = (str: string): boolean => {
  if (!str || str.length === 0) {
     return false; 
  }
  const base64Regex = /^[A-Za-z0-9+/_-]*={0,2}$/; 
  return base64Regex.test(str.replace(/\s/g, '')); 
};

// Define About content
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Base64 Encoder/Decoder</h3>
    <p className="text-gray-300 mb-4">
      Base64 is a binary-to-text encoding scheme that represents binary data
      using a set of 64 ASCII characters. It's commonly used when binary data needs
      to be stored or transferred over systems designed primarily for text.
    </p>
    <p className="text-gray-300 mb-4">Common uses include:</p>
    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
      <li>Email attachments (MIME)</li>
      <li>Storing complex data in XML or JSON</li>
      <li>Embedding image data directly in HTML or CSS (Data URIs)</li>
      <li>Transferring data in URLs (using the URL-safe variant)</li>
      <li>Basic data obfuscation (though not encryption)</li>
    </ul>
    <p className="text-gray-300">
      This tool automatically detects whether your input is plain text (for encoding) or Base64 (for decoding) and performs the conversion instantly. You can also adjust advanced options like URL-safe characters, padding, and line breaks.
    </p>
  </>
);

// Define Options content
const optionsContent = (options: Base64Options, handleOptionChange: (key: keyof Base64Options, value: boolean) => void) => (
   <Card className="bg-zinc-800 border-zinc-700 p-4">
     {/* ... (options content remains the same) ... */}
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
                 className="data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white border-zinc-400"
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
             <p className="text-xs text-gray-400">Add = characters at the end if needed</p>
           </div>
           <Tooltip>
             <TooltipTrigger asChild>
               <Switch 
                 id="padding" 
                 checked={options.padding} 
                 onCheckedChange={(v) => handleOptionChange('padding', v)} 
                 className="data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white border-zinc-400"
               />
             </TooltipTrigger>
             <TooltipContent className="bg-zinc-800 text-gray-200 border-zinc-700">
               <p>Standard Base64 uses = padding characters</p>
             </TooltipContent>
           </Tooltip>
         </div>
         <div className="flex items-center justify-between">
           <div className="space-y-0.5">
             <Label htmlFor="line-breaks" className="text-gray-200">Insert Line Breaks (Encode Only)</Label>
             <p className="text-xs text-gray-400">Break lines every 76 characters</p>
           </div>
           <Tooltip>
             <TooltipTrigger asChild>
               <Switch 
                 id="line-breaks" 
                 checked={options.lineBreaks} 
                 onCheckedChange={(v) => handleOptionChange('lineBreaks', v)} 
                 className="data-[state=checked]:bg-emerald-500 data-[state=checked]:text-white border-zinc-400"
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
);


const Base64Converter = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [detectedMode, setDetectedMode] = useState<"encode" | "decode">("encode"); 
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); 
  const [activeInfoTab, setActiveInfoTab] = useState("about"); // For bottom About tab
  const [activeControlTab, setActiveControlTab] = useState("input"); // Default to input tab

  const [options, setOptions] = useState<Base64Options>({
    urlSafe: false,
    padding: true,
    lineBreaks: false
  });
  
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Stats (keep state but don't display card)
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  
  // Add a state to show what conversion is being performed
  const [conversionType, setConversionType] = useState<string>("");

  useEffect(() => {
    processAutoConversion();
    updateStats(inputText);
  }, [inputText, options]); 

  // Improved Base64 detection function
  const isBase64 = (str: string): boolean => {
    if (!str || str.length === 0) {
      return false; 
    }
    
    // Remove whitespace
    const cleanStr = str.replace(/\s/g, '');
    
    // Base64 should have a length divisible by 4 (with padding)
    // And match the valid character set
    const base64Regex = /^[A-Za-z0-9+/\-_]*={0,2}$/;
    
    // Additional check - if it's very short, it might be text that coincidentally matches
    if (cleanStr.length < 8) {
      return false;
    }
    
    return base64Regex.test(cleanStr);
  };

  const processAutoConversion = () => {
    if (!inputText) {
      setOutputText("");
      setError("");
      setDetectedMode("encode");
      setConversionType("");
      return;
    }
    
    setIsProcessing(true); 
    setError("");
    
    const likelyBase64 = isBase64(inputText);
    const currentMode = likelyBase64 ? "decode" : "encode";
    setDetectedMode(currentMode);
    
    // Set conversion type for UI feedback
    setConversionType(likelyBase64 ? "Base64 → Plain Text" : "Plain Text → Base64");
    
    try {
      let result = "";
      if (currentMode === "encode") {
        // Convert plain text to Base64
        result = window.btoa(unescape(encodeURIComponent(inputText)));
        if (options.urlSafe) result = result.replace(/\+/g, '-').replace(/\//g, '_');
        if (!options.padding) result = result.replace(/=+$/, '');
        if (options.lineBreaks) result = result.replace(/.{76}/g, '$&\n');
      } else { 
        // Convert Base64 to plain text
        let input = inputText.replace(/\s/g, ''); 
        if (options.urlSafe) input = input.replace(/-/g, '+').replace(/_/g, '/');
        if (options.padding && input.length % 4 !== 0) {
          input += '='.repeat(4 - (input.length % 4));
        }
        
        const decodedData = window.atob(input);
        try {
          result = decodeURIComponent(escape(decodedData));
        } catch (utfError) {
          console.warn("UTF-8 decoding failed, showing raw decoded data:", utfError);
          result = decodedData; 
          setError("Warning: Could not decode as UTF-8. Displaying raw decoded data.");
        }
      }
      
      setOutputText(result);
      
      // Add to history if it's a new conversion
      if (result && (!history.length || history[0].input !== inputText || history[0].output !== result)) {
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(), 
          input: inputText, 
          output: result, 
          timestamp: new Date(), 
          options: { mode: currentMode, ...options } 
        };
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]);
      }
    } catch (err) {
      setError(currentMode === "encode" ? "Error: Could not encode. Check input." : "Error: Invalid Base64 input or incorrect options.");
      setOutputText("");
    } finally {
      setIsProcessing(false); 
    }
  };

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const handleOptionChange = (key: keyof Base64Options, value: boolean) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = `base64-${detectedMode}.txt`; 
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleFileContent = (content: string) => {
    setInputText(content);
  };
  
  const handleHistoryItemSelect = (item: HistoryItem) => {
    setInputText(item.input);
  };
  
  const handleHistoryClear = () => {
    setHistory([]);
  };

  return (
    <ToolLayout title="Base64 Encoder/Decoder" hideHeader={true}>
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">Base64 Encoder/Decoder</h1>
        <p className="text-gray-300 mb-6">
          Automatically encodes plain text to Base64 or decodes Base64 back to text.
        </p>

        {error && (
          <div className="bg-red-900/60 border border-red-600 text-red-100 px-4 py-3 rounded mb-4 shadow-sm">
            {error}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section + Controls (Left Column) */}
          <div className="w-full space-y-4">
             <div className="flex justify-between items-center">
               <Label className="text-lg font-semibold">Input</Label>
               {/* Conversion indicator */}
               {conversionType && (
                <span className="text-sm bg-zinc-700 px-3 py-1 rounded-full text-emerald-400 font-medium">
                  {conversionType}
                </span>
               )}
             </div>
             
             {/* Tab navigation for Input, Options, File Upload, and History */}
             <Tabs value={activeControlTab} onValueChange={setActiveControlTab} className="w-full">
               <TabsList className="bg-zinc-800 w-full flex justify-around">
                 <TabsTrigger value="input" className="flex-1 data-[state=active]:bg-zinc-700">Input</TabsTrigger>
                 <TabsTrigger value="options" className="flex-1 data-[state=active]:bg-zinc-700">Options</TabsTrigger>
                 <TabsTrigger value="file" className="flex-1 data-[state=active]:bg-zinc-700">File Upload</TabsTrigger>
                 <TabsTrigger value="history" className="flex-1 data-[state=active]:bg-zinc-700">History</TabsTrigger>
               </TabsList>

               {/* Input tab */}
               <TabsContent value="input" className="mt-2 p-0">
                 <Textarea
                   placeholder="Paste text or Base64 here..."
                   className="w-full h-[300px] min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize-none"
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                 />
               </TabsContent>
               
               {/* Options tab */}
               <TabsContent value="options" className="mt-2 p-0">
                 {optionsContent(options, handleOptionChange)}
               </TabsContent>
               
               {/* File Upload tab */}
               <TabsContent value="file" className="mt-2 p-0">
                 <FileUploader
                   onFileContent={handleFileContent}
                   acceptedFormats=".txt,.json,.xml,.html,.js,.css,.md"
                   maxSizeMB={2}
                   onError={setError}
                 />
               </TabsContent>
               
               {/* History tab */}
               <TabsContent value="history" className="mt-2 p-0">
                 <HistoryManager
                   history={history}
                   onHistoryItemSelect={handleHistoryItemSelect}
                   onHistoryClear={handleHistoryClear}
                 />
               </TabsContent>
             </Tabs>
          </div>

          {/* Output Section (Right Column) */}
          <div className="w-full">
            <div className="h-full flex flex-col"> 
               <Label className="text-lg font-semibold mb-2 block">
                 Output 
               </Label>
               <Textarea
                 readOnly
                 placeholder="Output will appear here..." 
                 value={outputText}
                 className="w-full h-[300px] min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize-none mb-4" 
               />
              {/* Action Buttons Below Output Area */}
              <div className="flex flex-wrap gap-2 justify-end mt-auto"> 
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-500"/> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Output"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!outputText}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                   <Download className="w-4 h-4 mr-2" />
                   Download Output
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Only About Tab at the bottom */}
        <Tabs value={activeInfoTab} onValueChange={setActiveInfoTab} className="mt-6">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {aboutContent}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default Base64Converter;
