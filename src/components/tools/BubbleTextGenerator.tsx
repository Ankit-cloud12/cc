import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const BubbleTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [filledOutputText, setFilledOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    convertToBubble(inputText);
    convertToFilledBubble(inputText);
    countStats(inputText);
  }, [inputText]);
  
  const countStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    setSentenceCount(text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length);
    setLineCount(text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).filter(Boolean).length);
  };

  const convertToBubble = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode bubble character mapping
    const bubbleMap: { [key: string]: string } = {
      a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ", i: "ⓘ", j: "ⓙ",
      k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ", q: "ⓠ", r: "ⓡ", s: "ⓢ", t: "ⓣ",
      u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ", y: "ⓨ", z: "ⓩ", A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", D: "Ⓓ",
      E: "Ⓔ", F: "Ⓕ", G: "Ⓖ", H: "Ⓗ", I: "Ⓘ", J: "Ⓙ", K: "Ⓚ", L: "Ⓛ", M: "Ⓜ", N: "Ⓝ",
      O: "Ⓞ", P: "Ⓟ", Q: "Ⓠ", R: "Ⓡ", S: "Ⓢ", T: "Ⓣ", U: "Ⓤ", V: "Ⓥ", W: "Ⓦ", X: "Ⓧ",
      Y: "Ⓨ", Z: "Ⓩ", "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤",
      "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨", "!": "❗", "?": "❓", ".": "⨀",
    };

    const result = text
      .split("")
      .map((char) => bubbleMap[char] || char)
      .join("");
    setOutputText(result);
  };

  const convertToFilledBubble = (text: string) => {
    if (!text) {
      setFilledOutputText("");
      return;
    }

    // Unicode filled bubble character mapping
    const filledBubbleMap: { [key: string]: string } = {
      a: "🅐", b: "🅑", c: "🅒", d: "🅓", e: "🅔", f: "🅕", g: "🅖", h: "🅗", i: "🅘", j: "🅙",
      k: "🅚", l: "🅛", m: "🅜", n: "🅝", o: "🅞", p: "🅟", q: "🅠", r: "🅡", s: "🅢", t: "🅣",
      u: "🅤", v: "🅥", w: "🅦", x: "🅧", y: "🅨", z: "🅩", A: "🅐", B: "🅑", C: "🅒", D: "🅓",
      E: "🅔", F: "🅕", G: "🅖", H: "🅗", I: "🅘", J: "🅙", K: "🅚", L: "🅛", M: "🅜", N: "🅝",
      O: "🅞", P: "🅟", Q: "🅠", R: "🅡", S: "🅢", T: "🅣", U: "🅤", V: "🅥", W: "🅦", X: "🅧",
      Y: "🅨", Z: "🅩", "0": "⓿", "1": "➊", "2": "➋", "3": "➌", "4": "➍", "5": "➎",
      "6": "➏", "7": "➐", "8": "➑", "9": "➒", " ": " ", "!": "❗", "?": "❓", ".": "⊙",
    };

    const result = text
      .split("")
      .map((char) => filledBubbleMap[char] || char)
      .join("");
    setFilledOutputText(result);
  };

  const handleCopy = () => {
    const combinedText = outputText && filledOutputText 
      ? `${outputText}\n\n${filledOutputText}` 
      : outputText || filledOutputText;
    
    navigator.clipboard.writeText(combinedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setFilledOutputText("");
    setCharCount(0);
    setWordCount(0);
    setSentenceCount(0);
    setLineCount(0);
  };
  
  const handleDownload = () => {
    const combinedText = outputText && filledOutputText 
      ? `${outputText}\n\n${filledOutputText}` 
      : outputText || filledOutputText;
      
    const element = document.createElement("a");
    const file = new Blob([combinedText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "bubble-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Bubble Text Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Bubble Text Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Convert your text into bubble letter Unicode characters and filled bubble characters that you can use on
          social media, messages, and more.
        </p>

        {/* Input and Output Textboxes */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col">
            <Textarea
              readOnly
              placeholder="Bubble text will appear here"
              value={outputText && filledOutputText ? `${outputText}\n\n${filledOutputText}` : outputText || filledOutputText}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-2"
            />
            
            {/* Actions Row - Moved below output box and aligned right */}
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              <Button 
                variant="outline" 
                onClick={handleCopy} 
                disabled={!outputText && !filledOutputText}
                className="border-zinc-600"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownload} 
                disabled={!outputText && !filledOutputText}
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
            <h3 className="font-medium mb-2">About Bubble Text Generator</h3>
            <p className="mb-4">
              This generator creates two types of special bubble text:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>
                <span className="font-medium">Regular Bubble Text:</span> Circled Unicode characters (ⓐ, Ⓑ, etc.) that 
                create a distinctive outlined appearance.
              </li>
              <li>
                <span className="font-medium">Filled Bubble Text:</span> Square-enclosed characters (🅐, 🅑, etc.) that 
                give a bolder, filled appearance to your text.
              </li>
            </ul>
            <p className="mb-4">
              These bubble characters aren't actual font styles but special Unicode symbols. This means they can be used in places
              where formatting isn't normally allowed, like social media profiles, messages, and usernames.
            </p>
            <p className="mb-4">
              The bubble text generated is compatible with most platforms including Facebook, Twitter, Instagram, TikTok, Discord, and more.
            </p>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Type or paste your text in the input box on the left</li>
              <li>Both bubble text versions will automatically appear on the right</li>
              <li>Regular bubble text appears first, followed by filled bubble text</li>
              <li>"Copy to Clipboard" will copy both text styles</li>
              <li>Use these special characters to make your content stand out on social media</li>
              <li>For longer text, use the "Download" button to save as a text file</li>
            </ul>
            
            <p className="text-sm text-gray-400">
              Note: Some platforms may have limitations on where Unicode characters can be used.
              For example, some websites might not allow these characters in usernames or certain fields.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default BubbleTextGenerator;
