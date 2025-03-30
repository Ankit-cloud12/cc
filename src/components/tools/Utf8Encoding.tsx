import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CodeTranslationLayout from "./CodeTranslationLayout";

interface CharacterInfo {
  char: string;
  decimal: number;
  hex: string;
  utf8Bytes: number[];
  utf8Hex: string;
  charCode: string;
  category: string;
  name: string;
}

interface EncodingMode {
  id: string;
  name: string;
  description: string;
}

const Utf8Encoding = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [format, setFormat] = useState<"hex" | "decimal" | "binary" | "escaped">("hex");
  const [separator, setSeparator] = useState<"space" | "comma" | "none">("space");
  const [prefix, setPrefix] = useState<"0x" | "\\x" | "none">("none");
  const [includeNonUtf8, setIncludeNonUtf8] = useState(false);
  const [showByteLength, setShowByteLength] = useState(true);
  const [showCharacterInfo, setShowCharacterInfo] = useState(true);
  const [selectedChar, setSelectedChar] = useState<CharacterInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Unicode categories
  const unicodeCategories: Record<string, string> = {
    Lu: "Uppercase Letter",
    Ll: "Lowercase Letter",
    Lt: "Titlecase Letter",
    Lm: "Modifier Letter",
    Lo: "Other Letter",
    Mn: "Nonspacing Mark",
    Mc: "Spacing Mark",
    Me: "Enclosing Mark",
    Nd: "Decimal Number",
    Nl: "Letter Number",
    No: "Other Number",
    Pc: "Connector Punctuation",
    Pd: "Dash Punctuation",
    Ps: "Open Punctuation",
    Pe: "Close Punctuation",
    Pi: "Initial Punctuation",
    Pf: "Final Punctuation",
    Po: "Other Punctuation",
    Sm: "Math Symbol",
    Sc: "Currency Symbol",
    Sk: "Modifier Symbol",
    So: "Other Symbol",
    Zs: "Space Separator",
    Zl: "Line Separator",
    Zp: "Paragraph Separator",
    Cc: "Control",
    Cf: "Format",
    Cs: "Surrogate",
    Co: "Private Use",
    Cn: "Unassigned",
  };

  // Encoding modes
  const encodingModes: EncodingMode[] = [
    {
      id: "utf8",
      name: "UTF-8",
      description: "Variable-width encoding that can represent every character in the Unicode standard",
    },
    {
      id: "ascii",
      name: "ASCII",
      description: "7-bit encoding scheme that represents 128 characters (0-127)",
    },
    {
      id: "latin1",
      name: "Latin-1 (ISO-8859-1)",
      description: "8-bit encoding that covers most Western European languages",
    },
    {
      id: "utf16",
      name: "UTF-16",
      description: "Variable-width encoding that represents Unicode characters in 16-bit units",
    },
  ];

  // Process the input when it changes
  useEffect(() => {
    processText();
  }, [inputText, mode, format, separator, prefix, includeNonUtf8]);

  // Get character category from code point
  const getCharacterCategory = (codePoint: number): string => {
    // This is a simplified version - a complete version would use a Unicode database
    if (codePoint < 32) return "Cc"; // Control
    if (codePoint === 32) return "Zs"; // Space
    if (codePoint >= 33 && codePoint <= 47) return "Po"; // Punctuation
    if (codePoint >= 48 && codePoint <= 57) return "Nd"; // Number
    if (codePoint >= 58 && codePoint <= 64) return "Po"; // Punctuation
    if (codePoint >= 65 && codePoint <= 90) return "Lu"; // Uppercase
    if (codePoint >= 91 && codePoint <= 96) return "Po"; // Punctuation
    if (codePoint >= 97 && codePoint <= 122) return "Ll"; // Lowercase
    if (codePoint >= 123 && codePoint <= 126) return "Po"; // Punctuation
    if (codePoint >= 128 && codePoint <= 159) return "Cc"; // Control
    if (codePoint >= 160 && codePoint <= 191) return "Po"; // Punctuation
    if (codePoint >= 192 && codePoint <= 214) return "Lu"; // Uppercase
    if (codePoint >= 215 && codePoint <= 246) return "Ll"; // Lowercase
    if (codePoint >= 247 && codePoint <= 255) return "Po"; // Punctuation
    return "Lo"; // Other Letter
  };

  // Get character name from code point (basic implementation)
  const getCharacterName = (codePoint: number): string => {
    // This is a simplified version - a complete version would use a Unicode database
    if (codePoint < 32) {
      const controlNames: Record<number, string> = {
        0: "NULL",
        9: "TAB",
        10: "LINE FEED",
        13: "CARRIAGE RETURN",
      };
      return controlNames[codePoint] || `CONTROL CHARACTER (${codePoint})`;
    }
    if (codePoint === 32) return "SPACE";
    if (codePoint === 127) return "DELETE";
    if (codePoint >= 128 && codePoint <= 159) return `CONTROL CHARACTER (${codePoint})`;
    if (codePoint >= 0x4E00 && codePoint <= 0x9FFF) return "CJK UNIFIED IDEOGRAPH";
    
    // Common ASCII characters
    if (codePoint >= 33 && codePoint <= 126) {
      const char = String.fromCodePoint(codePoint);
      return `LATIN ${getCharacterCategory(codePoint) === "Lu" ? "CAPITAL" : "SMALL"} LETTER ${char.toUpperCase()}`;
    }
    
    return `UNICODE CHARACTER U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`;
  };

  // Get UTF-8 bytes for a character
  const getUtf8Bytes = (char: string): number[] => {
    const codePoint = char.codePointAt(0) || 0;
    
    // Handle ASCII characters (0-127)
    if (codePoint <= 0x7F) {
      return [codePoint];
    }
    
    // Handle 2-byte sequences (128-2047)
    if (codePoint <= 0x7FF) {
      return [
        0xC0 | (codePoint >> 6),
        0x80 | (codePoint & 0x3F),
      ];
    }
    
    // Handle 3-byte sequences (2048-65535)
    if (codePoint <= 0xFFFF) {
      return [
        0xE0 | (codePoint >> 12),
        0x80 | ((codePoint >> 6) & 0x3F),
        0x80 | (codePoint & 0x3F),
      ];
    }
    
    // Handle 4-byte sequences (65536-1114111)
    return [
      0xF0 | (codePoint >> 18),
      0x80 | ((codePoint >> 12) & 0x3F),
      0x80 | ((codePoint >> 6) & 0x3F),
      0x80 | (codePoint & 0x3F),
    ];
  };

  // Get character information for a single character
  const getCharacterInfo = (char: string): CharacterInfo => {
    const codePoint = char.codePointAt(0) || 0;
    const utf8Bytes = getUtf8Bytes(char);
    
    return {
      char,
      decimal: codePoint,
      hex: `U+${codePoint.toString(16).toUpperCase().padStart(4, '0')}`,
      utf8Bytes,
      utf8Hex: utf8Bytes.map(b => b.toString(16).toUpperCase().padStart(2, '0')).join(' '),
      charCode: `&#${codePoint};`,
      category: getCharacterCategory(codePoint),
      name: getCharacterName(codePoint),
    };
  };

  // Process text based on current mode and format
  const processText = () => {
    try {
      setError(null);
      
      if (!inputText) {
        setOutputText("");
        return;
      }

      if (mode === "encode") {
        let result = "";
        const encoder = new TextEncoder();
        const bytes = encoder.encode(inputText);
        
        switch (format) {
          case "hex":
            result = Array.from(bytes)
              .map(b => {
                const hex = b.toString(16).padStart(2, '0');
                return prefix === "0x" ? `0x${hex}` : (prefix === "\\x" ? `\\x${hex}` : hex);
              })
              .join(separator === "space" ? " " : (separator === "comma" ? "," : ""));
            break;
            
          case "decimal":
            result = Array.from(bytes)
              .map(b => b.toString(10))
              .join(separator === "space" ? " " : (separator === "comma" ? "," : ""));
            break;
            
          case "binary":
            result = Array.from(bytes)
              .map(b => b.toString(2).padStart(8, '0'))
              .join(separator === "space" ? " " : (separator === "comma" ? "," : ""));
            break;
            
          case "escaped":
            result = Array.from(bytes)
              .map(b => {
                if (b <= 127 && b >= 32 && b !== 92) {
                  return String.fromCharCode(b);
                } else {
                  const hex = b.toString(16).padStart(2, '0');
                  return `\\x${hex}`;
                }
              })
              .join("");
            break;
        }
        
        setOutputText(result);
        
        // Update character info for the first character if available
        if (inputText && showCharacterInfo) {
          setSelectedChar(getCharacterInfo(inputText.charAt(0)));
        }
      } else {
        // Decode mode
        let bytes: number[] = [];
        
        switch (format) {
          case "hex":
            // Clean up the input
            let cleanHex = inputText.replace(/[^0-9A-Fa-f,\s\\x]/g, "");
            
            if (prefix === "0x") {
              cleanHex = cleanHex.replace(/0x/g, " ");
            } else if (prefix === "\\x") {
              cleanHex = cleanHex.replace(/\\x/g, " ");
            }
            
            // Split by spaces, commas, or characters (depending on the separator)
            const hexTokens = cleanHex.split(/[\s,]+/).filter(token => token.length > 0);
            
            bytes = hexTokens.map(hex => parseInt(hex, 16));
            break;
            
          case "decimal":
            // Split by spaces or commas
            const decTokens = inputText.split(/[\s,]+/).filter(token => token.length > 0);
            bytes = decTokens.map(dec => parseInt(dec, 10));
            break;
            
          case "binary":
            // Split by spaces or commas
            const binTokens = inputText.split(/[\s,]+/).filter(token => token.length > 0);
            bytes = binTokens.map(bin => parseInt(bin, 2));
            break;
            
          case "escaped":
            // Handle escaped format
            let i = 0;
            while (i < inputText.length) {
              if (inputText[i] === '\\' && inputText[i+1] === 'x' && i+3 < inputText.length) {
                const hex = inputText.substring(i+2, i+4);
                bytes.push(parseInt(hex, 16));
                i += 4;
              } else {
                bytes.push(inputText.charCodeAt(i));
                i += 1;
              }
            }
            break;
        }
        
        // Validate bytes for UTF-8
        if (!includeNonUtf8) {
          // Check if the byte sequence is valid UTF-8
          try {
            // Use TextDecoder to validate
            const decoder = new TextDecoder('utf-8', { fatal: true });
            decoder.decode(new Uint8Array(bytes));
          } catch (e) {
            setError("Invalid UTF-8 byte sequence. Enable 'Include non-UTF-8 characters' to see the result anyway.");
            setOutputText("");
            return;
          }
        }
        
        // Decode the bytes
        try {
          const decoder = new TextDecoder('utf-8', { fatal: !includeNonUtf8 });
          const result = decoder.decode(new Uint8Array(bytes));
          setOutputText(result);
          
          // Update character info for the first character if available
          if (result && showCharacterInfo) {
            setSelectedChar(getCharacterInfo(result.charAt(0)));
          }
        } catch (e) {
          setError(`Failed to decode: ${e instanceof Error ? e.message : String(e)}`);
          setOutputText("");
        }
      }
    } catch (err) {
      setError(`Processing error: ${err instanceof Error ? err.message : String(err)}`);
      setOutputText("");
    }
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
    element.download = `${mode === "encode" ? "encoded" : "decoded"}_utf8.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setError(null);
    setCopied(false);
    setSelectedChar(null);
  };

  const handleCharacterClick = (index: number) => {
    if (index >= 0 && index < inputText.length) {
      const char = inputText.charAt(index);
      setSelectedChar(getCharacterInfo(char));
    }
  };

  const getByteLength = (text: string): number => {
    const encoder = new TextEncoder();
    return encoder.encode(text).length;
  };

  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        UTF-8 is a variable-width character encoding used to represent Unicode characters. This tool helps you work with UTF-8 encoding by:
      </p>
      
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Converting text to UTF-8 byte values in various formats (hex, decimal, binary)</li>
        <li>Decoding UTF-8 byte sequences back to text</li>
        <li>Analyzing character properties, including code points and byte representations</li>
        <li>Examining character details like Unicode categories and character names</li>
      </ul>
      
      <p className="text-gray-300 mb-4">
        UTF-8 is the dominant encoding for the World Wide Web and is used in:
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Web development (HTML, CSS, JavaScript files)</li>
        <li>Database storage of multilingual text</li>
        <li>Internationalization (i18n) of software applications</li>
        <li>JSON and XML documents for data interchange</li>
        <li>Email headers and content (per RFC 6532)</li>
      </ul>
      
      <p className="text-gray-300 mb-2">
        UTF-8 Encoding Structure:
      </p>
      <table className="w-full text-gray-300 mb-4 text-sm">
        <thead>
          <tr>
            <th className="text-left">Unicode Range</th>
            <th className="text-left">UTF-8 Bytes</th>
            <th className="text-left">Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>U+0000 to U+007F</td>
            <td>1 byte (0xxxxxxx)</td>
            <td>'A' = 0x41</td>
          </tr>
          <tr>
            <td>U+0080 to U+07FF</td>
            <td>2 bytes (110xxxxx 10xxxxxx)</td>
            <td>'€' = 0xE2 0x82 0xAC</td>
          </tr>
          <tr>
            <td>U+0800 to U+FFFF</td>
            <td>3 bytes (1110xxxx 10xxxxxx 10xxxxxx)</td>
            <td>'漢' = 0xE6 0xBC 0xA2</td>
          </tr>
          <tr>
            <td>U+10000 to U+10FFFF</td>
            <td>4 bytes (11110xxx 10xxxxxx 10xxxxxx 10xxxxxx)</td>
            <td>'𐍈' = 0xF0 0x90 0x8D 0x88</td>
          </tr>
        </tbody>
      </table>
      
      <p className="text-gray-300">
        This tool provides a comprehensive interface for exploring and working with UTF-8 encoded text, helping developers better understand and manipulate Unicode characters in their applications.
      </p>
    </>
  );

  return (
    <CodeTranslationLayout
      title="UTF-8 Encoding"
      description="Convert text to UTF-8 bytes and decode UTF-8 byte sequences back to text. Examine character properties, code points, and Unicode details."
      onProcess={processText}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      processButtonText={mode === "encode" ? "Encode" : "Decode"}
      copied={copied}
      result={outputText}
      error={error || ""}
      aboutContent={aboutContent}
      showProcessButton={false} // Real-time processing, no button needed
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Left Column - Input */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <Label>{mode === "encode" ? "Input Text" : "Input Bytes"}</Label>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
              onClick={() => setMode(mode === "encode" ? "decode" : "encode")}
            >
              Switch to {mode === "encode" ? "Decode" : "Encode"} Mode
            </Button>
          </div>
          
          <Textarea 
            placeholder={mode === "encode" 
              ? "Enter text to convert to UTF-8 bytes" 
              : "Enter UTF-8 bytes to convert to text"
            }
            className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 resize-y font-mono"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          {inputText && mode === "encode" && showByteLength && (
            <div className="text-sm text-gray-400">
              Byte length: {getByteLength(inputText)} (Character length: {inputText.length})
            </div>
          )}
          
          <div className="space-y-4 mt-4">
            <div>
              <Label className="mb-2 block">Operation Mode</Label>
              <RadioGroup 
                value={mode} 
                onValueChange={(value) => setMode(value as "encode" | "decode")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="encode" value="encode" />
                  <Label htmlFor="encode">Text to UTF-8</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="decode" value="decode" />
                  <Label htmlFor="decode">UTF-8 to Text</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="format" className="mb-2 block">Byte Format</Label>
              <Select value={format} onValueChange={(value) => setFormat(value as "hex" | "decimal" | "binary" | "escaped")}>
                <SelectTrigger id="format" className="bg-zinc-700 text-white border-zinc-600">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                  <SelectItem value="hex">Hexadecimal (e.g., E2 82 AC)</SelectItem>
                  <SelectItem value="decimal">Decimal (e.g., 226 130 172)</SelectItem>
                  <SelectItem value="binary">Binary (e.g., 11100010 10000010 10101100)</SelectItem>
                  <SelectItem value="escaped">Escaped (e.g., \xE2\x82\xAC)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {format !== "escaped" && (
              <>
                <div>
                  <Label htmlFor="separator" className="mb-2 block">Separator</Label>
                  <Select value={separator} onValueChange={(value) => setSeparator(value as "space" | "comma" | "none")}>
                    <SelectTrigger id="separator" className="bg-zinc-700 text-white border-zinc-600">
                      <SelectValue placeholder="Select separator" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                      <SelectItem value="space">Space</SelectItem>
                      <SelectItem value="comma">Comma</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {format === "hex" && (
                  <div>
                    <Label htmlFor="prefix" className="mb-2 block">Prefix</Label>
                    <Select value={prefix} onValueChange={(value) => setPrefix(value as "0x" | "\\x" | "none")}>
                      <SelectTrigger id="prefix" className="bg-zinc-700 text-white border-zinc-600">
                        <SelectValue placeholder="Select prefix" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                        <SelectItem value="none">None (e.g., E2)</SelectItem>
                        <SelectItem value="0x">0x (e.g., 0xE2)</SelectItem>
                        <SelectItem value="\\x">\\x (e.g., \xE2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
            
            {mode === "decode" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeNonUtf8"
                  checked={includeNonUtf8}
                  onCheckedChange={(checked) => setIncludeNonUtf8(!!checked)}
                />
                <Label htmlFor="includeNonUtf8">
                  Include non-UTF-8 characters
                </Label>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showByteLength"
                checked={showByteLength}
                onCheckedChange={(checked) => setShowByteLength(!!checked)}
              />
              <Label htmlFor="showByteLength">
                Show byte length
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="showCharacterInfo"
                checked={showCharacterInfo}
                onCheckedChange={(checked) => setShowCharacterInfo(!!checked)}
              />
              <Label htmlFor="showCharacterInfo">
                Show character information
              </Label>
            </div>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="output" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="output" className="flex-grow">{mode === "encode" ? "UTF-8 Bytes" : "Decoded Text"}</TabsTrigger>
              {showCharacterInfo && (
                <TabsTrigger value="charInfo" className="flex-grow">Character Info</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="output">
              <div className="flex flex-col space-y-2">
                <Label>{mode === "encode" ? "UTF-8 Bytes Output" : "Decoded Text Output"}</Label>
                <div className="min-h-[200px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
                  {outputText ? (
                    <div className={`whitespace-pre-wrap ${format === "hex" || format === "decimal" || format === "binary" ? "font-mono" : ""} break-all`}>
                      {mode === "encode" ? (
                        outputText
                      ) : (
                        // In decode mode, make each character clickable for info
                        Array.from(outputText).map((char, index) => (
                          <span 
                            key={index} 
                            className="cursor-pointer hover:bg-zinc-600 rounded px-0.5"
                            onClick={() => handleCharacterClick(index)}
                          >
                            {char}
                          </span>
                        ))
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      Your {mode === "encode" ? "UTF-8 bytes" : "decoded text"} will appear here
                    </p>
                  )}
                </div>
                
                {outputText && mode === "decode" && showByteLength && (
                  <div className="text-sm text-gray-400">
                    Character length: {outputText.length} (Byte length: {getByteLength(outputText)})
                  </div>
                )}
              </div>
            </TabsContent>
            
            {showCharacterInfo && (
              <TabsContent value="charInfo">
                <div className="min-h-[200px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
                  {selectedChar ? (
                    <div className="space-y-4">
                      <div className="mb-4">
                        <h3 className="text-xl font-medium mb-2">Character: {selectedChar.char}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Table>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Character</TableCell>
                                <TableCell>{selectedChar.char}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Unicode</TableCell>
                                <TableCell>{selectedChar.hex}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Decimal</TableCell>
                                <TableCell>{selectedChar.decimal}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">HTML Entity</TableCell>
                                <TableCell>{selectedChar.charCode}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Category</TableCell>
                                <TableCell>
                                  {selectedChar.category} ({unicodeCategories[selectedChar.category] || "Unknown"})
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Name</TableCell>
                                <TableCell>{selectedChar.name}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">UTF-8 Encoding</h4>
                            <div className="bg-zinc-800 p-3 rounded font-mono">
                              <div className="mb-2">
                                <span className="text-gray-400">Hex: </span>
                                {selectedChar.utf8Hex}
                              </div>
                              <div className="mb-2">
                                <span className="text-gray-400">Decimal: </span>
                                {selectedChar.utf8Bytes.join(' ')}
                              </div>
                              <div>
                                <span className="text-gray-400">Binary: </span>
                                {selectedChar.utf8Bytes.map(byte => 
                                  byte.toString(2).padStart(8, '0')
                                ).join(' ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {mode === "encode" && inputText.length > 1 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Character Selection</h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(inputText).map((char, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className={`bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600 ${
                                  selectedChar && selectedChar.char === char ? "ring-2 ring-blue-500" : ""
                                }`}
                                onClick={() => handleCharacterClick(index)}
                              >
                                {char}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">
                      {inputText 
                        ? "Click on a character to view its details" 
                        : "Enter some text to see character information"}
                    </p>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </CodeTranslationLayout>
  );
};

export default Utf8Encoding;
