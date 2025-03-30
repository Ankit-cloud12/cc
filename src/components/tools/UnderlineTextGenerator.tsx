import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const UnderlineTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToUnderline(inputText);
  }, [inputText]);

  const convertToUnderline = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Convert to underlined text using Unicode combining characters
    const result = text
      .split("")
      .map((char) => char + "̲")
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
      <h1 className="text-3xl font-bold mb-2">Underline Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text into underlined text using Unicode combining
        characters.
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
        placeholder="Underlined text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Underline Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool uses Unicode combining characters to create underlined text
          that works across different platforms. Unlike HTML underlining, this
          method creates text that can be used in places where formatting isn't
          normally allowed.
        </p>
        <p className="text-gray-300 mb-4">
          Underlined text is commonly used to indicate:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Emphasis or importance</li>
          <li>Titles of works (in some style guides)</li>
          <li>Hyperlinks (in web contexts)</li>
          <li>Headings and key terms</li>
        </ul>
        <p className="text-gray-300 mb-4">
          The underlined text generated is compatible with most platforms
          including Facebook, Twitter, Instagram, Discord, and more. However,
          some platforms may have limited support for combining characters, so
          the appearance may vary.
        </p>
      </div>
    </>
  );

  return <>{content}</>;
};

export default UnderlineTextGenerator;
