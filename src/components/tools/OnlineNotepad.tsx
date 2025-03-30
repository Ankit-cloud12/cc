import { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, Trash2, Maximize, Save } from "lucide-react";

const OnlineNotepad = () => {
  // State variables for text content, statistics, and settings
  const [content, setContent] = useState<string>("");
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [lineCount, setLineCount] = useState<number>(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-save functionality
  useEffect(() => {
    // Load saved content on initial render
    const savedContent = localStorage.getItem("notepad-content");
    if (savedContent) {
      setContent(savedContent);
    }
  }, []);
  
  useEffect(() => {
    // Save content to localStorage when it changes
    if (content !== undefined) {
      const saveTimeout = setTimeout(() => {
        localStorage.setItem("notepad-content", content);
        setLastSaved(new Date());
      }, 1000); // 1 second debounce
      
      return () => clearTimeout(saveTimeout);
    }
  }, [content]);
  
  // Calculate statistics
  useEffect(() => {
    // Calculate word count, character count, and line count
    setWordCount(content ? content.trim().split(/\s+/).filter(Boolean).length : 0);
    setCharCount(content.length);
    setLineCount(content ? content.split(/\r\n|\r|\n/).length : 0);
  }, [content]);
  
  // Handler functions for buttons
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `notepad-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the notepad?")) {
      setContent("");
    }
  };
  
  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error(err));
    } else if (textareaRef.current) {
      textareaRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error(err));
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Online Notepad</h1>
      <p className="text-gray-300 mb-6">
        Write, edit, and save your notes online. Your text is automatically saved in your browser.
      </p>
      
      {/* Statistics Bar */}
      <div className="bg-zinc-700 p-2 rounded-t flex flex-wrap items-center justify-between text-sm">
        <div className="flex gap-4">
          <span>{wordCount} words</span>
          <span>{charCount} characters</span>
          <span>{lineCount} lines</span>
        </div>
        <div>
          {lastSaved && (
            <span className="text-gray-400">
              Last saved: {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      {/* Main Textarea */}
      <div className={`relative ${showLineNumbers ? 'flex' : ''}`}>
        {showLineNumbers && (
          <div className="line-numbers bg-zinc-800 text-gray-500 text-right p-4 select-none w-12 overflow-hidden">
            {Array.from({ length: Math.max(content.split('\n').length, 1) }, (_, i) => (
              <div key={i} className="leading-relaxed">{i + 1}</div>
            ))}
          </div>
        )}
        <Textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className={`w-full min-h-[60vh] bg-zinc-700 text-white border-zinc-600 ${showLineNumbers ? '' : 'rounded-t-none'} p-4 font-mono leading-relaxed`}
          placeholder="Start typing your notes here..."
        />
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={handleCopy}
        >
          <Copy className="mr-2 h-4 w-4" />
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={handleDownload}
        >
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={handleClear}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={toggleFullscreen}
        >
          <Maximize className="mr-2 h-4 w-4" />
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </div>
      
      {/* Settings Panel */}
      <div className="mt-6 bg-zinc-700 p-4 rounded">
        <h3 className="text-lg font-medium mb-2">Settings</h3>
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="line-numbers" className="cursor-pointer">Show Line Numbers</Label>
            <Switch
              id="line-numbers"
              checked={showLineNumbers}
              onCheckedChange={setShowLineNumbers}
            />
          </div>
          {/* Additional settings can be added here */}
        </div>
      </div>
      
      {/* About Section */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Online Notepad</h2>
        <p className="text-gray-300 mb-4">
          The Online Notepad is a simple yet powerful tool for writing and editing text directly in your browser.
          Your notes are automatically saved in your browser's local storage, so you won't lose your work
          even if you close the tab or refresh the page.
        </p>
        <p className="text-gray-300 mb-4">
          Key features:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Auto-save functionality</li>
          <li>Word, character, and line counting</li>
          <li>Optional line numbers</li>
          <li>Easy export options</li>
          <li>Fullscreen editing mode</li>
          <li>Clean, distraction-free interface</li>
        </ul>
        <p className="text-gray-300">
          This tool is perfect for taking quick notes, drafting content, or working on text that you need to access across sessions.
          No account required - everything is saved in your browser's local storage.
        </p>
      </div>
    </div>
  );
};

export default OnlineNotepad;
