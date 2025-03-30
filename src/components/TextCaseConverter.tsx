import React from "react";
import TextCaseTools from "./tools/TextCaseTools";

const TextCaseConverterComponent = () => {
  return (
    <div className="w-full">
      <div className="max-w-5xl mx-auto p-4">
        <TextCaseTools />
      </div>
    </div>
  );
};

export { TextCaseConverterComponent as TextCaseConverter };
export default TextCaseConverterComponent;
