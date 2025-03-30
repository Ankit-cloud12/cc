import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SeparatorType = "dash" | "underscore" | "period" | "none" | "custom";
type CaseType = "lowercase" | "uppercase" | "capitalize";

const SlugifyUrlGenerator = () => {
  // Input and output
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  
  // Options
  const [separatorType, setSeparatorType] = useState<SeparatorType>("dash");
  const [customSeparator, setCustomSeparator] = useState<string>("-");
  const [caseType, setCaseType] = useState<CaseType>("lowercase");
  const [maxLength, setMaxLength] = useState<number>(0);
  const [removeStopWords, setRemoveStopWords] = useState<boolean>(false);
  const [preserveNumbers, setPreserveNumbers] = useState<boolean>(true);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [lowerCaseDomains, setLowerCaseDomains] = useState<boolean>(true);
  
  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  
  // Common English stop words to optionally remove
  const stopWords = [
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", 
    "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", 
    "can't", "cannot", "could", "couldn't", 
    "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", 
    "each", 
    "few", "for", "from", "further", 
    "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's",
    "hers", "herself", "him", "himself", "his", "how", "how's", 
    "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", 
    "let's", 
    "me", "more", "most", "mustn't", "my", "myself", 
    "no", "nor", "not", 
    "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", 
    "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", 
    "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these",
    "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", 
    "under", "until", "up", 
    "very", 
    "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would", "wouldn't", 
    "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
  ];
  
  // Process text whenever inputs change
  useEffect(() => {
    slugifyText();
  }, [
    inputText, 
    separatorType, 
    customSeparator,
    caseType,
    maxLength,
    removeStopWords,
    preserveNumbers,
    trimWhitespace,
    lowerCaseDomains
  ]);
  
  // Main slugify function
  const slugifyText = () => {
    if (!inputText) {
      setOutputText("");
      return;
    }
    
    let text = inputText;
    
    // Process URL data specially - extract domain parts if input looks like a URL
    if (lowerCaseDomains && (text.startsWith('http://') || text.startsWith('https://') || text.includes('www.'))) {
      try {
        // Try to extract URL parts
        let url: URL;
        if (text.startsWith('http://') || text.startsWith('https://')) {
          url = new URL(text);
        } else {
          url = new URL('http://' + text);
        }
        
        // Get path without domain
        const pathWithoutParams = url.pathname;
        
        // Create result with lowercase domain
        text = url.hostname.toLowerCase() + pathWithoutParams;
      } catch (e) {
        // If URL parsing fails, just continue with normal slugify
      }
    }
    
    // Trim whitespace
    if (trimWhitespace) {
      text = text.trim();
    }
    
    // Remove accents/diacritics
    text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    
    // Convert to chosen case
    switch (caseType) {
      case "lowercase":
        text = text.toLowerCase();
        break;
      case "uppercase":
        text = text.toUpperCase();
        break;
      case "capitalize":
        text = text.toLowerCase().split(' ')
                   .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                   .join(' ');
        break;
    }
    
    // Remove stop words if enabled
    if (removeStopWords) {
      const words = text.split(/\s+/);
      text = words.filter(word => !stopWords.includes(word.toLowerCase())).join(' ');
    }
    
    // Choose separator
    let separator = "-";
    switch (separatorType) {
      case "dash":
        separator = "-";
        break;
      case "underscore":
        separator = "_";
        break;
      case "period":
        separator = ".";
        break;
      case "none":
        separator = "";
        break;
      case "custom":
        separator = customSeparator;
        break;
    }
    
    // Replace spaces and non-alphanumeric characters with separator
    if (preserveNumbers) {
      text = text.replace(/[^a-zA-Z0-9\s-]/g, "");
    } else {
      text = text.replace(/[^a-zA-Z\s-]/g, "");
    }
    
    // Replace multiple spaces with single separator
    text = text.replace(/\s+/g, separator);
    
    // Replace multiple separators with a single separator
    const escapedSeparator = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const multiSeparatorRegex = new RegExp(`${escapedSeparator}+`, 'g');
    text = text.replace(multiSeparatorRegex, separator);
    
    // Remove leading/trailing separators
    if (separator) {
      text = text.replace(new RegExp(`^${escapedSeparator}|${escapedSeparator}$`, 'g'), '');
    }
    
    // Truncate to max length if specified (greater than 0)
    if (maxLength > 0 && text.length > maxLength) {
      // Trim to max length but try not to cut off in the middle of a word
      const lastSeparatorPos = text.lastIndexOf(separator, maxLength);
      if (lastSeparatorPos > 0) {
        text = text.substring(0, lastSeparatorPos);
      } else {
        text = text.substring(0, maxLength);
      }
    }
    
    setOutputText(text);
  };
  
  // Handle example loading
  const loadExample = (example: string) => {
    switch (example) {
      case "title":
        setInputText("The Quick Brown Fox Jumps Over The Lazy Dog");
        break;
      case "url":
        setInputText("https://www.example.com/Some-Path/With--Symbols/?query=value");
        break;
      case "sentence":
        setInputText("This is a sample sentence with punctuation, numbers (123), and special characters!?");
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
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Slugify URL Handle Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert text or URLs into clean, SEO-friendly slugs for use in website URLs.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="input-text">Input Text or URL</Label>
            <div className="space-x-2">
              <Button
                variant="outline" 
                size="sm"
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={() => loadExample("title")}
              >
                Title
              </Button>
              <Button
                variant="outline" 
                size="sm"
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={() => loadExample("url")}
              >
                URL
              </Button>
            </div>
          </div>
          
          <Textarea
            id="input-text"
            placeholder="Enter text to slugify"
            className="w-full min-h-[120px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="bg-zinc-700 p-4 rounded mb-4">
            <h3 className="text-lg font-medium mb-3">Slugify Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="separator-type" className="block mb-2">Separator</Label>
                <Select 
                  value={separatorType}
                  onValueChange={(value) => setSeparatorType(value as SeparatorType)}
                >
                  <SelectTrigger id="separator-type" className="bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Select separator" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 border-zinc-600">
                    <SelectItem value="dash">Dash (-)</SelectItem>
                    <SelectItem value="underscore">Underscore (_)</SelectItem>
                    <SelectItem value="period">Period (.)</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="case-type" className="block mb-2">Case</Label>
                <Select 
                  value={caseType}
                  onValueChange={(value) => setCaseType(value as CaseType)}
                >
                  <SelectTrigger id="case-type" className="bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Select case" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 border-zinc-600">
                    <SelectItem value="lowercase">Lowercase</SelectItem>
                    <SelectItem value="uppercase">UPPERCASE</SelectItem>
                    <SelectItem value="capitalize">Capitalize Each Word</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {separatorType === "custom" && (
              <div className="mb-4">
                <Label htmlFor="custom-separator" className="block mb-2">Custom Separator</Label>
                <Input
                  id="custom-separator"
                  className="bg-zinc-700 text-white border-zinc-600"
                  value={customSeparator}
                  onChange={(e) => setCustomSeparator(e.target.value)}
                  maxLength={5}
                  placeholder="Enter custom separator"
                />
              </div>
            )}
            
            <div className="mb-4">
              <Label htmlFor="max-length" className="block mb-2">Max Length (0 for unlimited)</Label>
              <Input
                id="max-length"
                type="number"
                min="0"
                max="1000"
                className="bg-zinc-700 text-white border-zinc-600"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value) || 0)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remove-stop-words" 
                  checked={removeStopWords}
                  onCheckedChange={(checked) => setRemoveStopWords(!!checked)}
                />
                <Label htmlFor="remove-stop-words" className="cursor-pointer">
                  Remove common words (a, the, and, etc.)
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="preserve-numbers" 
                  checked={preserveNumbers}
                  onCheckedChange={(checked) => setPreserveNumbers(!!checked)}
                />
                <Label htmlFor="preserve-numbers" className="cursor-pointer">
                  Preserve numbers
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="trim-whitespace" 
                  checked={trimWhitespace}
                  onCheckedChange={(checked) => setTrimWhitespace(!!checked)}
                />
                <Label htmlFor="trim-whitespace" className="cursor-pointer">
                  Trim whitespace
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="lowercase-domains" 
                  checked={lowerCaseDomains}
                  onCheckedChange={(checked) => setLowerCaseDomains(!!checked)}
                />
                <Label htmlFor="lowercase-domains" className="cursor-pointer">
                  Force domains to lowercase (for URLs)
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Output Section */}
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="output-text">Slugified Result</Label>
            <div className="text-sm text-gray-400">
              {outputText.length > 0 && (
                <span>{outputText.length} characters</span>
              )}
            </div>
          </div>
          
          <div className="relative">
            <Input
              id="output-text"
              readOnly
              className="w-full bg-zinc-700 text-white border-zinc-600 mb-4 font-mono"
              value={outputText}
              placeholder="Slugified result will appear here"
            />
            
            {outputText && (
              <div className="mt-2 mb-4 text-sm text-gray-400">
                <span>Example URL: </span>
                <span className="font-mono">https://example.com/{outputText}</span>
              </div>
            )}
          </div>
          
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
          
          <div className="mt-6 bg-zinc-700 p-4 rounded">
            <h3 className="text-lg font-medium mb-3">What's a Slug?</h3>
            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="about">About Slugs</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-4">
                <p className="text-gray-300 mb-3">
                  A slug is a URL-friendly version of a string, typically used for creating clean, readable URLs.
                  Good slugs are:
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
                  <li>Human-readable</li>
                  <li>Lowercase</li>
                  <li>Use separators (typically hyphens) instead of spaces</li>
                  <li>Avoid special characters, punctuation, and diacritics</li>
                  <li>Relatively short but descriptive</li>
                </ul>
                <p className="text-gray-300">
                  Slugs help with SEO (Search Engine Optimization) and provide users with 
                  more meaningful URLs that indicate the content of the page.
                </p>
              </TabsContent>
              
              <TabsContent value="examples" className="mt-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Blog Post Title</h4>
                    <div className="bg-zinc-800 p-2 rounded">
                      <div className="mb-1"><span className="text-gray-400">Original: </span>10 Tips for Better SEO in 2023</div>
                      <div><span className="text-gray-400">Slug: </span>10-tips-for-better-seo-in-2023</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Product Name</h4>
                    <div className="bg-zinc-800 p-2 rounded">
                      <div className="mb-1"><span className="text-gray-400">Original: </span>Sony WH-1000XM4 Wireless Noise Cancelling Headphones</div>
                      <div><span className="text-gray-400">Slug: </span>sony-wh-1000xm4-wireless-noise-cancelling-headphones</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">URL Cleanup</h4>
                    <div className="bg-zinc-800 p-2 rounded">
                      <div className="mb-1"><span className="text-gray-400">Original: </span>https://example.com/products/?id=123&name=Cool+Product!</div>
                      <div><span className="text-gray-400">Slug: </span>example.com/products/cool-product</div>
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
        <h2 className="text-xl font-bold mb-4">About Slugify URL Handle Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool helps you create clean, SEO-friendly URL slugs from text or URLs. A slug is the part of a URL
          that identifies a page in human-readable keywords.
        </p>
        <p className="text-gray-300 mb-4">
          Key features:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li><strong>Customizable separators:</strong> Choose between hyphens, underscores, periods, or custom separators</li>
          <li><strong>Case options:</strong> Convert to lowercase, uppercase, or capitalize each word</li>
          <li><strong>Maximum length control:</strong> Limit slug length for better URLs</li>
          <li><strong>Stop word removal:</strong> Optionally remove common words like "a", "the", "and", etc.</li>
          <li><strong>Special character handling:</strong> Remove accents, symbols, and normalize text</li>
          <li><strong>URL-specific options:</strong> Special handling for domain names and URL structure</li>
        </ul>
        <p className="text-gray-300">
          Clean, optimized slugs help improve your website's user experience and search engine rankings.
          They make URLs more shareable, meaningful, and easier to understand at a glance.
        </p>
      </div>
    </div>
  );
};

export default SlugifyUrlGenerator;
