import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import { ToolLayout } from "./ToolLayout";

interface ParsedData {
  data: any[];
  errors: Papa.ParseError[];
  meta: Papa.ParseMeta;
}

const CsvToJsonConverter = () => {
  const { toast } = useToast();

  // State for input/output
  const [csvText, setCsvText] = useState("");
  const [jsonText, setJsonText] = useState("");

  // File handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  // Conversion options
  const [separator, setSeparator] = useState("auto");
  const [parseNumbers, setParseNumbers] = useState(true);
  const [parseJson, setParseJson] = useState(false);
  const [transpose, setTranspose] = useState(false);
  const [outputFormat, setOutputFormat] = useState("array");
  const [minify, setMinify] = useState(false);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCsvText(text);
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

  const handleCsvChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCsvText(e.target.value);
  };

  const handleConvert = () => {
    try {
      const config: Papa.ParseConfig = {
        delimiter: separator === "auto" ? "" : separator,
        dynamicTyping: parseNumbers,
        header: outputFormat === "hash",
        transformHeader: (header) => header.trim(),
        skipEmptyLines: true,
        transform: (value) => {
          if (parseJson && value) {
            try {
              // Attempt to parse, return original value if it fails
              return JSON.parse(value);
            } catch {
              return value;
            }
          }
          return value;
        },
      };

      const result: ParsedData = Papa.parse(csvText, config);

      if (result.errors.length > 0) {
        const errorMessage = result.errors
          .map((err) => `Error at row ${err.row}: ${err.message}`)
          .join("\n");
        throw new Error(errorMessage);
      }

      let jsonData = result.data;

      if (transpose) {
        jsonData = transposeData(jsonData);
      }

      const jsonString = JSON.stringify(jsonData, null, minify ? 0 : 2);
      setJsonText(jsonString);

      toast({
        title: "Success",
        description: "CSV successfully converted to JSON",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      setJsonText(""); // Clear output on error
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to convert",
        variant: "destructive",
      });
    }
  };

  const transposeData = (data: any[][]): any[][] => {
    if (!data || data.length === 0 || !Array.isArray(data[0])) return [];
    const numRows = data.length;
    const numCols = data[0].length;
    const transposed: any[][] = [];
    for (let j = 0; j < numCols; j++) {
      transposed[j] = Array(numRows);
    }
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        transposed[j][i] = data[i][j];
      }
    }
    return transposed;
  };

  const handleClear = () => {
    setCsvText("");
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
    try {
      const blob = new Blob([jsonText], {
        type: "application/json;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "csv-to-json.json";
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
    <ToolLayout title="CSV or TSV > JSON" hideHeader={true}>
      <Card className="w-full bg-zinc-900 border-zinc-800 text-white">
        {" "}
        {/* Ensure card text is white */}
        <CardHeader>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              CSV/TSV to JSON Converter
            </h1>
            <p className="text-muted-foreground">
              Convert CSV (Comma-Separated Values) or TSV (Tab-Separated Values)
              to JSON format
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Top Row: Upload and Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Upload */}
            <div className="grid gap-2">
              <Label htmlFor="file-input">Upload a CSV file</Label>
              <Input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept=".csv,.tsv,.txt"
                onChange={handleFileChange}
                className="bg-zinc-800 border-zinc-700 text-white file:text-white file:bg-zinc-700 file:border-zinc-600 file:rounded file:px-2 file:py-1 file:mr-2 hover:file:bg-zinc-600"
              />
              {fileName && (
                <p className="text-sm text-zinc-400">
                  Selected file: {fileName}
                </p>
              )}
            </div>

            {/* Right: Options */}
            <div className="space-y-4">
              <Label>Options</Label>
              <div className="grid gap-4 rounded-md border border-zinc-700 p-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="separator">Separator</Label>
                    <select
                      id="separator"
                      className="w-full bg-zinc-800 border-zinc-700 rounded-md p-2 text-white"
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                    >
                      <option value="auto">Auto-detect</option>
                      <option value=",">Comma (,)</option>
                      <option value="\t">Tab (\\t)</option>
                      <option value=";">Semicolon (;)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>Output Format</Label>
                    <RadioGroup
                      value={outputFormat}
                      onValueChange={setOutputFormat}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="array"
                          id="array"
                          className="border-zinc-600 text-white"
                        />
                        <Label htmlFor="array">Array</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="hash"
                          id="hash"
                          className="border-zinc-600 text-white"
                        />
                        <Label htmlFor="hash">Hash</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={parseNumbers}
                      onChange={(e) => setParseNumbers(e.target.checked)}
                      className="rounded-sm border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Parse numbers</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={parseJson}
                      onChange={(e) => setParseJson(e.target.checked)}
                      className="rounded-sm border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Parse JSON</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={transpose}
                      onChange={(e) => setTranspose(e.target.checked)}
                      className="rounded-sm border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Transpose</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={minify}
                      onChange={(e) => setMinify(e.target.checked)}
                      className="rounded-sm border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                    />
                    <span>Minify</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Input/Output Textareas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Input Textarea */}
            <div className="grid gap-2">
              <Label htmlFor="csv-input">Or paste your CSV here</Label>
              <Textarea
                id="csv-input"
                placeholder="album, year, US_peak_chart_post&#10;The White Stripes, 1999, -&#10;De Stijl, 2000, -&#10;..."
                className="min-h-[300px] bg-zinc-800 border-zinc-700 text-white font-mono" // Ensure text is white, use mono font
                value={csvText}
                onChange={handleCsvChange}
              />
              <div className="flex justify-start space-x-2 mt-2">
                <Button
                  onClick={handleConvert}
                  disabled={!csvText}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Convert
                </Button>
                {/* Apply custom styles for outline appearance with white text */}
                <Button
                  onClick={handleClear}
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white px-4 py-2 rounded"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Right: Output Textarea */}
            <div className="grid gap-2">
              <Label htmlFor="json-output">JSON</Label>
              <Textarea
                readOnly
                id="json-output"
                placeholder="JSON output will appear here..."
                className="min-h-[300px] bg-zinc-800 border-zinc-700 text-white font-mono" // Ensure text is white, use mono font
                value={jsonText}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <Button
                  onClick={handleDownload}
                  disabled={!jsonText}
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white px-4 py-2 rounded" // Apply custom styles
                >
                  Download
                </Button>
                <Button
                  onClick={handleCopyToClipboard}
                  disabled={!jsonText}
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white px-4 py-2 rounded" // Apply custom styles
                >
                  Copy to clipboard
                </Button>
              </div>
            </div>
          </div>

          {/* More Details Section (Below the grid) */}
          <div className="space-y-4 pt-6 border-t border-zinc-800">
            <h2 className="text-lg font-semibold">More Details</h2>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>
                This tool converts CSV (Comma-Separated Values) or TSV
                (Tab-Separated Values) to JSON format.
              </p>
              <p>
                <strong>Options explained:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Separator:</strong> Choose the delimiter that
                  separates your data (auto-detect available).
                </li>
                <li>
                  <strong>Parse numbers:</strong> Convert numeric strings to
                  numbers in the output.
                </li>
                <li>
                  <strong>Parse JSON:</strong> Attempt to parse JSON strings
                  found within cells.
                </li>
                <li>
                  <strong>Transpose:</strong> Swap rows and columns before
                  conversion.
                </li>
                <li>
                  <strong>Output Format:</strong> Choose 'Array' for an array of
                  arrays/objects (default) or 'Hash' to use the first row as
                  headers for an array of objects.
                </li>
                <li>
                  <strong>Minify:</strong> Remove whitespace from the output
                  JSON for a compact result.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default CsvToJsonConverter;
