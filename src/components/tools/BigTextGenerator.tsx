import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "./ToolLayout";

const getCharPattern = (char: string) => {
  const patterns: { [key: string]: string[] } = {
    'A': [
      " _    ",
      "/ \\   ",
      "/ _ \\  ",
      "/ ___ \\ ",
      "/_/   \\_\\"
    ],
    'B': [
      "┌─┐",
      "│ │",
      "├─┤",
      "│ │",
      "└─┘"
    ],
    'C': [
      "┌─┐",
      "│ │",
      "│  ",
      "│ │",
      "└─┘"
    ],
    'D': [
      "┌─┐",
      "│ │",
      "│ │",
      "│ │",
      "└─┘"
    ],
    'E': [
      "┌─┐",
      "│  ",
      "├─ ",
      "│  ",
      "└─┘"
    ],
    'F': [
      "┌─┐",
      "│  ",
      "├─ ",
      "│  ",
      "└  "
    ],
    'G': [
      "┌─┐",
      "│  ",
      "│ ┐",
      "│ │",
      "└─┘"
    ],
    'H': [
      "┌ ┐",
      "│ │",
      "├─┤",
      "│ │",
      "└ ┘"
    ],
    'I': [
      "┌┐",
      "││",
      "││",
      "││",
      "└┘"
    ],
    'J': [
      "┌┐",
      "││",
      "││",
      "││",
      "└┘"
    ],
    'K': [
      "┌┐",
      "││",
      "├┤",
      "││",
      "└┘"
    ],
    'L': [
      "┌   ",
      "│   ",
      "│   ",
      "│   ",
      "└───"
    ],
    'M': [
      "┌   ┐",
      "│\\ /│",
      "│ V │",
      "│   │",
      "└   ┘"
    ],
    'N': [
      "┌   ┐",
      "│\\  │",
      "│ \\ │",
      "│  \\│",
      "└   ┘"
    ],
    'O': [
      "┌───┐",
      "│   │",
      "│   │",
      "│   │",
      "└───┘"
    ],
    'P': [
      "┌───┐",
      "│   │",
      "├───┘",
      "│    ",
      "└    "
    ],
    'Q': [
      "┌───┐",
      "│   │",
      "│   │",
      "│  \\",
      "└───┘"
    ],
    'R': [
      "┌───┐",
      "│   │",
      "├───┘",
      "│ \\  ",
      "└  ┘ "
    ],
    'S': [
      "┌───┐",
      "│    ",
      "└───┐",
      "    │",
      "└───┘"
    ],
    'T': [
      "┌─┐",
      " │ ",
      " │ ",
      " │ ",
      " └ "
    ],
    'U': [
      "┌   ┐",
      "│   │",
      "│   │",
      "│   │",
      "└───┘"
    ],
    'V': [
      "┌   ┐",
      "\\   /",
      " \\ / ",
      "  V  ",
      "     "
    ],
    'W': [
      "┌   ┐",
      "│   │",
      "│ │ │",
      "│\\│/│",
      "└─┴─┘"
    ],
    'X': [
      "\\   /",
      " \\ / ",
      "  X  ",
      " / \\ ",
      "/   \\"
    ],
    'Y': [
      "\\   /",
      " \\ / ",
      "  │  ",
      "  │  ",
      "  └  "
    ],
    'Z': [
      "┌───┐",
      "   / ",
      "  /  ",
      " /   ",
      "└───┘"
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
      const wordPatterns = words.map(word => {
        const pattern = [];
        for (let i = 0; i < word.length; i++) {
          const char = word[i].toUpperCase();
          const charPattern = getCharPattern(char);
          pattern.push(...charPattern);
        }

        // Combine characters horizontally
        const combined = [];
        for (let i = 0; i < 5; i++) {
          combined.push(pattern.map(p => p.split('\n')[i] || p[i]).join(' '));
        }
        return combined;
      });

      // Combine words with spacing
      for (let i = 0; i < 5; i++) {
        result += wordPatterns.map(w => w[i]).join('  ') + '\n';
      }
      result += '\n';
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

  const content = (
    <>
      <h1 className="text-3xl font-bold mb-2">Big Text Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text into outlined big text that you can use on social
        media, messages, and more.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex flex-col">
          <Textarea
            placeholder="Type or paste your text here"
            className="w-full flex-grow min-h-[200px] bg-zinc-700 text-white border-zinc-600 p-4 rounded"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="text-sm text-gray-400 mt-2">
            Character Count: {charCount} | Word Count: {wordCount} | Sentence Count: {sentenceCount} | Line Count: {lineCount}
          </div>
        </div>

        <div className="flex flex-col">
          <Textarea
            readOnly
            className="w-full flex-grow min-h-[200px] bg-zinc-700 text-white border-zinc-600 p-4 rounded font-mono"
            value={outputText}
            placeholder="Big text will appear here"
          />
          
          <div className="grid grid-cols-2 gap-2 mt-2">
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
        </div>
      </div>

      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Big Text Generator</h2>
        <p className="text-gray-300 mb-4">
          This tool converts your regular text into outlined Unicode characters.
          These special Unicode characters create a distinctive outlined appearance
          that can make your text stand out. This means they can be used in places
          where formatting isn't normally allowed, like social media profiles,
          messages, and usernames.
        </p>
        <p className="text-gray-300 mb-4">
          The outlined text generated is compatible with most platforms including
          Facebook, Twitter, Instagram, TikTok, Discord, and more.
        </p>
      </div>
    </>
  );

  return <ToolLayout title="Big Text Generator" hideHeader={true}>{content}</ToolLayout>;
};

export default BigTextGenerator;
