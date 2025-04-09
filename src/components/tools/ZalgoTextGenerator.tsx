import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ToolLayout } from "./ToolLayout"; // Import ToolLayout
import { Card } from "@/components/ui/card"; // Import Card
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import { Slider } from "@/components/ui/slider"; // Import Slider
import { Label } from "@/components/ui/label"; // Import Label
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea
import { Copy, Check, Download, Trash2, RotateCcw } from "lucide-react"; // Import icons

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Zalgo / Glitch Text Generator</h3>
    <p className="mb-4">
      Create creepy, corrupted, or "glitched" text effects with our Zalgo Text Generator. This tool uses special Unicode combining characters (diacritics) that stack vertically above, below, and through your normal text characters.
    </p>
    <p className="mb-4">
      Zalgo text is popular in internet culture, often used in memes (like "He comes"), horror-themed content, creepy pasta, or anywhere you want to create a disturbing visual effect. The intensity slider allows you to control how chaotic and distorted the text appears.
    </p>
     <p className="mb-4">
      The generated text can be copied and pasted into platforms like Discord, Twitter, Facebook, and others that support Unicode combining characters. Be aware that very high intensity levels might cause rendering issues or lag on some devices or platforms.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">zalgo text generator, glitch text generator, cursed text generator, creepy text, distorted text, unicode combiner, scary text generator, copy paste zalgo text, he comes text</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Zalgo Text Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to "corrupt" into the input box on the left.</li>
      <li><strong>Adjust Intensity:</strong> Use the "Craziness Level" slider below the input to control how many combining characters are added (more = more glitchy).</li>
      <li><strong>View Output:</strong> The Zalgo text will automatically appear in the output box on the right, updating as you type or adjust the slider.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the generated Zalgo text.</li>
      <li><strong>Paste Carefully:</strong> Use the Zalgo text on Discord, Twitter, forums, etc. Higher intensity levels might not display well everywhere and could cause lag.</li>
      <li><strong>Download Option:</strong> Use the "Download" button to save the generated text as a .txt file.</li>
      <li><strong>Clear Input:</strong> Click "Clear" to easily start over.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Warning: Extremely high intensity levels can make text unreadable and potentially cause performance issues in some applications. Use with caution!
    </p>
  </>
);


const ZalgoTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false); // General copied state for main button
  const [intensity, setIntensity] = useState(50); 
  const [activeTab, setActiveTab] = useState("about"); 
  
  // Use individual state variables for stats
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  // Character mappings (keep as is)
  const upsideDownMap: { [key: string]: string } = { /* ... */ 
    a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
    k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
    u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
    A: "∀", B: "ꓭ", C: "Ͻ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ",
    K: "ꓘ", L: "˩", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Q", R: "ꓤ", S: "S", T: "⊥",
    U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
    "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
    ",": "'", ".": "˙", "?": "¿", "!": "¡", '"': "„", "'": ",", "(": ")", ")": "(", "[": "]", "]": "[",
    "{": "}", "}": "{", "<": ">", ">": "<", "&": "⅋", "_": "‾", "^": "v", "/": "\\", "\\": "/",
    ";": "؛", ":": "꞉",
    " ": " ", "\n": "\n"
  };
  const mirrorMap: { [key: string]: string } = { /* ... */ 
    a: "ɒ", b: "d", c: "ɔ", d: "b", e: "ɘ", f: "ꟻ", g: "ᵷ", h: "ʜ", i: "i", j: "ꞁ",
    k: "ʞ", l: "l", m: "m", n: "ᴎ", o: "o", p: "q", q: "p", r: "ɿ", s: "ꙅ", t: "ƚ",
    u: "u", v: "v", w: "w", x: "x", y: "y", z: "ꙃ",
    A: "A", B: "ꓭ", C: "Ɔ", D: "ꓷ", E: "Ǝ", F: "ꓞ", G: "ꓜ", H: "H", I: "I", J: "Ꞁ",
    K: "ꓘ", L: "⅃", M: "M", N: "И", O: "O", P: "ꓑ", Q: "Ꝺ", R: "Я", S: "Ꙅ", T: "T",
    U: "U", V: "V", W: "W", X: "X", Y: "Y", Z: "Ꙁ",
    "1": "1", "2": "S", "3": "Ɛ", "4": "ᔭ", "5": "ꙅ", "6": "ꓯ", "7": "V", "8": "8", "9": "ꓷ", "0": "0",
    "&": "⅋", "?": "⸮", "!": "¡", "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
    "<": ">", ">": "<", ".": "˙", ",": "՝", "/": "\\", "\\": "/",
    " ": " ", "\n": "\n"
  };


  useEffect(() => {
    updateStats(inputText);
    setOutputText(generateZalgoText(inputText, intensity));
  }, [inputText, intensity]);

  // Update individual state variables
  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    setLineCount(text.trim() ? text.split(/\r\n|\r|\n/).length : 0);
  };

  // Zalgo text generation function (keep existing logic)
  const generateZalgoText = (text: string, intensityLevel: number) => {
    if (!text) return "";
    const above = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343', '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350', '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d', '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369', '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b'];
    const middle = ['\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327', '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e', '\u035f', '\u0360', '\u0362', '\u0338', '\u0337', '\u0361', '\u0489'];
    const below = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f', '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c', '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339', '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d', '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'];

    const normalizedIntensity = intensityLevel / 100;
    const maxMarksAbove = Math.max(1, Math.floor(normalizedIntensity * 20)); 
    const maxMarksMiddle = Math.max(1, Math.floor(normalizedIntensity * 5)); 
    const maxMarksBelow = Math.max(1, Math.floor(normalizedIntensity * 20)); 
    
    let result = "";
    const chars = [...text]; 

    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      result += char;
      
      if (char === ' ' || char === '\n' || char === '\r') continue;
      
      const aboveCount = Math.floor(Math.random() * maxMarksAbove);
      for (let j = 0; j < aboveCount; j++) { result += above[Math.floor(Math.random() * above.length)]; }
      
      const middleCount = Math.floor(Math.random() * maxMarksMiddle);
      for (let j = 0; j < middleCount; j++) { result += middle[Math.floor(Math.random() * middle.length)]; }
      
      const belowCount = Math.floor(Math.random() * maxMarksBelow);
      for (let j = 0; j < belowCount; j++) { result += below[Math.floor(Math.random() * below.length)]; }
    }
    return result;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    // Output and stats cleared via useEffect
  };
  
  const handleDownloadText = () => {
    if (!outputText) return;
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain;charset=utf-8" }); 
    element.href = URL.createObjectURL(file);
    element.download = `zalgo-text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleIntensityChange = (value: number[]) => {
    setIntensity(value[0]);
  };

  return (
    <ToolLayout title="Zalgo Text Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Zalgo Glitch Text Generator</h1>
        <p className="text-gray-300 mb-6">
          Create c̵o̵r̵r̵u̵p̵t̵e̵d̵ and glitchy text effects with adjustable intensity.
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full space-y-4">
             <Label className="text-lg font-semibold">Input Text</Label>
             <Textarea
               placeholder="Type or paste your text here..."
               className="w-full h-[300px] min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize-none"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
             />
             {/* Intensity Slider */}
             <div className="my-4">
               <Label className="text-base font-semibold mb-2 block">Craziness Level:</Label>
               <div className="flex items-center gap-4">
                 <span className="text-sm text-gray-400">Mild</span>
                 <Slider 
                   defaultValue={[intensity]} 
                   value={[intensity]}
                   max={100} 
                   step={1} 
                   className="w-full" 
                   onValueChange={handleIntensityChange}
                 />
                 <span className="text-sm text-gray-400">Extreme</span>
               </div>
             </div>
             {/* Stats Card Below Input */}
             <Card className="p-4 bg-zinc-800 border-zinc-700">
               <div className="flex flex-wrap gap-4">
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Characters</span>
                   {/* Use individual state variables */}
                   <span className="text-xl font-semibold">{charCount}</span> 
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Words</span>
                   <span className="text-xl font-semibold">{wordCount}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Lines</span>
                   <span className="text-xl font-semibold">{lineCount}</span>
                 </div>
               </div>
             </Card>
          </div>

          {/* Output Section (Right Column) */}
          <div className="w-full">
            <div className="h-full flex flex-col"> {/* Ensure full height */}
               <Label className="text-lg font-semibold mb-2 block">Output Zalgo Text</Label>
               <Textarea
                 readOnly
                 placeholder="Z̵a̵l̵g̵o̵ ̵t̵e̵x̵t̵ ̵w̵i̵l̵l̵ ̵a̵p̵p̵e̵a̵r̵ ̵h̵e̵r̵e̵" // Zalgo placeholder
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
                  {copied ? <Check className="w-4 h-4 mr-2 text-green-500"/> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadText}
                  disabled={!outputText}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                   <Download className="w-4 h-4 mr-2" />
                   Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                   <Trash2 className="w-4 h-4 mr-2" />
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

export default ZalgoTextGenerator;