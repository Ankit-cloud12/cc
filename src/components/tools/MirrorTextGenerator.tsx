import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const MirrorTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    createMirrorText(inputText);
    
    // Update statistics
    setCharCount(inputText.length);
    setWordCount(inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length);
    setLineCount(inputText.trim() === "" ? 0 : inputText.split(/\r\n|\r|\n/).filter(Boolean).length);
  }, [inputText]);

  const createMirrorText = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Character mapping for specific reversed characters
    const mirrorMap: { [key: string]: string } = {
      a: "ɒ", b: "d", c: "ɔ", d: "b", e: "ɘ", f: "ꟻ", g: "ᵷ", h: "ʜ", j: "ꞁ",
      k: "ʞ", l: "l", m: "m", n: "ᴎ", p: "q", q: "p", r: "ɿ", s: "ꙅ", t: "ƚ",
      y: "ʏ", z: "ꙅ", A: "A", B: "ꓭ", C: "Ɔ", D: "ꓷ", E: "Ǝ", F: "ꓞ", G: "ꓜ",
      J: "Ꞁ", K: "ꓘ", L: "⅃", M: "M", N: "И", P: "ꓑ", Q: "Ꝺ", R: "Я", S: "Ꙅ",
      T: "T", U: "U", V: "V", W: "W", Y: "Y", Z: "Z", "1": "1", "2": "S",
      "3": "Ɛ", "4": "ᔭ", "5": "ꙅ", "6": "ꓯ", "7": "V", "8": "8", "9": "ꓷ",
      "0": "0", "&": "⅋", "?": "⸮", "!": "¡", "(": ")", ")": "(", "[": "]",
      "]": "[", "{": "}", "}": "{", "<": ">", ">": "<", ".": "˙", ",": "՝",
      "/": "\\", "\\": "/",
    };

    // Split the text into lines, reverse each line, then join them back
    const mirroredText = text
      .split("\n")
      .map(line => 
        line
          .split("")
          .reverse()
          .map(char => mirrorMap[char] || char)
          .join("")
      )
      .join("\n");
    
    setOutputText(mirroredText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  // Generate a download for the output text
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "mirror-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Mirror Text Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Mirror Text Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Create mirrored text that appears as if viewed in a mirror.
          Perfect for creative designs and fun messages.
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
              placeholder="Mirrored text will appear here"
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
            <h3 className="font-medium mb-2">About Mirror Text Generator</h3>
            <p className="mb-4">
              This mirror text generator reverses the order of characters and replaces them with mirrored versions when possible. 
              It creates a text effect that looks like it's being viewed in a mirror.
            </p>
            <p className="mb-4">
              Mirror text can be used for creative social media posts, artistic designs, optical illusions, 
              and fun messages to friends. Some characters have special mirrored versions while others simply appear reversed.
            </p>
            <p className="mb-4">
              The generated mirror text works on most platforms including Facebook, Twitter, Instagram, TikTok, and messaging apps. 
              Note that some special characters may not display correctly on all devices.
            </p>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Type or paste your text in the input box on the left</li>
              <li>The mirrored version will automatically appear on the right</li>
              <li>Each character is flipped horizontally and the order is reversed</li>
              <li>Special characters like brackets, parentheses, and arrows are properly flipped</li>
              <li>Use the "Copy to Clipboard" button to copy the mirrored text</li>
              <li>You can then paste it anywhere - social media, messaging apps, documents, etc.</li>
              <li>For longer text, use the "Download" button to save as a text file</li>
            </ul>
            
            <p className="text-sm text-gray-400">
              Note: While this generator attempts to use proper mirrored characters, some characters don't have perfect mirrored equivalents. 
              For best results, use Latin characters and common symbols.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default MirrorTextGenerator;
