import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const UnderlineTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    convertToUnderline(inputText);
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).filter(Boolean).length);
    setSentenceCount(text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length);
    setLineCount(text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).length);
  };

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
    setCharCount(0);
    setWordCount(0);
    setSentenceCount(0);
    setLineCount(0);
  };
  
  const handleDownload = () => {
    if (!outputText) return;
    
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "underlined-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Underline Text Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Underline Text Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Convert your text into underlined text using Unicode combining characters.
        </p>

        {/* Input and Output Textboxes */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col">
            <Textarea
              readOnly
              placeholder="Underlined text will appear here"
              value={outputText}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-2"
            />
            
            {/* Actions Row - Right aligned */}
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              <Button 
                variant="outline" 
                onClick={handleCopy} 
                disabled={!outputText}
                className="border-zinc-600"
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleDownload} 
                disabled={!outputText}
                className="border-zinc-600"
              >
                Download
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleClear}
                className="border-zinc-600"
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        {/* Stats Card */}
        <Card className="p-4 mb-4 bg-zinc-800 border-zinc-700">
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
              <span className="text-xs text-gray-400">Sentence Count</span>
              <span className="text-xl font-semibold">{sentenceCount}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Line Count</span>
              <span className="text-xl font-semibold">{lineCount}</span>
            </div>
          </div>
        </Card>
        
        {/* Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
            <TabsTrigger value="platforms" className="data-[state=active]:bg-zinc-700">Platform Compatibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Underline Text Generator</h3>
            <p className="mb-4">
              This tool uses Unicode combining characters to create underlined text that works across different platforms.
              Unlike HTML underlining, this method creates text that can be used in places where formatting isn't normally
              allowed, such as social media posts, messaging apps, or anywhere plain text is required.
            </p>
            <p className="mb-4">
              The underline effect is achieved using a special Unicode character (U+0332 - COMBINING LOW LINE) that
              is added after each character in your text. When displayed, this character appears as a line under the
              preceding character, creating the underline effect.
            </p>
            <p className="mb-4">
              Underlined text is commonly used to indicate:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Emphasis or importance</li>
              <li>Titles of works (in some style guides)</li>
              <li>Hyperlinks (in web contexts)</li>
              <li>Headings and key terms</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Type or paste your text in the input field on the left</li>
              <li>The underlined version will automatically appear on the right</li>
              <li>Use short to medium-length text for best results</li>
              <li>Copy the underlined text with the "Copy to Clipboard" button</li>
              <li>Use underlined text sparingly for maximum impact</li>
              <li>Combine with other text styles for creative effects</li>
              <li>Save your underlined text as a file using the "Download" button</li>
            </ul>
            <p className="text-sm text-gray-400">
              <strong>Tip:</strong> When using underlined text, remember that it's traditionally used to indicate 
              emphasis. Overusing underlined text can reduce its impact and make your content harder to read.
            </p>
          </TabsContent>
          
          <TabsContent value="platforms" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Platform Compatibility</h3>
            <p className="mb-4">
              Unicode underlined text works on many platforms, but support can vary:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Card className="p-3 bg-zinc-700 border-zinc-600">
                <h4 className="font-medium mb-2">Good Support</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Most modern browsers</li>
                  <li>Discord</li>
                  <li>Twitter/X</li>
                  <li>WhatsApp</li>
                  <li>Modern email clients</li>
                </ul>
              </Card>
              
              <Card className="p-3 bg-zinc-700 border-zinc-600">
                <h4 className="font-medium mb-2">Partial Support</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Facebook (may display inconsistently)</li>
                  <li>Instagram</li>
                  <li>Older email clients</li>
                  <li>Some mobile apps</li>
                  <li>Reddit</li>
                </ul>
              </Card>
              
              <Card className="p-3 bg-zinc-700 border-zinc-600">
                <h4 className="font-medium mb-2">Limited Support</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>SMS text messages</li>
                  <li>Very old browsers</li>
                  <li>Some terminal applications</li>
                  <li>E-book readers</li>
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
