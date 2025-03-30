import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ImageToolProps {
  title: string;
  description: string;
  processImage: (file: File) => Promise<any>;
  renderResult: (result: any) => React.ReactNode;
  options?: React.ReactNode;
  acceptedFileTypes?: Record<string, string[]>;
}

const ImageTool: React.FC<ImageToolProps> = ({
  title,
  description,
  processImage,
  renderResult,
  options,
  acceptedFileTypes = { 'image/*': [] }
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [result, setResult] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: acceptedFileTypes,
    onDrop: acceptedFiles => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setImageUrl('');
        setResult(null);
      }
    }
  });

  // Handle URL input
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
    setFile(null);
    setResult(null);
  };

  // Handle pasting from clipboard
  const handlePaste = async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      for (const clipboardItem of clipboardItems) {
        for (const type of clipboardItem.types) {
          if (type.startsWith('image/')) {
            const blob = await clipboardItem.getType(type);
            const file = new File([blob], 'pasted-image', { type });
            setFile(file);
            setImageUrl('');
            setResult(null);
            break;
          }
        }
      }
    } catch (error) {
      setError('Failed to paste image from clipboard. Try using the upload button instead.');
    }
  };

  // Process the image
  const handleProcess = async () => {
    if (!file && !imageUrl) {
      setError('Please provide an image or URL');
      return;
    }

    setProcessing(true);
    setError(null);
    
    try {
      let imageFile = file;
      
      if (imageUrl && !file) {
        // Fetch image from URL
        try {
          const response = await fetch(imageUrl);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const blob = await response.blob();
          const contentType = blob.type;
          if (!contentType.startsWith('image/')) {
            throw new Error('The URL does not point to a valid image');
          }
          imageFile = new File([blob], 'fetched-image', { type: contentType });
        } catch (error) {
          throw new Error(`Failed to fetch image from URL: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
      
      if (imageFile) {
        const processedResult = await processImage(imageFile);
        setResult(processedResult);
      }
    } catch (error) {
      setError('Error processing image: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setProcessing(false);
    }
  };

  // Helper to convert data URL to Blob
  const dataURLToBlob = (dataURL: string) => {
    const parts = dataURL.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);
    
    for (let i = 0; i < raw.length; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    
    return new Blob([uInt8Array], { type: contentType });
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-300 mb-6">{description}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Input Section */}
        <div className="w-full">
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-6 cursor-pointer text-center hover:bg-zinc-800 transition-colors
              ${isDragActive ? 'border-blue-500 bg-zinc-800/50' : 'border-zinc-600'}`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className="text-center">
                <p className="text-white">{file.name}</p>
                <p className="text-gray-400 text-sm">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
                {file.type.startsWith('image/') && (
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="Preview" 
                    className="max-h-40 mx-auto mt-2 object-contain"
                  />
                )}
              </div>
            ) : (
              <div>
                <p className="text-white">Drag & drop an image here, or click to select</p>
                <p className="text-gray-400 mt-2">
                  Supported formats: {Object.keys(acceptedFileTypes)
                    .map(type => type.replace('image/', '').toUpperCase())
                    .join(', ') || 'All image formats'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-4">
            <p className="text-sm text-white mb-2">Or enter an image URL:</p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={handleUrlChange}
                className="flex-grow bg-zinc-700 text-white border-zinc-600"
              />
              <Button
                variant="outline"
                className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                onClick={handlePaste}
                type="button"
              >
                Paste
              </Button>
            </div>
          </div>

          {options && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Options</h3>
              {options}
            </div>
          )}

          <div className="mt-4 flex gap-2">
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleProcess}
              disabled={processing || (!file && !imageUrl)}
            >
              {processing ? 'Processing...' : 'Convert'}
            </Button>
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
              onClick={() => {
                setFile(null);
                setImageUrl('');
                setResult(null);
                setError(null);
              }}
            >
              Clear
            </Button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/50 text-red-200 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="w-full">
          {processing ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <p className="text-white mb-2">Processing your image...</p>
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          ) : result ? (
            <div className="h-full">
              {renderResult(result)}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-zinc-600 rounded-lg p-6">
              <p className="text-gray-400">Result will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageTool;
