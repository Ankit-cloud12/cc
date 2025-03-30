import TextCaseTools from "./TextCaseTools";

export const LineBreakRemover = () => {
  const handleRemoveLineBreaks = (text: string) => {
    // Replace line breaks with spaces and normalize whitespace
    return text.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
  };

  return (
    <TextCaseTools
      initialText=""
      initialCase="lower"
      title="Remove Line Breaks"
      description="Remove line breaks from your text while preserving words and sentences."
      onTextTransform={handleRemoveLineBreaks}
    />
  );
};