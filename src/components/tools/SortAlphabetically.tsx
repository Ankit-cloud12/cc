import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SortMode = "words" | "lines" | "sentences" | "paragraphs";
type SortDirection = "ascending" | "descending";

const SortAlphabetically = () => {
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [sortMode, setSortMode] = useState<SortMode>("words");
  const [direction, setDirection] = useState<SortDirection>("ascending");
  const [caseSensitive, setCaseSensitive] = useState<boolean>(false);
  const [trimWhitespace, setTrimWhitespace] = useState<boolean>(true);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(false);
  const [ignoreLeadingChars, setIgnoreLeadingChars] = useState<boolean>(false);
  const [ignoreLeadingCount, setIgnoreLeadingCount] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    original: { count: number },
    sorted: { count: number },
  }>({
    original: { count: 0 },
    sorted: { count: 0 },
  });

  // Process the text whenever inputs change
  useEffect(() => {
    processText();
  }, [
    inputText, 
    sortMode, 
    direction, 
    caseSensitive, 
    trimWhitespace, 
    removeDuplicates,
    ignoreLeadingChars,
    ignoreLeadingCount
  ]);

  // Main processing function
  const processText = () => {
    if (!inputText.trim()) {
      setOutputText("");
      setStats({
        original: { count: 0 },
        sorted: { count: 0 },
      });
      return;
    }

    // Split text based on sort mode
    let items: string[];
    switch (sortMode) {
      case "words":
        items = inputText.match(/\S+/g) || [];
        break;
      case "lines":
        items = inputText.split(/\r?\n/);
        break;
      case "sentences":
        items = inputText.match(/[^.!?]+[.!?]+/g) || [];
        break;
      case "paragraphs":
        items = inputText.split(/\n\s*\n/);
        break;
      default:
        items = inputText.match(/\S+/g) || [];
    }

    // Apply trimming if enabled
    if (trimWhitespace) {
      items = items.map(item => item.trim());
    }

    // Remove empty items
    items = items.filter(item => item.length > 0);

    // Track original count before potential duplicates removal
    const originalCount = items.length;

    // Sort items
    items.sort((a, b) => {
      let strA = a;
      let strB = b;

      // Handle ignore leading characters
      if (ignoreLeadingChars) {
        if (a.length > ignoreLeadingCount) {
          strA = a.substring(ignoreLeadingCount);
        }
        if (b.length > ignoreLeadingCount) {
          strB = b.substring(ignoreLeadingCount);
        }
      }

      // Handle case sensitivity
      if (!caseSensitive) {
        strA = strA.toLowerCase();
        strB = strB.toLowerCase();
      }

      // Sort
      if (strA < strB) return direction === "ascending" ? -1 : 1;
      if (strA > strB) return direction === "ascending" ? 1 : -1;
      return 0;
    });

    // Remove duplicates if enabled
    if (removeDuplicates) {
      const uniqueItems: string[] = [];
      const seen = new Set<string>();

      items.forEach(item => {
        const key = caseSensitive ? item : item.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          uniqueItems.push(item);
        }
      });

      items = uniqueItems;
    }

    // Join items based on sort mode
    let result: string;
    switch (sortMode) {
      case "words":
        result = items.join(" ");
        break;
      case "lines":
        result = items.join("\n");
        break;
      case "sentences":
        result = items.join(" ");
        break;
      case "paragraphs":
        result = items.join("\n\n");
        break;
      default:
        result = items.join(" ");
    }

    setOutputText(result);
    setStats({
      original: { count: originalCount },
      sorted: { count: items.length },
    });
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
    setStats({
      original: { count: 0 },
      sorted: { count: 0 },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Sort Words Alphabetically</h1>
      <p className="text-gray-300 mb-6">
        Sort text alphabetically by words, lines, sentences, or paragraphs with customizable options.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div>
          <Label htmlFor="input-text" className="block mb-2">Text to Sort</Label>
          <Textarea
            id="input-text"
            placeholder="Enter or paste text to sort alphabetically"
            className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="sort-mode" className="block mb-2">Sort By</Label>
              <Select value={sortMode} onValueChange={(value) => setSortMode(value as SortMode)}>
                <SelectTrigger id="sort-mode" className="bg-zinc-700 border-zinc-600">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 border-zinc-600">
                  <SelectItem value="words">Words</SelectItem>
                  <SelectItem value="lines">Lines</SelectItem>
                  <SelectItem value="sentences">Sentences</SelectItem>
                  <SelectItem value="paragraphs">Paragraphs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="sort-direction" className="block mb-2">Direction</Label>
              <Select value={direction} onValueChange={(value) => setDirection(value as SortDirection)}>
                <SelectTrigger id="sort-direction" className="bg-zinc-700 border-zinc-600">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 border-zinc-600">
                  <SelectItem value="ascending">A to Z (Ascending)</SelectItem>
                  <SelectItem value="descending">Z to A (Descending)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Output Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="output-text">Sorted Text</Label>
            <div className="text-sm text-gray-400">
              {stats.sorted.count > 0 && (
                <span>
                  {stats.sorted.count} {sortMode}
                  {stats.original.count !== stats.sorted.count && 
                    ` (${stats.original.count - stats.sorted.count} duplicates removed)`}
                </span>
              )}
            </div>
          </div>
          
          <Textarea
            id="output-text"
            readOnly
            className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={outputText}
            placeholder="Sorted text will appear here"
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
        <h3 className="text-lg font-medium mb-3">Sorting Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="case-sensitive" 
              checked={caseSensitive}
              onCheckedChange={(checked) => setCaseSensitive(!!checked)}
            />
            <Label htmlFor="case-sensitive" className="cursor-pointer">Case sensitive sorting</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="trim-whitespace" 
              checked={trimWhitespace}
              onCheckedChange={(checked) => setTrimWhitespace(!!checked)}
            />
            <Label htmlFor="trim-whitespace" className="cursor-pointer">Trim whitespace</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remove-duplicates" 
              checked={removeDuplicates}
              onCheckedChange={(checked) => setRemoveDuplicates(!!checked)}
            />
            <Label htmlFor="remove-duplicates" className="cursor-pointer">Remove duplicates</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="ignore-leading" 
              checked={ignoreLeadingChars}
              onCheckedChange={(checked) => setIgnoreLeadingChars(!!checked)}
            />
            <Label htmlFor="ignore-leading" className="cursor-pointer">
              Ignore first 
              <input
                type="number"
                min="1"
                max="10"
                value={ignoreLeadingCount}
                onChange={(e) => setIgnoreLeadingCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-10 mx-1 p-0 text-center bg-zinc-800 border border-zinc-600 rounded"
                disabled={!ignoreLeadingChars}
              /> 
              characters
            </Label>
          </div>
        </div>
      </div>
      
      {/* Examples and Information */}
      <div className="mt-8 mb-12">
        <Tabs defaultValue="about">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="about">About This Tool</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-700 rounded mt-4">
            <h2 className="text-xl font-bold mb-3">About Sort Words Alphabetically</h2>
            <p className="text-gray-300 mb-4">
              This tool allows you to sort text alphabetically in various ways. You can sort by words, 
              lines, sentences, or paragraphs, in either ascending (A to Z) or descending (Z to A) order.
            </p>
            <p className="text-gray-300 mb-4">
              Additional sorting options include:
            </p>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
              <li><strong>Case sensitive sorting:</strong> When enabled, uppercase letters are sorted before lowercase (e.g., "Z" comes before "a").</li>
              <li><strong>Trim whitespace:</strong> Removes extra spaces and whitespace before sorting.</li>
              <li><strong>Remove duplicates:</strong> Ensures each word, line, sentence, or paragraph appears only once in the output.</li>
              <li><strong>Ignore leading characters:</strong> Ignores a specified number of characters at the beginning when sorting.</li>
            </ul>
            <p className="text-gray-300">
              This tool is useful for organizing lists, sorting bibliographies, arranging data alphabetically,
              and many other text organization tasks.
            </p>
          </TabsContent>
          
          <TabsContent value="examples" className="p-4 bg-zinc-700 rounded mt-4">
            <h2 className="text-xl font-bold mb-3">Example Uses</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Sorting a List of Names</h3>
              <p className="text-gray-300 mb-2">Input:</p>
              <pre className="bg-zinc-800 p-2 rounded mb-2 text-gray-300">
                David Smith
                Alice Johnson
                Charles Brown
                Bob Williams
              </pre>
              <p className="text-gray-300 mb-2">Output (sorted by lines, ascending):</p>
              <pre className="bg-zinc-800 p-2 rounded mb-2 text-gray-300">
                Alice Johnson
                Bob Williams
                Charles Brown
                David Smith
              </pre>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Sorting Words in a Sentence</h3>
              <p className="text-gray-300 mb-2">Input:</p>
              <pre className="bg-zinc-800 p-2 rounded mb-2 text-gray-300">
                The quick brown fox jumps over the lazy dog
              </pre>
              <p className="text-gray-300 mb-2">Output (sorted by words, ascending):</p>
              <pre className="bg-zinc-800 p-2 rounded mb-2 text-gray-300">
                brown dog fox jumps lazy over quick the the
              </pre>
              <p className="text-gray-300 mb-2">With "Remove duplicates" option:</p>
              <pre className="bg-zinc-800 p-2 rounded mb-2 text-gray-300">
                brown dog fox jumps lazy over quick the
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SortAlphabetically;
