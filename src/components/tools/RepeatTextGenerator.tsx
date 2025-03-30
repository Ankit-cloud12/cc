import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

const RepeatTextGenerator = () => {
  const [inputText, setInputText] = useState<string>("");
  const [repetitions, setRepetitions] = useState<number>(5);
  const [separator, setSeparator] = useState<string>("newline");
  const [customSeparator, setCustomSeparator] = useState<string>("");
  const [outputText, setOutputText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const [warning, setWarning] = useState<string | null>(null);
  
  // Process the text whenever inputs change
  useEffect(() => {
    generateRepeatedText();
  }, [inputText, repetitions, separator, customSeparator]);
  
  // Generate the repeated text
  const generateRepeatedText = () => {
    if (!inputText) {
      setOutputText("");
      setWarning(null);
      return;
    }
    
    // Validate repetitions
    const reps = Math.min(Math.max(1, repetitions), 10000);
    if (reps !== repetitions) {
      setRepetitions(reps);
    }
    
    // Determine the separator to use
    let actualSeparator = "";
    switch (separator) {
      case "newline":
        actualSeparator = "\n";
        break;
      case "space":
        actualSeparator = " ";
        break;
      case "comma":
        actualSeparator = ", ";
        break;
      case "custom":
        actualSeparator = customSeparator;
        break;
      default:
        actualSeparator = "\n";
    }
    
    // Generate the repeated text
    const repeatedArray = Array(reps).fill(inputText);
    const result = repeatedArray.join(actualSeparator);
    
    // Check if result is too large
    if (result.length > 1000000) {
      setWarning("The resulting text is very large and may cause performance issues.");
    } else {
      setWarning(null);
    }
    
    setOutputText(result);
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle clear button
  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setRepetitions(5);
    setSeparator("newline");
    setCustomSeparator("");
    setWarning(null);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Repeat Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Repeat your text a specified number of times with custom separators.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div>
          <Label htmlFor="input-text" className="block mb-2">Text to Repeat</Label>
          <Textarea
            id="input-text"
            placeholder="Enter the text you want to repeat"
            className="w-full min-h-[120px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="repetitions" className="block mb-2">Number of Repetitions</Label>
              <Input
                id="repetitions"
                type="number"
                min="1"
                max="10000"
                className="bg-zinc-700 text-white border-zinc-600"
                value={repetitions}
                onChange={(e) => setRepetitions(parseInt(e.target.value) || 1)}
              />
            </div>
            
            <div>
              <Label htmlFor="separator" className="block mb-2">Separator</Label>
              <Select value={separator} onValueChange={setSeparator}>
                <SelectTrigger id="separator" className="bg-zinc-700 border-zinc-600">
                  <SelectValue placeholder="Select separator" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-700 border-zinc-600">
                  <SelectItem value="newline">New Line</SelectItem>
                  <SelectItem value="space">Space</SelectItem>
                  <SelectItem value="comma">Comma</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {separator === "custom" && (
            <div className="mb-4">
              <Label htmlFor="custom-separator" className="block mb-2">Custom Separator</Label>
              <Input
                id="custom-separator"
                placeholder="Enter custom separator"
                className="bg-zinc-700 text-white border-zinc-600"
                value={customSeparator}
                onChange={(e) => setCustomSeparator(e.target.value)}
              />
            </div>
          )}
        </div>
        
        {/* Output Section */}
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="output-text">Repeated Text</Label>
            <div className="text-sm text-gray-400">
              {outputText.length > 0 && (
                <span>{outputText.length.toLocaleString()} characters</span>
              )}
            </div>
          </div>
          
          {warning && (
            <Alert variant="destructive" className="mb-2">
              <AlertDescription>{warning}</AlertDescription>
            </Alert>
          )}
          
          <Textarea
            id="output-text"
            readOnly
            className="w-full min-h-[250px] bg-zinc-700 text-white border-zinc-600 mb-4"
            value={outputText}
            placeholder="Repeated text will appear here"
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
      
      {/* About Section */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Repeat Text Generator</h2>
        <p className="text-gray-300 mb-4">
          The Repeat Text Generator tool allows you to repeat any text multiple times with custom separators.
          This can be useful for:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Creating placeholder or dummy text</li>
          <li>Generating patterns for design or formatting</li>
          <li>Creating repetitive content for testing purposes</li>
          <li>Making ASCII art patterns</li>
          <li>Preparing repetitive data for processing</li>
        </ul>
        <p className="text-gray-300">
          Simply enter the text you want to repeat, specify the number of repetitions
          (1-10,000), and choose a separator. The tool will automatically generate
          the repeated text in real-time.
        </p>
      </div>
    </div>
  );
};

export default RepeatTextGenerator;
