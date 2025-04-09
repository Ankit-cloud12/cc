import React from "react";
import TextCaseTools from "./TextCaseTools";

// SEO-focused content for About tab
const aboutContent = (
  <>
    <h3 className="font-medium mb-2">About Alternating Case Converter</h3>
    <p className="mb-4">
      Easily convert your text into a playful aLtErNaTiNg CaSe format with our free online tool. This converter automatically switches between lowercase and uppercase letters, creating a unique and eye-catching style often used for emphasis, fun, or specific online aesthetics (like Spongebob meme text).
    </p>
    <p className="mb-4">
      Perfect for social media posts, usernames, comments, or anywhere you want your text to stand out. Our Alternating Case Converter is fast, simple, and requires no installation. Just type or paste your text and get the alternating case version instantly.
    </p>
    <h4 className="font-medium mb-2">Keywords:</h4>
    <p className="text-sm text-gray-400">alternating case, alternating case converter, text case converter, Spongebob text, mocking text, online text tool, change text case, uppercase lowercase alternate</p>
  </>
);

// SEO-focused content for Usage Tips tab
const usageTipsContent = (
  <>
    <h3 className="font-medium mb-2">How to Use the Alternating Case Converter</h3>
    <ul className="list-disc pl-5 space-y-2 mb-4">
      <li><strong>Enter Text:</strong> Type or paste the text you want to convert into the left input box.</li>
      <li><strong>Automatic Conversion:</strong> The text will instantly appear in aLtErNaTiNg CaSe in the right output box.</li>
      <li><strong>Copy Result:</strong> Click the "Copy to Clipboard" button to easily copy the converted text.</li>
      <li><strong>Paste Anywhere:</strong> Paste the alternating case text into social media, messages, documents, or anywhere else you need it.</li>
      <li><strong>Download Option:</strong> For longer text, use the "Download" button to save the result as a .txt file.</li>
      <li><strong>Clear Input:</strong> Use the "Clear" button to quickly remove text from both boxes.</li>
    </ul>
    <p className="text-sm text-gray-400">
      Tip: Alternating case is great for adding a playful or sarcastic tone to your text online.
    </p>
  </>
);

export const AlternatingCaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="alternating"
      title="Alternating Case Converter" 
      description="Convert text to aLtErNaTiNg CaSe instantly. Free online tool for Spongebob meme text, playful messages, and eye-catching social media posts."
      // Pass the custom content props
      aboutContent={aboutContent}
      usageTipsContent={usageTipsContent}
    />
  );
};