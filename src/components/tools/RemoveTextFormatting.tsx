import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ToolLayout } from "./ToolLayout";
import {
  Copy,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  Info,
  Code,
  Settings2,
  Text,
  Dices,
  ArrowLeftRight,
  Trash2,
  FileText,
  ListFilter,
  Check,
  X,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CleaningOptions {
  // Basic options
  removeHtmlTags: boolean;
  removeSpecialChars: boolean;
  removeEmojis: boolean;
  keepPunctuation: boolean;
  keepNumbers: boolean;
  keepBasicSymbols: boolean;
  keepAccents: boolean;

  // Whitespace options
  normalizeWhitespace: boolean;
  removeExtraSpaces: boolean;
  removeTabs: boolean;
  normalizeLineBreaks: boolean;
  trimLines: boolean;
  removeBlankLines: boolean;

  // Content options
  removeUrls: boolean;
  removeEmails: boolean;
  removeDateFormats: boolean;
  convertSmartQuotes: boolean;
  removeBracketedContent: boolean;
  removeHashtags: boolean;
  
  // Advanced options
  customRegexPattern: string;
  customRegexReplacement: string;
  customRegexEnabled: boolean;
  caseSensitive: boolean;
}

export const RemoveTextFormatting = () => {
  // State for text and UI
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [showDiff, setShowDiff] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [processingTab, setProcessingTab] = useState("options");
  const [activePreset, setActivePreset] = useState("moderate");
  const [copied, setCopied] = useState(false);
  const [regexError, setRegexError] = useState<string | null>(null);
  
  // Statistics
  const [charCount, setCharCount] = useState({ input: 0, output: 0 });
  const [wordCount, setWordCount] = useState({ input: 0, output: 0 });
  const [lineCount, setLineCount] = useState({ input: 0, output: 0 });
  const [specialCharCount, setSpecialCharCount] = useState({ input: 0, output: 0 });
  
  // Define cleaning presets
  const presets = {
    light: {
      // Basic options
      removeHtmlTags: false,
      removeSpecialChars: false,
      removeEmojis: false,
      keepPunctuation: true,
      keepNumbers: true,
      keepBasicSymbols: true,
      keepAccents: true,

      // Whitespace options
      normalizeWhitespace: true,
      removeExtraSpaces: true,
      removeTabs: true,
      normalizeLineBreaks: true,
      trimLines: true,
      removeBlankLines: false,

      // Content options
      removeUrls: false,
      removeEmails: false,
      removeDateFormats: false,
      convertSmartQuotes: true,
      removeBracketedContent: false,
      removeHashtags: false,
      
      // Advanced options
      customRegexPattern: "",
      customRegexReplacement: "",
      customRegexEnabled: false,
      caseSensitive: false,
    },
    moderate: {
      // Basic options
      removeHtmlTags: true,
      removeSpecialChars: true,
      removeEmojis: true,
      keepPunctuation: true,
      keepNumbers: true,
      keepBasicSymbols: true,
      keepAccents: false,

      // Whitespace options
      normalizeWhitespace: true,
      removeExtraSpaces: true,
      removeTabs: true,
      normalizeLineBreaks: true,
      trimLines: true,
      removeBlankLines: false,

      // Content options
      removeUrls: false,
      removeEmails: false,
      removeDateFormats: false,
      convertSmartQuotes: true,
      removeBracketedContent: false,
      removeHashtags: false,
      
      // Advanced options
      customRegexPattern: "",
      customRegexReplacement: "",
      customRegexEnabled: false,
      caseSensitive: false,
    },
    aggressive: {
      // Basic options
      removeHtmlTags: true,
      removeSpecialChars: true,
      removeEmojis: true,
      keepPunctuation: false,
      keepNumbers: false,
      keepBasicSymbols: false,
      keepAccents: false,

      // Whitespace options
      normalizeWhitespace: true,
      removeExtraSpaces: true,
      removeTabs: true,
      normalizeLineBreaks: true,
      trimLines: true,
      removeBlankLines: true,

      // Content options
      removeUrls: true,
      removeEmails: true,
      removeDateFormats: true,
      convertSmartQuotes: true,
      removeBracketedContent: true,
      removeHashtags: true,
      
      // Advanced options
      customRegexPattern: "",
      customRegexReplacement: "",
      customRegexEnabled: false,
      caseSensitive: false,
    },
    htmlCleaner: {
      // Basic options
      removeHtmlTags: true,
      removeSpecialChars: false,
      removeEmojis: false,
      keepPunctuation: true,
      keepNumbers: true,
      keepBasicSymbols: true,
      keepAccents: true,

      // Whitespace options
      normalizeWhitespace: true,
      removeExtraSpaces: true,
      removeTabs: true,
      normalizeLineBreaks: true,
      trimLines: true,
      removeBlankLines: false,

      // Content options
      removeUrls: false,
      removeEmails: false,
      removeDateFormats: false,
      convertSmartQuotes: true,
      removeBracketedContent: false,
      removeHashtags: false,
      
      // Advanced options
      customRegexPattern: "",
      customRegexReplacement: "",
      customRegexEnabled: false,
      caseSensitive: false,
    },
    plainText: {
      // Basic options
      removeHtmlTags: true,
      removeSpecialChars: true,
      removeEmojis: true,
      keepPunctuation: true,
      keepNumbers: true,
      keepBasicSymbols: false,
      keepAccents: false,

      // Whitespace options
      normalizeWhitespace: true,
      removeExtraSpaces: true,
      removeTabs: true,
      normalizeLineBreaks: true,
      trimLines: true,
      removeBlankLines: false,

      // Content options
      removeUrls: false,
      removeEmails: false,
      removeDateFormats: false,
      convertSmartQuotes: true,
      removeBracketedContent: false,
      removeHashtags: false,
      
      // Advanced options
      customRegexPattern: "",
      customRegexReplacement: "",
      customRegexEnabled: false,
      caseSensitive: false,
    }
  };

  // Initialize cleaning options with moderate preset
  const [cleaningOptions, setCleaningOptions] = useState<CleaningOptions>(presets.moderate);


  // Process text whenever input or options change
  useEffect(() => {
    if (inputText) {
      processText();
    }
  }, [inputText, cleaningOptions]);

  // Update statistics
  useEffect(() => {
    updateStats();
  }, [inputText, outputText]);

  // Toggle a specific cleaning option
  const toggleOption = (option: keyof CleaningOptions) => {
    setCleaningOptions(prev => ({
      ...prev,
      [option]: !prev[option],
    }));
    
    // Set preset to custom when options are manually changed
    setActivePreset("custom");
  };

  // Set multiple options at once
  const setOptions = (newOptions: Partial<CleaningOptions>) => {
    setCleaningOptions(prev => ({
      ...prev,
      ...newOptions,
    }));
  };

  // Apply a preset
  const applyPreset = (preset: string) => {
    if (preset === "light") {
      setCleaningOptions(presets.light);
    } else if (preset === "moderate") {
      setCleaningOptions(presets.moderate);
    } else if (preset === "aggressive") {
      setCleaningOptions(presets.aggressive);
    } else if (preset === "htmlCleaner") {
      setCleaningOptions(presets.htmlCleaner);
    } else if (preset === "plainText") {
      setCleaningOptions(presets.plainText);
    }
    
    setActivePreset(preset);
  };

  // Main text processing function
  const processText = () => {
    if (!inputText) {
      setOutputText("");
      return;
    }

    let processedText = inputText;
    
    // 1. Remove HTML tags
    if (cleaningOptions.removeHtmlTags) {
      processedText = processedText.replace(/<[^>]*>/g, '');
    }
    
    // 2. Handle HTML entities
    processedText = processedText.replace(/&nbsp;/g, ' ');
    processedText = processedText.replace(/&amp;/g, '&');
    processedText = processedText.replace(/&lt;/g, '<');
    processedText = processedText.replace(/&gt;/g, '>');
    processedText = processedText.replace(/&quot;/g, '"');
    processedText = processedText.replace(/&#39;/g, "'");
    
    // 3. Handle whitespace
    if (cleaningOptions.normalizeWhitespace) {
      if (cleaningOptions.removeExtraSpaces) {
        processedText = processedText.replace(/[ \t]+/g, ' ');
      }
      
      if (cleaningOptions.removeTabs) {
        processedText = processedText.replace(/\t/g, ' ');
      }
      
      if (cleaningOptions.normalizeLineBreaks) {
        processedText = processedText.replace(/\r\n/g, '\n');
        processedText = processedText.replace(/\r/g, '\n');
      }
      
      if (cleaningOptions.trimLines) {
        processedText = processedText.split('\n')
          .map(line => line.trim())
          .join('\n');
      }
      
      if (cleaningOptions.removeBlankLines) {
        processedText = processedText.replace(/\n+/g, '\n');
        processedText = processedText.replace(/^\n+|\n+$/g, '');
      }
    }
    
    // 4. Remove URLs
    if (cleaningOptions.removeUrls) {
      processedText = processedText.replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/g, '');
    }
    
    // 5. Remove email addresses
    if (cleaningOptions.removeEmails) {
      processedText = processedText.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '');
    }
    
    // 6. Convert smart quotes and other typographic characters
    if (cleaningOptions.convertSmartQuotes) {
      processedText = processedText
        .replace(/[\u2018\u2019]/g, "'") // smart single quotes
        .replace(/[\u201C\u201D]/g, '"') // smart double quotes
        .replace(/\u2026/g, '...') // ellipsis
        .replace(/[\u2013\u2014]/g, '-') // en/em dashes
        .replace(/\u00A0/g, ' '); // non-breaking space
    }
    
    // 7. Remove bracketed content
    if (cleaningOptions.removeBracketedContent) {
      processedText = processedText
        .replace(/\(.*?\)/g, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\{.*?\}/g, '')
        .replace(/<.*?>/g, '');
    }
    
    // 8. Remove hashtags
    if (cleaningOptions.removeHashtags) {
      processedText = processedText.replace(/#\w+/g, '');
    }
    
    // 9. Remove date formats
    if (cleaningOptions.removeDateFormats) {
      processedText = processedText.replace(/\d{1,2}\/\d{1,2}\/\d{2,4}/g, '');
      processedText = processedText.replace(/\d{1,2}-\d{1,2}-\d{2,4}/g, '');
      processedText = processedText.replace(/\d{4}-\d{2}-\d{2}/g, '');
    }
    
    // 10. Remove special characters and emojis
    if (cleaningOptions.removeSpecialChars) {
      let pattern = '[^\\p{L}';
      
      // Add allowable characters to the pattern
      if (cleaningOptions.keepPunctuation) pattern += '\\p{P}';
      if (cleaningOptions.keepNumbers) pattern += '\\p{N}';
      if (cleaningOptions.keepBasicSymbols) pattern += '\\$\\^\\+\\-\\*\\\\=\\_\\|\\~\\<\\>\\%\\&\\@';
      if (!cleaningOptions.keepAccents) pattern += '\\p{M}';
      
      pattern += '\\s]';
      
      const regex = new RegExp(pattern, 'gu');
      processedText = processedText.replace(regex, '');
    }
    
    // 11. Remove emojis specifically
    if (cleaningOptions.removeEmojis) {
      // Emoji Unicode ranges
      processedText = processedText.replace(/[\u{1F000}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
    }
    
    // 12. Apply custom regex if enabled
    if (cleaningOptions.customRegexEnabled && cleaningOptions.customRegexPattern) {
      try {
        const flags = cleaningOptions.caseSensitive ? 'g' : 'gi';
        const regex = new RegExp(cleaningOptions.customRegexPattern, flags);
        processedText = processedText.replace(regex, cleaningOptions.customRegexReplacement);
        setRegexError(null);
      } catch (error) {
        setRegexError((error as Error).message);
      }
    }
    
    setOutputText(processedText);
  };

  // Update statistics for both input and output text
  const updateStats = () => {
    // Input text stats
    const inputStats = calculateTextStats(inputText);
    
    // Output text stats
    const outputStats = calculateTextStats(outputText);
    
    // Update state
    setCharCount({ input: inputStats.chars, output: outputStats.chars });
    setWordCount({ input: inputStats.words, output: outputStats.words });
    setLineCount({ input: inputStats.lines, output: outputStats.lines });
    setSpecialCharCount({ input: inputStats.specialChars, output: outputStats.specialChars });
  };
  
  // Calculate text statistics
  const calculateTextStats = (text: string) => {
    const chars = text.length;
    const words = text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
    const lines = text ? text.split(/\r\n|\r|\n/).length : 0;
    
    // Count special characters
    const specialChars = text ? text.replace(/[\p{L}\p{N}\s]/gu, '').length : 0;
    
    return { chars, words, lines, specialChars };
  };

  // Show differences between input and output
  const getDiffText = () => {
    if (!inputText || !outputText) return "";
    
    // Simple diff highlighting (not a full diff algorithm)
    const removed = inputText.length - outputText.length;
    const percentage = inputText.length > 0 ? Math.round((removed / inputText.length) * 100) : 0;
    
    return `Removed ${removed} characters (${percentage}% reduction)`;
  };

  // Clear text and reset stats
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setCharCount({ input: 0, output: 0 });
    setWordCount({ input: 0, output: 0 });
    setLineCount({ input: 0, output: 0 });
    setSpecialCharCount({ input: 0, output: 0 });
  };

  // Copy output to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download output as a text file
  const handleDownload = () => {
    if (!outputText) return;

    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "cleaned-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Remove Text Formatting" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Remove Text Formatting</h1>
        <p className="text-gray-300 mb-6">
          Clean and normalize text by removing unwanted formatting, special characters, HTML tags, 
          extra spaces, and more. Customize the cleaning process to fit your specific needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Panel */}
          <div className="flex flex-col">
            <div className="mb-2 flex justify-between items-center">
              <h2 className="text-lg font-medium">Input Text</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClear}
                className="text-xs border-zinc-600"
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
            
            <Textarea
              placeholder="Paste text with formatting to clean..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="mb-2 flex-grow min-h-[250px] bg-zinc-700 text-white border-zinc-600 p-4 rounded"
            />
            
            <div className="flex justify-between text-xs text-gray-400">
              <span>{charCount.input} characters</span>
              <span>{wordCount.input} words</span>
              <span>{lineCount.input} lines</span>
              <span>{specialCharCount.input} special chars</span>
            </div>
          </div>
          
          {/* Output Panel */}
          <div className="flex flex-col">
            <div className="mb-2 flex justify-between items-center">
              <h2 className="text-lg font-medium">Cleaned Text</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopy} 
                  disabled={!outputText}
                  className={`text-xs border-zinc-600 ${copied ? 'bg-green-600 text-white' : ''}`}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDownload} 
                  disabled={!outputText}
                  className="text-xs border-zinc-600"
                >
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowDiff(!showDiff)} 
                  disabled={!outputText}
                  className={`text-xs border-zinc-600 ${showDiff ? 'bg-blue-600 text-white' : ''}`}
                >
                  {showDiff ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                  {showDiff ? "Hide Diff" : "Show Diff"}
                </Button>
              </div>
            </div>
            
            <Textarea
              readOnly
              placeholder="Cleaned text will appear here..."
              value={outputText}
              className="mb-2 flex-grow min-h-[250px] bg-zinc-700 text-white border-zinc-600 p-4 rounded"
            />
            
            <div className="flex justify-between items-center">
              <div className="flex justify-between text-xs text-gray-400 flex-1">
                <span>{charCount.output} characters</span>
                <span>{wordCount.output} words</span>
                <span>{lineCount.output} lines</span>
                <span>{specialCharCount.output} special chars</span>
              </div>
              
              {showDiff && (
                <div className="bg-blue-900/30 text-blue-200 text-xs px-2 py-1 rounded">
                  {getDiffText()}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Cleaning Options Tabs */}
        <div className="mt-6">
          <Tabs value={processingTab} onValueChange={setProcessingTab}>
            <TabsList className="mb-2 bg-zinc-800">
              <TabsTrigger value="options" className="data-[state=active]:bg-zinc-700">
                <Settings2 className="h-4 w-4 mr-2" />
                Cleaning Options
              </TabsTrigger>
              <TabsTrigger value="presets" className="data-[state=active]:bg-zinc-700">
                <ListFilter className="h-4 w-4 mr-2" />
                Presets
              </TabsTrigger>
              <TabsTrigger value="info" className="data-[state=active]:bg-zinc-700">
                <Info className="h-4 w-4 mr-2" />
                About
              </TabsTrigger>
            </TabsList>
            
            {/* Cleaning Options */}
            <TabsContent value="options" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="basic">Basic</TabsTrigger>
                  <TabsTrigger value="whitespace">Whitespace</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                
                {/* Basic Options */}
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeHtmlTags" 
                          checked={cleaningOptions.removeHtmlTags} 
                          onCheckedChange={() => toggleOption('removeHtmlTags')} 
                        />
                        <Label htmlFor="removeHtmlTags">Remove HTML Tags</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Strips all HTML/XML markup tags from the text.</p>
                            <p className="text-xs text-zinc-400 mt-1">Example: "&lt;p&gt;Text&lt;/p&gt;" → "Text"</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeSpecialChars" 
                          checked={cleaningOptions.removeSpecialChars} 
                          onCheckedChange={() => toggleOption('removeSpecialChars')} 
                        />
                        <Label htmlFor="removeSpecialChars">Remove Special Characters</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Removes special characters, symbols, and non-standard punctuation marks.</p>
                            <p className="text-xs text-zinc-400 mt-1">Customize which characters to keep using the options below.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeEmojis" 
                          checked={cleaningOptions.removeEmojis} 
                          onCheckedChange={() => toggleOption('removeEmojis')} 
                        />
                        <Label htmlFor="removeEmojis">Remove Emojis</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Removes all emoji characters from the text.</p>
                            <p className="text-xs text-zinc-400 mt-1">Example: "Hello 😊" → "Hello "</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </div>
                    
                    <div className="space-y-4 px-4 border-l border-zinc-700">
                      <h3 className="text-sm font-medium mb-2">Keep options:</h3>
                      <div className="space-y-4 pl-2">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="keepPunctuation" 
                            checked={cleaningOptions.keepPunctuation} 
                            onCheckedChange={() => toggleOption('keepPunctuation')} 
                            disabled={!cleaningOptions.removeSpecialChars}
                          />
                          <Label htmlFor="keepPunctuation">Keep Punctuation</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="keepNumbers" 
                            checked={cleaningOptions.keepNumbers} 
                            onCheckedChange={() => toggleOption('keepNumbers')} 
                            disabled={!cleaningOptions.removeSpecialChars}
                          />
                          <Label htmlFor="keepNumbers">Keep Numbers</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="keepBasicSymbols" 
                            checked={cleaningOptions.keepBasicSymbols} 
                            onCheckedChange={() => toggleOption('keepBasicSymbols')} 
                            disabled={!cleaningOptions.removeSpecialChars}
                          />
                          <Label htmlFor="keepBasicSymbols">Keep Basic Symbols</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="keepAccents" 
                            checked={cleaningOptions.keepAccents} 
                            onCheckedChange={() => toggleOption('keepAccents')} 
                            disabled={!cleaningOptions.removeSpecialChars}
                          />
                          <Label htmlFor="keepAccents">Keep Accented Characters</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Whitespace Options */}
                <TabsContent value="whitespace" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="normalizeWhitespace" 
                          checked={cleaningOptions.normalizeWhitespace} 
                          onCheckedChange={() => toggleOption('normalizeWhitespace')} 
                        />
                        <Label htmlFor="normalizeWhitespace">Normalize Whitespace</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Applies the whitespace cleaning options below to normalize spacing in the text.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2 pl-6">
                        <Checkbox 
                          id="removeExtraSpaces" 
                          checked={cleaningOptions.removeExtraSpaces} 
                          onCheckedChange={() => toggleOption('removeExtraSpaces')} 
                          disabled={!cleaningOptions.normalizeWhitespace}
                        />
                        <Label htmlFor="removeExtraSpaces">Remove Extra Spaces</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Converts multiple consecutive spaces to a single space.</p>
                            <p className="text-xs text-zinc-400 mt-1">Example: "Hello    world" → "Hello world"</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2 pl-6">
                        <Checkbox 
                          id="removeTabs" 
                          checked={cleaningOptions.removeTabs} 
                          onCheckedChange={() => toggleOption('removeTabs')} 
                          disabled={!cleaningOptions.normalizeWhitespace}
                        />
                        <Label htmlFor="removeTabs">Replace Tabs with Spaces</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 pl-6">
                        <Checkbox 
                          id="normalizeLineBreaks" 
                          checked={cleaningOptions.normalizeLineBreaks} 
                          onCheckedChange={() => toggleOption('normalizeLineBreaks')} 
                          disabled={!cleaningOptions.normalizeWhitespace}
                        />
                        <Label htmlFor="normalizeLineBreaks">Normalize Line Breaks</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Converts different types of line breaks (CRLF, CR) to uniform line feed (LF) characters.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2 pl-6">
                        <Checkbox 
                          id="trimLines" 
                          checked={cleaningOptions.trimLines} 
                          onCheckedChange={() => toggleOption('trimLines')} 
                          disabled={!cleaningOptions.normalizeWhitespace}
                        />
                        <Label htmlFor="trimLines">Trim Line Whitespace</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Removes leading and trailing whitespace from each line.</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2 pl-6">
                        <Checkbox 
                          id="removeBlankLines" 
                          checked={cleaningOptions.removeBlankLines} 
                          onCheckedChange={() => toggleOption('removeBlankLines')} 
                          disabled={!cleaningOptions.normalizeWhitespace}
                        />
                        <Label htmlFor="removeBlankLines">Remove Blank Lines</Label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Content Options */}
                <TabsContent value="content" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeUrls" 
                          checked={cleaningOptions.removeUrls} 
                          onCheckedChange={() => toggleOption('removeUrls')} 
                        />
                        <Label htmlFor="removeUrls">Remove URLs</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Removes web URLs (https://, http://, www.)</p>
                            <p className="text-xs text-zinc-400 mt-1">Example: "Visit https://example.com" → "Visit "</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeEmails" 
                          checked={cleaningOptions.removeEmails} 
                          onCheckedChange={() => toggleOption('removeEmails')} 
                        />
                        <Label htmlFor="removeEmails">Remove Email Addresses</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeDateFormats" 
                          checked={cleaningOptions.removeDateFormats} 
                          onCheckedChange={() => toggleOption('removeDateFormats')} 
                        />
                        <Label htmlFor="removeDateFormats">Remove Date Formats</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Removes common date formats like MM/DD/YYYY or YYYY-MM-DD</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="convertSmartQuotes" 
                          checked={cleaningOptions.convertSmartQuotes} 
                          onCheckedChange={() => toggleOption('convertSmartQuotes')} 
                        />
                        <Label htmlFor="convertSmartQuotes">Convert Smart Quotes & Typography</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Converts smart quotes, em/en dashes, ellipses to basic ASCII equivalents</p>
                            <p className="text-xs text-zinc-400 mt-1">Example: "" → "", — → -</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeBracketedContent" 
                          checked={cleaningOptions.removeBracketedContent} 
                          onCheckedChange={() => toggleOption('removeBracketedContent')} 
                        />
                        <Label htmlFor="removeBracketedContent">Remove Bracketed Content</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Removes text inside brackets: (), [], {}, &lt;&gt;</p>
                            <p className="text-xs text-zinc-400 mt-1">Example: "Text (note) more" → "Text  more"</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="removeHashtags" 
                          checked={cleaningOptions.removeHashtags} 
                          onCheckedChange={() => toggleOption('removeHashtags')} 
                        />
                        <Label htmlFor="removeHashtags">Remove Hashtags</Label>
                        <HoverCard>
                          <HoverCardTrigger>
                            <Info className="h-4 w-4 text-zinc-400 cursor-help" />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-80">
                            <p className="text-sm">Removes hashtags (#tag) from text</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                {/* Advanced Options */}
                <TabsContent value="advanced" className="space-y-4">
                  <Card className="p-4 border-zinc-700 bg-zinc-800">
                    <h3 className="text-sm font-medium mb-2 flex items-center">
                      <Code className="h-4 w-4 mr-2" />
                      Custom Regular Expression
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-4">
                      <Checkbox 
                        id="customRegexEnabled" 
                        checked={cleaningOptions.customRegexEnabled} 
                        onCheckedChange={() => toggleOption('customRegexEnabled')} 
                      />
                      <Label htmlFor="customRegexEnabled">Enable Custom Pattern Replacement</Label>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="customRegexPattern" className="text-xs mb-1 block">Pattern to match:</Label>
                        <Input 
                          id="customRegexPattern" 
                          placeholder="Regular expression pattern"
                          value={cleaningOptions.customRegexPattern}
                          onChange={(e) => setOptions({ customRegexPattern: e.target.value })}
                          disabled={!cleaningOptions.customRegexEnabled}
                          className="bg-zinc-700 border-zinc-600"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="customRegexReplacement" className="text-xs mb-1 block">Replace with:</Label>
                        <Input 
                          id="customRegexReplacement" 
                          placeholder="Replacement text"
                          value={cleaningOptions.customRegexReplacement}
                          onChange={(e) => setOptions({ customRegexReplacement: e.target.value })}
                          disabled={!cleaningOptions.customRegexEnabled}
                          className="bg-zinc-700 border-zinc-600"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-4">
                      <Switch 
                        id="caseSensitive" 
                        checked={cleaningOptions.caseSensitive} 
                        onCheckedChange={() => toggleOption('caseSensitive')} 
                        disabled={!cleaningOptions.customRegexEnabled}
                      />
                      <Label htmlFor="caseSensitive">Case Sensitive Matching</Label>
                    </div>
                    
                    {regexError && (
                      <div className="mt-2 p-2 bg-red-900/30 border border-red-800 text-red-300 text-xs rounded">
                        {regexError}
                      </div>
                    )}
                    
                    <div className="mt-4 p-2 bg-blue-900/20 border border-blue-800/50 text-blue-300 text-xs rounded">
                      <h4 className="font-medium mb-1">Example Patterns:</h4>
                      <ul className="list-disc pl-4 space-y-1">
                        <li>Remove numbers: <code>\d+</code></li>
                        <li>Remove text in parentheses: <code>\(.*?\)</code></li>
                        <li>Remove specific word: <code>\bword\b</code></li>
                      </ul>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>
            
            {/* Presets */}
            <TabsContent value="presets" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
              <h3 className="text-sm font-medium mb-4">Cleaning Presets</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div 
                  className={`p-3 rounded cursor-pointer transition-colors
                    ${activePreset === 'light' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-700 hover:bg-zinc-600'}`}
                  onClick={() => applyPreset('light')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Light Clean</h4>
                    {activePreset === 'light' && <Check className="h-4 w-4" />}
                  </div>
                  <p className="text-xs opacity-90">
                    Minimal formatting removal, only fixes spaces and typographic marks
                  </p>
                </div>
                
                <div 
                  className={`p-3 rounded cursor-pointer transition-colors
                    ${activePreset === 'moderate' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-700 hover:bg-zinc-600'}`}
                  onClick={() => applyPreset('moderate')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Moderate</h4>
                    {activePreset === 'moderate' && <Check className="h-4 w-4" />}
                  </div>
                  <p className="text-xs opacity-90">
                    Balanced cleaning - removes formatting while preserving content
                  </p>
                </div>
                
                <div 
                  className={`p-3 rounded cursor-pointer transition-colors
                    ${activePreset === 'aggressive' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-700 hover:bg-zinc-600'}`}
                  onClick={() => applyPreset('aggressive')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Aggressive</h4>
                    {activePreset === 'aggressive' && <Check className="h-4 w-4" />}
                  </div>
                  <p className="text-xs opacity-90">
                    Strong cleaning - strips all special characters and formatting
                  </p>
                </div>
                
                <div 
                  className={`p-3 rounded cursor-pointer transition-colors
                    ${activePreset === 'htmlCleaner' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-700 hover:bg-zinc-600'}`}
                  onClick={() => applyPreset('htmlCleaner')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">HTML Cleaner</h4>
                    {activePreset === 'htmlCleaner' && <Check className="h-4 w-4" />}
                  </div>
                  <p className="text-xs opacity-90">
                    Focuses on removing HTML tags while preserving content
                  </p>
                </div>
                
                <div 
                  className={`p-3 rounded cursor-pointer transition-colors
                    ${activePreset === 'plainText' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-zinc-700 hover:bg-zinc-600'}`}
                  onClick={() => applyPreset('plainText')}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Plain Text</h4>
                    {activePreset === 'plainText' && <Check className="h-4 w-4" />}
                  </div>
                  <p className="text-xs opacity-90">
                    Converts to clean, standard plain text with minimal formatting
                  </p>
                </div>
                
                <div 
                  className={`p-3 rounded cursor-pointer transition-colors bg-zinc-700 border-2
                    ${activePreset === 'custom' 
                      ? 'border-blue-500' 
                      : 'border-transparent hover:bg-zinc-600'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Custom</h4>
                    {activePreset === 'custom' && <Check className="h-4 w-4" />}
                  </div>
                  <p className="text-xs opacity-90">
                    Your custom cleaning settings
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-zinc-700 rounded">
                <h4 className="text-sm font-medium mb-2">Using Presets</h4>
                <p className="text-xs text-gray-300">
                  Select a preset to apply predefined cleaning options. You can then customize individual settings 
                  in the Cleaning Options tab. Any changes to options will switch to the "Custom" preset.
                </p>
              </div>
            </TabsContent>
            
            {/* About/Info */}
            <TabsContent value="info" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
              <h3 className="text-sm font-medium mb-4">About Text Formatting Removal</h3>
              
              <div className="space-y-4">
                <p>
                  This tool helps you clean and normalize text by removing unwanted formatting, 
                  special characters, HTML tags, and more. It's useful for:
                </p>
                
                <ul className="list-disc pl-5 space-y-1">
                  <li>Preparing text copied from web pages or documents</li>
                  <li>Cleaning up text with excess formatting</li>
                  <li>Removing HTML tags from content</li>
                  <li>Normalizing text for processing or analysis</li>
                  <li>Converting text to plain ASCII format</li>
                  <li>Fixing inconsistent spacing and line breaks</li>
                </ul>
                
                <Accordion type="single" collapsible className="mt-4">
                  <AccordionItem value="how-to-use">
                    <AccordionTrigger>How to Use</AccordionTrigger>
                    <AccordionContent>
                      <ol className="list-decimal pl-5 space-y-2">
                        <li>Paste your formatted text in the input field on the left</li>
                        <li>Choose a preset or customize cleaning options in the tabs</li>
                        <li>The tool will automatically process and show cleaned text</li>
                        <li>Use the Copy or Download buttons to save your results</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="tips">
                    <AccordionTrigger>Tips & Tricks</AccordionTrigger>
                    <AccordionContent>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Use the "Show Diff" button to see what was removed</li>
                        <li>Start with presets and then customize for best results</li>
                        <li>For HTML-heavy content, use the HTML Cleaner preset</li>
                        <li>Advanced users can add custom regex patterns for specific needs</li>
                        <li>Check statistics to see how much content was affected</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ToolLayout>
  );
};

export default RemoveTextFormatting;
