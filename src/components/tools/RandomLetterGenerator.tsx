import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RandomGeneratorLayout from "./RandomGeneratorLayout";

const RandomLetterGenerator = () => {
  const [count, setCount] = useState<number>(10);
  const [caseOption, setCaseOption] = useState<string>("mixed");
  const [format, setFormat] = useState<string>("string");
  const [customAlphabet, setCustomAlphabet] = useState<string>("");
  const [useCustomAlphabet, setUseCustomAlphabet] = useState<boolean>(false);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [excludeVowels, setExcludeVowels] = useState<boolean>(false);
  const [excludeConsonants, setExcludeConsonants] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Generate the alphabet based on selected options
  const getAlphabet = () => {
    if (useCustomAlphabet && customAlphabet.trim()) {
      return customAlphabet.trim();
    }

    let chars = "";
    
    if (caseOption === "uppercase" || caseOption === "mixed") {
      chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
    
    if (caseOption === "lowercase" || caseOption === "mixed") {
      chars += "abcdefghijklmnopqrstuvwxyz";
    }
    
    // Filter out excluded characters
    if (excludeSimilar) {
      const similarChars = "iIlL1oO0";
      chars = chars.split('').filter(char => !similarChars.includes(char)).join('');
    }
    
    if (excludeVowels) {
      const vowels = "AEIOUaeiou";
      chars = chars.split('').filter(char => !vowels.includes(char)).join('');
    }
    
    if (excludeConsonants) {
      const consonants = "BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz";
      chars = chars.split('').filter(char => !consonants.includes(char)).join('');
    }
    
    return chars;
  };

  const generateRandomLetters = () => {
    try {
      const alphabet = getAlphabet();
      
      if (!alphabet) {
        setError("No characters available with current settings. Please adjust your options.");
        return;
      }
      
      if (count < 1 || count > 1000) {
        setError("Number of letters must be between 1 and 1000.");
        return;
      }
      
      setError("");
      
      // Generate random letters
      const letters: string[] = [];
      
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        letters.push(alphabet[randomIndex]);
      }
      
      setResults(letters);
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const getFormattedResult = () => {
    if (!results.length) return "";
    
    switch (format) {
      case "string":
        return results.join("");
      case "comma":
        return results.join(", ");
      case "newline":
        return results.join("\n");
      case "space":
        return results.join(" ");
      default:
        return results.join("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFormattedResult());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([getFormattedResult()], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "random-letters.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setResults([]);
    setCopied(false);
  };

  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        This tool generates random letters based on your preferences. You can choose from uppercase, lowercase, or mixed case letters, and customize the generation with various options.
      </p>
      <p className="text-gray-300 mb-4">Common uses include:</p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Creating random strings for testing</li>
        <li>Generating random character sequences for passwords</li>
        <li>Placeholder text generation</li>
        <li>Educational purposes for teaching probability</li>
        <li>Creating random character samples for font design</li>
      </ul>
      <p className="text-gray-300">
        Simply set your preferred options, choose how many letters you want to generate, and click the generate button.
      </p>
    </>
  );

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="count">Number of Letters</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="bg-zinc-700 text-white border-zinc-600"
            />
          </div>
          
          <div>
            <Label className="mb-2 block">Letter Case</Label>
            <RadioGroup value={caseOption} onValueChange={setCaseOption} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="mixed" value="mixed" />
                <Label htmlFor="mixed">Mixed Case (a-z, A-Z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="uppercase" value="uppercase" />
                <Label htmlFor="uppercase">Uppercase Only (A-Z)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="lowercase" value="lowercase" />
                <Label htmlFor="lowercase">Lowercase Only (a-z)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="format" className="mb-2 block">Output Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format" className="bg-zinc-700 text-white border-zinc-600">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                <SelectItem value="string">Continuous String</SelectItem>
                <SelectItem value="comma">Comma Separated</SelectItem>
                <SelectItem value="space">Space Separated</SelectItem>
                <SelectItem value="newline">New Line Separated</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeSimilar"
                checked={excludeSimilar}
                onCheckedChange={(checked) => setExcludeSimilar(checked as boolean)}
              />
              <Label htmlFor="excludeSimilar">
                Exclude Similar Characters (i, I, l, L, 1, o, O, 0)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeVowels"
                checked={excludeVowels}
                onCheckedChange={(checked) => setExcludeVowels(checked as boolean)}
              />
              <Label htmlFor="excludeVowels">
                Exclude Vowels (a, e, i, o, u)
              </Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="excludeConsonants"
                checked={excludeConsonants}
                onCheckedChange={(checked) => setExcludeConsonants(checked as boolean)}
              />
              <Label htmlFor="excludeConsonants">
                Exclude Consonants (all except a, e, i, o, u)
              </Label>
            </div>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox
                id="useCustomAlphabet"
                checked={useCustomAlphabet}
                onCheckedChange={(checked) => setUseCustomAlphabet(checked as boolean)}
              />
              <Label htmlFor="useCustomAlphabet">
                Use Custom Alphabet
              </Label>
            </div>
            
            {useCustomAlphabet && (
              <>
                <Label htmlFor="customAlphabet">Custom Character Set</Label>
                <Input
                  id="customAlphabet"
                  placeholder="Enter characters to use..."
                  value={customAlphabet}
                  onChange={(e) => setCustomAlphabet(e.target.value)}
                  className="bg-zinc-700 text-white border-zinc-600"
                />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Label className="mb-2">Generated Letters</Label>
        <div className="min-h-[250px] max-h-[450px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
          {results.length > 0 ? (
            <div className="break-words whitespace-pre-wrap">
              {getFormattedResult()}
            </div>
          ) : (
            <p className="text-gray-400 italic">
              Your random letters will appear here
            </p>
          )}
        </div>
        
        <div className="text-sm text-gray-400">
          {results.length > 0 && (
            <p>Generated {results.length} random letter{results.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <RandomGeneratorLayout
      title="Random Letter Generator"
      description="Generate random letters with various options for case, format, and custom alphabets."
      error={error}
      result={results.length > 0 ? results : null}
      onGenerate={generateRandomLetters}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      copied={copied}
      generateButtonText="Generate Letters"
      aboutContent={aboutContent}
    >
      {content}
    </RandomGeneratorLayout>
  );
};

export default RandomLetterGenerator;
