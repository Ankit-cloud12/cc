import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";
import { Copy, Check } from "lucide-react"; // Import icons if needed for copy buttons

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Italic Text Generator</h3>
    <p className="mb-4">
      Generate 𝘪𝘵𝘢𝘭𝘪𝘤𝘪𝘻𝘦𝘥 text instantly with our free online Italic Text Generator. This tool converts your standard text into an italic style using special Unicode characters.
    </p>
    <p className="mb-4">
      Unlike standard italic formatting (like in word processors), this Unicode italic text can be copied and pasted into places that don't typically support text styling, such as social media bios (Instagram, Twitter, Facebook), comments, usernames, and chat messages.
    </p>
     <p className="mb-4">
      Add emphasis or a touch of elegance to your online text effortlessly.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">italic text generator, unicode italic, copy paste italic text, italic font generator, social media fonts, fancy text generator, italicize text online</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Italic Text Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to italicize into the input box on the left.</li>
      <li><strong>Instant Conversion:</strong> The text will automatically appear in an italic Unicode style in the output box on the right.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the generated italic text.</li>
      <li><strong>Paste Anywhere:</strong> Use the copied text on Instagram, Facebook, Twitter, Discord, or any platform that supports Unicode characters.</li>
      <li><strong>Download Option:</strong> For longer text, use the "Download" button to save the italicized text as a .txt file.</li>
      <li><strong>Clear Input:</strong> Click "Clear" to easily remove text from both boxes and start over.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Note: This tool uses mathematical alphanumeric symbols from Unicode to simulate italics. While widely compatible, the exact appearance might vary slightly across different devices and platforms.
    </p>
  </>
);


const ItalicTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    convertToItalic(inputText);
    
    // Update statistics
    setCharCount(inputText.length);
    setWordCount(inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length);
    setLineCount(inputText.trim() === "" ? 0 : inputText.split(/\r\n|\r|\n/).filter(Boolean).length);
  }, [inputText]);

  const convertToItalic = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode italic character mapping
    const italicMap: { [key: string]: string } = {
      a: "𝘢", b: "𝘣", c: "𝘤", d: "𝘥", e: "𝘦", f: "𝘧", g: "𝘨", h: "𝘩", i: "𝘪", j: "𝘫",
      k: "𝘬", l: "𝘭", m: "𝘮", n: "𝘯", o: "𝘰", p: "𝘱", q: "𝘲", r: "𝘳", s: "𝘴", t: "𝘵",
      u: "𝘶", v: "𝘷", w: "𝘸", x: "𝘹", y: "𝘺", z: "𝘻",
      A: "𝘈", B: "𝘉", C: "𝘊", D: "𝘋", E: "𝘌", F: "𝘍", G: "𝘎", H: "𝘏", I: "𝘐", J: "𝘑",
      K: "𝘒", L: "𝘓", M: "𝘔", N: "𝘕", O: "𝘖", P: "𝘗", Q: "𝘘", R: "𝘙", S: "𝘚", T: "𝘛",
      U: "𝘜", V: "𝘝", W: "𝘞", X: "𝘟", Y: "𝘠", Z: "𝘡",
    };

    const result = text
      .split("")
      .map((char) => italicMap[char] || char)
      .join("");

    setOutputText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText(""); // Also clear output text
  };

  // Generate a download for the output text
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain;charset=utf-8" }); // Specify charset
    element.href = URL.createObjectURL(file);
    element.download = "italic-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Italic Text Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Italic Text Generator</h1>
        <p className="text-gray-300 mb-6"> {/* Use consistent text color */}
          Convert your text into 𝘪𝘵𝘢𝘭𝘪𝘤 Unicode characters for social media, messages, and more.
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full flex flex-col">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize-none mb-4" 
            />
            {/* Stats Card Below Input */}
            <Card className="p-4 mt-auto bg-zinc-800 border-zinc-700">
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
          </div>

          {/* Output Section (Right Column) */}
          <div className="w-full flex flex-col">
            <Textarea
              readOnly
              placeholder="𝘐𝘵𝘢𝘭𝘪𝘤 𝘵𝘦𝘹𝘵 𝘸𝘪𝘭𝘭 𝘢𝘱𝘱𝘦𝘢𝘳 𝘩𝘦𝘳𝘦" 
              value={outputText}
              className="w-full h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize-none mb-4" 
            />
            {/* Action Buttons Below Output Area */}
            <div className="flex flex-wrap gap-2 justify-end mt-auto"> 
              {/* Consistent Button Styles */}
              <Button
                variant="outline"
                onClick={handleCopy}
                disabled={!outputText}
                className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                disabled={!outputText}
                className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              >
                Download
              </Button>
              <Button
                variant="outline"
                onClick={handleClear}
                className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Standard About/Usage Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6"> {/* Add margin-top */}
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {aboutContent}
          </TabsContent>
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {usageTipsContent}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default ItalicTextGenerator;
