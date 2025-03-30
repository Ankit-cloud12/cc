import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

type CipherMode = "rot13" | "rot5" | "rot18" | "rot47" | "custom";

const Rot13EncoderDecoder = () => {
  // Input and output
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  
  // Cipher options
  const [mode, setMode] = useState<CipherMode>("rot13");
  const [customShift, setCustomShift] = useState<number>(13);
  const [preserveCase, setPreserveCase] = useState<boolean>(true);
  const [preserveNonAlpha, setPreserveNonAlpha] = useState<boolean>(true);
  
  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  
  // Process text whenever inputs change
  useEffect(() => {
    processText();
  }, [inputText, mode, customShift, preserveCase, preserveNonAlpha]);
  
  // Main processing function
  const processText = () => {
    if (!inputText) {
      setOutputText("");
      return;
    }
    
    let result = "";
    
    // For each character in the input
    for (let i = 0; i < inputText.length; i++) {
      const char = inputText[i];
      
      // Handle based on cipher mode
      switch (mode) {
        case "rot13":
          result += rotateAlpha(char, 13);
          break;
        case "rot5":
          result += rotateDigit(char, 5);
          break;
        case "rot18":
          // ROT18 is ROT13 for letters and ROT5 for numbers
          if (/[0-9]/.test(char)) {
            result += rotateDigit(char, 5);
          } else {
            result += rotateAlpha(char, 13);
          }
          break;
        case "rot47":
          result += rotateAscii(char, 47);
          break;
        case "custom":
          result += rotateAlpha(char, customShift);
          break;
        default:
          result += char;
      }
    }
    
    setOutputText(result);
  };
  
  // Rotate alphabetic characters
  const rotateAlpha = (char: string, shift: number): string => {
    // Check if character is alphabetic
    if (/[A-Za-z]/.test(char)) {
      const isUpperCase = /[A-Z]/.test(char);
      const baseCharCode = isUpperCase ? 65 : 97; // ASCII code for 'A' or 'a'
      
      // Convert to 0-25 range, apply shift, and convert back
      const charIndex = char.charCodeAt(0) - baseCharCode;
      const newIndex = (charIndex + shift) % 26;
      const newChar = String.fromCharCode(baseCharCode + newIndex);
      
      return preserveCase ? newChar : isUpperCase ? newChar.toUpperCase() : newChar.toLowerCase();
    } else if (/[0-9]/.test(char)) {
      // Handle numeric chars only if in ROT18 mode
      return mode === "rot18" ? rotateDigit(char, 5) : char;
    } else {
      // Non-alphabetic character
      return preserveNonAlpha ? char : "";
    }
  };
  
  // Rotate digits (for ROT5)
  const rotateDigit = (char: string, shift: number): string => {
    if (/[0-9]/.test(char)) {
      const digit = parseInt(char, 10);
      const newDigit = (digit + shift) % 10;
      return newDigit.toString();
    } else {
      // Non-numeric character
      return preserveNonAlpha ? char : "";
    }
  };
  
  // Rotate ASCII characters (for ROT47)
  const rotateAscii = (char: string, shift: number): string => {
    const charCode = char.charCodeAt(0);
    
    // ROT47 operates on a subset of ASCII (33 through 126)
    if (charCode >= 33 && charCode <= 126) {
      // Apply shift within the range 33-126
      const newCharCode = ((charCode - 33 + shift) % 94) + 33;
      return String.fromCharCode(newCharCode);
    } else {
      // Outside the range
      return preserveNonAlpha ? char : "";
    }
  };
  
  // Handle example text
  const loadExample = (example: string) => {
    switch (example) {
      case "rot13":
        setInputText("The Quick Brown Fox Jumps Over The Lazy Dog.");
        setMode("rot13");
        break;
      case "rot5":
        setInputText("Phone: 123-456-7890");
        setMode("rot5");
        break;
      case "rot18":
        setInputText("Hello 2023!");
        setMode("rot18");
        break;
      case "rot47":
        setInputText("The answer is 42!");
        setMode("rot47");
        break;
      default:
        break;
    }
  };
  
  // Copy result to clipboard
  const handleCopy = () => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear both input and output
  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };
  
  // Swap input and output text
  const handleSwap = () => {
    setInputText(outputText);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">ROT13 & Cipher Tools</h1>
      <p className="text-gray-300 mb-6">
        Encode or decode text using ROT13 and other rotation ciphers.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="input-text">Input Text</Label>
            <div className="space-x-2">
              <Button
                variant="outline" 
                size="sm"
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={() => loadExample("rot13")}
              >
                ROT13
              </Button>
              <Button
                variant="outline" 
                size="sm"
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={() => loadExample("rot47")}
              >
                ROT47
              </Button>
            </div>
          </div>
          
          <Textarea
            id="input-text"
            placeholder="Enter text to encode or decode"
            className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="bg-zinc-700 p-4 rounded mb-4">
            <h3 className="text-lg font-medium mb-3">Cipher Options</h3>
            
            <div className="mb-4">
              <Label htmlFor="cipher-mode" className="block mb-2">Cipher Type</Label>
              <Select
                value={mode}
                onValueChange={(value) => setMode(value as CipherMode)}
              >
                <SelectTrigger id="cipher-mode" className="bg-zinc-700 border-zinc-600">
                  <SelectValue placeholder="Select cipher" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 border-zinc-600">
                  <SelectItem value="rot13">ROT13 (Letters A-Z)</SelectItem>
                  <SelectItem value="rot5">ROT5 (Digits 0-9)</SelectItem>
                  <SelectItem value="rot18">ROT18 (Letters + Digits)</SelectItem>
                  <SelectItem value="rot47">ROT47 (ASCII Chars)</SelectItem>
                  <SelectItem value="custom">Custom Shift</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {mode === "custom" && (
              <div className="mb-4">
                <Label htmlFor="custom-shift" className="block mb-2">Shift Amount (1-25)</Label>
                <Input
                  id="custom-shift"
                  type="number"
                  min="1"
                  max="25"
                  className="bg-zinc-700 text-white border-zinc-600"
                  value={customShift}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    setCustomShift(Math.min(Math.max(1, value), 25));
                  }}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="preserve-case" 
                  checked={preserveCase}
                  onCheckedChange={(checked) => setPreserveCase(!!checked)}
                />
                <Label htmlFor="preserve-case" className="cursor-pointer">
                  Preserve case
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="preserve-non-alpha" 
                  checked={preserveNonAlpha}
                  onCheckedChange={(checked) => setPreserveNonAlpha(!!checked)}
                />
                <Label htmlFor="preserve-non-alpha" className="cursor-pointer">
                  Preserve non-cipher characters
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Output Section */}
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="output-text">Output Text</Label>
          </div>
          
          <Textarea
            id="output-text"
            readOnly
            className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={outputText}
            placeholder="Encoded or decoded text will appear here"
          />
          
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={handleCopy}
              disabled={!outputText}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={handleSwap}
              disabled={!outputText}
            >
              ↑ Use as Input
            </Button>
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
          
          <div className="mt-6 bg-zinc-700 p-4 rounded">
            <h3 className="text-lg font-medium mb-3">Information</h3>
            <Tabs defaultValue="current">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current">Current Cipher</TabsTrigger>
                <TabsTrigger value="explanation">How it Works</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="current" className="mt-4">
                {mode === "rot13" && (
                  <div className="text-gray-300">
                    <h4 className="font-medium mb-2">ROT13 Cipher</h4>
                    <p className="mb-2">
                      ROT13 shifts each letter 13 positions in the alphabet. Since the English alphabet has 26 letters, 
                      applying ROT13 twice returns the original text.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-center bg-zinc-800 p-2 rounded">
                        <div className="text-gray-400 mb-1">Original</div>
                        <div>ABCDEFGHIJKLM</div>
                        <div>NOPQRSTUVWXYZ</div>
                      </div>
                      <div className="text-center bg-zinc-800 p-2 rounded">
                        <div className="text-gray-400 mb-1">Transformed</div>
                        <div>NOPQRSTUVWXYZ</div>
                        <div>ABCDEFGHIJKLM</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {mode === "rot5" && (
                  <div className="text-gray-300">
                    <h4 className="font-medium mb-2">ROT5 Cipher</h4>
                    <p className="mb-2">
                      ROT5 shifts each digit 5 positions. It only affects numbers, not letters.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="text-center bg-zinc-800 p-2 rounded">
                        <div className="text-gray-400 mb-1">Original</div>
                        <div>0 1 2 3 4 5 6 7 8 9</div>
                      </div>
                      <div className="text-center bg-zinc-800 p-2 rounded">
                        <div className="text-gray-400 mb-1">Transformed</div>
                        <div>5 6 7 8 9 0 1 2 3 4</div>
                      </div>
                    </div>
                  </div>
                )}
                
                {mode === "rot18" && (
                  <div className="text-gray-300">
                    <h4 className="font-medium mb-2">ROT18 Cipher</h4>
                    <p className="mb-2">
                      ROT18 combines ROT13 for letters and ROT5 for digits. 
                      It's ROT13 + ROT5, affecting both letters and numbers.
                    </p>
                    <div className="text-center bg-zinc-800 p-2 rounded mb-2">
                      <div className="text-gray-400">Example</div>
                      <div>"Hello 2023" → "Uryyb 7578"</div>
                    </div>
                  </div>
                )}
                
                {mode === "rot47" && (
                  <div className="text-gray-300">
                    <h4 className="font-medium mb-2">ROT47 Cipher</h4>
                    <p className="mb-2">
                      ROT47 extends the concept to a larger set of characters. It shifts characters 
                      in the range from ! to ~ (ASCII 33 to 126) by 47 positions.
                    </p>
                    <div className="text-center bg-zinc-800 p-2 rounded mb-2">
                      <div className="text-gray-400">Example</div>
                      <div>"Hello, World!" → "w6==@[ (@C=5P"</div>
                    </div>
                  </div>
                )}
                
                {mode === "custom" && (
                  <div className="text-gray-300">
                    <h4 className="font-medium mb-2">Custom ROT Cipher (Shift: {customShift})</h4>
                    <p className="mb-2">
                      This cipher shifts each letter by {customShift} positions in the alphabet.
                    </p>
                    <div className="bg-zinc-800 p-2 rounded mb-2">
                      <div className="text-gray-400 mb-1">Mapping (first few letters):</div>
                      <div className="flex flex-wrap gap-2">
                        {[..."ABCDEFGH"].map((char, index) => {
                          const shiftedChar = String.fromCharCode(
                            ((char.charCodeAt(0) - 65 + customShift) % 26) + 65
                          );
                          return (
                            <div key={index} className="text-center">
                              <div>{char}</div>
                              <div className="text-gray-400">↓</div>
                              <div>{shiftedChar}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="explanation" className="mt-4">
                <div className="text-gray-300">
                  <h4 className="font-medium mb-2">How Rotation Ciphers Work</h4>
                  <p className="mb-2">
                    Rotation ciphers substitute each letter in the plaintext with a letter some fixed number of positions 
                    down the alphabet. ROT13 is a special case where the shift is exactly half the alphabet, making it 
                    self-reciprocal (applying it twice returns the original text).
                  </p>
                  <p className="mb-2">
                    For example, in ROT13:
                  </p>
                  <ul className="list-disc list-inside mb-4 space-y-1">
                    <li>A becomes N</li>
                    <li>B becomes O</li>
                    <li>Z becomes M</li>
                  </ul>
                  <p>
                    The tool supports several variants: ROT13 (for letters), ROT5 (for digits), ROT18 (ROT13+ROT5), 
                    ROT47 (for most printable ASCII characters), and custom rotation values.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="examples" className="mt-4">
                <div className="text-gray-300 space-y-3">
                  <div>
                    <div className="font-medium">ROT13:</div>
                    <div className="flex flex-col md:flex-row md:justify-between bg-zinc-800 p-2 rounded">
                      <div>
                        <span className="text-gray-400">Input:</span> Hello World
                      </div>
                      <div>
                        <span className="text-gray-400">Output:</span> Uryyb Jbeyq
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">ROT5:</div>
                    <div className="flex flex-col md:flex-row md:justify-between bg-zinc-800 p-2 rounded">
                      <div>
                        <span className="text-gray-400">Input:</span> Phone: 555-123-4567
                      </div>
                      <div>
                        <span className="text-gray-400">Output:</span> Phone: 000-678-9012
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">ROT18:</div>
                    <div className="flex flex-col md:flex-row md:justify-between bg-zinc-800 p-2 rounded">
                      <div>
                        <span className="text-gray-400">Input:</span> 2023 Update
                      </div>
                      <div>
                        <span className="text-gray-400">Output:</span> 7578 Hcqngr
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="font-medium">ROT47:</div>
                    <div className="flex flex-col md:flex-row md:justify-between bg-zinc-800 p-2 rounded">
                      <div>
                        <span className="text-gray-400">Input:</span> Hello, World!
                      </div>
                      <div>
                        <span className="text-gray-400">Output:</span> w6==@[ (@C=5P
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About ROT13 & Cipher Tools</h2>
        <p className="text-gray-300 mb-4">
          ROT13 (rotate by 13 places) is a simple letter substitution cipher that replaces a letter 
          with the 13th letter after it in the alphabet. It's a special case of the Caesar cipher, 
          developed in ancient Rome.
        </p>
        <p className="text-gray-300 mb-4">
          Key features of this tool:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li><strong>Multiple cipher types:</strong> ROT13 (letters), ROT5 (digits), ROT18 (both), ROT47 (ASCII chars)</li>
          <li><strong>Custom rotation:</strong> Choose any shift value from 1-25 for alphabetic characters</li>
          <li><strong>Flexibility:</strong> Options to preserve case and non-cipher characters</li>
          <li><strong>Bi-directional:</strong> Easily swap output back to input for repeated transformations</li>
        </ul>
        <p className="text-gray-300 mb-4">
          Common uses for ROT13 and rotation ciphers:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Hiding spoilers or solutions in online forums and discussions</li>
          <li>Basic obfuscation of text (not secure encryption)</li>
          <li>Puzzles and simple cryptography challenges</li>
          <li>Educational purposes to demonstrate basic cryptographic concepts</li>
        </ul>
      </div>
    </div>
  );
};

export default Rot13EncoderDecoder;
