import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";
import { Copy, Check } from "lucide-react"; // Import icons if needed

// Define About and Usage content separately for clarity and SEO
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Underline Text Generator</h3>
    <p className="mb-4">
      Generate u̲n̲d̲e̲r̲l̲i̲n̲e̲d̲ text that you can copy and paste anywhere online with our free Underline Text Generator. This tool uses a special Unicode combining character (U+0332 COMBINING LOW LINE) to add an underline beneath each character of your text.
    </p>
    <p className="mb-4">
      Unlike standard formatting (like HTML's {'<u>'} tag or Markdown's __text__), this Unicode underline works in many places where text formatting isn't usually supported, such as social media bios (Instagram, Twitter), comments, chat messages (Discord, WhatsApp), and more.
    </p>
     <p className="mb-4">
      Use it to add emphasis, indicate titles (in some contexts), or simply create a unique visual style for your text online.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">underline text generator, unicode underline, copy paste underline, text decorator, social media fonts, line under text generator</p>
  </>
);

const usageTipsContent = (
   <>
    <h3 className="font-medium mb-2">How to Use the Underline Text Generator</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to underline into the input box on the left.</li>
      <li><strong>Instant Underline:</strong> The text will automatically appear with an underline beneath each character in the output box on the right.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the generated underlined text.</li>
      <li><strong>Paste Anywhere:</strong> Use the underlined text on Facebook, Instagram, Twitter, Discord, or any platform supporting Unicode combining characters.</li>
      <li><strong>Emphasis:</strong> Use underline to draw attention to specific words or phrases, but use it sparingly to avoid clutter.</li>
      <li><strong>Download Option:</strong> Use the "Download" button to save the underlined text as a .txt file.</li>
      <li><strong>Clear Input:</strong> Click "Clear" to easily start over.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Note: The appearance of the underline (position, thickness, gaps between characters) might vary depending on the font, device, and platform displaying the text.
    </p>
  </>
);


const UnderlineTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0); // Keep for consistency
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    convertToUnderline(inputText);
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setSentenceCount(text ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0);
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  const convertToUnderline = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }
    // Use spread operator for multi-byte character safety
    // U+0332 COMBINING LOW LINE
    const result = [...text].map((char) => char + "\u0332").join("");
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
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain;charset=utf-8" }); // Specify charset
    element.href = URL.createObjectURL(file);
    element.download = "underlined-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Underline Text Generator" hideHeader={true}>
      <div className="w-full"> {/* Use w-full div */}
        <h1 className="text-3xl font-bold mb-2">Underline Text Generator</h1>
        <p className="text-gray-300 mb-6"> {/* Use consistent text color */}
          {/* Plain text example */}
          Convert your text into u̲n̲d̲e̲r̲l̲i̲n̲e̲d̲ text using Unicode.
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
                placeholder="U̲n̲d̲e̲r̲l̲i̲n̲e̲d̲ ̲t̲e̲x̲t̲ ̲w̲i̲l̲l̲ ̲a̲p̲p̲e̲a̲r̲ ̲h̲e̲r̲e̲" // Underlined placeholder
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

        {/* Standard About/Usage Tabs + Platform Compatibility */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6"> {/* Add margin-top */}
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-zinc-700">Platform Compatibility</TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {aboutContent}
          </TabsContent>
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            {usageTipsContent}
          </TabsContent>
           {/* Keep the existing Platform Compatibility Tab */}
           <TabsContent value="platforms" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
             <h3 className="font-medium mb-2">Platform Compatibility</h3>
             <p className="mb-4">
               Unicode underlined text works on many platforms, but support can vary:
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <Card className="p-3 bg-zinc-700 border-zinc-600">
                 <h4 className="font-medium mb-2">Good Support</h4>
                 <ul className="list-disc pl-5 space-y-1 text-sm">
                   <li>Most modern browsers</li> <li>Discord</li> <li>Twitter/X</li>
                   <li>WhatsApp</li> <li>Modern email clients</li>
                 </ul>
               </Card>
               <Card className="p-3 bg-zinc-700 border-zinc-600">
                 <h4 className="font-medium mb-2">Partial Support</h4>
                 <ul className="list-disc pl-5 space-y-1 text-sm">
                   <li>Facebook (may display inconsistently)</li> <li>Instagram</li>
                   <li>Older email clients</li> <li>Some mobile apps</li> <li>Reddit</li>
                 </ul>
               </Card>
               <Card className="p-3 bg-zinc-700 border-zinc-600">
                 <h4 className="font-medium mb-2">Limited Support</h4>
                 <ul className="list-disc pl-5 space-y-1 text-sm">
                   <li>SMS text messages</li> <li>Very old browsers</li>
                   <li>Some terminal applications</li> <li>E-book readers</li>
                   <li>Some forum software</li>
                 </ul>
               </Card>
             </div>
             <p className="text-sm text-gray-400">
               Note: If the platform doesn't support Unicode combining characters, the text will still be readable,
               but the underline effect may display incorrectly or not at all.
             </p>
           </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default UnderlineTextGenerator;
