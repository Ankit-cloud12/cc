import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Copy, FileDown, FileText } from "lucide-react";

interface TextStats {
  charWithSpace: number;
  charWithoutSpace: number;
  words: number;
  paragraphs: number;
  sentences: number;
}

const WingdingsConverter = () => {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [autoConvert, setAutoConvert] = useState(true);
  const [wingdingsText, setWingdingsText] = useState("");
  const [wingdings2Text, setWingdings2Text] = useState("");
  const [wingdings3Text, setWingdings3Text] = useState("");
  const [webdingsText, setWebdingsText] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [stats, setStats] = useState<TextStats>({
    charWithSpace: 0,
    charWithoutSpace: 0,
    words: 0,
    paragraphs: 0,
    sentences: 0
  });

  // Character mapping for Wingdings fonts
  const wingdingsMap: Record<string, string> = {
    'a': '♈︎', 'b': '♉︎', 'c': '♊︎', 'd': '♋︎', 'e': '♌︎', 'f': '♍︎', 'g': '♎︎', 'h': '♏︎', 'i': '♐︎', 'j': '♑︎',
    'k': '♒︎', 'l': '♓︎', 'm': '☼', 'n': '☽', 'o': '☾', 'p': '♦︎', 'q': '♣︎', 'r': '♠︎', 's': '•', 't': '□',
    'u': '◘', 'v': '○', 'w': '◙', 'x': '♂', 'y': '♀', 'z': '♪',
    'A': '☺', 'B': '☻', 'C': '♥', 'D': '♦', 'E': '♣', 'F': '♠', 'G': '•', 'H': '◘', 'I': '○', 'J': '◙',
    'K': '♂', 'L': '♀', 'M': '♪', 'N': '♫', 'O': '☼', 'P': '↕', 'Q': '‼', 'R': '¶', 'S': '§', 'T': '▬',
    'U': '↨', 'V': '↑', 'W': '↓', 'X': '→', 'Y': '←', 'Z': '∟',
    '0': '☺︎', '1': '☻︎', '2': '♥︎', '3': '♦︎', '4': '♣︎', '5': '♠︎', '6': '•︎', '7': '◘︎', '8': '○︎', '9': '◙︎',
    '!': '☄︎', '@': '💧︎', '#': '❄︎', '$': '☘︎', '%': '🖂︎', '^': '🖃︎', '&': '💣︎', '*': '📪︎', '(': '📫︎', ')': '📬︎',
    '-': '➖︎', '_': '⌛︎', '=': '⌚︎', '+': '☢︎', '[': '☣︎', ']': '▯︎', '{': '◻︎', '}': '◻︎', '\\': '◻︎', '|': '▯︎',
    ';': '◮︎', ':': '◭︎', "'": '◀︎', '"': '▶︎', ',': '⬇︎', '.': '⬆︎', '/': '⬅︎', '<': '➡︎', '>': '⬥︎', '?': '⬧︎',
    ' ': ' ', '\n': '\n', '\t': '\t'
  };

  const wingdings2Map: Record<string, string> = {
    'a': '🖐︎', 'b': '🖑︎', 'c': '🖒︎', 'd': '🖓︎', 'e': '🖔︎', 'f': '🖕︎', 'g': '🖖︎', 'h': '🖗︎', 'i': '🖘︎', 'j': '🖙︎',
    'k': '🖚︎', 'l': '🖛︎', 'm': '🖜︎', 'n': '🖝︎', 'o': '🖞︎', 'p': '🖟︎', 'q': '🖠︎', 'r': '🖡︎', 's': '🖢︎', 't': '🖣︎',
    'u': '🖤︎', 'v': '🖥︎', 'w': '🖦︎', 'x': '🖧︎', 'y': '🖨︎', 'z': '🖩︎',
    'A': '🖰︎', 'B': '🖱︎', 'C': '🖲︎', 'D': '🖳︎', 'E': '🖴︎', 'F': '🖵︎', 'G': '🖶︎', 'H': '🖷︎', 'I': '🖸︎', 'J': '🖹︎',
    'K': '🖺︎', 'L': '🖻︎', 'M': '🖼︎', 'N': '🖽︎', 'O': '🖾︎', 'P': '🗀︎', 'Q': '🗁︎', 'R': '🗂︎', 'S': '🗃︎', 'T': '🗄︎',
    'U': '🗅︎', 'V': '🗆︎', 'W': '🗇︎', 'X': '🗈︎', 'Y': '🗉︎', 'Z': '🗊︎',
    '0': '🖮︎', '1': '①', '2': '②', '3': '③', '4': '④', '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨',
    ' ': ' ', '\n': '\n', '\t': '\t'
  };

  const wingdings3Map: Record<string, string> = {
    'a': '⮇︎', 'b': '⮈︎', 'c': '⮉︎', 'd': '⮊︎', 'e': '⮋︎', 'f': '⮌︎', 'g': '⮍︎', 'h': '⮎︎', 'i': '⮏︎', 'j': '⮐︎',
    'k': '⮑︎', 'l': '⮒︎', 'm': '⮓︎', 'n': '⮔︎', 'o': '⮕︎', 'p': '⮗︎', 'q': '⮘︎', 'r': '⮙︎', 's': '⮚︎', 't': '⮛︎',
    'u': '⮜︎', 'v': '⮝︎', 'w': '⮞︎', 'x': '⮟︎', 'y': '⮠︎', 'z': '⮡︎',
    'A': '●︎', 'B': '■︎', 'C': '□︎', 'D': '◆︎', 'E': '◇︎', 'F': '◊︎', 'G': '○︎', 'H': '◎︎', 'I': '◯︎', 'J': '◈︎',
    'K': '◉︎', 'L': '◍︎', 'M': '◌︎', 'N': '◑︎', 'O': '◒︎', 'P': '◐︎', 'Q': '◓︎', 'R': '◔︎', 'S': '◕︎', 'T': '◖︎',
    'U': '◗︎', 'V': '◢︎', 'W': '◣︎', 'X': '◤︎', 'Y': '◥︎', 'Z': '◘︎',
    '0': '🎔︎', '1': '🎕︎', '2': '🎖︎', '3': '🎗︎', '4': '🎘︎', '5': '🎙︎', '6': '🎚︎', '7': '🎛︎', '8': '🎜︎', '9': '🎝︎',
    ' ': ' ', '\n': '\n', '\t': '\t'
  };

  const webdingsMap: Record<string, string> = {
    'a': '🌍︎', 'b': '🌎︎', 'c': '🌏︎', 'd': '🌐︎', 'e': '🌑︎', 'f': '🌒︎', 'g': '🌓︎', 'h': '🌔︎', 'i': '🌕︎', 'j': '🌖︎',
    'k': '🌗︎', 'l': '🌘︎', 'm': '🌙︎', 'n': '🌚︎', 'o': '🌛︎', 'p': '🌜︎', 'q': '🌝︎', 'r': '🌞︎', 's': '🌟︎', 't': '🌠︎',
    'u': '🌡️', 'v': '🌢︎', 'w': '🌣︎', 'x': '🌤︎', 'y': '🌥︎', 'z': '🌦︎',
    'A': '🕐︎', 'B': '🕑︎', 'C': '🕒︎', 'D': '🕓︎', 'E': '🕔︎', 'F': '🕕︎', 'G': '🕖︎', 'H': '🕗︎', 'I': '🕘︎', 'J': '🕙︎',
    'K': '🕚︎', 'L': '🕛︎', 'M': '🕜︎', 'N': '🕝︎', 'O': '🕞︎', 'P': '🕟︎', 'Q': '🕠︎', 'R': '🕡︎', 'S': '🕢︎', 'T': '🕣︎',
    'U': '🕤︎', 'V': '🕥︎', 'W': '🕦︎', 'X': '🕧︎', 'Y': '🕺︎', 'Z': '🖋︎',
    '0': '📟︎', '1': '📠︎', '2': '📡︎', '3': '📢︎', '4': '📣︎', '5': '📤︎', '6': '📥︎', '7': '📦︎', '8': '📧︎', '9': '📨︎',
    ' ': ' ', '\n': '\n', '\t': '\t'
  };

  // Create reverse mappings for decoding
  const reverseWingdingsMap: Record<string, string> = {};
  const reverseWingdings2Map: Record<string, string> = {};
  const reverseWingdings3Map: Record<string, string> = {};
  const reverseWebdingsMap: Record<string, string> = {};

  Object.keys(wingdingsMap).forEach(key => {
    reverseWingdingsMap[wingdingsMap[key]] = key;
  });
  Object.keys(wingdings2Map).forEach(key => {
    reverseWingdings2Map[wingdings2Map[key]] = key;
  });
  Object.keys(wingdings3Map).forEach(key => {
    reverseWingdings3Map[wingdings3Map[key]] = key;
  });
  Object.keys(webdingsMap).forEach(key => {
    reverseWebdingsMap[webdingsMap[key]] = key;
  });

  useEffect(() => {
    if (autoConvert) {
      convertText();
    }
    calculateStats();
  }, [inputText, mode]);

  const calculateStats = () => {
    const text = inputText || "";
    const charWithSpace = text.length;
    const charWithoutSpace = text.replace(/\s+/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const paragraphs = text.trim() ? text.split(/\r\n|\r|\n/).filter(p => p.trim().length > 0).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0;

    setStats({
      charWithSpace,
      charWithoutSpace,
      words,
      paragraphs,
      sentences
    });
  };

  const convertText = () => {
    if (!inputText) {
      setWingdingsText("");
      setWingdings2Text("");
      setWingdings3Text("");
      setWebdingsText("");
      return;
    }

    if (mode === "encode") {
      // Encode text to Wingdings
      const wingdings = inputText.split('').map(char => wingdingsMap[char] || char).join('');
      const wingdings2 = inputText.split('').map(char => wingdings2Map[char] || char).join('');
      const wingdings3 = inputText.split('').map(char => wingdings3Map[char] || char).join('');
      const webdings = inputText.split('').map(char => webdingsMap[char] || char).join('');

      setWingdingsText(wingdings);
      setWingdings2Text(wingdings2);
      setWingdings3Text(wingdings3);
      setWebdingsText(webdings);
    } else {
      // Decode Wingdings to text (attempt to detect which wingdings variant is used)
      let decodedText = "";
      const chars = inputText.split('');
      
      for (const char of chars) {
        if (reverseWingdingsMap[char]) {
          decodedText += reverseWingdingsMap[char];
        } else if (reverseWingdings2Map[char]) {
          decodedText += reverseWingdings2Map[char];
        } else if (reverseWingdings3Map[char]) {
          decodedText += reverseWingdings3Map[char];
        } else if (reverseWebdingsMap[char]) {
          decodedText += reverseWebdingsMap[char];
        } else {
          decodedText += char;
        }
      }
      
      setWingdingsText(decodedText);
      setWingdings2Text("");
      setWingdings3Text("");
      setWebdingsText("");
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setWingdingsText("");
    setWingdings2Text("");
    setWingdings3Text("");
    setWebdingsText("");
    setStats({
      charWithSpace: 0,
      charWithoutSpace: 0,
      words: 0,
      paragraphs: 0,
      sentences: 0
    });
  };

  const handleDownloadText = (text: string, type: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wingdings-${type.toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadWord = (text: string, type: string) => {
    // For Word doc, we create an HTML representation first
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Wingdings ${type}</title>
      </head>
      <body>
        <div style="font-family: ${type};">${text}</div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wingdings-${type.toLowerCase()}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Return the component directly without the MainLayout wrapper
  return (
    <div className="bg-zinc-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Wingdings Translator</h1>
          <p className="text-gray-300 max-w-11xl">
            Our free Wingdings Translator lets you effortlessly convert English into Wingdings symbols with just a click. Whether you want to convert text into unique symbols, generate Wingdings text, or explore the Wingdings font, this tool makes it simple. Just type, convert, and copy-paste your Wingdings text instantly!
          </p>
        </div>

        {/* Main Tool Section */}
        <div className="bg-zinc-800 rounded-lg p-6 mb-8 shadow-lg">
          <div className="mb-6">
            <RadioGroup 
              defaultValue="encode" 
              className="flex space-x-4 mb-4"
              value={mode}
              onValueChange={(value) => setMode(value as "encode" | "decode")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="encode" id="encode" />
                <Label htmlFor="encode">Encode</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="decode" id="decode" />
                <Label htmlFor="decode">Decode</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Section */}
            <div>
              <Label htmlFor="input-text" className="text-lg font-semibold block mb-2">Input Text</Label>
              <Textarea
                id="input-text"
                placeholder="Type or paste your text here..."
                className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 p-4 rounded"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <div>
                  Total Character with Space: {stats.charWithSpace} | 
                  Total Character without Space: {stats.charWithoutSpace} | 
                  Total Words: {stats.words} | 
                  Total Paragraphs: {stats.paragraphs} | 
                  Total Sentences: {stats.sentences}
                </div>
                <div className="flex space-x-2 items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleClear} 
                    className="text-xs hover:bg-zinc-700"
                  >
                    Clear
                  </Button>
                  <span className="text-zinc-500">|</span>
                  <div className="flex items-center space-x-1">
                    <span>Auto Convert</span>
                    <input 
                      type="checkbox" 
                      checked={autoConvert} 
                      onChange={() => setAutoConvert(!autoConvert)}
                      className="ml-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Output Section */}
            <div>
              <div className="flex justify-between mb-2">
                <Label className="text-lg font-semibold">Output</Label>
                <div className="text-sm text-gray-400">All Wingdings Styles</div>
              </div>

              {mode === "encode" ? (
                <Card className="border-0">
                  <CardContent className="p-4 bg-zinc-700 rounded-md min-h-[200px]">
                    <div className="whitespace-pre-wrap break-words text-white bg-zinc-800/50 p-4 rounded-md">
                      {/* Combined output with copy buttons */}
                      {inputText && (
                        <>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-white flex-grow">{wingdingsText}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCopy(wingdingsText, "wingdings")}
                              className="text-xs h-6 px-2 hover:bg-zinc-600 ml-2"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-white flex-grow">{wingdings2Text}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCopy(wingdings2Text, "wingdings2")}
                              className="text-xs h-6 px-2 hover:bg-zinc-600 ml-2"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-white flex-grow">{wingdings3Text}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCopy(wingdings3Text, "wingdings3")}
                              className="text-xs h-6 px-2 hover:bg-zinc-600 ml-2"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-white flex-grow">{webdingsText}</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleCopy(webdingsText, "webdings")}
                              className="text-xs h-6 px-2 hover:bg-zinc-600 ml-2"
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        </>
                      )}

                      {!inputText && (
                        <div className="text-gray-400 text-center py-8">
                          Type something in the input field to see it converted to Wingdings
                        </div>
                      )}
                    </div>

                    {/* Download option moved to top right of card */}
                    <div className="flex justify-end mt-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDownloadText(wingdingsText + '\n\n' + wingdings2Text + '\n\n' + wingdings3Text + '\n\n' + webdingsText, "All")}
                        className="text-xs h-7 px-3 hover:bg-zinc-600"
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Download All
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0">
                  <CardContent className="p-4 bg-zinc-700 rounded-md min-h-[200px]">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm">Decoded text</span>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleCopy(wingdingsText, "decoded")}
                          className="text-xs h-6 px-2 hover:bg-zinc-600"
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Copy to Clipboard
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownloadText(wingdingsText, "Decoded")}
                          className="text-xs h-6 px-2 hover:bg-zinc-600"
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Download Text
                        </Button>
                      </div>
                    </div>
                    <div className="whitespace-pre-wrap break-words text-white bg-zinc-800/50 p-4 rounded-md">
                      {wingdingsText || "Your decoded text will appear here"}
                    </div>
                  </CardContent>
                </Card>
              )}

              {!autoConvert && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    onClick={convertText} 
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={!inputText}
                  >
                    {mode === "encode" ? "Convert to Wingdings" : "Decode Wingdings"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mb-12 text-center">
          <p className="mb-2">Was this helpful?</p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" className="border-green-500 text-green-500 hover:bg-green-500/10">Yes</Button>
            <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500/10">No</Button>
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-8 mb-12">
          <div className="prose max-w-none text-gray-300">
            <p>
              Thousands of people search for Wingdings translators every month, curious about the cool and creative things they can do with this font. 
              Wingdings, created by Microsoft in 1990 and 1991, includes symbols like arrows, shapes, and everyday objects.
            </p>
            <p>
              Our Wingdings Converter makes it super easy. Just type in your text, and it instantly changes into Wingdings symbols. 
              Whether you want to add some fun to your messages, solve puzzles, or decode secret texts, our tool is here to help.
            </p>
            <p>
              Wingdings isn't just for fun; it's used in design and even cryptography. This font has a rich history and remains a popular 
              choice for those who want to communicate in a unique way.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">What is Wingdings?</h2>
            <p className="mb-4 text-gray-300">
              Wingdings is a series of symbols created by Microsoft in the 1990s. Unlike typical fonts, Wingdings replaces letters and numbers 
              with various icons such as arrows, shapes, and objects. This type of font is known as a dingbat font, a term used for ornamental 
              symbols that were historically used by printers for decorative purposes.
            </p>
            <p className="mb-4 text-gray-300">
              Wingdings has three variations: Wingdings 2, Wingdings 3, and Webdings, all developed by Microsoft. These fonts allow users to 
              insert symbols easily by typing on their keyboards, making them popular for adding visual elements to text.
            </p>
            <p className="mb-4 text-gray-300">
              Here's a useful chart of the original Wingdings symbols:
            </p>
            <div className="bg-zinc-800 p-4 rounded-md mb-4">
              <h3 className="font-bold mb-2">Wingdings Symbols</h3>
              <div className="overflow-auto">
                <img 
                  src="https://i.imgur.com/0SfVdJ7.png" 
                  alt="Wingdings Symbols" 
                  className="mx-auto max-w-full h-auto"
                />
              </div>
            </div>
            <p className="text-gray-300">
              One cool thing about Wingdings is that it's compatible with Unicode. This means you can copy and paste Wingdings 
              symbols as Unicode characters, and they should display correctly on different platforms. However, some web browsers 
              might not show all Wingdings symbols properly.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">How to Use Our Wingdings Converter Tool?</h2>
            <p className="mb-4 text-gray-300">
              Using the Wingdings Converter is easy and straightforward.
            </p>
            <p className="mb-4 text-gray-300">
              Follow these simple steps to transform your text into Wingdings symbols:
            </p>
            <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-300">
              <li>Enter Your Text: Type or paste the text you want to convert into the input box.</li>
              <li>Convert the Text: Click the convert button to change your text into Wingdings symbols.</li>
              <li>Copy the Converted Text: Use the copy button to copy the converted Wingdings text.</li>
              <li>Paste Anywhere: Paste the Wingdings symbols into any document, social media post, or other application.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Additional Features</h2>
            <p className="mb-4 text-gray-300">
              The Wingdings Converter isn't just about converting text to Wingdings. It comes with a few extra handy features:
            </p>
            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-300">
              <li>Multiple Conversions: Besides Wingdings, you can convert text to other symbol fonts like Webdings.</li>
              <li>Reverse Conversion: Convert Wingdings symbols back to regular text.</li>
              <li>Copy and Paste Support: Easily copy your converted text and paste it anywhere you need.</li>
              <li>Unicode Support: Ensures that your symbols are compatible across various platforms and devices.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">FAQs</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold mb-1">Why aren't some Wingdings symbols displaying correctly?</h3>
                <p className="text-gray-300">
                  This can happen if the platform you're using doesn't support Unicode. Make sure you're using modern applications and browsers.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">Can I convert Wingdings back to normal text?</h3>
                <p className="text-gray-300">
                  Yes, simply select the "Decode" option and paste your Wingdings symbols into the input box. The tool will attempt to convert the symbols back to regular text.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">Why do some symbols look different on my phone?</h3>
                <p className="text-gray-300">
                  Different devices have different support for Unicode characters. Mobile devices may render some symbols differently than desktop computers.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">How do I copy and paste the symbols?</h3>
                <p className="text-gray-300">
                  Use the "Copy to Clipboard" button next to your converted text, then paste it wherever you need using Ctrl+V (Windows) or Cmd+V (Mac).
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-1">What are some practical uses for Wingdings?</h3>
                <p className="text-gray-300">
                  Wingdings can be used for creating unique designs, adding symbols to documents, creating coded messages, or just for fun in casual communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WingdingsConverter;