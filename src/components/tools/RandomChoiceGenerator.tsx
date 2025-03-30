import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import RandomGeneratorLayout from "./RandomGeneratorLayout";
const RandomChoiceGenerator = () => {
  const [choices, setChoices] = useState<string>("");
  const [count, setCount] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortResults, setSortResults] = useState<boolean>(false);
  const [results, setResults] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Parse choices into an array, filtering out empty lines
  const parseChoices = (text: string): string[] => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const generateRandomChoices = () => {
    const choiceList = parseChoices(choices);

    if (choiceList.length === 0) {
      setError("Please enter at least one choice.");
      return;
    }

    if (count < 1) {
      setError("Number of selections must be at least 1.");
      return;
    }

    if (!allowDuplicates && count > choiceList.length) {
      setError(
        `Cannot select ${count} unique choices from a list of ${choiceList.length} items.`
      );
      return;
    }

    setError("");

    // Generate random choices
    const selectedChoices: string[] = [];

    if (allowDuplicates) {
      // With duplicates - simple random selection
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * choiceList.length);
        selectedChoices.push(choiceList[randomIndex]);
      }
    } else {
      // Without duplicates - shuffle and take first N items
      const shuffled = [...choiceList];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      selectedChoices.push(...shuffled.slice(0, count));
    }

    // Sort if requested
    const finalResults = sortResults 
      ? [...selectedChoices].sort()
      : selectedChoices;

    setResults(finalResults);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([results.join("\n")], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "random-choices.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setResults([]);
    setCopied(false);
  };

  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        This tool helps you make random selections from a list of choices. Perfect for making decisions, drawing winners, or simply adding randomness to any selection process.
      </p>
      <p className="text-gray-300 mb-4">
        Common uses include:
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Picking winners for giveaways or contests</li>
        <li>Making unbiased decisions when you're stuck between options</li>
        <li>Randomly assigning tasks or responsibilities</li>
        <li>Creating random groups from a list of people</li>
        <li>Selecting random items for testing or sampling</li>
      </ul>
      <p className="text-gray-300">
        Simply enter your choices (one per line), choose how many to select, and click the generate button. The tool will randomly pick from your choices.
      </p>
    </>
  );

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col space-y-4">
        <Label htmlFor="choices" className="mb-2">Enter Choices (one per line)</Label>
        <Textarea
          id="choices"
          value={choices}
          onChange={(e) => setChoices(e.target.value)}
          placeholder="Option 1&#10;Option 2&#10;Option 3&#10;..."
          className="min-h-[250px] max-h-[450px] bg-zinc-700 text-white border-zinc-600 resize-y"
        />
        
        <div className="space-y-4 mt-auto">
          <div>
            <Label htmlFor="count">Number of Selections</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="bg-zinc-700 text-white border-zinc-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowDuplicates"
              checked={allowDuplicates}
              onCheckedChange={(checked) => setAllowDuplicates(checked as boolean)}
            />
            <Label htmlFor="allowDuplicates">
              Allow Duplicate Selections
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sortResults"
              checked={sortResults}
              onCheckedChange={(checked) => setSortResults(checked as boolean)}
            />
            <Label htmlFor="sortResults">
              Sort Results Alphabetically
            </Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Label className="mb-2">Result</Label>
        <div 
          className="min-h-[250px] max-h-[450px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y"
        >
          {results.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {results.map((result, index) => (
                <li key={index} className="break-words">
                  {result}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">
              Your random selection will appear here
            </p>
          )}
        </div>
        
        <div className="text-sm text-gray-400">
          {parseChoices(choices).length} choices available • {results.length} selected
        </div>
      </div>
    </div>
  );

  return (
    <RandomGeneratorLayout
        title="Random Choice Generator"
        description="Randomly select one or more items from a list of choices."
        error={error}
        result={results.length > 0 ? results : null}
        onGenerate={generateRandomChoices}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onReset={handleReset}
        copied={copied}
        generateButtonText="Pick Random Choice"
        aboutContent={aboutContent}
      >
        {content}
      </RandomGeneratorLayout>
  );
};

export default RandomChoiceGenerator;
