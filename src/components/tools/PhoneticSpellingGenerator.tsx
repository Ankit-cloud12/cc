import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const PhoneticSpellingGenerator = () => {
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
    convertToPhonetic(inputText);
    updateStats(inputText);
  }, [inputText]);

  const updateStats = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    setSentenceCount(text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length);
    setLineCount(text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).length);
  };

  const convertToPhonetic = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Simple "sounds like" phonetic mapping
    const phoneticMap: { [key: string]: string } = {
      a: "Alpha",
      b: "Bravo",
      c: "Charlie",
      d: "Delta",
      e: "Echo",
      f: "Foxtrot",
      g: "Golf",
      h: "Hotel",
      i: "India",
      j: "Juliet",
      k: "Kilo",
      l: "Lima",
      m: "Mike",
      n: "November",
      o: "Oscar",
      p: "Papa",
      q: "Quebec",
      r: "Romeo",
      s: "Sierra",
      t: "Tango",
      u: "Uniform",
      v: "Victor",
      w: "Whiskey",
      x: "X-ray",
      y: "Yankee",
      z: "Zulu",
      A: "Alpha",
      B: "Bravo",
      C: "Charlie",
      D: "Delta",
      E: "Echo",
      F: "Foxtrot",
      G: "Golf",
      H: "Hotel",
      I: "India",
      J: "Juliet",
      K: "Kilo",
      L: "Lima",
      M: "Mike",
      N: "November",
      O: "Oscar",
      P: "Papa",
      Q: "Quebec",
      R: "Romeo",
      S: "Sierra",
      T: "Tango",
      U: "Uniform",
      V: "Victor",
      W: "Whiskey",
      X: "X-ray",
      Y: "Yankee",
      Z: "Zulu",
      "0": "Zero",
      "1": "One",
      "2": "Two",
      "3": "Three",
      "4": "Four",
      "5": "Five",
      "6": "Six",
      "7": "Seven",
      "8": "Eight",
      "9": "Nine",
    };

    // Convert text to phonetic spelling
    const result = text
      .split("")
      .map((char) => {
        // If the character is a letter or number, convert it to phonetic
        if (phoneticMap[char]) {
          return `${char} - ${phoneticMap[char]}`;
        }
        // For spaces, add a line break
        else if (char === " ") {
          return "\n";
        }
        // For other characters, keep them as is
        else {
          return char;
        }
      })
      .join("\n");
    
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
    element.download = "phonetic-spelling.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Phonetic Spelling Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Phonetic Spelling Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Convert your text into easy-to-read phonetic spellings for better communication.
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
              placeholder="Phonetic spelling will appear here"
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
            <TabsTrigger value="nato" className="data-[state=active]:bg-zinc-700">NATO Alphabet</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Phonetic Spelling Generator</h3>
            <p className="mb-4">
              The Phonetic Spelling Generator converts your text into the NATO phonetic alphabet, 
              making it easier to communicate letters and numbers clearly. Each character is 
              represented by a standardized word (A - Alpha, B - Bravo, C - Charlie, etc.).
            </p>
            <p className="mb-4">
              The phonetic alphabet is widely used in aviation, military, law enforcement, and emergency services
              to avoid miscommunication, especially over radio or telephone where certain letters might sound similar.
            </p>
            <p className="mb-4">
              This tool is particularly useful for:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Spelling out names or addresses over the phone</li>
              <li>Communicating codes, serial numbers, or passwords verbally</li>
              <li>Teaching proper pronunciation of the phonetic alphabet</li>
              <li>Training for jobs that require use of radio communication</li>
              <li>Ensuring accurate communication in noisy environments</li>
            </ul>
          </TabsContent>
          
          <TabsContent value="nato" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">NATO Phonetic Alphabet</h3>
            <p className="mb-4">
              The NATO phonetic alphabet, officially known as the International Radiotelephony Spelling Alphabet, 
              provides a standard set of words to represent letters in oral communication:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <div className="p-2 bg-zinc-700 rounded">A - Alpha</div>
              <div className="p-2 bg-zinc-700 rounded">B - Bravo</div>
              <div className="p-2 bg-zinc-700 rounded">C - Charlie</div>
              <div className="p-2 bg-zinc-700 rounded">D - Delta</div>
              <div className="p-2 bg-zinc-700 rounded">E - Echo</div>
              <div className="p-2 bg-zinc-700 rounded">F - Foxtrot</div>
              <div className="p-2 bg-zinc-700 rounded">G - Golf</div>
              <div className="p-2 bg-zinc-700 rounded">H - Hotel</div>
              <div className="p-2 bg-zinc-700 rounded">I - India</div>
              <div className="p-2 bg-zinc-700 rounded">J - Juliet</div>
              <div className="p-2 bg-zinc-700 rounded">K - Kilo</div>
              <div className="p-2 bg-zinc-700 rounded">L - Lima</div>
              <div className="p-2 bg-zinc-700 rounded">M - Mike</div>
              <div className="p-2 bg-zinc-700 rounded">N - November</div>
              <div className="p-2 bg-zinc-700 rounded">O - Oscar</div>
              <div className="p-2 bg-zinc-700 rounded">P - Papa</div>
              <div className="p-2 bg-zinc-700 rounded">Q - Quebec</div>
              <div className="p-2 bg-zinc-700 rounded">R - Romeo</div>
              <div className="p-2 bg-zinc-700 rounded">S - Sierra</div>
              <div className="p-2 bg-zinc-700 rounded">T - Tango</div>
              <div className="p-2 bg-zinc-700 rounded">U - Uniform</div>
              <div className="p-2 bg-zinc-700 rounded">V - Victor</div>
              <div className="p-2 bg-zinc-700 rounded">W - Whiskey</div>
              <div className="p-2 bg-zinc-700 rounded">X - X-ray</div>
              <div className="p-2 bg-zinc-700 rounded">Y - Yankee</div>
              <div className="p-2 bg-zinc-700 rounded">Z - Zulu</div>
            </div>
            
            <p className="mb-4">For numbers, the standard pronunciation is:</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
              <div className="p-2 bg-zinc-700 rounded">0 - Zero</div>
              <div className="p-2 bg-zinc-700 rounded">1 - One</div>
              <div className="p-2 bg-zinc-700 rounded">2 - Two</div>
              <div className="p-2 bg-zinc-700 rounded">3 - Three</div>
              <div className="p-2 bg-zinc-700 rounded">4 - Four</div>
              <div className="p-2 bg-zinc-700 rounded">5 - Five</div>
              <div className="p-2 bg-zinc-700 rounded">6 - Six</div>
              <div className="p-2 bg-zinc-700 rounded">7 - Seven</div>
              <div className="p-2 bg-zinc-700 rounded">8 - Eight</div>
              <div className="p-2 bg-zinc-700 rounded">9 - Nine</div>
            </div>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Type any text in the input field to instantly see its phonetic spelling</li>
              <li>When reading phonetic spelling over the phone, pronounce each word clearly</li>
              <li>For spelling names, say "Name spelled: [phonetic spelling]"</li>
              <li>For complex technical terms, first say the word, then spell it phonetically</li>
              <li>When communicating passwords, you can say "Password is: [phonetic spelling]"</li>
              <li>Practice pronouncing the phonetic alphabet words correctly for best results</li>
              <li>Use the "Copy to Clipboard" button to easily share the phonetic version</li>
              <li>The "Download" button lets you save the phonetic spelling as a text file</li>
            </ul>
            <p className="text-sm text-gray-400">
              Pro tip: When communicating important information like confirmation numbers, 
              it's good practice to both spell it phonetically and then repeat the whole number 
              or word again to double-check accuracy.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default PhoneticSpellingGenerator;
