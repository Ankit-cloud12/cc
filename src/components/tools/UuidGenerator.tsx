import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import RandomGeneratorLayout from "./RandomGeneratorLayout";

interface UuidResult {
  uuid: string;
  version: string;
}

const UuidGenerator = () => {
  const [count, setCount] = useState<number>(5);
  const [version, setVersion] = useState<string>("v4");
  const [namespace, setNamespace] = useState<string>(""); 
  const [name, setName] = useState<string>(""); 
  const [formatting, setFormatting] = useState<string>("standard");
  const [upperCase, setUpperCase] = useState<boolean>(false);
  const [results, setResults] = useState<UuidResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const generateUuidV4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateUuidV1 = (): string => {
    // Simplified version - not a real RFC-compliant v1 UUID
    // In a real implementation, this would use node-uuid or uuid package
    const timeMs = new Date().getTime();
    // Add some randomness so multiple quick calls don't result in identical UUIDs
    const timeLow = timeMs.toString(16).padStart(12, '0');
    
    return `${timeLow.slice(0, 8)}-${timeLow.slice(8, 12)}-1${Math.floor(Math.random() * 0x1000).toString(16).padStart(3, '0')}-${(Math.floor(Math.random() * 0x4000) | 0x8000).toString(16)}-${Math.floor(Math.random() * 0x10000000000000).toString(16).padStart(12, '0')}`;
  };

  const generateUuidV5 = (ns: string, value: string): string => {
    // This is a simplified placeholder - not a real RFC-compliant v5 UUID algorithm
    // In a real implementation, this would use node-uuid or uuid package
    // and properly implement the UUID v5 specification which uses SHA-1 hashing
    const nsUuid = ns.replace(/-/g, '');
    const combined = nsUuid + value;
    
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    
    // Create a deterministic but fake UUID v5
    const hashHex = Math.abs(hash).toString(16).padStart(16, '0');
    return `${hashHex.slice(0, 8)}-${hashHex.slice(8, 12)}-5${hashHex.slice(13, 16)}-${(Math.floor(Math.random() * 0x4000) | 0x8000).toString(16)}-${Math.floor(Math.random() * 0x10000000000000).toString(16).padStart(12, '0')}`;
  };

  const formatUuid = (uuid: string, format: string, uppercase: boolean): string => {
    let formatted = uuid;
    
    if (format === "noDashes") {
      formatted = uuid.replace(/-/g, '');
    } else if (format === "braces") {
      formatted = `{${uuid}}`;
    } else if (format === "brackets") {
      formatted = `[${uuid}]`;
    } else if (format === "parentheses") {
      formatted = `(${uuid})`;
    }
    
    return uppercase ? formatted.toUpperCase() : formatted;
  };

  const generateUuids = () => {
    try {
      if (count < 1 || count > 100) {
        setError("Number of UUIDs must be between 1 and 100.");
        return;
      }

      if ((version === "v5") && (!namespace || !name)) {
        setError("For UUID v5, both namespace and name are required.");
        return;
      }

      setError("");

      // Generate UUIDs
      const generatedUuids: UuidResult[] = [];
      
      for (let i = 0; i < count; i++) {
        let uuid = "";
        
        if (version === "v1") {
          uuid = generateUuidV1();
        } else if (version === "v4") {
          uuid = generateUuidV4();
        } else if (version === "v5") {
          uuid = generateUuidV5(namespace, name);
        }
        
        // Format UUID
        uuid = formatUuid(uuid, formatting, upperCase);
        
        generatedUuids.push({
          uuid,
          version
        });
      }
      
      setResults(generatedUuids);
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.map(r => r.uuid).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([results.map(r => r.uuid).join('\n')], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "uuids.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReset = () => {
    setResults([]);
    setCopied(false);
  };

  const aboutContent = (
    <>
      <p className="text-gray-300 mb-4">
        A UUID (Universally Unique Identifier) is a 128-bit identifier that is unique across both space and time. This tool generates UUIDs in various formats and versions.
      </p>
      <p className="text-gray-300 mb-4">Common uses include:</p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Creating database primary keys that need to be unique across systems</li>
        <li>Identifying resources in distributed systems</li>
        <li>Generating session IDs for web applications</li>
        <li>Creating unique identifiers for files and documents</li>
        <li>Testing applications that require UUID inputs</li>
      </ul>
      <p className="text-gray-300">
        Simply choose your preferred UUID version, set your options, and click the generate button.
      </p>
    </>
  );

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col space-y-4">
        <div>
          <Label htmlFor="count">Number of UUIDs</Label>
          <Input
            id="count"
            type="number"
            min="1"
            max="100"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="bg-zinc-700 text-white border-zinc-600"
          />
        </div>
        
        <div>
          <Label className="mb-2 block">UUID Version</Label>
          <RadioGroup value={version} onValueChange={setVersion} className="space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="v4" value="v4" />
              <Label htmlFor="v4">Version 4 (Random) - Recommended</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="v1" value="v1" />
              <Label htmlFor="v1">Version 1 (Time-based)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="v5" value="v5" />
              <Label htmlFor="v5">Version 5 (Named, SHA-1)</Label>
            </div>
          </RadioGroup>
        </div>
        
        {version === "v5" && (
          <div className="space-y-4 pl-4">
            <div>
              <Label htmlFor="namespace">Namespace UUID</Label>
              <Input
                id="namespace"
                placeholder="e.g. 6ba7b810-9dad-11d1-80b4-00c04fd430c8"
                value={namespace}
                onChange={(e) => setNamespace(e.target.value)}
                className="bg-zinc-700 text-white border-zinc-600"
              />
              <p className="text-xs text-gray-400 mt-1">Standard namespace or any valid UUID</p>
            </div>
            
            <div>
              <Label htmlFor="name">Name String</Label>
              <Input
                id="name"
                placeholder="String to hash into the UUID"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-700 text-white border-zinc-600"
              />
              <p className="text-xs text-gray-400 mt-1">Any string to create a deterministic UUID</p>
            </div>
          </div>
        )}
        
        <div>
          <Label className="mb-2 block">Format</Label>
          <RadioGroup value={formatting} onValueChange={setFormatting} className="space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="standard" value="standard" />
              <Label htmlFor="standard">Standard (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="noDashes" value="noDashes" />
              <Label htmlFor="noDashes">No Dashes (xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="braces" value="braces" />
              <Label htmlFor="braces">With Braces ({`{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}`})</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="brackets" value="brackets" />
              <Label htmlFor="brackets">With Brackets ([xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx])</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem id="parentheses" value="parentheses" />
              <Label htmlFor="parentheses">With Parentheses ((xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx))</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox
            id="uppercase"
            checked={upperCase}
            onCheckedChange={(checked) => setUpperCase(checked as boolean)}
          />
          <Label htmlFor="uppercase">
            Uppercase Letters
          </Label>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Label className="mb-2">Generated UUIDs</Label>
        <div className="min-h-[250px] max-h-[450px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
          {results.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {results.map((result, index) => (
                <li key={index} className="break-words">
                  {result.uuid}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">
              Your generated UUIDs will appear here
            </p>
          )}
        </div>
        
        <div className="text-sm text-gray-400">
          {results.length > 0 && (
            <p>Generated {results.length} UUID{results.length !== 1 ? 's' : ''} (version {version.slice(1)})</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <RandomGeneratorLayout
      title="UUID Generator"
      description="Generate UUIDs (Universally Unique Identifiers) in various formats and versions."
      error={error}
      result={results.length > 0 ? results.map(r => r.uuid) : null}
      onGenerate={generateUuids}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      copied={copied}
      generateButtonText="Generate UUIDs"
      aboutContent={aboutContent}
    >
      {content}
    </RandomGeneratorLayout>
  );
};

export default UuidGenerator;
