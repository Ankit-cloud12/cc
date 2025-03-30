import React from "react";
import TextCaseTools from "./TextCaseTools";

export const InverseCaseConverter = () => {
  return (
    <TextCaseTools 
      initialCase="inverse"
      title="Inverse Case Converter" 
      description="Convert your text to InVeRsE CaSe by switching the case of each letter. This creates text where uppercase becomes lowercase and vice versa."
    />
  );
};