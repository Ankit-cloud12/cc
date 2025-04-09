import React from "react";
import TextCaseTools from "./TextCaseTools";

// SEO-focused content for About tab
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Lowercase Converter</h3>
    <p className="mb-4">
      Convert any text into standard lowercase letters instantly with our free online Lowercase Converter. This tool removes all capitalization, ensuring your text is entirely in lowercase.
    </p>
    <p className="mb-4">
      It's incredibly useful for standardizing data, preparing text for systems that require lowercase input, or simply converting text for a more casual appearance. No installation required – just paste your text and get the lowercase version right away.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">lowercase converter, text to lowercase, convert to lowercase, remove capitalization, online text tool, text case converter, small letters text</p>
  </>
);

// SEO-focused content for Usage Tips tab
const usageTipsContent = (
  <>
    <h3 className="font-medium mb-2">How to Use the Lowercase Converter</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Paste Text:</strong> Enter or paste the text you want to convert into the input box on the left.</li>
      <li><strong>Instant Conversion:</strong> The tool automatically converts all letters to lowercase in the output box on the right.</li>
      <li><strong>Copy Result:</strong> Click "Copy to Clipboard" to easily copy the lowercase text.</li>
      <li><strong>Use Anywhere:</strong> Paste the converted text into documents, forms, code, or anywhere lowercase is needed.</li>
      <li><strong>Download Option:</strong> Use the "Download" button to save longer converted texts as a .txt file.</li>
      <li><strong>Clear Fields:</strong> Click "Clear" to quickly reset the input and output areas.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: Use this tool to quickly normalize text case for data processing or analysis.
    </p>
  </>
);

export const LowercaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="lower"
      title="Lowercase Text Converter" 
      description="Easily convert text to lowercase online. Free tool to remove capitalization instantly for data standardization or casual text."
      // Pass the custom content props
      aboutContent={aboutContent}
      usageTipsContent={usageTipsContent}
    />
  );
};
