import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toTitleCase } from "@/lib/utils";

// Title case style types
type TitleCaseStyle = "ama" | "ap" | "apa" | "bluebook" | "chicago" | "mla" | "nyt" | "wikipedia";

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
  const [showExplanations, setShowExplanations] = useState(false);
  const [highlightChanges, setHighlightChanges] = useState(false);
  const [useStraightQuotes, setUseStraightQuotes] = useState(false);
  const [convertOnPaste, setConvertOnPaste] = useState(true);
  const [copied, setCopied] = useState(false);
  
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
    if (!inputText.trim()) return;

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
    // For multi-line mode, process each line separately
    if (multiLineMode) {
      return text.split(/\r\n|\r|\n/).map(line => {
        return processSingleTitle(line, style);
      }).join('\n');
    } else {
      return processSingleTitle(text, style);
    }
  };

  // Process a single title with the selected style
  const processSingleTitle = (text: string, style: TitleCaseStyle): string => {
    // Split text by spaces to process each word
    const words = text.split(' ');
    const titleCaseWords = words.map((word, index) => {
      // Skip empty words
      if (!word) return word;

      // Keep words in all caps if the option is enabled
      if (keepAllCaps && word === word.toUpperCase() && word.length > 1) {
        return word;
      }

      // Always capitalize the first word
      if (index === 0) {
        return capitalizeFirstLetter(word);
      }

      // Always capitalize the last word in certain styles
      if (index === words.length - 1 && ["ap", "chicago", "mla", "nyt", "wikipedia"].includes(style)) {
        return capitalizeFirstLetter(word);
      }

      // Check for lowercase words based on style
      if (shouldBeLowercase(word, style)) {
        return word.toLowerCase();
      }

      // Default: capitalize the word
      return capitalizeFirstLetter(word);
    });

    // Apply smart quotes if needed
    return useStraightQuotes ? titleCaseWords.join(' ') : applySmartQuotes(titleCaseWords.join(' '));
  };

  // Helper function to determine if a word should be lowercase based on style
  const shouldBeLowercase = (word: string, style: TitleCaseStyle): boolean => {
    const lowerWord = word.toLowerCase();
    
    // Articles (always lowercase in all styles)
    const articles = ["a", "an", "the"];
    if (articles.includes(lowerWord)) return true;
    
    // Coordinating conjunctions (style-dependent)
    const coordinatingConjunctions = ["and", "but", "or", "nor", "for", "yet", "so"];
    if (coordinatingConjunctions.includes(lowerWord)) {
      // NYT-specific rule for conjunctions
      if (style === "nyt" && ["nor", "yet", "so"].includes(lowerWord)) {
        return false;
      }
      // Chicago-specific rule for conjunctions
      if (style === "chicago" && ["yet", "so"].includes(lowerWord)) {
        return false;
      }
      return true;
    }
    
    // Prepositions (style-dependent)
    const shortPrepositions = ["at", "by", "in", "of", "on", "to", "up", "as", "if", "off", "out", "via"];
    const mediumPrepositions = ["from", "into", "like", "near", "over", "with", "upon"];
    
    if (shortPrepositions.includes(lowerWord)) {
      // NYT-specific preposition rules
      if (style === "nyt" && ["up", "off", "out"].includes(lowerWord)) {
        return false;
      }
      // MLA lowercase all prepositions
      if (style === "mla") return true;
      
      // Subordinating conjunctions: "if" and "as"
      if (lowerWord === "if") {
        return ["ama", "ap", "apa", "nyt"].includes(style);
      }
      if (lowerWord === "as") {
        return ["ap", "apa", "nyt"].includes(style);
      }
      
      return true;
    }
    
    if (mediumPrepositions.includes(lowerWord)) {
      // Different style guidelines for 4-letter prepositions
      if (["ama", "ap", "apa", "nyt"].includes(style)) return false;
      if (style === "mla") return true;
      return true; // For bluebook, chicago, wikipedia
    }
    
    // APA, Bluebook specific: preposition at the end of a title
    if ((style === "ama" || style === "apa" || style === "bluebook") && 
        shortPrepositions.includes(lowerWord)) {
      // Check if this is the last word
      if (words && word === words[words.length - 1]) {
        return true;
      }
    }
    
    return false;
  };

  // Apply sentence case (capitalize first letter, proper nouns)
  const applySentenceCase = (text: string): string => {
    if (multiLineMode) {
      return text.split(/\r\n|\r|\n/).map(line => {
        return processSentenceCase(line);
      }).join('\n');
    } else {
      return processSentenceCase(text);
    }
  };

  // Process a single line for sentence case
  const processSentenceCase = (text: string): string => {
    if (!text) return text;
    
    // Split by sentence terminators
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    return sentences.map(sentence => {
      if (!sentence) return sentence;
      return sentence.charAt(0).toUpperCase() + sentence.slice(1).toLowerCase();
    }).join(' ');
  };

  // Capitalize first letter of a word, leave rest as is
  const capitalizeFirstLetter = (word: string): string => {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  };

  // Apply smart quotes typography
  const applySmartQuotes = (text: string): string => {
    return text
      .replace(/(\s|^)"(\S)/g, '$1"$2')  // Opening double quotes
      .replace(/(\S)"(\s|$|[.,;!?])/g, '$1"$2')  // Closing double quotes
      .replace(/(\s|^)'(\S)/g, '$1\'$2')  // Opening single quotes
      .replace(/(\S)'(\s|$|[.,;!?])/g, '$1\'$2')  // Closing single quotes
      .replace(/(\s|^)'(\S)/g, '$1\'$2')  // Opening single quotes (apostrophes at start)
      .replace(/--/g, '—')  // Em dash
      .replace(/\.{3}/g, '…')  // Ellipsis
      .replace(/(\s+)([.,;:!?])/g, '$2');  // Remove spaces before punctuation
  };

  // Handle text input
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    if (convertOnPaste && e.target.value !== inputText) {
      convertText();
    }
  };

  // Handle style selection
  const handleStyleChange = (style: string) => {
    setSelectedStyle(style as TitleCaseStyle);
    if (inputText) {
      convertText();
    }
  };

  // Handle conversion on button click
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

  // Handle copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent) => {
    if (convertOnPaste) {
      setTimeout(convertText, 0);
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
    <div className="container mx-auto px-4 py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Title Case Converter</h1>
          <p className="text-gray-300 mb-4">A Smart Title Capitalization Tool</p>
        </div>
        
        <div className="bg-zinc-800 p-4 rounded-md">
          <div className="mb-4">
            <Textarea
              ref={textInputRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              placeholder="Enter your text here..."
              className="w-full min-h-[100px] bg-zinc-700 text-white border-zinc-600"
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
              <span>{wordCount} word{wordCount !== 1 ? 's' : ''} • {charCount} character{charCount !== 1 ? 's' : ''} • {lineCount} line{lineCount !== 1 ? 's' : ''}</span>
              <Button 
                onClick={handleClear} 
                variant="outline" 
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                Clear
              </Button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              onClick={handleConvertClick} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Convert
            </Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="block mb-2 font-medium">Title Case:</Label>
              <div className="flex gap-2 flex-wrap mb-2">
                <RadioGroup 
                  value={selectedStyle} 
                  onValueChange={handleStyleChange}
                  className="flex flex-wrap gap-2"
                >
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="ama" id="ama" />
                    <Label htmlFor="ama" className="cursor-pointer">AMA</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="ap" id="ap" />
                    <Label htmlFor="ap" className="cursor-pointer">AP</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="apa" id="apa" />
                    <Label htmlFor="apa" className="cursor-pointer">APA</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="bluebook" id="bluebook" />
                    <Label htmlFor="bluebook" className="cursor-pointer">Bluebook</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="chicago" id="chicago" />
                    <Label htmlFor="chicago" className="cursor-pointer">Chicago</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="mla" id="mla" />
                    <Label htmlFor="mla" className="cursor-pointer">MLA</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="nyt" id="nyt" />
                    <Label htmlFor="nyt" className="cursor-pointer">NY Times</Label>
                  </div>
                  <div className="flex items-center space-x-1">
                    <RadioGroupItem value="wikipedia" id="wikipedia" />
                    <Label htmlFor="wikipedia" className="cursor-pointer">Wikipedia</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {titleCaseText && (
                <div className="relative">
                  <Textarea 
                    readOnly 
                    value={titleCaseText} 
                    className="w-full bg-zinc-700 text-white border-zinc-600" 
                  />
                  <Button 
                    onClick={() => handleCopy(titleCaseText)} 
                    className="absolute top-2 right-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs py-1 px-2"
                    size="sm"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <Label className="block mb-2 font-medium">Other Styles:</Label>
              <Tabs defaultValue="sentence" className="w-full">
                <TabsList className="grid grid-cols-3 mb-2">
                  <TabsTrigger value="sentence">Sentence Case</TabsTrigger>
                  <TabsTrigger value="lowercase">Lowercase</TabsTrigger>
                  <TabsTrigger value="uppercase">UPPERCASE</TabsTrigger>
                </TabsList>
                <TabsContent value="sentence">
                  {sentenceCaseText && (
                    <div className="relative">
                      <Textarea 
                        readOnly 
                        value={sentenceCaseText} 
                        className="w-full bg-zinc-700 text-white border-zinc-600" 
                      />
                      <Button 
                        onClick={() => handleCopy(sentenceCaseText)} 
                        className="absolute top-2 right-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs py-1 px-2"
                        size="sm"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="lowercase">
                  {lowerCaseText && (
                    <div className="relative">
                      <Textarea 
                        readOnly 
                        value={lowerCaseText} 
                        className="w-full bg-zinc-700 text-white border-zinc-600" 
                      />
                      <Button 
                        onClick={() => handleCopy(lowerCaseText)} 
                        className="absolute top-2 right-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs py-1 px-2"
                        size="sm"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
                <TabsContent value="uppercase">
                  {upperCaseText && (
                    <div className="relative">
                      <Textarea 
                        readOnly 
                        value={upperCaseText} 
                        className="w-full bg-zinc-700 text-white border-zinc-600" 
                      />
                      <Button 
                        onClick={() => handleCopy(upperCaseText)} 
                        className="absolute top-2 right-2 bg-zinc-600 hover:bg-zinc-500 text-white text-xs py-1 px-2"
                        size="sm"
                      >
                        {copied ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div className="mt-6">
            <Label className="block mb-2 font-medium">Options:</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keep-all-caps" 
                  checked={keepAllCaps}
                  onCheckedChange={(checked) => setKeepAllCaps(checked as boolean)}
                />
                <Label htmlFor="keep-all-caps" className="cursor-pointer">Keep Words in All Caps</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="multi-line" 
                  checked={multiLineMode}
                  onCheckedChange={(checked) => setMultiLineMode(checked as boolean)}
                />
                <Label htmlFor="multi-line" className="cursor-pointer">Enable Multi-Line Input</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-explanations" 
                  checked={showExplanations}
                  onCheckedChange={(checked) => setShowExplanations(checked as boolean)}
                />
                <Label htmlFor="show-explanations" className="cursor-pointer">Show Explanations</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="highlight-changes" 
                  checked={highlightChanges}
                  onCheckedChange={(checked) => setHighlightChanges(checked as boolean)}
                />
                <Label htmlFor="highlight-changes" className="cursor-pointer">Highlight Changes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="straight-quotes" 
                  checked={useStraightQuotes}
                  onCheckedChange={(checked) => setUseStraightQuotes(checked as boolean)}
                />
                <Label htmlFor="straight-quotes" className="cursor-pointer">Use Straight Quotes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="convert-paste" 
                  checked={convertOnPaste}
                  onCheckedChange={(checked) => setConvertOnPaste(checked as boolean)}
                />
                <Label htmlFor="convert-paste" className="cursor-pointer">Convert When Text Is Pasted</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-800 p-4 rounded-md">
          <h2 className="text-xl font-bold mb-3">What Is Title Case?</h2>
          <p className="text-gray-300 mb-4">
            Title case is a style that is traditionally used for the titles of books, movies, songs, plays, and other works. 
            In title case, all major words are capitalized, while minor words are lowercased. A simple example would be 
            "Lord of the Flies". Title case is often used for headlines as well, such as in newspapers, essays, and blogs, 
            and is therefore also known as headline style.
          </p>
          <p className="text-gray-300">
            The capitalization rules are explained in more detail in the next section, but basically title case means 
            that you capitalize every word except articles (a, an, the), coordinating conjunctions (and, or, but, …), 
            and (short) prepositions (in, on, for, up, …). This is trickier than it seems because many words can be used 
            in different grammatical functions.
          </p>
        </div>
        
        <div className="bg-zinc-800 p-4 rounded-md">
          <h2 className="text-xl font-bold mb-3">Title Capitalization Rules</h2>
          <p className="text-gray-300 mb-4">
            Title case is not a universal standard. Instead, there are a number of style guides—for example, 
            the Chicago Manual of Style (CMOS) and the MLA Handbook—that each have their own rules for capitalizing titles. 
            However, there is a consensus on the basic rules:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-300 space-y-2">
            <li>Always capitalize the first word in a title</li>
            <li>
              Capitalize the following parts of speech:
              <ul className="list-disc pl-6 mt-1">
                <li>nouns</li>
                <li>pronouns (including it, my, and our)</li>
                <li>verbs (including is, am, and other forms of to be)</li>
                <li>adverbs</li>
                <li>adjectives</li>
                <li>some conjunctions (style-dependent)</li>
                <li>long prepositions (style-dependent)</li>
              </ul>
            </li>
            <li>
              Lowercase the following parts of speech:
              <ul className="list-disc pl-6 mt-1">
                <li>articles</li>
                <li>some conjunctions (style-dependent)</li>
                <li>short prepositions (style-dependent)</li>
              </ul>
            </li>
          </ul>
          <p className="text-gray-300">
            The main differences between the styles are in how they handle prepositions, coordinating conjunctions, 
            subordinating conjunctions, and words at the end of titles.
          </p>
        </div>
      </div>
    </div>
  );
};
