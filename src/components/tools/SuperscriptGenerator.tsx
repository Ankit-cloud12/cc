import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SuperscriptGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToSuperscript(inputText);
  }, [inputText]);

  const convertToSuperscript = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Unicode superscript character mapping
    const superscriptMap: { [key: string]: string } = {
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
      "a": "ᵃ",
      "b": "ᵇ",
      "c": "ᶜ",
      "d": "ᵈ",
      "e": "ᵉ",
      "f": "ᶠ",
      "g": "ᵍ",
      "h": "ʰ",
      "i": "ⁱ",
      "j": "ʲ",
      "k": "ᵏ",
      "l": "ˡ",
      "m": "ᵐ",
      "n": "ⁿ",
      "o": "ᵒ",
      "p": "ᵖ",
      "r": "ʳ",
      "s": "ˢ",
      "t": "ᵗ",
      "u": "ᵘ",
      "v": "ᵛ",
      "w": "ʷ",
      "x": "ˣ",
      "y": "ʸ",
      "z": "ᶻ",
      "A": "ᴬ",
      "B": "ᴮ",
      "D": "ᴰ",
      "E": "ᴱ",
      "G": "ᴳ",
      "H": "ᴴ",
      "I": "ᴵ",
      "J": "ᴶ",
      "K": "ᴷ",
      "L": "ᴸ",
      "M": "ᴹ",
      "N": "ᴺ",
      "O": "ᴼ",
      "P": "ᴾ",
      "R": "ᴿ",
      "T": "ᵀ",
      "U": "ᵁ",
      "V": "ⱽ",
      "W": "ᵂ",
    };

    const result = text
      .split("")
      .map((char) => superscriptMap[char] || char)
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
      <h1 className="text-3xl font-bold mb-2">Superscript Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text to superscript characters that appear above the
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
        placeholder="Superscript text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Superscript Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool converts your text to superscript characters that appear
          above the baseline. Superscript is commonly used in mathematical
          formulas, citations, footnotes, and to represent powers or ordinal
          numbers.
        </p>
        <p className="text-gray-300 mb-4">
          The superscript text generated is compatible with most platforms that
          support Unicode, though some characters might not be available in
          superscript form.
        </p>
      </div>
    </>
  );

  return <>{content}</>;
};

export default SuperscriptGenerator;
