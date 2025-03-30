import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SubscriptGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToSubscript(inputText);
  }, [inputText]);

  const convertToSubscript = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode subscript character mapping
    const subscriptMap: { [key: string]: string } = {
      "0": "₀",
      "1": "₁",
      "2": "₂",
      "3": "₃",
      "4": "₄",
      "5": "₅",
      "6": "₆",
      "7": "₇",
      "8": "₈",
      "9": "₉",
      "+": "₊",
      "-": "₋",
      "=": "₌",
      "(": "₍",
      ")": "₎",
      a: "ₐ",
      e: "ₑ",
      h: "ₕ",
      i: "ᵢ",
      j: "ⱼ",
      k: "ₖ",
      l: "ₗ",
      m: "ₘ",
      n: "ₙ",
      o: "ₒ",
      p: "ₚ",
      r: "ᵣ",
      s: "ₛ",
      t: "ₜ",
      u: "ᵤ",
      v: "ᵥ",
      x: "ₓ",
    };

    const result = text
      .split("")
      .map((char) => subscriptMap[char.toLowerCase()] || char)
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

  return (
    <>
      <h1 className="text-3xl font-bold mb-2">Subscript Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text to subscript characters that appear below the
        baseline.
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
        placeholder="Subscript text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Subscript Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool converts your text to subscript characters that appear below
          the baseline. Subscript is commonly used in mathematical formulas,
          chemical formulas, and footnotes.
        </p>
      </div>
    </>
  );
};

export default SubscriptGenerator;
