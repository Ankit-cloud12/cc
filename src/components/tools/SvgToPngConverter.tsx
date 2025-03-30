import { useState } from "react";
import ImageTool from "./ImageTool";
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SvgToPngConverter = () => {
  const [scale, setScale] = useState(1);
  const [transparentBackground, setTransparentBackground] = useState(true);

  const processImage = async (file: File) => {
    // Check file type
    if (!file.type.includes('svg')) {
      throw new Error('Please upload an SVG image');
    }

    return new Promise<any>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        if (!e.target?.result) {
          reject(new Error('Failed to read the file'));
          return;
        }
        
        const svgText = e.target.result as string;
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        
        // Check for parsing errors
        const parsererror = svgDoc.querySelector('parsererror');
        if (parsererror) {
          reject(new Error('Invalid SVG file format'));
          return;
        }
        
        const svgElement = svgDoc.documentElement;
        
        // Get SVG dimensions
        let width = parseInt(svgElement.getAttribute('width') || '0');
        let height = parseInt(svgElement.getAttribute('height') || '0');
        
        // If no dimensions are specified, use viewBox
        if (!width || !height) {
          const viewBox = svgElement.getAttribute('viewBox');
          if (viewBox) {
            const [, , vbWidth, vbHeight] = viewBox.split(/[\s,]+/).map(parseFloat);
            width = vbWidth || 300;
            height = vbHeight || 150;
          } else {
            // Default dimensions if none specified
            width = 300;
            height = 150;
          }
        }
        
        // Apply scaling
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        
        // Create a blob URL for the SVG
        const svgBlob = new Blob([svgText], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.src = url;
        
        img.onload = function() {
          URL.revokeObjectURL(url);
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to create canvas context'));
            return;
          }
          
          // If background should not be transparent, fill with white
          if (!transparentBackground) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
          }
          
          // Draw SVG
          ctx.drawImage(img, 0, 0, width, height);
          
          try {
            // PNG conversion
            const pngDataUrl = canvas.toDataURL('image/png');
            const pngBlob = dataURLToBlob(pngDataUrl);
            
            resolve({
              originalSize: file.size,
              convertedSize: pngBlob.size,
              dataUrl: pngDataUrl,
              blob: pngBlob,
              width: width,
              height: height,
              filename: file.name.replace(/\.[^/.]+$/, "") + '.png',
              transparent: transparentBackground
            });
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = function() {
          URL.revokeObjectURL(url);
          reject(new Error('Failed to load SVG image'));
        };
      };
      
      reader.onerror = function() {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file); // Read SVG as text
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
    return (
      <div className="flex flex-col h-full">
        <div className="bg-zinc-700 rounded-lg p-4 mb-4">
          <h3 className="text-lg font-medium mb-2">Conversion Result</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-300">Original SVG</h4>
              <p className="text-sm text-gray-400">Size: {(result.originalSize / 1024).toFixed(2)} KB</p>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-gray-300">Converted PNG</h4>
              <p className="text-sm text-gray-400">Size: {(result.convertedSize / 1024).toFixed(2)} KB</p>
              <p className="text-sm text-gray-400">Dimensions: {result.width} x {result.height}px</p>
              <p className="text-sm text-gray-400">Background: {result.transparent ? 'Transparent' : 'White'}</p>
            </div>
          </div>
          <div className="bg-zinc-800 rounded p-2">
            {/* Checkered background to show transparency */}
            <div className="relative">
              {result.transparent && (
                <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAChJREFUOE9jZGBgEAFifOANxH+gDDyABYrxgQdQDDbAkDGMBsMPMDAAABdcCKTIr9OzAAAAAElFTkSuQmCC')]"></div>
              )}
              <img 
                src={result.dataUrl} 
                alt="Converted" 
                className="relative max-h-[300px] w-auto mx-auto object-contain"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-auto">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => saveAs(result.blob, result.filename)}
          >
            Download PNG
          </Button>
        </div>
      </div>
    );
  };

  const options = (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-white block mb-2">
          Scale: {scale.toFixed(1)}x
        </label>
        <div className="mb-2 text-xs text-gray-400">
          Adjust the scale to increase or decrease the output PNG resolution.
        </div>
        <Slider 
          value={[scale]} 
          min={0.1} 
          max={5} 
          step={0.1} 
          onValueChange={(value) => setScale(value[0])} 
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch 
          id="bg-transparency" 
          checked={transparentBackground} 
          onCheckedChange={setTransparentBackground} 
        />
        <Label htmlFor="bg-transparency" className="text-sm text-white">
          Transparent background
        </Label>
      </div>
      <div className="text-xs text-gray-400">
        Enable to preserve transparency in the output PNG, or disable for a white background.
      </div>
    </div>
  );

  return (
    <ImageTool
      title="SVG to PNG Converter"
      description="Convert SVG vector graphics to PNG raster images online, for free. This tool maintains high quality and provides options for scaling and background transparency to ensure your converted images are perfect for any use case."
      processImage={processImage}
      renderResult={renderResult}
      options={options}
      acceptedFileTypes={{
        'image/svg+xml': []
      }}
    />
  );
};

export default SvgToPngConverter;
