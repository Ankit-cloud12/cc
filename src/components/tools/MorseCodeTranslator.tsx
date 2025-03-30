import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const MorseCodeTranslator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<"textToMorse" | "morseToText">(
    "textToMorse",
  );
  const [copied, setCopied] = useState(false);

  // Morse code mapping
  const textToMorseMap: { [key: string]: string } = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    "0": "-----",
    "1": ".----",
    "2": "..---",
    "3": "...--",
    "4": "....-",
    "5": ".....",
    "6": "-....",
    "7": "--...",
    "8": "---..",
    "9": "----.",
    ".": ".-.-.-",
    ",": "--..--",
    "?": "..--..",
    "'": ".----.",
    "!": "-.-.--",
    "/": "-..-.",
    "(": "-.--.",
    ")": "-.--.-",
    "&": ".-...",
    ":": "---...",
    ";": "-.-.-.",
    "=": "-...-",
    "+": ".-.-.",
    "-": "-....-",
    _: "..--.-",
    '"': ".-..-.",
    $: "...-..-",
    "@": ".--.-.",
    " ": "/",
  };

  // Create reverse mapping for morse to text
  const morseToTextMap: { [key: string]: string } = {};
  Object.keys(textToMorseMap).forEach((key) => {
    morseToTextMap[textToMorseMap[key]] = key;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    translate(newText);
  };

  const translate = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }

    if (mode === "textToMorse") {
      // Convert text to morse
      const result = text
        .toUpperCase()
        .split("")
        .map((char) => textToMorseMap[char] || char)
        .join(" ");
      setOutputText(result);
    } else {
      // Convert morse to text
      const result = text
        .split(" ")
        .map((code) => morseToTextMap[code] || code)
        .join("");
      setOutputText(result);
    }
  };

  const handleModeChange = (value: "textToMorse" | "morseToText") => {
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
  };

  const content = (
    <>
      <h1 className="text-3xl font-bold mb-2">Morse Code Translator</h1>
      <p className="text-gray-300 mb-6">
        Convert text to Morse code or translate Morse code back to text.
      </p>

      <div className="mb-6">
        <RadioGroup
          defaultValue="textToMorse"
          value={mode}
          onValueChange={(value) =>
            handleModeChange(value as "textToMorse" | "morseToText")
          }
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="textToMorse" id="textToMorse" />
            <Label htmlFor="textToMorse">Text to Morse</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="morseToText" id="morseToText" />
            <Label htmlFor="morseToText">Morse to Text</Label>
          </div>
        </RadioGroup>
      </div>

      <Textarea
        placeholder={
          mode === "textToMorse"
            ? "Type or paste your text here"
            : "Type or paste Morse code here"
        }
        className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
        value={inputText}
        onChange={handleInputChange}
      />

      <Textarea
        readOnly
        className="w-full min-h-[150px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
        value={outputText}
        placeholder={
          mode === "textToMorse"
            ? "Morse code will appear here"
            : "Decoded text will appear here"
        }
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
        <h2 className="text-xl font-bold mb-4">About Morse Code</h2>
        <p className="text-gray-300 mb-4">
          Morse code is a method of encoding text characters using sequences of
          dots and dashes (or short and long signals). It was historically used
          for long-distance communication before the advent of modern
          telecommunications.
        </p>
        <p className="text-gray-300 mb-4">
          When writing Morse code, use spaces between characters and forward
          slashes (/) between words. For example, "HELLO WORLD" in Morse code is
          ".... . .-.. .-.. --- / .-- --- .-. .-.. -..".
        </p>
      </div>
    </>
  );

  return <>{content}</>;
};

export default MorseCodeTranslator;
