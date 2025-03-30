import React from "react";
import TextCaseTools from "./TextCaseTools";

export const AlternatingCaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="alternating"
      title="Alternating Case Converter" 
      description="Convert your text to aLtErNaTiNg CaSe, where letters alternate between lowercase and uppercase. Perfect for creating playful or eye-catching text."
    />
  );
};