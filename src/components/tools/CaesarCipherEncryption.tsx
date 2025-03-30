import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import CodeTranslationLayout from "./CodeTranslationLayout";

interface FrequencyAnalysis {
  [key: string]: number;
}

const CaesarCipherEncryption = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [shift, setShift] = useState(13); // Default to ROT13
  const [mode, setMode] = useState<"encrypt" | "decrypt" | "bruteforce">("encrypt");
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [useCustomAlphabet, setUseCustomAlphabet] = useState(false);
  const [customAlphabet, setCustomAlphabet] = useState("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
  const [copied, setCopied] = useState(false);
  const [bruteforceResults, setBruteforceResults] = useState<string[]>([]);
  const [autocomplete, setAutocomplete] = useState(false);
  const [frequencyAnalysis, setFrequencyAnalysis] = useState<FrequencyAnalysis>({});
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // English letter frequency for analysis
  const englishFrequency: { [key: string]: number } = {
    'e': 12.02, 't': 9.10, 'a': 8.12, 'o': 7.68, 'i': 7.31, 'n': 6.95, 's': 6.28, 'r': 6.02, 
    'h': 5.92, 'd': 4.32, 'l': 3.98, 'u': 2.88, 'c': 2.71, 'm': 2.61, 'f': 2.30, 'y': 2.11, 
    'w': 2.09, 'g': 2.03, 'p': 1.82, 'b': 1.49, 'v': 1.11, 'k': 0.69, 'x': 0.17, 'q': 0.11, 
    'j': 0.10, 'z': 0.07
  };

  // Update output when input, shift, or mode changes
  useEffect(() => {
    if (inputText) {
      processText();
    }
  }, [inputText, shift, mode, preserveFormatting, useCustomAlphabet, customAlphabet, autocomplete]);

  // Update frequency analysis when input text changes
  useEffect(() => {
    if (inputText) {
      analyzeFrequency(inputText);
    } else {
      setFrequencyAnalysis({});
    }
  }, [inputText]);

  const analyzeFrequency = (text: string) => {
    const frequency: FrequencyAnalysis = {};
    const totalChars = text.length;
    
    // Count the frequency of each character
    for (const char of text.toLowerCase()) {
      if (/[a-z]/.test(char)) {
        frequency[char] = (frequency[char] || 0) + 1;
      }
    }
    
    // Convert to percentages
    for (const char in frequency) {
      frequency[char] = parseFloat(((frequency[char] / totalChars) * 100).toFixed(2));
    }
    
    setFrequencyAnalysis(frequency);
  };

  const processText = () => {
    setIsProcessing(true);
    setError("");
    
    try {
      if (mode === "bruteforce") {
        const results: string[] = [];
        const maxShift = useCustomAlphabet ? customAlphabet.length : 26;
        
        for (let i = 1; i <= maxShift; i++) {
          const processedText = processCipher(inputText, i, "decrypt", preserveFormatting);
          results.push(processedText);
        }
        
        setBruteforceResults(results);
        setOutputText(results.join('\n\n---\n\n'));
      } else {
        const processedText = processCipher(inputText, shift, mode, preserveFormatting);
        setOutputText(processedText);
        setBruteforceResults([]);
      }
    } catch (err) {
      setError(`Failed to process text: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const processCipher = (text: string, shiftValue: number, cipherMode: string, preserve: boolean) => {
    // Define the alphabet based on custom setting
    const alphabet = useCustomAlphabet 
      ? customAlphabet
      : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    
    const upperAlphabet = alphabet.match(/[A-Z]+/g)?.join('') || '';
    const lowerAlphabet = alphabet.match(/[a-z]+/g)?.join('') || '';
    
    // Adjust shift for decryption
    const actualShift = cipherMode === "decrypt" ? -shiftValue : shiftValue;
    
    return text.split('').map(char => {
      // If preserving formatting, handle non-alphabetic characters
      if (preserve && !alphabet.includes(char)) {
        return char;
      }
      
      // Handle uppercase letters
      if (upperAlphabet.includes(char)) {
        const idx = upperAlphabet.indexOf(char);
        const shiftedIdx = (idx + actualShift) % upperAlphabet.length;
        return upperAlphabet[(shiftedIdx + upperAlphabet.length) % upperAlphabet.length];
      }
      
      // Handle lowercase letters
      if (lowerAlphabet.includes(char)) {
        const idx = lowerAlphabet.indexOf(char);
        const shiftedIdx = (idx + actualShift) % lowerAlphabet.length;
        return lowerAlphabet[(shiftedIdx + lowerAlphabet.length) % lowerAlphabet.length];
      }
      
      // Return unchanged if not in the alphabet
      return char;
    }).join('');
  };

  const autoDetectShift = () => {
    if (!inputText) return;
    
    // Analyze each possible shift value and find the one with highest correlation to English letter frequency
    let bestScore = -Infinity;
    let bestShift = 0;
    
    for (let s = 1; s <= 25; s++) {
      const decrypted = processCipher(inputText, s, "decrypt", true);
      const score = calculateEnglishScore(decrypted);
      
      if (score > bestScore) {
        bestScore = score;
        bestShift = s;
      }
    }
    
    setShift(bestShift);
    setMode("decrypt");
  };

  const calculateEnglishScore = (text: string) => {
    // Calculate frequency of each letter in the text
    const freq: {[key: string]: number} = {};
    let total = 0;
    
    for (const char of text.toLowerCase()) {
      if (/[a-z]/.test(char)) {
        freq[char] = (freq[char] || 0) + 1;
        total++;
      }
    }
    
    // Calculate correlation with English frequency
    let score = 0;
    for (const char in englishFrequency) {
      const observed = freq[char] ? (freq[char] / total) * 100 : 0;
      const expected = englishFrequency[char];
      
      // Reward letters with frequencies close to English
      score -= Math.abs(observed - expected);
    }
    
    return score;
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
    element.download = `${mode === "encrypt" ? "encrypted" : "decrypted"}-text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setInputText("");
    setOutputText("");
    setShift(13);
    setMode("encrypt");
    setPreserveFormatting(true);
    setUseCustomAlphabet(false);
    setCustomAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
    setBruteforceResults([]);
    setFrequencyAnalysis({});
    setError("");
  };

  const quickSetROT13 = () => {
    setShift(13);
  };

  const toggleROT47 = () => {
    const rot47Alphabet = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
    setUseCustomAlphabet(true);
    setCustomAlphabet(rot47Alphabet);
    setShift(47);
  };

  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        The Caesar Cipher is one of the oldest and simplest encryption techniques. It works by shifting each letter in the plaintext by a fixed number of positions in the alphabet.
      </p>
      
      <p className="text-gray-300 mb-4">
        ROT13 is a special case of the Caesar Cipher where the shift is 13 places, which is useful because applying it twice returns the original text (since 13 is half of 26, the length of the English alphabet).
      </p>
      
      <p className="text-gray-300 mb-4">Key features of this tool:</p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Encrypt or decrypt text using any shift value (1-25)</li>
        <li>Brute force option to show all possible shifts</li>
        <li>Option to preserve formatting and non-alphabetic characters</li>
        <li>Support for custom alphabets (including ROT47)</li>
        <li>Frequency analysis to help break encryptions</li>
        <li>Auto-detection of the most likely shift value</li>
      </ul>
      
      <p className="text-gray-300 mb-4">
        <strong>Note:</strong> While the Caesar Cipher is historically significant, it is not secure for modern encryption needs as it can be easily broken by frequency analysis or brute force methods.
      </p>
    </>
  );

  return (
    <CodeTranslationLayout
      title="Caesar Cipher Encryption"
      description="Encrypt and decrypt text using the Caesar cipher method, including ROT13 and custom alphabets. This tool performs simple substitution cipher encoding by shifting letters of the alphabet."
      onProcess={processText}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      processButtonText={mode === "encrypt" ? "Encrypt" : mode === "decrypt" ? "Decrypt" : "Show All Shifts"}
      copied={copied}
      result={outputText}
      error={error}
      isProcessing={isProcessing}
      aboutContent={aboutContent}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
        {/* Left Column - Input */}
        <div className="flex flex-col space-y-4">
          <Label>Input Text</Label>
          <Textarea 
            placeholder="Enter text to encrypt/decrypt..."
            className="min-h-[250px] max-h-[450px] bg-zinc-700 text-white border-zinc-600 resize-y"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="space-y-4 mt-4">
            {/* Quick preset buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                onClick={quickSetROT13}
              >
                ROT13
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                onClick={toggleROT47}
              >
                ROT47
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-zinc-800 hover:bg-zinc-700 text-white border-zinc-600"
                onClick={autoDetectShift}
                disabled={!inputText}
              >
                Auto-Detect Shift
              </Button>
            </div>
            
            {/* Operation Mode Selection */}
            <div>
              <Label className="mb-2 block">Operation</Label>
              <RadioGroup value={mode} onValueChange={(value) => setMode(value as "encrypt" | "decrypt" | "bruteforce")} className="space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="encrypt" value="encrypt" />
                  <Label htmlFor="encrypt">Encrypt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="decrypt" value="decrypt" />
                  <Label htmlFor="decrypt">Decrypt</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem id="bruteforce" value="bruteforce" />
                  <Label htmlFor="bruteforce">Brute Force (show all shifts)</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Shift Value Control */}
            {mode !== "bruteforce" && (
              <div>
                <Label>Shift Value: {shift}</Label>
                <div className="flex items-center space-x-2">
                  <Slider 
                    value={[shift]} 
                    min={1} 
                    max={useCustomAlphabet ? customAlphabet.length - 1 : 25} 
                    step={1} 
                    onValueChange={(value) => setShift(value[0])} 
                  />
                  <span className="w-8 text-center">{shift}</span>
                </div>
                {shift === 13 && !useCustomAlphabet && (
                  <p className="text-xs text-green-400 mt-1">ROT13</p>
                )}
              </div>
            )}
            
            {/* Options */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="preserveFormatting"
                  checked={preserveFormatting}
                  onCheckedChange={(checked) => setPreserveFormatting(!!checked)}
                />
                <Label htmlFor="preserveFormatting">
                  Preserve Formatting (spaces, punctuation, etc.)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useCustomAlphabet"
                  checked={useCustomAlphabet}
                  onCheckedChange={(checked) => setUseCustomAlphabet(!!checked)}
                />
                <Label htmlFor="useCustomAlphabet">
                  Use Custom Alphabet
                </Label>
              </div>
              
              {useCustomAlphabet && (
                <div className="pl-6">
                  <Label htmlFor="customAlphabet" className="mb-1 block">Custom Alphabet</Label>
                  <Input 
                    id="customAlphabet"
                    placeholder="Enter custom alphabet..." 
                    value={customAlphabet}
                    onChange={(e) => setCustomAlphabet(e.target.value)}
                    className="bg-zinc-700 text-white border-zinc-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    The order of characters will determine the shift pattern.
                  </p>
                </div>
              )}
              
              {mode === "decrypt" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autocomplete"
                    checked={autocomplete}
                    onCheckedChange={(checked) => setAutocomplete(!!checked)}
                  />
                  <Label htmlFor="autocomplete">
                    Show Frequency Analysis
                  </Label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Output */}
        <div className="flex flex-col space-y-4">
          <Tabs defaultValue="output" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="output" className="flex-grow">Output</TabsTrigger>
              {(mode === "bruteforce" && bruteforceResults.length > 0) && (
                <TabsTrigger value="bruteforce" className="flex-grow">All Shifts</TabsTrigger>
              )}
              {(mode === "decrypt" && autocomplete && Object.keys(frequencyAnalysis).length > 0) && (
                <TabsTrigger value="analysis" className="flex-grow">Frequency Analysis</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="output">
              <div className="min-h-[250px] max-h-[450px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
                {outputText ? (
                  <div className="whitespace-pre-wrap break-words">{outputText}</div>
                ) : (
                  <p className="text-gray-400 italic">
                    Your result will appear here
                  </p>
                )}
              </div>
            </TabsContent>
            
            {(mode === "bruteforce" && bruteforceResults.length > 0) && (
              <TabsContent value="bruteforce">
                <div className="min-h-[250px] max-h-[450px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
                  {bruteforceResults.map((result, index) => (
                    <div key={index} className="mb-3">
                      <div className="font-bold text-sm text-blue-300">Shift {index + 1}:</div>
                      <div className="p-2 bg-zinc-800 rounded whitespace-pre-wrap break-words">{result}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
            
            {(mode === "decrypt" && autocomplete && Object.keys(frequencyAnalysis).length > 0) && (
              <TabsContent value="analysis">
                <div className="min-h-[250px] max-h-[450px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Letter Frequency Analysis</h3>
                    <p className="text-sm text-gray-400 mb-2">
                      In English, the most frequent letters are E, T, A, O, I, N, S, H, R, D, L, U.
                      Comparing the frequency analysis of your ciphertext can help identify the shift.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {Object.entries(frequencyAnalysis)
                      .sort(([, freqA], [, freqB]) => freqB - freqA)
                      .map(([char, freq]) => (
                        <div key={char} className="bg-zinc-800 p-2 rounded text-center">
                          <div className="text-xl font-bold">{char}</div>
                          <div className="text-sm text-gray-300">{freq}%</div>
                          <Progress value={freq * 4} className="h-1 mt-1" />
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
          
          <div className="text-sm text-gray-400">
            {inputText && mode !== "bruteforce" && (
              <p>
                {mode === "encrypt" ? "Encrypted" : "Decrypted"} using shift of {shift} 
                {shift === 13 && !useCustomAlphabet ? " (ROT13)" : ""}
              </p>
            )}
            {mode === "bruteforce" && bruteforceResults.length > 0 && (
              <p>Generated all {bruteforceResults.length} possible shifts</p>
            )}
          </div>
        </div>
      </div>
    </CodeTranslationLayout>
  );
};

export default CaesarCipherEncryption;
