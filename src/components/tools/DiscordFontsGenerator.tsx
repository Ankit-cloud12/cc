import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "./ToolLayout";

const fontStyles = [
  { name: "Normal", convert: (t: string) => t },
  {
    name: "Bold",
    convert: (t: string) => {
      const boldChars: { [key: string]: string } = {
        a: "𝗮", b: "𝗯", c: "𝗰", d: "𝗱", e: "𝗲", f: "𝗳", g: "𝗴", h: "𝗵", i: "𝗶", j: "𝗷",
        k: "𝗸", l: "𝗹", m: "𝗺", n: "𝗻", o: "𝗼", p: "𝗽", q: "𝗾", r: "𝗿", s: "𝘀", t: "𝘁",
        u: "𝘂", v: "𝘃", w: "𝘄", x: "𝘅", y: "𝘆", z: "𝘇",
        A: "𝗔", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝",
        K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧",
        U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
        "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰", "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵",
      };
      return t
        .split("")
        .map((char) => boldChars[char] || char)
        .join("");
    },
  },
  {
    name: "Italic",
    convert: (t: string) => {
      const italicChars: { [key: string]: string } = {
        a: "𝘢", b: "𝘣", c: "𝘤", d: "𝘥", e: "𝘦", f: "𝘧", g: "𝘨", h: "𝘩", i: "𝘪", j: "𝘫",
        k: "𝘬", l: "l", m: "𝘮", n: "𝘯", o: "𝘰", p: "𝘱", q: "𝘲", r: "𝘳", s: "𝘴", t: "𝘵",
        u: "𝘶", v: "𝘷", w: "𝘸", x: "𝘹", y: "𝘺", z: "𝘻",
        A: "𝘈", B: "𝘉", C: "𝘊", D: "𝘋", E: "𝘌", F: "𝘍", G: "𝘎", H: "𝘏", I: "𝘐", J: "𝘑",
        K: "𝘒", L: "𝘓", M: "𝘔", N: "𝘕", O: "𝘖", P: "𝘗", Q: "𝘘", R: "𝘙", S: "𝘚", T: "𝘛",
        U: "𝘜", V: "𝘝", W: "𝘞", X: "𝘟", Y: "𝘠", Z: "𝘡",
      };
      return t
        .split("")
        .map((char) => italicChars[char] || char)
        .join("");
    },
  },
  {
    name: "Bold Italic",
    convert: (t: string) => {
      const boldItalicChars: { [key: string]: string } = {
        a: "𝙖", b: "𝙗", c: "𝙘", d: "𝙙", e: "𝙚", f: "𝙛", g: "𝙜", h: "𝙝", i: "𝙞", j: "𝙟",
        k: "𝙠", l: "𝙡", m: "𝙢", n: "𝙣", o: "𝙤", p: "𝙥", q: "𝙦", r: "𝙧", s: "𝙨", t: "𝙩",
        u: "𝙪", v: "𝙫", w: "𝙬", x: "𝙭", y: "𝙮", z: "𝙯",
        A: "𝘼", B: "𝘽", C: "𝘾", D: "𝗗", E: "𝗘", F: "𝙁", G: "𝙂", H: "𝗛", I: "𝙄", J: "𝙅",
        K: "𝙆", L: "𝙇", M: "𝙈", N: "𝗡", O: "𝗢", P: "Პ", Q: "𝙌", R: "𝙍", S: "𝙎", T: "𝙏",
        U: "𝙐", V: "𝙑", W: "𝙒", X: "𝙓", Y: "𝙔", Z: "𝙕",
      };
      return t
        .split("")
        .map((char) => boldItalicChars[char] || char)
        .join("");
    },
  },
  {
    name: "Red Square",
    convert: (t: string) => {
      const redSquareChars: { [key: string]: string } = {
        a: "🅐", b: "🅑", c: "🅒", d: "🅓", e: "🅔", f: "🅕", g: "🅖", h: "🅗", i: "🅘", j: "🅙",
        k: "🅚", l: "🅛", m: "🅜", n: "🅝", o: "🅞", p: "🅟", q: "🅠", r: "🅡", s: "🅢", t: "🅣",
        u: "🅤", v: "🅥", w: "🅦", x: "🅧", y: "🅨", z: "🅩",
        A: "🅐", B: "🅑", C: "🅒", D: "🅓", E: "🅔", F: "🅕", G: "🅖", H: "🅗", I: "🅘", J: "🅙",
        K: "🅚", L: "🅛", M: "🅜", N: "🅝", O: "🅞", P: "🅟", Q: "🅠", R: "🅡", S: "🅢", T: "🅣",
        U: "🅤", V: "🅥", W: "🅦", X: "🅧", Y: "🅨", Z: "🅩",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
      };
      return t
        .split("")
        .map((char) => redSquareChars[char] || char)
        .join("");
    },
  },
  {
    name: "Blue Square",
    convert: (t: string) => {
      const blueSquareChars: { [key: string]: string } = {
        a: "🅰", b: "🅱", c: "🅲", d: "🅳", e: "🅴", f: "🅵", g: "🅶", h: "🅷", i: "🅸", j: "🅹",
        k: "🅺", l: "🅻", m: "🅼", n: "🅽", o: "🅾", p: "🅿", q: "🆀", r: "🆁", s: "🆂", t: "🆃",
        u: "🆄", v: "🆅", w: "🆆", x: "🆇", y: "🆈", z: "🆉",
        A: "🅰", B: "🅱", C: "🅲", D: "🅳", E: "🅴", F: "🅵", G: "🅶", H: "🅷", I: "🅸", J: "🅹",
        K: "🅺", L: "🅻", M: "🅼", N: "🅽", O: "🅾", P: "🅿", Q: "🆀", R: "🆁", S: "🆂", T: "🆃",
        U: "🆄", V: "🆅", W: "🆆", X: "🆇", Y: "🆈", Z: "🆉",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
      };
      return t
        .split("")
        .map((char) => blueSquareChars[char] || char)
        .join("");
    },
  },
  {
    name: "White Square",
    convert: (t: string) => {
      const whiteSquareChars: { [key: string]: string } = {
        a: "🄰", b: "🄱", c: "🄲", d: "🄳", e: "🄴", f: "🄵", g: "🄶", h: "🄷", i: "🄸", j: "🄹",
        k: "🄺", l: "🄻", m: "🄼", n: "🄽", o: "🄾", p: "🄿", q: "🅀", r: "🅁", s: "🅂", t: "🅃",
        u: "🅄", v: "🅅", w: "🅆", x: "🅇", y: "🅈", z: "🅉",
        A: "🄰", B: "🄱", C: "🄲", D: "🄳", E: "🄴", F: "🄵", G: "🄶", H: "🄷", I: "🄸", J: "🄹",
        K: "🄺", L: "🄻", M: "🄼", N: "🄽", O: "🄾", P: "🄿", Q: "🅀", R: "🅁", S: "🅂", T: "🅃",
        U: "🅄", V: "🅅", W: "🅆", X: "🅇", Y: "🅈", Z: "🅉",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
      };
      return t
        .split("")
        .map((char) => whiteSquareChars[char] || char)
        .join("");
    },
  },
  {
    name: "Fancy",
    convert: (t: string) => {
      const fancyChars: { [key: string]: string } = {
        "a": "𝒯", "b": "₱", "c": "Ɇ", "d": "Ø", "e": "Ɽ", "f": "₱", "g": "₳", "h": "₴", "i": "₮", "j": "Ɇ",
        "k": "Ɏ", "l": "Ø", "m": "Ʉ", "n": "Ɽ", "o": "₵", "p": "Ø", "q": "₦", "r": "₮", "s": "Ɇ", "t": "₦",
        "u": "₮", "v": "Ⱨ", "w": "Ɇ", "x": "Ɽ", "y": "Ɇ", "z": "Ɏ",
        "A": "𝒯", "B": "₱", "C": "Ɇ", "D": "Ø", "E": "Ɽ", "F": "₱", "G": "₳", "H": "₴", "I": "₮", "J": "Ɇ",
        "K": "Ɏ", "L": "Ø", "M": "Ʉ", "N": "Ɽ", "O": "₵", "P": "Ø", "Q": "₦", "R": "₮", "S": "Ɇ", "T": "₦",
        "U": "₮", "V": "𝕍", "W": "Ɇ", "X": "Ɽ", "Y": "Ɇ", "Z": "Ɏ"
      };

      let newText = "";
      let upperCaseToggle = true;

      for (const char of t) {
        if (/[a-zA-Z]/.test(char)) {
          const convertedChar =
            fancyChars[upperCaseToggle ? char.toUpperCase() : char.toLowerCase()] ||
            char;
          newText += convertedChar;
          upperCaseToggle = !upperCaseToggle;
        } else {
          newText += char;
        }
      }
      return newText;
    },
  },
  {
    name: "Typewriter",
    convert: (t: string) => {
      const typewriterChars = {
        a: "𝙏", b: "𝙮", c: "𝙥", d: "𝙚", e: " ", f: "𝙤", g: "𝙧", h: " ", i: "𝙥", j: "𝙖",
        k: "𝙨", l: "𝙩", m: "𝙚", n: " ", o: "𝙮", p: "𝙤", q: "𝙪", r: "𝙧", s: " ",
        t: "𝙘", u: "𝙤", v: "𝙣", w: "𝙩", x: "𝙚", y: "𝙣", z: "𝙩",
        A: "𝙏", B: "𝙮", C: "𝙥", D: "𝙚", E: " ", F: "𝙤", G: "𝙧", H: " ", I: "𝙥", J: "𝙖",
        K: "𝙨", L: "𝙩", M: "𝙚", N: " ", O: "𝙮", P: "𝙤", Q: "𝙪", R: "𝙧", S: " ",
        T: "𝙘", U: "𝙤", V: "𝙣", W: "𝙩", X: "𝙚", Y: "𝙣", Z: "𝙩",
        "0": " ", "1": " ", "2": " ", "3": " ", "4": " ", "5": " ", "6": " ", "7": " ", "8": " ", "9": " ",
        ".": " ", ",": " ", ":": " ", ";": " ", "'": " ", '"': " ", "`": " ",
        "!": " ", "?": " ", "/": " ", "\\": " ", "(": " ", ")": " ", "[": " ", "]": " ", "{": " ", "}": " ",
        "<": " ", ">": " ", "|": " ", "-": " ", "_": " ", "+": " ", "=": " ", "*": " ", "&": " ", "^": " ",
        "%": " ", "$": " ", "#": "@", "~": " "
      };
      return t
        .split("")
        .map((char) => typewriterChars[char] || char)
        .join("");
    },
  },
  {
    name: "Bold Script",
    convert: (t: string) => {
      const boldScriptChars = {
        a: "𝒶", b: "𝒷", c: "𝒸", d: "𝒹", e: "ℯ", f: "𝒻", g: "𝑔", h: "𝒽", i: "𝒾", j: "𝒿",
        k: "𝓀", l: "𝓁", m: "𝓂", n: "𝓃", o: "ℴ", p: "𝓅", q: "𝓆", r: "𝓇", s: "𝓈", t: "𝓉",
        u: "𝓊", v: "𝓋", w: "𝓌", x: "𝓍", y: "𝓎", z: "𝓏",
        A: "𝒜", B: "ℬ", C: "𝒞", D: "𝒟", E: "ℰ", F: "ℱ", G: "𝒢", H: "ℋ", I: "ℐ", J: "𝒥",
        K: "𝒦", L: "ℒ", M: "ℳ", N: "𝒩", O: "𝒪", P: "𝒫", Q: "𝒬", R: "ℛ", S: "𝒮", T: "𝒯",
        U: "𝒰", V: "𝒱", W: "𝒲", X: "𝒳", Y: "𝒴", Z: "𝒵",
      };
      return t
        .split("")
        .map((char) => boldScriptChars[char] || char)
        .join("");
    },
  },
  {
    name: "Bold Sans Serif",
    convert: (t: string) => {
      const boldSansSerifChars = {
        a: "𝗧", b: "𝗕", c: "𝗖", d: "𝗗", e: "𝗘", f: "𝗙", g: "𝗚", h: "𝗛", i: "𝗜", j: "𝗝",
        k: "𝗞", l: "𝗟", m: "𝗠", n: "𝗡", o: "𝗢", p: "𝗣", q: "𝗤", r: "𝗥", s: "𝗦", t: "𝗧",
        u: "𝗨", v: "𝗩", w: "𝗪", x: "𝗫", y: "𝗬", z: "𝗭",
        A: "𝗧", B: "𝗕", C: "𝗖", D: "𝗗", E: "𝗘", F: "𝗙", G: "𝗚", H: "𝗛", I: "𝗜", J: "𝗝",
        K: "𝗞", L: "𝗟", M: "𝗠", N: "𝗡", O: "𝗢", P: "𝗣", Q: "𝗤", R: "𝗥", S: "𝗦", T: "𝗧",
        U: "𝗨", V: "𝗩", W: "𝗪", X: "𝗫", Y: "𝗬", Z: "𝗭",
        "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯", "4": "𝟰", "5": "𝟱", "6": "𝟲", "7": "𝟳", "8": "𝟴", "9": "𝟵",
      };
      return t
        .split("")
        .map((char) => boldSansSerifChars[char] || char)
        .join("");
    },
  },
  {
    name: "Rounded Sans Serif",
    convert: (t: string) => {
      const roundedSansSerifChars = {
        a: "🅐", b: "🅑", c: "🅒", d: "🅓", e: "🅔", f: "🅕", g: "🅖", h: "🅗", i: "🅘", j: "🅙",
        k: "🅚", l: "🅛", m: "🅜", n: "🅝", o: "🅞", p: "🅟", q: "🅠", r: "🅡", s: "🅢", t: "🅣",
        u: "🅤", v: "🅥", w: "🅦", x: "🅧", y: "🅨", z: "🅩",
        A: "🅐", B: "🅑", C: "🅒", D: "🅓", E: "🅔", F: "🅕", G: "🅖", H: "🅗", I: "🅘", J: "🅙",
        K: "🅚", L: "🅛", M: "🅜", N: "🅝", O: "🅞", P: "🅟", Q: "🅠", R: "🅡", S: "🅢", T: "🅣",
        U: "🅤", V: "🅥", W: "🅦", X: "🅧", Y: "🅨", Z: "🅩",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
      };
      return t
        .split("")
        .map((char) => roundedSansSerifChars[char] || char)
        .join("");
    },
  },
  {
    name: "Block and Square Serif",
    convert: (t: string) => {
      const blockSquareSerifChars: { [key: string]: string } = {
        a: "🄰", b: "🄱", c: "🄲", d: "🄳", e: "🄴", f: "🄵", g: "🄶", h: "🄷", i: "🄸", j: "🄹",
        k: "🄺", l: "🄻", m: "🄼", n: "🄽", o: "🄾", p: "🄿", q: "🅀", r: "🅁", s: "🅂", t: "🅃",
        u: "🅄", v: "🅅", w: "🅆", x: "🅇", y: "🅈", z: "🅉",
        A: "🅑", B: "🅒", C: "🄳", D: "🄴", E: "🄵", F: "🄶", G: "🄷", H: "🄸", I: "🄹", J: "🄺",
        K: "🄻", L: "🄼", M: "🄽", N: "🄾", O: "🄿", P: "🅀", Q: "🅁", R: "🅂", S: "🅃", T: "🅄",
        U: "🅅", V: "🅆", W: "🅇", X: "🅈", Y: "🅉", Z: "🄰",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨"
      };
      return t
        .split("")
        .map((char) => blockSquareSerifChars[char] || char)
        .join("");
    },
  },
  {
    name: "Minimal Serif",
    convert: (t: string) => {
      const minimalSerifChars: { [key: string]: string } = {
        a: "T", b: "P"
      };
      return t
        .split("")
        .map((char) => minimalSerifChars[char] || char)
        .join("");
    },
  }
];

const DiscordFontsGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState<
    { name: string; text: string }[]
  >([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateFonts(inputText);
  }, [inputText]);

  const generateFonts = (text: string) => {
    console.log("Input Text:", text);
    if (!text) {
      setOutputText([]);
      console.log("Output Text (empty):", []);
      return;
    }

    const convertedFonts = fontStyles.map((font) => ({
      name: font.name,
      text: font.convert(text),
    }));
    setOutputText(convertedFonts);
    console.log("Output Text:", convertedFonts);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for browsers that do not support navigator.clipboard
      // You can use document.execCommand('copy') for wider browser support but it's deprecated.
    }
  };


  return (
    <ToolLayout title="Discord Fonts Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Discord Fonts Generator</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Input Text</h2>
            <Textarea
              placeholder="Type or paste your content here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="mb-4 min-h-[300px]"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Output Text</h2>
            <Textarea
              readOnly
              value={outputText.map(font => `${font.text}`).join('\n\n')}
              className="mb-4 min-h-[300px] text-sm leading-tight"
            />
          </div>
        </div>
        <Button onClick={() => handleCopy(outputText.map(font => font.text).join('\n\n'))}>Copy</Button>
      </div>
    </ToolLayout>
  );
};

export default DiscordFontsGenerator;
