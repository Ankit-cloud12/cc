import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";

const ZalgoTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [intensity, setIntensity] = useState(50); // Default intensity level (0-100)

  useEffect(() => {
    updateCounts(inputText);
    setOutputText(generateZalgoText(inputText, intensity));
  }, [inputText, intensity]);

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    setWordCount(text ? text.trim().split(/\s+/).filter(Boolean).length : 0);
    setSentenceCount(
      text ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0
    );
    setLineCount(text ? text.split(/\r\n|\r|\n/).length : 0);
  };

  // Zalgo text generation function
  const generateZalgoText = (text: string, intensityLevel: number) => {
    if (!text) return "";
    
    // Combining marks for above, middle, and below
    const above = [
      '\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310', 
      '\u0352', '\u0357', '\u0351', '\u0307', '\u0308', '\u030a', '\u0342', '\u0343',
      '\u0344', '\u034a', '\u034b', '\u034c', '\u0303', '\u0302', '\u030c', '\u0350',
      '\u0300', '\u0301', '\u030b', '\u030f', '\u0312', '\u0313', '\u0314', '\u033d',
      '\u0309', '\u0363', '\u0364', '\u0365', '\u0366', '\u0367', '\u0368', '\u0369',
      '\u036a', '\u036b', '\u036c', '\u036d', '\u036e', '\u036f', '\u033e', '\u035b'
    ];
    
    const middle = [
      '\u0315', '\u031b', '\u0340', '\u0341', '\u0358', '\u0321', '\u0322', '\u0327',
      '\u0328', '\u0334', '\u0335', '\u0336', '\u034f', '\u035c', '\u035d', '\u035e',
      '\u035f', '\u0360', '\u0362', '\u0338', '\u0337', '\u0361', '\u0489'
    ];
    
    const below = [
      '\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u031e', '\u031f',
      '\u0320', '\u0324', '\u0325', '\u0326', '\u0329', '\u032a', '\u032b', '\u032c',
      '\u032d', '\u032e', '\u032f', '\u0330', '\u0331', '\u0332', '\u0333', '\u0339',
      '\u033a', '\u033b', '\u033c', '\u0345', '\u0347', '\u0348', '\u0349', '\u034d',
      '\u034e', '\u0353', '\u0354', '\u0355', '\u0356', '\u0359', '\u035a', '\u0323'
    ];

    // Calculate how many combining characters to add based on intensity
    const normalizedIntensity = intensityLevel / 100;
    const maxMarks = Math.floor(normalizedIntensity * 15) + 1; // 1-15 marks depending on intensity
    
    let result = "";
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      result += char;
      
      // Skip zalgo-ing spaces and newlines
      if (char === ' ' || char === '\n' || char === '\r') continue;
      
      // Add above marks
      const aboveCount = Math.floor(Math.random() * maxMarks);
      for (let j = 0; j < aboveCount; j++) {
        result += above[Math.floor(Math.random() * above.length)];
      }
      
      // Add middle marks
      const middleCount = Math.floor(Math.random() * maxMarks / 2); // Fewer middle marks
      for (let j = 0; j < middleCount; j++) {
        result += middle[Math.floor(Math.random() * middle.length)];
      }
      
      // Add below marks
      const belowCount = Math.floor(Math.random() * maxMarks);
      for (let j = 0; j < belowCount; j++) {
        result += below[Math.floor(Math.random() * below.length)];
      }
    }
    
    return result;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadText = () => {
    if (!outputText) return;

    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `zalgo-text.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleIntensityChange = (value: number[]) => {
    setIntensity(value[0]);
  };

  return (
    <div className="w-full bg-zinc-800 text-white min-h-screen">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Zalgo Glitch Text Generator</h1>
        <p className="text-gray-400 mb-6">
          A handy online free glitch generator that will turn your standard text into zalgo text (which gives it the glitchy look below).
        </p>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder="Type or paste your content here"
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
              value={inputText}
              onChange={handleInputChange}
            />
            <div className="text-sm text-gray-400 mb-4">
              Character Count: {charCount} | Word Count: {wordCount} | Sentence Count:{" "}
              {sentenceCount} | Line Count: {lineCount}
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <Textarea
              readOnly
              placeholder="Zalgo text will appear here"
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
              value={outputText}
            />
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <Button
                onClick={handleCopy}
                className={cn(
                  "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto",
                  copied && "bg-green-600 hover:bg-green-700"
                )}
              >
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <Button
                onClick={handleDownloadText}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto"
                disabled={!outputText}
              >
                Download Text
              </Button>
            </div>
          </div>
        </div>

        <div className="my-8">
          <h2 className="text-xl font-semibold mb-2">Craziness Level:</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm">Mild</span>
            <Slider 
              defaultValue={[50]} 
              max={100} 
              step={1} 
              className="w-full max-w-xs" 
              onValueChange={handleIntensityChange}
            />
            <span className="text-sm">Extreme</span>
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">What is Zalgo?</h2>
          <p className="text-gray-300 mb-4">
            Zalgo is a fictional character, while Zalgo text aka glitchy text is a combination of multiple characters to each letter. 
            In other words, one can easily generate creepy Zalgo text by adding special combining marks to each letter or string.
          </p>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">How to Use the Zalgo Text Generator?</h2>
          <ol className="list-decimal list-inside text-gray-300 space-y-2 mb-6">
            <li>Start typing your text into the field on the left.</li>
            <li>As you type - you will notice the text starting to get glitchy in the right field.</li>
            <li>Adjust the "Craziness Level" slider to control how distorted the text becomes.</li>
            <li>You can copy the Zalgo text using the "Copy to Clipboard" button.</li>
            <li>Then paste it wherever you desire such as Facebook, Twitter, and Instagram.</li>
          </ol>
          
          <h2 className="text-2xl font-bold mb-4 mt-8">About Zalgo Text</h2>
          <p className="text-gray-300 mb-4">
            Zalgo Text is a distorted version of normal text that looks scary or glitchy. These texts are often used in memes, 
            social media posts, or anywhere you want to create a creepy or unique styled effect. They use special Unicode 
            combining characters that stack above and below normal letters, creating the distinctive glitched appearance.
          </p>
          
          <p className="text-gray-300 mb-4">
            Computer font systems allow special types of placements of marks (above, through, or below) on any character. 
            This text generator uses Unicode combining characters to add multiple diacritical marks to each letter in your text, 
            resulting in the distinctive glitched and distorted appearance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZalgoTextGenerator;