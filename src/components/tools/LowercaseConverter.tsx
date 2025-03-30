import React from "react";
import TextCaseTools from "./TextCaseTools";

export const LowercaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="lower"
      title="Lowercase Text Converter" 
      description="Convert your text to lowercase letters. Useful for casual text or ensuring consistent formatting."
    />
  );
};
