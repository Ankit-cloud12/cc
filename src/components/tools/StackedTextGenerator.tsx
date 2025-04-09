import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for consistency if needed, or keep Input
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Copy, Trash2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToolLayout } from "./ToolLayout"; // Import ToolLayout
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Stacked Text Generator</h3>
    <p className="mb-4">
      Create unique text effects by stacking characters vertically with our Stacked Text Generator. This tool uses special Unicode combining characters to place letters or symbols directly above the characters of your base text.
    </p>
    <p className="mb-4">
      Perfect for creating eye-catching usernames, stylish social media posts (Instagram, TikTok, etc.), game profiles, or anywhere you want visually layered text. Note that only specific characters (a, e, i, o, u, c, d, h, m, r, t, v, x) can be perfectly stacked due to Unicode limitations; others will appear as superscript.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">stacked text generator, text over text, vertical text generator, combine text vertically, unicode combining characters, cool text generator, social media fonts</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Stacked Text Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Bottom Text:</strong> Type the main text you want as the base layer in the "Bottom Text" input.</li>
      <li><strong>Enter Top Text:</strong> Type the characters you want to stack *above* the bottom text in the "Top Text" input. The characters will align vertically (e.g., the 1st char of Top Text goes above the 1st char of Bottom Text).</li>
      <li><strong>Supported Characters:</strong> For perfect stacking, use only 'a', 'e', 'i', 'o', 'u', 'c', 'd', 'h', 'm', 'r', 't', 'v', 'x' in the Top Text. Other characters will appear as superscript.</li>
      <li><strong>Preview Output:</strong> The combined stacked text will appear automatically in the "Output" area.</li>
      <li><strong>Use Popular Styles:</strong> Click on a style from the "Most popular styles" section to automatically fill the input fields.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the generated stacked text.</li>
      <li><strong>Paste Anywhere:</strong> Use the stacked text on social media, in games, or other platforms supporting Unicode.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: Use spaces in the "Top Text" input if you want to skip stacking a character above a specific letter in the "Bottom Text".
    </p>
  </>
);


const StackedTextGenerator = () => {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about"); // For About/Usage tabs

  // Statistics state
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  
  // Define available combining characters
  const combiningChars: Record<string, string> = {
    'a': '\u0363', 'e': '\u0364', 'i': '\u0365', 'o': '\u0366', 'u': '\u0367', 
    'c': '\u0368', 'd': '\u0369', 'h': '\u036A', 'm': '\u036B', 'r': '\u036C', 
    't': '\u036D', 'v': '\u036E', 'x': '\u036F'
  };

  useEffect(() => {
    createStackedText();
    // Update stats based on bottom text (base layer)
    updateStats(bottomText); 
  }, [topText, bottomText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const createStackedText = () => {
    if (!bottomText) {
      setOutputText("");
      return;
    }
    if (!topText) {
      setOutputText(bottomText);
      return;
    }

    const bottomChars = [...bottomText]; // Use spread for multi-byte char safety
    const topChars = [...topText];
    let result = '';

    for (let i = 0; i < bottomChars.length; i++) {
      const bottomChar = bottomChars[i];
      const topChar = i < topChars.length ? topChars[i] : ' ';
      
      result += bottomChar;
      
      if (topChar !== ' ' && combiningChars[topChar.toLowerCase()]) {
        result += combiningChars[topChar.toLowerCase()];
      } else if (topChar !== ' ') {
        // Fallback to superscript
        const superscript: Record<string, string> = {
          'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 
          'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 
          'q': 'q', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 
          'y': 'ʸ', 'z': 'ᶻ', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', 
          '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', 
          '=': '⁼', '(': '⁽', ')': '⁾'
        };
        result += superscript[topChar.toLowerCase()] || topChar; // Use original char if no superscript found
      }
    }
    setOutputText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTopText("");
    setBottomText("");
    // Output and stats cleared via useEffect
  };

  // Examples and Popular Styles data (keep as is)
  const examples = [
    { top: "xsx", bottom: "sxsx", output: "sͯˢxͯsx" },
    { top: "eario", bottom: "expression", output: "eͨxͬpͤrͣeͭsͥsͮiͤon" },
    { top: "aeiouc", bottom: "stacked", output: "sͣtͤiͥoͦuͧcͨked" }
  ];
  const popularStyles = [
     { name: "Legend", top: "eͥgͣnͫ", bottom: "Legend", output: "Leͥgeͣnͫd" },
     { name: "Assassins", top: "sss", bottom: "Assassins", output: "Assͨaͬsͤsͤiͩns" },
     { name: "Insane", top: "ian", bottom: "Insane", output: "Inͥsaͣnͫe" },
     { name: "Sniper", top: "nie", bottom: "Sniper", output: "▄︻テSnͭiͤpͣeͫr══━一" },
     { name: "Band Create", top: "ancre", bottom: "bandcreate", output: "ᵇaͤnͨdͬcͤrͣeͭaͥtͮeͤ" },
     { name: "YouTube", top: "oue", bottom: "YouTube", output: "YͨoͬuͤTͣuͭbͤeͬ" },
     { name: "Hacker", top: "ace", bottom: "hacker", output: "haͭcͤkͣeͫr" },
     { name: "Gang", top: "ag", bottom: "gang", output: "gͨaͧnͭgͤ" },
     { name: "Stalker", top: "tak", bottom: "stalker", output: "sͩtͤaͣlͭkͪer" },
     { name: "Unique", top: "iau", bottom: "unique", output: "unͥiqͣuͫe" },
     { name: "Groot", top: "a u", bottom: " Groot", output: "ͣ ͫ Groot" },
     { name: "I Love You", top: "Iyou", bottom: "ILove", output: "ᴵLoveʸᵒᵘ" },
     { name: "I am", top: "iau", bottom: "Iam", output: "Iͥaͣmͫ" },
     { name: "Death", top: "ea", bottom: "Death", output: "꧁⁣༒Deͥⱥtͣhͫ༒꧂" },
     { name: "Unicorn", top: "ico", bottom: "Unicorn", output: "꧁⁣༒🦄UήᎥcͥorͣnͫ🦄༒꧂" },
     { name: "Beast", top: "ea", bottom: "Beast", output: "Beͥaͣsͫt" },
     { name: "Pizza God", top: "ia", bottom: "Pizza", output: "⚔️やiͥzzͣaͫᴳᵒᵈ⚔️" },
     { name: "Butter", top: "UTE", bottom: "BUTTER", output: "BͤUͯTͦTͭEͥRͨ" },
     { name: "Zelko God", top: "ea", bottom: "Zelko", output: "ϟZͥelͣkͫoᴳᵒᵈϟ" },
     { name: "Greek", top: "ee", bottom: "greek", output: "༺ 𝑔𝔯eͥeͣkͫ ༻" },
     { name: "Beast God", top: "ea", bottom: "Beast", output: "⚔️Beͥaͣsͫtᴳᵒᵈ⚔️" }
  ];
  
  return (
    <ToolLayout title="Stacked Text Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Stacked Text Generator</h1>
        <p className="text-gray-300 mb-6">
          Create unique text effects by stacking characters vertically using Unicode.
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full space-y-4">
             {/* Popular Styles Section */}
             <div>
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  Popular Styles <span className="text-yellow-400 ml-2">✨</span>
                </h2>
                <ScrollArea className="h-[150px] border border-zinc-700 rounded-lg p-3 bg-zinc-800">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {popularStyles.map((style, i) => (
                      <Badge 
                        key={i} 
                        className="bg-zinc-700 hover:bg-zinc-600 text-white cursor-pointer px-2 py-1 text-sm flex items-center justify-between"
                        onClick={() => { setTopText(style.top); setBottomText(style.bottom); }}
                      >
                        <span className="truncate">{style.output}</span>
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
             </div>

             {/* Inputs */}
             <div>
                <Label className="text-base mb-1 block font-semibold">Top Text (Overlay)</Label>
                <p className="text-xs text-gray-400 mb-2">
                  Supported: a, e, i, o, u, c, d, h, m, r, t, v, x (others become superscript)
                </p>
                <Input
                  placeholder="Enter top text"
                  className="w-full bg-zinc-700 text-white border-zinc-600 p-3 rounded"
                  value={topText}
                  onChange={(e) => setTopText(e.target.value)}
                />
             </div>
             <div>
                <Label className="text-base mb-1 block font-semibold">Bottom Text (Base)</Label>
                <Input
                  placeholder="Enter bottom text"
                  className="w-full bg-zinc-700 text-white border-zinc-600 p-3 rounded"
                  value={bottomText}
                  onChange={(e) => setBottomText(e.target.value)}
                />
             </div>

             {/* Stats Card Below Inputs */}
             <Card className="p-4 bg-zinc-800 border-zinc-700">
               <div className="flex flex-wrap gap-4">
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Base Char Count</span>
                   <span className="text-xl font-semibold">{charCount}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Base Word Count</span>
                   <span className="text-xl font-semibold">{wordCount}</span>
                 </div>
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-400">Base Line Count</span>
                   <span className="text-xl font-semibold">{lineCount}</span>
                 </div>
               </div>
             </Card>
          </div>

          {/* Output Section (Right Column) */}
          <div className="w-full">
            <div className="h-full flex flex-col"> {/* Ensure full height */}
               <Label className="text-lg mb-2 block font-semibold">Output</Label>
               <div className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded flex items-center justify-center flex-grow">
                 <p className="text-3xl font-mono break-all text-center">{outputText || "Stacked text appears here"}</p>
               </div>
              {/* Action Buttons Below Output Area */}
              <div className="flex flex-wrap gap-2 justify-end mt-auto"> {/* Use mt-auto */}
                <Button
                  variant="outline"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex-grow" // Make copy primary
                  onClick={handleCopy}
                  disabled={!outputText}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
                <Button
                  variant="outline"
                  className="border-zinc-600 bg-zinc-700 hover:bg-zinc-600 text-white"
                  onClick={handleClear}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* How it Works & Examples (Keep these sections below the grid) */}
        <Separator className="my-8 bg-zinc-700" />
        <div className="mt-8 mb-6">
           <h2 className="text-2xl font-bold mb-4">How the Stacked Text Generator Works</h2>
           {/* ... (keep existing content for how it works and examples) ... */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-gray-300 mb-4">
                  The Stacked Text Generator allows you to create multi-level text layouts where words or phrases are visually layered on top of each other. This tool is perfect for:
                </p>
                <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 pl-4">
                  <li>Crafting eye-catching titles for social media</li>
                  <li>Emphasizing key messages in presentations</li>
                  <li>Adding a modern twist to traditional text</li>
                  <li>Creating unique visual text effects</li>
                  <li>Designing custom typography for creative projects</li>
                </ul>
              </div>
              <div>
                 <Card className="bg-zinc-800 border-zinc-700">
                   <CardContent className="p-4">
                     <p className="text-amber-400 mb-2">⚠️ Limitations</p>
                     <p className="text-gray-300 text-sm">
                       This tool only works with these letters for perfect stacking: a, e, i, o, u, c, d, h, m, r, t, v, x. 
                       Other characters will appear next to the base text using superscript. This is a limitation of Unicode and available combining characters.
                     </p>
                   </CardContent>
                 </Card>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-3 flex items-center">
              <span className="mr-2">Examples</span>
              <span className="text-green-400">📝</span>
            </h3>
            <div className="border border-gray-700 rounded-lg p-3 bg-zinc-800 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {examples.map((example, i) => (
                  <div key={i} className="bg-zinc-700 rounded-md overflow-hidden">
                    <div className="p-4">
                      <p className="text-gray-400 mb-1 text-sm">Top: <span className="text-white">{example.top}</span></p>
                      <p className="text-gray-400 mb-3 text-sm">Bottom: <span className="text-white">{example.bottom}</span></p>
                      <p className="text-2xl text-center my-4">{example.output}</p>
                        <Button 
                        variant="outline" 
                        className="w-full mt-2 border-zinc-600 bg-zinc-600 text-white hover:bg-zinc-500"
                        onClick={() => { setTopText(example.top); setBottomText(example.bottom); }}
                        >
                        Try This Example
                        </Button>
                    </div>
                  </div>
                ))}
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

export default StackedTextGenerator;
