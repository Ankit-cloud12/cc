import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ItalicTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToItalic(inputText);
  }, [inputText]);

  const convertToItalic = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode italic character mapping
    const italicMap: { [key: string]: string } = {
      a: "𝘢",
      b: "𝘣",
      c: "𝘤",
      d: "𝘥",
      e: "𝘦",
      f: "𝘧",
      g: "𝘨",
      h: "𝘩",
      i: "𝘪",
      j: "𝘫",
      k: "𝘬",
      l: "𝘭",
      m: "𝘮",
      n: "𝘯",
      o: "𝘰",
      p: "𝘱",
      q: "𝘲",
      r: "𝘳",
      s: "𝘴",
      t: "𝘵",
      u: "𝘶",
      v: "𝘷",
      w: "𝘸",
      x: "𝘹",
      y: "𝘺",
      z: "𝘻",
      A: "𝘈",
      B: "𝘉",
      C: "𝘊",
      D: "𝘋",
      E: "𝘌",
      F: "𝘍",
      G: "𝘎",
      H: "𝘏",
      I: "𝘐",
      J: "𝘑",
      K: "𝘒",
      L: "𝘓",
      M: "𝘔",
      N: "𝘕",
      O: "𝘖",
      P: "𝘗",
      Q: "𝘘",
      R: "𝘙",
      S: "𝘚",
      T: "𝘛",
      U: "𝘜",
      V: "𝘝",
      W: "𝘞",
      X: "𝘟",
      Y: "𝘠",
      Z: "𝘡",
    };

    const result = text
      .split("")
      .map((char) => italicMap[char] || char)
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
      <h1 className="text-3xl font-bold mb-2">Italic Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text into italic Unicode characters that you can use on
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
        placeholder="Italic text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Italic Text Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool converts your regular text into italic Unicode characters.
          These aren't actually italic in the traditional sense - they're
          special Unicode characters that look like italic letters. This means
          they can be used in places where formatting isn't normally allowed,
          like social media profiles, messages, and usernames.
        </p>
        <p className="text-gray-300 mb-4">
          The italic text generated is compatible with most platforms including
          Facebook, Twitter, Instagram, TikTok, Discord, and more.
        </p>
      </div>
    </>
  );

  return content;
};

export default ItalicTextGenerator;
