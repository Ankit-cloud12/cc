import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Volume2, Play } from "lucide-react";

// NATO Phonetic Alphabet mapping
const natoPhoneticAlphabet: Record<string, string> = {
  'a': 'Alpha',
  'b': 'Bravo',
  'c': 'Charlie',
  'd': 'Delta',
  'e': 'Echo',
  'f': 'Foxtrot',
  'g': 'Golf',
  'h': 'Hotel',
  'i': 'India',
  'j': 'Juliet',
  'k': 'Kilo',
  'l': 'Lima',
  'm': 'Mike',
  'n': 'November',
  'o': 'Oscar',
  'p': 'Papa',
  'q': 'Quebec',
  'r': 'Romeo',
  's': 'Sierra',
  't': 'Tango',
  'u': 'Uniform',
  'v': 'Victor',
  'w': 'Whiskey',
  'x': 'X-ray',
  'y': 'Yankee',
  'z': 'Zulu',
  '0': 'Zero',
  '1': 'One',
  '2': 'Two',
  '3': 'Three',
  '4': 'Four',
  '5': 'Five',
  '6': 'Six',
  '7': 'Seven',
  '8': 'Eight',
  '9': 'Nine',
  ' ': 'Space',
  '.': 'Period',
  ',': 'Comma',
  '?': 'Question Mark',
  '!': 'Exclamation Mark',
  '/': 'Slash',
  '\\': 'Backslash',
  '-': 'Dash',
  '_': 'Underscore',
  '@': 'At Sign',
  '#': 'Hash',
  '$': 'Dollar Sign',
  '%': 'Percent',
  '&': 'Ampersand',
  '*': 'Asterisk',
  '(': 'Left Parenthesis',
  ')': 'Right Parenthesis',
  '+': 'Plus',
  '=': 'Equals',
  ':': 'Colon',
  ';': 'Semicolon',
  '"': 'Quote',
  "'": 'Apostrophe',
  '<': 'Less Than',
  '>': 'Greater Than',
  '{': 'Left Brace',
  '}': 'Right Brace',
  '[': 'Left Bracket',
  ']': 'Right Bracket',
  '|': 'Vertical Bar',
  '`': 'Backtick',
  '~': 'Tilde',
};

// Pronunciation guides for precision mode
const pronunciationGuides: Record<string, string> = {
  'a': 'AL-fah',
  'b': 'BRAH-voh',
  'c': 'CHAR-lee',
  'd': 'DELL-tah',
  'e': 'ECK-oh',
  'f': 'FOKS-trot',
  'g': 'GOLF',
  'h': 'HOH-tell',
  'i': 'IN-dee-ah',
  'j': 'JEW-lee-ett',
  'k': 'KEY-loh',
  'l': 'LEE-mah',
  'm': 'MIKE',
  'n': 'no-VEM-ber',
  'o': 'OSS-car',
  'p': 'pah-PAH',
  'q': 'keh-BECK',
  'r': 'ROW-me-oh',
  's': 'see-AIR-ah',
  't': 'TANG-go',
  'u': 'YOU-nee-form',
  'v': 'VIK-tah',
  'w': 'WISS-key',
  'x': 'ECKS-ray',
  'y': 'YANG-key',
  'z': 'ZOO-loo',
  '0': 'ZEE-roh',
  '1': 'WUN',
  '2': 'TOO',
  '3': 'TREE',
  '4': 'FOW-er',
  '5': 'FIFE',
  '6': 'SIX',
  '7': 'SEV-en',
  '8': 'AIT',
  '9': 'NIN-er',
};

interface CharPhoneticPair {
  char: string;
  phonetic: string;
  pronunciation?: string;
}

const NatoAlphabetTranslator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [charPhoneticPairs, setCharPhoneticPairs] = useState<CharPhoneticPair[]>([]);
  const [copied, setCopied] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  
  // Feature toggles
  const [educationalMode, setEducationalMode] = useState(true);
  const [precisionMode, setPrecisionMode] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(80);
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  
  // Additional options for precision mode
  const [includePronunciation, setIncludePronunciation] = useState(true);
  const [includeProwords, setIncludeProwords] = useState(true);
  const [useGrouping, setUseGrouping] = useState(false);

  useEffect(() => {
    translateToNato(inputText);
  }, [inputText, precisionMode, includeProwords, includePronunciation, useGrouping]);

  const translateToNato = (text: string) => {
    if (!text) {
      setOutputText("");
      setCharPhoneticPairs([]);
      return;
    }

    // Generate character-phonetic pairs for educational display
    const pairs: CharPhoneticPair[] = [];
    const words = text.split(/(\s+)/);
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toLowerCase();
      const pair: CharPhoneticPair = {
        char: text[i],
        phonetic: natoPhoneticAlphabet[char] || char,
      };
      
      if (precisionMode && includePronunciation && pronunciationGuides[char]) {
        pair.pronunciation = pronunciationGuides[char];
      }
      
      pairs.push(pair);
    }
    
    setCharPhoneticPairs(pairs);

    // Generate formatted output text
    let formattedOutput = "";
    
    if (precisionMode) {
      if (includeProwords) {
        formattedOutput = "I SPELL: ";
      }

      const phoneticWords = pairs.map(pair => {
        let output = pair.phonetic;
        if (includePronunciation && pair.pronunciation) {
          output += ` (${pair.pronunciation})`;
        }
        return output;
      });

      if (useGrouping) {
        // Group into blocks of 5 with "BREAK" between groups
        const groups = [];
        for (let i = 0; i < phoneticWords.length; i += 5) {
          groups.push(phoneticWords.slice(i, i + 5).join(" "));
        }
        formattedOutput += groups.join("\nBREAK\n");
      } else {
        formattedOutput += phoneticWords.join(" ");
      }
    } else {
      // Standard mode output
      formattedOutput = pairs.map(pair => pair.phonetic).join(" ");
    }
    
    setOutputText(formattedOutput);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setCharPhoneticPairs([]);
  };

  // Simulated play audio function (would connect to actual audio files)
  const playAudio = (phonetic: string) => {
    console.log(`Playing audio for: ${phonetic}`);
    // In a real implementation, this would play an audio file or use speech synthesis
  };

  // Play the full sequence of phonetic words
  const playFullSequence = () => {
    if (!audioEnabled || charPhoneticPairs.length === 0) return;
    
    console.log("Playing full sequence");
    charPhoneticPairs.forEach((pair, index) => {
      setTimeout(() => {
        setHighlightedIndex(index);
        playAudio(pair.phonetic);
      }, index * 1000); // Space out the audio playback
    });
    
    // Clear highlight after complete
    setTimeout(() => setHighlightedIndex(null), charPhoneticPairs.length * 1000);
  };

  // Render the educational display with character-by-character highlighting
  const renderEducationalDisplay = () => (
    <div className="educational-display bg-zinc-700 rounded-lg p-4 mb-4">
      <h3 className="text-lg font-medium mb-2">Character-by-Character Translation</h3>
      
      <div className="input-text-display mb-3 border-b border-zinc-600 pb-2">
        {inputText.split('').map((char, index) => (
          <span 
            key={`input-${index}`}
            className={`inline-block px-1 py-0.5 m-0.5 rounded ${highlightedIndex === index ? 'bg-blue-500/30 border border-blue-500/50' : ''}`}
            onMouseEnter={() => setHighlightedIndex(index)}
            onMouseLeave={() => setHighlightedIndex(null)}
          >
            {char}
          </span>
        ))}
      </div>
      
      <div className="phonetic-pairs-display grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {charPhoneticPairs.map((pair, index) => (
          <div 
            key={`pair-${index}`}
            className={`char-phonetic-pair flex flex-col items-center p-2 rounded border border-zinc-600 transition-all ${
              highlightedIndex === index ? 'bg-blue-500/30 border-blue-500/50 transform -translate-y-1' : ''
            }`}
            onMouseEnter={() => setHighlightedIndex(index)}
            onMouseLeave={() => setHighlightedIndex(null)}
          >
            <div className="original-char text-xl font-bold">{pair.char}</div>
            <div className="phonetic-word text-sm">{pair.phonetic}</div>
            {pair.pronunciation && (
              <div className="pronunciation text-xs text-gray-400 italic">{pair.pronunciation}</div>
            )}
            {audioEnabled && (
              <button 
                className="audio-play-btn mt-1 p-1 rounded-full bg-zinc-600 hover:bg-zinc-500 text-white"
                onClick={() => playAudio(pair.phonetic)}
                aria-label={`Play pronunciation of ${pair.phonetic}`}
              >
                <Play className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      {audioEnabled && (
        <div className="audio-controls mt-4 flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="bg-zinc-600 hover:bg-zinc-500 text-white border-zinc-500"
            onClick={playFullSequence}
            disabled={charPhoneticPairs.length === 0}
          >
            <Play className="mr-2 h-4 w-4" />
            Play Full Sequence
          </Button>
          
          <div className="volume-control flex items-center gap-2 ml-auto">
            <Volume2 className="h-4 w-4 text-gray-400" />
            <Slider
              className="w-24"
              min={0}
              max={100}
              step={10}
              value={[audioVolume]}
              onValueChange={(value) => setAudioVolume(value[0])}
            />
            <span className="text-xs text-gray-400">{audioVolume}%</span>
          </div>
        </div>
      )}
    </div>
  );

  // Reference table for the NATO phonetic alphabet
  const renderReferenceTable = () => (
    <div className="reference-section mt-4">
      <h3 className="text-lg font-medium mb-2">NATO Phonetic Alphabet Reference</h3>
      <div className="reference-table grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 bg-zinc-700 p-4 rounded-lg">
        {Object.entries(natoPhoneticAlphabet)
          .filter(([char]) => /^[a-z0-9]$/.test(char)) // Only include letters and numbers
          .map(([char, phonetic]) => (
            <div key={char} className="reference-item p-2 border border-zinc-600 rounded flex flex-col items-center">
              <div className="ref-char text-lg font-bold">{char.toUpperCase()}</div>
              <div className="ref-phonetic text-sm">{phonetic}</div>
              {precisionMode && pronunciationGuides[char] && (
                <div className="ref-pronunciation text-xs text-gray-400 italic">{pronunciationGuides[char]}</div>
              )}
            </div>
          ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">NATO Phonetic Alphabet Translator</h1>
      <p className="text-gray-300 mb-6">
        Convert text to NATO phonetic alphabet code used in aviation, military, and emergency communications.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div className="w-full">
          <Textarea
            placeholder="Type or paste your text here"
            className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          
          <div className="options-panel grid gap-3">
            <div className="option-row flex items-center justify-between bg-zinc-700 px-4 py-2 rounded">
              <Label htmlFor="educational-mode" className="cursor-pointer">Educational Display</Label>
              <Switch 
                id="educational-mode" 
                checked={educationalMode} 
                onCheckedChange={setEducationalMode}
              />
            </div>
            
            <div className="option-row flex items-center justify-between bg-zinc-700 px-4 py-2 rounded">
              <Label htmlFor="precision-mode" className="cursor-pointer">Military/Aviation Precision</Label>
              <Switch 
                id="precision-mode" 
                checked={precisionMode} 
                onCheckedChange={setPrecisionMode}
              />
            </div>
            
            <div className="option-row flex items-center justify-between bg-zinc-700 px-4 py-2 rounded">
              <Label htmlFor="audio-enabled" className="cursor-pointer">Enable Audio</Label>
              <Switch 
                id="audio-enabled" 
                checked={audioEnabled} 
                onCheckedChange={setAudioEnabled}
              />
            </div>
            
            {precisionMode && (
              <div className="precision-options bg-zinc-700 p-4 rounded">
                <h3 className="text-sm font-medium mb-2">Precision Mode Options</h3>
                
                <div className="option-row flex items-center justify-between mb-2">
                  <Label htmlFor="include-pronunciation" className="text-sm cursor-pointer">Include Pronunciation</Label>
                  <Switch 
                    id="include-pronunciation" 
                    checked={includePronunciation} 
                    onCheckedChange={setIncludePronunciation}
                  />
                </div>
                
                <div className="option-row flex items-center justify-between mb-2">
                  <Label htmlFor="include-prowords" className="text-sm cursor-pointer">Include Procedural Words</Label>
                  <Switch 
                    id="include-prowords" 
                    checked={includeProwords} 
                    onCheckedChange={setIncludeProwords}
                  />
                </div>
                
                <div className="option-row flex items-center justify-between mb-2">
                  <Label htmlFor="use-grouping" className="text-sm cursor-pointer">Group in 5-character blocks</Label>
                  <Switch 
                    id="use-grouping" 
                    checked={useGrouping} 
                    onCheckedChange={setUseGrouping}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Output Section */}
        <div className="w-full">
          {educationalMode && charPhoneticPairs.length > 0 ? (
            renderEducationalDisplay()
          ) : (
            <Textarea
              readOnly
              className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
              value={outputText}
              placeholder="NATO phonetic alphabet translation will appear here"
            />
          )}
          
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
        </div>
      </div>
      
      {/* Reference Table (optional display) */}
      <Tabs defaultValue="reference" className="mt-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reference">NATO Alphabet Reference</TabsTrigger>
          <TabsTrigger value="about">About This Tool</TabsTrigger>
        </TabsList>
        <TabsContent value="reference" className="mt-4">
          {renderReferenceTable()}
        </TabsContent>
        <TabsContent value="about" className="mt-4">
          <div className="about-content bg-zinc-700 p-4 rounded-lg">
            <h2 className="text-xl font-bold mb-4">About NATO Phonetic Alphabet</h2>
            <p className="text-gray-300 mb-4">
              The NATO phonetic alphabet is a spelling alphabet used by airline pilots, police, military, and others
              to communicate clearly over radio or phone, especially when clarity is crucial.
            </p>
            <p className="text-gray-300 mb-4">
              Each letter has a specific word assigned to it (A = Alpha, B = Bravo, etc.) to avoid confusion between 
              similar-sounding letters (like "B" and "D" or "M" and "N").
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Key Features of This Tool:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
                <li>Convert any text to NATO phonetic alphabet</li>
                <li>Educational display shows character-by-character translation</li>
                <li>Military/Aviation precision mode follows official protocols</li>
                <li>Audio pronunciation for learning proper communication</li>
                <li>Complete reference table of the NATO phonetic alphabet</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Common Uses:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1 ml-2">
                <li>Aviation communications</li>
                <li>Military operations</li>
                <li>Emergency services</li>
                <li>Spelling complex names or words over the phone</li>
                <li>Reading serial numbers, confirmation codes, or license plates</li>
                <li>International radio communications</li>
              </ul>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NatoAlphabetTranslator;
