import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import CodeTranslationLayout from "./CodeTranslationLayout";
import { FileUploader } from "./shared/FileUploader";
import { HistoryManager, HistoryItem } from "./shared/HistoryManager";

interface ConversionError {
  message: string;
  position?: number;
}

interface HexOptions {
  encoding: "utf8" | "ascii" | "binary";
  hexFormat: "spaced" | "prefixed" | "continuous" | "array";
  byteDisplay: "base16" | "base2" | "base8" | "base10";
  preserveLineBreaks: boolean;
  endianness: "big" | "little";
}

const HexToTextConverter = () => {
  // Basic state
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [direction, setDirection] = useState<"hexToText" | "textToHex">("hexToText");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<ConversionError | null>(null);
  const [highlightPosition, setHighlightPosition] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Options state
  const [options, setOptions] = useState<HexOptions>({
    encoding: "utf8",
    hexFormat: "spaced",
    byteDisplay: "base16",
    preserveLineBreaks: true,
    endianness: "big"
  });
  
  // History feature
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (inputText) {
      processConversion();
    } else {
      setOutputText("");
      setError(null);
      setHighlightPosition(null);
    }
  }, [inputText, direction, options]);

  const processConversion = () => {
    if (!inputText) {
      setOutputText("");
      setError(null);
      setHighlightPosition(null);
      return;
    }
    
    setIsProcessing(true);
    
    try {
      setError(null);
      setHighlightPosition(null);
      
      let result;
      if (direction === "hexToText") {
        result = convertHexToText(inputText);
      } else {
        result = convertTextToHex(inputText);
      }
      
      setOutputText(result);
      
      // Add to history if there's a result and it's different from last entry
      if (result && (!history.length || history[0].input !== inputText || history[0].output !== result)) {
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          input: inputText,
          output: result,
          timestamp: new Date(),
          options: {
            direction,
            ...options
          }
        };
        
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 19)]); // Keep last 20 items
      }
    } catch (err) {
      if (err instanceof Error) {
        const message = err.message;
        let position: number | undefined;
        
        // Try to extract position from error message
        const posMatch = message.match(/at position (\d+)/i);
        if (posMatch && posMatch[1]) {
          position = parseInt(posMatch[1], 10);
          setHighlightPosition(position);
        }
        
        setError({ message, position });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const convertHexToText = (hex: string): string => {
    // Clean hex input
    let cleanHex = hex.replace(/\s+/g, ' ');
    
    // Handle different formats
    cleanHex = cleanHex
      .replace(/0x/g, '') // Remove 0x prefixes
      .replace(/,/g, '') // Remove commas
      .replace(/[\[\]{}()]/g, '') // Remove brackets
      .replace(/\\x/g, '') // Remove \x escapes
      .replace(/;/g, ''); // Remove semicolons
    
    // Remove all whitespace if not preserving line breaks
    if (!options.preserveLineBreaks) {
      cleanHex = cleanHex.replace(/\s/g, '');
    } else {
      // Only preserve actual line breaks
      const lines = cleanHex.split(/\r?\n/);
      cleanHex = lines.map(line => line.replace(/\s/g, '')).join('\n');
    }
    
    // Validate hex string
    if (!/^[0-9A-Fa-f\n]*$/.test(cleanHex)) {
      const invalidChar = cleanHex.match(/[^0-9A-Fa-f\n]/);
      const position = invalidChar ? cleanHex.indexOf(invalidChar[0]) : undefined;
      throw new Error(`Invalid hex character "${invalidChar?.[0]}" at position ${position}.`);
    }
    
    if (cleanHex.length % 2 !== 0 && !cleanHex.includes('\n')) {
      throw new Error('Hex string must have an even number of characters.');
    }
    
    // Handle multiline input
    if (options.preserveLineBreaks && cleanHex.includes('\n')) {
      const lines = cleanHex.split('\n');
      return lines.map(line => {
        if (line.length === 0) return '';
        if (line.length % 2 !== 0) {
          throw new Error(`Line has odd number of hex characters: "${line}"`);
        }
        return convertHexLineToText(line);
      }).join('\n');
    }
    
    return convertHexLineToText(cleanHex);
  };

  const convertHexLineToText = (hexLine: string): string => {
    // Convert hex to bytes
    const bytes: number[] = [];
    
    for (let i = 0; i < hexLine.length; i += 2) {
      const byte = parseInt(hexLine.substring(i, i + 2), 16);
      if (isNaN(byte)) {
        throw new Error(`Invalid hex value "${hexLine.substring(i, i + 2)}" at position ${i}.`);
      }
      bytes.push(byte);
    }
    
    // Handle endianness for multi-byte characters
    if (options.endianness === "little") {
      // Swap every two bytes for UTF-16, assuming 16-bit (2-byte) characters
      for (let i = 0; i < bytes.length; i += 2) {
        if (i + 1 < bytes.length) {
          const temp = bytes[i];
          bytes[i] = bytes[i + 1];
          bytes[i + 1] = temp;
        }
      }
    }
    
    // Convert bytes to text based on selected encoding
    try {
      if (options.encoding === "ascii") {
        return bytes.map(byte => String.fromCharCode(byte)).join('');
      } else if (options.encoding === "binary") {
        return bytes.map(byte => String.fromCharCode(byte)).join('');
      } else {
        // UTF-8
        const decoder = new TextDecoder('utf-8');
        return decoder.decode(new Uint8Array(bytes));
      }
    } catch (e) {
      throw new Error(`Encoding error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const convertTextToHex = (text: string): string => {
    if (!text) return "";
    
    // Handle line breaks
    if (options.preserveLineBreaks && text.includes('\n')) {
      const lines = text.split('\n');
      return lines.map(line => formatHexOutput(textToHexBytes(line))).join('\n');
    }
    
    const bytes = textToHexBytes(text);
    return formatHexOutput(bytes);
  };

  const textToHexBytes = (text: string): number[] => {
    let bytes: number[];
    
    if (options.encoding === "ascii") {
      // ASCII encoding (simple 1 byte per character)
      bytes = Array.from(text).map(char => char.charCodeAt(0) & 0xFF);
    } else if (options.encoding === "binary") {
      // Binary encoding (simple 1 byte per character)
      bytes = Array.from(text).map(char => char.charCodeAt(0) & 0xFF);
    } else {
      // UTF-8 encoding
      const encoder = new TextEncoder();
      bytes = Array.from(encoder.encode(text));
    }
    
    // Handle endianness for multi-byte characters
    if (options.endianness === "little") {
      // Swap every two bytes, assuming 16-bit (2-byte) characters
      for (let i = 0; i < bytes.length; i += 2) {
        if (i + 1 < bytes.length) {
          const temp = bytes[i];
          bytes[i] = bytes[i + 1];
          bytes[i + 1] = temp;
        }
      }
    }
    
    return bytes;
  };

  const formatHexOutput = (bytes: number[]): string => {
    // Convert bytes to the selected number format
    let formattedBytes: string[];
    
    switch (options.byteDisplay) {
      case "base2": // Binary
        formattedBytes = bytes.map(byte => byte.toString(2).padStart(8, '0'));
        break;
      case "base8": // Octal
        formattedBytes = bytes.map(byte => byte.toString(8).padStart(3, '0'));
        break;
      case "base10": // Decimal
        formattedBytes = bytes.map(byte => byte.toString(10));
        break;
      case "base16": // Hexadecimal (default)
      default:
        formattedBytes = bytes.map(byte => byte.toString(16).padStart(2, '0'));
        break;
    }
    
    // Apply the selected format
    switch (options.hexFormat) {
      case "prefixed":
        if (options.byteDisplay === "base16") {
          return formattedBytes.map(byte => `0x${byte}`).join(' ');
        } else if (options.byteDisplay === "base2") {
          return formattedBytes.map(byte => `0b${byte}`).join(' ');
        } else if (options.byteDisplay === "base8") {
          return formattedBytes.map(byte => `0o${byte}`).join(' ');
        } else {
          return formattedBytes.join(' ');
        }
      case "continuous":
        return formattedBytes.join('');
      case "array":
        if (options.byteDisplay === "base16") {
          return `[${formattedBytes.map(byte => `0x${byte}`).join(', ')}]`;
        } else if (options.byteDisplay === "base2") {
          return `[${formattedBytes.map(byte => `0b${byte}`).join(', ')}]`;
        } else if (options.byteDisplay === "base8") {
          return `[${formattedBytes.map(byte => `0o${byte}`).join(', ')}]`;
        } else {
          return `[${formattedBytes.join(', ')}]`;
        }
      case "spaced":
      default:
        return formattedBytes.join(' ');
    }
  };

  const handleSwapDirection = () => {
    // Swap the input and output
    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
    
    // Also swap the direction
    setDirection(direction === "hexToText" ? "textToHex" : "hexToText");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = direction === "hexToText" ? "decoded_text.txt" : "encoded_hex.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setError(null);
    setHighlightPosition(null);
    setCopied(false);
    setOptions({
      encoding: "utf8",
      hexFormat: "spaced",
      byteDisplay: "base16",
      preserveLineBreaks: true,
      endianness: "big"
    });
  };
  
  const handleOptionChange = <K extends keyof HexOptions>(key: K, value: HexOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };
  
  const handleFileContent = (content: string) => {
    setInputText(content);
    processConversion();
  };
  
  const handleHistoryItemSelect = (item: HistoryItem) => {
    setInputText(item.input);
    setOutputText(item.output);
    
    if (item.options) {
      const { direction: historyDirection, ...historyOptions } = item.options as any;
      setDirection(historyDirection || "hexToText");
      setOptions({
        encoding: historyOptions.encoding || "utf8",
        hexFormat: historyOptions.hexFormat || "spaced",
        byteDisplay: historyOptions.byteDisplay || "base16",
        preserveLineBreaks: historyOptions.preserveLineBreaks !== false,
        endianness: historyOptions.endianness || "big"
      });
    }
  };
  
  const handleHistoryClear = () => {
    setHistory([]);
  };

  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        This tool allows you to convert between hexadecimal (base-16) representations and text. It's commonly used for:
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Analyzing binary data in a human-readable form</li>
        <li>Working with low-level binary protocols or file formats</li>
        <li>Debugging character encoding issues</li>
        <li>Examining memory dumps or binary data streams</li>
        <li>Preparing data for systems that expect hex input</li>
      </ul>
      
      <p className="text-gray-300 mb-4">
        <span className="font-medium text-blue-400">Advanced Options:</span>
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li><span className="font-medium">Encoding:</span> Controls how bytes are interpreted as characters (UTF-8 for most unicode text, ASCII for basic English, Binary for raw byte-to-character mapping)</li>
        <li><span className="font-medium">Output Format:</span> Changes how hex values are displayed:
          <ul className="list-disc list-inside ml-6 text-gray-300 mt-1">
            <li><code>Spaced:</code> Groups bytes with spaces (e.g., FF 01 02)</li>
            <li><code>Prefixed:</code> Prefix bytes with 0x (e.g., 0xFF 0x01 0x02)</li>
            <li><code>Continuous:</code> No separators (e.g., FF0102)</li>
            <li><code>Array:</code> Format as a programming array (e.g., [0xFF, 0x01, 0x02])</li>
          </ul>
        </li>
        <li><span className="font-medium">Number System:</span> Display bytes in hexadecimal (base-16), binary (base-2), octal (base-8), or decimal (base-10)</li>
        <li><span className="font-medium">Endianness:</span> Controls byte order for multi-byte characters (big-endian is standard)</li>
        <li><span className="font-medium">Preserve Line Breaks:</span> Keeps line structure intact during conversion</li>
      </ul>
    </>
  );

  return (
    <CodeTranslationLayout
      title="Hex to Text Converter"
      description="Convert between hexadecimal data and plain text. This tool supports multiple encodings and formats, including UTF-8, ASCII, binary, and various hex notation styles."
      onProcess={processConversion}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      processButtonText={direction === "hexToText" ? "Decode Hex" : "Encode to Hex"}
      copyButtonText="Copy Result"
      resetButtonText="Reset"
      copied={copied}
      result={outputText}
      error={error ? error.message : ""}
      isProcessing={isProcessing}
      toolHistory={history}
      onHistoryClear={handleHistoryClear}
      onHistoryItemSelect={handleHistoryItemSelect}
      themeColor="green"
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
            <div className="flex justify-between items-center mb-4">
              <RadioGroup
                value={direction}
                onValueChange={(value) => setDirection(value as "hexToText" | "textToHex")}
                className="flex flex-wrap gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hexToText" id="hexToText" />
                  <Label htmlFor="hexToText" className="text-gray-200">Hex → Text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="textToHex" id="textToHex" />
                  <Label htmlFor="textToHex" className="text-gray-200">Text → Hex</Label>
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
            
            <div>
              <Label className="text-gray-200 mb-2 block">
                {direction === "hexToText" ? "Hex Input" : "Text Input"}
              </Label>
              <Textarea 
                placeholder={direction === "hexToText" 
                  ? "Enter hex values (e.g., 48 65 6c 6c 6f)" 
                  : "Enter text to convert to hex"
                }
                className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 resize-y font-mono"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              
              {error && highlightPosition !== null && (
                <div className="text-red-400 text-sm mt-1">
                  Error at position: {highlightPosition}
                </div>
              )}
            </div>
            
            <div>
              <Label className="text-gray-200 mb-2 block">
                {direction === "hexToText" ? "Text Output" : "Hex Output"}
              </Label>
              <Textarea
                readOnly
                className="min-h-[150px] bg-zinc-700 text-white border-zinc-600 resize-y font-mono"
                value={outputText}
                placeholder={
                  direction === "hexToText"
                    ? "Decoded text will appear here"
                    : "Encoded hex will appear here"
                }
              />
              
              {outputText && (
                <div className="text-sm text-gray-400 mt-1">
                  Length: {outputText.length} {direction === "hexToText" ? "characters" : "bytes"}
                  {direction === "textToHex" && options.byteDisplay === "base16" && (
                    <span className="ml-2">
                      Format: {
                        options.hexFormat === "spaced" ? "Space-separated" :
                        options.hexFormat === "prefixed" ? "Prefixed with 0x" :
                        options.hexFormat === "continuous" ? "Continuous" :
                        "Array notation"
                      }
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="file">
          <FileUploader 
            onFileContent={handleFileContent} 
            acceptedFormats={direction === "hexToText" ? ".txt,.hex,.bin" : ".txt,.json,.xml,.html,.md"}
            maxSizeMB={2}
            onError={(msg) => setError({message: msg})}
          />
          
          {outputText && (
            <div className="mt-4">
              <Label className="text-gray-200 mb-2 block">
                {direction === "hexToText" ? "Text Output" : "Hex Output"}
              </Label>
              <Textarea
                readOnly
                className="min-h-[150px] bg-zinc-700 text-white border-zinc-600 resize-y font-mono"
                value={outputText}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="options">
          <Card className="bg-zinc-800 border-zinc-700 p-4">
            <h3 className="text-lg font-medium text-gray-200 mb-4">Conversion Options</h3>
            
            <div className="space-y-4">
              <TooltipProvider>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="encoding" className="mb-2 block text-gray-200">Character Encoding</Label>
                    <Select 
                      value={options.encoding} 
                      onValueChange={(value) => handleOptionChange('encoding', value as "utf8" | "ascii" | "binary")}
                    >
                      <SelectTrigger id="encoding" className="bg-zinc-700 text-white border-zinc-600">
                        <SelectValue placeholder="Select encoding" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                        <SelectItem value="utf8">UTF-8 (Unicode)</SelectItem>
                        <SelectItem value="ascii">ASCII</SelectItem>
                        <SelectItem value="binary">Binary (Byte-by-byte)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="endianness" className="mb-2 block text-gray-200">Byte Order</Label>
                    <Select 
                      value={options.endianness} 
                      onValueChange={(value) => handleOptionChange('endianness', value as "big" | "little")}
                    >
                      <SelectTrigger id="endianness" className="bg-zinc-700 text-white border-zinc-600">
                        <SelectValue placeholder="Select endianness" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                        <SelectItem value="big">Big-endian (default)</SelectItem>
                        <SelectItem value="little">Little-endian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {direction === "textToHex" && (
                    <>
                      <div>
                        <Label htmlFor="hexFormat" className="mb-2 block text-gray-200">Output Format</Label>
                        <Select 
                          value={options.hexFormat} 
                          onValueChange={(value) => handleOptionChange('hexFormat', value as "spaced" | "prefixed" | "continuous" | "array")}
                        >
                          <SelectTrigger id="hexFormat" className="bg-zinc-700 text-white border-zinc-600">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                            <SelectItem value="spaced">Spaced (FF 01 02)</SelectItem>
                            <SelectItem value="prefixed">Prefixed (0xFF 0x01 0x02)</SelectItem>
                            <SelectItem value="continuous">Continuous (FF0102)</SelectItem>
                            <SelectItem value="array">Array ([0xFF, 0x01, 0x02])</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="byteDisplay" className="mb-2 block text-gray-200">Number System</Label>
                        <Select 
                          value={options.byteDisplay} 
                          onValueChange={(value) => handleOptionChange('byteDisplay', value as "base16" | "base2" | "base8" | "base10")}
                        >
                          <SelectTrigger id="byteDisplay" className="bg-zinc-700 text-white border-zinc-600">
                            <SelectValue placeholder="Select number system" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 text-gray-200 border-zinc-700">
                            <SelectItem value="base16">Hexadecimal (base 16)</SelectItem>
                            <SelectItem value="base2">Binary (base 2)</SelectItem>
                            <SelectItem value="base8">Octal (base 8)</SelectItem>
                            <SelectItem value="base10">Decimal (base 10)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                    id="preserveLineBreaks"
                    checked={options.preserveLineBreaks}
                    onCheckedChange={(checked) => handleOptionChange('preserveLineBreaks', !!checked)}
                  />
                  <Label htmlFor="preserveLineBreaks" className="text-gray-200">
                    Preserve Line Breaks
                  </Label>
                </div>
              </TooltipProvider>
            </div>
          </Card>
          
          {outputText && (
            <div className="mt-4">
              <Label className="text-gray-200 mb-2 block">
                {direction === "hexToText" ? "Text Output" : "Hex Output"}
              </Label>
              <Textarea
                readOnly
                className="min-h-[150px] bg-zinc-700 text-white border-zinc-600 resize-y font-mono"
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

export default HexToTextConverter;
