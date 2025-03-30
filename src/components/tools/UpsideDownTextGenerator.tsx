import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, RotateCcw } from "lucide-react";

const UpsideDownTextGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [upsideDownText, setUpsideDownText] = useState("");
  const [reversedText, setReversedText] = useState("");
  const [upsideDownReversedText, setUpsideDownReversedText] = useState("");
  const [mirrorText, setMirrorText] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("upside-down");
  const [stats, setStats] = useState({
    chars: 0,
    words: 0,
    sentences: 0,
    lines: 0,
  });

  // Character mappings for upside down text
  const upsideDownMap: { [key: string]: string } = {
    a: "ɐ", b: "q", c: "ɔ", d: "p", e: "ǝ", f: "ɟ", g: "ƃ", h: "ɥ", i: "ᴉ", j: "ɾ",
    k: "ʞ", l: "l", m: "ɯ", n: "u", o: "o", p: "d", q: "b", r: "ɹ", s: "s", t: "ʇ",
    u: "n", v: "ʌ", w: "ʍ", x: "x", y: "ʎ", z: "z",
    A: "∀", B: "ꓭ", C: "Ͻ", D: "ᗡ", E: "Ǝ", F: "Ⅎ", G: "⅁", H: "H", I: "I", J: "ſ",
    K: "ꓘ", L: "˩", M: "W", N: "N", O: "O", P: "Ԁ", Q: "Q", R: "ꓤ", S: "S", T: "⊥",
    U: "∩", V: "Λ", W: "M", X: "X", Y: "⅄", Z: "Z",
    "0": "0", "1": "Ɩ", "2": "ᄅ", "3": "Ɛ", "4": "ㄣ", "5": "ϛ", "6": "9", "7": "ㄥ", "8": "8", "9": "6",
    ",": "'", ".": "˙", "?": "¿", "!": "¡", '"': "„", "'": ",", "(": ")", ")": "(", "[": "]", "]": "[",
    "{": "}", "}": "{", "<": ">", ">": "<", "&": "⅋", "_": "‾", "^": "v", "/": "\\", "\\": "/",
    ";": "؛", ":": "꞉",
    " ": " ", "\n": "\n"
  };

  // Character mappings for mirror text
  const mirrorMap: { [key: string]: string } = {
    a: "ɒ", b: "d", c: "ɔ", d: "b", e: "ɘ", f: "ꟻ", g: "ᵷ", h: "ʜ", i: "i", j: "ꞁ",
    k: "ʞ", l: "l", m: "m", n: "ᴎ", o: "o", p: "q", q: "p", r: "ɿ", s: "ꙅ", t: "ƚ",
    u: "u", v: "v", w: "w", x: "x", y: "y", z: "ꙃ",
    A: "A", B: "ꓭ", C: "Ɔ", D: "ꓷ", E: "Ǝ", F: "ꓞ", G: "ꓜ", H: "H", I: "I", J: "Ꞁ",
    K: "ꓘ", L: "⅃", M: "M", N: "И", O: "O", P: "ꓑ", Q: "Ꝺ", R: "Я", S: "Ꙅ", T: "T",
    U: "U", V: "V", W: "W", X: "X", Y: "Y", Z: "Ꙁ",
    "1": "1", "2": "S", "3": "Ɛ", "4": "ᔭ", "5": "ꙅ", "6": "ꓯ", "7": "V", "8": "8", "9": "ꓷ", "0": "0",
    "&": "⅋", "?": "⸮", "!": "¡", "(": ")", ")": "(", "[": "]", "]": "[", "{": "}", "}": "{",
    "<": ">", ">": "<", ".": "˙", ",": "՝", "/": "\\", "\\": "/",
    " ": " ", "\n": "\n"
  };

  useEffect(() => {
    processText(inputText);
    calculateStats(inputText);
  }, [inputText]);

  const calculateStats = (text: string) => {
    const stats = {
      chars: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      sentences: text.trim() ? text.split(/[.!?]+\s*/g).filter(Boolean).length : 0,
      lines: text.trim() ? text.split(/\r\n|\r|\n/).length : 0
    };
    setStats(stats);
  };

  const processText = (text: string) => {
    // Generate upside down text
    let upsideDown = text
      .split("")
      .map(char => upsideDownMap[char] || char)
      .join("");
    setUpsideDownText(upsideDown);

    // Generate reversed text
    let reversed = text
      .split("")
      .reverse()
      .join("");
    setReversedText(reversed);

    // Generate upside down and reversed text
    let upsideDownReversed = text
      .split("")
      .map(char => upsideDownMap[char] || char)
      .reverse()
      .join("");
    setUpsideDownReversedText(upsideDownReversed);

    // Generate mirror text
    let mirror = text
      .split("")
      .map(char => mirrorMap[char] || char)
      .join("");
    setMirrorText(mirror);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setUpsideDownText("");
    setReversedText("");
    setUpsideDownReversedText("");
    setMirrorText("");
    setStats({
      chars: 0,
      words: 0,
      sentences: 0,
      lines: 0,
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="bg-gradient-to-r from-purple-700 via-blue-600 to-pink-600 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">Upside Down Text Generator</h1>
        <p className="text-lg opacity-90">
          Transform your text upside down, reverse it, or create mirror text for social media, messages, and creative projects.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Input Text</h2>
          <Textarea
            placeholder="Type or paste your content here..."
            className="w-full h-[300px] min-h-[300px] bg-zinc-700 text-white border-zinc-600 p-4 rounded resize-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="text-sm text-gray-400 flex justify-between">
            <span>{stats.chars} Characters</span>
            <span>{stats.words} Words</span>
            <span>{stats.sentences} Sentences</span>
            <span>{stats.lines} Lines</span>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Output Text</h2>
          <Tabs defaultValue="upside-down" value={activeTab} onValueChange={setActiveTab} className="h-[300px]">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="upside-down">Upside Down</TabsTrigger>
              <TabsTrigger value="reversed">Reversed</TabsTrigger>
              <TabsTrigger value="upside-down-reversed">Both</TabsTrigger>
              <TabsTrigger value="mirror">Mirror</TabsTrigger>
            </TabsList>
            <TabsContent value="upside-down" className="h-[calc(300px-2.5rem)]">
              <Card className="h-full">
                <CardContent className="p-4 bg-zinc-700 text-white rounded-md h-full overflow-auto">
                  <div className="flex justify-end mb-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-zinc-300 hover:text-white"
                      onClick={() => handleCopy(upsideDownText)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="text-lg break-words whitespace-pre-wrap">{upsideDownText}</div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reversed" className="h-[calc(300px-2.5rem)]">
              <Card className="h-full">
                <CardContent className="p-4 bg-zinc-700 text-white rounded-md h-full overflow-auto">
                  <div className="flex justify-end mb-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-zinc-300 hover:text-white"
                      onClick={() => handleCopy(reversedText)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="text-lg break-words whitespace-pre-wrap">{reversedText}</div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="upside-down-reversed" className="h-[calc(300px-2.5rem)]">
              <Card className="h-full">
                <CardContent className="p-4 bg-zinc-700 text-white rounded-md h-full overflow-auto">
                  <div className="flex justify-end mb-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-zinc-300 hover:text-white"
                      onClick={() => handleCopy(upsideDownReversedText)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="text-lg break-words whitespace-pre-wrap">{upsideDownReversedText}</div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="mirror" className="h-[calc(300px-2.5rem)]">
              <Card className="h-full">
                <CardContent className="p-4 bg-zinc-700 text-white rounded-md h-full overflow-auto">
                  <div className="flex justify-end mb-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-zinc-300 hover:text-white"
                      onClick={() => handleCopy(mirrorText)}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <div className="text-lg break-words whitespace-pre-wrap">{mirrorText}</div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 flex items-center"
              onClick={handleClear}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">How to Flip Text Upside Down?</h2>
          <p className="text-gray-300">
            All you have to do is write up the text that you want converting in the input field. 
            Then you will notice that in the output section, the text is getting automatically flipped 
            upside down. You can also choose from other text effects like reversed text or mirror text.
            Simply copy the result and paste it wherever you like.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">About Upside Down Text Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <p className="text-gray-300">
                Need to adjust the style of your text and turn it upside down? Our upside down text 
                generator is a swift, simple, reliable way for you to quickly edit and adjust your text 
                to ensure that it faces the perfect direction without fail.
              </p>
              <p className="text-gray-300">
                This can be great for adding a touch of detail to a particular project, or for adding 
                in a stylistic change that is going to really make a positive impression.
              </p>
              <p className="text-gray-300">
                Instead of losing hours making the edits yourself, our upside down text generator can be 
                the simplest way for you to flip your text quite literally from one side to the next with 
                one click.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Text Effects Available:</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-300">
                <li><strong>Upside Down Effect</strong>: Flips text upside down</li>
                <li><strong>Backwards Effect</strong>: Reverses text order</li>
                <li><strong>Both Effects Combined</strong>: Flips and reverses text</li>
                <li><strong>Mirror Text</strong>: Creates a mirrored version of your text</li>
              </ul>
              <div className="bg-zinc-800 p-4 rounded-md border border-zinc-700">
                <h4 className="text-lg font-medium mb-2">Example:</h4>
                <div className="text-green-400">Normal: This is an example of upside down text.</div>
                <div className="text-blue-400">Upside Down: ˙ʇxǝʇ uʍop ǝpᴉsdn ɟo ǝldɯɐxǝ uɐ sᴉ sᴉɥ┴</div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Common Uses for Upside Down Text</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Social Media</h3>
              <p className="text-gray-300">Stand out with unique captions and bio text on Instagram, Twitter, and Facebook.</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Creative Writing</h3>
              <p className="text-gray-300">Add interesting elements to stories, poems, and other creative texts.</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Messaging</h3>
              <p className="text-gray-300">Send fun and unique messages to friends that will catch their attention.</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Design</h3>
              <p className="text-gray-300">Create interesting visual elements for graphic design projects.</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Games</h3>
              <p className="text-gray-300">Use in puzzles, riddles, or as part of game content.</p>
            </div>
            <div className="bg-zinc-800 p-4 rounded-md">
              <h3 className="text-xl font-semibold mb-2">Usernames</h3>
              <p className="text-gray-300">Create unique usernames for gaming platforms and online forums.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpsideDownTextGenerator;