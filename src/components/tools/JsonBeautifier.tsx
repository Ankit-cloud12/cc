import React, { useState, useRef, useEffect } from 'react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ToolLayout } from './ToolLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  FolderOpen,
  Copy,
  ClipboardPaste,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Maximize,
  Check,
  AlertTriangle,
  FileJson,
  FileText,
  AlignLeft,
  AlignRight,
  ListOrdered,
  Printer,
  Wrench,
  Filter,
  Network,
  Save,
  Search,
  Eye,
  EyeOff,
  Code,
  RefreshCw,
  GitBranch as TreeIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Type for JSON tree item
interface JsonTreeItem {
  key: string;
  value: any;
  type: string;
  expanded: boolean;
  children?: JsonTreeItem[];
}

// Function to create JSON tree data structure
const createJsonTree = (json: any, rootKey = 'root'): JsonTreeItem => {
  if (json === null) {
    return { key: rootKey, value: "null", type: 'null', expanded: true };
  }

  if (Array.isArray(json)) {
    const children = json.map((value, index) => createJsonTree(value, `${index}`));
    return {
      key: rootKey,
      value: json,
      type: 'array',
      expanded: true,
      children
    };
  }

  if (typeof json === 'object') {
    const children = Object.keys(json).map(key => createJsonTree(json[key], key));
    return {
      key: rootKey,
      value: json,
      type: 'object',
      expanded: true,
      children
    };
  }

  // Primitive values
  return {
    key: rootKey,
    value: json,
    type: typeof json,
    expanded: true
  };
};

// Component to render a tree view of JSON
const JsonTreeView: React.FC<{
  data: JsonTreeItem;
  onToggle: (path: string) => void;
  path?: string;
  level?: number;
}> = ({ data, onToggle, path = '', level = 0 }) => {
  const currentPath = path ? `${path}.${data.key}` : data.key;
  const indentStyle = { marginLeft: `${level * 20}px` };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(currentPath);
  };

  const getValueDisplay = (item: JsonTreeItem) => {
    switch (item.type) {
      case 'string':
        return <span className="text-green-400">"{item.value}"</span>;
      case 'number':
        return <span className="text-blue-400">{item.value}</span>;
      case 'boolean':
        return <span className="text-purple-400">{String(item.value)}</span>;
      case 'null':
        return <span className="text-gray-400">null</span>;
      default:
        return null;
    }
  };

  // For primitive values, render the key-value pair
  if (!data.children) {
    return (
      <div className="py-1" style={indentStyle}>
        <span className="text-yellow-300">{data.key}</span>
        {data.type !== 'object' && data.type !== 'array' && (
          <>
            <span className="text-gray-400">: </span>
            {getValueDisplay(data)}
          </>
        )}
      </div>
    );
  }

  // For objects and arrays, render a collapsible node
  return (
    <div>
      <div 
        className="flex items-center cursor-pointer py-1 hover:bg-gray-800" 
        style={indentStyle}
        onClick={handleToggle}
      >
        {data.expanded ? 
          <ChevronDown className="h-4 w-4 mr-1" /> : 
          <ChevronRight className="h-4 w-4 mr-1" />
        }
        <span className="text-yellow-300">{data.key}</span>
        <span className="text-gray-400 mr-1">: </span>
        <span className="text-gray-400">
          {data.type === 'object' ? '{' : '['}
          {!data.expanded && '...'}
          {data.expanded && data.children && data.children.length === 0 && (data.type === 'object' ? '{}' : '[]')}
          {!data.expanded && (data.type === 'object' ? '}' : ']')}
        </span>
      </div>
      
      {data.expanded && data.children && data.children.length > 0 && (
        <div>
          {data.children.map((child, index) => (
            <JsonTreeView 
              key={`${currentPath}.${index}`}
              data={child}
              onToggle={onToggle}
              path={currentPath}
              level={level + 1}
            />
          ))}
          <div className="py-1" style={{ ...indentStyle, marginLeft: `${(level + 1) * 20}px` }}>
            <span className="text-gray-400">{data.type === 'object' ? '}' : ']'}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Custom syntax highlighting for JSON in text area
const SyntaxHighlighter: React.FC<{ json: string, isValid: boolean | null }> = ({ json, isValid }) => {
  if (!json) return <div className="text-gray-400">Formatted JSON will appear here...</div>;
  if (isValid === false) return <div className="text-red-500">{json}</div>;

  try {
    // Simple regex-based highlighting for demo purposes
    // In a real implementation, you'd use a proper syntax highlighting library
    const highlighted = json
      .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
        let cls = 'text-blue-400'; // number
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-yellow-300'; // key
          } else {
            cls = 'text-green-400'; // string
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-purple-400'; // boolean
        } else if (/null/.test(match)) {
          cls = 'text-gray-400'; // null
        }
        return `<span class="${cls}">${match}</span>`;
      })
      .replace(/({|}|\[|\]|,|:)/g, (match) => {
        return `<span class="text-gray-400">${match}</span>`;
      });

    return <div className="font-mono whitespace-pre" dangerouslySetInnerHTML={{ __html: highlighted }} />;
  } catch (e) {
    return <div className="whitespace-pre">{json}</div>;
  }
};

// Add path utility for tree view toggling
const toggleNodeInTree = (tree: JsonTreeItem, path: string): JsonTreeItem => {
  const pathParts = path.split('.');
  
  if (pathParts[0] !== tree.key) return tree;
  
  if (pathParts.length === 1) {
    // This is the node to toggle
    return { ...tree, expanded: !tree.expanded };
  }
  
  // If this is not the node but it has children, recurse
  if (tree.children) {
    return {
      ...tree,
      children: tree.children.map(child => 
        toggleNodeInTree(child, pathParts.slice(1).join('.'))
      )
    };
  }
  
  return tree;
};

// JSON Beautifier Component
const JsonBeautifier: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [indentation, setIndentation] = useState('2'); // Default to 2 spaces
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [viewMode, setViewMode] = useState<'code' | 'tree'>('code');
  const [jsonTree, setJsonTree] = useState<JsonTreeItem | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [sortAlphabetically, setSortAlphabetically] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [formatOnPaste, setFormatOnPaste] = useState(true);
  const [autoFormat, setAutoFormat] = useState(true);
  const [useTabs, setUseTabs] = useState(false);
  const [stats, setStats] = useState({ size: 0, lines: 0, objects: 0, arrays: 0 });
  
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const history = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  // Format the JSON
  const formatJson = (text: string, indent: number | string = indentation, sort: boolean = sortAlphabetically) => {
    if (!text.trim()) {
      setOutputText('');
      setIsValid(null);
      setJsonTree(null);
      return;
    }
    
    try {
      let parsed = JSON.parse(text);
      
      // Apply sorting if needed
      if (sort) {
        parsed = sortObjectKeys(parsed);
      }
      
      // Calculate JSON stats
      const newStats = calculateStats(parsed);
      setStats(newStats);
      
      // Format with proper indentation
      const indentStr = useTabs ? '\t' : ' '.repeat(parseInt(indent as string, 10));
      const formatted = JSON.stringify(parsed, null, indentStr);
      
      setOutputText(formatted);
      setIsValid(true);
      
      // Create tree view
      const tree = createJsonTree(parsed);
      setJsonTree(tree);
      
      return formatted;
    } catch (error) {
      setOutputText(`Invalid JSON: ${(error as Error).message}`);
      setIsValid(false);
      setJsonTree(null);
      
      if (autoFormat) {
        toast({
          title: 'Error',
          description: `Invalid JSON: ${(error as Error).message}`,
          variant: 'destructive',
        });
      }
      
      return null;
    }
  };

  // Sort object keys recursively
  const sortObjectKeys = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys);
    }
    
    const sortedKeys = Object.keys(obj).sort();
    const sortedObj: { [key: string]: any } = {};
    sortedKeys.forEach(key => {
      sortedObj[key] = sortObjectKeys(obj[key]);
    });
    
    return sortedObj;
  };

  // Calculate JSON statistics
  const calculateStats = (json: any) => {
    let objects = 0;
    let arrays = 0;
    
    const countItems = (item: any) => {
      if (typeof item !== 'object' || item === null) return;
      
      if (Array.isArray(item)) {
        arrays++;
        item.forEach(countItems);
      } else {
        objects++;
        Object.values(item).forEach(countItems);
      }
    };
    
    countItems(json);
    
    const jsonStr = JSON.stringify(json);
    return {
      size: new Blob([jsonStr]).size,
      lines: jsonStr.split('\n').length,
      objects,
      arrays,
    };
  };

  // Auto-format effect
  useEffect(() => {
    if (autoFormat && inputText.trim()) {
      const timer = setTimeout(() => {
        formatJson(inputText);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [inputText, indentation, useTabs, sortAlphabetically, autoFormat]);

  // Handle format button click
  const handleFormat = () => {
    try {
      const formatted = formatJson(inputText);
      if (formatted) {
        toast({
          title: 'Success',
          description: 'JSON formatted successfully.',
          variant: 'default',
        });
        
        // Save to history
        addToHistory(inputText);
      }
    } catch (error) {
      // Error is already handled in formatJson
    }
  };

  // Handle minify button click
  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputText);
      const minified = JSON.stringify(parsed);
      setOutputText(minified);
      setIsValid(true);
      
      toast({
        title: 'Success',
        description: 'JSON minified successfully.',
        variant: 'default',
      });
      
      // Create tree view for minified version too
      const tree = createJsonTree(parsed);
      setJsonTree(tree);
      
      // Save to history
      addToHistory(inputText);
    } catch (error) {
      setOutputText(`Invalid JSON: ${(error as Error).message}`);
      setIsValid(false);
      setJsonTree(null);
      
      toast({
        title: 'Error',
        description: `Invalid JSON: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  // Handle validate button click
  const handleValidate = () => {
    try {
      const parsed = JSON.parse(inputText);
      setIsValid(true);
      
      // Just validate without changing output format
      const currentIndent = useTabs ? '\t' : ' '.repeat(parseInt(indentation, 10));
      setOutputText(JSON.stringify(parsed, null, currentIndent));
      
      toast({
        title: 'Valid JSON',
        description: 'The input is valid JSON.',
        variant: 'default',
      });
      
      // Create tree view
      const tree = createJsonTree(parsed);
      setJsonTree(tree);
      
      // Calculate statistics
      const newStats = calculateStats(parsed);
      setStats(newStats);
    } catch (error) {
      setIsValid(false);
      setOutputText(`Invalid JSON: ${(error as Error).message}`);
      setJsonTree(null);
      
      toast({
        title: 'Invalid JSON',
        description: `Error: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  // Handle tree node toggle
  const handleTreeNodeToggle = (path: string) => {
    if (!jsonTree) return;
    const updatedTree = toggleNodeInTree(jsonTree, path);
    setJsonTree(updatedTree);
  };

  // Handle sort button click
  const handleSort = () => {
    try {
      const parsed = JSON.parse(inputText);
      
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        toast({ 
          title: 'Sorting only applies to JSON objects.',
          variant: 'default' 
        });
        return;
      }
      
      const sortedJson = sortObjectKeys(parsed);
      const sortedText = JSON.stringify(sortedJson, null, useTabs ? '\t' : ' '.repeat(parseInt(indentation, 10)));
      
      // Update input directly
      setInputText(sortedText);
      
      // Format will be triggered by effect
      toast({ 
        title: 'JSON keys sorted alphabetically.',
        variant: 'default' 
      });
      
      // Save to history
      addToHistory(inputText);
    } catch (error) {
      toast({ 
        title: 'Error sorting JSON',
        description: `Invalid JSON: ${(error as Error).message}`,
        variant: 'destructive' 
      });
      setIsValid(false);
    }
  };

  // History management
  const addToHistory = (text: string) => {
    // Only add if different from current
    if (historyIndex.current >= 0 && history.current[historyIndex.current] === text) {
      return;
    }
    
    // If we're not at the end of history, truncate
    if (historyIndex.current < history.current.length - 1) {
      history.current = history.current.slice(0, historyIndex.current + 1);
    }
    
    // Add to history and update index
    history.current.push(text);
    historyIndex.current = history.current.length - 1;
    
    // Limit history size
    if (history.current.length > 50) {
      history.current.shift();
      historyIndex.current--;
    }
  };

  // Handle undo
  const handleUndo = () => {
    if (historyIndex.current > 0) {
      historyIndex.current--;
      setInputText(history.current[historyIndex.current]);
    } else {
      toast({ 
        title: 'Nothing to undo',
        variant: 'default' 
      });
    }
  };

  // Handle redo
  const handleRedo = () => {
    if (historyIndex.current < history.current.length - 1) {
      historyIndex.current++;
      setInputText(history.current[historyIndex.current]);
    } else {
      toast({ 
        title: 'Nothing to redo',
        variant: 'default' 
      });
    }
  };

  // Handle copy buttons
  const handleCopyInput = () => {
    navigator.clipboard.writeText(inputText);
    toast({ title: 'Input copied to clipboard!' });
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Output copied to clipboard!' });
  };

  // Handle paste
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      
      if (formatOnPaste) {
        formatJson(text);
      }
      
      toast({ title: 'Pasted from clipboard!' });
    } catch (err) {
      toast({ 
        title: 'Failed to paste from clipboard',
        variant: 'destructive' 
      });
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          setInputText(text);
          
          if (formatOnPaste) {
            formatJson(text);
          }
          
          toast({ title: `File "${file.name}" loaded.` });
          
          // Save to history
          addToHistory(text);
        } catch (error) {
          toast({ 
            title: 'Error reading file',
            variant: 'destructive' 
          });
        }
      };
      reader.onerror = () => {
        toast({ 
          title: 'Error reading file',
          variant: 'destructive' 
        });
      };
      reader.readAsText(file);
    }
    
    // Reset file input value so the same file can be loaded again
    if (event.target) {
      event.target.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Handle download
  const handleDownload = (content: string, filename: string, contentType: string) => {
    if (!content) {
      toast({ 
        title: 'Nothing to download',
        variant: 'default' 
      });
      return;
    }
    
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: `Downloaded ${filename}` });
  };

  // Handle clear buttons
  const handleClearInput = () => {
    // Save to history first if there's content
    if (inputText.trim()) {
      addToHistory(inputText);
    }
    
    setInputText('');
    setIsValid(null);
    
    if (!outputText) {
      setOutputText('');
      setJsonTree(null);
    }
  };

  const handleClearOutput = () => {
    setOutputText('');
    setIsValid(null);
    setJsonTree(null);
  };

  // Handle fullscreen
  const handleFullscreen = () => {
    const element = document.documentElement;
    
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        toast({ 
          title: `Error attempting to enable fullscreen: ${err.message}`,
          variant: 'destructive' 
        });
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Handle search
  const handleSearch = () => {
    if (!searchText.trim() || !inputText.trim()) {
      return;
    }
    
    try {
      const inputElement = inputRef.current;
      if (!inputElement) return;
      
      const text = inputElement.value;
      const index = text.indexOf(searchText);
      
      if (index !== -1) {
        // Set selection in the textarea
        inputElement.focus();
        inputElement.setSelectionRange(index, index + searchText.length);
        
        // Scroll to the selection
        // Calculate line number
        const textBeforeMatch = text.substring(0, index);
        const linesBefore = textBeforeMatch.split('\n').length;
        
        // Approximate scroll position
        const lineHeight = 20; // Approximate line height in pixels
        inputElement.scrollTop = (linesBefore - 3) * lineHeight;
        
        toast({ 
          title: `Found match for "${searchText}"`,
          variant: 'default' 
        });
      } else {
        toast({ 
          title: `No matches found for "${searchText}"`,
          variant: 'default' 
        });
      }
    } catch (error) {
      toast({ 
        title: 'Search error',
        description: (error as Error).message,
        variant: 'destructive' 
      });
    }
  };

  // Handle search on enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Fix JSON (attempt to repair)
  const handleRepairJson = () => {
    if (!inputText.trim()) {
      toast({ 
        title: 'No JSON to repair',
        variant: 'default' 
      });
      return;
    }
    
    try {
      // Basic repair attempts
      let repaired = inputText
        // Replace single quotes with double quotes
        .replace(/'/g, '"')
        // Add missing quotes around property names
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3')
        // Replace trailing commas in objects
        .replace(/,\s*}/g, '}')
        // Replace trailing commas in arrays
        .replace(/,\s*\]/g, ']')
        // Replace semicolons with commas
        .replace(/;/g, ',');
        
      setInputText(repaired);
      formatJson(repaired);
      
      toast({ 
        title: 'Attempted to repair JSON',
        description: 'Check the result and validate',
        variant: 'default' 
      });
      
      // Save to history
      addToHistory(inputText);
    } catch (error) {
      toast({ 
        title: 'Unable to repair JSON',
        description: (error as Error).message,
        variant: 'destructive' 
      });
    }
  };

  return (
    <ToolLayout title="JSON Beautifier & Validator" hideHeader={true}>
      <Tabs defaultValue="editor" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="editor">JSON Editor</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="help">Help</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Select value={indentation} onValueChange={setIndentation}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Indent Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 Spaces</SelectItem>
                <SelectItem value="4">4 Spaces</SelectItem>
                <SelectItem value="8">8 Spaces</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'code' ? 'tree' : 'code')}
            >
              {viewMode === 'code' ? (
                <TreeIcon className="h-4 w-4 mr-2" />
              ) : (
                <Code className="h-4 w-4 mr-2" />
              )}
              {viewMode === 'code' ? 'Tree View' : 'Code View'}
            </Button>
          </div>
        </div>
      
        <TabsContent value="editor" className="mt-0">
          <TooltipProvider delayDuration={100}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json,application/json,.txt,text/plain"
              style={{ display: 'none' }}
            />
            <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-200px)] border rounded-lg">
              {/* Input Panel */}
              <ResizablePanel defaultSize={45}>
                <div className="flex flex-col h-full">
                  {/* --- Input Toolbar --- */}
                  <div className="flex items-center p-1 border-b bg-muted/40 space-x-1 flex-wrap">
                    {/* Formatting & Manipulation */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleFormat}><AlignLeft className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Format JSON (Beautify)</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleMinify}><AlignRight className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Compact JSON (Minify)</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleSort}><ListOrdered className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Sort Keys Alphabetically</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleRepairJson}><Wrench className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Repair JSON</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleUndo}><Undo2 className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Undo</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleRedo}><Redo2 className="h-4 w-4" /></Button>
                      </TooltipTrigger>
                      <TooltipContent><p>Redo</p></TooltipContent>
                    </Tooltip>

                    {/* Search Box */}
                    <div className="flex-grow flex ml-2">
                      <Input
                        type="text"
                        placeholder="Search..."
                        className="h-8 text-xs w-full max-w-xs"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSearch}
                        className="h-8 ml-1"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* File & Clipboard */}
                    <div className="flex ml-auto">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={triggerFileUpload}><FolderOpen className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Open File</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={handleValidate}><Check className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Validate JSON</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={handleClearInput}><Trash2 className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Clear Input</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={handleCopyInput}><Copy className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Copy Input</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={handlePaste}><ClipboardPaste className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Paste</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" onClick={handleFullscreen}><Maximize className="h-4 w-4" /></Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Fullscreen</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                  {/* --- Input Textarea --- */}
                  <Textarea
                    ref={inputRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste or type your JSON here..."
                    className="flex-grow resize-none rounded-none focus-visible:ring-0 p-4 font-mono"
                    style={{ 
                      fontSize: '14px',
                      lineHeight: '1.5',
                      tabSize: parseInt(indentation, 10)
                    }}
                  />
                  <div className="p-1 border-t text-xs text-muted-foreground bg-muted/40 flex justify-between items-center">
                    <span>Ln: 1 Col: 1</span>
                    <span>
                      Auto Format: 
                      <Checkbox 
                        className="ml-2" 
                        checked={autoFormat} 
                        onCheckedChange={(checked) => 
                          setAutoFormat(checked === true)
                        }
                      />
                    </span>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              {/* Output Panel */}
              <ResizablePanel defaultSize={55}>
                <div className="flex flex-col h-full">
                  {/* --- Output Header --- */}
                  <div className="flex items-center p-2 border-b bg-muted/40 justify-between">
                    <div className="flex items-center">
                      <span className="font-semibold mr-2 text-sm">Output</span>
                      {isValid === true && <Check className="h-4 w-4 text-green-500 mr-2" />}
                      {isValid === false && <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleCopyOutput}
                        disabled={!outputText}
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDownload(outputText, 'formatted.json', 'application/json')}
                        disabled={!outputText || isValid === false}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={handleClearOutput}
                        disabled={!outputText}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                  </div>
                  
                  {/* --- Output Content --- */}
                  <div
                    className={`flex-grow overflow-auto p-4 font-mono ${isValid === false ? 'text-red-600' : ''}`}
                    style={{ 
                      fontSize: '14px',
                      lineHeight: '1.5',
                      backgroundColor: '#1e1e1e' 
                    }}
                  >
                    {viewMode === 'code' ? (
                      <SyntaxHighlighter json={outputText} isValid={isValid} />
                    ) : (
                      jsonTree ? (
                        <div className="text-white">
                          <JsonTreeView data={jsonTree} onToggle={handleTreeNodeToggle} />
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          {isValid === false ? outputText : "Format valid JSON to see tree view"}
                        </div>
                      )
                    )}
                  </div>
                  
                  {/* --- Status Bar --- */}
                  <div className="p-2 border-t text-xs text-muted-foreground bg-muted/40 flex justify-between">
                    <span>
                      {isValid === true ? 'Valid JSON' : isValid === false ? 'Invalid JSON' : 'Status: Ready'}
                    </span>
                    {isValid === true && (
                      <span>
                        Size: {stats.size} bytes | Objects: {stats.objects} | Arrays: {stats.arrays}
                      </span>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TooltipProvider>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="mt-0">
          <Card className="p-4">
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="auto-format" 
                  checked={autoFormat} 
                  onCheckedChange={(checked) => setAutoFormat(checked === true)}
                />
                <Label htmlFor="auto-format">Auto-format JSON while typing</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="format-paste" 
                  checked={formatOnPaste} 
                  onCheckedChange={(checked) => setFormatOnPaste(checked === true)}
                />
                <Label htmlFor="format-paste">Format JSON on paste</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="sort-keys" 
                  checked={sortAlphabetically} 
                  onCheckedChange={(checked) => setSortAlphabetically(checked === true)}
                />
                <Label htmlFor="sort-keys">Sort object keys alphabetically</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="use-tabs" 
                  checked={useTabs} 
                  onCheckedChange={(checked) => setUseTabs(checked === true)}
                />
                <Label htmlFor="use-tabs">Use tabs instead of spaces</Label>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Indentation</h3>
                <div className="flex items-center space-x-2">
                  <Select
                    value={indentation}
                    onValueChange={setIndentation}
                    disabled={useTabs}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Spaces" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Space</SelectItem>
                      <SelectItem value="2">2 Spaces</SelectItem>
                      <SelectItem value="3">3 Spaces</SelectItem>
                      <SelectItem value="4">4 Spaces</SelectItem>
                      <SelectItem value="8">8 Spaces</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">
                    {useTabs ? "Using tabs for indentation" : ""}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        
        {/* Help Tab */}
        <TabsContent value="help" className="mt-0">
          <Card>
            <div className="p-4 space-y-4">
              <h2 className="text-xl font-bold">JSON Beautifier & Validator</h2>
              <p>
                This tool helps you format, validate, and visualize JSON data. You can beautify messy JSON,
                validate its structure, and view it in multiple formats.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">Key Features</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Format JSON with customizable indentation</li>
                <li>Validate JSON structure and syntax</li>
                <li>View JSON in both code and tree views</li>
                <li>Sort JSON object keys alphabetically</li>
                <li>Minify JSON to reduce size</li>
                <li>Attempt to repair invalid JSON</li>
                <li>Search within your JSON</li>
                <li>Copy formatted JSON to clipboard</li>
                <li>Download formatted JSON</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">Keyboard Shortcuts</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2">
                  <code className="bg-gray-700 p-1 rounded">Ctrl+Z</code> - Undo
                </div>
                <div className="p-2">
                  <code className="bg-gray-700 p-1 rounded">Ctrl+Y</code> - Redo
                </div>
                <div className="p-2">
                  <code className="bg-gray-700 p-1 rounded">Ctrl+F</code> - Search
                </div>
                <div className="p-2">
                  <code className="bg-gray-700 p-1 rounded">Ctrl+S</code> - Save/Download
                </div>
              </div>
              
              <h3 className="text-lg font-semibold mt-4">What is JSON?</h3>
              <p>
                JSON (JavaScript Object Notation) is a lightweight data-interchange format that's easy for humans to read and write
                and easy for machines to parse and generate. It's based on a subset of JavaScript syntax and is often used to transmit
                data between a server and web application.
              </p>
              
              <h3 className="text-lg font-semibold mt-4">JSON Syntax Rules</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Data is in name/value pairs</li>
                <li>Data is separated by commas</li>
                <li>Curly braces hold objects</li>
                <li>Square brackets hold arrays</li>
                <li>Names must be strings, written with double quotes</li>
                <li>Values can be strings, numbers, objects, arrays, booleans (true/false), or null</li>
              </ul>
              
              <h3 className="text-lg font-semibold mt-4">Example</h3>
              <pre className="bg-gray-800 p-3 rounded overflow-auto">
                {`{
  "name": "John Doe",
  "age": 30,
  "isActive": true,
  "address": {
    "street": "123 Main St",
    "city": "Anytown"
  },
  "hobbies": ["reading", "cycling", "coding"]
}`}
              </pre>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
};

export default JsonBeautifier;
