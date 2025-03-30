import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import CodeTranslationLayout from "./CodeTranslationLayout";

interface ConversionMode {
  id: string;
  name: string;
  description: string;
  encodeFunction: (input: string, options: EncodingOptions) => string;
  decodeFunction: (input: string, options: EncodingOptions) => string;
}

interface EncodingOptions {
  encodeSpaces: boolean;
  encodeNewlines: boolean;
  spaceReplacement: string;
  plusMode: boolean;
  encodeNonAscii: boolean;
  useRFC3986: boolean;
  componentMode: boolean;
}

const UrlEncodeDecode = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [direction, setDirection] = useState<"encode" | "decode">("encode");
  const [mode, setMode] = useState<string>("urlStandard");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Encoding options
  const [encodeSpaces, setEncodeSpaces] = useState(false);
  const [encodeNewlines, setEncodeNewlines] = useState(true);
  const [spaceReplacement, setSpaceReplacement] = useState<"+"|"%20">("%20");
  const [plusMode, setPlusMode] = useState(false);
  const [encodeNonAscii, setEncodeNonAscii] = useState(true);
  const [useRFC3986, setUseRFC3986] = useState(true);
  const [componentMode, setComponentMode] = useState(false);
  
  // Character analysis
  const [urlCharCount, setUrlCharCount] = useState(0);
  const [encodedCharCount, setEncodedCharCount] = useState(0);
  const [specialCharCount, setSpecialCharCount] = useState(0);

  const encodingModes: ConversionMode[] = [
    {
      id: "urlStandard",
      name: "URL Standard",
      description: "Standard URL encoding/decoding (RFC 3986 compliant)",
      encodeFunction: (input, options) => {
        if (options.componentMode) {
          return encodeURIComponent(input);
        }
        return encodeURI(input);
      },
      decodeFunction: (input, options) => {
        try {
          if (options.componentMode) {
            return decodeURIComponent(input);
          }
          return decodeURI(input);
        } catch (e) {
          throw new Error(`Failed to decode: ${e instanceof Error ? e.message : String(e)}`);
        }
      },
    },
    {
      id: "urlCustom",
      name: "Custom URL Encoding",
      description: "Customize how characters are encoded/decoded",
      encodeFunction: (input, options) => customUrlEncode(input, options),
      decodeFunction: (input, options) => customUrlDecode(input, options),
    },
    {
      id: "queryParam",
      name: "Query Parameters",
      description: "Parse and format query string parameters",
      encodeFunction: (input, options) => encodeQueryParams(input, options),
      decodeFunction: (input, options) => decodeQueryParams(input, options),
    },
    {
      id: "base64Url",
      name: "Base64 URL Safe",
      description: "Base64 encoding variant safe for URLs",
      encodeFunction: (input, options) => base64UrlEncode(input),
      decodeFunction: (input, options) => base64UrlDecode(input),
    },
  ];

  // Update output when input, direction, or mode changes
  useEffect(() => {
    if (inputText) {
      processConversion();
    } else {
      setOutputText("");
      setError(null);
    }
  }, [inputText, direction, mode, encodeSpaces, encodeNewlines, spaceReplacement, 
    plusMode, encodeNonAscii, useRFC3986, componentMode]);

  // Analyze input text for URL-specific characters
  useEffect(() => {
    if (inputText) {
      analyzeText(inputText);
    } else {
      setUrlCharCount(0);
      setEncodedCharCount(0);
      setSpecialCharCount(0);
    }
  }, [inputText]);

  const analyzeText = (text: string) => {
    // Count URL encoded characters (%xx)
    const encodedChars = (text.match(/%[0-9A-Fa-f]{2}/g) || []).length;
    setEncodedCharCount(encodedChars);
    
    // Count special characters that would need encoding in URLs
    const specialChars = (text.match(/[^A-Za-z0-9\-_.~]/g) || []).length;
    setSpecialCharCount(specialChars);
    
    // Count characters that are specific to URLs (:/?, etc)
    const urlChars = (text.match(/[:/?#[\]@!$&'()*+,;=]/g) || []).length;
    setUrlCharCount(urlChars);
  };

  const processConversion = () => {
    try {
      setError(null);
      
      const selectedMode = encodingModes.find(m => m.id === mode);
      if (!selectedMode) {
        throw new Error("Invalid mode selected");
      }
      
      const options: EncodingOptions = {
        encodeSpaces,
        encodeNewlines,
        spaceReplacement,
        plusMode,
        encodeNonAscii,
        useRFC3986,
        componentMode,
      };
      
      if (direction === "encode") {
        const result = selectedMode.encodeFunction(inputText, options);
        setOutputText(result);
      } else {
        const result = selectedMode.decodeFunction(inputText, options);
        setOutputText(result);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(`An unexpected error occurred: ${String(err)}`);
      }
    }
  };

  // Custom URL encoding implementation
  const customUrlEncode = (input: string, options: EncodingOptions): string => {
    if (!input) return "";
    
    // Handle newlines before processing
    let processed = input;
    if (options.encodeNewlines) {
      processed = processed.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    }
    
    return processed.split('').map(char => {
      // Handle spaces specially based on options
      if (char === ' ') {
        if (!options.encodeSpaces) return ' ';
        return options.plusMode ? '+' : '%20';
      }
      
      // Handle newlines
      if (char === '\n') {
        return options.encodeNewlines ? '%0A' : '\n';
      }
      
      // Handle unreserved characters (don't encode these)
      // RFC 3986 unreserved chars: ALPHA / DIGIT / "-" / "." / "_" / "~"
      if (/[A-Za-z0-9\-_.~]/.test(char)) {
        return char;
      }
      
      // Handle reserved characters based on RFC 3986 or component mode
      // RFC 3986 reserved chars: : / ? # [ ] @ ! $ & ' ( ) * + , ; =
      if (!options.componentMode && /[:/?#[\]@!$&'()*+,;=]/.test(char)) {
        return char;
      }
      
      // For non-ASCII characters
      if (char.charCodeAt(0) > 127) {
        if (!options.encodeNonAscii) return char;
        
        // Use the UTF-8 encoding for non-ASCII
        const encoded = encodeURI(char);
        // encodeURI might not encode reserved chars, so we need to check if it did anything
        return encoded !== char ? encoded : escape(char);
      }
      
      // Encode everything else
      return `%${char.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`;
    }).join('');
  };

  // Custom URL decoding implementation
  const customUrlDecode = (input: string, options: EncodingOptions): string => {
    if (!input) return "";
    
    // First handle plus signs if in plus mode
    let processed = input;
    if (options.plusMode) {
      processed = processed.replace(/\+/g, ' ');
    }
    
    // Decode percent-encoded sequences
    return processed.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => {
      return String.fromCharCode(parseInt(hex, 16));
    });
  };

  // Query parameter encoding
  const encodeQueryParams = (input: string, options: EncodingOptions): string => {
    // Try to parse input as multiple key=value lines
    try {
      const lines = input.split('\n').filter(line => line.trim());
      const params: Record<string, string> = {};
      
      // Process each line as a key=value pair
      for (const line of lines) {
        // Skip comments and empty lines
        if (line.trim().startsWith('#') || !line.includes('=')) continue;
        
        const firstEquals = line.indexOf('=');
        const key = line.substring(0, firstEquals).trim();
        const value = line.substring(firstEquals + 1).trim();
        
        if (key) {
          params[key] = value;
        }
      }
      
      // Convert to query string
      const queryParts = Object.entries(params).map(([key, value]) => {
        const encodedKey = options.componentMode 
          ? encodeURIComponent(key) 
          : customUrlEncode(key, {...options, componentMode: true});
          
        const encodedValue = options.componentMode 
          ? encodeURIComponent(value) 
          : customUrlEncode(value, {...options, componentMode: true});
          
        return `${encodedKey}=${encodedValue}`;
      });
      
      return queryParts.join('&');
    } catch (e) {
      // If parsing fails, just do normal encoding
      return options.componentMode 
        ? encodeURIComponent(input) 
        : customUrlEncode(input, options);
    }
  };

  // Query parameter decoding
  const decodeQueryParams = (input: string, options: EncodingOptions): string => {
    try {
      // Split the query string by &
      const pairs = input.split('&').filter(pair => pair.trim());
      const params: Record<string, string> = {};
      
      // Process each key=value pair
      for (const pair of pairs) {
        const [encodedKey, encodedValue] = pair.split('=');
        
        if (!encodedKey) continue;
        
        const key = options.componentMode 
          ? decodeURIComponent(encodedKey) 
          : customUrlDecode(encodedKey, options);
          
        const value = encodedValue !== undefined 
          ? (options.componentMode 
              ? decodeURIComponent(encodedValue) 
              : customUrlDecode(encodedValue, options)) 
          : '';
          
        params[key] = value;
      }
      
      // Format as key=value pairs
      return Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    } catch (e) {
      // If parsing fails, just do normal decoding
      return options.componentMode 
        ? decodeURIComponent(input) 
        : customUrlDecode(input, options);
    }
  };

  // Base64 URL safe encoding
  const base64UrlEncode = (input: string): string => {
    try {
      // Convert string to Base64
      const base64 = btoa(input);
      // Make Base64 URL-safe: replace '+' with '-', '/' with '_', and remove '='
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      // Handle non-ASCII characters
      const bytes = new TextEncoder().encode(input);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }
  };

  // Base64 URL safe decoding
  const base64UrlDecode = (input: string): string => {
    try {
      // Restore Base64 standard format: replace '-' with '+', '_' with '/'
      const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
      
      // Add padding if needed
      const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      
      // Decode Base64
      const binary = atob(paddedBase64);
      
      // Handle potential UTF-8 encoding
      try {
        // Try to interpret as ASCII first
        return binary;
      } catch {
        // If that fails, try to interpret as UTF-8
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder().decode(bytes);
      }
    } catch (e) {
      throw new Error(`Failed to decode Base64URL: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleSwapDirection = () => {
    // Swap the input and output
    const tempText = inputText;
    setInputText(outputText);
    setOutputText(tempText);
    
    // Also swap the direction
    setDirection(direction === "encode" ? "decode" : "encode");
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
    element.download = direction === "encode" ? "encoded_url.txt" : "decoded_url.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setError(null);
    setCopied(false);
  };

  const getCurrentMode = () => encodingModes.find(m => m.id === mode) || encodingModes[0];

  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        This tool allows you to encode and decode text for use in URLs. URL encoding replaces special characters with a percent sign (%) followed by two hexadecimal digits.
      </p>
      
      <p className="text-gray-300 mb-4">
        The tool offers four modes:
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li><strong>URL Standard</strong>: Standard URL encoding/decoding compliant with RFC 3986</li>
        <li><strong>Custom URL Encoding</strong>: Customize exactly how characters are encoded/decoded</li>
        <li><strong>Query Parameters</strong>: Parse and format query string parameters</li>
        <li><strong>Base64 URL Safe</strong>: A URL-safe variant of Base64 encoding</li>
      </ul>
      
      <p className="text-gray-300 mb-4">
        URL encoding is essential when:
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Including special characters in a URL (like spaces, &, =, ?, etc.)</li>
        <li>Sending form data in HTTP requests</li>
        <li>Working with query parameters that contain special characters</li>
        <li>Ensuring URLs are properly formatted and valid across all systems</li>
        <li>Creating data URLs or embedding data directly in URLs</li>
      </ul>
      
      <p className="text-gray-300">
        This tool provides advanced options like RFC 3986 compliance, component encoding, and space handling customization to meet all your URL encoding needs.
      </p>
    </>
  );

  return (
    <CodeTranslationLayout
      title="URL Encode/Decode"
      description="Convert text to and from URL-encoded format. This tool handles standard URL encoding, query parameters, custom encoding rules, and Base64 URL-safe encoding."
      onProcess={processConversion}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      processButtonText={direction === "encode" ? "Encode URL" : "Decode URL"}
      copied={copied}
      result={outputText}
      error={error || ""}
      aboutContent={aboutContent}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Left Column - Input */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <Label>{direction === "encode" ? "Plain Text Input" : "Encoded URL Input"}</Label>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
              onClick={handleSwapDirection}
            >
              ↔ Swap Direction
            </Button>
          </div>
          
          <Textarea 
            placeholder={direction === "encode" 
              ? "Enter text to encode for a URL" 
              : "Enter URL-encoded text to decode"
            }
            className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 resize-y"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="mb-2 block">Operation Mode</Label>
              <RadioGroup 
                value={direction} 
                onValueChange={(value) => setDirection(value as "encode" | "decode")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="encode" value="encode" />
                  <Label htmlFor="encode">Encode</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="decode" value="decode" />
                  <Label htmlFor="decode">Decode</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="mode" className="mb-2 block">Encoding Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger id="mode" className="bg-zinc-700 text-white border-zinc-600">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                  {encodingModes.map(m => (
                    <SelectItem key={m.id} value={m.id}>
                      <div>
                        <span>{m.name}</span>
                        <p className="text-xs text-gray-400">{m.description}</p>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Separator className="my-2" />
            
            {/* Dynamic options based on selected mode */}
            {(mode === "urlCustom" || mode === "queryParam") && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="componentMode"
                    checked={componentMode}
                    onCheckedChange={(checked) => setComponentMode(!!checked)}
                  />
                  <Label htmlFor="componentMode">
                    Component Mode (encode/decode URL components like query parameters)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="encodeSpaces"
                    checked={encodeSpaces}
                    onCheckedChange={(checked) => setEncodeSpaces(!!checked)}
                  />
                  <Label htmlFor="encodeSpaces">
                    Encode Spaces
                  </Label>
                </div>
                
                {encodeSpaces && (
                  <div className="pl-6">
                    <Label htmlFor="spaceEncoding" className="mb-2 block">Space Encoding</Label>
                    <RadioGroup 
                      value={plusMode ? "plus" : "percent20"} 
                      onValueChange={(value) => setPlusMode(value === "plus")}
                      className="space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="percent20" value="percent20" />
                        <Label htmlFor="percent20">%20 (standard)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="plus" value="plus" />
                        <Label htmlFor="plus">+ (application/x-www-form-urlencoded)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="encodeNewlines"
                    checked={encodeNewlines}
                    onCheckedChange={(checked) => setEncodeNewlines(!!checked)}
                  />
                  <Label htmlFor="encodeNewlines">
                    Encode Newlines
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="encodeNonAscii"
                    checked={encodeNonAscii}
                    onCheckedChange={(checked) => setEncodeNonAscii(!!checked)}
                  />
                  <Label htmlFor="encodeNonAscii">
                    Encode Non-ASCII Characters
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useRFC3986"
                    checked={useRFC3986}
                    onCheckedChange={(checked) => setUseRFC3986(!!checked)}
                  />
                  <Label htmlFor="useRFC3986">
                    Use RFC 3986 (newer standard)
                  </Label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="output" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="output" className="flex-grow">Output</TabsTrigger>
              <TabsTrigger value="analysis" className="flex-grow">Analysis</TabsTrigger>
            </TabsList>
            
            <TabsContent value="output">
              <div className="flex flex-col space-y-2">
                <Label>{direction === "encode" ? "Encoded URL Output" : "Decoded Plain Text"}</Label>
                <div className="min-h-[200px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y font-mono">
                  {outputText ? (
                    <div className="whitespace-pre-wrap break-words">{outputText}</div>
                  ) : (
                    <p className="text-gray-400 italic">
                      Your {direction === "encode" ? "encoded URL" : "decoded text"} will appear here
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="analysis">
              <div className="min-h-[200px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
                <h3 className="text-lg font-medium mb-2">URL Character Analysis</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Character Types</h4>
                    <ul className="mt-1 space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>URL-encoded sequences (%xx):</span>
                        <span className="font-mono">{encodedCharCount}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>URL special characters (:/?, etc):</span>
                        <span className="font-mono">{urlCharCount}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Characters needing encoding:</span>
                        <span className="font-mono">{specialCharCount}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-300">Mode Information</h4>
                    <p className="mt-1 text-sm text-gray-400">
                      {getCurrentMode().description}
                    </p>
                  </div>
                  
                  {inputText.includes('?') && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">Query Parameter Detection</h4>
                      <p className="mt-1 text-sm text-gray-400">
                        {inputText.split('?')[1]?.includes('=') 
                          ? "URL appears to contain query parameters"
                          : "URL contains '?' but no clearly defined parameters"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex flex-col space-y-1 text-sm text-gray-400">
            {outputText && (
              <>
                <p>
                  Length: {outputText.length} characters
                </p>
                {direction === "encode" && outputText.length > inputText.length && (
                  <p>
                    Encoding ratio: {(outputText.length / (inputText.length || 1)).toFixed(2)}x original size
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </CodeTranslationLayout>
  );
};

export default UrlEncodeDecode;
