import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const PigLatinTranslator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"englishToPigLatin" | "pigLatinToEnglish">(
    "englishToPigLatin"
  );
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  
  // Statistics
  const [charCount, setCharCount] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);

  // Update counts whenever input text changes
  useEffect(() => {
    updateCounts(inputText);
    translate(inputText);
  }, [inputText, mode]);

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
  
  const handleDownload = () => {
    if (!outputText) return;
    
    const element = document.createElement("a");
    const file = new Blob([outputText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = mode === "englishToPigLatin" ? "pig-latin.txt" : "english.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="Pig Latin Translator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">Pig Latin Translator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Convert text to Pig Latin or translate Pig Latin back to regular English.
        </p>

        {/* Translation Mode Selection */}
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

        {/* Input and Output Textboxes */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="w-full md:w-1/2">
            <Textarea
              placeholder={
                mode === "englishToPigLatin"
                  ? "Type or paste your English text here"
                  : "Type or paste Pig Latin text here"
              }
              value={inputText}
              onChange={handleInputChange}
              className="w-full min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize"
            />
          </div>
          
          <div className="w-full md:w-1/2 flex flex-col">
            <Textarea
              readOnly
              placeholder={
                mode === "englishToPigLatin"
                  ? "Pig Latin translation will appear here"
                  : "English translation will appear here"
              }
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
            <TabsTrigger value="rules" className="data-[state=active]:bg-zinc-700">Pig Latin Rules</TabsTrigger>
            <TabsTrigger value="usage" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About Pig Latin Translator</h3>
            <p className="mb-4">
              Pig Latin is a language game that alters English words according to simple rules. It is commonly 
              used by children as a form of play or to create a "secret language" that others might not understand.
            </p>
            <p className="mb-4">
              This translator allows you to convert between English and Pig Latin instantly. Simply type or paste 
              your text in the input box, select the translation direction, and see the converted text appear 
              immediately. The tool handles proper capitalization, punctuation, and special cases to ensure accurate
              translations.
            </p>
            <p className="mb-4">
              Whether you're learning about language patterns, having fun with friends, or using it for 
              educational purposes, our Pig Latin translator provides an easy way to convert text between
              these two forms.
            </p>
          </TabsContent>
          
          <TabsContent value="rules" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Pig Latin Rules</h3>
            <p className="mb-4">
              Pig Latin follows these basic rules for transforming words:
            </p>
            <ol className="list-decimal pl-5 space-y-2 mb-4">
              <li>
                <strong>Words beginning with consonants:</strong> Move the consonant or consonant cluster to the end of the word and add "ay".<br/>
                Examples:
                <ul className="list-disc pl-8 mt-1">
                  <li>"pig" → "igpay"</li>
                  <li>"banana" → "ananabay"</li>
                  <li>"trash" → "ashtray"</li>
                  <li>"string" → "ingstray"</li>
                </ul>
              </li>
              <li>
                <strong>Words beginning with vowels:</strong> Simply add "way" to the end of the word.<br/>
                Examples:
                <ul className="list-disc pl-8 mt-1">
                  <li>"eat" → "eatway"</li>
                  <li>"apple" → "appleway"</li>
                  <li>"oatmeal" → "oatmealway"</li>
                </ul>
              </li>
            </ol>
            <p className="text-sm text-gray-400">
              Note: While these are the standard rules, variations do exist. Some versions add "yay" or "way" to 
              vowel-beginning words, while others use "hay" or have special rules for certain consonant combinations.
              This translator uses the most common implementation.
            </p>
          </TabsContent>
          
          <TabsContent value="usage" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Select "English to Pig Latin" to convert regular English text into Pig Latin</li>
              <li>Select "Pig Latin to English" to attempt converting Pig Latin back to regular English</li>
              <li>Type or paste text in the left box to see the translation appear in the right box</li>
              <li>The translator preserves capitalization (e.g., "Hello" becomes "Ellohay")</li>
              <li>Punctuation and spacing are maintained in their original positions</li>
              <li>Use the "Copy to Clipboard" button to easily share your translated text</li>
              <li>Use the "Download" button to save your translation as a text file</li>
              <li>Try translating a paragraph of text to see how pig latin looks in longer form</li>
            </ul>
            <p className="text-sm text-gray-400">
              Fun fact: Pig Latin has been used in popular culture for decades, appearing in songs, movies, and 
              TV shows. While it's not actually a real language, it follows consistent patterns that make it an 
              interesting introduction to linguistic concepts for children.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default PigLatinTranslator;
