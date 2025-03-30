import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const RandomNumberGenerator = () => {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(true);
  const [sortNumbers, setSortNumbers] = useState<boolean>(false);
  const [results, setResults] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generateRandomNumbers = () => {
    // Validate inputs
    if (min > max) {
      setError("Minimum value cannot be greater than maximum value.");
      return;
    }

    if (count < 1) {
      setError("Number of results must be at least 1.");
      return;
    }

    if (!allowDuplicates && max - min + 1 < count) {
      setError(
        `Cannot generate ${count} unique numbers in the range ${min} to ${max}.`,
      );
      return;
    }

    setError("");

    // Generate random numbers
    const numbers: number[] = [];

    if (allowDuplicates) {
      // With duplicates - simple random generation
      for (let i = 0; i < count; i++) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        numbers.push(randomNum);
      }
    } else {
      // Without duplicates - use a set to track used numbers
      const uniqueNumbers = new Set<number>();

      while (uniqueNumbers.size < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        uniqueNumbers.add(randomNum);
      }

      numbers.push(...Array.from(uniqueNumbers));
    }

    // Sort if requested
    if (sortNumbers) {
      numbers.sort((a, b) => a - b);
    }

    setResults(numbers);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <>
      <h1 className="text-3xl font-bold mb-2">Random Number Generator</h1>
      <p className="text-gray-300 mb-6">
        Generate random numbers within a specified range.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="min">Minimum Value</Label>
            <Input
              id="min"
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="bg-zinc-700 text-white border-zinc-600"
            />
          </div>

          <div>
            <Label htmlFor="max">Maximum Value</Label>
            <Input
              id="max"
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              className="bg-zinc-700 text-white border-zinc-600"
            />
          </div>

          <div>
            <Label htmlFor="count">Number of Results</Label>
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowDuplicates"
              checked={allowDuplicates}
              onCheckedChange={(checked) =>
                setAllowDuplicates(checked as boolean)
              }
            />
            <Label htmlFor="allowDuplicates">Allow Duplicate Numbers</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sortNumbers"
              checked={sortNumbers}
              onCheckedChange={(checked) => setSortNumbers(checked as boolean)}
            />
            <Label htmlFor="sortNumbers">Sort Numbers</Label>
          </div>

          <Button
            onClick={generateRandomNumbers}
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Generate Random Numbers
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Results</h2>
          <div className="bg-zinc-700 p-4 rounded border border-zinc-600 min-h-[100px] mb-4 break-words">
            {results.join(", ")}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>

            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={generateRandomNumbers}
            >
              Generate Again
            </Button>
          </div>
        </div>
      )}

      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">
          About Random Number Generator
        </h2>
        <p className="text-gray-300 mb-4">
          This tool generates random numbers within a specified range. You can
          generate a single random number or multiple numbers at once.
        </p>
        <p className="text-gray-300 mb-4">Options include:</p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Setting minimum and maximum values for the range</li>
          <li>Choosing how many random numbers to generate</li>
          <li>Allowing or preventing duplicate numbers</li>
          <li>Sorting the results in ascending order</li>
        </ul>
        <p className="text-gray-300 mb-4">
          Random numbers are useful for games, lotteries, statistical sampling,
          cryptography, and many other applications requiring unpredictable
          results.
        </p>
      </div>
    </>
  );

  return content;
};

export default RandomNumberGenerator;
