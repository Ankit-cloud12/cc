import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ToolLayout } from "./ToolLayout";

const DuplicateLineRemover = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const removeDuplicateLines = () => {
    console.log("Input Text:", inputText);
    const lines = inputText.split("\n");
    console.log("Lines Array:", lines);
    const uniqueLines = [...new Set(lines)];
    console.log("Unique Lines Set:", uniqueLines);
    setOutputText(uniqueLines.join("\n"));
    console.log("Output Text:", outputText);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback 
    }
  };

  return (
    <ToolLayout title="Duplicate Line Remover" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Duplicate Line Remover</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Input Text</h2>
            <Textarea 
              placeholder="Paste text with duplicate lines here"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full min-h-[300px] mb-4"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Output Text</h2>
            <Textarea
              readOnly
              placeholder="Unique text will appear here"
              value={outputText}
              className="w-full min-h-[300px] mb-4"
            />
          </div>
        </div>
        <div className="flex justify-start gap-2">
          <Button onClick={removeDuplicateLines}>Remove Duplicates</Button>
          <Button variant="secondary" onClick={handleCopy} disabled={!outputText}>Copy Output</Button>
          <Button variant="secondary" onClick={handleClear}>Clear</Button>
        </div>
      </div>
    </ToolLayout>
  );
};

export default DuplicateLineRemover;