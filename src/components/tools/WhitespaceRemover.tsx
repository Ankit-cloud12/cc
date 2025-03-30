import TextCaseTools from "./TextCaseTools";

export const WhitespaceRemover = () => {
  const handleWhitespaceRemoval = (text: string) => {
    return text.replace(/\s+/g, ' ').trim();
  };

  return (
    <TextCaseTools
      initialText=""
      initialCase="lower"
      title="Remove Extra Whitespace"
      description="Remove extra spaces, tabs, and line breaks from your text."
      onTextTransform={handleWhitespaceRemoval}
    />
  );
};