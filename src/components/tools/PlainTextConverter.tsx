import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const PlainTextConverter = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    removeFormats: true,
    removePunctuation: false,
    removeNonAscii: false,
    removeNonAlphanumeric: false,
    removeAccents: false,
    normalizeUnicode: false,
    removeEmojis: false,
    removeDuplicateLines: false,
    removeDuplicateWords: false,
    trimWhitespace: false,
    removeLeadingSpaces: false,
    removeTrailingSpaces: false,
    removeBlankLines: false,
    removeLineBreaks: false,
    removeUrls: false,
    removeHashtags: false,
    convertUrlsToLinks: false,
    removeEmails: false
  });

  useEffect(() => {
    if (inputText) {
      convertToPlainText();
    }
  }, [inputText, options]);

  const convertToPlainText = () => {
    let result = inputText;

    if (options.removeFormats) {
      // Remove all text formats and styling
      result = result.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F-\u009F]/g, "");
    }

    if (options.removePunctuation) {
      // Remove punctuation marks
      result = result.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    }

    if (options.removeNonAscii) {
      // Remove non-ASCII characters
      result = result.replace(/[^\x00-\x7F]/g, "");
    }

    if (options.removeNonAlphanumeric) {
      // Remove non-alphanumeric characters
      result = result.replace(/[^a-zA-Z0-9\s]/g, "");
    }

    if (options.removeAccents) {
      // Remove diacritics
      result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    if (options.normalizeUnicode) {
      // Normalize Unicode characters
      result = result.normalize("NFKC");
    }

    if (options.removeEmojis) {
      // Remove emojis
      result = result.replace(/[\u{1F300}-\u{1F9FF}]/gu, "");
    }

    if (options.removeDuplicateLines) {
      // Remove duplicate lines
      result = [...new Set(result.split("\n"))].join("\n");
    }

    if (options.removeDuplicateWords) {
      // Remove duplicate words while preserving sentence structure
      result = result.split("\n").map(line => {
        return [...new Set(line.split(" "))].join(" ");
      }).join("\n");
    }

    if (options.trimWhitespace) {
      // Trim whitespace
      result = result.split("\n").map(line => line.trim()).join("\n");
    }

    if (options.removeLeadingSpaces) {
      // Remove leading spaces
      result = result.split("\n").map(line => line.trimStart()).join("\n");
    }

    if (options.removeTrailingSpaces) {
      // Remove trailing spaces
      result = result.split("\n").map(line => line.trimEnd()).join("\n");
    }

    if (options.removeBlankLines) {
      // Remove blank/empty lines
      result = result.split("\n").filter(line => line.trim()).join("\n");
    }

    if (options.removeLineBreaks) {
      // Remove line breaks
      result = result.replace(/(\r\n|\n|\r)/gm, " ");
    }

    if (options.removeUrls) {
      // Remove URLs
      result = result.replace(/https?:\/\/\S+/g, "");
    }

    if (options.removeHashtags) {
      // Remove hashtags
      result = result.replace(/#\w+/g, "");
    }

    if (options.convertUrlsToLinks) {
      // Convert URLs to clickable links
      result = result.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
    }

    if (options.removeEmails) {
      // Remove email addresses
      result = result.replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g, "");
    }

    setOutputText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  return (
    <div className="container mx-auto p-4 bg-zinc-800 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Plain Text Converter</h1>
      <p className="text-gray-300 mb-6">
        Convert formatted text to plain text by removing various formatting elements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Input Text</h2>
          <Textarea
            placeholder="Type or paste your content here"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4"
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Output Text</h2>
          <Textarea
            readOnly
            value={outputText}
            className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4"
            placeholder="Plain text will appear here"
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={handleCopy}
              disabled={!outputText}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={handleClear}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Characters</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeFormats"
                checked={options.removeFormats}
                onCheckedChange={(checked) => 
                  setOptions(prev => ({ ...prev, removeFormats: checked as boolean }))
                }
              />
              <label htmlFor="removeFormats">Remove All Text Formats</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removePunctuation"
                checked={options.removePunctuation}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removePunctuation: checked as boolean }))
                }
              />
              <label htmlFor="removePunctuation">Remove Punctuation marks</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeNonAscii"
                checked={options.removeNonAscii}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeNonAscii: checked as boolean }))
                }
              />
              <label htmlFor="removeNonAscii">Remove Non-ASCII Characters</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeNonAlphanumeric"
                checked={options.removeNonAlphanumeric}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeNonAlphanumeric: checked as boolean }))
                }
              />
              <label htmlFor="removeNonAlphanumeric">Remove Non-alphanumeric Characters</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeAccents"
                checked={options.removeAccents}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeAccents: checked as boolean }))
                }
              />
              <label htmlFor="removeAccents">Remove letter Accents (diacritics)</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="normalizeUnicode"
                checked={options.normalizeUnicode}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, normalizeUnicode: checked as boolean }))
                }
              />
              <label htmlFor="normalizeUnicode">Normalize Unicode letters & Characters</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeEmojis"
                checked={options.removeEmojis}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeEmojis: checked as boolean }))
                }
              />
              <label htmlFor="removeEmojis">Strip all emojis</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Duplicates & Whitespace</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeDuplicateLines"
                checked={options.removeDuplicateLines}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeDuplicateLines: checked as boolean }))
                }
              />
              <label htmlFor="removeDuplicateLines">Remove Duplicate Lines / Paragraphs</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeDuplicateWords"
                checked={options.removeDuplicateWords}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeDuplicateWords: checked as boolean }))
                }
              />
              <label htmlFor="removeDuplicateWords">Remove Duplicate Words / Sentences</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="trimWhitespace"
                checked={options.trimWhitespace}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, trimWhitespace: checked as boolean }))
                }
              />
              <label htmlFor="trimWhitespace">Trim Whitespaces</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeLeadingSpaces"
                checked={options.removeLeadingSpaces}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeLeadingSpaces: checked as boolean }))
                }
              />
              <label htmlFor="removeLeadingSpaces">Remove leading spaces</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeTrailingSpaces"
                checked={options.removeTrailingSpaces}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeTrailingSpaces: checked as boolean }))
                }
              />
              <label htmlFor="removeTrailingSpaces">Remove trailing spaces</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeBlankLines"
                checked={options.removeBlankLines}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeBlankLines: checked as boolean }))
                }
              />
              <label htmlFor="removeBlankLines">Remove Blank/Empty Lines</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeLineBreaks"
                checked={options.removeLineBreaks}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeLineBreaks: checked as boolean }))
                }
              />
              <label htmlFor="removeLineBreaks">Remove Line Breaks</label>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Others</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeUrls"
                checked={options.removeUrls}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeUrls: checked as boolean }))
                }
              />
              <label htmlFor="removeUrls">Remove all web urls</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeHashtags"
                checked={options.removeHashtags}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeHashtags: checked as boolean }))
                }
              />
              <label htmlFor="removeHashtags">Remove hash tags</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="convertUrlsToLinks"
                checked={options.convertUrlsToLinks}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, convertUrlsToLinks: checked as boolean }))
                }
              />
              <label htmlFor="convertUrlsToLinks">Convert urls to links</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="removeEmails"
                checked={options.removeEmails}
                onCheckedChange={(checked) =>
                  setOptions(prev => ({ ...prev, removeEmails: checked as boolean }))
                }
              />
              <label htmlFor="removeEmails">Strip all emails</label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center">
        <Button 
          onClick={convertToPlainText}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-lg"
        >
          Generate Plain Text
        </Button>
      </div>

      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Plain Text Converter</h2>
        <p className="text-gray-300 mb-4">
          Are you struggling with losing the numbering, bulleted, or tabbed formatting when copying
          and pasting rich text into an online form? Our Plain Text Converter is here to help.
          This online utility preserves the benefits of formatting while removing the frustrating
          background embedded code, allowing you to easily copy and paste from one application or
          form to another. No more frustration, just seamless productivity.
        </p>
      </div>
    </div>
  );
};

export default PlainTextConverter;