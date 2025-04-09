import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";
import { Copy, Check } from "lucide-react"; // Import icons if needed

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Mirror Text Generator</h3>
    <p className="mb-4">
      Flip your text horizontally with our Mirror Text Generator! This tool reverses the order of your characters and replaces them with their mirrored Unicode equivalents where available (e.g., 'b' becomes 'd', 'E' becomes 'Ǝ').
    </p>
    <p className="mb-4">
      Create intriguing text effects for social media, creative designs, or just for fun. The mirrored text can be copied and pasted into platforms like Facebook, Twitter, Instagram, and more. Note that not all characters have a perfect mirrored version in Unicode.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">mirror text generator, reverse text, flip text, horizontal flip text, backward text generator, unicode mirror text, copy paste mirror text</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Mirror Text Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to mirror into the input box on the left.</li>
      <li><strong>Instant Mirroring:</strong> The text will automatically appear reversed and mirrored in the output box on the right.</li>
      <li><strong>Character Mapping:</strong> Letters like 'b'/'d', 'p'/'q', 'E'/'Ǝ', 'L'/'⅃' and symbols like '('/')', '{'/'}' are flipped using special characters. Other characters are simply reversed in order.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the generated mirror text.</li>
      <li><strong>Paste Anywhere:</strong> Use the mirrored text on social media, in messages, or for creative projects.</li>
      <li><strong>Download Option:</strong> Use the "Download" button to save the mirrored text as a .txt file.</li>
      <li><strong>Clear Input:</strong> Click "Clear" to easily start over.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: Mirrored text can be a fun way to create visual puzzles or unique decorative text elements.
    </p>
  </>
);


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
          .map(char => mirrorMap[char] || char) // Apply mirror map or keep original if no map
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
    const file = new Blob([outputText], { type: "text/plain;charset=utf-8" }); // Specify charset
    element.href = URL.createObjectURL(file);
    element.download = "mirror-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Mirror Text Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Mirror Text Generator</h1>
        <p className="text-gray-300 mb-6"> {/* Use consistent text color */}
          Create mirrored text (ɈxɘɈɿoɿɿim) that appears flipped horizontally.
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
                placeholder="ɈxɘɈ ɿoɿɿim ɿɒɘqqɒ lliw ɘɿɘH" // Mirrored placeholder
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

export default MirrorTextGenerator;
