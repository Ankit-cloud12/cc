import React from "react";
import TextCaseTools from "./TextCaseTools";

// SEO-focused content for About tab
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Sentence Case Converter</h3>
    <p className="mb-4">
      Our free online Sentence Case Converter automatically capitalizes the first letter of each sentence in your text, while converting the rest to lowercase. It correctly handles punctuation like periods (.), question marks (?), and exclamation points (!).
    </p>
    <p className="mb-4">
      This tool is essential for writers, editors, students, and anyone who needs to ensure their text follows standard English capitalization rules for sentences. Fix improperly capitalized text or convert blocks of text (like all caps) into proper sentence format instantly.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">sentence case converter, convert to sentence case, text capitalization tool, capitalize first letter, online text tool, text case converter, grammar tool</p>
  </>
);

// SEO-focused content for Usage Tips tab
const usageTipsContent = (
  <>
    <h3 className="font-medium mb-2">How to Use the Sentence Case Converter</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Input Text:</strong> Paste or type the text you want to convert into the left input area.</li>
      <li><strong>Automatic Conversion:</strong> The text will be instantly converted to proper Sentence case in the right output area. The first letter after each period, question mark, or exclamation point will be capitalized.</li>
      <li><strong>Copy Result:</strong> Click "Copy to Clipboard" to easily copy the correctly formatted text.</li>
      <li><strong>Use Anywhere:</strong> Paste the sentence case text into emails, documents, articles, or any writing platform.</li>
      <li><strong>Download Option:</strong> Use the "Download" button for saving longer converted texts as a .txt file.</li>
      <li><strong>Clear Fields:</strong> Click "Clear" to reset both text areas.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: This is the standard case used for most writing, including paragraphs in emails, documents, and web content.
    </p>
  </>
);

export const SentenceCaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="sentence"
      title="Sentence Case Converter" 
      description="Convert text to Sentence case online. Automatically capitalizes the first letter of each sentence for proper grammar and readability."
      // Pass the custom content props
      aboutContent={aboutContent}
      usageTipsContent={usageTipsContent}
    />
  );
};
