import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "./ToolLayout";

const FacebookFontGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [outputText, setOutputText] = useState("");

  const fontStyles = {
    "Normal Text": (text: string) => text,
    Enclosed: (text: string) => {
      const enclosedMap = {
        a: "🅐", b: "🅑", c: "🅒", d: "🅓", e: "🅔", f: "🅕", g: "🅖", h: "🅗", i: "🅘", j: "🅙",
        k: "🅚", l: "🅛", m: "🅜", n: "🅝", o: "🅞", p: "🅟", q: "🅠", r: "🅡", s: "🅢", t: "🅣",
        u: "🅤", v: "🅥", w: "🅦", x: "🅧", y: "🅨", z: "🅩",
        A: "🅐", B: "🅑", C: "🅒", D: "🅓", E: "🅔", F: "🅕", G: "🅖", H: "🅗", I: "🅘", J: "🅙",
        K: "🅚", L: "🅛", M: "🅜", N: "🅝", O: "🅞", P: "🅟", Q: "🅠", R: "🅡", S: "🅢", T: "🅣",
        U: "🅤", V: "🅥", W: "🅦", X: "🅧", Y: "🅨", Z: "🅩",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨"
      };
      return text.split("").map((char) => enclosedMap[char] || char).join("");
    },
    "Full Width": (text: string) => {
      const fullWidthMap = {
        " ": "　", "!": "！", '"': "＂", "#": "＃", $: "＄", "%": "％", "&": "＆", "'": "＇",
        "(": "（", ")": "）", "*": "＊", "+": "＋", ",": "，", "-": "－", ".": "．", "/": "／",
        "0": "０", "1": "１", "2": "２", "3": "３", "4": "４", "5": "５", "6": "６", "7": "７", "8": "８", "9": "９",
        ":": "：", ";": "；", "<": "＜", "=": "＝", ">": "＞", "?": "？", "@": "＠",
        A: "Ａ", B: "Ｂ", C: "Ｃ", D: "Ｄ", E: "Ｅ", F: "Ｆ", G: "Ｇ", H: "Ｈ", I: "Ｉ", J: "Ｊ",
        K: "Ｋ", L: "Ｌ", M: "Ｍ", N: "Ｎ", O: "Ｏ", P: "Ｐ", Q: "Ｑ", R: "Ｒ", S: "Ｓ", T: "Ｔ",
        U: "Ｕ", V: "Ｖ", W: "Ｗ", X: "Ｘ", Y: "Ｙ", Z: "Ｚ",
        "[": "［", "\\": "＼", "]": "］", "^": "＾", _: "＿", "`": "｀",
        a: "ａ", b: "ｂ", c: "ｃ", d: "ｄ", e: "ｅ", f: "ｆ", g: "ｇ", h: "ｈ", i: "ｉ", j: "ｊ",
        k: "ｋ", l: "ｌ", m: "ｍ", n: "ｎ", o: "ｏ", p: "ｐ", q: "ｑ", r: "ｒ", s: "ｓ", t: "ｔ",
        u: "ｕ", v: "ｖ", w: "ｗ", x: "ｘ", y: "ｙ", z: "ｚ",
        "{": "｛", "|": "｜", "}": "｝", "~": "～"
      };
      return text.split("").map((char) => fullWidthMap[char] || char).join("");
    },
    "Script Math": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d49c;
      const baseStartLower = 0x1d4b6;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(baseStartUpper + (charCode - baseOffset));
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7d0 + (charCode - 48));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Bold Sans": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d5d4;
      const baseStartLower = 0x1d5ee;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(0x1d5d4 + (charCode - 65));
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(0x1d5ee + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7ec + (charCode - 48));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Small Caps": (text: string) => {
      const smallCapsMap = {
        a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ꜰ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
        k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "Q", r: "ʀ", s: "s", t: "ᴛ",
        u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ"
      };
      return text.split("").map((char) => smallCapsMap[char.toLowerCase()] || char).join("");
    }
  };

  const generateFonts = (text: string) => {
    let generatedText = "";
    for (const styleName in fontStyles) {
      generatedText += fontStyles[styleName](text) + "\n";
    }
    setOutputText(generatedText);
  };

  return (
    <ToolLayout title="Facebook Font Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Facebook Font Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Convert your text into various stylish Facebook fonts and symbols.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder="Type or paste your content here"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                generateFonts(e.target.value);
              }}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
          </div>
          
          <div className="w-full md:w-1/2 space-y-2">
            <Textarea
              readOnly
              placeholder="Styled text will appear here"
              value={outputText}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(outputText);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  } catch (err) {
                    console.error("Failed to copy text: ", err);
                  }
                }}
                disabled={!outputText}
                className="border-zinc-600"
              >
                {copied ? "Copied!" : "Copy Output"}
              </Button>
              
              <Button 
                onClick={() => {
                  setInputText("");
                  setOutputText("");
                }}
                className="border-zinc-600"
                variant="outline"
              >
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default FacebookFontGenerator;
