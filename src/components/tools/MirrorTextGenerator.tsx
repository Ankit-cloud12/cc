import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "./ToolLayout";

const MirrorTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    createMirrorText(inputText);
  }, [inputText]);

  const createMirrorText = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Character mapping for specific reversed characters
    const mirrorMap: { [key: string]: string } = {
      a: "ɒ",
      b: "d",
      c: "ɔ",
      d: "b",
      e: "ɘ",
      f: "ꟻ",
      g: "ᵷ",
      h: "ʜ",
      j: "ꞁ",
      k: "ʞ",
      l: "l",
      m: "m",
      n: "ᴎ",
      p: "q",
      q: "p",
      r: "ɿ",
      s: "ꙅ",
      t: "ƚ",
      y: "ʏ",
      z: "ꙅ",
      A: "A",
      B: "ꓭ",
      C: "Ɔ",
      D: "ꓷ",
      E: "Ǝ",
      F: "ꓞ",
      G: "ꓜ",
      J: "Ꞁ",
      K: "ꓘ",
      L: "⅃",
      M: "M",
      N: "И",
      P: "ꓑ",
      Q: "Ꝺ",
      R: "Я",
      S: "Ꙅ",
      T: "T",
      U: "U",
      V: "V",
      W: "W",
      Y: "Y",
      Z: "Z",
      "1": "1",
      "2": "S",
      "3": "Ɛ",
      "4": "ᔭ",
      "5": "ꙅ",
      "6": "ꓯ",
      "7": "V",
      "8": "8",
      "9": "ꓷ",
      "0": "0",
      "&": "⅋",
      "?": "⸮",
      "!": "¡",
      "(": ")",
      ")": "(",
      "[": "]",
      "]": "[",
      "{": "}",
      "}": "{",
      "<": ">",
      ">": "<",
      ".": "˙",
      ",": "՝",
      "/": "\\",
      "\\": "/",
    };

    // Split the text into lines, reverse each line, then join them back
    const mirroredText = text
      .split("\n")
      .map(line => 
        line
          .split("")
          .reverse()
          .map(char => mirrorMap[char] || char)
          .join("")
      )
      .join("\n");
    
    setOutputText(mirroredText);
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

  return (
    <div className="w-full">
      <div className="container mx-auto p-4">
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
          placeholder="Mirrored text will appear here"
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
          <h2 className="text-xl font-bold mb-4">About Mirror Text Generator</h2>
          <p className="text-gray-300 mb-4">
            This mirror text generator reverses the order of characters and replaces them with mirrored versions when possible. It creates a text effect that looks like it's being viewed in a mirror.
          </p>
          <p className="text-gray-300 mb-4">
            Mirror text can be used for creative social media posts, artistic designs, optical illusions, and fun messages to friends. Some characters have special mirrored versions while others simply appear reversed.
          </p>
          <p className="text-gray-300 mb-4">
            The generated mirror text works on most platforms including Facebook, Twitter, Instagram, TikTok, and messaging apps. Note that some special characters may not display correctly on all devices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MirrorTextGenerator;