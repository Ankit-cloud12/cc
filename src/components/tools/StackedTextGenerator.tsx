import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const StackedTextGenerator = () => {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  
  // Define available combining characters (limited to specific letters as mentioned in requirements)
  const combiningChars: Record<string, string> = {
    'a': '\u0363', 'e': '\u0364', 'i': '\u0365', 'o': '\u0366', 'u': '\u0367', 
    'c': '\u0368', 'd': '\u0369', 'h': '\u036A', 'm': '\u036B', 'r': '\u036C', 
    't': '\u036D', 'v': '\u036E', 'x': '\u036F'
  };

  useEffect(() => {
    createStackedText();
  }, [topText, bottomText]);

  const createStackedText = () => {
    if (!bottomText) {
      setOutputText("");
      return;
    }

    // If no top text, just return the bottom text
    if (!topText) {
      setOutputText(bottomText);
      return;
    }

    const bottomChars = bottomText.split('');
    const topChars = topText.split('');
    let result = '';

    // For each character in bottom text
    for (let i = 0; i < bottomChars.length; i++) {
      const bottomChar = bottomChars[i];
      // Get corresponding top char, or use space if not available
      const topChar = i < topChars.length ? topChars[i] : ' ';
      
      // Add the bottom character
      result += bottomChar;
      
      // Add the top character as a combining character if available
      if (topChar !== ' ' && combiningChars[topChar.toLowerCase()]) {
        result += combiningChars[topChar.toLowerCase()];
      } else if (topChar !== ' ') {
        // If not in our combining chars list, use superscript (as fallback)
        const superscript: Record<string, string> = {
          'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ', 'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 
          'i': 'ⁱ', 'j': 'ʲ', 'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ', 'p': 'ᵖ', 
          'q': 'q', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ', 'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 
          'y': 'ʸ', 'z': 'ᶻ', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', 
          '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '+': '⁺', '-': '⁻', 
          '=': '⁼', '(': '⁽', ')': '⁾'
        };
        result += superscript[topChar.toLowerCase()] || topChar;
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
    setOutputText("");
  };

  // Basic examples for demonstration
  const examples = [
    { top: "xsx", bottom: "sxsx", output: "sͯˢxͯsx" },
    { top: "eario", bottom: "expression", output: "eͨxͬpͤrͣeͭsͥsͮiͤon" },
    { top: "aeiouc", bottom: "stacked", output: "sͣtͤiͥoͦuͧcͨked" }
  ];

  // Popular style examples
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
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-4xl font-bold mb-2">Stacked Text Generator</h1>
        <p className="text-lg opacity-90">
          Transform ordinary text into multi-layered visual designs. Perfect for designers, content creators, and digital projects.
        </p>
      </div>
      
      {/* Popular Styles Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3 flex items-center">
          <span className="mr-2">Most popular styles</span> 
          <span className="text-yellow-400">✨</span>
        </h2>
        
        <ScrollArea className="h-[180px] border border-gray-700 rounded-lg p-3 bg-zinc-800">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {popularStyles.map((style, i) => (
              <Badge 
                key={i} 
                className="bg-zinc-700 hover:bg-zinc-600 text-white cursor-pointer px-3 py-2 text-base flex items-center justify-between"
                onClick={() => {
                  setTopText(style.top);
                  setBottomText(style.bottom);
                }}
              >
                <span className="truncate">{style.output}</span>
              </Badge>
            ))}
          </div>
        </ScrollArea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="text-lg mb-2 block font-semibold">Top Text (Overlay)</Label>
          <p className="text-sm text-gray-400 mb-2">
            Supported characters: a, e, i, o, u, c, d, h, m, r, t, v, x
          </p>
          <Input
            placeholder="Enter top text (will be overlaid)"
            className="w-full bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
            value={topText}
            onChange={(e) => setTopText(e.target.value)}
          />

          <Label className="text-lg mb-2 block font-semibold">Bottom Text (Base)</Label>
          <Input
            placeholder="Enter bottom text (base layer)"
            className="w-full bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
            value={bottomText}
            onChange={(e) => setBottomText(e.target.value)}
          />
        </div>

        <div>
          <Label className="text-lg mb-2 block font-semibold">Output</Label>
          <div className="w-full min-h-[100px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded flex items-center justify-center">
            <p className="text-3xl font-mono break-all">{outputText}</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700 text-white flex-grow"
              onClick={handleCopy}
              disabled={!outputText}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button
              variant="outline"
              className="border-zinc-600 text-white"
              onClick={handleClear}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-8" />

      <div className="mt-8 mb-12">
        <h2 className="text-2xl font-bold mb-4">How the Stacked Text Generator Works</h2>
        
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
            <h3 className="text-xl font-bold mb-4">How to Use</h3>
            <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-1 pl-4">
              <li>Enter your desired text in the "Bottom Text" field (this is your base layer)</li>
              <li>Add characters in the "Top Text" field to overlay on top of the bottom text</li>
              <li>The overlaid text will appear in the output field</li>
              <li>Add spaces in the top text to skip characters in the bottom text</li>
              <li>Copy the result with one click and use it anywhere unicode text is supported</li>
              <li>Or choose from our popular styles to get started quickly</li>
            </ol>
            
            <Card className="bg-zinc-800 border-zinc-700 mt-4">
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
                  <p className="text-gray-400 mb-1 text-sm">Top Text: <span className="text-white">{example.top}</span></p>
                  <p className="text-gray-400 mb-3 text-sm">Bottom Text: <span className="text-white">{example.bottom}</span></p>
                  <p className="text-2xl text-center my-4">{example.output}</p>
                    <Button 
                    variant="outline" 
                    className="w-full mt-2 border-zinc-600 text-black hover:bg-zinc-600 hover:text-white"
                    onClick={() => {
                      setTopText(example.top);
                      setBottomText(example.bottom);
                    }}
                    >
                    Try This Example
                    </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <Card className="bg-zinc-800 border-zinc-700 mt-4">
          <CardContent className="p-4">
            <p className="text-gray-300">
              Start creating eye-catching stacked text today and make your digital content stand out from the crowd!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StackedTextGenerator;
