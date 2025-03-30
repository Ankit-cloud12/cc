import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface WordCount {
  word: string;
  count: number;
  percentage: number;
}

const WordFrequencyCounter = () => {
  const [inputText, setInputText] = useState("");
  const [wordCounts, setWordCounts] = useState<WordCount[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const [uniqueWords, setUniqueWords] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);
  const [copied, setCopied] = useState(false);

  const countWords = () => {
    if (!inputText.trim()) {
      setWordCounts([]);
      setTotalWords(0);
      setUniqueWords(0);
      return;
    }

    // Process text based on options
    let processedText = inputText;

    if (!caseSensitive) {
      processedText = processedText.toLowerCase();
    }

    if (ignorePunctuation) {
      // Replace punctuation with spaces
      processedText = processedText.replace(
        /[.,\/#!$%\^&\*;:{}=\-_`~()\[\]"']/g,
        " ",
      );
    }

    // Split into words and filter out empty strings
    const words = processedText.split(/\s+/).filter((word) => word.length > 0);

    // Count word frequencies
    const wordFrequency: { [key: string]: number } = {};
    words.forEach((word) => {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    });

    // Convert to array for sorting
    const wordCountArray: WordCount[] = Object.keys(wordFrequency).map(
      (word) => ({
        word,
        count: wordFrequency[word],
        percentage: (wordFrequency[word] / words.length) * 100,
      }),
    );

    // Sort by count (descending)
    wordCountArray.sort((a, b) => b.count - a.count);

    setWordCounts(wordCountArray);
    setTotalWords(words.length);
    setUniqueWords(wordCountArray.length);
  };

  const handleCopy = () => {
    if (wordCounts.length === 0) return;

    const textToCopy = wordCounts
      .map(
        (item) =>
          `${item.word}: ${item.count} (${item.percentage.toFixed(2)}%)`,
      )
      .join("\n");

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setWordCounts([]);
    setTotalWords(0);
    setUniqueWords(0);
  };

  const content = (
    <>
      <h1 className="text-3xl font-bold mb-2">Word Frequency Counter</h1>
      <p className="text-gray-300 mb-6">
        Analyze your text and count how many times each word appears.
      </p>

      <Textarea
        placeholder="Type or paste your text here"
        className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={countWords}
        >
          Count Words
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>

      {wordCounts.length > 0 && (
        <div className="bg-zinc-700 p-4 rounded mb-4">
          <h2 className="text-xl font-bold mb-4">Results</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="font-semibold">Word</div>
            <div className="font-semibold text-center">Count</div>
            <div className="font-semibold text-right">Frequency</div>
            {wordCounts.map(({ word, count, percentage }) => (
              <React.Fragment key={word}>
                <div>{word}</div>
                <div className="text-center">{count}</div>
                <div className="text-right">{percentage.toFixed(2)}%</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">
          About Word Frequency Counter
        </h2>
        <p className="text-gray-300 mb-4">
          This tool analyzes your text and counts how many times each unique
          word appears. Common words like "the", "a", "an", etc. (stop words)
          are removed before counting.
        </p>
        <p className="text-gray-300 mb-4">
          The results show each unique word, how many times it appears, and what
          percentage of the total word count it represents.
        </p>
      </div>
    </>
  );

  return content;
};

export default WordFrequencyCounter;
