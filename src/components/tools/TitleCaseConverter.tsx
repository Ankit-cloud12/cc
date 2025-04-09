import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout"; // Import ToolLayout
import { Card } from "@/components/ui/card"; // Import Card for consistency
import { cn } from "@/lib/utils"; // Import cn if needed for conditional classes

// Title case style types
type TitleCaseStyle = "ama" | "ap" | "apa" | "bluebook" | "chicago" | "mla" | "nyt" | "wikipedia";

// SEO-focused content for About tab
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Title Case Converter</h3>
    <p className="mb-4">
      Our smart Title Case Converter helps you capitalize titles correctly according to various style guides, including Chicago, APA, MLA, AP, NY Times, and more. It intelligently handles articles, prepositions, and conjunctions based on the selected style.
    </p>
    <p className="mb-4">
      Ensure your headlines, blog post titles, book titles, and other headings are perfectly formatted. This free online tool saves you time and helps maintain consistency across your writing. Choose your style guide and convert your text instantly.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">title case converter, headline capitalization, title capitalization tool, Chicago style title case, APA title case, MLA title case, AP title case, online text tool, text case converter</p>
  </>
);

// SEO-focused content for Usage Tips tab
const usageTipsContent = (
  <>
    <h3 className="font-medium mb-2">How to Use the Title Case Converter</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Title:</strong> Type or paste the title or headline you want to convert into the main input box.</li>
      <li><strong>Select Style:</strong> Choose the desired capitalization style (e.g., Chicago, APA, MLA) from the radio buttons.</li>
      <li><strong>Convert:</strong> Click the "Convert" button (or enable auto-convert on paste).</li>
      <li><strong>View Results:</strong> The correctly formatted title case will appear below the style options. You can also see Sentence case, lowercase, and UPPERCASE versions in the tabs below.</li>
      <li><strong>Options:</strong> Use the checkboxes to customize behavior, like keeping words in all caps or enabling multi-line input for lists.</li>
      <li><strong>Copy/Download:</strong> Use the "Copy" button next to each output or download the main title case result.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: Different publications and academic fields use different title case rules. Select the style guide that matches your requirements.
    </p>
  </>
);


export const TitleCaseConverter = () => {
  const [inputText, setInputText] = useState("");
  const [titleCaseText, setTitleCaseText] = useState("");
  const [sentenceCaseText, setSentenceCaseText] = useState("");
  const [lowerCaseText, setLowerCaseText] = useState("");
  const [upperCaseText, setUpperCaseText] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<TitleCaseStyle>("chicago");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [keepAllCaps, setKeepAllCaps] = useState(true);
  const [multiLineMode, setMultiLineMode] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false); // Keep state if needed for future features
  const [highlightChanges, setHighlightChanges] = useState(false); // Keep state if needed for future features
  const [useStraightQuotes, setUseStraightQuotes] = useState(false);
  const [convertOnPaste, setConvertOnPaste] = useState(true);
  const [copiedStates, setCopiedStates] = useState({
    title: false,
    sentence: false,
    lower: false,
    upper: false,
  });
  
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Update text metrics when input changes
  useEffect(() => {
    if (inputText) {
      setWordCount(inputText.trim().split(/\s+/).filter(Boolean).length);
      setCharCount(inputText.length);
      setLineCount(inputText.split(/\r\n|\r|\n/).length);
    } else {
      setWordCount(0);
      setCharCount(0);
      setLineCount(0);
    }
  }, [inputText]);

  // Convert text based on selected options
  const convertText = () => {
    if (!inputText.trim()) {
      // Clear outputs if input is empty
      setTitleCaseText("");
      setSentenceCaseText("");
      setLowerCaseText("");
      setUpperCaseText("");
      return;
    };

    // Convert to title case with selected style
    const titleCaseResult = applyTitleCaseStyle(inputText, selectedStyle);
    setTitleCaseText(titleCaseResult);

    // Convert to sentence case
    setSentenceCaseText(applySentenceCase(inputText));

    // Convert to lower and upper case
    setLowerCaseText(inputText.toLowerCase());
    setUpperCaseText(inputText.toUpperCase());
  };

  // Apply title case conversion based on selected style
  const applyTitleCaseStyle = (text: string, style: TitleCaseStyle): string => {
    if (multiLineMode) {
      return text.split(/\r\n|\r|\n/).map(line => processSingleTitle(line, style)).join('\n');
    } else {
      return processSingleTitle(text, style);
    }
  };
  
  // Process a single title with the selected style
  const processSingleTitle = (text: string, style: TitleCaseStyle): string => {
    const words = text.split(' ');
    const titleCaseWords = words.map((word, index) => {
      if (!word) return word;
      if (keepAllCaps && word === word.toUpperCase() && word.length > 1) return word;
      if (index === 0) return capitalizeFirstLetter(word);
      if (index === words.length - 1 && ["ap", "chicago", "mla", "nyt", "wikipedia"].includes(style)) return capitalizeFirstLetter(word);
      if (shouldBeLowercase(word, style, words, index)) return word.toLowerCase(); // Pass words and index
      return capitalizeFirstLetter(word);
    });
    return useStraightQuotes ? titleCaseWords.join(' ') : applySmartQuotes(titleCaseWords.join(' '));
  };

  // Helper function to determine if a word should be lowercase based on style
  // Added words and index parameters for context-dependent rules
  const shouldBeLowercase = (word: string, style: TitleCaseStyle, words: string[], index: number): boolean => {
    const lowerWord = word.toLowerCase();
    const articles = ["a", "an", "the"];
    if (articles.includes(lowerWord)) return true;

    const coordinatingConjunctions = ["and", "but", "or", "nor", "for", "yet", "so"];
    if (coordinatingConjunctions.includes(lowerWord)) {
      if (style === "nyt" && ["nor", "yet", "so"].includes(lowerWord)) return false;
      if (style === "chicago" && ["yet", "so"].includes(lowerWord)) return false;
      return true;
    }

    const shortPrepositions = ["at", "by", "in", "of", "on", "to", "up", "as", "if", "off", "out", "via"];
    const mediumPrepositions = ["from", "into", "like", "near", "over", "with", "upon"];

    if (shortPrepositions.includes(lowerWord)) {
      if (style === "nyt" && ["up", "off", "out"].includes(lowerWord)) return false;
      if (style === "mla") return true;
      if (lowerWord === "if") return ["ama", "ap", "apa", "nyt"].includes(style);
      if (lowerWord === "as") return ["ap", "apa", "nyt"].includes(style);
      // Check if preposition is last word for specific styles
      if ((style === "ama" || style === "apa" || style === "bluebook") && index === words.length - 1) return false; 
      return true;
    }

    if (mediumPrepositions.includes(lowerWord)) {
      if (["ama", "ap", "apa", "nyt"].includes(style)) return false;
      if (style === "mla") return true;
       // Check if preposition is last word for specific styles
      if ((style === "ama" || style === "apa" || style === "bluebook") && index === words.length - 1) return false;
      return true; // For bluebook, chicago, wikipedia
    }

    return false;
  };

  // Apply sentence case (capitalize first letter, proper nouns)
  const applySentenceCase = (text: string): string => {
    if (multiLineMode) {
      return text.split(/\r\n|\r|\n/).map(line => processSentenceCase(line)).join('\n');
    } else {
      return processSentenceCase(text);
    }
  };

  // Process a single line for sentence case
  const processSentenceCase = (text: string): string => {
    if (!text) return text;
    const sentences = text.split(/(?<=[.!?])\s+/);
    return sentences.map(sentence => {
      if (!sentence) return sentence;
      // Trim leading/trailing whitespace before capitalizing
      const trimmedSentence = sentence.trim();
      if (!trimmedSentence) return sentence; // Handle empty/whitespace-only sentences
      return trimmedSentence.charAt(0).toUpperCase() + trimmedSentence.slice(1).toLowerCase();
    }).join(' '); // Ensure single space between sentences
  };

  // Capitalize first letter of a word, leave rest as is (make rest lowercase)
  const capitalizeFirstLetter = (word: string): string => {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  // Apply smart quotes typography
  const applySmartQuotes = (text: string): string => {
    return text
      .replace(/(\s|^)"(\S)/g, '$1“$2')  // Opening double quotes
      .replace(/(\S)"(\s|$|[.,;!?])/g, '$1”$2')  // Closing double quotes
      .replace(/"/g, '”') // Replace remaining straight doubles with closing
      .replace(/(\s|^)'(\S)/g, '$1‘$2')  // Opening single quotes
      .replace(/(\S)'(\s|$|[.,;!?])/g, '$1’$2')  // Closing single quotes (apostrophes)
      .replace(/'/g, '’') // Replace remaining straight singles with closing/apostrophe
      .replace(/--/g, '—')  // Em dash
      .replace(/\.{3}/g, '…')  // Ellipsis
      .replace(/(\s+)([.,;:!?])/g, '$2');  // Remove spaces before punctuation
  };

  // Handle text input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (convertOnPaste) { // Trigger conversion immediately if option is on
       setTimeout(convertText, 0); // Use timeout to allow state update
    }
  };
  
   // Trigger conversion when options change if there's input text
  useEffect(() => {
    if (inputText) {
      convertText();
    }
  }, [selectedStyle, keepAllCaps, multiLineMode, useStraightQuotes]); // Add dependencies


  // Handle style selection
  const handleStyleChange = (style: string) => {
    setSelectedStyle(style as TitleCaseStyle);
    // Conversion is now handled by the useEffect hook
  };

  // Handle conversion on button click (still useful if auto-convert is off)
  const handleConvertClick = () => {
    convertText();
  };

  // Handle key press events
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!multiLineMode && e.key === 'Enter') {
      e.preventDefault();
      convertText();
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      convertText();
    }
  };

  // Handle copy to clipboard for specific output
  const handleCopy = (text: string, type: 'title' | 'sentence' | 'lower' | 'upper') => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [type]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [type]: false })), 2000);
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    if (convertOnPaste) {
      // Let the input change handler trigger the conversion
    }
  };

  // Reset all inputs
  const handleClear = () => {
    setInputText("");
    setTitleCaseText("");
    setSentenceCaseText("");
    setLowerCaseText("");
    setUpperCaseText("");
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    // Wrap with ToolLayout
    <ToolLayout title="Title Case Converter" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div for consistency */}
        <h1 className="text-3xl font-bold mb-2">Title Case Converter</h1>
        <p className="text-gray-300 mb-6">A Smart Title Capitalization Tool - Choose your style guide (Chicago, APA, MLA, etc.)</p>
        
        {/* Main content area using Card for consistency */}
        <Card className="p-4 mb-6 bg-zinc-800 border-zinc-700">
          <div className="mb-4">
            <Textarea
              ref={textInputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              placeholder="Enter your title or headline here..."
              className="w-full min-h-[100px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize" // Added padding
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{wordCount} word{wordCount !== 1 ? 's' : ''} • {charCount} character{charCount !== 1 ? 's' : ''} • {lineCount} line{lineCount !== 1 ? 's' : ''}</span>
              <Button 
                onClick={handleClear} 
                variant="outline" 
                size="sm"
                className="border-zinc-600 text-gray-300 hover:text-white hover:bg-zinc-700" // Consistent button style
              >
                Clear
              </Button>
            </div>
          </div>
          
          {/* Convert button - less prominent if auto-convert is on */}
          {!convertOnPaste && (
             <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  onClick={handleConvertClick} 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Convert
                </Button>
             </div>
          )}
          
          {/* Title Case Output and Style Selection */}
          <div className="space-y-4 mb-6">
            <div>
              <Label className="block mb-2 font-medium">Title Case Style:</Label>
              <div className="flex gap-2 flex-wrap mb-2">
                <RadioGroup 
                  value={selectedStyle} 
                  onValueChange={handleStyleChange}
                  className="flex flex-wrap gap-x-4 gap-y-2" // Adjusted gap
                >
                  {/* Simplified Radio Items */}
                  {(["ama", "ap", "apa", "bluebook", "chicago", "mla", "nyt", "wikipedia"] as TitleCaseStyle[]).map(style => (
                    <div key={style} className="flex items-center space-x-1">
                      <RadioGroupItem value={style} id={style} />
                      <Label htmlFor={style} className="cursor-pointer capitalize">{style === 'nyt' ? 'NY Times' : style}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Title Case Output */}
              <div className="relative mt-2">
                <Textarea 
                  readOnly 
                  value={titleCaseText} 
                  placeholder="Title case output..."
                  className="w-full bg-zinc-700 text-white border-zinc-600 p-4 rounded resize min-h-[80px]" // Added padding and min-height
                />
                {titleCaseText && (
                  <Button 
                    onClick={() => handleCopy(titleCaseText, 'title')} 
                    className="absolute top-2 right-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs py-1 px-2"
                    size="sm"
                  >
                    {copiedStates.title ? "Copied!" : "Copy"}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Other Styles Output */}
          <div className="mb-6">
            <Label className="block mb-2 font-medium">Other Cases:</Label>
            <Tabs defaultValue="sentence" className="w-full">
              <TabsList className="grid grid-cols-3 mb-2 bg-zinc-700"> {/* Changed background */}
                <TabsTrigger value="sentence" className="data-[state=active]:bg-zinc-600">Sentence</TabsTrigger>
                <TabsTrigger value="lowercase" className="data-[state=active]:bg-zinc-600">lowercase</TabsTrigger>
                <TabsTrigger value="uppercase" className="data-[state=active]:bg-zinc-600">UPPERCASE</TabsTrigger>
              </TabsList>
              <TabsContent value="sentence">
                <div className="relative">
                  <Textarea 
                    readOnly 
                    value={sentenceCaseText} 
                    placeholder="Sentence case output..."
                    className="w-full bg-zinc-700 text-white border-zinc-600 p-4 rounded resize min-h-[80px]" 
                  />
                  {sentenceCaseText && (
                    <Button 
                      onClick={() => handleCopy(sentenceCaseText, 'sentence')} 
                      className="absolute top-2 right-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs py-1 px-2"
                      size="sm"
                    >
                      {copiedStates.sentence ? "Copied!" : "Copy"}
                    </Button>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="lowercase">
                 <div className="relative">
                  <Textarea 
                    readOnly 
                    value={lowerCaseText} 
                    placeholder="Lowercase output..."
                    className="w-full bg-zinc-700 text-white border-zinc-600 p-4 rounded resize min-h-[80px]" 
                  />
                  {lowerCaseText && (
                    <Button 
                      onClick={() => handleCopy(lowerCaseText, 'lower')} 
                      className="absolute top-2 right-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs py-1 px-2"
                      size="sm"
                    >
                      {copiedStates.lower ? "Copied!" : "Copy"}
                    </Button>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="uppercase">
                 <div className="relative">
                  <Textarea 
                    readOnly 
                    value={upperCaseText} 
                    placeholder="Uppercase output..."
                    className="w-full bg-zinc-700 text-white border-zinc-600 p-4 rounded resize min-h-[80px]" 
                  />
                  {upperCaseText && (
                    <Button 
                      onClick={() => handleCopy(upperCaseText, 'upper')} 
                      className="absolute top-2 right-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs py-1 px-2"
                      size="sm"
                    >
                      {copiedStates.upper ? "Copied!" : "Copy"}
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Options Checkboxes */}
          <div>
            <Label className="block mb-2 font-medium">Options:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2"> {/* Adjusted gap */}
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keep-all-caps" 
                  checked={keepAllCaps}
                  onCheckedChange={(checked) => setKeepAllCaps(checked as boolean)}
                />
                <Label htmlFor="keep-all-caps" className="cursor-pointer text-sm">Keep Words in All Caps</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="multi-line" 
                  checked={multiLineMode}
                  onCheckedChange={(checked) => setMultiLineMode(checked as boolean)}
                />
                <Label htmlFor="multi-line" className="cursor-pointer text-sm">Enable Multi-Line Input</Label>
              </div>
               <div className="flex items-center space-x-2">
                <Checkbox 
                  id="straight-quotes" 
                  checked={useStraightQuotes}
                  onCheckedChange={(checked) => setUseStraightQuotes(checked as boolean)}
                />
                <Label htmlFor="straight-quotes" className="cursor-pointer text-sm">Use Straight Quotes ("")</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="convert-paste" 
                  checked={convertOnPaste}
                  onCheckedChange={(checked) => setConvertOnPaste(checked as boolean)}
                />
                <Label htmlFor="convert-paste" className="cursor-pointer text-sm">Convert When Text Is Pasted</Label>
              </div>
              {/* Removed Show Explanations and Highlight Changes for simplicity, can be added back if needed */}
            </div>
          </div>
        </Card>
        
        {/* Standard About/Usage Tabs */}
        <Tabs defaultValue="about" className="mt-6"> {/* Use standard Tabs */}
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {aboutContent}
          </TabsContent>
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {usageTipsContent}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};
