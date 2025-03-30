import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const SubscriptGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    convertToSubscript(inputText);
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length);
    setSentenceCount(text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length);
    setLineCount(text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).length);
  };

  const convertToSubscript = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode subscript character mapping
    const subscriptMap: { [key: string]: string } = {
      "0": "₀",
      "1": "₁",
      "2": "₂",
      "3": "₃",
      "4": "₄",
      "5": "₅",
      "6": "₆",
      "7": "₇",
      "8": "₈",
      "9": "₉",
      "+": "₊",
      "-": "₋",
      "=": "₌",
      "(": "₍",
      ")": "₎",
      a: "ₐ",
      e: "ₑ",
      h: "ₕ",
      i: "ᵢ",
      j: "ⱼ",
      k: "ₖ",
      l: "ₗ",
      m: "ₘ",
      n: "ₙ",
      o: "ₒ",
      p: "ₚ",
      r: "ᵣ",
      s: "ₛ",
      t: "ₜ",
      u: "ᵤ",
      v: "ᵥ",
      x: "ₓ",
    };

    const result = text
      .split("")
      .map((char) => subscriptMap[char.toLowerCase()] || char)
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
    setOutputText("");
    setCharCount(0);
    setWordCount(0);
    setSentenceCount(0);
    setLineCount(0);
  };
  
  const handleDownload = () => {
    if (!outputText) return;
    
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "subscript-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Subscript Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Subscript Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Convert your text to subscript characters that appear below the baseline.
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
              placeholder="Subscript text will appear here"
              value={outputText}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-2"
            />
            
            {/* Actions Row - Right aligned */}
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
            <TabsTrigger value="characters" className="data-[state=active]:bg-zinc-700">Available Characters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Subscript Generator</h3>
            <p className="mb-4">
              This tool converts your text to subscript characters that appear below the baseline. Subscript is
              a typographical feature where characters appear smaller and positioned below the normal line of text.
            </p>
            <p className="mb-4">
              Subscript characters are widely used in various contexts, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Chemical formulas (e.g., H₂O, CO₂)</li>
              <li>Mathematical notation and equations</li>
              <li>Scientific writing, especially for chemical compounds</li>
              <li>Footnotes and references in academic writing</li>
              <li>Representing variables with indices</li>
            </ul>
            <p className="mb-4">
              The subscript text generated by this tool uses Unicode characters, making it compatible with 
              most platforms that support Unicode text.
            </p>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Type your text in the input field to see it converted to subscript in real-time</li>
              <li>Not all characters have a subscript version—those will remain unchanged</li>
              <li>Subscript works best for numbers, mathematical symbols, and some lowercase letters</li>
              <li>For chemical formulas, use subscript for element counts (e.g., H₂O)</li>
              <li>In scientific notation, use subscript for base values (e.g., x₁, x₂, x₃)</li>
              <li>Copy the generated text with one click using the "Copy to Clipboard" button</li>
              <li>Save your subscript text as a file using the "Download" button</li>
            </ul>
            <p className="text-sm text-gray-400">
              <strong>Note:</strong> Some platforms may display subscript characters differently or not at all, 
              depending on their font support. Always test the appearance on your target platform.
            </p>
          </TabsContent>
          
          <TabsContent value="characters" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Available Subscript Characters</h3>
            <p className="mb-4">
              Not all characters have a subscript equivalent in Unicode. Here's what's available:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <Card className="p-3 bg-zinc-700 border-zinc-600">
                <h4 className="font-medium mb-2">Numbers</h4>
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">0 → ₀</div>
                  <div className="text-center">1 → ₁</div>
                  <div className="text-center">2 → ₂</div>
                  <div className="text-center">3 → ₃</div>
                  <div className="text-center">4 → ₄</div>
                  <div className="text-center">5 → ₅</div>
                  <div className="text-center">6 → ₆</div>
                  <div className="text-center">7 → ₇</div>
                  <div className="text-center">8 → ₈</div>
                  <div className="text-center">9 → ₉</div>
                </div>
              </Card>
              
              <Card className="p-3 bg-zinc-700 border-zinc-600">
                <h4 className="font-medium mb-2">Symbols</h4>
                <div className="grid grid-cols-5 gap-2">
                  <div className="text-center">+ → ₊</div>
                  <div className="text-center">- → ₋</div>
                  <div className="text-center">= → ₌</div>
                  <div className="text-center">( → ₍</div>
                  <div className="text-center">) → ₎</div>
                </div>
              </Card>
              
              <Card className="p-3 bg-zinc-700 border-zinc-600 col-span-2">
                <h4 className="font-medium mb-2">Lowercase Letters</h4>
                <p className="text-sm mb-2">Only some lowercase letters have subscript versions:</p>
                <div className="grid grid-cols-10 gap-1 text-sm">
                  <div className="text-center">a → ₐ</div>
                  <div className="text-center">e → ₑ</div>
                  <div className="text-center">h → ₕ</div>
                  <div className="text-center">i → ᵢ</div>
                  <div className="text-center">j → ⱼ</div>
                  <div className="text-center">k → ₖ</div>
                  <div className="text-center">l → ₗ</div>
                  <div className="text-center">m → ₘ</div>
                  <div className="text-center">n → ₙ</div>
                  <div className="text-center">o → ₒ</div>
                  <div className="text-center">p → ₚ</div>
                  <div className="text-center">r → ᵣ</div>
                  <div className="text-center">s → ₛ</div>
                  <div className="text-center">t → ₜ</div>
                  <div className="text-center">u → ᵤ</div>
                  <div className="text-center">v → ᵥ</div>
                  <div className="text-center">x → ₓ</div>
                </div>
                <p className="text-sm mt-2 text-gray-400">Note: b, c, d, f, g, q, w, y, and z don't have standard Unicode subscript versions.</p>
              </Card>
            </div>
            
            <p className="text-sm text-gray-400">
              Uppercase letters don't have subscript equivalents in Unicode. Characters not listed above will remain unchanged when processed through this tool.
            </p>
            
            <div className="mt-4 p-3 bg-zinc-700 rounded-md">
              <h4 className="font-medium mb-2">Common Usage Examples</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div className="p-2 bg-zinc-600 rounded">H₂O (water)</div>
                <div className="p-2 bg-zinc-600 rounded">CO₂ (carbon dioxide)</div>
                <div className="p-2 bg-zinc-600 rounded">Fe₃O₄ (magnetite)</div>
                <div className="p-2 bg-zinc-600 rounded">x₁, x₂, x₃ (variables)</div>
                <div className="p-2 bg-zinc-600 rounded">log₁₀ (logarithm base 10)</div>
                <div className="p-2 bg-zinc-600 rounded">C₆H₁₂O₆ (glucose)</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default SubscriptGenerator;
