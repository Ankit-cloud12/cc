import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const LetterCharacterRemovalTool: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [lettersToRemove, setLettersToRemove] = useState("");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [cleanUpSpaces, setCleanUpSpaces] = useState(true);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    setSentenceCount(text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length);
    setLineCount(text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).filter(Boolean).length);
  };

  const removeLetters = () => {
    if (!inputText || !lettersToRemove) {
      return;
    }

    let result = inputText;
    let charsToRemove = lettersToRemove;

    // Create regex pattern based on user input
    let pattern;
    if (isCaseSensitive) {
      // Case sensitive - create a pattern with each character exactly as specified
      pattern = new RegExp(`[${charsToRemove.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`, 'g');
    } else {
      // Case insensitive - create a pattern that matches both uppercase and lowercase
      const escapedChars = charsToRemove.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      pattern = new RegExp(`[${escapedChars}]`, 'gi');
    }

    // Remove the specified characters
    result = result.replace(pattern, '');

    // Clean up multiple spaces if the option is selected
    if (cleanUpSpaces) {
      result = result.replace(/\s+/g, ' ').trim();
    }

    setOutputText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setLettersToRemove("");
    setCharCount(0);
    setWordCount(0);
    setSentenceCount(0);
    setLineCount(0);
  };

  const handleDownload = () => {
    if (!outputText) return;
    
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "modified-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Remove Letters & Characters" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Remove Specific Letters and Characters</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Transform your text by precisely eliminating unwanted letters, characters, or symbols.
        </p>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Input Column */}
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
          </div>
          
          {/* Output Column */}
          <div className="w-full md:w-1/2 flex flex-col">
            <Textarea
              readOnly
              placeholder="Modified text will appear here"
              value={outputText}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-2"
            />
            
            {/* Actions Row - Right aligned */}
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              <Button 
                variant="outline" 
                onClick={handleCopy} 
                disabled={!outputText}
                className="border-zinc-600"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownload} 
                disabled={!outputText}
                className="border-zinc-600"
              >
                Download
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleClear}
                className="border-zinc-600"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        {/* Settings and Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Settings Column */}
          <div className="col-span-2">
            <Card className="p-4 bg-zinc-800 border-zinc-700">
              <h2 className="text-lg font-semibold mb-4">Removal Settings</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Letters to Remove</label>
                <Input
                  type="text"
                  placeholder="e.g. aeiou123"
                  value={lettersToRemove}
                  onChange={(e) => setLettersToRemove(e.target.value)}
                  className="bg-zinc-700 text-white border-zinc-600"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the characters you want to remove
                </p>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="case-sensitive"
                  checked={isCaseSensitive}
                  onCheckedChange={(checked) => setIsCaseSensitive(!!checked)}
                />
                <div>
                  <label
                    htmlFor="case-sensitive"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Case Sensitive Removal
                  </label>
                  <p className="text-xs text-gray-400">
                    Delete uppercase and lowercase letters separately
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox
                  id="clean-spaces"
                  checked={cleanUpSpaces}
                  onCheckedChange={(checked) => setCleanUpSpaces(!!checked)}
                />
                <div>
                  <label
                    htmlFor="clean-spaces"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Clean Up Spaces
                  </label>
                  <p className="text-xs text-gray-400">
                    Remove extra spaces between words after character removal
                  </p>
                </div>
              </div>
              
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                onClick={removeLetters}
                disabled={!inputText || !lettersToRemove}
              >
                Remove Characters
              </Button>
            </Card>
          </div>
          
          {/* Stats Card */}
          <div className="col-span-1">
            <Card className="p-4 bg-zinc-800 border-zinc-700">
              <h3 className="font-medium mb-3">Text Statistics</h3>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Character Count</span>
                  <span className="text-xl font-semibold">{charCount}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Word Count</span>
                  <span className="text-xl font-semibold">{wordCount}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Sentence Count</span>
                  <span className="text-xl font-semibold">{sentenceCount}</span>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Line Count</span>
                  <span className="text-xl font-semibold">{lineCount}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-zinc-700">How It Works</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Character Removal Tool</h3>
            <p className="mb-4">
              With our intuitive character removal tool, you can transform your text by selectively removing letters, 
              characters, or symbols. Whether you need to clean up messy data, remove unwanted formatting, or modify 
              text for specific requirements, our tool makes it quick and simple to remove precisely what you don't 
              need while preserving everything else.
            </p>
            <p className="mb-4">
              This tool is great for:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Cleaning up formatted text</li>
              <li>Removing specific characters from datasets</li>
              <li>Stripping unwanted symbols from copied content</li>
              <li>Creating word puzzles by removing certain letters</li>
              <li>Data preparation and text processing workflows</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="settings" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">How The Tool Works</h3>
            <p className="mb-4">
              Our character removal tool works by identifying and eliminating specific characters from your text:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Enter the characters you want to remove in the "Letters to Remove" box</li>
              <li>Choose whether the removal should be case-sensitive with the checkbox</li>
              <li>Decide if you want to clean up extra spaces after removal</li>
              <li>Click "Remove Characters" to process your text</li>
              <li>Copy or download the modified result</li>
            </ol>
            <p className="text-sm text-gray-400">
              For example, after removing the letters "ou" from the phrase "You Can", you'll get the text "Y Can".
              If case sensitivity is enabled, only the exact characters specified will be removed.
            </p>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>To remove vowels, enter "aeiou" in the Letters to Remove field</li>
              <li>If you need to remove punctuation, enter punctuation marks like ",.!?;"</li>
              <li>Use case sensitivity when you want to remove only lowercase or only uppercase versions of letters</li>
              <li>When removing multiple characters that might create double spaces, keep "Clean Up Spaces" enabled</li>
              <li>Special characters like \ [ ] and ^ may need a backslash before them (e.g., \[) to work properly</li>
              <li>You can combine character removal with other text tools for more complex transformations</li>
            </ul>
            <p className="text-sm text-gray-400">
              Note: When removing characters that are part of special sequences (like HTML tags), be careful not to
              create unintended side effects in your text structure.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default LetterCharacterRemovalTool;
