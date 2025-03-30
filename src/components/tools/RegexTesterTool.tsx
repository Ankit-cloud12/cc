import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Regex flags interface
interface RegexFlags {
  g: boolean; // global
  i: boolean; // case insensitive
  m: boolean; // multiline
  s: boolean; // dot all
  u: boolean; // unicode
  y: boolean; // sticky
}

// Match information interface
interface MatchInfo {
  index: number;
  value: string;
  groups: { [key: string]: string } | null;
  lineNumber: number;
  columnNumber: number;
}

const RegexTesterTool = () => {
  // Input text states
  const [pattern, setPattern] = useState<string>("");
  const [testString, setTestString] = useState<string>("");
  const [replacementString, setReplacementString] = useState<string>("");
  
  // Regex flags
  const [flags, setFlags] = useState<RegexFlags>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
    y: false
  });
  
  // UI states
  const [highlightedText, setHighlightedText] = useState<string>("");
  const [matchCount, setMatchCount] = useState<number>(0);
  const [matches, setMatches] = useState<MatchInfo[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number>(-1);
  const [replacedText, setReplacedText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  
  // For scrolling to matches
  const testInputRef = useRef<HTMLTextAreaElement>(null);
  
  // Process regex whenever inputs change
  useEffect(() => {
    testRegex();
  }, [pattern, testString, flags]);
  
  // Main function to test the regex
  const testRegex = () => {
    setErrorMessage(null);
    
    if (!pattern || !testString) {
      setHighlightedText(testString);
      setMatches([]);
      setMatchCount(0);
      setReplacedText("");
      return;
    }
    
    try {
      // Create regex from pattern and flags
      const flagString = Object.entries(flags)
        .filter(([_, enabled]) => enabled)
        .map(([flag]) => flag)
        .join("");
      
      const regex = new RegExp(pattern, flagString);
      
      // Find all matches
      const allMatches: MatchInfo[] = [];
      
      // If global flag is set, find all matches
      if (flags.g) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          // Calculate line number and column
          const textBeforeMatch = testString.substring(0, match.index);
          const lineNumber = (textBeforeMatch.match(/\n/g) || []).length + 1;
          const lastNewlineIndex = textBeforeMatch.lastIndexOf('\n');
          const columnNumber = lastNewlineIndex === -1 
                                ? match.index + 1 
                                : match.index - lastNewlineIndex;
          
          // Add match info
          allMatches.push({
            index: match.index,
            value: match[0],
            groups: match.groups || null,
            lineNumber,
            columnNumber
          });
          
          // Prevent infinite loops for zero-length matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        // Just find the first match
        const match = regex.exec(testString);
        if (match) {
          // Calculate line number and column
          const textBeforeMatch = testString.substring(0, match.index);
          const lineNumber = (textBeforeMatch.match(/\n/g) || []).length + 1;
          const lastNewlineIndex = textBeforeMatch.lastIndexOf('\n');
          const columnNumber = lastNewlineIndex === -1 
                                ? match.index + 1 
                                : match.index - lastNewlineIndex;
          
          allMatches.push({
            index: match.index,
            value: match[0],
            groups: match.groups || null,
            lineNumber,
            columnNumber
          });
        }
      }
      
      setMatches(allMatches);
      setMatchCount(allMatches.length);
      
      // Handle replacement
      try {
        const replacedText = testString.replace(regex, replacementString);
        setReplacedText(replacedText);
      } catch (e) {
        if (e instanceof Error) {
          setErrorMessage(`Replacement error: ${e.message}`);
        }
      }
      
      // Create highlighted HTML with matches
      highlightMatches(allMatches);
      
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(`Invalid regex: ${e.message}`);
      } else {
        setErrorMessage("An error occurred while processing the regular expression");
      }
      setHighlightedText(testString);
      setMatches([]);
      setMatchCount(0);
      setReplacedText("");
    }
  };
  
  // Create HTML with highlighted matches
  const highlightMatches = (matches: MatchInfo[]) => {
    if (matches.length === 0) {
      setHighlightedText(testString);
      return;
    }
    
    // Sort matches by index to handle them in order
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
    
    let lastIndex = 0;
    let highlightedHtml = "";
    
    sortedMatches.forEach((match, i) => {
      // Add text before match
      highlightedHtml += testString.substring(lastIndex, match.index);
      
      // Add highlighted match
      const isSelected = i === selectedMatch;
      highlightedHtml += `<mark class="${isSelected ? 'selected-match' : 'match'}">${match.value}</mark>`;
      
      // Update last index
      lastIndex = match.index + match.value.length;
    });
    
    // Add remaining text
    highlightedHtml += testString.substring(lastIndex);
    
    setHighlightedText(highlightedHtml);
  };
  
  // Update highlighting when selected match changes
  useEffect(() => {
    if (matches.length > 0) {
      highlightMatches(matches);
    }
  }, [selectedMatch]);
  
  // Toggle a regex flag
  const toggleFlag = (flag: keyof RegexFlags) => {
    setFlags(prev => ({
      ...prev,
      [flag]: !prev[flag]
    }));
  };
  
  // Handle example loading
  const loadExample = (example: string) => {
    switch (example) {
      case "email":
        setPattern("\\b[\\w.%-]+@[\\w.-]+\\.[a-zA-Z]{2,}\\b");
        setTestString("Contact us at support@example.com or sales@company.co.uk for more information.");
        setFlags({
          g: true,
          i: false,
          m: false,
          s: false,
          u: false,
          y: false
        });
        break;
      case "phone":
        setPattern("\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b");
        setTestString("Call us at 555-123-4567 or 800.555.1234 for customer service.");
        setFlags({
          g: true,
          i: false,
          m: false,
          s: false,
          u: false,
          y: false
        });
        break;
      case "dates":
        setPattern("\\b(\\d{1,2})[-/](\\d{1,2})[-/](\\d{2,4})\\b");
        setTestString("The meeting is scheduled for 12/15/2023 and the deadline is 01-31-2024.");
        setFlags({
          g: true,
          i: false,
          m: false,
          s: false,
          u: false,
          y: false
        });
        break;
      case "groups":
        setPattern("(\\w+)=([\"']?[\\w\\s]+[\"']?)");
        setTestString('name="John Doe" age=30 city=\'New York\'');
        setFlags({
          g: true,
          i: false,
          m: false,
          s: false,
          u: false,
          y: false
        });
        break;
      default:
        break;
    }
  };
  
  // Copy result to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Clear all inputs
  const handleClear = () => {
    setPattern("");
    setTestString("");
    setReplacementString("");
    setMatches([]);
    setMatchCount(0);
    setHighlightedText("");
    setReplacedText("");
    setErrorMessage(null);
    setSelectedMatch(-1);
  };
  
  // Select a specific match
  const selectMatch = (index: number) => {
    setSelectedMatch(index);
    
    // Scroll to the match in the test input
    if (testInputRef.current && matches[index]) {
      const match = matches[index];
      const textArea = testInputRef.current;
      
      // Calculate position to scroll to (approximate)
      const lines = testString.substring(0, match.index).split('\n');
      const lineHeight = 20; // approximate line height in pixels
      const scrollTop = (lines.length - 1) * lineHeight;
      
      textArea.scrollTop = scrollTop - 60; // Adjust to center the match
    }
  };
  
  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Regex Tester Tool</h1>
      <p className="text-gray-300 mb-6">
        Test regular expressions with real-time highlighting, match information, and string replacement.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Input */}
        <div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <Label htmlFor="regex-pattern">Regular Expression Pattern</Label>
              <div className="space-x-2">
                <Button
                  variant="outline" 
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample("email")}
                >
                  Email
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample("phone")}
                >
                  Phone
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample("groups")}
                >
                  Groups
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <span className="absolute left-3 top-2.5 text-gray-400">/</span>
                <Input
                  id="regex-pattern"
                  className="pl-6 pr-6 font-mono bg-zinc-700 text-white border-zinc-600"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern"
                />
                <span className="absolute right-3 top-2.5 text-gray-400">/</span>
              </div>
              <div className="flex gap-1">
                {Object.keys(flags).map((flag) => (
                  <Button
                    key={flag}
                    variant="outline"
                    size="sm"
                    className={`w-8 ${flags[flag as keyof RegexFlags] 
                      ? 'bg-zinc-600 text-white' 
                      : 'bg-zinc-700 text-gray-400'} border-zinc-600`}
                    onClick={() => toggleFlag(flag as keyof RegexFlags)}
                  >
                    {flag}
                  </Button>
                ))}
              </div>
            </div>
            
            {errorMessage && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="mb-4">
            <Label htmlFor="test-string" className="mb-2 block">Test String</Label>
            <Textarea
              id="test-string"
              ref={testInputRef}
              className="min-h-[150px] font-mono bg-zinc-700 text-white border-zinc-600"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Enter text to test against the regex pattern"
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="replacement-string" className="mb-2 block">Replacement String</Label>
            <Input
              id="replacement-string"
              className="font-mono bg-zinc-700 text-white border-zinc-600"
              value={replacementString}
              onChange={(e) => setReplacementString(e.target.value)}
              placeholder="For string.replace() operations, $1, $2 for captures"
            />
          </div>
          
          <Button
            variant="outline"
            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
            onClick={handleClear}
          >
            Clear All
          </Button>
        </div>
        
        {/* Right Column - Results */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <Label>Results</Label>
              <div className="text-sm text-gray-400">
                {matchCount > 0 && (
                  <span>{matchCount} match{matchCount !== 1 ? 'es' : ''} found</span>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="matches">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="matches">Matches</TabsTrigger>
                <TabsTrigger value="highlighted">Highlighted</TabsTrigger>
                <TabsTrigger value="replaced">Replaced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="matches" className="space-y-4 mt-4">
                {matches.length > 0 ? (
                  <div className="border rounded border-zinc-600 divide-y divide-zinc-600 max-h-[300px] overflow-y-auto">
                    {matches.map((match, i) => (
                      <div 
                        key={i}
                        className={`p-3 hover:bg-zinc-600 cursor-pointer ${
                          selectedMatch === i ? 'bg-zinc-600' : 'bg-zinc-700'
                        }`}
                        onClick={() => selectMatch(i)}
                      >
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-400 text-sm">Match #{i+1}</span>
                          <span className="text-xs text-gray-400">
                            Line {match.lineNumber}, Col {match.columnNumber}
                          </span>
                        </div>
                        <div className="font-mono border-l-2 border-blue-500 pl-2 break-all">
                          {match.value}
                        </div>
                        
                        {match.groups && Object.keys(match.groups).length > 0 && (
                          <div className="mt-2 pl-2">
                            <div className="text-xs text-gray-400 mb-1">Capture Groups:</div>
                            {Object.entries(match.groups).map(([name, value], j) => (
                              <div key={j} className="text-sm">
                                <span className="text-gray-400">{name}: </span>
                                <span className="font-mono text-white">{value}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-zinc-700 p-4 rounded text-center text-gray-400">
                    No matches found
                  </div>
                )}
                
                {matches.length > 0 && (
                  <Button
                    variant="outline"
                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                    onClick={() => handleCopy(matches.map(m => m.value).join('\n'))}
                  >
                    {copied ? "Copied!" : "Copy All Matches"}
                  </Button>
                )}
              </TabsContent>
              
              <TabsContent value="highlighted" className="mt-4">
                <div 
                  className="bg-zinc-700 p-4 rounded font-mono min-h-[300px] max-h-[500px] overflow-auto whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightedText
                      // Ensure newlines are preserved
                      .replace(/\n/g, '<br>')
                      // Custom styling for matches
                      .replace(/<mark class="match">/g, '<mark style="background-color: rgba(59, 130, 246, 0.5); color: white; border-radius: 2px; padding: 0 2px;">')
                      .replace(/<mark class="selected-match">/g, '<mark style="background-color: rgba(59, 130, 246, 0.8); color: white; border-radius: 2px; padding: 0 2px;">')
                  }}
                ></div>
              </TabsContent>
              
              <TabsContent value="replaced" className="mt-4">
                <Textarea
                  readOnly
                  className="min-h-[300px] font-mono bg-zinc-700 text-white border-zinc-600"
                  value={replacedText}
                  placeholder="Replacement result will appear here"
                />
                
                <Button
                  variant="outline"
                  className="w-full mt-4 bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => handleCopy(replacedText)}
                  disabled={!replacedText}
                >
                  {copied ? "Copied!" : "Copy Replaced Text"}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* RegEx Cheat Sheet */}
      <div className="mt-8 mb-4 bg-zinc-700 p-4 rounded">
        <Tabs defaultValue="basics">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="charclasses">Character Classes</TabsTrigger>
            <TabsTrigger value="quantifiers">Quantifiers</TabsTrigger>
            <TabsTrigger value="flags">Flags</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basics" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Basic Patterns</h3>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-600">
                    <tr>
                      <td className="py-1 font-mono text-blue-400">.</td>
                      <td className="py-1 pl-2">Any character except newline</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">^</td>
                      <td className="py-1 pl-2">Start of string</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">$</td>
                      <td className="py-1 pl-2">End of string</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">|</td>
                      <td className="py-1 pl-2">Alternation (OR)</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\</td>
                      <td className="py-1 pl-2">Escape character</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Groups</h3>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-600">
                    <tr>
                      <td className="py-1 font-mono text-blue-400">(abc)</td>
                      <td className="py-1 pl-2">Capture group</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">(?:abc)</td>
                      <td className="py-1 pl-2">Non-capturing group</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">(?&lt;name&gt;abc)</td>
                      <td className="py-1 pl-2">Named capture group</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\1, \2, ...</td>
                      <td className="py-1 pl-2">Backreference to group</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="charclasses" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Character Classes</h3>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-600">
                    <tr>
                      <td className="py-1 font-mono text-blue-400">[abc]</td>
                      <td className="py-1 pl-2">Any one character of a, b, or c</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">[^abc]</td>
                      <td className="py-1 pl-2">Any one character except a, b, or c</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">[a-z]</td>
                      <td className="py-1 pl-2">Any one character in range a-z</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\d</td>
                      <td className="py-1 pl-2">Any digit (0-9)</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\D</td>
                      <td className="py-1 pl-2">Any non-digit</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">More Character Classes</h3>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-600">
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\w</td>
                      <td className="py-1 pl-2">Word character [A-Za-z0-9_]</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\W</td>
                      <td className="py-1 pl-2">Non-word character</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\s</td>
                      <td className="py-1 pl-2">Whitespace character</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\S</td>
                      <td className="py-1 pl-2">Non-whitespace character</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">\b</td>
                      <td className="py-1 pl-2">Word boundary</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="quantifiers" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Quantifiers</h3>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-600">
                    <tr>
                      <td className="py-1 font-mono text-blue-400">*</td>
                      <td className="py-1 pl-2">0 or more</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">+</td>
                      <td className="py-1 pl-2">1 or more</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">?</td>
                      <td className="py-1 pl-2">0 or 1 (optional)</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">{`{3}`}</td>
                      <td className="py-1 pl-2">Exactly 3 times</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">{`{3,}`}</td>
                      <td className="py-1 pl-2">3 or more times</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">More Quantifiers</h3>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-600">
                    <tr>
                      <td className="py-1 font-mono text-blue-400">{`{3,5}`}</td>
                      <td className="py-1 pl-2">Between 3 and 5 times</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">*?</td>
                      <td className="py-1 pl-2">Non-greedy * (minimal matching)</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">+?</td>
                      <td className="py-1 pl-2">Non-greedy + (minimal matching)</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">??</td>
                      <td className="py-1 pl-2">Non-greedy ? (minimal matching)</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">{`{n,m}?`}</td>
                      <td className="py-1 pl-2">Non-greedy {`{n,m}`} (minimal matching)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="flags" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Flags</h3>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-600">
                    <tr>
                      <td className="py-1 font-mono text-blue-400">g</td>
                      <td className="py-1 pl-2">Global search (find all matches)</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">i</td>
                      <td className="py-1 pl-2">Case-insensitive search</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">m</td>
                      <td className="py-1 pl-2">Multi-line mode (^ and $ match line start/end)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">More Flags</h3>
                <table className="w-full">
                  <tbody className="divide-y divide-zinc-600">
                    <tr>
                      <td className="py-1 font-mono text-blue-400">s</td>
                      <td className="py-1 pl-2">Dot matches newline too</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">u</td>
                      <td className="py-1 pl-2">Unicode mode</td>
                    </tr>
                    <tr>
                      <td className="py-1 font-mono text-blue-400">y</td>
                      <td className="py-1 pl-2">Sticky mode (match at current position only)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* About Section */}
      <div className="mt-4 mb-12">
        <h2 className="text-xl font-bold mb-4">About Regex Tester</h2>
        <p className="text-gray-300 mb-4">
          Regular expressions (regex) are powerful patterns used to match character combinations in strings.
          This tool helps you test, debug, and visualize your regular expressions before using them in your code.
        </p>
        <p className="text-gray-300 mb-4">
          Key features:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li><strong>Real-time testing:</strong> See matches as you type</li>
          <li><strong>Match highlighting:</strong> Visually identify where matches occur in your text</li>
          <li><strong>Capture groups:</strong> View named and numbered capture groups</li>
          <li><strong>Replacement:</strong> Test string replacement operations</li>
          <li><strong>Regex flags:</strong> Toggle global, case-insensitive, multiline, and other modes</li>
          <li><strong>Batch mode:</strong> Apply multiple replacements at once</li>
          <li><strong>Reference:</strong> Built-in regex cheat sheet for quick syntax lookup</li>
        </ul>
        <p className="text-gray-300">
          Regular expressions are supported in most programming languages including JavaScript, Python, Java, PHP, and many text editors.
          Test your patterns here before implementing them in your code.
        </p>
      </div>
    </div>
  );
};

export default RegexTesterTool;
