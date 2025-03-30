import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FileUploaderProps {
  onFileContent: (content: string) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
  onError?: (error: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileContent,
  acceptedFormats = ".txt,.json,.csv,.xml,.html,.js,.css,.md",
  maxSizeMB = 5,
  onError,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    setIsLoading(true);
    setError(null);
    
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      const errorMsg = `File too large. Maximum size is ${maxSizeMB}MB.`;
      setError(errorMsg);
      if (onError) onError(errorMsg);
      setIsLoading(false);
      return;
    }
    
    // Check file type against accepted formats
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (fileExt && !acceptedFormats.includes(`.${fileExt}`)) {
      const errorMsg = `Invalid file type. Accepted formats: ${acceptedFormats}`;
      setError(errorMsg);
      if (onError) onError(errorMsg);
      setIsLoading(false);
      return;
    }
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        onFileContent(content);
      }
      setIsLoading(false);
    };
    
    reader.onerror = () => {
      const errorMsg = "Error reading file.";
      setError(errorMsg);
      if (onError) onError(errorMsg);
      setIsLoading(false);
    };
    
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className="mb-4">
      <Card 
        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 text-center h-64 ${
          dragActive 
            ? "border-blue-500 bg-blue-900/10" 
            : "border-zinc-700 bg-zinc-800/50 hover:bg-zinc-700/40"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleChange}
          accept={acceptedFormats}
        />
        
        {isLoading ? (
          <div className="text-white">
            <svg className="animate-spin h-8 w-8 mb-4 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p>Loading file...</p>
          </div>
        ) : fileName ? (
          <div className="text-center">
            <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-lg text-white font-medium mb-1">File loaded successfully</p>
            <p className="text-sm text-gray-300 mb-4">{fileName}</p>
            <Button 
              variant="outline" 
              className="bg-zinc-800 hover:bg-zinc-700 text-gray-200 border-zinc-700"
              onClick={onButtonClick}
            >
              Choose another file
            </Button>
          </div>
        ) : (
          <>
            <svg className="w-12 h-12 text-gray-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-lg font-medium text-gray-300 mb-2">Drag and drop your file here</p>
            <p className="text-sm text-gray-400 mb-4">or click to browse your files</p>
            <Button
              onClick={onButtonClick}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Browse Files
            </Button>
            <p className="text-xs text-gray-500 mt-4">
              Accepted formats: {acceptedFormats} • Max size: {maxSizeMB}MB
            </p>
          </>
        )}
      </Card>
      
      {error && (
        <Alert variant="destructive" className="mt-4 bg-red-900/60 border border-red-600 text-red-100">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};
