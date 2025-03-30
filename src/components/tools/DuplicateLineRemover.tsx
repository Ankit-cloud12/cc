import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ToolLayout } from "./ToolLayout";

const DuplicateLineRemover = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("options");
  
  // Statistics
  const [totalLines, setTotalLines] = useState(0);
  const [uniqueLines, setUniqueLines] = useState(0);
  const [duplicatesRemoved, setDuplicatesRemoved] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);

  // Advanced options
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [ignoreEmptyLines, setIgnoreEmptyLines] = useState(true);
  const [onlyConsecutive, setOnlyConsecutive] = useState(false);
  const [preserveOrder, setPreserveOrder] = useState(true);
  const [keepDuplicatesOnly, setKeepDuplicatesOnly] = useState(false);

  // Update statistics when input text changes
  useEffect(() => {
    const lines = inputText.split("\n");
    setTotalLines(lines.length);
    
    // Calculate unique lines count without actually processing
    let uniqueCount = 0;
    const seen = new Set();
    
    for (const line of lines) {
      const processedLine = processLine(line);
      if (ignoreEmptyLines && processedLine === "") continue;
      
      if (!seen.has(processedLine)) {
        seen.add(processedLine);
        uniqueCount++;
      }
    }
    
    setUniqueLines(uniqueCount);
    setDuplicatesRemoved(totalLines - uniqueCount);
  }, [inputText, trimWhitespace, caseInsensitive, ignoreEmptyLines]);

  // Helper function to process a line according to options
  const processLine = (line: string): string => {
    let processedLine = line;
    
    if (trimWhitespace) {
      processedLine = processedLine.trim();
    }
    
    if (caseInsensitive) {
      processedLine = processedLine.toLowerCase();
    }
    
    return processedLine;
  };

  // Main function to remove duplicates
  const removeDuplicateLines = () => {
    const startTime = performance.now();
    const lines = inputText.split("\n");
    let result: string[] = [];
    
    if (onlyConsecutive) {
      // Remove only consecutive duplicates
      result = lines.filter((line, index, array) => {
        const currentLine = processLine(line);
        if (ignoreEmptyLines && currentLine === "") return false;
        
        const prevLine = index > 0 ? processLine(array[index - 1]) : null;
        return currentLine !== prevLine;
      });
    } else {
      // Remove all duplicates
      const seen = new Set<string>();
      const duplicates = new Set<string>();
      
      if (preserveOrder) {
        result = lines.filter(line => {
          const processedLine = processLine(line);
          if (ignoreEmptyLines && processedLine === "") return false;
          
          if (seen.has(processedLine)) {
            duplicates.add(processedLine);
            return false;
          }
          
          seen.add(processedLine);
          return true;
        });
      } else {
        // Use Set to remove duplicates (doesn't preserve order)
        const uniqueProcessedLines = new Set<string>();
        
        lines.forEach(line => {
          const processedLine = processLine(line);
          if (!(ignoreEmptyLines && processedLine === "")) {
            if (seen.has(processedLine)) {
              duplicates.add(processedLine);
            } else {
              seen.add(processedLine);
              uniqueProcessedLines.add(line);
            }
          }
        });
        
        result = Array.from(uniqueProcessedLines);
      }
      
      // If we want to keep only duplicates, invert the result
      if (keepDuplicatesOnly) {
        result = lines.filter(line => {
          const processedLine = processLine(line);
          return duplicates.has(processedLine);
        });
      }
    }
    
    const endTime = performance.now();
    setProcessingTime(endTime - startTime);
    setOutputText(result.join("\n"));
    
    // Update statistics
    setUniqueLines(result.length);
    setDuplicatesRemoved(totalLines - result.length);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setTotalLines(0);
    setUniqueLines(0);
    setDuplicatesRemoved(0);
    setProcessingTime(0);
  };

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  }

  // Generate a download for the output text
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "unique-lines.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Duplicate Line Remover" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Duplicate Line Remover</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Remove duplicate lines from your text with advanced options for precise control.
        </p>

        {/* Input and Output Textboxes */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder="Paste text with duplicate lines here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
          </div>
          
          <div className="w-full md:w-1/2">
            <Textarea
              readOnly
              placeholder="Unique text will appear here"
              value={outputText}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
          </div>
        </div>
        
        {/* Actions Row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            onClick={removeDuplicateLines} 
            disabled={!inputText}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Remove Duplicates
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCopy} 
            disabled={!outputText}
            className="border-zinc-600"
          >
            {copied ? "Copied!" : "Copy Output"}
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
            Clear All
          </Button>
        </div>
        
        {/* Stats Card */}
        <Card className="p-4 mb-4 bg-zinc-800 border-zinc-700">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Total Lines</span>
              <span className="text-xl font-semibold">{totalLines}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Unique Lines</span>
              <span className="text-xl font-semibold">{uniqueLines}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Duplicates Removed</span>
              <span className="text-xl font-semibold">{duplicatesRemoved}</span>
            </div>
            
            {processingTime > 0 && (
              <div className="flex flex-col">
                <span className="text-xs text-gray-400">Processing Time</span>
                <span className="text-xl font-semibold">{processingTime.toFixed(2)} ms</span>
              </div>
            )}
          </div>
        </Card>
        
        {/* Options Panel */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="options" className="data-[state=active]:bg-zinc-700">Options</TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="options" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h3 className="font-medium">Text Processing</h3>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="trim" 
                    checked={trimWhitespace} 
                    onCheckedChange={setTrimWhitespace} 
                  />
                  <Label htmlFor="trim">Trim whitespace before comparison</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="case" 
                    checked={caseInsensitive} 
                    onCheckedChange={setCaseInsensitive} 
                  />
                  <Label htmlFor="case">Case-insensitive matching</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="empty" 
                    checked={ignoreEmptyLines} 
                    onCheckedChange={setIgnoreEmptyLines} 
                  />
                  <Label htmlFor="empty">Ignore empty lines</Label>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-medium">Removal Strategy</h3>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="consecutive" 
                    checked={onlyConsecutive} 
                    onCheckedChange={setOnlyConsecutive} 
                  />
                  <Label htmlFor="consecutive">Remove only consecutive duplicates</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="order" 
                    checked={preserveOrder} 
                    onCheckedChange={setPreserveOrder} 
                  />
                  <Label htmlFor="order">Preserve original line order</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="keepDuplicates" 
                    checked={keepDuplicatesOnly} 
                    onCheckedChange={setKeepDuplicatesOnly} 
                  />
                  <Label htmlFor="keepDuplicates">Keep duplicates only (invert)</Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Duplicate Line Remover</h3>
            <p className="mb-4">This tool helps you remove duplicate lines from text with advanced options:</p>
            
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><span className="font-medium">Trim whitespace</span> - Ignores leading/trailing spaces when comparing</li>
              <li><span className="font-medium">Case-insensitive</span> - Treats "Text" and "text" as duplicates</li>
              <li><span className="font-medium">Ignore empty</span> - Skips blank lines during processing</li>
              <li><span className="font-medium">Consecutive only</span> - Removes duplicates only when they appear next to each other</li>
              <li><span className="font-medium">Preserve order</span> - Keeps the first occurrence of each line in original sequence</li>
              <li><span className="font-medium">Keep duplicates</span> - Inverts the functionality to only keep duplicate lines</li>
            </ul>
            
            <p className="text-sm text-gray-400">
              Duplicate Line Remover is particularly useful for cleaning up data, processing logs, organizing lists, and other text manipulation tasks.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default DuplicateLineRemover;
