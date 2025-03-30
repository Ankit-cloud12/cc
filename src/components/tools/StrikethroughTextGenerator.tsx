import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const StrikethroughTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToStrikethrough(inputText);
  }, [inputText]);

  const convertToStrikethrough = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Convert to strikethrough text using Unicode combining character
    // Using U+0335 COMBINING SHORT STROKE OVERLAY for better middle strikethrough
    const result = text
      .split("")
      .map((char) => char + "\u0336") // Changed to U+0336 for better middle strikethrough
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
      <div className="bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-4xl font-bold mb-2">Strikethrough Text Generator</h1>
        <p className="text-lg opacity-90">
          Create strikethrough text that works everywhere. Perfect for indicating deleted content or adding unique style to your text.
        </p>
      </div>

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
        placeholder="Strikethrough text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Strikethrough Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool uses Unicode combining characters to create strikethrough
          text that works across different platforms. Unlike HTML or Markdown
          strikethrough, this method creates text that can be used in places
          where formatting isn't normally allowed.
        </p>
        <p className="text-gray-300 mb-4">
          Strikethrough text is commonly used to show deleted content, changes,
          or humorous effects in social media posts, messages, and creative
          writing.
        </p>
        <p className="text-gray-300 mb-4">
          The strikethrough text generated is compatible with most platforms
          that support Unicode, including Facebook, Twitter, Instagram, Discord,
          and more.
        </p>
      </div>
    </>
  );

  return (
    <div className="w-full">
      {content}
    </div>
  );
};

export default StrikethroughTextGenerator;
