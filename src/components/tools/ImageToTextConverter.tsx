import { useState } from "react";
import ImageTool from "./ImageTool";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import * as Tesseract from 'tesseract.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OCRResult {
  text: string;
  confidence: number;
  wordCount: number;
  imageData: string;
}

const ImageToTextConverter = () => {
  const [language, setLanguage] = useState("eng");
  const [progress, setProgress] = useState(0);

  const languages = [
    { value: "eng", label: "English" },
    { value: "fra", label: "French" },
    { value: "deu", label: "German" },
    { value: "spa", label: "Spanish" },
    { value: "ita", label: "Italian" },
    { value: "por", label: "Portuguese" },
    { value: "rus", label: "Russian" },
    { value: "jpn", label: "Japanese" },
    { value: "chi_sim", label: "Chinese (Simplified)" },
    { value: "kor", label: "Korean" },
    { value: "ara", label: "Arabic" },
    { value: "hin", label: "Hindi" }
  ];

  const processImage = async (file: File): Promise<OCRResult> => {
    // Only process image files
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file');
    }

    // Convert file to base64
    const base64Image = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    try {
      // Use Tesseract.recognize for OCR
      const result = await Tesseract.recognize(
        file,
        language,
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(parseInt((m.progress * 100).toFixed(0)));
            }
          }
        }
      );
      
      // Calculate word count
      const wordCount = result.data.text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0)
        .length;
      
      return {
        text: result.data.text,
        confidence: result.data.confidence,
        wordCount,
        imageData: base64Image
      };
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error(`OCR processing failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const renderResult = (result: OCRResult) => {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-zinc-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-2">Extracted Text</h3>
          <div className="text-sm text-gray-400 mb-3">
            <p>Confidence: {result.confidence.toFixed(2)}%</p>
            <p>Word count: {result.wordCount}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-800 rounded p-2">
              <img 
                src={result.imageData} 
                alt="Source" 
                className="max-h-[200px] w-auto mx-auto object-contain"
              />
            </div>
            
            <div className="bg-zinc-800 rounded p-2 flex flex-col">
              <Textarea
                readOnly
                value={result.text}
                className="flex-grow min-h-[180px] bg-zinc-900 text-white border-zinc-600 resize-none"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-auto">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([result.text], { type: "text/plain" });
              element.href = URL.createObjectURL(file);
              element.download = "extracted-text.txt";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            Download Text
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
            onClick={() => {
              navigator.clipboard.writeText(result.text);
            }}
          >
            Copy to Clipboard
          </Button>
        </div>
      </div>
    );
  };

  const options = (
    <div>
      <label className="text-sm text-white block mb-2">
        Text Language
      </label>
      <div className="mb-2 text-xs text-gray-400">
        Select the language of the text in your image for better accuracy.
      </div>
      <Select 
        value={language} 
        onValueChange={setLanguage}
      >
        <SelectTrigger className="w-full bg-zinc-700 text-white border-zinc-600">
          <SelectValue placeholder="Select a language" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-700 text-white border-zinc-600">
          {languages.map((lang) => (
            <SelectItem key={lang.value} value={lang.value}>
              {lang.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {progress > 0 && progress < 100 && (
        <div className="mt-4">
          <p className="text-sm text-white mb-1">Processing: {progress}%</p>
          <div className="w-full bg-zinc-800 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ImageTool
      title="Image to Text Converter (OCR)"
      description="Extract text from images using Optical Character Recognition (OCR). Upload any image containing text, and our tool will convert it to editable text that you can copy or download."
      processImage={processImage}
      renderResult={renderResult}
      options={options}
      acceptedFileTypes={{
        'image/jpeg': [],
        'image/jpg': [],
        'image/png': [],
        'image/webp': [],
        'image/tiff': [],
        'image/bmp': []
      }}
    />
  );
};

export default ImageToTextConverter;
