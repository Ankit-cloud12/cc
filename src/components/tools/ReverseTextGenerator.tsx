import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ReverseTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    reverseText(inputText);
  }, [inputText]);

  const reverseText = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Reverse the text
    const result = text.split("").reverse().join("");
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
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-2">Reverse Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Reverse the order of characters in your text - make it read backwards.
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
        placeholder="Reversed text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Reverse Text Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool reverses the order of characters in your text, making it read
          backwards. It's often used for fun or creative purposes, such as creating
          mirror writing or word puzzles.
        </p>
        <p className="text-gray-300 mb-4">
          Reversed text can be used in creative writing, riddles, word puzzles, or
          games. It's also sometimes used in mirror writing or as a simple form
          of text obfuscation.
        </p>
      </div>
    </div>
  );
};

export default ReverseTextGenerator;
