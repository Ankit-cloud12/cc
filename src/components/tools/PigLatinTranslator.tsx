import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const PigLatinTranslator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"englishToPigLatin" | "pigLatinToEnglish">(
    "englishToPigLatin"
  );
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  // Update counts whenever input text changes
  useEffect(() => {
    updateCounts(inputText);
  }, [inputText]);

  const updateCounts = (text: string) => {
    setCharCount(text.length);
    setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    setSentenceCount(
      text.trim() === "" ? 0 : text.split(/[.!?]+/).filter(Boolean).length
    );
    setLineCount(
      text.trim() === "" ? 0 : text.split(/\r\n|\r|\n/).filter(Boolean).length
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    translate(newText);
  };

  const isVowel = (char: string): boolean => {
    return /^[aeiou]$/i.test(char);
  };

  const capitalizeFirstLetter = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const translate = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    if (mode === "englishToPigLatin") {
      // Convert English to Pig Latin
      const words = text.match(/(\w+|\S+|\s+)/g) || [];
      const result = words.map((word) => {
        // Skip non-word characters
        if (!/^\w+$/.test(word)) {
          return word;
        }

        const isCapitalized = /^[A-Z]/.test(word);
        const isAllCaps = word === word.toUpperCase() && word.length > 1;
        const normalizedWord = word.toLowerCase();

        let translated;
        if (normalizedWord.length === 1) {
          translated = `${normalizedWord}way`;
        } else if (isVowel(normalizedWord[0])) {
          translated = `${normalizedWord}way`;
        } else {
          // Find the position of the first vowel
          let firstVowelPos = 0;
          for (let i = 0; i < normalizedWord.length; i++) {
            if (isVowel(normalizedWord[i])) {
              firstVowelPos = i;
              break;
            }
            if (i === normalizedWord.length - 1) {
              // No vowels found
              firstVowelPos = normalizedWord.length;
            }
          }

          const consonantCluster = normalizedWord.substring(0, firstVowelPos);
          const restOfWord = normalizedWord.substring(firstVowelPos);
          translated = `${restOfWord}${consonantCluster}ay`;
        }

        // Restore capitalization
        if (isAllCaps) {
          return translated.toUpperCase();
        } else if (isCapitalized) {
          return capitalizeFirstLetter(translated);
        }

        return translated;
      });

      setOutputText(result.join(""));
    } else {
      // Convert Pig Latin to English
      const words = text.match(/(\w+|\S+|\s+)/g) || [];
      const result = words.map((word) => {
        // Skip non-word characters
        if (!/^\w+$/.test(word)) {
          return word;
        }

        const isCapitalized = /^[A-Z]/.test(word);
        const isAllCaps = word === word.toUpperCase() && word.length > 1;
        const normalizedWord = word.toLowerCase();

        let translated;
        if (normalizedWord.endsWith("way")) {
          translated = normalizedWord.substring(0, normalizedWord.length - 3);
        } else if (normalizedWord.endsWith("ay")) {
          const withoutAy = normalizedWord.substring(0, normalizedWord.length - 2);
          // Find where the original consonant cluster would be
          const vowelMatch = withoutAy.match(/[aeiou]/);
          const vowelIndex = vowelMatch ? withoutAy.indexOf(vowelMatch[0]) : -1;

          if (vowelIndex === -1) {
            translated = withoutAy; // No vowels, just return without the 'ay'
          } else {
            const possibleCluster = withoutAy.substring(vowelIndex);
            const restOfWord = withoutAy.substring(0, vowelIndex);
            translated = `${possibleCluster}${restOfWord}`;
          }
        } else {
          translated = normalizedWord; // Not in Pig Latin format
        }

        // Restore capitalization
        if (isAllCaps) {
          return translated.toUpperCase();
        } else if (isCapitalized) {
          return capitalizeFirstLetter(translated);
        }

        return translated;
      });

      setOutputText(result.join(""));
    }
  };

  const handleModeChange = (value: "englishToPigLatin" | "pigLatinToEnglish") => {
    setMode(value);
    translate(inputText);
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

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-2">Pig Latin Translator</h1>
      <p className="text-gray-300 mb-6">
        Convert text to Pig Latin or translate Pig Latin back to regular English.
      </p>

      <div className="mb-6">
        <RadioGroup
          defaultValue="englishToPigLatin"
          value={mode}
          onValueChange={(value) =>
            handleModeChange(value as "englishToPigLatin" | "pigLatinToEnglish")
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="englishToPigLatin" id="englishToPigLatin" />
            <Label htmlFor="englishToPigLatin">English to Pig Latin</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="pigLatinToEnglish" id="pigLatinToEnglish" />
            <Label htmlFor="pigLatinToEnglish">Pig Latin to English</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col flex-1">
          <Textarea
            placeholder={
              mode === "englishToPigLatin"
                ? "Type or paste your English text here"
                : "Type or paste Pig Latin text here"
            }
            className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-2 p-4 rounded"
            value={inputText}
            onChange={handleInputChange}
          />
          <div className="text-sm text-gray-400 mb-4">
            Character Count: {charCount} | Word Count: {wordCount} | Sentence Count: {sentenceCount} | Line Count: {lineCount}
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <Textarea
            readOnly
            className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
            value={outputText}
            placeholder={
              mode === "englishToPigLatin"
                ? "Pig Latin translation will appear here"
                : "English translation will appear here"
            }
          />
        </div>
      </div>

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
        <h2 className="text-xl font-bold mb-4">About Pig Latin</h2>
        <p className="text-gray-300 mb-4">
          Pig Latin is a language game that alters English words according to a simple set of rules. It is commonly used by children as a form of play or to create a "secret language."
        </p>
        <p className="text-gray-300 mb-4">
          <span className="font-semibold">The basic rules of Pig Latin are:</span>
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
          <li>For words that begin with consonant sounds, move the consonant or consonant cluster to the end of the word and add "ay".<br />
            Example: "pig" → "igpay", "banana" → "ananabay", "trash" → "ashtray"</li>
          <li>For words that begin with vowel sounds, simply add "way" to the end of the word.<br />
            Example: "eat" → "eatway", "apple" → "appleway", "under" → "underway"</li>
        </ul>
        <p className="text-gray-300 mb-4">
          This translator attempts to convert text between English and Pig Latin while preserving capitalization, punctuation, and handling special cases.
        </p>
      </div>
    </div>
  );
};

export default PigLatinTranslator;