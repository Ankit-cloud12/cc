import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";


const BoldTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    convertToBold(inputText);
    countStats(inputText);
  }, [inputText]);
  
  const countStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    setSentenceCount(text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length);
    setLineCount(text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).filter(Boolean).length);
  };

  const convertToBold = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode bold character mapping
    const boldMap: { [key: string]: string } = {
      a: "𝗮",
      b: "𝗯",
      c: "𝗰",
      d: "𝗱",
      e: "𝗲",
      f: "𝗳",
      g: "𝗴",
      h: "𝗵",
      i: "𝗶",
      j: "𝗷",
      k: "𝗸",
      l: "𝗹",
      m: "𝗺",
      n: "𝗻",
      o: "𝗼",
      p: "𝗽",
      q: "𝗾",
      r: "𝗿",
      s: "𝘀",
      t: "𝘁",
      u: "𝘂",
      v: "𝘃",
      w: "𝘄",
      x: "𝘅",
      y: "𝘆",
      z: "𝘇",
      A: "𝗔",
      B: "𝗕",
      C: "𝗖",
      D: "𝗗",
      E: "𝗘",
      F: "𝗙",
      G: "𝗚",
      H: "𝗛",
      I: "𝗜",
      J: "𝗝",
      K: "𝗞",
      L: "𝗟",
      M: "𝗠",
      N: "𝗡",
      O: "𝗢",
      P: "𝗣",
      Q: "𝗤",
      R: "𝗥",
      S: "𝗦",
      T: "𝗧",
      U: "𝗨",
      V: "𝗩",
      W: "𝗪",
      X: "𝗫",
      Y: "𝗬",
      Z: "𝗭",
      "0": "𝟬",
      "1": "𝟭",
      "2": "𝟮",
      "3": "𝟯",
      "4": "𝟰",
      "5": "𝟱",
      "6": "𝟲",
      "7": "𝟳",
      "8": "𝟴",
      "9": "𝟵",
    };

    const result = text
      .split("")
      .map((char) => boldMap[char] || char)
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
    setCharCount(0);
    setWordCount(0);
    setSentenceCount(0);
    setLineCount(0);
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "bold-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const content = (
    <>
      <h1 className="text-3xl font-bold mb-2">Bold Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text into bold Unicode characters that you can use on
        social media, messages, and more.
      </p>

      <div className="flex flex-col">
        <Textarea
          placeholder="Type or paste your text here"
          className="w-full flex-grow min-h-[200px] bg-zinc-700 text-white border-zinc-600 p-4 rounded"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <div className="text-sm text-gray-400 mt-2">
          Character Count: {charCount} | Word Count: {wordCount} | Sentence Count: {sentenceCount} | Line Count: {lineCount}
        </div>
      </div>

      <div className="flex flex-col">
        <Textarea
          readOnly
          className="w-full flex-grow min-h-[200px] bg-zinc-700 text-white border-zinc-600 p-4 rounded"
          value={outputText}
          placeholder="Bold text will appear here"
        />
        
        <div className="grid grid-cols-2 gap-2 mt-2">
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
      </div>

      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Bold Text Generator</h2>
        <p className="text-gray-300 mb-4">
          These aren't actually bold in the traditional sense - they're special
          Unicode characters that look like bold letters. This means they can be
          used in places where formatting isn't normally allowed, like social
          media profiles, messages, and usernames.
        </p>
        <p className="text-gray-300 mb-4">
          The bold text generated is compatible with most platforms including
          Facebook, Twitter, Instagram, TikTok, Discord, and more.
        </p>
      </div>
    </>
  );

  return <>{content}</>;
};

export default BoldTextGenerator;
