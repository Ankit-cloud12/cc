import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
}

const TextCaseTools = ({
  initialText = "",
  initialCase = "sentence",
  showTitle = true,
  showDescription = true,
  title = "Accidentally left the caps lock on and typed something, but can't be bothered to start again and retype it all?",
  description = "Simply enter your text and choose the case you want to convert it to.",
  onTextTransform,
}: TextCaseToolsProps) => {
  const [inputText, setInputText] = useState(initialText);
  const [outputText, setOutputText] = useState("");
  const [activeCase, setActiveCase] = useState<CaseType>(initialCase);
  const [copied, setCopied] = useState(false);
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

  const handleDownloadText = () => {
    if (!outputText) return;

    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `converted-text-${activeCase}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full">
      {showTitle && <h1 className="text-3xl font-bold mb-2">{title}</h1>}
      {showDescription && <p className="text-gray-300 mb-6">{description}</p>}

      <Textarea
        placeholder="Type or paste your content here"
        className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
        value={inputText}
        onChange={handleInputChange}
      />

      {/* Only show case conversion buttons if no custom transform is provided */}
      {!onTextTransform && (
        <div className="flex flex-col space-y-4">
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
        </div>
      )}

      {/* Output text area */}
      <Textarea
        readOnly
        className="w-full min-h-[150px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
        value={outputText}
        placeholder="Converted text will appear here"
      />

      {/* Action buttons */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Button
            variant="outline"
            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-12 sm:h-11"
            onClick={handleDownloadText}
            disabled={!outputText}
          >
            Download Text
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-12 sm:h-11"
            onClick={handleCopy}
            disabled={!outputText}
          >
            {copied ? "Copied!" : "Copy to Clipboard"}
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 h-12 sm:h-11"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
        
        {/* Buy me a Coffee button only on the homepage */}
        <div className="flex justify-center">
          <a 
            href="https://www.buymeacoffee.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button
              variant="outline"
              className="bg-[#FFDD00] hover:bg-[#FFCC00] text-black border-[#FFDD00] px-6"
            >
              Buy me a Coffee
            </Button>
          </a>
        </div>
      </div>

      {/* Text statistics */}
      <div className="text-sm text-gray-400 mb-4">
        Character Count: {charCount} | Word Count: {wordCount} | Sentence Count:
        {sentenceCount} | Line Count: {lineCount}
      </div>
    </div>
  );
};

export default TextCaseTools;
