import React from "react";
import TextCaseTools from "./TextCaseTools";

export const SentenceCaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="sentence"
      title="Sentence Case Converter" 
      description="Convert your text to Sentence case, where the first letter of each sentence is capitalized. Perfect for writing paragraphs and general text content."
    />
  );
};
