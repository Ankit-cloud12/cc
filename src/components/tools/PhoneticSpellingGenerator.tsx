import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const PhoneticSpellingGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    convertToPhonetic(inputText);
  }, [inputText]);

  const convertToPhonetic = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    // Simple "sounds like" phonetic mapping
    const phoneticMap: { [key: string]: string } = {
      a: "U",
      b: "Bee",
      c: "See",
      d: "Dee",
      e: "Ee",
      f: "Ef",
      g: "Jee",
      h: "Aitch",
      i: "Eye",
      j: "Jay",
      k: "Kay",
      l: "El",
      m: "Em",
      n: "En",
      o: "Oh",
      p: "Pee",
      q: "Cue",
      r: "Are",
      s: "Ess",
      t: "Tee",
      u: "You",
      v: "Vee",
      w: "Double-you",
      x: "Ex",
      y: "Why",
      z: "Zee",
      A: "U",
      B: "Bee",
      C: "See",
      D: "Dee",
      E: "Ee",
      F: "Ef",
      G: "Jee",
      H: "Aitch",
      I: "Eye",
      J: "Jay",
      K: "Kay",
      L: "El",
      M: "Em",
      N: "En",
      O: "Oh",
      P: "Pee",
      Q: "Cue",
      R: "Are",
      S: "Ess",
      T: "Tee",
      U: "You",
      V: "Vee",
      W: "Double-you",
      X: "Ex",
      Y: "Why",
      Z: "Zee",
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
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-2">Phonetic Spelling Generator</h1>
      <p className="text-gray-300 mb-6">
        Convert your text into easy-to-read phonetic spellings for better communication.
        Each letter is converted to its simple phonetic equivalent (A - U, B - Bee, C - See, etc.).
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
        placeholder="Phonetic spelling will appear here"
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
        <h2 className="text-xl font-bold mb-4">About Phonetic Spelling Generator</h2>
        <p className="text-gray-300 mb-4">
          The Phonetic Spelling Generator is a powerful tool designed to convert your text into 
          easy-to-read phonetic spellings for better communication.
        </p>
        <p className="text-gray-300 mb-4">
          This tool converts regular text into phonetic spelling, making it easier to understand 
          and pronounce words accurately. Simply input your text, and the tool will provide a 
          phonetic version, ensuring clear communication.
        </p>
        <p className="text-gray-300 mb-4">
          The phonetic spelling generator is useful for:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Learning pronunciation</li>
          <li>Teaching language</li>
          <li>Avoiding miscommunication in professional settings</li>
          <li>Helping with spelling over phone calls</li>
          <li>Assisting those learning to read or with reading difficulties</li>
        </ul>
      </div>
    </div>
  );
};

export default PhoneticSpellingGenerator;