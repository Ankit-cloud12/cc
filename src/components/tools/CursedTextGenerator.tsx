import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ToolLayout } from "./ToolLayout";
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
  const [activeTab, setActiveTab] = useState("about");

  useEffect(() => {
    if (inputText) {
      setOutputText(generateCursedText(inputText));
      updateCounts(inputText);
    } else {
      setOutputText([]);
      updateCounts("");
    }
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
      cursedText += `t̵̹̙͎̄̔̅͛̊̅̓̕e̷̢̡̯̟͍̣̤̼̍͘͜͠ͅs̵̼̘͕͎̠̞̍͛̔̈͠${text[i]}̨`;
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
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText([]);
    setCharCount(0);
    setWordCount(0);
    setSentenceCount(0);
    setLineCount(0);
  };

  const handleDownload = () => {
    if (outputText.length === 0) return;

    const element = document.createElement("a");
    const file = new Blob([outputText.join('\n')], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `cursed-text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Cursed Text Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Cursed Text Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Create disturbing and glitched text effects for social media, messages, and creative content.
        </p>

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
            <div className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded flex flex-col mb-2 overflow-y-auto">
              {outputText.length > 0 ? (
                outputText.map((style, index) => (
                  <div key={index} className="flex items-center justify-between mb-2 last:mb-0">
                    <div className="text-sm break-all pr-2">{style}</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 flex-shrink-0"
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
                          <p>Copy this style</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 flex items-center justify-center h-full">
                  Cursed text variations will appear here
                </div>
              )}
            </div>
            
            {/* Actions Row - Moved below output box and aligned right */}
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              <Button 
                variant="outline" 
                onClick={handleCopy} 
                disabled={outputText.length === 0}
                className="border-zinc-600"
              >
                {copied ? "Copied!" : "Copy All Styles"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownload} 
                disabled={outputText.length === 0}
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
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Cursed Text Generator</h3>
            <p className="mb-4">
              This tool creates disturbing, glitched, and otherworldly text effects using a combination of 
              Unicode combining characters and special symbols. The result is text that appears corrupted, 
              distorted, or "cursed."
            </p>
            <p className="mb-4">
              Cursed text has become popular in internet culture for creating creepy messages, horror-themed 
              content, and attention-grabbing posts on social media. Each style uses different Unicode 
              character combinations to create a unique corrupted appearance.
            </p>
            <p className="mb-4">
              The generated styles work on most platforms that support Unicode, including Discord, Twitter, 
              Instagram, and many messaging apps.
            </p>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Type or paste your text in the input box on the left</li>
              <li>Multiple cursed text variations will appear on the right</li>
              <li>Use the small copy button next to each style to copy just that variation</li>
              <li>Use "Copy All Styles" to copy all variations at once</li>
              <li>For longer text or multiple styles, use the "Download" button</li>
              <li>Cursed text is perfect for Halloween content, horror themes, and creepy messages</li>
              <li>Try different text lengths to see how each style distorts the content</li>
            </ul>
            
            <p className="text-sm text-gray-400">
              Note: Some platforms may limit how these characters display, and excessive use of combining 
              characters may cause display issues on some devices. The most complex styles may not render 
              properly everywhere.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default CursedTextGenerator;
