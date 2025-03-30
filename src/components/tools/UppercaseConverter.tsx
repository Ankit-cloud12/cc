import React from "react";
import TextCaseTools from "./TextCaseTools";

export const UppercaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="upper"
      title="Uppercase Text Converter" 
      description="Convert your text to UPPERCASE letters. Perfect for emphasizing text or creating headlines."
    />
  );
};
