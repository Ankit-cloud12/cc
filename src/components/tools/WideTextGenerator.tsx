import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card"; // Import Card
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import { ToolLayout } from "./ToolLayout"; // Import ToolLayout
import { Copy, Check } from "lucide-react"; // Import icons if needed

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Wide Text Generator (Vaporwave Text)</h3>
    <p className="mb-4">
      Create ａｅｓｔｈｅｔｉｃ wide text, also known as vaporwave or full-width text, with our free online generator. This tool converts standard characters into their wider Unicode equivalents, adding extra spacing between letters.
    </p>
    <p className="mb-4">
      Perfect for vaporwave art, social media bios (Instagram, Twitter), usernames, and anywhere you want to achieve that distinct wide-spaced look. The generated text uses full-width Unicode characters, making it easy to copy and paste across most platforms.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">wide text generator, vaporwave text generator, full width text, aesthetic text, spaced out text, unicode wide text, copy paste wide text</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Wide Text Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to make wide into the input box on the left.</li>
      <li><strong>Instant Conversion:</strong> The text will automatically appear in its wide (full-width) form in the output box on the right.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the generated wide text.</li>
      <li><strong>Paste Anywhere:</strong> Use the wide text on social media, in designs, or anywhere you want the vaporwave aesthetic.</li>
      <li><strong>Download Option:</strong> Use the "Download" button to save the wide text as a .txt file.</li>
      <li><strong>Clear Input:</strong> Click "Clear" to easily start over.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Note: This style uses specific full-width Unicode characters. Ensure the platform you're pasting into supports these characters for proper display.
    </p>
  </>
);


const WideTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about"); // For About/Usage tabs
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  // Unicode full-width character mapping
  const wideMap: { [key: string]: string } = {
    a: "ａ", b: "ｂ", c: "ｃ", d: "ｄ", e: "ｅ", f: "ｆ", g: "ｇ", h: "ｈ", i: "ｉ", j: "ｊ", 
    k: "ｋ", l: "ｌ", m: "ｍ", n: "ｎ", o: "ｏ", p: "ｐ", q: "ｑ", r: "ｒ", s: "ｓ", t: "ｔ", 
    u: "ｕ", v: "ｖ", w: "ｗ", x: "ｘ", y: "ｙ", z: "ｚ",
    A: "Ａ", B: "Ｂ", C: "Ｃ", D: "Ｄ", E: "Ｅ", F: "Ｆ", G: "Ｇ", H: "Ｈ", I: "Ｉ", J: "Ｊ", 
    K: "Ｋ", L: "Ｌ", M: "Ｍ", N: "Ｎ", O: "Ｏ", P: "Ｐ", Q: "Ｑ", R: "Ｒ", S: "Ｓ", T: "Ｔ", 
    U: "Ｕ", V: "Ｖ", W: "Ｗ", X: "Ｘ", Y: "Ｙ", Z: "Ｚ",
    "0": "０", "1": "１", "2": "２", "3": "３", "4": "４", "5": "５", "6": "６", "7": "７", "8": "８", "9": "９",
    " ": "　", "!": "！", '"': "＂", "#": "＃", $: "＄", "%": "％", "&": "＆", "'": "＇", "(": "（", ")": "）", 
    "*": "＊", "+": "＋", ",": "，", "-": "－", ".": "．", "/": "／", ":": "：", ";": "；", "<": "＜", "=": "＝", 
    ">": "＞", "?": "？", "@": "＠", "[": "［", "\\": "＼", "]": "］", "^": "＾", _: "＿", "`": "｀", 
    "{": "｛", "|": "｜", "}": "｝", "~": "～",
  };

  useEffect(() => {
    convertToWide(inputText);
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const convertToWide = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }
    // Use spread operator for multi-byte character safety
    const result = [...text].map((char) => wideMap[char] || char).join("");
    setOutputText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    // Stats cleared via useEffect
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain;charset=utf-8" }); // Specify charset
    element.href = URL.createObjectURL(file);
    element.download = "wide-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Wide Text Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Wide Text Generator (Vaporwave)</h1>
        <p className="text-gray-300 mb-6"> {/* Use consistent text color */}
          Convert text into ａｅｓｔｈｅｔｉｃ wide text (full-width).
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize" // Standard styling
            />
            {/* Stats Card Below Input */}
            <Card className="p-4 mt-4 bg-zinc-800 border-zinc-700">
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
          <div className="w-full">
            <div className="h-full flex flex-col"> {/* Ensure full height */}
              <Textarea
                readOnly
                placeholder="Ｗｉｄｅ　ｔｅｘｔ　ｗｉｌｌ　ａｐｐｅａｒ　ｈｅｒｅ" // Wide placeholder
                value={outputText}
                className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-4 flex-grow" // Standard styling, mb-4, flex-grow
              />
              {/* Action Buttons Below Output Area */}
              <div className="flex flex-wrap gap-2 justify-end mt-auto"> {/* Use mt-auto */}
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

export default WideTextGenerator;
