import { useState, useEffect } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from './ToolLayout';

const INVISIBLE_CHARACTERS = [
  '\u2800', // Braille Pattern Blank
  '\u200B', // Zero Width Space
  '\u200C', // Zero Width Non-joiner
  '\u200D', // Zero Width Joiner
  '\u3164', // Hangul Filler
  '\uFEFF', // Zero Width No-Break Space
];

interface TextStats {
  chars: number;
  words: number;
  sentences: number;
  lines: number;
}

export default function InvisibleTextGenerator() {
  const [inputText, setText] = useState('');
  const [outputText, setInvisibleText] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [stats, setStats] = useState<TextStats>({ chars: 0, words: 0, sentences: 0, lines: 0 });

  useEffect(() => {
    updateStats(outputText);
  }, [outputText]);

  const updateStats = (text: string) => {
    const stats = {
      chars: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      sentences: text.trim() ? text.trim().split(/[.!?]+/).filter(Boolean).length : 0,
      lines: text.trim() ? text.trim().split(/\r\n|\r|\n/).length : 0
    };
    setStats(stats);
  };

  const generateInvisibleText = () => {
    let result = '';
    const originalText = inputText; // Store original text for decoding
    for (let i = 0; i < inputText.length; i++) {
      // Rotate through different invisible characters for variety
      result += INVISIBLE_CHARACTERS[i % INVISIBLE_CHARACTERS.length];
    }
    setInvisibleText(result);
    // Store the original text in a data attribute for decoding
    localStorage.setItem('lastOriginalText', originalText);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([outputText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'invisible-text.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const decodeInvisibleText = () => {
    // Retrieve the original text that was used to generate invisible text
    const originalText = localStorage.getItem('lastOriginalText');
    if (originalText) {
      setText(originalText);
    } else {
      // If original text is not found, show a message
      setText('(Original text not available)');
    }
  };

  const handleClear = () => {
    setText('');
    setInvisibleText('');
  };

  return (
    <ToolLayout title="Invisible Text Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Invisible Text Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Generate invisible text that can be copied and pasted anywhere. For each character you enter, 
          an invisible character will be produced.
        </p>

        {/* Input and Output Textboxes */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2 flex flex-col">
            <Textarea
              placeholder="Type or paste your text here"
              value={inputText}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-2"
            />
            
            {/* Generate Button - Placed below input box */}
            <div className="flex mb-4">
              <Button 
                onClick={generateInvisibleText} 
                disabled={!inputText}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Generate Invisible Text
              </Button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col">
            <Textarea
              readOnly
              placeholder="Invisible text will appear here"
              value={outputText}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize mb-2"
            />
            
            {/* Actions Row - Placed below output box and aligned right */}
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
                onClick={decodeInvisibleText} 
                disabled={!outputText}
                className="border-zinc-600"
              >
                Decode Text
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
              <span className="text-xl font-semibold">{stats.chars}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Word Count</span>
              <span className="text-xl font-semibold">{stats.words}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Line Count</span>
              <span className="text-xl font-semibold">{stats.lines}</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-400">Sentence Count</span>
              <span className="text-xl font-semibold">{stats.sentences}</span>
            </div>
          </div>
        </Card>
        
        {/* Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Invisible Text Generator</h3>
            <p className="mb-4">
              This tool generates invisible text that can be copied and pasted anywhere. For each character you enter, 
              an invisible Unicode character will be produced. This is perfect for situations where empty space isn't accepted,
              or when you want to create blank messages, placeholders, or unique text effects.
            </p>
            <p className="mb-4">
              The invisible text uses special Unicode characters (like zero-width spaces and Braille pattern blanks) that 
              have zero or minimal width but are still valid characters.
            </p>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">How to Create Invisible Text</h3>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>Enter your text in the input field on the left</li>
              <li>Click the "Generate Invisible Text" button</li>
              <li>Your invisible text will appear in the output field on the right</li>
              <li>Click "Copy to Clipboard" to copy the invisible text</li>
              <li>Paste the invisible text wherever you need it</li>
              <li>If you want to recover your original text, use the "Decode Text" button</li>
            </ol>
            
            <p className="text-sm text-gray-400">
              Note: While the text is invisible, it still takes up space electronically. The invisible characters 
              are actual valid characters in Unicode, and systems will recognize them as such. This makes them perfect 
              for use in places where completely empty messages might not be allowed.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
}
