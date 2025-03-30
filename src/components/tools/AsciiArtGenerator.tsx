import { useState } from "react";
import ImageTool from "./ImageTool";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AsciiArtGenerator = () => {
  const [resolution, setResolution] = useState(80); // characters per line
  const [inverted, setInverted] = useState(false);
  const [charSet, setCharSet] = useState("standard");

  // Define different character sets for varying levels of detail
  const charSets = {
    standard: "@%#*+=-:. ",
    detailed: "$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/\\|()1{}[]?-_+~<>i!lI;:,\"^`'. ",
    blocks: "█▓▒░ ",
    minimal: "#@:. ",
    letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 "
  };

  const processImage = async (file: File) => {
    // Only process image files
    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload a valid image file');
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
          // Create a canvas to process the image
          const canvas = document.createElement('canvas');
          
          // Calculate dimensions
          const ratio = img.height / img.width;
          const width = resolution;
          const height = Math.floor(width * ratio * 0.5); // Adjust for character aspect ratio
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to create canvas context'));
            return;
          }
          
          // Draw image to canvas (resized)
          ctx.drawImage(img, 0, 0, width, height);
          
          // Get image data
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;
          
          // Convert to ASCII
          let asciiArt = '';
          const chars = charSets[charSet as keyof typeof charSets] || charSets.standard;
          
          for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
              const idx = (y * width + x) * 4;
              
              // Get pixel brightness (0-255)
              const r = data[idx];
              const g = data[idx + 1];
              const b = data[idx + 2];
              
              // Calculate perceived brightness using luminosity method
              // Different colors contribute differently to perceived brightness
              let brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              
              // Invert if requested
              if (inverted) brightness = 1 - brightness;
              
              // Map brightness to character
              const charIndex = Math.floor(brightness * (chars.length - 1));
              asciiArt += chars[charIndex];
            }
            asciiArt += '\n';
          }
          
          resolve({
            ascii: asciiArt,
            width,
            height,
            originalWidth: img.width,
            originalHeight: img.height,
            imageData: img.src
          });
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

  const renderResult = (result: any) => {
    return (
      <div className="flex flex-col h-full">
        <div className="bg-zinc-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-2">ASCII Art Result</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-zinc-800 rounded p-2">
              <img 
                src={result.imageData} 
                alt="Source" 
                className="max-h-[200px] w-auto mx-auto object-contain"
              />
              <p className="text-xs text-center text-gray-400 mt-2">
                Original: {result.originalWidth} x {result.originalHeight}px
              </p>
            </div>
            
            <div className="bg-zinc-800 rounded p-2 flex flex-col">
              <p className="text-xs text-gray-400 mb-1">
                ASCII dimensions: {result.width} x {result.height} characters
              </p>
              <Textarea
                readOnly
                value={result.ascii}
                className="flex-grow min-h-[180px] bg-zinc-900 text-white border-zinc-600 resize-none font-mono text-xs"
                style={{ lineHeight: '0.8' }}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center gap-2 mt-auto">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => {
              const element = document.createElement("a");
              const file = new Blob([result.ascii], { type: "text/plain" });
              element.href = URL.createObjectURL(file);
              element.download = "ascii-art.txt";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }}
          >
            Download ASCII
          </Button>
          <Button
            variant="outline"
            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
            onClick={() => {
              navigator.clipboard.writeText(result.ascii);
            }}
          >
            Copy to Clipboard
          </Button>
        </div>
      </div>
    );
  };

  const options = (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-white block mb-2">
          Resolution: {resolution} characters per line
        </label>
        <Slider 
          value={[resolution]} 
          min={20} 
          max={160} 
          step={5} 
          onValueChange={(value) => setResolution(value[0])} 
        />
        <div className="text-xs text-gray-400 mt-1">
          Higher values give more detailed ASCII art but may require smaller font size to view properly.
        </div>
      </div>
      
      <div>
        <label className="text-sm text-white block mb-2">
          Character Set
        </label>
        <Select 
          value={charSet} 
          onValueChange={setCharSet}
        >
          <SelectTrigger className="w-full bg-zinc-700 text-white border-zinc-600">
            <SelectValue placeholder="Select a character set" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-700 text-white border-zinc-600">
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="detailed">Detailed</SelectItem>
            <SelectItem value="blocks">Block Characters</SelectItem>
            <SelectItem value="minimal">Minimal</SelectItem>
            <SelectItem value="letters">Letters & Numbers</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="inverted"
          checked={inverted}
          onChange={() => setInverted(!inverted)}
          className="rounded border-zinc-600 bg-zinc-800 text-blue-600 mr-2"
        />
        <label htmlFor="inverted" className="text-sm text-white">
          Invert colors
        </label>
      </div>
    </div>
  );

  return (
    <ImageTool
      title="ASCII Art Generator"
      description="Convert your images to ASCII art. This tool transforms regular images into text-based artwork using various characters to represent different brightness levels."
      processImage={processImage}
      renderResult={renderResult}
      options={options}
      acceptedFileTypes={{
        'image/jpeg': [],
        'image/jpg': [],
        'image/png': [],
        'image/webp': [],
        'image/gif': []
      }}
    />
  );
};

export default AsciiArtGenerator;
