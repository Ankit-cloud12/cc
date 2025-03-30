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
  SelectValue,
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SortOrder = "ascending" | "descending";
type NumberType = "auto" | "integer" | "decimal";
type OutputFormat = "sameLine" | "newLine" | "comma" | "custom";

interface SortingStats {
  total: number;
  min: number | null;
  max: number | null;
  sum: number;
  average: number | null;
  median: number | null;
  uniqueValues: number;
}

const NumberSorter = () => {
  // Input and output
  const [inputText, setInputText] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  
  // Sorting options
  const [sortOrder, setSortOrder] = useState<SortOrder>("ascending");
  const [numberType, setNumberType] = useState<NumberType>("auto");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("sameLine");
  const [customSeparator, setCustomSeparator] = useState<string>(",");
  
  // Additional options
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(false);
  const [ignoreNonNumeric, setIgnoreNonNumeric] = useState<boolean>(true);
  const [thousandSeparators, setThousandSeparators] = useState<boolean>(false);
  
  // Stats and UI state
  const [stats, setStats] = useState<SortingStats>({
    total: 0,
    min: null,
    max: null,
    sum: 0,
    average: null,
    median: null,
    uniqueValues: 0
  });
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  
  // Process the numbers whenever inputs change
  useEffect(() => {
    processNumbers();
  }, [
    inputText, 
    sortOrder, 
    numberType, 
    outputFormat, 
    customSeparator, 
    removeDuplicates, 
    ignoreNonNumeric,
    thousandSeparators
  ]);
  
  // Main processing function
  const processNumbers = () => {
    setError(null);
    
    if (!inputText.trim()) {
      setOutputText("");
      resetStats();
      return;
    }
    
    try {
      // Extract numbers from input
      const numbers = extractNumbers(inputText);
      
      if (numbers.length === 0) {
        setError("No valid numbers found in the input.");
        setOutputText("");
        resetStats();
        return;
      }
      
      // Remove duplicates if needed
      const uniqueNumbers = removeDuplicates 
        ? [...new Set(numbers)]
        : numbers;
      
      // Sort numbers
      const sortedNumbers = sortNumbers(uniqueNumbers);
      
      // Calculate statistics
      calculateStats(sortedNumbers);
      
      // Format output
      const formattedOutput = formatOutput(sortedNumbers);
      setOutputText(formattedOutput);
      
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setOutputText("");
      resetStats();
    }
  };
  
  // Extract numbers from input text
  const extractNumbers = (text: string): number[] => {
    // Split input by various delimiters (comma, space, newline, tab)
    const items = text
      .split(/[\s,;\t\n\r]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    // Process each item based on number type
    const numbers: number[] = [];
    
    for (const item of items) {
      // Remove thousand separators if needed
      const cleanedItem = thousandSeparators 
        ? item.replace(/,/g, "") 
        : item;
      
      // Try to parse as number
      const parsedNumber = parseFloat(cleanedItem);
      
      if (!isNaN(parsedNumber)) {
        // For integer mode, only add if it's an integer
        if (numberType === "integer" && !Number.isInteger(parsedNumber)) {
          if (!ignoreNonNumeric) {
            throw new Error(`"${item}" is not an integer.`);
          }
          continue;
        }
        
        numbers.push(parsedNumber);
      } else if (!ignoreNonNumeric) {
        throw new Error(`"${item}" is not a valid number.`);
      }
    }
    
    return numbers;
  };
  
  // Sort numbers based on current options
  const sortNumbers = (numbers: number[]): number[] => {
    return [...numbers].sort((a, b) => {
      return sortOrder === "ascending" ? a - b : b - a;
    });
  };
  
  // Calculate statistics for the numbers
  const calculateStats = (numbers: number[]): void => {
    if (numbers.length === 0) {
      resetStats();
      return;
    }
    
    const min = Math.min(...numbers);
    const max = Math.max(...numbers);
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    const average = sum / numbers.length;
    
    // Calculate median
    const sortedForMedian = [...numbers].sort((a, b) => a - b);
    let median: number;
    const mid = Math.floor(sortedForMedian.length / 2);
    
    if (sortedForMedian.length % 2 === 0) {
      median = (sortedForMedian[mid - 1] + sortedForMedian[mid]) / 2;
    } else {
      median = sortedForMedian[mid];
    }
    
    setStats({
      total: numbers.length,
      min,
      max,
      sum,
      average,
      median,
      uniqueValues: new Set(numbers).size
    });
  };
  
  // Format output based on selected format
  const formatOutput = (numbers: number[]): string => {
    if (numbers.length === 0) return "";
    
    // Apply thousand separators if enabled
    const formattedNumbers = thousandSeparators 
      ? numbers.map(num => num.toLocaleString())
      : numbers.map(num => num.toString());
    
    // Format based on output setting
    switch (outputFormat) {
      case "sameLine":
        return formattedNumbers.join(" ");
      case "newLine":
        return formattedNumbers.join("\n");
      case "comma":
        return formattedNumbers.join(", ");
      case "custom":
        return formattedNumbers.join(customSeparator);
      default:
        return formattedNumbers.join(" ");
    }
  };
  
  // Reset statistics
  const resetStats = (): void => {
    setStats({
      total: 0,
      min: null,
      max: null,
      sum: 0,
      average: null,
      median: null,
      uniqueValues: 0
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
    resetStats();
    setError(null);
  };
  
  // Handle example loading
  const loadExample = (example: string) => {
    switch (example) {
      case "integers":
        setInputText("42 8 15 16 23 4 42 15 8");
        setNumberType("integer");
        break;
      case "decimals":
        setInputText("3.14, 2.71828, 1.618, 0.577, 1.414, 3.14");
        setNumberType("decimal");
        break;
      case "mixed":
        setInputText("10\n5.5\n20\n-30\n3.33\n100\n-5.5");
        setNumberType("auto");
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Number Sorter</h1>
      <p className="text-gray-300 mb-6">
        Sort numeric values in ascending or descending order with various formatting options.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="input-text">Numbers to Sort</Label>
            <div className="space-x-2">
              <Button
                variant="outline" 
                size="sm"
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={() => loadExample("integers")}
              >
                Integers
              </Button>
              <Button
                variant="outline" 
                size="sm"
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={() => loadExample("decimals")}
              >
                Decimals
              </Button>
              <Button
                variant="outline" 
                size="sm"
                className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={() => loadExample("mixed")}
              >
                Mixed
              </Button>
            </div>
          </div>
          
          <Textarea
            id="input-text"
            placeholder="Enter numbers separated by spaces, commas, or line breaks"
            className="w-full min-h-[150px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="bg-zinc-700 p-4 rounded mb-4">
            <h3 className="text-lg font-medium mb-3">Sorting Options</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="sort-order" className="block mb-2">Sort Order</Label>
                <Select
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as SortOrder)}
                >
                  <SelectTrigger id="sort-order" className="bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Select order" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 border-zinc-600">
                    <SelectItem value="ascending">Ascending (Low to High)</SelectItem>
                    <SelectItem value="descending">Descending (High to Low)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="number-type" className="block mb-2">Number Type</Label>
                <Select
                  value={numberType}
                  onValueChange={(value) => setNumberType(value as NumberType)}
                >
                  <SelectTrigger id="number-type" className="bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 border-zinc-600">
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="integer">Integers Only</SelectItem>
                    <SelectItem value="decimal">Allow Decimals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Tabs
              value={outputFormat}
              onValueChange={(value) => setOutputFormat(value as OutputFormat)}
              className="mb-4"
            >
              <Label className="block mb-2">Output Format</Label>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sameLine">Space</TabsTrigger>
                <TabsTrigger value="newLine">New Line</TabsTrigger>
                <TabsTrigger value="comma">Comma</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
              
              {outputFormat === "custom" && (
                <div className="mt-4">
                  <Label htmlFor="custom-separator" className="block mb-2">Custom Separator</Label>
                  <Input
                    id="custom-separator"
                    placeholder="Enter separator"
                    className="bg-zinc-700 text-white border-zinc-600"
                    value={customSeparator}
                    onChange={(e) => setCustomSeparator(e.target.value)}
                  />
                </div>
              )}
            </Tabs>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remove-duplicates" 
                  checked={removeDuplicates}
                  onCheckedChange={(checked) => setRemoveDuplicates(!!checked)}
                />
                <Label htmlFor="remove-duplicates" className="cursor-pointer">
                  Remove duplicate numbers
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ignore-non-numeric" 
                  checked={ignoreNonNumeric}
                  onCheckedChange={(checked) => setIgnoreNonNumeric(!!checked)}
                />
                <Label htmlFor="ignore-non-numeric" className="cursor-pointer">
                  Ignore non-numeric entries
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="thousand-separators" 
                  checked={thousandSeparators}
                  onCheckedChange={(checked) => setThousandSeparators(!!checked)}
                />
                <Label htmlFor="thousand-separators" className="cursor-pointer">
                  Add thousand separators to output
                </Label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Output Section */}
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="output-text">Sorted Numbers</Label>
            <div className="text-sm text-gray-400">
              {stats.total > 0 && (
                <span>{stats.total} number{stats.total !== 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <Textarea
            id="output-text"
            readOnly
            className="w-full min-h-[150px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={outputText}
            placeholder="Sorted numbers will appear here"
          />
          
          {stats.total > 0 && (
            <div className="bg-zinc-700 p-4 rounded mb-4">
              <h3 className="text-lg font-medium mb-3">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Total:</span> {stats.total}
                  </div>
                  <div>
                    <span className="text-gray-400">Min:</span> {stats.min !== null && (thousandSeparators ? stats.min.toLocaleString() : stats.min)}
                  </div>
                  <div>
                    <span className="text-gray-400">Max:</span> {stats.max !== null && (thousandSeparators ? stats.max.toLocaleString() : stats.max)}
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-400">Sum:</span> {thousandSeparators ? stats.sum.toLocaleString() : stats.sum}
                  </div>
                  <div>
                    <span className="text-gray-400">Average:</span> {stats.average !== null && stats.average.toFixed(2)}
                  </div>
                  <div>
                    <span className="text-gray-400">Median:</span> {stats.median !== null && stats.median.toFixed(2)}
                  </div>
                  {removeDuplicates && (
                    <div>
                      <span className="text-gray-400">Duplicates removed:</span> {stats.total - stats.uniqueValues}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
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
      
      {/* About Section */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Number Sorter</h2>
        <p className="text-gray-300 mb-4">
          This tool sorts numeric values in ascending or descending order with various formatting options. It can handle both integers and decimal numbers.
        </p>
        <p className="text-gray-300 mb-4">
          Key features:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li><strong>Flexible Input:</strong> Enter numbers separated by spaces, commas, or line breaks.</li>
          <li><strong>Sorting Options:</strong> Sort in ascending (low to high) or descending (high to low) order.</li>
          <li><strong>Number Type Filtering:</strong> Choose to work with integers only or allow decimal values.</li>
          <li><strong>Output Formatting:</strong> Format the output with various separators including custom ones.</li>
          <li><strong>Duplicate Handling:</strong> Option to remove duplicate numbers from the result.</li>
          <li><strong>Statistical Information:</strong> View statistics like min, max, sum, average, and median.</li>
        </ul>
        <p className="text-gray-300">
          This tool is useful for data analysis, organizing numerical datasets, preparing data for reporting,
          and any task that requires numeric sorting.
        </p>
      </div>
    </div>
  );
};

export default NumberSorter;
