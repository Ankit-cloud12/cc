import TextCaseTools from "./TextCaseTools";

export const RemoveTextFormatting = () => {
  const handleRemoveFormatting = (text: string) => {
    // Remove special characters, emojis, and formatting while preserving basic punctuation
    return text.replace(/[^\x20-\x7E\n\r.,!?;:'"-]/g, '');
  };

  return (
    <TextCaseTools
      initialText=""
      initialCase="lower"
      title="Remove Text Formatting"
      description="Remove special characters, emojis, and formatting while preserving basic text and punctuation."
      onTextTransform={handleRemoveFormatting}
    />
  );
};
