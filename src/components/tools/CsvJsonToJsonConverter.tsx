import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ToolLayout } from "./ToolLayout";

const CsvJsonToJsonConverter = () => {
  const { toast } = useToast();

  // State for input/output
  const [csvJsonText, setCsvJsonText] = useState("");
  const [jsonText, setJsonText] = useState("");

  // File handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  // Conversion options
  const [minify, setMinify] = useState(false);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Allow .csvjson or .txt
      if (!file.name.endsWith(".csvjson") && !file.name.endsWith(".txt")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid CSVJSON file (.csvjson or .txt)",
          variant: "destructive",
        });
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvJsonText(text);
        toast({
          title: "File loaded",
          description: `Successfully loaded ${file.name}`,
        });
      };
      reader.onerror = () => {
        toast({
          title: "Error",
          description: "Failed to read the file",
          variant: "destructive",
        });
      };
      reader.readAsText(file);
    }
  };

  const handleCsvJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvJsonText(e.target.value);
  };

  const handleConvert = () => {
    if (!csvJsonText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste CSVJSON or upload a file.",
        variant: "destructive",
      });
      return;
    }

    try {
      const lines = csvJsonText.split(/\r?\n/).filter(line => line.trim() !== '');
      const jsonData: any[] = [];
      let errors: string[] = [];

      lines.forEach((line, index) => {
        try {
          // Wrap each line in brackets to make it a valid JSON array string
          const jsonArrayString = `[${line}]`;
          const parsedArray = JSON.parse(jsonArrayString);
          jsonData.push(parsedArray);
        } catch (parseError) {
          errors.push(`Error parsing line ${index + 1}: ${line}`);
          console.error(`Error parsing line ${index + 1}:`, parseError);
        }
      });
 
       if (errors.length > 0) {
          toast({
           title: "Partial Success with Errors",
           description: `Conversion complete, but ${errors.length} line(s) could not be parsed. Check console for details.`,
           variant: "default", // Changed from "warning"
         });
       } else {
         toast({
          title: "Success",
          description: "CSVJSON successfully converted to JSON.",
        });
      }

      const outputString = JSON.stringify(jsonData, null, minify ? 0 : 2);
      setJsonText(outputString);

    } catch (error) {
      console.error("Conversion error:", error);
      setJsonText(""); // Clear output on error
      let description = "Failed to convert CSVJSON.";
      if (error instanceof Error) {
        description = `Conversion Error: ${error.message}`;
      }
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setCsvJsonText("");
    setJsonText("");
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    toast({
      title: "Cleared",
      description: "All fields have been cleared",
    });
  };

  const handleCopyToClipboard = async () => {
    if (!jsonText) return;
    try {
      await navigator.clipboard.writeText(jsonText);
      toast({
        title: "Copied!",
        description: "JSON has been copied to clipboard",
      });
    } catch (err) {
      console.error("Failed to copy:", err);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    if (!jsonText) return;
    try {
      const blob = new Blob([jsonText], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "csvjson-to-json.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: "JSON file has been downloaded",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to download the file",
        variant: "destructive",
      });
    }
  };

  return (
    <ToolLayout title="CSVJSON > JSON" hideHeader={true}>
      <Card className="w-full bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              CSVJSON to JSON Converter
            </h1>
            <p className="text-muted-foreground">
              Convert CSVJSON (CSV-like text where each line is a JSON array) to standard JSON.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Input */}
            <div className="flex flex-col space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file-input">Upload a CSVJSON file (.csvjson, .txt)</Label>
                <Input
                  ref={fileInputRef}
                  id="file-input"
                  type="file"
                  accept=".csvjson,.txt"
                  onChange={handleFileChange}
                  className="bg-zinc-800 border-zinc-700 text-white file:text-white file:bg-zinc-700 file:border-zinc-600 file:rounded file:px-2 file:py-1 file:mr-2 hover:file:bg-zinc-600"
                />
                {fileName && (
                  <p className="text-sm text-zinc-400">
                    Selected file: {fileName}
                  </p>
                )}
              </div>
              <div className="grid gap-2 flex-grow">
                <Label htmlFor="csvjson-input">Or paste your CSVJSON here</Label>
                <Textarea
                  id="csvjson-input"
                  placeholder='"index","value1","value2"&#10;"number",1,2&#10;"boolean",false,true ...'
                  className="min-h-[300px] flex-grow bg-zinc-800 border-zinc-700 text-white font-mono"
                  value={csvJsonText}
                  onChange={handleCsvJsonChange}
                />
              </div>
              <div className="flex justify-start space-x-2 mt-auto pt-2">
                <Button
                  onClick={handleConvert}
                  disabled={!csvJsonText}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Convert
                </Button>
                <Button
                  onClick={handleClear}
                  variant="outline"
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Right Column: Options & Output */}
            <div className="flex flex-col space-y-4">
              {/* Options Section */}
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex items-center space-x-4 rounded-md border border-zinc-700 p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="minify"
                      checked={minify}
                      onCheckedChange={(checked) => setMinify(checked as boolean)}
                      className="rounded-sm border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 h-4 w-4"
                    />
                    <Label htmlFor="minify" className="cursor-pointer">Minify</Label>
                  </div>
                </div>
              </div>

              {/* Output Textarea */}
              <div className="grid gap-2 flex-grow">
                <Label htmlFor="json-output">JSON Result</Label>
                <Textarea
                  readOnly
                  id="json-output"
                  placeholder="JSON output will appear here..."
                  className="min-h-[300px] flex-grow bg-zinc-800 border-zinc-700 text-white font-mono"
                  value={jsonText}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-auto pt-2">
                <Button
                  onClick={handleDownload}
                  disabled={!jsonText}
                  variant="outline"
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
                >
                  Download
                </Button>
                <Button
                  onClick={handleCopyToClipboard}
                  disabled={!jsonText}
                  variant="outline"
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
                >
                  Copy to clipboard
                </Button>
              </div>
            </div>
          </div>

          {/* More Details Section */}
          <div className="space-y-4 pt-6 border-t border-zinc-800">
            <h2 className="text-lg font-semibold">More Details</h2>
            <div className="space-y-2 text-sm text-zinc-400">
              <ul className="list-disc list-inside space-y-1">
                <li>CSVJSON is a CSV-like text format where each line is a JSON array without the surrounding brackets.</li>
                <li>Parsing CSVJSON is done by processing one line at a time. Wrap a line with square brackets [] and use JSON.parse() to convert to a JSON array.</li>
                <li>This tool converts the entire CSVJSON input into a single JSON array containing an array for each line.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default CsvJsonToJsonConverter;
