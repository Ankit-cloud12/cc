import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SmallTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToSmall(inputText);
  }, [inputText]);

  const convertToSmall = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode small character mapping
    const smallMap: { [key: string]: string } = {
      a: "ᵃ",
      b: "ᵇ",
      c: "ᶜ",
      d: "ᵈ",
      e: "ᵉ",
      f: "ᶠ",
      g: "ᵍ",
      h: "ʰ",
      i: "ⁱ",
      j: "ʲ",
      k: "ᵏ",
      l: "ˡ",
      m: "ᵐ",
      n: "ⁿ",
      o: "ᵒ",
      p: "ᵖ",
      q: "ᵠ",
      r: "ʳ",
      s: "ˢ",
      t: "ᵗ",
      u: "ᵘ",
      v: "ᵛ",
      w: "ʷ",
      x: "ˣ",
      y: "ʸ",
      z: "ᶻ",
      "0": "⁰",
      "1": "¹",
      "2": "²",
      "3": "³",
      "4": "⁴",
      "5": "⁵",
      "6": "⁶",
      "7": "⁷",
      "8": "⁸",
      "9": "⁹",
      "+": "⁺",
      "-": "⁻",
      "=": "⁼",
      "(": "⁽",
      ")": "⁾",
      ".": "·",
    };

    const result = text
      .split("")
      .map((char) => smallMap[char] || char)
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
      <h1 className="text-3xl font-bold mb-2">Small Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text into small superscript characters that you can use on
        social media, messages, and more.
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
        placeholder="Small text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Small Text Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool converts your regular text into small superscript Unicode
          characters. These special characters appear smaller and slightly
          raised compared to normal text. They're perfect for creating unique
          text styles for social media bios, comments, or messages.
        </p>
        <p className="text-gray-300 mb-4">
          The small text generated is compatible with most platforms including
          Facebook, Twitter, Instagram, TikTok, Discord, and more.
        </p>
      </div>
    </>
  );

  return content;
};

export default SmallTextGenerator;
