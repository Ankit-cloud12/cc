import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Papa from "papaparse";
import { ToolLayout } from "./ToolLayout";

// TODO: Define interfaces if needed for complex data structures

const JsonToCsvConverter = () => {
  const { toast } = useToast();

  // State for input/output
  const [jsonText, setJsonText] = useState("");
  const [csvText, setCsvText] = useState("");

  // File handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  // Conversion options - based on screenshot
  const [separator, setSeparator] = useState(","); // Default to Comma
  const [flatten, setFlatten] = useState(false);
  const [outputCsvJsonVariant, setOutputCsvJsonVariant] = useState(false);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/json") {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid JSON file (.json)",
          variant: "destructive",
        });
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setJsonText(text);
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

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonText(e.target.value);
  };

  // Flatten logic: Handles nested objects and stringifies arrays
  const flattenObject = (obj: any, prefix = "", res: any = {}) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = prefix ? prefix + "." + key : key;
        const value = obj[key];

        if (typeof value === "object" && value !== null) {
          if (Array.isArray(value)) {
            // Stringify arrays
            res[newKey] = JSON.stringify(value);
          } else {
            // Recurse for nested objects
            flattenObject(value, newKey, res);
          }
        } else {
          // Assign primitive values
          res[newKey] = value;
        }
      }
    }
    return res;
  };

  // Prepares data for CSVJSON variant (stringifies objects/arrays)
  const prepareForCsvJsonVariant = (data: any): any => {
    if (Array.isArray(data)) {
      return data.map(prepareForCsvJsonVariant);
    } else if (typeof data === 'object' && data !== null) {
      const newObj: any = {};
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (typeof value === 'object' && value !== null) {
             // Stringify nested objects/arrays for CSVJSON variant
            newObj[key] = JSON.stringify(value);
          } else {
            newObj[key] = value;
          }
        }
      }
      return newObj;
    }
    return data; // Return primitive values as is
  };


  const handleConvert = () => {
    if (!jsonText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste JSON or upload a file.",
        variant: "destructive",
      });
      return;
    }

    try {
      let jsonData = JSON.parse(jsonText);

      // Ensure input is an array of objects or a single object for consistency
      if (!Array.isArray(jsonData)) {
        jsonData = [jsonData];
      }

      // Apply flattening if checked
      if (flatten) {
        jsonData = jsonData.map((item: any) =>
          typeof item === "object" && item !== null ? flattenObject(item) : item
        );
      }

      // Apply CSVJSON variant logic if checked
      // This prepares nested objects/arrays to be valid JSON strings within cells
      let dataToUnparse = jsonData;
      if (outputCsvJsonVariant) {
         // If flattening is also enabled, apply variant logic *after* flattening
         // Otherwise, apply it to the original (potentially nested) structure
        dataToUnparse = prepareForCsvJsonVariant(jsonData);
         // Note: Flattening might already stringify arrays depending on implementation,
         // ensure this doesn't double-stringify. The current flattenObject handles this.
      }


      const config: Papa.UnparseConfig = {
        delimiter: separator,
        header: true, // Use keys from the first object as headers
        quotes: !outputCsvJsonVariant, // Avoid quoting JSON strings in CSVJSON variant
        escapeFormulae: true, // Prevent CSV injection
      };

      // Papa.unparse handles the conversion
      const result = Papa.unparse(dataToUnparse, config);
      setCsvText(result);

      toast({
        title: "Success",
        description: "JSON successfully converted to CSV/TSV",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      setCsvText(""); // Clear output on error
      let description = "Failed to convert JSON.";
      if (error instanceof SyntaxError) {
        description = `Invalid JSON format: ${error.message}`;
      } else if (error instanceof Error) {
        description = error.message;
      }
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setJsonText("");
    setCsvText("");
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
    if (!csvText) return;
    try {
      await navigator.clipboard.writeText(csvText);
      toast({
        title: "Copied!",
        description: "CSV/TSV has been copied to clipboard",
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
    if (!csvText) return;
    try {
      const fileExtension = separator === "," ? "csv" : "tsv";
      const mimeType =
        separator === "," ? "text/csv" : "text/tab-separated-values";
      const blob = new Blob([csvText], { type: `${mimeType};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `json-to-${fileExtension}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Downloaded",
        description: `File has been downloaded as .${fileExtension}`,
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
    <ToolLayout title="JSON > CSV or TSV" hideHeader={true}>
      <Card className="w-full bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              JSON to CSV/TSV Converter
            </h1>
            <p className="text-muted-foreground">
              To get started, upload or paste your JSON.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Input */}
            <div className="flex flex-col space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file-input">Upload a JSON file</Label>
                <Input
                  ref={fileInputRef}
                  id="file-input"
                  type="file"
                  accept=".json"
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
                <Label htmlFor="json-input">Or paste your JSON here</Label>
                <Textarea
                  id="json-input"
                  placeholder='[&#10;  { "album": "The White Stripes", "year": 1999, "US_peak_chart_post": "-" },&#10;  { "album": "De Stijl", "year": 2000, "US_peak_chart_post": "-" }&#10;]'
                  className="min-h-[300px] flex-grow bg-zinc-800 border-zinc-700 text-white font-mono"
                  value={jsonText}
                  onChange={handleJsonChange}
                />
              </div>
              <div className="flex justify-start space-x-2 mt-auto pt-2">
                <Button
                  onClick={handleConvert}
                  disabled={!jsonText}
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
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    <Label htmlFor="separator">Separator</Label>
                    <select
                      id="separator"
                      className="bg-zinc-800 border-zinc-700 rounded-md p-2 text-white"
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                    >
                      <option value=",">Comma (CSV)</option>
                      <option value="\t">Tab (TSV)</option>
                      {/* Add other separators if needed, e.g., Semicolon */}
                      {/* <option value=";">Semicolon (;)</option> */}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6"> {/* Adjust alignment */}
                    <input
                      type="checkbox"
                      id="flatten"
                      checked={flatten}
                      onChange={(e) => setFlatten(e.target.checked)}
                      className="rounded-sm border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 h-4 w-4"
                    />
                    <Label htmlFor="flatten" className="cursor-pointer">Flatten</Label>
                  </div>
                  <div className="flex items-center space-x-2 pt-6"> {/* Adjust alignment */}
                    <input
                      type="checkbox"
                      id="csvjson-variant"
                      checked={outputCsvJsonVariant}
                      onChange={(e) => setOutputCsvJsonVariant(e.target.checked)}
                      className="rounded-sm border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500 h-4 w-4"
                    />
                    <Label htmlFor="csvjson-variant" className="cursor-pointer">Output CSVJSON variant</Label>
                  </div>
                </div>
              </div>

              {/* Output Textarea */}
              <div className="grid gap-2 flex-grow">
                <Label htmlFor="csv-output">Result</Label>
                <Textarea
                  readOnly
                  id="csv-output"
                  placeholder="CSV/TSV output will appear here..."
                  className="min-h-[300px] flex-grow bg-zinc-800 border-zinc-700 text-white font-mono"
                  value={csvText}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-auto pt-2">
                <Button
                  onClick={handleDownload}
                  disabled={!csvText}
                  variant="outline"
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
                >
                  Download
                </Button>
                <Button
                  onClick={handleCopyToClipboard}
                  disabled={!csvText}
                  variant="outline"
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
                >
                  Copy to clipboard
                </Button>
              </div>
            </div>
          </div>

          {/* More Details Section (Optional - Add if needed based on screenshot/requirements) */}
          {/* <div className="space-y-4 pt-6 border-t border-zinc-800">
            <h2 className="text-lg font-semibold">More Details</h2>
            <div className="space-y-2 text-sm text-zinc-400">
              <p>
                This tool converts JSON (JavaScript Object Notation) to CSV (Comma-Separated Values) or TSV (Tab-Separated Values).
              </p>
              <p>
                <strong>Options explained:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Separator:</strong> Choose Comma (,) for CSV or Tab (\t) for TSV.
                </li>
                <li>
                  <strong>Flatten:</strong> Convert nested JSON objects into dot-notation keys (e.g., `{"a": {"b": 1}}` becomes `{"a.b": 1}`). Arrays are typically stringified unless handled specifically.
                </li>
                <li>
                  <strong>Output CSVJSON variant:</strong> (Requires specific implementation) Adheres to the CSVJSON format specification (see csvjson.org).
                </li>
              </ul>
            </div>
          </div> */}
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default JsonToCsvConverter;
