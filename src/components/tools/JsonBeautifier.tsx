import React, { useState, useRef } from 'react';
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
import { ToolLayout } from './ToolLayout'; // Corrected import
import {
  FolderOpen,
  Copy,
  ClipboardPaste,
  Trash2,
  Undo2,
  Redo2,
  Download,
  Maximize,
  Check, // Corrected icon
  TriangleAlert, // Use TriangleAlert for error indication
  FileJson,
  FileText,
  AlignLeft, // Use AlignLeft for Indent
  AlignRight, // Use AlignRight for Outdent
  ListOrdered,
  Printer,
  Construction, // Use Construction for Wrench (Repair)
  Filter, // Placeholder for Transform
  Network, // Placeholder for Graph
  Save, // Placeholder for Save Online
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const JsonBeautifier: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [indentation, setIndentation] = useState('2'); // Default to 2 spaces
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(inputText);
      const indentSpaces = indentation === 'tab' ? '\t' : parseInt(indentation, 10);
      setOutputText(JSON.stringify(parsed, null, indentSpaces));
      setIsValid(true);
      toast({
        title: 'Success',
        description: 'JSON formatted successfully.',
        variant: 'default',
      });
    } catch (error) {
      setOutputText(`Invalid JSON: ${(error as Error).message}`);
      setIsValid(false);
      toast({
        title: 'Error',
        description: `Invalid JSON: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(inputText);
      setOutputText(JSON.stringify(parsed));
      setIsValid(true);
       toast({
        title: 'Success',
        description: 'JSON minified successfully.',
         variant: 'default',
      });
    } catch (error) {
      setOutputText(`Invalid JSON: ${(error as Error).message}`);
      setIsValid(false);
       toast({
        title: 'Error',
        description: `Invalid JSON: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleValidate = () => {
    try {
      JSON.parse(inputText);
      setIsValid(true);
      setOutputText('Valid JSON');
       toast({
        title: 'Valid JSON',
        description: 'The input is valid JSON.',
         variant: 'default', // Or a specific success variant
      });
    } catch (error) {
      setIsValid(false);
      setOutputText(`Invalid JSON: ${(error as Error).message}`);
       toast({
        title: 'Invalid JSON',
        description: `Error: ${(error as Error).message}`,
        variant: 'destructive',
      });
    }
  };

  const handleClearInput = () => {
    setInputText('');
    setIsValid(null);
  };

   const handleClearOutput = () => {
    setOutputText('');
     setIsValid(null); // Also clear validation status if output is cleared
  };

  const handleCopyInput = () => {
    navigator.clipboard.writeText(inputText);
    toast({ title: 'Input copied to clipboard!' });
  };

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputText);
    toast({ title: 'Output copied to clipboard!' });
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInputText(text);
      toast({ title: 'Pasted from clipboard!' });
    } catch (err) {
      toast({ title: 'Failed to paste from clipboard', variant: 'destructive' });
      console.error('Failed to read clipboard contents: ', err);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          setInputText(text);
           toast({ title: `File "${file.name}" loaded.` });
        } catch (error) {
           toast({ title: 'Error reading file', variant: 'destructive' });
        }
      };
      reader.onerror = () => {
         toast({ title: 'Error reading file', variant: 'destructive' });
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


  const handleDownload = (content: string, filename: string, contentType: string) => {
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

  // Basic Undo/Redo placeholders - requires more complex state management or editor library
  const handleUndo = () => toast({ title: 'Undo (Not Implemented)', variant: 'default' });
  const handleRedo = () => toast({ title: 'Redo (Not Implemented)', variant: 'default' });
  const handleFullscreen = () => toast({ title: 'Fullscreen (Not Implemented)', variant: 'default' });

  // New handler for sorting JSON keys
  const handleSort = () => {
    try {
      const parsed = JSON.parse(inputText);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        toast({ title: 'Sorting only applies to JSON objects.', variant: 'default' });
        return;
      }
      // Function to recursively sort object keys
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
      const sortedJson = sortObjectKeys(parsed);
      const indentSpaces = indentation === 'tab' ? '\t' : parseInt(indentation, 10);
      setInputText(JSON.stringify(sortedJson, null, indentSpaces)); // Update input directly
      setOutputText(''); // Clear output as input changed
      setIsValid(null);
      toast({ title: 'JSON keys sorted alphabetically.', variant: 'default' });
    } catch (error) {
      toast({ title: 'Error sorting JSON', description: `Invalid JSON: ${(error as Error).message}`, variant: 'destructive' });
      setIsValid(false);
    }
  };

  // New handler for printing
  const handlePrint = () => {
     // Basic print functionality - might need refinement for better formatting
     const printWindow = window.open('', '_blank');
     if (printWindow) {
       printWindow.document.write('<pre>' + escapeHtml(inputText) + '</pre>'); // Print input for now
       printWindow.document.close();
       printWindow.focus();
       printWindow.print();
       // printWindow.close(); // Optional: close automatically after print dialog
       toast({ title: 'Print dialog opened.' });
     } else {
       toast({ title: 'Could not open print window.', variant: 'destructive' });
     }
  };

  // Helper to escape HTML for printing - FINAL CORRECTED VERSION
  const escapeHtml = (unsafe: string): string => {
    return unsafe
         .replace(/&/g, "&")
         .replace(/</g, "<")
         .replace(/>/g, ">")
         .replace(/"/g, "\"") // Escaped double quote
         .replace(/'/g, "&#039;");
 }

  // Placeholders for complex features
  const handleTransform = () => toast({ title: 'Transform (Not Implemented)', variant: 'default' });
  const handleRepair = () => toast({ title: 'Repair (Not Implemented)', variant: 'default' });
  const handleGraph = () => toast({ title: 'JSON Graph (Not Implemented)', variant: 'default' });
  const handleSaveOnline = () => toast({ title: 'Save Online (Not Implemented)', variant: 'default' });


  return (
    <ToolLayout title="JSON Beautifier & Validator" hideHeader={true}>
      <TooltipProvider delayDuration={100}>
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".json,application/json,.txt,text/plain"
        style={{ display: 'none' }}
      />
      <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-150px)] border rounded-lg">
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
                <TooltipContent><p>Sort Contents (Keys)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleTransform}><Filter className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Transform/Filter (Not Implemented)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleRepair}><Construction className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Repair JSON (Not Implemented)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleUndo}><Undo2 className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Undo (Not Implemented)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleRedo}><Redo2 className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Redo (Not Implemented)</p></TooltipContent>
              </Tooltip>

              <div className="flex-grow"></div> {/* Spacer */}

              {/* File & Clipboard */}
               <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={triggerFileUpload}><FolderOpen className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Open File</p></TooltipContent>
              </Tooltip>
               <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleSaveOnline}><Save className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Save Online (Not Implemented)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleValidate}><Check className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Validate JSON</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handlePrint}><Printer className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Print</p></TooltipContent>
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
                  <Button variant="ghost" size="icon" onClick={handleGraph}><Network className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>JSON Graph (Not Implemented)</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleFullscreen}><Maximize className="h-4 w-4" /></Button>
                </TooltipTrigger>
                <TooltipContent><p>Fullscreen (Not Implemented)</p></TooltipContent>
              </Tooltip>
            </div>
            {/* --- Input Textarea --- */}
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste or type your JSON here..."
              className="flex-grow resize-none border-0 rounded-none focus-visible:ring-0 p-4"
            />
             <div className="p-1 border-t text-xs text-muted-foreground bg-muted/40">
              {/* Placeholder for Line/Col */}
              Ln: 1 Col: 1
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Actions Panel (Simplified) */}
        <ResizablePanel defaultSize={10} minSize={10} maxSize={15}>
          <div className="flex flex-col items-center justify-center h-full p-4 space-y-3 bg-muted/40 border-l border-r">
             <span className="text-sm font-medium text-muted-foreground">Options</span>
             <Select value={indentation} onValueChange={setIndentation}>
               <SelectTrigger className="w-full">
                 <SelectValue placeholder="Indentation" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="2">2 Spaces</SelectItem>
                 <SelectItem value="4">4 Spaces</SelectItem>
                 <SelectItem value="tab">Tab</SelectItem>
               </SelectContent>
             </Select>
             <Button onClick={() => handleDownload(outputText, 'formatted.json', 'application/json')} variant="outline" className="w-full" disabled={!outputText || isValid === false}>
               <Download className="mr-2 h-4 w-4" /> Download Output
             </Button>
           </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Output Panel */}
        <ResizablePanel defaultSize={45}>
          <div className="flex flex-col h-full">
             {/* --- Output Header (Simplified) --- */}
             <div className="flex items-center p-2 border-b bg-muted/40">
               <span className="font-semibold mr-auto text-sm">Output</span>
               {isValid === true && (
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <Check className="h-4 w-4 text-green-500 mr-2" />
                   </TooltipTrigger>
                   <TooltipContent><p>Valid JSON</p></TooltipContent>
                 </Tooltip>
               )}
               {isValid === false && (
                 <Tooltip>
                   <TooltipTrigger asChild>
                     <TriangleAlert className="h-4 w-4 text-red-500 mr-2" />
                   </TooltipTrigger>
                   <TooltipContent><p>Invalid JSON</p></TooltipContent>
                 </Tooltip>
               )}
               {/* Output actions moved or removed */}
             </div>
             {/* --- Output Textarea --- */}
            <Textarea
              value={outputText}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className={`flex-grow resize-none border-0 rounded-none focus-visible:ring-0 p-4 ${isValid === false ? 'text-red-600' : ''}`}
            />
             <div className="p-1 border-t text-xs text-muted-foreground bg-muted/40">
              {/* Placeholder for Line/Col */}
              Ln: 1 Col: 1
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      </TooltipProvider>
    </ToolLayout>
  );
};

export default JsonBeautifier;
