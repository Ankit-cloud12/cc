import { useState, useEffect } from "react";
import ImageTool from "./ImageTool";
import { saveAs } from 'file-saver';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ChromePicker } from 'react-color';
import { InfoIcon, ZoomInIcon, ZoomOutIcon, RotateCcwIcon, ArrowLeftRight } from "lucide-react";

interface Dimensions {
  width: number;
  height: number;
}

const SvgToPngConverter = () => {
  // Basic options
  const [scale, setScale] = useState(1);
  const [transparentBackground, setTransparentBackground] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Advanced options
  const [quality, setQuality] = useState(100);
  const [outputFormat, setOutputFormat] = useState("png");
  const [customDimensions, setCustomDimensions] = useState(false);
  const [dimensions, setDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const [originalDimensions, setOriginalDimensions] = useState<Dimensions>({ width: 0, height: 0 });
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  
  // Preview options
  const [zoom, setZoom] = useState(1);
  const [showOriginal, setShowOriginal] = useState(false);
  
  // Update dimensions when scale changes
  useEffect(() => {
    if (originalDimensions.width && originalDimensions.height && !customDimensions) {
      setDimensions({
        width: Math.round(originalDimensions.width * scale),
        height: Math.round(originalDimensions.height * scale)
      });
    }
  }, [scale, originalDimensions, customDimensions]);
  
  // Update width/height when maintaining aspect ratio
  useEffect(() => {
    if (!maintainAspectRatio || !originalDimensions.width || !originalDimensions.height) return;
    
    const aspectRatio = originalDimensions.width / originalDimensions.height;
    
    // When width changes, update height
    if (dimensions.width !== Math.round(originalDimensions.width * scale)) {
      setDimensions(prev => ({
        width: prev.width,
        height: Math.round(prev.width / aspectRatio)
      }));
    }
    // When height changes, update width
    else if (dimensions.height !== Math.round(originalDimensions.height * scale)) {
      setDimensions(prev => ({
        width: Math.round(prev.height * aspectRatio),
        height: prev.height
      }));
    }
  }, [dimensions.width, dimensions.height, maintainAspectRatio, originalDimensions, scale]);

  const handleDimensionChange = (dimension: 'width' | 'height', value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) return;
    
    setDimensions(prev => ({
      ...prev,
      [dimension]: numValue
    }));
  };

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
        
        // Set original dimensions
        setOriginalDimensions({ width, height });
        
        // Use custom dimensions if specified, otherwise use scaled dimensions
        const finalWidth = customDimensions ? dimensions.width : Math.round(width * scale);
        const finalHeight = customDimensions ? dimensions.height : Math.round(height * scale);
        
        // Create a blob URL for the SVG
        const svgBlob = new Blob([svgText], {type: 'image/svg+xml'});
        const url = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        img.src = url;
        
        img.onload = function() {
          URL.revokeObjectURL(url);
          
          const canvas = document.createElement('canvas');
          canvas.width = finalWidth;
          canvas.height = finalHeight;
          
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to create canvas context'));
            return;
          }
          
          // If background should not be transparent, fill with specified color
          if (!transparentBackground) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, finalWidth, finalHeight);
          }
          
          // Draw SVG
          ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
          
          try {
            // Determine output format and quality
            const outputMimeType = outputFormat === 'jpg' ? 'image/jpeg' : 'image/png';
            const outputQuality = quality / 100;
            
            // Convert to selected format
            const dataUrl = canvas.toDataURL(outputMimeType, outputQuality);
            const blob = dataURLToBlob(dataUrl);
            const extension = outputFormat === 'jpg' ? '.jpg' : '.png';
            
            // Generate original SVG preview
            const originalPreview = url;
            
            resolve({
              originalSize: file.size,
              convertedSize: blob.size,
              dataUrl: dataUrl,
              originalDataUrl: originalPreview,
              blob: blob,
              width: finalWidth,
              height: finalHeight,
              originalWidth: width,
              originalHeight: height,
              filename: file.name.replace(/\.[^/.]+$/, "") + extension,
              transparent: transparentBackground,
              fileType: outputFormat
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
          
          <Tabs defaultValue="preview" className="mb-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="info">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview">
              {/* Preview with comparison toggle */}
              <div className="relative bg-zinc-800 rounded p-2 min-h-[300px]">
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-zinc-700/70"
                    onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                  >
                    <ZoomOutIcon className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-zinc-700/70"
                    onClick={() => setZoom(1)}
                  >
                    <RotateCcwIcon className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 w-8 p-0 bg-zinc-700/70"
                    onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
                  >
                    <ZoomInIcon className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2 bg-zinc-700/70"
                    onClick={() => setShowOriginal(!showOriginal)}
                  >
                    <ArrowLeftRight className="h-3 w-3 mr-1" />
                    {showOriginal ? "Show Result" : "Show Original"}
                  </Button>
                </div>
                
                {/* Checkered background to show transparency */}
                <div className="relative overflow-auto max-h-[400px]">
                  {result.transparent && !showOriginal && (
                    <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC45bDN+TgAAAChJREFUOE9jZGBgEAFifOANxH+gDDyABYrxgQdQDDbAkDGMBsMPMDAAABdcCKTIr9OzAAAAAElFTkSuQmCC')]"></div>
                  )}
                  <div className="flex justify-center min-h-[280px] items-center">
                    <img 
                      src={showOriginal ? result.originalDataUrl : result.dataUrl} 
                      alt={showOriginal ? "Original SVG" : "Converted Image"} 
                      className="max-w-full object-contain transition-transform"
                      style={{ transform: `scale(${zoom})` }}
                    />
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-400 text-center">
                  {showOriginal ? 
                    `Original SVG (${result.originalWidth}×${result.originalHeight}px)` : 
                    `Converted ${result.fileType.toUpperCase()} (${result.width}×${result.height}px)`
                  }
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="info">
              <div className="grid grid-cols-2 gap-4 bg-zinc-800 p-4 rounded-md">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Original SVG</h4>
                  <p className="text-sm text-gray-400">Size: {(result.originalSize / 1024).toFixed(2)} KB</p>
                  <p className="text-sm text-gray-400">Dimensions: {result.originalWidth} × {result.originalHeight}px</p>
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-300">Converted {result.fileType.toUpperCase()}</h4>
                  <p className="text-sm text-gray-400">Size: {(result.convertedSize / 1024).toFixed(2)} KB</p>
                  <p className="text-sm text-gray-400">Dimensions: {result.width} × {result.height}px</p>
                  <p className="text-sm text-gray-400">Background: {result.transparent ? 'Transparent' : 'Colored'}</p>
                  <p className="text-sm text-gray-400">Compression: {quality}%</p>
                </div>
                
                <div className="col-span-2 mt-2">
                  <h4 className="text-sm font-medium text-gray-300 mb-1">Size Comparison</h4>
                  <div className="h-6 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 flex items-center justify-end pr-2 text-xs text-white"
                      style={{ 
                        width: `${Math.min(100, (result.convertedSize / result.originalSize) * 100)}%`,
                      }}
                    >
                      {result.convertedSize < result.originalSize ? 
                        `${(100 - (result.convertedSize / result.originalSize) * 100).toFixed(0)}% smaller` : 
                        `${(((result.convertedSize / result.originalSize) * 100) - 100).toFixed(0)}% larger`
                      }
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-center gap-2 mt-auto">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => saveAs(result.blob, result.filename)}
          >
            Download {result.fileType.toUpperCase()}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              // Create a link for the original SVG
              const a = document.createElement('a');
              a.href = result.originalDataUrl;
              a.download = result.filename.replace(/\.[^/.]+$/, "") + '.svg';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            Download Original SVG
          </Button>
        </div>
      </div>
    );
  };

  const options = (
    <div className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="basic">Basic Options</TabsTrigger>
          <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          {/* Scale Control */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm text-white">
                Scale: {scale.toFixed(1)}x
              </label>
              <HoverCard>
                <HoverCardTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent side="top">
                  <p className="text-xs">Adjusts the output image dimensions relative to the original SVG.</p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Slider 
              value={[scale]} 
              min={0.1} 
              max={5} 
              step={0.1} 
              onValueChange={(value) => setScale(value[0])} 
              disabled={customDimensions}
            />
          </div>
          
          {/* Background Options */}
          <div className="space-y-3">
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
            
            {!transparentBackground && (
              <div>
                <Label className="text-sm text-white mb-2 block">Background color</Label>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-10 h-10 rounded border border-zinc-600 cursor-pointer"
                    style={{ backgroundColor: backgroundColor }}
                    onClick={() => setShowColorPicker(!showColorPicker)}
                  ></div>
                  <Input 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-28 bg-zinc-700 border-zinc-600"
                  />
                </div>
                {showColorPicker && (
                  <div className="absolute mt-2 z-10">
                    <div 
                      className="fixed inset-0" 
                      onClick={() => setShowColorPicker(false)}
                    ></div>
                    <ChromePicker 
                      color={backgroundColor}
                      onChange={(color) => setBackgroundColor(color.hex)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Output Format */}
          <div>
            <Label className="text-sm text-white mb-2 block">Output Format</Label>
            <Select value={outputFormat} onValueChange={setOutputFormat}>
              <SelectTrigger className="bg-zinc-700 border-zinc-600">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="png">PNG (transparent support)</SelectItem>
                <SelectItem value="jpg">JPG (smaller file size)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-4">
          {/* Custom Dimensions */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Switch 
                id="custom-dimensions" 
                checked={customDimensions} 
                onCheckedChange={setCustomDimensions}
              />
              <Label htmlFor="custom-dimensions" className="text-sm text-white">
                Specify custom dimensions
              </Label>
            </div>
            
            {customDimensions && (
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="width" className="text-xs text-white mb-1 block">Width (px)</Label>
                    <Input 
                      id="width"
                      type="number"
                      value={dimensions.width}
                      onChange={(e) => handleDimensionChange('width', e.target.value)}
                      className="bg-zinc-700 border-zinc-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs text-white mb-1 block">Height (px)</Label>
                    <Input 
                      id="height"
                      type="number"
                      value={dimensions.height}
                      onChange={(e) => handleDimensionChange('height', e.target.value)}
                      className="bg-zinc-700 border-zinc-600"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="aspect-ratio" 
                    checked={maintainAspectRatio} 
                    onCheckedChange={setMaintainAspectRatio}
                  />
                  <Label htmlFor="aspect-ratio" className="text-xs text-white">
                    Maintain aspect ratio
                  </Label>
                </div>
              </div>
            )}
          </div>
          
          {/* Quality Settings */}
          <div>
            <div className="flex justify-between mb-2">
              <Label className="text-sm text-white">
                {outputFormat === 'jpg' ? 'JPEG Quality' : 'PNG Compression'}: {quality}%
              </Label>
              <HoverCard>
                <HoverCardTrigger>
                  <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
                </HoverCardTrigger>
                <HoverCardContent side="top">
                  <p className="text-xs">
                    {outputFormat === 'jpg' ? 
                      'Higher quality results in larger file sizes. Lower quality may show compression artifacts.' : 
                      'Controls the compression level of the PNG output. Higher values give better quality but larger files.'}
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Slider 
              value={[quality]} 
              min={1} 
              max={100} 
              step={1} 
              onValueChange={(value) => setQuality(value[0])} 
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <ImageTool
      title="SVG to PNG/JPG Converter"
      description="Convert SVG vector graphics to PNG or JPG format online with advanced options. Customize dimensions, control quality, and choose background settings to get perfect results for your graphics, icons, or logos. Ideal for web graphics and app development."
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
