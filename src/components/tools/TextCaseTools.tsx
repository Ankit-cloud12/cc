import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";
import { cn } from "@/lib/utils";

type CaseType =
  | "sentence"
  | "lower"
  | "upper"
  | "capitalized"
  | "alternating"
  | "inverse"
  | "title";

interface TextCaseToolsProps {
  initialText?: string;
  initialCase?: CaseType;
  showTitle?: boolean;
  showDescription?: boolean;
  title?: string;
  description?: string;
  onTextTransform?: (text: string) => string;
  aboutContent?: React.ReactNode; // Added prop for custom About content
  usageTipsContent?: React.ReactNode; // Added prop for custom Usage Tips content
}

const TextCaseTools = ({
  initialText = "",
  initialCase = "sentence",
  showTitle = true,
  showDescription = true,
  title = "Accidentally left the caps lock on and typed something, but can't be bothered to start again and retype it all?",
  description = "Simply enter your text and choose the case you want to convert it to.",
  onTextTransform,
  aboutContent, // Destructure new prop
  usageTipsContent, // Destructure new prop
}: TextCaseToolsProps) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>(initialCase);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("options");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (inputText) {
      if (onTextTransform) {
        setOutputText(onTextTransform(inputText));
      } else {
        convertCase(inputText, activeCase);
      }
      updateCounts(inputText);
    }
  }, [inputText, activeCase, onTextTransform]);

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setSentenceCount(
      text ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0,
    );
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const convertCase = (text: string, caseType: CaseType) => {
    if (!text) {
      setOutputText("");
      return;
    }

    let result = "";

    switch (caseType) {
      case "sentence":
        result = text
          .toLowerCase()
          .replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
        break;
      case "lower":
        result = text.toLowerCase();
        break;
      case "upper":
        result = text.toUpperCase();
        break;
      case "capitalized":
      case "title":
        result = text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
        break;
      case "alternating":
        result = text
          .split("")
          .map((char, i) =>
            i % 2 === 0 ? char.toLowerCase() : char.toUpperCase(),
          )
          .join("");
        break;
      case "inverse":
        result = text
          .split("")
          .map((char) => {
            if (
              char === char.toUpperCase() &&
              char.toLowerCase() !== char.toUpperCase()
            ) {
              return char.toLowerCase();
            }
            return char.toUpperCase();
          })
          .join("");
        break;
      default:
        result = text;
    }

    setOutputText(result);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    convertCase(newText, activeCase);
  };

  const handleCaseChange = (caseType: CaseType) => {
    setActiveCase(caseType);
    convertCase(inputText, caseType);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setCharCount(0);
    setWordCount(0);
    setSentenceCount(0);
    setLineCount(0);
  };

  const handleDownload = () => {
    if (!outputText) return;

    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `converted-text-${activeCase}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const getCaseDescription = () => {
    switch (activeCase) {
      case "sentence":
        return "Sentence case capitalizes the first letter of each sentence.";
      case "lower":
        return "Lowercase converts all letters to lowercase.";
      case "upper":
        return "UPPERCASE converts all letters to capital letters.";
      case "capitalized":
      case "title":
        return "Title Case capitalizes the first letter of each word.";
      case "alternating":
        return "aLtErNaTiNg CaSe alternates between lowercase and uppercase letters.";
      case "inverse":
        return "InVeRsE cAsE reverses the case of each letter in the text.";
      default:
        return "";
    }
  };

  return (
    <ToolLayout title={title} hideHeader={true}>
      <div className="container mx-auto p-4">
        {showTitle && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
        {showDescription && <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>}

        {/* Input and Output Textboxes */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={handleInputChange}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col">
            <Textarea
              readOnly
              placeholder="Converted text will appear here"
              value={outputText}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-2"
            />
            
            {/* Actions Row - Moved below output box and aligned right */}
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              <Button 
                variant="outline" 
                onClick={handleCopy} 
                disabled={!outputText}
                className="border-zinc-600"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
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
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        {/* Only show case conversion buttons if no custom transform is provided */}
        {!onTextTransform && (
          <Card className="p-4 mb-4 bg-zinc-800 border-zinc-700">
            <h3 className="font-medium mb-2">Text Case Options</h3>
            <p className="text-sm text-gray-400 mb-3">{getCaseDescription()}</p>
            
            {/* For very small screens, show a scrollable horizontal view */}
            <div className="md:hidden overflow-x-auto pb-2 -mx-2 px-2">
              <div className="flex space-x-2 min-w-min">
                <Button
                  variant="outline"
                  className={cn(
                    "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 min-w-[130px] h-12",
                    activeCase === "sentence" && "bg-zinc-600",
                  )}
                  onClick={() => handleCaseChange("sentence")}
                >
                  Sentence case
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 min-w-[130px] h-12",
                    activeCase === "lower" && "bg-zinc-600",
                  )}
                  onClick={() => handleCaseChange("lower")}
                >
                  lower case
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 min-w-[130px] h-12",
                    activeCase === "upper" && "bg-zinc-600",
                  )}
                  onClick={() => handleCaseChange("upper")}
                >
                  UPPER CASE
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 min-w-[130px] h-12",
                    activeCase === "capitalized" && "bg-zinc-600",
                  )}
                  onClick={() => handleCaseChange("capitalized")}
                >
                  Capitalized Case
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 min-w-[130px] h-12",
                    activeCase === "alternating" && "bg-zinc-600",
                  )}
                  onClick={() => handleCaseChange("alternating")}
                >
                  aLtErNaTiNg cAsE
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 min-w-[130px] h-12",
                    activeCase === "inverse" && "bg-zinc-600",
                  )}
                  onClick={() => handleCaseChange("inverse")}
                >
                  InVeRsE cAsE
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 min-w-[130px] h-12",
                    activeCase === "title" && "bg-zinc-600",
                  )}
                  onClick={() => handleCaseChange("title")}
                >
                  Title Case
                </Button>
              </div>
            </div>
            
            {/* For tablet and desktop, show grid layout */}
            <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2">
              <Button
                variant="outline"
                className={cn(
                  "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-11",
                  activeCase === "sentence" && "bg-zinc-600",
                )}
                onClick={() => handleCaseChange("sentence")}
              >
                Sentence case
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-11",
                  activeCase === "lower" && "bg-zinc-600",
                )}
                onClick={() => handleCaseChange("lower")}
              >
                lower case
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-11",
                  activeCase === "upper" && "bg-zinc-600",
                )}
                onClick={() => handleCaseChange("upper")}
              >
                UPPER CASE
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-11",
                  activeCase === "capitalized" && "bg-zinc-600",
                )}
                onClick={() => handleCaseChange("capitalized")}
              >
                Capitalized Case
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-11",
                  activeCase === "alternating" && "bg-zinc-600",
                )}
                onClick={() => handleCaseChange("alternating")}
              >
                aLtErNaTiNg cAsE
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-11",
                  activeCase === "inverse" && "bg-zinc-600",
                )}
                onClick={() => handleCaseChange("inverse")}
              >
                InVeRsE cAsE
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-11",
                  activeCase === "title" && "bg-zinc-600",
                )}
                onClick={() => handleCaseChange("title")}
              >
                Title Case
              </Button>
            </div>
          </Card>
        )}
        
        {/* Stats Card */}
        <Card className="p-4 mb-4 bg-zinc-800 border-zinc-700">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Character Count</span>
              <span className="text-xl font-semibold">{charCount}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Word Count</span>
              <span className="text-xl font-semibold">{wordCount}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Sentence Count</span>
              <span className="text-xl font-semibold">{sentenceCount}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Line Count</span>
              <span className="text-xl font-semibold">{lineCount}</span>
            </div>
          </div>
        </Card>
        
        {/* Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="options" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          
          {/* Use custom aboutContent if provided, otherwise use default */}
          <TabsContent value="options" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {aboutContent ? (
              aboutContent
            ) : (
              <>
                <h3 className="font-medium mb-2">About Text Case Converter</h3>
                <p className="mb-4">
                  This tool allows you to convert your text between different case formats. It's perfect for:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Fixing text where CAPS LOCK was accidentally left on</li>
                  <li>Creating headlines and titles with proper capitalization</li>
                  <li>Preparing text for different stylistic requirements</li>
                  <li>Converting between formal and creative text styles</li>
                </ul>
                <p className="mb-4">
                  Choose from 7 different text case options to instantly transform your text without retyping.
                </p>
              </>
            )}
          </TabsContent>
          
          {/* Use custom usageTipsContent if provided, otherwise use default */}
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {usageTipsContent ? (
              usageTipsContent
            ) : (
              <>
                <h3 className="font-medium mb-2">Usage Tips</h3>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Type or paste your text in the input box on the left</li>
                  <li>Select your desired case format from the buttons</li>
                  <li>The converted text will appear in the output box on the right</li>
                  <li>Use "Sentence case" for normal paragraph text</li>
                  <li>Use "Title Case" for headlines and titles</li>
                  <li>Use "UPPERCASE" for emphasis or headers</li>
                  <li>Use "aLtErNaTiNg" or "InVeRsE" case for creative styling</li>
                  <li>Copy the result to clipboard or download as a text file</li>
                </ul>
                
                <p className="text-sm text-gray-400">
                  Pro Tip: You can quickly switch between different case styles to see which one works best for your text.
                </p>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default TextCaseTools;
