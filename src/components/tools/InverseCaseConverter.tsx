import React from "react";
import TextCaseTools from "./TextCaseTools";

// SEO-focused content for About tab
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Inverse Case Converter</h3>
    <p className="mb-4">
      Flip the case of your text instantly with our free Inverse Case Converter. This tool swaps the case of every letter, turning uppercase into lowercase and lowercase into uppercase (e.g., "Hello World" becomes "hELLO wORLD").
    </p>
    <p className="mb-4">
      It's a quick and easy way to create unique text effects for online posts, design projects, or just for fun. No downloads needed – simply type or paste your text and get the inverted case version immediately.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">inverse case, inverse case converter, reverse case, flip case, swap case, text case converter, online text tool, change text case</p>
  </>
);

// SEO-focused content for Usage Tips tab
const usageTipsContent = (
  <>
    <h3 className="font-medium mb-2">How to Use the Inverse Case Converter</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Input Text:</strong> Enter or paste the text you wish to convert into the input area on the left.</li>
      <li><strong>Instant Conversion:</strong> The text will automatically be converted to InVeRsE CaSe in the output area on the right.</li>
      <li><strong>Copy Result:</strong> Use the "Copy to Clipboard" button to easily grab the converted text.</li>
      <li><strong>Use Anywhere:</strong> Paste the inverse case text wherever you need it – social media, documents, etc.</li>
      <li><strong>Download Option:</strong> For longer pieces of text, click "Download" to save the result as a .txt file.</li>
      <li><strong>Clear Fields:</strong> The "Clear" button will empty both the input and output text areas.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: Inverse case can create interesting visual effects or be used to playfully obscure text.
    </p>
  </>
);

export const InverseCaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="inverse"
      title="Inverse Case Converter" 
      description="Instantly flip text case with our Inverse Case Converter. Convert uppercase to lowercase and vice versa online for free."
      // Pass the custom content props
      aboutContent={aboutContent}
      usageTipsContent={usageTipsContent}
    />
  );
};