import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ReplaceText = () => {
  // Basic inputs
  const [inputText, setInputText] = useState<string>("");
  const [findText, setFindText] = useState<string>("");
  const [replaceText, setReplaceText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  
  // Options
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [matchWholeWord, setMatchWholeWord] = useState<boolean>(false);
  const [regexMode, setRegexMode] = useState<boolean>(false);
  const [globalReplace, setGlobalReplace] = useState<boolean>(true);
  
  // Batch replace mode
  const [batchMode, setBatchMode] = useState<boolean>(false);
  const [batchReplaceText, setBatchReplaceText] = useState<string>("");
  
  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  const [matchCount, setMatchCount] = useState<number>(0);
  const [regexError, setRegexError] = useState<string | null>(null);
  
  // Process text whenever search conditions change
  useEffect(() => {
    if (inputText && (findText || (batchMode && batchReplaceText))) {
      performReplace();
    } else {
      setOutputText(inputText);
      setMatchCount(0);
    }
  }, [
    inputText, 
    findText, 
    replaceText, 
    caseSensitive, 
    matchWholeWord, 
    regexMode, 
    globalReplace, 
    batchMode,
    batchReplaceText
  ]);
  
  // Main replace logic
  const performReplace = () => {
    setRegexError(null);
    let result = inputText;
    let matches = 0;
    
    try {
      if (batchMode) {
        if (!batchReplaceText.trim()) {
          setOutputText(inputText);
          setMatchCount(0);
          return;
        }
        
        // Process batch replacements
        const replacementPairs = parseBatchReplacements(batchReplaceText);
        
        // Apply each replacement in order
        replacementPairs.forEach(([find, replace]) => {
          if (!find) return;
          
          const count = countMatches(result, find);
          matches += count;
          result = replaceTextInString(result, find, replace);
        });
      } else {
        // Standard single replacement
        if (!findText) {
          setOutputText(inputText);
          setMatchCount(0);
          return;
        }
        
        matches = countMatches(inputText, findText);
        result = replaceTextInString(inputText, findText, replaceText);
      }
      
      setOutputText(result);
      setMatchCount(matches);
    } catch (error) {
      if (error instanceof Error) {
        setRegexError(error.message);
      } else {
        setRegexError("An unknown error occurred");
      }
      setOutputText(inputText);
      setMatchCount(0);
    }
  };
  
  // Count matches in text
  const countMatches = (text: string, find: string): number => {
    if (!find) return 0;
    
    try {
      if (regexMode) {
        // Create regex object
        const flags = caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(find, flags);
        const matches = text.match(regex);
        return matches ? matches.length : 0;
      } else {
        // Handle plain text search
        let count = 0;
        let searchText = text;
        let searchFor = find;
        
        if (!caseSensitive) {
          searchText = searchText.toLowerCase();
          searchFor = searchFor.toLowerCase();
        }
        
        if (matchWholeWord) {
          // Match whole words only
          const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(searchFor)}\\b`, caseSensitive ? 'g' : 'gi');
          const matches = text.match(wordBoundaryRegex);
          return matches ? matches.length : 0;
        } else {
          // Simple indexOf search for plain text
          let startIndex = 0;
          while (startIndex < searchText.length) {
            const index = searchText.indexOf(searchFor, startIndex);
            if (index === -1) break;
            count++;
            startIndex = index + searchFor.length;
          }
          return count;
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setRegexError(error.message);
      }
      return 0;
    }
  };
  
  // Replace text in string
  const replaceTextInString = (text: string, find: string, replace: string): string => {
    if (!find) return text;
    
    try {
      if (regexMode) {
        // Use regex replacement
        const flags = globalReplace ? (caseSensitive ? 'g' : 'gi') : (caseSensitive ? '' : 'i');
        const regex = new RegExp(find, flags);
        return text.replace(regex, replace);
      } else {
        // Use plain text replacement
        if (matchWholeWord) {
          // Replace whole words only
          const wordBoundaryRegex = new RegExp(`\\b${escapeRegExp(find)}\\b`, globalReplace ? (caseSensitive ? 'g' : 'gi') : (caseSensitive ? '' : 'i'));
          return text.replace(wordBoundaryRegex, replace);
        } else if (!caseSensitive) {
          // Case-insensitive replacement requires regex
          const regex = new RegExp(escapeRegExp(find), globalReplace ? 'gi' : 'i');
          return text.replace(regex, replace);
        } else {
          // Simple string replacement for case-sensitive, non-whole word
          if (globalReplace) {
            return text.split(find).join(replace);
          } else {
            // Replace first occurrence only
            const index = text.indexOf(find);
            if (index === -1) return text;
            return text.substring(0, index) + replace + text.substring(index + find.length);
          }
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        setRegexError(error.message);
      }
      return text;
    }
  };
  
  // Parse batch replacements from text
  const parseBatchReplacements = (text: string): [string, string][] => {
    // Split by lines
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    
    // Parse each line as find=>replace or find->replace
    return lines.map(line => {
      // Handle different separators
      const separators = ['=>', '->', ':', '=', '|'];
      let separator = '';
      
      for (const sep of separators) {
        if (line.includes(sep)) {
          separator = sep;
          break;
        }
      }
      
      if (!separator) {
        // If no separator is found, assume the line is a search term with empty replacement
        return [line.trim(), ''];
      }
      
      const [find, replace] = line.split(separator, 2);
      return [find.trim(), replace ? replace.trim() : ''];
    });
  };
  
  // Escape regex special characters for plain text search
  const escapeRegExp = (string: string): string => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  // Copy result to clipboard
  const handleCopy = () => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear all fields
  const handleClear = () => {
    setInputText("");
    setFindText("");
    setReplaceText("");
    setOutputText("");
    setBatchReplaceText("");
    setMatchCount(0);
    setRegexError(null);
  };
  
  // Toggle batch mode
  const handleToggleBatchMode = () => {
    setBatchMode(!batchMode);
    setRegexError(null);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Text Replacement Tool</h1>
      <p className="text-gray-300 mb-6">
        Find and replace text with support for regular expressions and batch operations.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div>
          <Label htmlFor="input-text" className="block mb-2">Text to Search</Label>
          <Textarea
            id="input-text"
            placeholder="Enter or paste your text here"
            className="w-full min-h-[150px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <Tabs defaultValue="single" onValueChange={(value) => setBatchMode(value === "batch")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="single">Single Replacement</TabsTrigger>
              <TabsTrigger value="batch">Batch Replacement</TabsTrigger>
            </TabsList>
            
            <TabsContent value="single" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="find-text" className="block mb-2">Find</Label>
                <Input
                  id="find-text"
                  placeholder={regexMode ? "Regular Expression" : "Text to find"}
                  className="bg-zinc-700 text-white border-zinc-600"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="replace-text" className="block mb-2">Replace With</Label>
                <Input
                  id="replace-text"
                  placeholder="Replacement text"
                  className="bg-zinc-700 text-white border-zinc-600"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="batch" className="space-y-4 mt-4">
              <div>
                <Label htmlFor="batch-replace-text" className="block mb-2">Batch Replacements</Label>
                <Textarea
                  id="batch-replace-text"
                  placeholder="One replacement per line: find{'=>'}replace"
                  className="w-full min-h-[100px] bg-zinc-700 text-white border-zinc-600"
                  value={batchReplaceText}
                  onChange={(e) => setBatchReplaceText(e.target.value)}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Format: find{'=>'}replace or find{'->'}replace (one per line)
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="output-text">Result</Label>
            <div className="text-sm text-gray-400">
              {matchCount > 0 && (
                <span>{matchCount} match{matchCount !== 1 ? 'es' : ''} found</span>
              )}
            </div>
          </div>
          
          {regexError && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>Error: {regexError}</AlertDescription>
            </Alert>
          )}
          
          <Textarea
            id="output-text"
            readOnly
            className="w-full min-h-[150px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={outputText}
            placeholder="Result will appear here"
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={handleCopy}
              disabled={!outputText}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
      
      {/* Options */}
      <div className="mt-6 bg-zinc-700 p-4 rounded">
        <h3 className="text-lg font-medium mb-3">Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="case-sensitive" 
              checked={caseSensitive}
              onCheckedChange={(checked) => setCaseSensitive(!!checked)}
            />
            <Label htmlFor="case-sensitive" className="cursor-pointer">Case sensitive</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="match-whole-word" 
              checked={matchWholeWord}
              onCheckedChange={(checked) => setMatchWholeWord(!!checked)}
              disabled={regexMode}
            />
            <Label 
              htmlFor="match-whole-word" 
              className={`cursor-pointer ${regexMode ? 'text-gray-400' : ''}`}
            >
              Match whole word only
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="regex-mode" 
              checked={regexMode}
              onCheckedChange={(checked) => {
                setRegexMode(!!checked);
                if (checked) {
                  setMatchWholeWord(false);
                }
              }}
            />
            <Label htmlFor="regex-mode" className="cursor-pointer">Use regular expressions</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="global-replace" 
              checked={globalReplace}
              onCheckedChange={(checked) => setGlobalReplace(!!checked)}
            />
            <Label htmlFor="global-replace" className="cursor-pointer">Replace all occurrences</Label>
          </div>
        </div>
      </div>
      
      {/* About Section */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Text Replacement Tool</h2>
        <p className="text-gray-300 mb-4">
          This tool allows you to find and replace text with a variety of options to suit your needs:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li><strong>Single Mode:</strong> Perform a simple find and replace operation.</li>
          <li><strong>Batch Mode:</strong> Make multiple replacements at once by specifying multiple find/replace pairs.</li>
          <li><strong>Regular Expressions:</strong> Use powerful pattern matching to find and replace text.</li>
          <li><strong>Case Sensitivity:</strong> Choose whether to match text case-sensitively.</li>
          <li><strong>Whole Word Matching:</strong> Match only complete words, not parts of words.</li>
        </ul>
        <p className="text-gray-300 mb-4">
          Use cases include:
        </p>
        <ul className="list-disc list-inside text-gray-300 space-y-1">
          <li>Reformatting text documents</li>
          <li>Correcting repetitive mistakes</li>
          <li>Standardizing terminology</li>
          <li>Data cleaning and transformation</li>
          <li>Search and replace in code</li>
        </ul>
      </div>
    </div>
  );
};

export default ReplaceText;
