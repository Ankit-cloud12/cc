import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const getCharPattern = (char: string) => {
  const patterns: { [key: string]: string[] } = {
    'A': [
      "  /\\  ",
      " /  \\ ",
      "/----\\",
      "|    |",
      "|    |"
    ],
    'B': [
      "|--\\ ",
      "|   \\",
      "|--< ",
      "|   \\",
      "|--/ "
    ],
    'C': [
      " /--",
      "/   ",
      "|   ",
      "\\   ",
      " \\--"
    ],
    'D': [
      "|--\\ ",
      "|   \\",
      "|   |",
      "|   /",
      "|--/ "
    ],
    'E': [
      "|---",
      "|   ",
      "|---",
      "|   ",
      "|---"
    ],
    'F': [
      "|---",
      "|   ",
      "|---",
      "|   ",
      "|   "
    ],
    'G': [
      " /--",
      "/   ",
      "| --",
      "|  |",
      " \\-/"
    ],
    'H': [
      "|  |",
      "|  |",
      "|--|",
      "|  |",
      "|  |"
    ],
    'I': [
      "---",
      " | ",
      " | ",
      " | ",
      "---"
    ],
    'J': [
      "   |",
      "   |",
      "   |",
      "/  |",
      " \\-/"
    ],
    'K': [
      "|  /",
      "| / ",
      "|< ",
      "| \\ ",
      "|  \\"
    ],
    'L': [
      "|   ",
      "|   ",
      "|   ",
      "|   ",
      "|---"
    ],
    'M': [
      "|\\  /|",
      "| \\/ |",
      "|    |",
      "|    |",
      "|    |"
    ],
    'N': [
      "|\\  |",
      "| \\ |",
      "|  \\|",
      "|   |",
      "|   |"
    ],
    'O': [
      " /--\\",
      "/    \\",
      "|    |",
      "\\    /",
      " \\--/ "
    ],
    'P': [
      "|---\\",
      "|   |",
      "|---/",
      "|    ",
      "|    "
    ],
    'Q': [
      " /--\\",
      "/    \\",
      "|    |",
      "\\  \\/",
      " \\--\\"
    ],
    'R': [
      "|---\\",
      "|   |",
      "|---/",
      "| \\  ",
      "|  \\ "
    ],
    'S': [
      " /--",
      "/   ",
      " \\--",
      "   /",
      "\\-/ "
    ],
    'T': [
      "-----",
      "  |  ",
      "  |  ",
      "  |  ",
      "  |  "
    ],
    'U': [
      "|   |",
      "|   |",
      "|   |",
      "\\   /",
      " \\-/ "
    ],
    'V': [
      "\\   /",
      "\\   /",
      " \\ / ",
      " \\ / ",
      "  V  "
    ],
    'W': [
      "|   |",
      "|   |",
      "|   |",
      "| / |",
      "|/ \\|"
    ],
    'X': [
      "\\  /",
      " \\/ ",
      " /\\ ",
      "/  \\",
      "    "
    ],
    'Y': [
      "\\  /",
      " \\/ ",
      "  | ",
      "  | ",
      "  | "
    ],
    'Z': [
      "----",
      "   /",
      "  / ",
      " /  ",
      "/---"
    ],
    '0': [
      " /--\\",
      "/   |",
      "|   |",
      "|   /",
      " \\-/ "
    ],
    '1': [
      " /| ",
      "/ | ",
      "  | ",
      "  | ",
      "----|"
    ],
    '2': [
      " /--\\",
      "/   /",
      "   / ",
      "  /  ",
      " /---"
    ],
    '3': [
      " /--\\",
      "    |",
      "  --/",
      "    \\",
      " \\--/"
    ],
    '4': [
      "   /|",
      "  / |",
      " /  |",
      "/----|",
      "    |"
    ],
    '5': [
      "|---",
      "|   ",
      "|---",
      "   |",
      "\\--/"
    ],
    '6': [
      " /--",
      "/   ",
      "|--\\",
      "|  |",
      " \\-/"
    ],
    '7': [
      "----",
      "   /",
      "  / ",
      " /  ",
      "/   "
    ],
    '8': [
      " /--\\",
      "|   |",
      " \\-/ ",
      "/   \\",
      "\\---/"
    ],
    '9': [
      " /--\\",
      "/   |",
      " \\--|",
      "    |",
      " \\--/"
    ]
  };
  return patterns[char] || [
    "     ",
    "     ",
    `  ${char}  `,
    "     ",
    "     "
  ];
};

const BigTextGenerator = () => {
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
    convertToBig(inputText);
    countStats(inputText);
  }, [inputText]);

  const countStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    setSentenceCount(text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length);
    setLineCount(text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).filter(Boolean).length);
  };

  const convertToBig = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    const lines = text.split('\n');
    let result = '';

    for (const line of lines) {
      const words = line.split(' ');
      const lineOutput = Array(5).fill('');
      
      for (const word of words) {
        const charPatterns = [];
        
        // Get patterns for each character in the word
        for (let i = 0; i < word.length; i++) {
          const char = word[i].toUpperCase();
          charPatterns.push(getCharPattern(char));
        }
        
        // Combine characters side by side
        for (let row = 0; row < 5; row++) {
          lineOutput[row] += charPatterns.map(pattern => pattern[row]).join('');
          if (word !== words[words.length - 1]) {
            lineOutput[row] += '  '; // Space between words
          }
        }
      }
      
      // Add all rows for this line
      for (let row = 0; row < 5; row++) {
        result += lineOutput[row] + '\n';
      }
      result += '\n'; // Add extra line between paragraphs
    }

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

  // Generate a download for the output text
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "big-text.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    // Added ToolLayout wrapper
    <ToolLayout title="Big Text Generator" hideHeader={true}> 
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-2">Big Text Generator</h1>
        <p className="text-gray-300 mb-6">
          Convert your text into outlined big text that you can use on social
          media, messages, and more.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <div className="w-full">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />

            {/* Stats Card */}
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

          {/* Result Section */}
          <div className="w-full">
            <div className="h-full flex flex-col">
              <Textarea
                readOnly
                placeholder="Big text will appear here"
                value={outputText}
                className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize font-mono mb-4"
              />
              
              {/* Actions Row */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleDownload} 
                  disabled={!outputText}
                >
                  Download
                </Button>
                
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
                  onClick={handleClear}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                >
                  Clear
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Big Text Generator</h3>
            <p className="mb-4">
              This tool converts your regular text into outlined ASCII art characters.
              These characters create a distinctive outlined appearance that can make
              your text stand out. Perfect for adding emphasis to messages, creating
              banners, or bringing attention to important text.
            </p>
            {/* Corrected the paragraph tag issue */}
            <p className="mb-4"> 
              The big text generated is compatible with most platforms including
              Facebook, Twitter, Instagram, TikTok, Discord, and more - anywhere
              that allows for fixed-width text formatting.
            </p>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Type or paste your text in the input box on the left</li>
              <li>The big text version will automatically appear on the right</li>
              <li>For best results, use capital letters and numbers</li>
              <li>Keep your text short for more readable results</li>
              <li>Use the "Copy to Clipboard" button to copy the big text</li>
              <li>For maximum compatibility, use a monospace font when pasting</li>
              <li>For longer text, use the "Download" button to save as a text file</li>
            </ul>
            
            <p className="text-sm text-gray-400">
              Note: Big text works best in environments where monospace fonts are used, like code editors,
              terminal windows, or plain text editors. Some platforms may not display the text correctly
              if they don't use fixed-width fonts.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default BigTextGenerator;
