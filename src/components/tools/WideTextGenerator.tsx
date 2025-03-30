import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const WideTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToWide(inputText);
  }, [inputText]);

  const convertToWide = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode full-width character mapping
    const wideMap: { [key: string]: string } = {
      a: "ａ",
      b: "ｂ",
      c: "ｃ",
      d: "ｄ",
      e: "ｅ",
      f: "ｆ",
      g: "ｇ",
      h: "ｈ",
      i: "ｉ",
      j: "ｊ",
      k: "ｋ",
      l: "ｌ",
      m: "ｍ",
      n: "ｎ",
      o: "ｏ",
      p: "ｐ",
      q: "ｑ",
      r: "ｒ",
      s: "ｓ",
      t: "ｔ",
      u: "ｕ",
      v: "ｖ",
      w: "ｗ",
      x: "ｘ",
      y: "ｙ",
      z: "ｚ",
      A: "Ａ",
      B: "Ｂ",
      C: "Ｃ",
      D: "Ｄ",
      E: "Ｅ",
      F: "Ｆ",
      G: "Ｇ",
      H: "Ｈ",
      I: "Ｉ",
      J: "Ｊ",
      K: "Ｋ",
      L: "Ｌ",
      M: "Ｍ",
      N: "Ｎ",
      O: "Ｏ",
      P: "Ｐ",
      Q: "Ｑ",
      R: "Ｒ",
      S: "Ｓ",
      T: "Ｔ",
      U: "Ｕ",
      V: "Ｖ",
      W: "Ｗ",
      X: "Ｘ",
      Y: "Ｙ",
      Z: "Ｚ",
      "0": "０",
      "1": "１",
      "2": "２",
      "3": "３",
      "4": "４",
      "5": "５",
      "6": "６",
      "7": "７",
      "8": "８",
      "9": "９",
      " ": "　",
      "!": "！",
      '"': "＂",
      "#": "＃",
      $: "＄",
      "%": "％",
      "&": "＆",
      "'": "＇",
      "(": "（",
      ")": "）",
      "*": "＊",
      "+": "＋",
      ",": "，",
      "-": "－",
      ".": "．",
      "/": "／",
      ":": "：",
      ";": "；",
      "<": "＜",
      "=": "＝",
      ">": "＞",
      "?": "？",
      "@": "＠",
      "[": "［",
      "\\": "＼",
      "]": "］",
      "^": "＾",
      _: "＿",
      "`": "｀",
      "{": "｛",
      "|": "｜",
      "}": "｝",
      "~": "～",
    };

    const result = text
      .split("")
      .map((char) => wideMap[char] || char)
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
  };

  const content = (
    <>
      <h1 className="text-3xl font-bold mb-2">
        Wide Text Generator (Vaporwave Text)
      </h1>
      <p className="text-gray-300 mb-6">
        Convert your normal text into aesthetic wide text (also known as
        vaporwave text or full-width text).
      </p>

      <Textarea
        placeholder="Type or paste your text here"
        className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <Textarea
        readOnly
        className="w-full min-h-[150px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
        value={outputText}
        placeholder="Wide text will appear here"
      />

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={handleCopy}
          disabled={!outputText}
        >
          {copied ? "Copied!" : "Copy to Clipboard"}
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>

      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Wide Text Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool converts your regular text into full-width Unicode characters.
          These special characters appear wider than normal text and can be used
          to create a vaporwave aesthetic.
        </p>
        <p className="text-gray-300 mb-4">
          Wide text is commonly used in vaporwave aesthetics, social media bios,
          and artistic text styling. The generated text is compatible with most
          platforms including Facebook, Twitter, Instagram, TikTok, Discord, and
          more.
        </p>
      </div>
    </>
  );

  return content;
};

export default WideTextGenerator;
