import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

// Improved, corrected font mappings organized by category
const fontStyleCategories = [
  {
    category: "Discord Markdown",
    styles: [
      {
        name: "Normal",
        description: "Regular text without formatting",
        convert: (t: string) => t,
        discordMarkdown: "Regular text"
      },
      {
        name: "Bold",
        description: "Bold text using Discord's **text** markdown",
        convert: (t: string) => {
          // Basic text, just return with markdown
          return `**${t}**`;
        },
        discordMarkdown: "**Bold**"
      },
      {
        name: "Italic",
        description: "Italic text using Discord's *text* markdown",
        convert: (t: string) => {
          return `*${t}*`;
        },
        discordMarkdown: "*Italic*"
      },
      {
        name: "Bold Italic",
        description: "Bold and italic text using Discord's ***text*** markdown",
        convert: (t: string) => {
          return `***${t}***`;
        },
        discordMarkdown: "***Bold Italic***"
      },
      {
        name: "Underline",
        description: "Underlined text using Discord's __text__ markdown",
        convert: (t: string) => {
          return `__${t}__`;
        },
        discordMarkdown: "__Underline__"
      },
      {
        name: "Strikethrough",
        description: "Strikethrough text using Discord's ~~text~~ markdown",
        convert: (t: string) => {
          return `~~${t}~~`;
        },
        discordMarkdown: "~~Strikethrough~~"
      },
      {
        name: "Code",
        description: "Inline code using Discord's `text` markdown",
        convert: (t: string) => {
          return `\`${t}\``;
        },
        discordMarkdown: "`Code`"
      },
      {
        name: "Code Block",
        description: "Code block using Discord's ```text``` markdown",
        convert: (t: string) => {
          return "```\n" + t + "\n```";
        },
        discordMarkdown: "```Code Block```"
      },
      {
        name: "Quote",
        description: "Quote text using Discord's > text markdown",
        convert: (t: string) => {
          // Split by new line and add > to each line
          return t.split('\n').map(line => `> ${line}`).join('\n');
        },
        discordMarkdown: "> Quote"
      },
      {
        name: "Spoiler",
        description: "Spoiler text using Discord's ||text|| markdown",
        convert: (t: string) => {
          return `||${t}||`;
        },
        discordMarkdown: "||Spoiler||"
      }
    ]
  },
  {
    category: "Unicode Styles",
    styles: [
      {
        name: "𝗕𝗼𝗹𝗱 𝗨𝗻𝗶𝗰𝗼𝗱𝗲",
        description: "Bold text using Unicode characters",
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
        }
      },
      {
        name: "𝘐𝘵𝘢𝘭𝘪𝘤 𝘜𝘯𝘪𝘤𝘰𝘥𝘦",
        description: "Italic text using Unicode characters",
        convert: (t: string) => {
          const italicChars: { [key: string]: string } = {
            a: "𝘢", b: "𝘣", c: "𝘤", d: "𝘥", e: "𝘦", f: "𝘧", g: "𝘨", h: "𝘩", i: "𝘪", j: "𝘫",
            k: "𝘬", l: "𝘭", m: "𝘮", n: "𝘯", o: "𝘰", p: "𝘱", q: "𝘲", r: "𝘳", s: "𝘴", t: "𝘵",
            u: "𝘶", v: "𝘷", w: "𝘸", x: "𝘹", y: "𝘺", z: "𝘻",
            A: "𝘈", B: "𝘉", C: "𝘊", D: "𝘋", E: "𝘌", F: "𝘍", G: "𝘎", H: "𝘏", I: "𝘐", J: "𝘑",
            K: "𝘒", L: "𝘓", M: "𝘔", N: "𝘕", O: "𝘖", P: "𝘗", Q: "𝘘", R: "𝘙", S: "𝘚", T: "𝘛",
            U: "𝘜", V: "𝘝", W: "𝘞", X: "𝘟", Y: "𝘠", Z: "𝘡",
          };
          return t
            .split("")
            .map((char) => italicChars[char] || char)
            .join("");
        }
      },
      {
        name: "𝙗𝙤𝙡𝙙 𝙞𝙩𝙖𝙡𝙞𝙘",
        description: "Bold and italic text using Unicode characters",
        convert: (t: string) => {
          const boldItalicChars: { [key: string]: string } = {
            a: "𝙖", b: "𝙗", c: "𝙘", d: "𝙙", e: "𝙚", f: "𝙛", g: "𝙜", h: "𝙝", i: "𝙞", j: "𝙟",
            k: "𝙠", l: "𝙡", m: "𝙢", n: "𝙣", o: "𝙤", p: "𝙥", q: "𝙦", r: "𝙧", s: "𝙨", t: "𝙩",
            u: "𝙪", v: "𝙫", w: "𝙬", x: "𝙭", y: "𝙮", z: "𝙯",
            A: "𝘼", B: "𝘽", C: "𝘾", D: "𝘿", E: "𝙀", F: "𝙁", G: "𝙂", H: "𝙃", I: "𝙄", J: "𝙅",
            K: "𝙆", L: "𝙇", M: "𝙈", N: "𝙉", O: "𝙊", P: "𝙋", Q: "𝙌", R: "𝙍", S: "𝙎", T: "𝙏",
            U: "𝙐", V: "𝙑", W: "𝙒", X: "𝙓", Y: "𝙔", Z: "𝙕",
          };
          return t
            .split("")
            .map((char) => boldItalicChars[char] || char)
            .join("");
        }
      },
      {
        name: "𝓢𝓬𝓻𝓲𝓹𝓽",
        description: "Cursive script text using Unicode characters",
        convert: (t: string) => {
          const scriptChars: { [key: string]: string } = {
            a: "𝓪", b: "𝓫", c: "𝓬", d: "𝓭", e: "𝓮", f: "𝓯", g: "𝓰", h: "𝓱", i: "𝓲", j: "𝓳",
            k: "𝓴", l: "𝓵", m: "𝓶", n: "𝓷", o: "𝓸", p: "𝓹", q: "𝓺", r: "𝓻", s: "𝓼", t: "𝓽",
            u: "𝓾", v: "𝓿", w: "𝔀", x: "𝔁", y: "𝔂", z: "𝔃",
            A: "𝓐", B: "𝓑", C: "𝓒", D: "𝓓", E: "𝓔", F: "𝓕", G: "𝓖", H: "𝓗", I: "𝓘", J: "𝓙",
            K: "𝓚", L: "𝓛", M: "𝓜", N: "𝓝", O: "𝓞", P: "𝓟", Q: "𝓠", R: "𝓡", S: "𝓢", T: "𝓣",
            U: "𝓤", V: "𝓥", W: "𝓦", X: "𝓧", Y: "𝓨", Z: "𝓩",
          };
          return t
            .split("")
            .map((char) => scriptChars[char] || char)
            .join("");
        }
      },
      {
        name: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",
        description: "Fraktur (gothic) text using Unicode characters",
        convert: (t: string) => {
          const frakturChars: { [key: string]: string } = {
            a: "𝔞", b: "𝔟", c: "𝔠", d: "𝔡", e: "𝔢", f: "𝔣", g: "𝔤", h: "𝔥", i: "𝔦", j: "𝔧",
            k: "𝔨", l: "𝔩", m: "𝔪", n: "𝔫", o: "𝔬", p: "𝔭", q: "𝔮", r: "𝔯", s: "𝔰", t: "𝔱",
            u: "𝔲", v: "𝔳", w: "𝔴", x: "𝔵", y: "𝔶", z: "𝔷",
            A: "𝔄", B: "𝔅", C: "ℭ", D: "𝔇", E: "𝔈", F: "𝔉", G: "𝔊", H: "ℌ", I: "ℑ", J: "𝔍",
            K: "𝔎", L: "𝔏", M: "𝔐", N: "𝔑", O: "𝔒", P: "𝔓", Q: "𝔔", R: "ℜ", S: "𝔖", T: "𝔗",
            U: "𝔘", V: "𝔙", W: "𝔚", X: "𝔛", Y: "𝔜", Z: "ℨ",
          };
          return t
            .split("")
            .map((char) => frakturChars[char] || char)
            .join("");
        }
      },
      {
        name: "𝕄𝕠𝕟𝕠𝕤𝕡𝕒𝕔𝕖",
        description: "Monospace text using Unicode characters",
        convert: (t: string) => {
          const monospaceChars: { [key: string]: string } = {
            a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓",
            k: "𝚔", l: "𝚕", m: "𝚖", n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝",
            u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
            A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹",
            K: "𝙺", L: "𝙻", M: "𝙼", N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃",
            U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉",
            "0": "𝟶", "1": "𝟷", "2": "𝟸", "3": "𝟹", "4": "𝟺", "5": "𝟻", "6": "𝟼", "7": "𝟽", "8": "𝟾", "9": "𝟿",
          };
          return t
            .split("")
            .map((char) => monospaceChars[char] || char)
            .join("");
        }
      }
    ],
  },
  {
    category: "Specialty Styles",
    styles: [
      {
        name: "🅑🅤🅑🅑🅛🅔",
        description: "Bubble letters (enclosed characters)",
        convert: (t: string) => {
          const bubbleChars: { [key: string]: string } = {
            a: "ⓐ", b: "ⓑ", c: "ⓒ", d: "ⓓ", e: "ⓔ", f: "ⓕ", g: "ⓖ", h: "ⓗ", i: "ⓘ", j: "ⓙ",
            k: "ⓚ", l: "ⓛ", m: "ⓜ", n: "ⓝ", o: "ⓞ", p: "ⓟ", q: "ⓠ", r: "ⓡ", s: "ⓢ", t: "ⓣ",
            u: "ⓤ", v: "ⓥ", w: "ⓦ", x: "ⓧ", y: "ⓨ", z: "ⓩ",
            A: "Ⓐ", B: "Ⓑ", C: "Ⓒ", D: "Ⓓ", E: "Ⓔ", F: "Ⓕ", G: "Ⓖ", H: "Ⓗ", I: "Ⓘ", J: "Ⓙ",
            K: "Ⓚ", L: "Ⓛ", M: "Ⓜ", N: "Ⓝ", O: "Ⓞ", P: "Ⓟ", Q: "Ⓠ", R: "Ⓡ", S: "Ⓢ", T: "Ⓣ",
            U: "Ⓤ", V: "Ⓥ", W: "Ⓦ", X: "Ⓧ", Y: "Ⓨ", Z: "Ⓩ",
            "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨",
          };
          return t
            .split("")
            .map((char) => bubbleChars[char] || char)
            .join("");
        }
      },
      {
        name: "🅕🅘🅛🅛🅔🅓 🅑🅤🅑🅑🅛🅔",
        description: "Filled bubble letters",
        convert: (t: string) => {
          const filledBubbleChars: { [key: string]: string } = {
            a: "🅐", b: "🅑", c: "🅒", d: "🅓", e: "🅔", f: "🅕", g: "🅖", h: "🅗", i: "🅘", j: "🅙",
            k: "🅚", l: "🅛", m: "🅜", n: "🅝", o: "🅞", p: "🅟", q: "🅠", r: "🅡", s: "🅢", t: "🅣",
            u: "🅤", v: "🅥", w: "🅦", x: "🅧", y: "🅨", z: "🅩",
            A: "🅐", B: "🅑", C: "🅒", D: "🅓", E: "🅔", F: "🅕", G: "🅖", H: "🅗", I: "🅘", J: "🅙",
            K: "🅚", L: "🅛", M: "🅜", N: "🅝", O: "🅞", P: "🅟", Q: "🅠", R: "🅡", S: "🅢", T: "🅣",
            U: "🅤", V: "🅥", W: "🅦", X: "🅧", Y: "🅨", Z: "🅩",
            "0": "⓿", "1": "➊", "2": "➋", "3": "➌", "4": "➍", "5": "➎", "6": "➏", "7": "➐", "8": "➑", "9": "➒",
          };
          return t
            .split("")
            .map((char) => filledBubbleChars[char] || char)
            .join("");
        }
      },
      {
        name: "🆂🆀🆄🅰🆁🅴",
        description: "Square letters",
        convert: (t: string) => {
          const squareChars: { [key: string]: string } = {
            a: "🄰", b: "🄱", c: "🄲", d: "🄳", e: "🄴", f: "🄵", g: "🄶", h: "🄷", i: "🄸", j: "🄹",
            k: "🄺", l: "🄻", m: "🄼", n: "🄽", o: "🄾", p: "🄿", q: "🅀", r: "🅁", s: "🅂", t: "🅃",
            u: "🅄", v: "🅅", w: "🅆", x: "🅇", y: "🅈", z: "🅉",
            A: "🄰", B: "🄱", C: "🄲", D: "🄳", E: "🄴", F: "🄵", G: "🄶", H: "🄷", I: "🄸", J: "🄹",
            K: "🄺", L: "🄻", M: "🄼", N: "🄽", O: "🄾", P: "🄿", Q: "🅀", R: "🅁", S: "🅂", T: "🅃",
            U: "🅄", V: "🅅", W: "🅆", X: "🅇", Y: "🅈", Z: "🅉",
          };
          return t
            .split("")
            .map((char) => squareChars[char] || char)
            .join("");
        }
      },
      {
        name: "🅲🅾🅻🅾🆁🅵🆄🅻",
        description: "Mixed color square letters",
        convert: (t: string) => {
          const colorChars: { [key: string]: string } = {
            a: "🅰", b: "🅱", c: "🅲", d: "🅳", e: "🅴", f: "🅵", g: "🅶", h: "🅷", i: "🅸", j: "🅹",
            k: "🅺", l: "🅻", m: "🅼", n: "🅽", o: "🅾", p: "🅿", q: "🆀", r: "🆁", s: "🆂", t: "🆃",
            u: "🆄", v: "🆅", w: "🆆", x: "🆇", y: "🆈", z: "🆉",
            A: "🅰", B: "🅱", C: "🅲", D: "🅳", E: "🅴", F: "🅵", G: "🅶", H: "🅷", I: "🅸", J: "🅹",
            K: "🅺", L: "🅻", M: "🅼", N: "🅽", O: "🅾", P: "🅿", Q: "🆀", R: "🆁", S: "🆂", T: "🆃",
            U: "🆄", V: "🆅", W: "🆆", X: "🆇", Y: "🆈", Z: "🆉",
          };
          return t
            .split("")
            .map((char) => colorChars[char] || char)
            .join("");
        }
      },
      {
        name: "sᴍᴀʟʟᴄᴀᴘs",
        description: "Small capital letters",
        convert: (t: string) => {
          const smallCapsChars: { [key: string]: string } = {
            a: "ᴀ", b: "ʙ", c: "ᴄ", d: "ᴅ", e: "ᴇ", f: "ғ", g: "ɢ", h: "ʜ", i: "ɪ", j: "ᴊ",
            k: "ᴋ", l: "ʟ", m: "ᴍ", n: "ɴ", o: "ᴏ", p: "ᴘ", q: "ǫ", r: "ʀ", s: "s", t: "ᴛ",
            u: "ᴜ", v: "ᴠ", w: "ᴡ", x: "x", y: "ʏ", z: "ᴢ",
          };
          return t
            .split("")
            .map((char) => {
              // Only apply transformation to lowercase letters
              if (/[a-z]/.test(char)) {
                return smallCapsChars[char] || char;
              }
              return char;
            })
            .join("");
        }
      },
      {
        name: "ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ",
        description: "Superscript text",
        convert: (t: string) => {
          const superscriptChars: { [key: string]: string } = {
            a: "ᵃ", b: "ᵇ", c: "ᶜ", d: "ᵈ", e: "ᵉ", f: "ᶠ", g: "ᵍ", h: "ʰ", i: "ⁱ", j: "ʲ",
            k: "ᵏ", l: "ˡ", m: "ᵐ", n: "ⁿ", o: "ᵒ", p: "ᵖ", q: "q", r: "ʳ", s: "ˢ", t: "ᵗ",
            u: "ᵘ", v: "ᵛ", w: "ʷ", x: "ˣ", y: "ʸ", z: "ᶻ",
            "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
            "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾"
          };
          return t
            .split("")
            .map((char) => superscriptChars[char.toLowerCase()] || char)
            .join("");
        }
      },
      {
        name: "ₛᵤbₛcᵣᵢₚₜ",
        description: "Subscript text",
        convert: (t: string) => {
          const subscriptChars: { [key: string]: string } = {
            a: "ₐ", b: "b", c: "c", d: "d", e: "ₑ", f: "f", g: "g", h: "ₕ", i: "ᵢ", j: "ⱼ",
            k: "ₖ", l: "ₗ", m: "ₘ", n: "ₙ", o: "ₒ", p: "ₚ", q: "q", r: "ᵣ", s: "ₛ", t: "ₜ",
            u: "ᵤ", v: "ᵥ", w: "w", x: "ₓ", y: "y", z: "z",
            "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
            "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎"
          };
          return t
            .split("")
            .map((char) => subscriptChars[char.toLowerCase()] || char)
            .join("");
        }
      }
    ]
  }
];

// Define interface for style objects
interface FontStyle {
  name: string;
  description: string;
  convert: (t: string) => string;
  discordMarkdown?: string | null;
}

// Flatten styles for processing
const allFontStyles: FontStyle[] = fontStyleCategories.flatMap(category => category.styles);

const DiscordFontsGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [selectedFont, setSelectedFont] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("font-styles");
  const [infoTab, setInfoTab] = useState("about");

  // Generate all font styles whenever input text changes
  const getAllFonts = () => {
    if (!inputText) return [];
    
    return allFontStyles.map((style) => ({
      name: style.name,
      description: style.description || "",
      text: style.convert(inputText),
      discordMarkdown: style.discordMarkdown || null
    }));
  };

  // Count statistics
  useEffect(() => {
    setCharCount(inputText.length);
    setWordCount(inputText.trim() === "" ? 0 : inputText.trim().split(/\s+/).length);
    setLineCount(inputText.trim() === "" ? 0 : inputText.split(/\r\n|\r|\n/).filter(Boolean).length);
  }, [inputText]);

  // Handle copy
  const handleCopy = (text?: string) => {
    const textToCopy = text || (selectedFont 
      ? allFontStyles.find(f => f.name === selectedFont)?.convert(inputText) || ""
      : getAllFonts().map(f => `${f.name}:\n${f.text}`).join("\n\n"));
      
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle download
  const handleDownload = () => {
    const content = selectedFont 
      ? allFontStyles.find(f => f.name === selectedFont)?.convert(inputText) || ""
      : getAllFonts().map(f => `${f.name}:\n${f.text}`).join("\n\n");
      
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `discord-${selectedFont || "all-fonts"}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Handle clear
  const handleClear = () => {
    setInputText("");
    setSelectedFont(null);
  };

  return (
    <ToolLayout title="Discord Fonts Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Discord Fonts Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Convert text into various styles that work in Discord chat. Create fancy text styles, use Discord markdown, 
          or find special Unicode characters to make your messages stand out.
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
            <div className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded overflow-y-auto mb-2">
              {inputText ? (
                <div className="space-y-3">
                  {(selectedFont ? 
                    [allFontStyles.find(f => f.name === selectedFont)] : 
                    allFontStyles
                  ).filter(Boolean).map((style, index) => (
                    <div key={index} className="flex items-start justify-between group">
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mb-1">{style?.name}</div>
                        <div className="font-normal break-words">{style?.convert(inputText)}</div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs transition-opacity"
                        onClick={() => handleCopy(style?.convert(inputText))}
                      >
                        Copy
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-400 h-full flex items-center justify-center">
                  Discord fonts will appear here
                </div>
              )}
            </div>
            
            {/* Actions Row - Moved below output box and aligned right */}
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              <Button 
                variant="outline" 
                onClick={() => handleCopy()}
                disabled={!inputText}
                className="border-zinc-600"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownload}
                disabled={!inputText}
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
              <span className="text-xs text-gray-400">Line Count</span>
              <span className="text-xl font-semibold">{lineCount}</span>
            </div>
          </div>
        </Card>
        
        {/* Main Tabs - Font Styles and Info */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="font-styles" className="data-[state=active]:bg-zinc-700">Font Styles</TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-zinc-700">Information</TabsTrigger>
          </TabsList>
          
          {/* Font Styles Tab */}
          <TabsContent value="font-styles" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {inputText ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {fontStyleCategories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-2">
                    <h3 className="font-medium text-blue-400">{category.category}</h3>
                    <div className="space-y-2">
                      {category.styles.map((style, styleIndex) => (
                        <Card 
                          key={styleIndex} 
                          className={`p-3 cursor-pointer hover:bg-zinc-700 transition-colors ${selectedFont === style.name ? 'bg-zinc-700 border-blue-500' : 'bg-zinc-800 border-zinc-700'}`}
                          onClick={() => {
                            setSelectedFont(selectedFont === style.name ? null : style.name);
                          }}
                        >
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{style.name}</span>
                            <div className="flex space-x-1">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-6 px-2 text-xs"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(style.convert(inputText));
                                }}
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                          <div className="text-sm truncate">{style.convert(inputText || "Example Text")}</div>
                          {style.discordMarkdown && (
                            <div className="text-xs text-gray-400 mt-1">Usage: {style.discordMarkdown}</div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-400">Type some text in the input box to see all font styles</p>
              </div>
            )}
          </TabsContent>
          
          {/* Information Tab */}
          <TabsContent value="info">
            <Tabs value={infoTab} onValueChange={setInfoTab}>
              <TabsList className="bg-zinc-800">
                <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
                <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
                <h3 className="font-medium mb-2">About Discord Fonts Generator</h3>
                <p className="mb-4">
                  Discord supports various text formatting options through its built-in markdown and also 
                  displays Unicode special characters. This tool provides multiple ways to style your text 
                  for Discord chats.
                </p>
                
                <h4 className="font-medium mt-4 mb-2">Markdown Features</h4>
                <p className="mb-4">
                  Discord's markdown lets you format text with simple syntax:
                </p>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li><strong>Bold</strong> - Use **text** to make text bold</li>
                  <li><strong>Italic</strong> - Use *text* for italic text</li>
                  <li><strong>Strikethrough</strong> - Use ~~text~~ to strike through text</li>
                  <li><strong>Code blocks</strong> - Use ```text``` for multi-line code blocks</li>
                  <li><strong>Spoilers</strong> - Use ||text|| to hide text until clicked</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2">Unicode Fonts</h4>
                <p className="mb-4">
                  In addition to markdown, Discord displays Unicode special characters that simulate font styles.
                  These are actual Unicode characters rather than formatting, meaning they work anywhere in Discord,
                  including places where markdown doesn't.
                </p>
              </TabsContent>
              
              <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
                <h3 className="font-medium mb-2">How to Use This Tool</h3>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Type or paste your text in the input box on the left</li>
                  <li>View all available font styles in the output section or under the Font Styles tab</li>
                  <li>Click on any style card to filter and only show that style</li>
                  <li>Use the copy buttons next to each style to copy just that style</li>
                  <li>Use "Copy to Clipboard" to copy all styles (or just the selected style)</li>
                  <li>Download your text in the selected style (or all styles) as a text file</li>
                </ul>
                
                <h4 className="font-medium mt-4 mb-2">Tips for Discord</h4>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>Combine markdown with Unicode fonts for maximum effect</li>
                  <li>Use Discord markdown for simple formatting needs</li>
                  <li>Use Unicode fonts for places where markdown doesn't work (usernames, etc.)</li>
                  <li>Some fonts may not display correctly on all devices or platforms</li>
                  <li>Remember that excessive formatting can make text harder to read</li>
                </ul>
                
                <p className="text-sm text-gray-400">
                  Note: While these fonts work in Discord, some may not render properly on all devices or browsers.
                  Test your formatted text to ensure it displays as expected.
                </p>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default DiscordFontsGenerator;
