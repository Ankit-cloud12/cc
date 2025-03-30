import React, { useState, useEffect } from 'react';
import { ToolLayout } from './ToolLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  const [text, setText] = useState('');
  const [invisibleText, setInvisibleText] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<TextStats>({ chars: 0, words: 0, sentences: 0, lines: 0 });

  useEffect(() => {
    updateStats(invisibleText);
  }, [invisibleText]);

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
    const originalText = text; // Store original text for decoding
    for (let i = 0; i < text.length; i++) {
      // Rotate through different invisible characters for variety
      result += INVISIBLE_CHARACTERS[i % INVISIBLE_CHARACTERS.length];
    }
    setInvisibleText(result);
    // Store the original text in a data attribute for decoding
    localStorage.setItem('lastOriginalText', originalText);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(invisibleText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const downloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([invisibleText], {type: 'text/plain'});
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

  const clearText = () => {
    setText('');
    setInvisibleText('');
  };

  return (
    <ToolLayout title="Invisible Text Generator" hideHeader={true}>
      <div className="container mx-auto p-4 space-y-6">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold mb-4">Invisible Text Generator</h1>
          
          <p className="text-sm text-gray-300">
            Generate invisible text that can be copied and pasted anywhere. For each character you enter, 
            an invisible character will be produced. Perfect for situations where empty space isn't accepted.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Enter your text:</label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full min-h-[200px] p-2 bg-gray-700 text-white rounded-md"
                placeholder="Type or paste your text here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">Invisible text output:</label>
              <Textarea
                value={invisibleText}
                readOnly
                className="w-full min-h-[200px] p-2 bg-gray-700 text-white rounded-md"
                placeholder="Invisible text will appear here..."
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              onClick={generateInvisibleText}
              disabled={!text}
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
            >
              Generate Invisible Text
            </Button>
            
            <Button
              onClick={copyToClipboard}
              disabled={!invisibleText}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>

            <Button
              onClick={downloadText}
              disabled={!invisibleText}
              variant="default"
              className="bg-purple-600 hover:bg-purple-700"
            >
              Download Text
            </Button>

            <Button
              onClick={decodeInvisibleText}
              disabled={!invisibleText}
              variant="default"
              className="bg-yellow-600 hover:bg-yellow-700"
            >
              Decode Text
            </Button>

            <Button
              onClick={clearText}
              variant="default"
              className="bg-red-600 hover:bg-red-700"
            >
              Clear
            </Button>
          </div>

          {invisibleText && (
            <div className="text-sm text-gray-300 p-4 bg-gray-800 rounded-md">
              <p className="font-semibold mb-2">Text Statistics:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>Character Count: {stats.chars}</div>
                <div>Word Count: {stats.words}</div>
                <div>Sentence Count: {stats.sentences}</div>
                <div>Line Count: {stats.lines}</div>
              </div>
            </div>
          )}

          <div className="space-y-4 mt-8">
            <h2 className="text-xl font-semibold">How to Create Invisible Text?</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Enter your text in the input field on the left</li>
              <li>Click the "Generate Invisible Text" button</li>
              <li>Your invisible text will appear in the output field on the right</li>
              <li>Click "Copy to Clipboard" to copy the invisible text</li>
              <li>Paste the invisible text wherever you need it</li>
            </ol>
          </div>

          <div className="text-sm text-gray-400 mt-4">
            <p>Note: The invisible text generated contains special Unicode characters that appear as empty space but are actually valid characters. This makes them perfect for use in situations where empty spaces aren't accepted.</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
