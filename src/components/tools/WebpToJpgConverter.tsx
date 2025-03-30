import { useState } from "react";
import ImageTool from "./ImageTool";
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const WebpToJpgConverter = () => {
  const [quality, setQuality] = useState(90);

  const processImage = async (file: File) => {
    // Check file type
    if (!file.type.includes('webp')) {
      throw new Error('Please upload a WebP image');
    }

    return new Promise<any>((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();
      
      reader.onload = function(e) {
        if (!e.target?.result) {
          reject(new Error('Failed to read the file'));
          return;
        }
        
        img.src = e.target.result as string;
        
        img.onload = function() {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to create canvas context'));
            return;
          }
          
          // Create a white background first (for transparency)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          // Draw image on top of white background
          ctx.drawImage(img, 0, 0);
          
          // Convert to JPG
          try {
            const jpgQuality = quality / 100;
            const jpgDataUrl = canvas.toDataURL('image/jpeg', jpgQuality);
            
            // Get file size
            const jpgBlob = dataURLToBlob(jpgDataUrl);
            
            resolve({
              originalSize: file.size,
              convertedSize: jpgBlob.size,
              dataUrl: jpgDataUrl,
              blob: jpgBlob,
              width: img.width,
              height: img.height,
              filename: file.name.replace(/\.[^/.]+$/, "") + '.jpg'
            });
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = function() {
          reject(new Error('Failed to load image'));
        };
      };
      
      reader.onerror = function() {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
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

  const renderResult = (result: any) => {
    const sizeReduction = ((result.originalSize - result.convertedSize) / result.originalSize * 100).toFixed(2);
    
    return (
      <div className="flex flex-col h-full">
        <div className="bg-zinc-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-2">Conversion Result</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-300">Original WebP</h4>
              <p className="text-sm text-gray-400">Size: {(result.originalSize / 1024).toFixed(2)} KB</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-300">Converted JPG</h4>
              <p className="text-sm text-gray-400">Size: {(result.convertedSize / 1024).toFixed(2)} KB</p>
              {Number(sizeReduction) > 0 ? (
                <p className="text-sm text-green-400">
                  {sizeReduction}% smaller
                </p>
              ) : Number(sizeReduction) < 0 ? (
                <p className="text-sm text-yellow-400">
                  {Math.abs(Number(sizeReduction)).toFixed(2)}% larger
                </p>
              ) : null}
              <p className="text-sm text-gray-400">Dimensions: {result.width} x {result.height}px</p>
            </div>
          </div>
          <div className="bg-zinc-800 rounded p-2">
            <img 
              src={result.dataUrl} 
              alt="Converted" 
              className="max-h-[300px] w-auto mx-auto object-contain"
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-auto">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => saveAs(result.blob, result.filename)}
          >
            Download JPG
          </Button>
        </div>
      </div>
    );
  };

  const options = (
    <div>
      <label className="text-sm text-white block mb-2">
        JPG Quality: {quality}%
      </label>
      <div className="mb-2 text-xs text-gray-400">
        Lower quality gives smaller file size but may introduce compression artifacts.
      </div>
      <Slider 
        value={[quality]} 
        min={10} 
        max={100} 
        step={1} 
        onValueChange={(value) => setQuality(value[0])} 
      />
    </div>
  );

  return (
    <ImageTool
      title="WebP to JPG Converter"
      description="Convert WebP images to JPG format online, for free. While WebP offers better compression than JPG, not all software and browsers support WebP format. This tool helps you convert your WebP images to the widely compatible JPG format."
      processImage={processImage}
      renderResult={renderResult}
      options={options}
      acceptedFileTypes={{
        'image/webp': []
      }}
    />
  );
};

export default WebpToJpgConverter;
