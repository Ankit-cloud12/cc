import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const InverseTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToInverse(inputText);
  }, [inputText]);

  const convertToInverse = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    const result = text
      .split("")
      .map((char) => {
        if (char === char.toUpperCase() && char.toLowerCase() !== char.toUpperCase()) {
          return char.toLowerCase();
        }
        return char.toUpperCase();
      })
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
      <h1 className="text-3xl font-bold mb-2">Inverse Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text into inverse case (uppercase becomes lowercase and vice
        versa).
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
        placeholder="Inverse case text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Inverse Case Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool converts your text to inverse case, which means all uppercase
          letters become lowercase and all lowercase letters become uppercase.
          This creates an interesting visual effect for your text that can be
          used in social media posts, creative writing, or just for fun.
        </p>
        <p className="text-gray-300 mb-4">
          For example, "Hello World" becomes "hELLO wORLD" when converted to
          inverse case.
        </p>
        <p className="text-gray-300 mb-4">
          The inverse case text generated is compatible with most platforms
          including Facebook, Twitter, Instagram, TikTok, Discord, and more.
        </p>
      </div>
    </>
  );

  return content;
};

export default InverseTextGenerator;
