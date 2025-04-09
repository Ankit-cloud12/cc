In italic text generator, input window should be equal to the size of output window. Keep both identical to each other in terms of length and breadth.import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";
import { Copy, Check } from "lucide-react"; // Import icons if needed

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Reverse Text Generator</h3>
    <p className="mb-4">
      Flip your text backward instantly with our free Reverse Text Generator. This tool reverses the order of all characters in your text, making it read from right to left (.txet sdrawkcab daer ti sekam).
    </p>
    <p className="mb-4">
      It's a simple and fun way to create backward messages, encode text playfully, or generate text for puzzles and games. Unlike mirror text, this tool only reverses the character order without changing the characters themselves (unless combined with other effects).
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">reverse text generator, text reverser, backward text, flip text, reverse string, online text tool, copy paste backward text</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Reverse Text Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to reverse into the input box on the left.</li>
      <li><strong>Instant Reversal:</strong> The text will automatically appear backward in the output box on the right.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the reversed text.</li>
      <li><strong>Paste Anywhere:</strong> Use the backward text in messages, social media, code comments, or anywhere you like.</li>
      <li><strong>Download Option:</strong> Use the "Download" button to save the reversed text as a .txt file.</li>
      <li><strong>Clear Input:</strong> Click "Clear" to easily start over with new text.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: Try reversing palindromes (like "racecar" or "madam") to see if they still read the same!
    </p>
  </>
);


const ReverseTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0); // Keep if needed, though less relevant for reversed text
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    reverseText(inputText);
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setSentenceCount(text ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0);
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const reverseText = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }
    // Reverse the text - handles multi-byte characters correctly
    const result = [...text].reverse().join("");
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
    // Stats cleared via useEffect
  };
  
  const handleDownload = () => {
    if (!outputText) return;

    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain;charset=utf-8" }); // Specify charset
    element.href = URL.createObjectURL(file);
    element.download = "reversed-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Reverse Text Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Reverse Text Generator</h1>
        <p className="text-gray-300 mb-6"> {/* Use consistent text color */}
          Reverse the order of characters in your text - make it read backwards (.sdrawkcab daer ti ekam).
        </p>

        {/* Use two-column grid layout */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section (Left Column) */}
          <div className="w-full">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize" // Standard styling
            />
            {/* Stats Card Below Input */}
            <Card className="p-4 mt-4 bg-zinc-800 border-zinc-700">
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Character Count</span>
                  <span className="text-xl font-semibold">{charCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Word Count</span>
                  <span className="text-xl font-semibold">{wordCount}</span>
                </div>
                {/* Sentence count might be less useful here, but keep for consistency */}
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Sentence Count</span>
                  <span className="text-xl font-semibold">{sentenceCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400">Line Count</span>
                  <span className="text-xl font-semibold">{lineCount}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Output Section (Right Column) */}
          <div className="w-full">
            <div className="h-full flex flex-col"> {/* Ensure full height */}
              <Textarea
                readOnly
                placeholder=".ereh raeppa lliw txet desreveR" // Reversed placeholder
                value={outputText}
                className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-4 flex-grow" // Standard styling, mb-4, flex-grow
              />
              {/* Action Buttons Below Output Area */}
              <div className="flex flex-wrap gap-2 justify-end mt-auto"> {/* Use mt-auto */}
                {/* Consistent Button Styles */}
                <Button
                  variant="outline"
                  onClick={handleCopy}
                  disabled={!outputText}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  disabled={!outputText}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Standard About/Usage Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6"> {/* Add margin-top */}
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {aboutContent}
          </TabsContent>
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {usageTipsContent}
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default ReverseTextGenerator;
