import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FaCopy } from "react-icons/fa";

const BubbleTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [filledOutputText, setFilledOutputText] = useState("");
  const [copiedRegular, setCopiedRegular] = useState(false);
  const [copiedFilled, setCopiedFilled] = useState(false);
  const [textStats, setTextStats] = useState({
    charCount: 0,
    wordCount: 0,
    sentenceCount: 0,
    lineCount: 0,
  });

  useEffect(() => {
    convertToBubble(inputText);
    convertToFilledBubble(inputText);
    calculateTextStats(inputText);
  }, [inputText]);

  const convertToBubble = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode bubble character mapping
    const bubbleMap: { [key: string]: string } = {
      a: "ⓐ",
      b: "ⓑ",
      c: "ⓒ",
      d: "ⓓ",
      e: "ⓔ",
      f: "ⓕ",
      g: "ⓖ",
      h: "ⓗ",
      i: "ⓘ",
      j: "ⓙ",
      k: "ⓚ",
      l: "ⓛ",
      m: "ⓜ",
      n: "ⓝ",
      o: "ⓞ",
      p: "ⓟ",
      q: "ⓠ",
      r: "ⓡ",
      s: "ⓢ",
      t: "ⓣ",
      u: "ⓤ",
      v: "ⓥ",
      w: "ⓦ",
      x: "ⓧ",
      y: "ⓨ",
      z: "ⓩ",
      A: "Ⓐ",
      B: "Ⓑ",
      C: "Ⓒ",
      D: "Ⓓ",
      E: "Ⓔ",
      F: "Ⓕ",
      G: "Ⓖ",
      H: "Ⓗ",
      I: "Ⓘ",
      J: "Ⓙ",
      K: "Ⓚ",
      L: "Ⓛ",
      M: "Ⓜ",
      N: "Ⓝ",
      O: "Ⓞ",
      P: "Ⓟ",
      Q: "Ⓠ",
      R: "Ⓡ",
      S: "Ⓢ",
      T: "Ⓣ",
      U: "Ⓤ",
      V: "Ⓥ",
      W: "Ⓦ",
      X: "Ⓧ",
      Y: "Ⓨ",
      Z: "Ⓩ",
      "0": "⓪",
      "1": "①",
      "2": "②",
      "3": "③",
      "4": "④",
      "5": "⑤",
      "6": "⑥",
      "7": "⑦",
      "8": "⑧",
      "9": "⑨",
      "!": "❗",
      "?": "❓",
      ".": "⨀",
    };

    const result = text
      .split("")
      .map((char) => bubbleMap[char] || char)
      .join("");
    setOutputText(result);
  };

  const convertToFilledBubble = (text: string) => {
    if (!text) {
      setFilledOutputText("");
      return;
    }

    // Unicode square bubble character mapping
    const filledBubbleMap: { [key: string]: string } = {
      a: "🅐",
      b: "🅑",
      c: "🅒",
      d: "🅓",
      e: "🅔",
      f: "🅕",
      g: "🅖",
      h: "🅗",
      i: "🅘",
      j: "🅙",
      k: "🅚",
      l: "🅛",
      m: "🅜",
      n: "🅝",
      o: "🅞",
      p: "🅟",
      q: "🅠",
      r: "🅡",
      s: "🅢",
      t: "🅣",
      u: "🅤",
      v: "🅥",
      w: "🅦",
      x: "🅧",
      y: "🅨",
      z: "🅩",
      A: "🅐",
      B: "🅑",
      C: "🅒",
      D: "🅓",
      E: "🅔",
      F: "🅕",
      G: "🅖",
      H: "🅗",
      I: "🅘",
      J: "🅙",
      K: "🅚",
      L: "🅛",
      M: "🅜",
      N: "🅝",
      O: "🅞",
      P: "🅟",
      Q: "🅠",
      R: "🅡",
      S: "🅢",
      T: "🅣",
      U: "🅤",
      V: "🅥",
      W: "🅦",
      X: "🅧",
      Y: "🅨",
      Z: "🅩",
      "0": "⓿",
      "1": "➊",
      "2": "➋",
      "3": "➌",
      "4": "➍",
      "5": "➎",
      "6": "➏",
      "7": "➐",
      "8": "➑",
      "9": "➒",
      " ": " ",
      "!": "❗",
      "?": "❓",
      ".": "⊙",
    };

    const result = text
      .split("")
      .map((char) => filledBubbleMap[char] || char)
      .join("");
    setFilledOutputText(result);
  };

  const handleCopy = (text: string, type: 'regular' | 'filled') => {
    navigator.clipboard.writeText(text);
    if (type === 'regular') {
      setCopiedRegular(true);
      setTimeout(() => setCopiedRegular(false), 2000);
    } else {
      setCopiedFilled(true);
      setTimeout(() => setCopiedFilled(false), 2000);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setFilledOutputText("");
    setTextStats({
      charCount: 0,
      wordCount: 0,
      sentenceCount: 0,
      lineCount: 0,
    });
  };

  const calculateTextStats = (text: string) => {
    const charCount = text.length;
    const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
    const sentenceCount = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length;
    const lineCount = text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).filter(Boolean).length;

    setTextStats({
      charCount,
      wordCount,
      sentenceCount,
      lineCount,
    });
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex flex-row gap-4 mb-4">
        {/* Left Column - Input */}
        <div className="w-1/2">
          <Textarea
            placeholder="Type or paste your content here"
            className="w-full h-[180px] bg-zinc-700 text-white border-zinc-600 p-4 rounded"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        {/* Right Column - Output */}
        <div className="w-1/2">
          <div className="flex flex-col gap-2">
            <div className="relative">
              <div className="bg-zinc-700 text-white border border-zinc-600 p-4 pr-12 rounded min-h-[180px]">
                <div className="whitespace-pre-wrap break-words">
                  {outputText || (
                    <span className="text-gray-400">Ⓣⓨⓟⓔ ⓞⓡ ⓟⓐⓢⓣⓔ ⓨⓞⓤⓡ ⓒⓞⓝⓣⓔⓝⓣ ⓗⓔⓡⓔ</span>
                  )}
                  
                  {outputText && filledOutputText && (
                    <div className="my-2"></div>
                  )}
                  
                  {filledOutputText || (
                    outputText ? null : <span className="text-gray-400"><br />🅣🅨🅟🅔 🅞🅡 🅟🅐🅢🅣🅔 🅨🅞🅤🅡 🅒🅞🅝🅣🅔🅝🅣 🅗🅔🅡🅔</span>
                  )}
                </div>
                
                {/* Copy icons for both text styles */}
                <div className="absolute right-3 top-3 flex flex-col gap-2">
                  {outputText && (
                    <div 
                      className="cursor-pointer p-1.5 rounded-full hover:bg-zinc-600 transition-colors"
                      onClick={() => handleCopy(outputText, 'regular')}
                      title="Copy bubble text"
                    >
                      <FaCopy className={`text-lg ${copiedRegular ? 'text-green-400' : 'text-gray-400'}`} />
                    </div>
                  )}
                  
                  {filledOutputText && (
                    <div 
                      className="cursor-pointer p-1.5 rounded-full hover:bg-zinc-600 transition-colors" 
                      onClick={() => handleCopy(filledOutputText, 'filled')}
                      title="Copy filled bubble text"
                    >
                      <FaCopy className={`text-lg ${copiedFilled ? 'text-green-400' : 'text-gray-400'}`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Character Count: {textStats.charCount} | Word Count: {textStats.wordCount} | Sentence Count: {textStats.sentenceCount} | Line Count: {textStats.lineCount}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );

  return <>{content}</>;
};

export default BubbleTextGenerator;
