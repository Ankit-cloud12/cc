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
    <h3 className="font-medium mb-2">About Subscript Generator</h3>
    <p className="mb-4">
      {/* Plain text example */}
      Easily convert numbers and specific letters into their subscript Unicode equivalents with our free online Subscript Generator. Subscript characters appear smaller and are positioned below the normal text baseline.
    </p>
    <p className="mb-4">
      This tool is particularly useful for writing chemical formulas (like H₂O), mathematical variables with indices (x₁, x₂), and other scientific or technical notations. Since it uses Unicode characters, the generated subscript text can be copied and pasted into most platforms that support Unicode, including social media, documents, and websites.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">subscript generator, text to subscript, unicode subscript, copy paste subscript, chemical formula writer, math symbols, small text below line</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Subscript Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text containing characters you want to convert to subscript into the input box on the left.</li>
      <li><strong>Instant Conversion:</strong> The text will automatically appear with available characters converted to subscript in the output box on the right.</li>
      <li><strong>Supported Characters:</strong> Only numbers (0-9), some symbols (+, -, =, (, )), and specific lowercase letters (a, e, h, i, j, k, l, m, n, o, p, r, s, t, u, v, x) have standard Unicode subscript versions. Other characters will remain unchanged. See the 'Available Characters' tab for details.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the text with subscript characters.</li>
      {/* Plain text example */}
      <li><strong>Paste Anywhere:</strong> Use the subscript text in chemical formulas (H2O), math notations (x1), footnotes, or anywhere needed.</li>
      <li><strong>Download Option:</strong> Use the "Download" button to save the generated text as a .txt file.</li>
      <li><strong>Clear Input:</strong> Click "Clear" to easily start over.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Note: The exact appearance and alignment of subscript characters can vary depending on the font, device, and platform.
    </p>
  </>
);


const SubscriptGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0); // Keep for consistency
  const [lineCount, setLineCount] = useState(0);

  // Unicode subscript character mapping
  const subscriptMap: { [key: string]: string } = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
    a: "ₐ", e: "ₑ", h: "ₕ", i: "ᵢ", j: "ⱼ", k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ", 
    p: "ₚ", r: "ᵣ", s: "ₛ", t: "ₜ", u: "ᵤ", v: "ᵥ", x: "ₓ",
  };

  useEffect(() => {
    convertToSubscript(inputText);
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setSentenceCount(text ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0);
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const convertToSubscript = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }
    // Use spread operator for multi-byte character safety
    const result = [...text].map((char) => subscriptMap[char.toLowerCase()] || char).join("");
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
    element.download = "subscript-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Subscript Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Subscript Generator</h1>
        <p className="text-gray-300 mb-6"> {/* Use consistent text color */}
          {/* Plain text example */}
          Convert text to subscript characters (e.g., H2O).
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full">
            <Textarea
              placeholder="Type text with numbers/letters to subscript..."
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
                placeholder="Subscript text will appear here..." // Plain placeholder
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

        {/* Standard About/Usage Tabs + Available Characters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6"> {/* Add margin-top */}
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
            <TabsTrigger value="characters" className="data-[state=active]:bg-zinc-700">Available Characters</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {aboutContent}
          </TabsContent>
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {usageTipsContent}
          </TabsContent>
           {/* Keep the existing Available Characters Tab */}
           <TabsContent value="characters" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
             <h3 className="font-medium mb-2">Available Subscript Characters</h3>
             <p className="mb-4">
               Not all characters have a subscript equivalent in Unicode. Here's what this tool supports:
             </p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
               <Card className="p-3 bg-zinc-700 border-zinc-600">
                 <h4 className="font-medium mb-2">Numbers</h4>
                 <div className="grid grid-cols-5 gap-2">
                   <div className="text-center">0 → ₀</div> <div className="text-center">1 → ₁</div>
                   <div className="text-center">2 → ₂</div> <div className="text-center">3 → ₃</div>
                   <div className="text-center">4 → ₄</div> <div className="text-center">5 → ₅</div>
                   <div className="text-center">6 → ₆</div> <div className="text-center">7 → ₇</div>
                   <div className="text-center">8 → ₈</div> <div className="text-center">9 → ₉</div>
                 </div>
               </Card>
               <Card className="p-3 bg-zinc-700 border-zinc-600">
                 <h4 className="font-medium mb-2">Symbols</h4>
                 <div className="grid grid-cols-5 gap-2">
                   <div className="text-center">+ → ₊</div> <div className="text-center">- → ₋</div>
                   <div className="text-center">= → ₌</div> <div className="text-center">( → ₍</div>
                   <div className="text-center">) → ₎</div>
                 </div>
               </Card>
               <Card className="p-3 bg-zinc-700 border-zinc-600 col-span-2">
                 <h4 className="font-medium mb-2">Lowercase Letters</h4>
                 <p className="text-sm mb-2">Only some lowercase letters have subscript versions:</p>
                 <div className="grid grid-cols-6 md:grid-cols-9 gap-1 text-sm">
                   <div className="text-center">a → ₐ</div> <div className="text-center">e → ₑ</div>
                   <div className="text-center">h → ₕ</div> <div className="text-center">i → ᵢ</div>
                   <div className="text-center">j → ⱼ</div> <div className="text-center">k → ₖ</div>
                   <div className="text-center">l → ₗ</div> <div className="text-center">m → ₘ</div>
                   <div className="text-center">n → ₙ</div> <div className="text-center">o → ₒ</div>
                   <div className="text-center">p → ₚ</div> <div className="text-center">r → ᵣ</div>
                   <div className="text-center">s → ₛ</div> <div className="text-center">t → ₜ</div>
                   <div className="text-center">u → ᵤ</div> <div className="text-center">v → ᵥ</div>
                   <div className="text-center">x → ₓ</div>
                 </div>
                 <p className="text-sm mt-2 text-gray-400">Note: b, c, d, f, g, q, w, y, z, and uppercase letters lack standard Unicode subscript versions.</p>
               </Card>
             </div>
             <div className="mt-4 p-3 bg-zinc-700 rounded-md">
               <h4 className="font-medium mb-2">Common Usage Examples</h4>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                 {/* Plain text examples */}
                 <div className="p-2 bg-zinc-600 rounded">H2O (water)</div>
                 <div className="p-2 bg-zinc-600 rounded">CO2 (carbon dioxide)</div>
                 <div className="p-2 bg-zinc-600 rounded">Fe3O4 (magnetite)</div>
                 <div className="p-2 bg-zinc-600 rounded">x1, x2, x3 (variables)</div>
                 <div className="p-2 bg-zinc-600 rounded">log10 (log base 10)</div>
                 <div className="p-2 bg-zinc-600 rounded">C6H12O6 (glucose)</div>
               </div>
             </div>
           </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default SubscriptGenerator;
