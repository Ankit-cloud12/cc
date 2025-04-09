import React from "react";
import TextCaseTools from "./TextCaseTools";

// SEO-focused content for About tab
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Uppercase Converter</h3>
    <p className="mb-4">
      Instantly convert any text into ALL CAPS with our free online Uppercase Converter. This tool transforms all lowercase letters into their uppercase equivalents, making your text stand out.
    </p>
    <p className="mb-4">
      Ideal for creating headlines, emphasizing important points, ensuring compliance with specific formatting rules (like form fields), or simply making a bold statement. It's fast, easy, and requires no software installation.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">uppercase converter, text to uppercase, convert to uppercase, all caps converter, capitalize all letters, online text tool, text case converter</p>
  </>
);

// SEO-focused content for Usage Tips tab
const usageTipsContent = (
  <>
    <h3 className="font-medium mb-2">How to Use the Uppercase Converter</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to make uppercase into the left input field.</li>
      <li><strong>Automatic Conversion:</strong> The text will immediately be converted to ALL UPPERCASE in the right output field.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to copy the uppercase text.</li>
      <li><strong>Use Anywhere:</strong> Paste the converted text into headlines, social media, documents, or any application.</li>
      <li><strong>Download Option:</strong> For larger blocks of text, use the "Download" button to save the result as a .txt file.</li>
      <li><strong>Clear Fields:</strong> Click "Clear" to easily remove text from both input and output boxes.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: Use uppercase for strong emphasis, titles, or acronyms. Avoid using it for long paragraphs as it can be harder to read.
    </p>
  </>
);

export const UppercaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="upper"
      title="Uppercase Text Converter" 
      description="Convert text to UPPERCASE online for free. Instantly transform any text into all caps for headlines, emphasis, or formatting."
      // Pass the custom content props
      aboutContent={aboutContent}
      usageTipsContent={usageTipsContent}
    />
  );
};
