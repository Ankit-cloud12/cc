import React, { useState, useEffect } from "react";
import { ToolLayout } from "./ToolLayout";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Card } from "@/components/ui/card"; // Import Card
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs
import { Copy, Check } from "lucide-react"; // Import icons
import { ScrollArea } from "@/components/ui/scroll-area"; // Import ScrollArea

// Helper function for character mapping
const mapChars = (text: string, charMap: Record<string, string>): string => {
  return text.split("").map((char) => charMap[char.toLowerCase()] || charMap[char.toUpperCase()] || char).join("");
};

// Helper function for offset-based fonts
const mapCharsOffset = (text: string, upperOffset: number, lowerOffset: number, digitOffset?: number): string => {
  let output = "";
  for (let i = 0; i < text.length; i++) {
    let charCode = text.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) { // Uppercase A-Z
      output += String.fromCodePoint(charCode + upperOffset);
    } else if (charCode >= 97 && charCode <= 122) { // Lowercase a-z
      output += String.fromCodePoint(charCode + lowerOffset);
    } else if (digitOffset && charCode >= 48 && charCode <= 57) { // Digits 0-9
        output += String.fromCodePoint(charCode + digitOffset);
    } else {
      output += text[i];
    }
  }
  return output;
};

// --- Font Styles Definitions --- (Keep existing styles, ensure consistency)
const fontStyles: { [key: string]: (text: string) => string } = {
  "Normal Text": (text: string) => text,
  "Bold Sans": (text: string) => mapCharsOffset(text, 0x1D5A0 - 65, 0x1D5BA - 97, 0x1D7EC - 48),
  "Italic Sans": (text: string) => mapCharsOffset(text, 0x1D608 - 65, 0x1D622 - 97),
  "Bold Italic Sans": (text: string) => mapCharsOffset(text, 0x1D63C - 65, 0x1D656 - 97),
  "Script": (text: string) => mapCharsOffset(text, 0x1D49C - 65, 0x1D4B6 - 97),
  "Bold Script": (text: string) => mapCharsOffset(text, 0x1D4D0 - 65, 0x1D4EA - 97),
  "Fraktur": (text: string) => mapCharsOffset(text, 0x1D504 - 65, 0x1D51E - 97),
  "Bold Fraktur": (text: string) => mapCharsOffset(text, 0x1D56C - 65, 0x1D586 - 97),
  "Monospace": (text: string) => mapCharsOffset(text, 0x1D670 - 65, 0x1D68A - 97, 0x1D7F6 - 48),
  "Double Struck": (text: string) => mapCharsOffset(text, 0x1D538 - 65, 0x1D552 - 97, 0x1D7D8 - 48),
  "Circled": (text: string) => mapChars(text, { a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ", i: "ⓘ", j: "ⓙ", k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ", q: "ⓠ", r: "ⓡ", s: "ⓢ", t: "ⓣ", u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ", y: "ⓨ", z: "ⓩ", A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", D: "Ⓓ", E: "Ⓔ", F: "Ⓕ", G: "Ⓖ", H: "Ⓗ", I: "Ⓘ", J: "Ⓙ", K: "Ⓚ", L: "Ⓛ", M: "Ⓜ", N: "Ⓝ", O: "Ⓞ", P: "Ⓟ", Q: "Ⓠ", R: "Ⓡ", S: "Ⓢ", T: "Ⓣ", U: "Ⓤ", V: "Ⓥ", W: "Ⓦ", X: "Ⓧ", Y: "Ⓨ", Z: "Ⓩ" }),
  "Negative Circled": (text: string) => mapChars(text, { a: "🅐", b: "🅑", c: "🅒", d: "🅓", e: "🅔", f: "🅕", g: "🅖", h: "🅗", i: "🅘", j: "🅙", k: "🅚", l: "🅛", m: "🅜", n: "🅝", o: "🅞", p: "🅟", q: "🅠", r: "🅡", s: "🅢", t: "🅣", u: "🅤", v: "🅥", w: "🅦", x: "🅧", y: "🅨", z: "🅩", A: "🅐", B: "🅑", C: "🅒", D: "🅓", E: "🅔", F: "🅕", G: "🅖", H: "🅗", I: "🅘", J: "🅙", K: "🅚", L: "🅛", M: "🅜", N: "🅝", O: "🅞", P: "🅟", Q: "🅠", R: "🅡", S: "🅢", T: "🅣", U: "🅤", V: "🅥", W: "🅦", X: "🅧", Y: "🅨", Z: "🅩" }),
  "Squared": (text: string) => mapChars(text, { a: "🄰", b: "🄱", c: "🄲", d: "🄳", e: "🄴", f: "🄵", g: "🄶", h: "🄷", i: "🄸", j: "🄹", k: "🄺", l: "🄻", m: "🄼", n: "🄽", o: "🄾", p: "🄿", q: "🅀", r: "🅁", s: "🅂", t: "🅃", u: "🅄", v: "🅅", w: "🅆", x: "🅇", y: "🅈", z: "🅉", A: "🅰", B: "🅱", C: "🅲", D: "🅳", E: "🅴", F: "🅵", G: "🅶", H: "🅷", I: "🅸", J: "🅹", K: "🅺", L: "🅻", M: "🅼", N: "🅽", O: "🅾", P: "🅿", Q: "🆀", R: "🆁", S: "🆂", T: "🆃", U: "🆄", V: "🆅", W: "🆆", X: "🆇", Y: "🆈", Z: "🆉" }),
  "Negative Squared": (text: string) => mapChars(text, { a: "🅰", b: "🅱", c: "🅲", d: "🅳", e: "🅴", f: "🅵", g: "🅶", h: "🅷", i: "🅸", j: "🅹", k: "🅺", l: "🅻", m: "🅼", n: "🅽", o: "🅾", p: "🅿", q: "🆀", r: "🆁", s: "🆂", t: "🆃", u: "🆄", v: "🆅", w: "🆆", x: "🆇", y: "🆈", z: "🆉", A: "🅰", B: "🅱", C: "🅲", D: "🅳", E: "🅴", F: "🅵", G: "🅶", H: "🅷", I: "🅸", J: "🅹", K: "🅺", L: "🅻", M: "🅼", N: "🅽", O: "🅾", P: "🅿", Q: "🆀", R: "🆁", S: "🆂", T: "🆃", U: "🆄", V: "🆅", W: "🆆", X: "🆇", Y: "🆈", Z: "🆉" }),
  "Small Caps": (text: string) => mapChars(text.toLowerCase(), { a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ", k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ", u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ" }),
  "Wide Text": (text: string) => mapChars(text, { " ": "　", "!": "！", '"': "＂", "#": "＃", $: "＄", "%": "％", "&": "＆", "'": "＇", "(": "（", ")": "）", "*": "＊", "+": "＋", ",": "，", "-": "－", ".": "．", "/": "／", "0": "０", "1": "１", "2": "２", "3": "３", "4": "４", "5": "５", "6": "６", "7": "７", "8": "８", "9": "９", ":": "：", ";": "；", "<": "＜", "=": "＝", ">": "＞", "?": "？", "@": "＠", A: "Ａ", B: "Ｂ", C: "Ｃ", D: "Ｄ", E: "Ｅ", F: "Ｆ", G: "Ｇ", H: "Ｈ", I: "Ｉ", J: "Ｊ", K: "Ｋ", L: "Ｌ", M: "Ｍ", N: "Ｎ", O: "Ｏ", P: "Ｐ", Q: "Ｑ", R: "Ｒ", S: "Ｓ", T: "Ｔ", U: "Ｕ", V: "Ｖ", W: "Ｗ", X: "Ｘ", Y: "Ｙ", Z: "Ｚ", "[": "［", "\\": "＼", "]": "］", "^": "＾", _: "＿", "`": "｀", a: "ａ", b: "ｂ", c: "ｃ", d: "ｄ", e: "ｅ", f: "ｆ", g: "ｇ", h: "ｈ", i: "ｉ", j: "ｊ", k: "ｋ", l: "ｌ", m: "ｍ", n: "ｎ", o: "ｏ", p: "ｐ", q: "ｑ", r: "ｒ", s: "ｓ", t: "ｔ", u: "ｕ", v: "ｖ", w: "ｗ", x: "ｘ", y: "ｙ", z: "ｚ", "{": "｛", "|": "｜", "}": "｝", "~": "～" }),
  "Strikethrough": (text: string) => text.split("").map(char => char + '\u0336').join(""),
  "Upside Down": (text: string) => mapChars(text.split('').reverse().join(''), { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', A: '∀', B: '𐐒', C: 'Ɔ', D: 'ᗡ', E: 'Ǝ', F: 'Ⅎ', G: 'פ', H: 'H', I: 'I', J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Q', R: 'ɹ', S: 'S', T: '┴', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z', '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6', '.': '˙', ',': "'", '?': '¿', '!': '¡', "'": ',', '"': '„', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', '_': '‾' }),
};
// --- End Font Styles ---

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Instagram Font Generator</h3>
    <p className="mb-4">
      Elevate your Instagram presence with unique and stylish fonts! Our Instagram Font Generator converts your standard text into a wide array of cool fonts using special Unicode characters.
    </p>
    <p className="mb-4">
      Use these fancy fonts in your Instagram bio, captions, stories, comments, and even your profile name to grab attention and express your personality. Choose from styles like bold, italic, cursive, gothic (Fraktur), monospace, bubble text, and many more.
    </p>
     <p className="mb-4">
      Because these styles use Unicode symbols, they can be easily copied and pasted directly into the Instagram app (and other platforms like Twitter, Facebook, TikTok) without needing any special apps or keyboards.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">instagram font generator, cool instagram fonts, fancy text instagram, instagram bio fonts, instagram caption fonts, unicode text generator, copy paste fonts, stylish text generator, ig fonts</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Instagram Font Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to style (e.g., your bio, a caption) into the input box on the left.</li>
      <li><strong>Browse Styles:</strong> The output box on the right will instantly show your text converted into numerous different font styles. Scroll down to see all options.</li>
      <li><strong>Copy Your Favorite:</strong> Find a font style you like and click the "Copy" button next to it.</li>
      <li><strong>Paste on Instagram:</strong> Open the Instagram app, go to where you want to use the font (e.g., Edit Profile for bio, create a new post for caption), and paste the copied text.</li>
      <li><strong>Download Input:</strong> Use the "Download Input" button to save your original text if needed.</li>
      <li><strong>Clear:</strong> Click "Clear" to easily start over with new text.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Note: While these Unicode fonts work in most places on Instagram, their appearance might vary slightly depending on the device or operating system. Some very complex styles might not render perfectly everywhere.
    </p>
  </>
);


const InstagramFontGenerator = () => {
  const [inputText, setInputText] = useState("");
  // Store generated fonts as an array of objects
  const [generatedFonts, setGeneratedFonts] = useState<{ name: string; text: string }[]>([]);
  const [copiedStyle, setCopiedStyle] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("about"); // For About/Usage tabs

  // Statistics state
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  // Update stats and generate fonts on input change
  useEffect(() => {
    generateAndCount(inputText);
  }, [inputText]);

  // Combined function to generate fonts and count stats
  const generateAndCount = (text: string) => {
    if (!text) {
      setGeneratedFonts([]);
      setCharCount(0);
      setWordCount(0);
      setLineCount(0);
      return;
    }
    // Generate array of {name, text} objects
    const styles = Object.entries(fontStyles).map(([name, styleFunc]) => ({
      name: name,
      text: styleFunc(text),
    }));
    setGeneratedFonts(styles);

    // Count stats based on input text
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    setLineCount(text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).length);
  };

  // Handles copying individual font styles
  const handleCopy = async (textToCopy: string, styleName: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedStyle(styleName);
      setTimeout(() => setCopiedStyle(null), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopiedStyle("error"); // Indicate error briefly
      setTimeout(() => setCopiedStyle(null), 1500);
    }
  };

  // Clear handler
  const handleClear = () => {
    setInputText("");
  };

  // Download handler - Downloads the *input* text
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([inputText], { type: "text/plain;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "instagram-input.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };


  return (
    <ToolLayout title="Instagram Font Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Instagram Font Generator</h1>
        <p className="text-gray-300 mb-6">
          Create cool and stylish fonts for your Instagram bio, captions, and comments.
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full flex flex-col">
            <Textarea
              placeholder="Type or paste your text here..."
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
             <div className="output-fonts-container bg-zinc-700 rounded-lg border border-zinc-600 h-[300px] mb-4"> 
                <ScrollArea className="h-full w-full"> 
                  {generatedFonts.length > 0 ? (
                    <div className="space-y-2 p-3"> 
                      {generatedFonts.map((font) => (
                        <div key={font.name} className="font-style-item flex items-center justify-between gap-2 p-2 bg-zinc-800 rounded"> 
                          <p className="text-white break-words text-sm flex-grow" style={{ fontFamily: font.name.includes("Script") || font.name.includes("Cursive") ? 'cursive' : 'inherit' }}>
                            {font.text || <span className="text-gray-500 italic">N/A</span>}
                          </p>
                          <Button
                            variant="ghost"
                            size="sm" 
                            className="h-8 px-2 text-gray-400 hover:text-white hover:bg-zinc-600 flex-shrink-0 flex items-center gap-1" 
                            onClick={() => handleCopy(font.text, font.name)}
                            aria-label={`Copy ${font.name} style`}
                          >
                            {copiedStyle === font.name ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                            <span className="text-xs">Copy</span> 
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-500 italic p-4">
                      {inputText ? "Generating styles..." : "Output styles will appear here"}
                    </div>
                  )}
                </ScrollArea>
             </div>
             {/* Action Buttons Below Output Area */}
             <div className="flex flex-wrap gap-2 justify-end mt-auto"> 
               <Button
                 variant="outline"
                 onClick={handleDownload}
                 disabled={!inputText}
                 className="border-zinc-600 bg-zinc-700 hover:bg-zinc-600"
               >
                 Download Input
               </Button>
               <Button
                 variant="outline"
                 onClick={handleClear}
                 className="border-zinc-600 bg-zinc-700 hover:bg-zinc-600"
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

export default InstagramFontGenerator;
