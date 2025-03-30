import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, ClipboardCopy, Trash2, FileCode } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

interface StringifyOptions {
  space: number | string;
  showFunctionNames: boolean;
  useTruncateReplacer: boolean;
  maxLength: number;
  showNulls: boolean;
  formatOutput: boolean;
}

interface EscapeCodeExample {
  char: string;
  code: string;
  description: string;
}

const escapeCodesExamples: EscapeCodeExample[] = [
  { char: '"', code: '\\"', description: 'Double quote' },
  { char: '\\', code: '\\\\', description: 'Backslash' },
  { char: '\b', code: '\\b', description: 'Backspace' },
  { char: '\f', code: '\\f', description: 'Form feed' },
  { char: '\n', code: '\\n', description: 'New line' },
  { char: '\r', code: '\\r', description: 'Carriage return' },
  { char: '\t', code: '\\t', description: 'Tab' },
  { char: '\v', code: '\\v', description: 'Vertical tab' }
];

// Sample data for demonstration
const sampleData = {
  simple: 'Hello world with "quotes" and special chars: \n\t\\',
  complex: {
    name: "Product",
    description: "This product has a \"special\" feature.\nIt's a multi-line description.",
    price: 99.99,
    inStock: true,
    tags: ["electronics", "featured", "sale"],
    metadata: {
      sku: "P12345",
      dimensions: {
        width: 15,
        height: 10,
        depth: 5
      }
    },
    getLabel: function() { return this.name + " - $" + this.price; },
    customFormatter: null
  }
};

// Function to highlight escape sequences in stringified output
const highlightEscapeSequences = (text: string): React.ReactNode => {
  // Split the string by escape sequences
  const parts = text.split(/(\\["\\/bfnrtuv]|\\u[\da-fA-F]{4})/g);
  
  return parts.map((part, index) => {
    if (part.match(/(\\["\\/bfnrtuv]|\\u[\da-fA-F]{4})/)) {
      return <span key={index} className="bg-blue-500/20 text-white rounded px-0.5">{part}</span>;
    }
    return part;
  });
};

// Function to create a custom replacer function based on options
const createReplacerFunction = (options: StringifyOptions) => {
  if (options.useTruncateReplacer) {
    return (key: string, value: any) => {
      if (typeof value === 'string' && value.length > options.maxLength) {
        return value.substring(0, options.maxLength) + '...';
      }
      if (typeof value === 'function') {
        return options.showFunctionNames ? `[Function: ${value.name || 'anonymous'}]` : undefined;
      }
      if (value === null && !options.showNulls) {
        return undefined;
      }
      return value;
    };
  }
  
  return (key: string, value: any) => {
    if (typeof value === 'function') {
      return options.showFunctionNames ? `[Function: ${value.name || 'anonymous'}]` : undefined;
    }
    if (value === null && !options.showNulls) {
      return undefined;
    }
    return value;
  };
};

// Function to format stringified output with syntax highlighting
const formatStringifiedOutput = (stringified: string): React.ReactNode => {
  return highlightEscapeSequences(stringified);
};

const JsonStringifyTextTool: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [inputIsObject, setInputIsObject] = useState<boolean>(false);
  const [parsedInput, setParsedInput] = useState<any>(null);
  const [exampleType, setExampleType] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  
  // Stringify options
  const [options, setOptions] = useState<StringifyOptions>({
    space: 2,
    showFunctionNames: true,
    useTruncateReplacer: false,
    maxLength: 50,
    showNulls: true,
    formatOutput: true
  });
  
  const { toast } = useToast();
  
  // Process input and generate stringified output
  const processInput = () => {
    setIsError(false);
    setErrorMessage('');
    
    try {
      let valueToStringify: any;
      
      if (inputIsObject) {
        // Input is treated as a JavaScript object/value
        try {
          valueToStringify = parsedInput;
        } catch (e) {
          if (e instanceof Error) {
            setIsError(true);
            setErrorMessage(`Error evaluating input: ${e.message}`);
          }
          return;
        }
      } else {
        // Input is treated as text to be stringified directly
        valueToStringify = input;
      }
      
      // Create replacer function based on options
      const replacer = createReplacerFunction(options);
      
      // Use JSON.stringify with appropriate parameters
      const space = typeof options.space === 'string' ? options.space : Number(options.space);
      const stringified = JSON.stringify(valueToStringify, replacer, space);
      
      setOutput(stringified);
      
    } catch (e) {
      if (e instanceof Error) {
        setIsError(true);
        setErrorMessage(`Error in JSON.stringify: ${e.message}`);
      }
      setOutput('');
    }
  };
  
  // Load and parse example
  const loadExample = (type: string) => {
    setExampleType(type);
    
    if (type === 'simple') {
      setInput(sampleData.simple);
      setInputIsObject(false);
      setParsedInput(null);
    } else if (type === 'complex') {
      setInput(JSON.stringify(sampleData.complex, null, 2));
      setInputIsObject(true);
      setParsedInput(sampleData.complex);
    } else if (type === 'special') {
      setInput('This contains special characters:\n1. Tab: \t\n2. Newline: ↵\n3. Quotes: "quoted"\n4. Backslash: \\');
      setInputIsObject(false);
      setParsedInput(null);
    }
  };
  
  // Toggle between treating input as plain text or as an object
  const toggleInputMode = () => {
    if (!inputIsObject) {
      // Switching from text to object
      try {
        const parsed = JSON.parse(input);
        setParsedInput(parsed);
        setInputIsObject(true);
      } catch (e) {
        toast({
          title: "Invalid JSON",
          description: "Could not parse input as JSON. Object mode requires valid JSON syntax.",
          variant: "destructive"
        });
        return;
      }
    } else {
      // Switching from object to text
      setInputIsObject(false);
    }
  };
  
  // Try to parse input as JSON when input changes and in object mode
  useEffect(() => {
    if (inputIsObject) {
      try {
        const parsed = JSON.parse(input);
        setParsedInput(parsed);
      } catch (e) {
        // Silent error for real-time typing
      }
    }
  }, [input, inputIsObject]);
  
  // Process input when various parameters change
  useEffect(() => {
    if (input) {
      processInput();
    }
  }, [input, inputIsObject, parsedInput, options]);
  
  // Copy output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear input and output
  const clearInput = () => {
    setInput('');
    setOutput('');
    setIsError(false);
    setErrorMessage('');
    setParsedInput(null);
    setExampleType('');
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">JSON Stringify Tool</h1>
      <p className="text-white mb-6">
        Convert text and objects to properly escaped JSON string representations.
      </p>
      
      <div className="flex flex-col space-y-6">
        {/* Input/Output Row */}
        <div className="grid gap-6 grid-cols-2">
          {/* Input */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Input</CardTitle>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="inputMode" className="text-sm cursor-pointer text-white">
                    {inputIsObject ? "Treat as Object" : "Treat as Text"}
                  </Label>
                  <Switch 
                    id="inputMode" 
                    checked={inputIsObject}
                    onCheckedChange={toggleInputMode}
                  />
                </div>
              </div>
              <CardDescription className="text-white">
                Enter text or an object to stringify
              </CardDescription>
            </CardHeader>
            
            {/* Button area with increased bottom margin */}
            <div className="px-6 pt-2 pb-6">
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample('simple')}
                >
                  Simple Text
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample('complex')}
                >
                  Complex Object
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample('special')}
                >
                  Special Chars
                </Button>
              </div>
            </div>
            
            {/* Adjusted top padding for text area */}
            <CardContent className="pt-0">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={inputIsObject 
                  ? "Enter valid JSON object to stringify... (e.g., {\"name\": \"value\"})" 
                  : "Enter text to stringify..."}
                className="min-h-[220px] bg-zinc-700 text-white border-zinc-600 font-mono"
              />
              
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearInput}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Output */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">Stringified Output</CardTitle>
                <div className="opacity-0">
                  <div className="flex items-center space-x-2">
                    <Label className="text-sm cursor-pointer text-white">
                      Hidden
                    </Label>
                    <div className="h-6 w-11"></div>
                  </div>
                </div>
              </div>
              <CardDescription className="text-white">
                The result of JSON.stringify()
              </CardDescription>
            </CardHeader>
            
            {/* Matching invisible spacer for alignment with input side */}
            <div className="px-6 pt-2 pb-6">
              <div className="h-10 opacity-0 mb-4"></div>
            </div>
            
            {/* Adjusted top padding for text area */}
            <CardContent className="pt-0">
              <div className="flex w-full rounded-md border px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[220px] bg-zinc-700 text-white border-zinc-600 font-mono overflow-auto">
                {isError ? (
                  <div className="bg-red-900/30 border border-red-500/50 text-red-400 mb-2 p-2 rounded">
                    {errorMessage}
                  </div>
                ) : null}
                {output ? (
                  options.formatOutput ? (
                    <pre className="whitespace-pre-wrap text-white">{formatStringifiedOutput(output)}</pre>
                  ) : (
                    <pre className="whitespace-pre-wrap text-white">{output}</pre>
                  )
                ) : (
                  <span className="text-white opacity-70">Stringified output will appear here</span>
                )}
              </div>
              
              <div className="flex justify-end mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  disabled={!output}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                  <ClipboardCopy className="h-4 w-4 mr-2" />
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Options and Reference Row */}
        <div className="grid gap-6 grid-cols-2">
          {/* Options */}
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Stringify Options</CardTitle>
              <CardDescription className="text-white">
                Configure how JSON.stringify behaves
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-white">
              <div>
                <Label htmlFor="indentation" className="text-white">Indentation (space parameter)</Label>
                <Select 
                  value={options.space.toString()} 
                  onValueChange={(value) => setOptions({...options, space: value === "tab" ? "\t" : Number(value)})}
                >
                  <SelectTrigger id="indentation" className="w-full bg-zinc-700 border-zinc-600 text-white">
                    <SelectValue placeholder="Select indentation" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 border-zinc-600 text-white">
                    <SelectItem value="0">No indentation (minified)</SelectItem>
                    <SelectItem value="2">2 spaces</SelectItem>
                    <SelectItem value="4">4 spaces</SelectItem>
                    <SelectItem value="tab">Tab</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showFunctions"
                    checked={options.showFunctionNames}
                    onCheckedChange={(checked) => setOptions({...options, showFunctionNames: Boolean(checked)})}
                  />
                  <Label htmlFor="showFunctions" className="cursor-pointer text-white">
                    Show Function Names
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showNulls"
                    checked={options.showNulls}
                    onCheckedChange={(checked) => setOptions({...options, showNulls: Boolean(checked)})}
                  />
                  <Label htmlFor="showNulls" className="cursor-pointer text-white">
                    Include null Values
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="truncateString"
                    checked={options.useTruncateReplacer}
                    onCheckedChange={(checked) => setOptions({...options, useTruncateReplacer: Boolean(checked)})}
                  />
                  <Label htmlFor="truncateString" className="cursor-pointer text-white">
                    Truncate Long Strings
                  </Label>
                </div>
                
                {options.useTruncateReplacer && (
                  <div className="pl-6">
                    <Label htmlFor="maxLength" className="text-white">Maximum String Length</Label>
                    <Input
                      id="maxLength"
                      type="number"
                      min={10}
                      value={options.maxLength}
                      onChange={(e) => setOptions({...options, maxLength: Number(e.target.value)})}
                      className="w-full mt-1 bg-zinc-700 text-white border-zinc-600"
                    />
                  </div>
                )}
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="highlight"
                    checked={options.formatOutput}
                    onCheckedChange={(checked) => setOptions({...options, formatOutput: Boolean(checked)})}
                  />
                  <Label htmlFor="highlight" className="cursor-pointer text-white">
                    Highlight Escape Sequences
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">JSON Escape Codes Reference</CardTitle>
              <CardDescription className="text-white">
                Common escape sequences used in JSON strings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-zinc-700 border border-zinc-600 rounded-md p-3 max-h-[200px] overflow-auto">
                <table className="w-full text-sm text-white">
                  <thead>
                    <tr className="border-b border-zinc-600">
                      <th className="text-left p-1">Character</th>
                      <th className="text-left p-1">Escape Code</th>
                      <th className="text-left p-1">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escapeCodesExamples.map((example, index) => (
                      <tr key={index} className="border-b border-zinc-600/50">
                        <td className="p-1">{example.char === '\n' ? '↵' : 
                                           example.char === '\t' ? '→' : 
                                           example.char === '\r' ? '⏎' : 
                                           example.char === '\b' ? '⌫' : 
                                           example.char === '\f' ? '⊙' :
                                           example.char === '\v' ? '⋮' : example.char}</td>
                        <td className="p-1 font-mono text-white">{example.code}</td>
                        <td className="p-1">{example.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Educational Section */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4 text-white">About JSON.stringify()</h2>
        <div className="space-y-4">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">How JSON.stringify() Works</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-white">
                <code className="bg-zinc-700 px-1 rounded">JSON.stringify()</code> converts a JavaScript value to a JSON string. It handles these data types:
              </p>
              <ul className="list-disc list-inside text-white space-y-1">
                <li><strong>Strings:</strong> Wrapped in double quotes with special characters escaped</li>
                <li><strong>Numbers:</strong> Written as-is (as decimal)</li>
                <li><strong>Booleans:</strong> Written as <code className="bg-zinc-700 px-1 rounded">true</code> or <code className="bg-zinc-700 px-1 rounded">false</code></li>
                <li><strong>null:</strong> Written as <code className="bg-zinc-700 px-1 rounded">null</code></li>
                <li><strong>Arrays:</strong> Wrapped in square brackets with elements comma-separated</li>
                <li><strong>Objects:</strong> Wrapped in curly braces with key-value pairs</li>
                <li><strong>undefined, Functions, Symbols:</strong> Omitted when in an object or converted to <code className="bg-zinc-700 px-1 rounded">null</code> when in an array</li>
              </ul>
              
              <div className="bg-zinc-700 p-3 rounded-md mt-2">
                <h3 className="text-lg font-medium mb-2 text-white">Syntax:</h3>
                <pre className="text-sm font-mono text-white">JSON.stringify(value, replacer, space)</pre>
                <ul className="list-disc list-inside text-white mt-2 space-y-1">
                  <li><strong>value:</strong> The value to convert to a JSON string</li>
                  <li><strong>replacer:</strong> Optional function or array to transform the result</li>
                  <li><strong>space:</strong> Optional parameter for indentation (number or string)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle className="text-white">Common Use Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="simple">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="simple">Basic Stringify</TabsTrigger>
                  <TabsTrigger value="pretty">Pretty Printing</TabsTrigger>
                  <TabsTrigger value="custom">Custom Replacer</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simple" className="p-3 bg-zinc-700 rounded-md mt-4 text-white">
                  <h3 className="text-lg font-medium mb-2 text-white">Basic Stringification:</h3>
                  <div className="font-mono text-sm text-white">
                    <pre>{`// Simple string conversion
const str = "Hello World";
JSON.stringify(str); 
// Result: "Hello World"

// Object conversion
const user = { name: "John", age: 30 };
JSON.stringify(user);
// Result: {"name":"John","age":30}`}</pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="pretty" className="p-3 bg-zinc-700 rounded-md mt-4 text-white">
                  <h3 className="text-lg font-medium mb-2 text-white">Pretty Printing:</h3>
                  <div className="font-mono text-sm text-white">
                    <pre>{`// Using space parameter for indentation
const user = { 
  name: "John", 
  age: 30,
  address: {
    city: "New York",
    zip: "10001"
  }
};

// With 2 spaces
JSON.stringify(user, null, 2);
/* Result:
{
  "name": "John",
  "age": 30,
  "address": {
    "city": "New York",
    "zip": "10001"
  }
}
*/`}</pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="custom" className="p-3 bg-zinc-700 rounded-md mt-4 text-white">
                  <h3 className="text-lg font-medium mb-2 text-white">Custom Replacer Function:</h3>
                  <div className="font-mono text-sm text-white">
                    <pre>{`// Using a replacer function to transform values
const data = {
  name: "Secret Project",
  password: "12345",
  details: "Confidential information"
};

// Censor sensitive fields
const replacer = (key, value) => {
  if (key === "password" || key === "details") {
    return "[REDACTED]";
  }
  return value;
};

JSON.stringify(data, replacer, 2);
/* Result:
{
  "name": "Secret Project",
  "password": "[REDACTED]",
  "details": "[REDACTED]"
}
*/`}</pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JsonStringifyTextTool;
