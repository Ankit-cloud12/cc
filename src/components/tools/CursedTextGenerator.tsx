import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CursedTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState<string[]>([]);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    updateCounts(inputText);
  }, [inputText]);

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setSentenceCount(
      text ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0
    );
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const generateCursedText = (text: string) => {
    const cursedStyles = [];

    let cursedText = "";
    for (let i = 0; i < text.length; i++) {
      cursedText += `t̵̹̙͎̄̔̅͛̊̅̓̕e̷̢̡̯̟͍̣̤̼̍͘͜͠ͅs̵̼̘͕͎̠̞̍͛̔̈͠${text[i]}̨`;
    }
    cursedStyles.push(cursedText);

    let cursedText2 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText2 += `𝔱${text[i]}`;
    }
    cursedStyles.push(cursedText2);

    let cursedText3 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText3 += `𝖙${text[i]}`;
    }
    cursedStyles.push(cursedText3);

    let cursedText4 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText4 += `🆃${text[i]}`;
    }
    cursedStyles.push(cursedText4);

    let cursedText5 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText5 += `卞${text[i]}`;
    }
    cursedStyles.push(cursedText5);

    let cursedText6 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText6 += `Շ${text[i]}`;
    }
    cursedStyles.push(cursedText6);

    let cursedText7 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText7 += `ƚ${text[i]}`;
    }
    cursedStyles.push(cursedText7);

    let cursedText8 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText8 += `ȶ${text[i]}`;
    }
    cursedStyles.push(cursedText8);

    let cursedText9 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText9 += `₮${text[i]}`;
    }
    cursedStyles.push(cursedText9);

    let cursedText10 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText10 += `t${text[i]}`;
    }
    cursedStyles.push(cursedText10);

    let cursedText11 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText11 += `𝓉${text[i]}`;
    }
    cursedStyles.push(cursedText11);

    let cursedText12 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText12 += `꓄${text[i]}`;
    }
    cursedStyles.push(cursedText12);

    let cursedText13 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText13 += `ꋖ${text[i]}`;
    }
    cursedStyles.push(cursedText13);

    let cursedText14 = "";
    for (let i = 0; i < text.length; i++) {
      cursedText14 += `T${text[i]}`;
    }
    cursedStyles.push(cursedText14);

    return cursedStyles;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    setOutputText(generateCursedText(text));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    if (!outputText) return;

    const element = document.createElement("a");
    const file = new Blob([outputText.join('\\n')], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cursed-text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full bg-zinc-800 text-white min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Cursed Text Generator</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder="Type or paste your content here"
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
              value={inputText}
              onChange={handleInputChange}
            />
            <div className="text-sm text-gray-400 mb-4">
              Character Count: {charCount} | Word Count: {wordCount} | Sentence Count:{" "}
              {sentenceCount} | Line Count: {lineCount}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <div className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded flex flex-col">
              {outputText.map((style, index) => (
                <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                  <div className="text-sm">{style}</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                          onClick={() => navigator.clipboard.writeText(style)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-copy"
                          >
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v2" />
                          </svg>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={handleCopy}
                disabled={outputText.length === 0}
              >
                {copied ? "Copied!" : "Copy All"}
              </Button>
              <Button
                variant="outline"
                className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={handleDownloadText}
                disabled={outputText.length === 0}
              >
                Download Text
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CursedTextGenerator;
