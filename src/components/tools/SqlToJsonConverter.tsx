import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { ToolLayout } from "./ToolLayout";
import { Parser } from 'node-sql-parser'; // Import the parser

const SqlToJsonConverter = () => {
  const { toast } = useToast();
  const parser = new Parser();

  // State for input/output
  const [sqlText, setSqlText] = useState("");
  const [resultText, setResultText] = useState("");

  // File handling
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");

  // Conversion options
  const [outputFormat, setOutputFormat] = useState<"json" | "javascript">("json");
  const [minify, setMinify] = useState(false);

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".sql")) {
        toast({
          title: "Invalid File Type",
          description: "Please upload a valid SQL file (.sql)",
          variant: "destructive",
        });
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setSqlText(text);
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

  const handleSqlChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSqlText(e.target.value);
  };

  const handleConvert = () => {
    if (!sqlText.trim()) {
      toast({
        title: "Input Required",
        description: "Please paste SQL or upload a file.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Split SQL into individual statements, handling semicolons potentially inside comments or strings
      const statements = sqlText.split(/;\s*(?=(?:[^'"]*['"][^'"]*['"])*[^'"]*$)/).filter(s => s.trim());
      let columns: string[] = [];
      const data: any[] = [];
      let tableName: string | null = null;

      for (const statement of statements) {
        if (!statement.trim()) continue;

        try {
          const ast = parser.astify(statement.trim());
          // Ensure ast is an array, as astify can return a single object or an array
          const astArray = Array.isArray(ast) ? ast : [ast];

          for (const node of astArray) {
            if (node.type === 'create' && node.keyword === 'table') {
              tableName = node.table[0].table;
              columns = node.create_definitions
                .filter((def: any) => def.resource === 'column')
                .map((def: any) => def.column.column);
            } else if (node.type === 'insert' && node.table[0].table === tableName) {
              // Use specified columns if available, otherwise assume order matches CREATE TABLE
              const insertColumns = node.columns ?? columns;
              // Check if node.values is an array before iterating
              if (Array.isArray(node.values) && insertColumns) {
                node.values.forEach((valueSet: any) => {
                  const row: any = {};
                  // Ensure valueSet.value is also an array before iterating
                  if (Array.isArray(valueSet.value)) {
                    valueSet.value.forEach((val: any, index: number) => {
                      if (index < insertColumns.length) {
                      // Handle different value types from parser
                      let processedValue = val.value;
                      if (val.type === 'string') {
                        // Keep as string
                      } else if (val.type === 'number') {
                        // Keep as number
                      } else if (val.type === 'bool') {
                        processedValue = Boolean(val.value);
                      } else if (val.type === 'null') {
                        processedValue = null;
                      }
                        row[insertColumns[index]] = processedValue;
                      }
                    });
                    data.push(row);
                  }
                });
              // Check if node.values exists, is not an array, and has type 'select'
              } else if (node.values && !Array.isArray(node.values) && node.values.type === 'select') {
                 console.warn("Skipping INSERT ... SELECT statement. This feature is not currently supported.");
              }
            }
          }
        } catch (parseError) {
          // Log individual statement parse errors but continue if possible
          console.warn(`Skipping statement due to parse error: ${parseError}`);
        }
      }


      if (data.length === 0) {
         toast({
          title: "No Data Found",
          description: "Could not find INSERT statements matching a CREATE TABLE statement.",
          variant: "destructive",
        });
        setResultText("");
        return;
      }

      let outputString = "";
      if (outputFormat === "json") {
        outputString = JSON.stringify(data, null, minify ? 0 : 2);
      } else {
        // Convert data to JavaScript object literal string
        const jsObjects = data.map(obj => {
          const entries = Object.entries(obj).map(([key, value]) => {
            // Properly format values for JS string
            let formattedValue;
            if (typeof value === 'string') {
              formattedValue = `'${value.replace(/'/g, "\\'")}'`; // Escape single quotes
            } else if (value === null) {
              formattedValue = 'null';
            } else {
              formattedValue = String(value); // Numbers, booleans
            }
            return `${key}: ${formattedValue}`;
          });
          return `  { ${entries.join(', ')} }`;
        });
        outputString = `[\n${jsObjects.join(',\n')}\n]`;
        if (minify) {
          // More robust minification for JS object literal string
           outputString = `[${data.map(obj => `{${Object.entries(obj).map(([key, value]) => `${key}:${typeof value === 'string' ? `'${value.replace(/'/g, "\\'")}'` : value === null ? 'null' : String(value)}`).join(',')}}`).join(',')}]`;
        }
      }

      setResultText(outputString);

      toast({
        title: "Success",
        description: "SQL successfully converted.",
      });
    } catch (error) {
      console.error("Conversion error:", error);
      setResultText(""); // Clear output on error
      let description = "Failed to parse SQL.";
      if (error instanceof Error) {
        description = `SQL Parsing Error: ${error.message}`;
      }
      toast({
        title: "Error",
        description: description,
        variant: "destructive",
      });
    }
  };

  const handleClear = () => {
    setSqlText("");
    setResultText("");
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
    if (!resultText) return;
    try {
      await navigator.clipboard.writeText(resultText);
      toast({
        title: "Copied!",
        description: "Result has been copied to clipboard",
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
    if (!resultText) return;
    try {
      const fileExtension = outputFormat === "json" ? "json" : "js";
      const mimeType = outputFormat === "json" ? "application/json" : "application/javascript";
      const blob = new Blob([resultText], { type: `${mimeType};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `sql-to-${fileExtension}.${fileExtension}`;
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
    <ToolLayout title="SQL {'>'} JSON or JS" hideHeader={true}>
      <Card className="w-full bg-zinc-900 border-zinc-800 text-white">
        <CardHeader>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">
              SQL {'>'} JSON or JS
            </h1>
            <p className="text-muted-foreground">
              To get started, upload or paste your SQL Export.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Input */}
            <div className="flex flex-col space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="file-input">Upload a SQL file</Label>
                <Input
                  ref={fileInputRef}
                  id="file-input"
                  type="file"
                  accept=".sql"
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
                <Label htmlFor="sql-input">Or paste your SQL here</Label>
                <Textarea
                  id="sql-input"
                  placeholder="/**&#10; * Continents&#10; */&#10;SET FOREIGN_KEY_CHECKS=0;&#10;-- ----------------------------&#10;-- Table structure for `continents`&#10;-- ----------------------------&#10;DROP TABLE IF EXISTS `continents`;&#10;CREATE TABLE `continents` ( ..."
                  className="min-h-[300px] flex-grow bg-zinc-800 border-zinc-700 text-white font-mono"
                  value={sqlText}
                  onChange={handleSqlChange}
                />
              </div>
              <div className="flex justify-start space-x-2 mt-auto pt-2">
                <Button
                  onClick={handleConvert}
                  disabled={!sqlText}
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
                  <Label>Output format:</Label>
                  <RadioGroup
                    value={outputFormat}
                    onValueChange={(value) => setOutputFormat(value as "json" | "javascript")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="json"
                        id="json"
                        className="border-zinc-600 text-white"
                      />
                      <Label htmlFor="json">JSON</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="javascript"
                        id="javascript"
                        className="border-zinc-600 text-white"
                      />
                      <Label htmlFor="javascript">JavaScript</Label>
                    </div>
                  </RadioGroup>
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
                <Label htmlFor="result-output">Result</Label>
                <Textarea
                  readOnly
                  id="result-output"
                  placeholder="Result will appear here..."
                  className="min-h-[300px] flex-grow bg-zinc-800 border-zinc-700 text-white font-mono"
                  value={resultText}
                />
              </div>
              <div className="flex justify-end space-x-2 mt-auto pt-2">
                <Button
                  onClick={handleDownload}
                  disabled={!resultText}
                  variant="outline"
                  className="bg-transparent border border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
                >
                  Download
                </Button>
                <Button
                  onClick={handleCopyToClipboard}
                  disabled={!resultText}
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
                <li>Works by detecting <code className="bg-zinc-700 px-1 rounded">CREATE TABLE</code> and <code className="bg-zinc-700 px-1 rounded">INSERT INTO</code> statements, in order to create an object representation of the tables.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </ToolLayout>
  );
};

export default SqlToJsonConverter;
