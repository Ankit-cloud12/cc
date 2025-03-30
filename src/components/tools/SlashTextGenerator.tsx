import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const SlashTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToSlashText(inputText);
  }, [inputText]);

  const convertToSlashText = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Add slashes between characters
    const result = text.split("").join("/");
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
      <h1 className="text-3xl font-bold mb-2">Slash Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text by adding slashes between characters.
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
        placeholder="Slash text will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Slash Text Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool adds slashes between each character in your text, creating a
          unique visual effect that can be used for stylistic purposes.
        </p>
        <p className="text-gray-300 mb-4">Slash text is commonly used in:</p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Social media bios and posts</li>
          <li>Aesthetic text styling</li>
          <li>Creative typography</li>
          <li>Usernames and display names</li>
        </ul>
      </div>
    </>
  );

  return content;
};

export default SlashTextGenerator;
