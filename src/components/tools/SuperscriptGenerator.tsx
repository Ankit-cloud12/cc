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
    <h3 className="font-medium mb-2">About Superscript Generator</h3>
    <p className="mb-4">
      Generate ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ text instantly with our free online Superscript Generator. This tool converts your standard letters, numbers, and some symbols into their smaller, raised Unicode equivalents.
    </p>
    <p className="mb-4">
      Superscript text is commonly used for mathematical exponents (like x² or 10⁹), footnotes, ordinal indicators (1ˢᵗ, 2ⁿᵈ), trademarks (™), and creating unique text styles for social media (Instagram, Twitter, Facebook) bios, comments, and posts.
    </p>
     <p className="mb-4">
      Because it uses Unicode characters, the generated superscript text can be copied and pasted almost anywhere online.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">superscript generator, text to superscript, unicode superscript, copy paste superscript, exponent text, small text generator, social media fonts, tiny text generator</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Superscript Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to convert into the input box on the left.</li>
      <li><strong>Instant Conversion:</strong> The text will automatically appear with available characters converted to superscript in the output box on the right.</li>
      <li><strong>Supported Characters:</strong> Most numbers, lowercase letters, some uppercase letters, and common symbols (+, -, =, (, )) have standard Unicode superscript versions. Unsupported characters will remain unchanged. See the 'Available Characters' tab for details.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the text with superscript characters.</li>
      <li><strong>Paste Anywhere:</strong> Use the superscript text for math exponents (x²), footnotes¹, trademarks™, or stylish text on social media.</li>
      <li><strong>Download Option:</strong> Use the "Download" button to save the generated text as a .txt file.</li>
      <li><strong>Clear Input:</strong> Click "Clear" to easily start over.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Note: The exact appearance and alignment of superscript characters can vary depending on the font, device, and platform.
    </p>
  </>
);


const SuperscriptGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0); // Keep for consistency
  const [lineCount, setLineCount] = useState(0);

  // Unicode superscript character mapping
  const superscriptMap: { [key: string]: string } = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
    a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ", i: "ⁱ", j: "ʲ",
    k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", r: "ʳ", s: "ˢ", t: "ᵗ",
    u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ",
    A: "ᴬ", B: "ᴮ", D: "ᴰ", E: "ᴱ", G: "ᴳ", H: "ᴴ", I: "ᴵ", J: "ᴶ", K: "ᴷ", L: "ᴸ", 
    M: "ᴹ", N: "ᴺ", O: "ᴼ", P: "ᴾ", R: "ᴿ", T: "ᵀ", U: "ᵁ", V: "ⱽ", W: "ᵂ",
    // Note: C, F, Q, S, X, Y, Z have no standard single superscript char
  };


  useEffect(() => {
    convertToSuperscript(inputText);
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setSentenceCount(text ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0);
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const convertToSuperscript = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }
    // Use spread operator for multi-byte character safety
    const result = [...text].map((char) => superscriptMap[char] || char).join("");
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
    element.download = "superscript-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Superscript Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Superscript Generator</h1>
        <p className="text-gray-300 mb-6"> {/* Use consistent text color */}
          {/* Plain text example */}
          Convert text to ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ characters (e.g., x², 10⁹).
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full flex flex-col">
            <Textarea
              placeholder="Type text with numbers/letters to superscript..."
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
              placeholder="Sᵘᵖᵉʳˢᶜʳⁱᵖᵗ ᵗᵉˣᵗ ʷⁱˡˡ ᵃᵖᵖᵉᵃʳ ʰᵉʳᵉ..." // Superscript placeholder
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
             <h3 className="font-medium mb-2">Available Superscript Characters</h3>
             <p className="mb-4">
               Not all characters have a superscript equivalent in Unicode. Here's what this tool supports:
             </p>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
               <Card className="p-3 bg-zinc-700 border-zinc-600">
                 <h4 className="font-medium mb-2">Numbers</h4>
                 <div className="grid grid-cols-5 gap-2">
                   <div className="text-center">0 → ⁰</div> <div className="text-center">1 → ¹</div>
                   <div className="text-center">2 → ²</div> <div className="text-center">3 → ³</div>
                   <div className="text-center">4 → ⁴</div> <div className="text-center">5 → ⁵</div>
                   <div className="text-center">6 → ⁶</div> <div className="text-center">7 → ⁷</div>
                   <div className="text-center">8 → ⁸</div> <div className="text-center">9 → ⁹</div>
                 </div>
               </Card>
               <Card className="p-3 bg-zinc-700 border-zinc-600">
                 <h4 className="font-medium mb-2">Symbols</h4>
                 <div className="grid grid-cols-5 gap-2">
                   <div className="text-center">+ → ⁺</div> <div className="text-center">- → ⁻</div>
                   <div className="text-center">= → ⁼</div> <div className="text-center">( → ⁽</div>
                   <div className="text-center">) → ⁾</div>
                 </div>
               </Card>
               <Card className="p-3 bg-zinc-700 border-zinc-600 col-span-2">
                 <h4 className="font-medium mb-2">Lowercase Letters</h4>
                 <div className="grid grid-cols-10 gap-1 text-sm">
                   <div className="text-center">a → ᵃ</div> <div className="text-center">b → ᵇ</div>
                   <div className="text-center">c → ᶜ</div> <div className="text-center">d → ᵈ</div>
                   <div className="text-center">e → ᵉ</div> <div className="text-center">f → ᶠ</div>
                   <div className="text-center">g → ᵍ</div> <div className="text-center">h → ʰ</div>
                   <div className="text-center">i → ⁱ</div> <div className="text-center">j → ʲ</div>
                   <div className="text-center">k → ᵏ</div> <div className="text-center">l → ˡ</div>
                   <div className="text-center">m → ᵐ</div> <div className="text-center">n → ⁿ</div>
                   <div className="text-center">o → ᵒ</div> <div className="text-center">p → ᵖ</div>
                   <div className="text-center">r → ʳ</div> <div className="text-center">s → ˢ</div>
                   <div className="text-center">t → ᵗ</div> <div className="text-center">u → ᵘ</div>
                   <div className="text-center">v → ᵛ</div> <div className="text-center">w → ʷ</div>
                   <div className="text-center">x → ˣ</div> <div className="text-center">y → ʸ</div>
                   <div className="text-center">z → ᶻ</div>
                 </div>
               </Card>
                <Card className="p-3 bg-zinc-700 border-zinc-600 col-span-2 md:col-span-4">
                 <h4 className="font-medium mb-2">Uppercase Letters</h4>
                 <p className="text-sm mb-2">Only some uppercase letters have superscript versions:</p>
                 <div className="grid grid-cols-10 gap-1 text-sm">
                   <div className="text-center">A → ᴬ</div> <div className="text-center">B → ᴮ</div>
                   <div className="text-center">D → ᴰ</div> <div className="text-center">E → ᴱ</div>
                   <div className="text-center">G → ᴳ</div> <div className="text-center">H → ᴴ</div>
                   <div className="text-center">I → ᴵ</div> <div className="text-center">J → ᴶ</div>
                   <div className="text-center">K → ᴷ</div> <div className="text-center">L → ᴸ</div>
                   <div className="text-center">M → ᴹ</div> <div className="text-center">N → ᴺ</div>
                   <div className="text-center">O → ᴼ</div> <div className="text-center">P → ᴾ</div>
                   <div className="text-center">R → ᴿ</div> <div className="text-center">T → ᵀ</div>
                   <div className="text-center">U → ᵁ</div> <div className="text-center">V → ⱽ</div>
                   <div className="text-center">W → ᵂ</div>
                 </div>
                 <p className="text-sm mt-2 text-gray-400">Note: C, F, Q, S, X, Y, Z lack standard Unicode superscript versions.</p>
               </Card>
             </div>
             <p className="text-sm text-gray-400">
               Characters not listed above will remain unchanged.
             </p>
           </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default SuperscriptGenerator;
