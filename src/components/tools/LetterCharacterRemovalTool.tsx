import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const LetterCharacterRemovalTool = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [lettersToRemove, setLettersToRemove] = useState("");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [cleanUpSpaces, setCleanUpSpaces] = useState(true);
  const [copied, setCopied] = useState(false);
  const [textStats, setTextStats] = useState({
    charCount: 0,
    wordCount: 0,
    sentenceCount: 0,
    lineCount: 0,
  });

  useEffect(() => {
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text) => {
    const charCount = text.length;
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const sentenceCount = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const lineCount = text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).filter(Boolean).length;

    setTextStats({
      charCount,
      wordCount,
      sentenceCount,
      lineCount,
    });
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

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setLettersToRemove("");
    updateStats("");
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "modified-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-4">Remove Specific Letters and Characters from Text</h1>
      
      <div className="bg-zinc-800/50 p-5 rounded-lg mb-6">
        <p className="text-gray-300 mb-4">
          Our powerful character removal tool helps you transform text by precisely eliminating unwanted letters, 
          characters, or symbols. Perfect for data cleaning, formatting adjustments, or creative text manipulation.
        </p>
        <p className="text-gray-300">
          Simply input your text, specify which characters to remove, and instantly get refined results that 
          maintain the integrity of your content while removing only what you don't need.
        </p>
      </div>



      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="col-span-2">
          <div className="bg-zinc-800 p-4 rounded-md shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-2">Input Text</h2>
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-2"
            />
            <div className="text-sm text-gray-400">
              Character Count: {textStats.charCount} | Word Count: {textStats.wordCount} | 
              Sentence Count: {textStats.sentenceCount} | Line Count: {textStats.lineCount}
            </div>
          </div>
          
          <div className="bg-zinc-800 p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">Output Text</h2>
            <Textarea
              readOnly
              value={outputText}
              placeholder="Modified text will appear here"
              className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4"
            />
            
            <div className="flex flex-wrap gap-2">
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
                Clear All
              </Button>
              <Button
                variant="outline"
                className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={handleDownload}
                disabled={!outputText}
              >
                Download Text
              </Button>
            </div>
          </div>
        </div>
        
        <div className="col-span-1">
          <div className="bg-zinc-800 p-4 rounded-md shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-4">Letters to Remove</h2>
            <Input
              type="text"
              placeholder="e.g. aeiou123"
              value={lettersToRemove}
              onChange={(e) => setLettersToRemove(e.target.value)}
              className="mb-4 bg-zinc-700 text-white border-zinc-600"
            />
            <p className="text-sm text-gray-400 mb-4">
              Remove these letters from text.
            </p>
            
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
                <p className="text-sm text-muted-foreground text-gray-400">
                  Delete uppercase and lowercase letters separately.
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
                <p className="text-sm text-muted-foreground text-gray-400">
                  If two connected words are completely deleted, then
                  remove the extra space that was formed between them.
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
          </div>
          
          <div className="bg-zinc-800 p-4 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-4">How It Works</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-300 text-sm">
              <li>Enter the characters you want to remove in the "Letters to Remove" box</li>
              <li>Choose whether the removal should be case-sensitive</li>
              <li>Decide if you want to clean up extra spaces after removal</li>
              <li>Click "Remove Characters" to process your text</li>
              <li>Copy or download the modified result</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-8 mb-8 bg-zinc-800 p-6 rounded-md">
        <h2 className="text-2xl font-bold mb-4">Remove Specific Letters and Characters from Text</h2>
        <p className="text-gray-300 mb-4">
          With our intuitive character removal tool, you can transform your text by selectively removing letters, 
          characters, or symbols. Whether you need to clean up messy data, remove unwanted formatting, or modify 
          text for specific requirements, our tool makes it quick and simple to remove precisely what you don't 
          need while preserving everything else.
        </p>
        <p className="text-gray-300 mb-4">
          You can paste a word, a sentence, a paragraph, or even large blocks of text into the input, and completely 
          remove the specified character (or several characters) from it. Simply list the symbols to be deleted in 
          the option, and the program will find all these symbols in the text and remove them.
        </p>
        <p className="text-gray-300">
          For example, after removing the letters "ou" from the phrase "You Can", you'll get the text "Y Can".
          The letters to be removed can be set to be case-sensitive with the "Case Sensitive Removal" option. 
          We've also included the "Clean Up Spaces" option to handle cases where all letters in consecutive 
          words are removed, preventing double or triple spaces in the result.
        </p>
      </div>
    </div>
  );
};

export default LetterCharacterRemovalTool;
