import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card"; // Import Card
import { Copy, RotateCcw, Check } from "lucide-react";
import { ToolLayout } from "./ToolLayout"; // Import ToolLayout
import { Label } from "@/components/ui/label"; // Add missing import
import { ScrollArea } from "@/components/ui/scroll-area"; // Add missing import

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Upside Down Text Generator</h3>
    <p className="mb-4">
      Flip, reverse, and mirror your text with our versatile Upside Down Text Generator! This tool uses special Unicode characters to create several unique text effects:
    </p>
    <ul className="list-disc list-inside space-y-2 mb-4">
      {/* Use plain text examples */}
      <li><strong>Upside Down:</strong> Flips characters vertically (e.g., text -&gt; txet).</li>
      <li><strong>Reversed:</strong> Reverses the order of characters (e.g., text -&gt; txet).</li>
      <li><strong>Both (Upside Down + Reversed):</strong> Flips characters vertically AND reverses their order (e.g., text -&gt; txet). This is often the most common "upside down" effect people look for.</li>
      <li><strong>Mirror Text:</strong> Flips characters horizontally (e.g., text -&gt; txet).</li>
    </ul>
     <p className="mb-4">
      Use these effects to create eye-catching social media posts (Instagram, Facebook, Twitter), unique usernames, fun messages, or creative design elements. The generated text uses Unicode characters, allowing you to copy and paste it almost anywhere.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">upside down text generator, flip text, reverse text, mirror text generator, backward text, unicode text effects, copy paste fonts, social media fonts</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Upside Down Text Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to transform into the input box on the left.</li>
      <li><strong>Select Effect:</strong> Choose the desired effect (Upside Down, Reversed, Both, Mirror) from the tabs above the output area on the right.</li>
      <li><strong>View Output:</strong> The transformed text will appear in the selected tab's output box.</li>
      <li><strong>Copy Result:</strong> Click the "Copy" button within the active output tab to copy that specific style.</li>
      <li><strong>Paste Anywhere:</strong> Use the generated text on social media, in messages, usernames, etc.</li>
      <li><strong>Clear All:</strong> Click the "Clear All" button to reset the input and all outputs.</li>
    </ul>
     <h4 className="font-medium mb-2">Common Uses:</h4>
      <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
        <li>Creating unique social media bios and posts.</li>
        <li>Sending fun or coded messages to friends.</li>
        <li>Generating interesting usernames for games or forums.</li>
        <li>Adding stylistic elements to graphic designs.</li>
        <li>Making text puzzles or riddles.</li>
      </ul>
    <p className="text-sm text-gray-400 mt-4">
      Note: Not all characters have perfect upside-down or mirrored Unicode equivalents. The tool uses the closest available characters. Appearance may vary slightly across platforms.
    </p>
  </>
);


const UpsideDownTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [upsideDownText, setUpsideDownText] = useState("");
  const [reversedText, setReversedText] = useState("");
  const [upsideDownReversedText, setUpsideDownReversedText] = useState("");
  const [mirrorText, setMirrorText] = useState("");
  // State to track which output tab's copy button was clicked
  const [copiedOutput, setCopiedOutput] = useState<string | null>(null); 
  const [activeOutputTab, setActiveOutputTab] = useState("upside-down-reversed"); // Default to 'Both'
  const [activeInfoTab, setActiveInfoTab] = useState("about"); // For About/Usage tabs
  const [stats, setStats] = useState({ chars: 0, words: 0, lines: 0 }); // Simplified stats

  // Character mappings
  const upsideDownMap: { [key: string]: string } = { /* ... (keep existing map) ... */ 
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
  const mirrorMap: { [key: string]: string } = { /* ... (keep existing map) ... */ 
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
    processText(inputText);
    calculateStats(inputText);
  }, [inputText]);

  const calculateStats = (text: string) => {
    setStats({
      chars: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text.trim() ? text.split(/\r\n|\r|\n/).length : 0,
      // Sentence count removed as less relevant for these transformations
    });
  };

  const processText = (text: string) => {
    const chars = [...text]; // Use spread for multi-byte safety
    
    let upsideDown = chars.map(char => upsideDownMap[char] || char).join("");
    setUpsideDownText(upsideDown);

    let reversed = chars.slice().reverse().join(""); // Use slice to avoid modifying original
    setReversedText(reversed);

    let upsideDownReversed = chars.map(char => upsideDownMap[char] || char).reverse().join("");
    setUpsideDownReversedText(upsideDownReversed);

    let mirror = chars.map(char => mirrorMap[char] || char).join("");
    setMirrorText(mirror);
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOutput(type);
    setTimeout(() => setCopiedOutput(null), 2000);
  };

  const handleClear = () => {
    setInputText("");
    // Other states cleared via useEffect
  };

  // Helper to render output card content
  const renderOutputCard = (value: string, type: string) => (
     <Card className="h-full bg-zinc-700 border-zinc-600">
       <CardContent className="p-4 h-full flex flex-col">
         <ScrollArea className="flex-grow mb-2">
           <div className="text-lg break-words whitespace-pre-wrap text-white">
             {value || <span className="text-zinc-400 italic">Output appears here...</span>}
           </div>
         </ScrollArea>
         <div className="flex justify-end">
           <Button 
             variant="ghost" 
             size="sm"
             className="text-zinc-300 hover:text-white h-8 px-2"
             onClick={() => handleCopy(value, type)}
             disabled={!value}
           >
             <Copy className="w-4 h-4 mr-1" />
             {copiedOutput === type ? "Copied" : "Copy"}
           </Button>
         </div>
       </CardContent>
     </Card>
  );

  return (
    <ToolLayout title="Upside Down Text Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Upside Down Text Generator</h1>
        <p className="text-gray-300 mb-6">
          Flip, reverse, and mirror text for social media, messages, and fun.
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full space-y-4">
             <Label className="text-lg font-semibold">Input Text</Label>
             <Textarea
               placeholder="Type or paste your content here..."
               className="w-full h-[300px] min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize-none"
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
             />
             {/* Stats Card Below Input */}
             <Card className="p-4 bg-zinc-800 border-zinc-700">
               <div className="flex flex-wrap gap-4">
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Characters</span>
                   <span className="text-xl font-semibold">{stats.chars}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Words</span>
                   <span className="text-xl font-semibold">{stats.words}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Lines</span>
                   <span className="text-xl font-semibold">{stats.lines}</span>
                 </div>
               </div>
             </Card>
             <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 flex items-center"
                  onClick={handleClear}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear Input
                </Button>
             </div>
          </div>

          {/* Output Section (Right Column) */}
          <div className="w-full space-y-4">
             <Label className="text-lg font-semibold">Output Text</Label>
             <Tabs defaultValue="upside-down-reversed" value={activeOutputTab} onValueChange={setActiveOutputTab} className="h-[388px]"> {/* Adjusted height */}
               <TabsList className="grid grid-cols-4 mb-2 bg-zinc-800">
                 <TabsTrigger value="upside-down" className="data-[state=active]:bg-zinc-700">Upside Down</TabsTrigger>
                 <TabsTrigger value="reversed" className="data-[state=active]:bg-zinc-700">Reversed</TabsTrigger>
                 <TabsTrigger value="upside-down-reversed" className="data-[state=active]:bg-zinc-700">Both</TabsTrigger>
                 <TabsTrigger value="mirror" className="data-[state=active]:bg-zinc-700">Mirror</TabsTrigger>
               </TabsList>
               <TabsContent value="upside-down" className="h-[calc(388px-2.5rem)] mt-0">
                 {renderOutputCard(upsideDownText, "upside-down")}
               </TabsContent>
               <TabsContent value="reversed" className="h-[calc(388px-2.5rem)] mt-0">
                 {renderOutputCard(reversedText, "reversed")}
               </TabsContent>
               <TabsContent value="upside-down-reversed" className="h-[calc(388px-2.5rem)] mt-0">
                 {renderOutputCard(upsideDownReversedText, "upside-down-reversed")}
               </TabsContent>
               <TabsContent value="mirror" className="h-[calc(388px-2.5rem)] mt-0">
                 {renderOutputCard(mirrorText, "mirror")}
               </TabsContent>
             </Tabs>
          </div>
        </div>

        {/* Standard About/Usage Tabs */}
        <Tabs value={activeInfoTab} onValueChange={setActiveInfoTab} className="mt-6"> {/* Add margin-top */}
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

export default UpsideDownTextGenerator;