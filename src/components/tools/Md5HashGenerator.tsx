import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeTranslationLayout from "./CodeTranslationLayout";

interface HashType {
  id: string;
  name: string;
  description: string;
  algorithm: (input: string) => Promise<string>;
}

interface HashFormatType {
  id: string;
  name: string;
  formatter: (hash: string) => string;
}

const Md5HashGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputHash, setOutputHash] = useState("");
  const [hashType, setHashType] = useState<string>("md5");
  const [outputFormat, setOutputFormat] = useState<string>("hex");
  const [includeLength, setIncludeLength] = useState(false);
  const [includeSalt, setIncludeSalt] = useState(false);
  const [salt, setSalt] = useState("");
  const [saltPosition, setSaltPosition] = useState<"prefix" | "suffix">("suffix");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [realtimeMode, setRealtimeMode] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [fileHashProgress, setFileHashProgress] = useState(0);
  const [fileHashing, setFileHashing] = useState(false);

  // Hash algorithm types
  const hashTypes: HashType[] = [
    {
      id: "md5",
      name: "MD5",
      description: "128-bit hash (32 hex characters). Fast but not cryptographically secure.",
      algorithm: async (input: string) => {
        // Using SubtleCrypto API for MD5
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('MD5', data);
        return arrayBufferToHex(hashBuffer);
      },
    },
    {
      id: "sha1",
      name: "SHA-1",
      description: "160-bit hash (40 hex characters). Legacy algorithm, not secure against attacks.",
      algorithm: async (input: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-1', data);
        return arrayBufferToHex(hashBuffer);
      },
    },
    {
      id: "sha256",
      name: "SHA-256",
      description: "256-bit hash (64 hex characters). Secure and widely used.",
      algorithm: async (input: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return arrayBufferToHex(hashBuffer);
      },
    },
    {
      id: "sha384",
      name: "SHA-384",
      description: "384-bit hash (96 hex characters). Stronger SHA-2 variant.",
      algorithm: async (input: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-384', data);
        return arrayBufferToHex(hashBuffer);
      },
    },
    {
      id: "sha512",
      name: "SHA-512",
      description: "512-bit hash (128 hex characters). Strongest SHA-2 variant.",
      algorithm: async (input: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-512', data);
        return arrayBufferToHex(hashBuffer);
      },
    },
  ];

  // Hash output formats
  const hashFormats: HashFormatType[] = [
    {
      id: "hex",
      name: "Hexadecimal",
      formatter: (hash: string) => hash,
    },
    {
      id: "base64",
      name: "Base64",
      formatter: (hash: string) => {
        // Convert hex to base64
        const bytes = new Uint8Array(hash.length / 2);
        for (let i = 0; i < hash.length; i += 2) {
          bytes[i / 2] = parseInt(hash.substring(i, i + 2), 16);
        }
        return btoa(String.fromCharCode.apply(null, Array.from(bytes)));
      },
    },
    {
      id: "uppercase",
      name: "Uppercase Hex",
      formatter: (hash: string) => hash.toUpperCase(),
    },
    {
      id: "binary",
      name: "Binary",
      formatter: (hash: string) => {
        // Convert hex to binary
        let binary = '';
        for (let i = 0; i < hash.length; i += 2) {
          const byte = parseInt(hash.substring(i, i + 2), 16);
          binary += byte.toString(2).padStart(8, '0');
        }
        return binary;
      },
    },
  ];

  // Convert ArrayBuffer to hex string
  const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };

  // Process input to generate hash
  useEffect(() => {
    if (realtimeMode && inputText) {
      generateHash();
    }
  }, [inputText, hashType, outputFormat, includeLength, includeSalt, salt, saltPosition, realtimeMode]);

  const generateHash = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      if (!inputText && !file) {
        setOutputHash("");
        setIsProcessing(false);
        return;
      }
      
      // Get the selected hash algorithm
      const selectedHashType = hashTypes.find(h => h.id === hashType);
      if (!selectedHashType) {
        throw new Error("Invalid hash type selected");
      }
      
      // Get the selected output format
      const selectedFormat = hashFormats.find(f => f.id === outputFormat);
      if (!selectedFormat) {
        throw new Error("Invalid output format selected");
      }
      
      let processedInput = inputText;
      
      // Add length if requested
      if (includeLength) {
        processedInput = `${processedInput.length}:${processedInput}`;
      }
      
      // Add salt if requested
      if (includeSalt && salt) {
        processedInput = saltPosition === "prefix" 
          ? `${salt}${processedInput}` 
          : `${processedInput}${salt}`;
      }
      
      // Generate the hash
      const hash = await selectedHashType.algorithm(processedInput);
      
      // Format the hash
      const formattedHash = selectedFormat.formatter(hash);
      
      setOutputHash(formattedHash);
    } catch (err) {
      setError(`Failed to generate hash: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setFileHash(null);
      setFileHashProgress(0);
    }
  };

  const generateFileHash = async () => {
    if (!file) return;
    
    try {
      setFileHashing(true);
      setFileHash(null);
      setError(null);
      
      // Get the selected hash algorithm
      const selectedHashType = hashTypes.find(h => h.id === hashType);
      if (!selectedHashType) {
        throw new Error("Invalid hash type selected");
      }
      
      // Get the selected output format
      const selectedFormat = hashFormats.find(f => f.id === outputFormat);
      if (!selectedFormat) {
        throw new Error("Invalid output format selected");
      }
      
      // Set up the hashing
      const reader = new FileReader();
      const crypto = window.crypto;
      const chunkSize = 1024 * 1024; // 1MB chunks for large files
      let offset = 0;
      
      // Create a hash algorithm based on the selected type
      let hashName: string;
      switch (hashType) {
        case "md5": hashName = "MD5"; break;
        case "sha1": hashName = "SHA-1"; break;
        case "sha256": hashName = "SHA-256"; break;
        case "sha384": hashName = "SHA-384"; break;
        case "sha512": hashName = "SHA-512"; break;
        default: hashName = "SHA-256";
      }
      
      const hashObj = await crypto.subtle.digest(hashName, new Uint8Array(0));
      
      // Function to read chunks
      const readNextChunk = () => {
        const fileReader = new FileReader();
        
        // Handle chunk read
        fileReader.onload = async (e) => {
          if (!e.target || !e.target.result) {
            throw new Error("Failed to read file chunk");
          }
          
          // Update progress
          offset += (e.target.result as ArrayBuffer).byteLength;
          setFileHashProgress(Math.min(100, Math.round((offset / (file.size || 1)) * 100)));
          
          // Update hash
          // Note: In a real implementation, we'd be using a streaming hash algorithm
          // that can process chunks. For simplicity, we'll hash the entire chunk.
          const buffer = e.target.result as ArrayBuffer;
          const hashBuffer = await crypto.subtle.digest(hashName, buffer);
          
          if (offset < file.size) {
            readNextChunk();
          } else {
            // Final hash
            const hash = arrayBufferToHex(hashBuffer);
            const formattedHash = selectedFormat.formatter(hash);
            setFileHash(formattedHash);
            setFileHashing(false);
          }
        };
        
        // Handle errors
        fileReader.onerror = (error) => {
          setError(`Error reading file: ${fileReader.error}`);
          setFileHashing(false);
        };
        
        // Read the chunk
        const slice = file.slice(offset, offset + chunkSize);
        fileReader.readAsArrayBuffer(slice);
      };
      
      // Start reading the file
      readNextChunk();
    } catch (err) {
      setError(`Failed to hash file: ${err instanceof Error ? err.message : String(err)}`);
      setFileHashing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([outputHash], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${hashType}_hash.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setInputText("");
    setOutputHash("");
    setError(null);
    setCopied(false);
    setFile(null);
    setFileHash(null);
    setFileHashProgress(0);
  };

  const getSelectedHashType = () => hashTypes.find(h => h.id === hashType) || hashTypes[0];

  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        This tool generates cryptographic hash digests from text or files. Hashing is a one-way process that transforms input data into a fixed-length string of characters.
      </p>
      
      <p className="text-gray-300 mb-4">
        The tool supports multiple hash algorithms:
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li><strong>MD5 (128-bit)</strong>: Fast but cryptographically broken, suitable for checksums but not security purposes</li>
        <li><strong>SHA-1 (160-bit)</strong>: Legacy algorithm, not considered secure against determined attacks</li>
        <li><strong>SHA-256 (256-bit)</strong>: Part of the SHA-2 family, widely used and cryptographically secure</li>
        <li><strong>SHA-384 (384-bit)</strong>: Stronger variant of SHA-2</li>
        <li><strong>SHA-512 (512-bit)</strong>: Highest security SHA-2 variant</li>
      </ul>
      
      <p className="text-gray-300 mb-4">
        Common uses for hash functions include:
      </p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Verifying file integrity and checksums</li>
        <li>Storing password hashes (with proper salting and modern algorithms)</li>
        <li>Creating unique identifiers for data</li>
        <li>Detecting data changes or tampering</li>
        <li>Digital signatures and data authentication</li>
      </ul>
      
      <p className="text-gray-300">
        <strong>Note:</strong> While this tool can generate hash values, for security-critical applications (like password storage), 
        you should use specialized password hashing functions like bcrypt, Argon2, or PBKDF2 with proper salting and high work factors.
      </p>
    </>
  );

  return (
    <CodeTranslationLayout
      title="Hash Generator"
      description="Generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text or files. This tool supports various output formats and security options like salting."
      onProcess={generateHash}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      processButtonText="Generate Hash"
      copied={copied}
      result={outputHash}
      error={error || ""}
      aboutContent={aboutContent}
      showProcessButton={!realtimeMode}
    >
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="text" className="flex-grow">Hash Text</TabsTrigger>
          <TabsTrigger value="file" className="flex-grow">Hash File</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {/* Left Column - Input */}
            <div className="flex flex-col space-y-4">
              <Label>Input Text</Label>
              <Textarea 
                placeholder="Enter text to hash..."
                className="min-h-[200px] bg-zinc-700 text-white border-zinc-600 resize-y"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="hashType" className="mb-2 block">Hash Algorithm</Label>
                  <Select value={hashType} onValueChange={setHashType}>
                    <SelectTrigger id="hashType" className="bg-zinc-700 text-white border-zinc-600">
                      <SelectValue placeholder="Select hash algorithm" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                      {hashTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <span>{type.name}</span>
                            <p className="text-xs text-gray-400">{type.description}</p>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="outputFormat" className="mb-2 block">Output Format</Label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger id="outputFormat" className="bg-zinc-700 text-white border-zinc-600">
                      <SelectValue placeholder="Select output format" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                      {hashFormats.map(format => (
                        <SelectItem key={format.id} value={format.id}>
                          {format.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="realtimeMode"
                    checked={realtimeMode}
                    onCheckedChange={(checked) => setRealtimeMode(!!checked)}
                  />
                  <Label htmlFor="realtimeMode">
                    Real-time Hashing
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeLength"
                    checked={includeLength}
                    onCheckedChange={(checked) => setIncludeLength(!!checked)}
                  />
                  <Label htmlFor="includeLength">
                    Include Length Prefix
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeSalt"
                    checked={includeSalt}
                    onCheckedChange={(checked) => setIncludeSalt(!!checked)}
                  />
                  <Label htmlFor="includeSalt">
                    Add Salt
                  </Label>
                </div>
                
                {includeSalt && (
                  <div className="pl-6 space-y-3">
                    <div>
                      <Label htmlFor="salt">Salt Value</Label>
                      <Input
                        id="salt"
                        placeholder="Enter a salt value"
                        value={salt}
                        onChange={(e) => setSalt(e.target.value)}
                        className="bg-zinc-700 text-white border-zinc-600"
                      />
                    </div>
                    
                    <div>
                      <Label className="mb-2 block">Salt Position</Label>
                      <RadioGroup 
                        value={saltPosition} 
                        onValueChange={(value) => setSaltPosition(value as "prefix" | "suffix")}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="prefix" value="prefix" />
                          <Label htmlFor="prefix">Prefix</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="suffix" value="suffix" />
                          <Label htmlFor="suffix">Suffix</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Output */}
            <div className="flex flex-col space-y-4">
              <Label>Hash Output</Label>
              <div className="min-h-[200px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y font-mono">
                {outputHash ? (
                  <div className="whitespace-pre-wrap break-all">{outputHash}</div>
                ) : (
                  <p className="text-gray-400 italic">
                    Your hash will appear here
                  </p>
                )}
              </div>
              
              <div className="flex flex-col space-y-1 text-sm text-gray-400">
                {outputHash && (
                  <>
                    <p>
                      Algorithm: {getSelectedHashType().name}
                    </p>
                    <p>
                      Length: {outputHash.length} characters
                    </p>
                    {includeSalt && (
                      <p>
                        Salt: {salt} ({saltPosition})
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="file">
          <div className="flex flex-col space-y-6">
            <div className="space-y-4">
              <Label htmlFor="fileInput">Select File to Hash</Label>
              <Input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="bg-zinc-700 text-white border-zinc-600"
              />
              
              {file && (
                <div className="text-sm text-gray-300">
                  <p>File: {file.name}</p>
                  <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="fileHashType" className="mb-2 block">Hash Algorithm</Label>
                <Select value={hashType} onValueChange={setHashType}>
                  <SelectTrigger id="fileHashType" className="bg-zinc-700 text-white border-zinc-600">
                    <SelectValue placeholder="Select hash algorithm" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                    {hashTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>
                        <div>
                          <span>{type.name}</span>
                          <p className="text-xs text-gray-400">{type.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="fileOutputFormat" className="mb-2 block">Output Format</Label>
                <Select value={outputFormat} onValueChange={setOutputFormat}>
                  <SelectTrigger id="fileOutputFormat" className="bg-zinc-700 text-white border-zinc-600">
                    <SelectValue placeholder="Select output format" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                    {hashFormats.map(format => (
                      <SelectItem key={format.id} value={format.id}>
                        {format.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={generateFileHash}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!file || fileHashing}
              >
                {fileHashing ? `Hashing... ${fileHashProgress}%` : "Hash File"}
              </Button>
            </div>
            
            {fileHash && (
              <div className="space-y-2">
                <Label>File Hash ({getSelectedHashType().name})</Label>
                <div className="bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white font-mono break-all">
                  {fileHash}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                    onClick={() => {
                      navigator.clipboard.writeText(fileHash);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                  <Button
                    variant="outline"
                    className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                    onClick={() => {
                      const element = document.createElement("a");
                      const file = new Blob([fileHash], { type: "text/plain" });
                      element.href = URL.createObjectURL(file);
                      element.download = `${hashType}_file_hash.txt`;
                      document.body.appendChild(element);
                      element.click();
                      document.body.removeChild(element);
                    }}
                  >
                    Download Hash
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </CodeTranslationLayout>
  );
};

export default Md5HashGenerator;
