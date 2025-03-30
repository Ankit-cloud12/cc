import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import RandomGeneratorLayout from "./RandomGeneratorLayout";

interface IpAddressResult {
  ipAddress: string;
  version: string;
  type: string;
  cidr?: string;
}

const RandomIpAddressGenerator = () => {
  const [count, setCount] = useState<number>(5);
  const [ipVersion, setIpVersion] = useState<string>("ipv4");
  const [ipType, setIpType] = useState<string>("all");
  const [includeCidr, setIncludeCidr] = useState<boolean>(false);
  const [cidrRangeMin, setCidrRangeMin] = useState<number>(1);
  const [cidrRangeMax, setCidrRangeMax] = useState<number>(32);
  const [customSubnet, setCustomSubnet] = useState<string>("");
  const [useCustomSubnet, setUseCustomSubnet] = useState<boolean>(false);
  const [results, setResults] = useState<IpAddressResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Get a random integer between min and max (inclusive)
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Generate random IPv4 address
  const generateRandomIPv4 = (type: string = "all", customSubnetValue: string = ""): string => {
    if (useCustomSubnet && customSubnetValue) {
      // Parse the custom subnet
      const parts = customSubnetValue.split('.');
      
      if (parts.length !== 4) {
        throw new Error("IPv4 subnet must have 4 octets");
      }
      
      let result = "";
      for (let i = 0; i < 4; i++) {
        const part = parts[i];
        
        // If the part is a specific number, use it
        // If it's an asterisk (*) or x, generate a random octet
        if (part === "*" || part.toLowerCase() === "x") {
          result += getRandomInt(0, 255);
        } else if (part.includes("-")) {
          // If it's a range (e.g., 10-50)
          const [min, max] = part.split("-").map(Number);
          if (isNaN(min) || isNaN(max) || min < 0 || max > 255 || min > max) {
            throw new Error(`Invalid octet range in subnet: ${part}`);
          }
          result += getRandomInt(min, max);
        } else {
          // If it's a specific number
          const num = parseInt(part);
          if (isNaN(num) || num < 0 || num > 255) {
            throw new Error(`Invalid octet in subnet: ${part}`);
          }
          result += num;
        }
        
        if (i < 3) {
          result += ".";
        }
      }
      
      return result;
    }
    
    // Generate random for specific types
    switch (type) {
      case "private":
        const privateRanges = [
          { start: [10, 0, 0, 0], end: [10, 255, 255, 255] },
          { start: [172, 16, 0, 0], end: [172, 31, 255, 255] },
          { start: [192, 168, 0, 0], end: [192, 168, 255, 255] }
        ];
        
        const rangeIndex = getRandomInt(0, privateRanges.length - 1);
        const range = privateRanges[rangeIndex];
        
        const ipParts = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
          ipParts[i] = getRandomInt(range.start[i], range.end[i]);
        }
        
        return ipParts.join(".");

      case "public":
        let validIpv4 = false;
        let publicIp = "";
        
        while (!validIpv4) {
          const firstOctet = getRandomInt(1, 255);
          const secondOctet = getRandomInt(0, 255);
          const thirdOctet = getRandomInt(0, 255);
          const fourthOctet = getRandomInt(0, 255);
          
          // Check if this is not a private or reserved IP
          if (
            // Not 10.x.x.x
            firstOctet !== 10 &&
            // Not 172.16.x.x to 172.31.x.x
            !(firstOctet === 172 && (secondOctet >= 16 && secondOctet <= 31)) &&
            // Not 192.168.x.x
            !(firstOctet === 192 && secondOctet === 168) &&
            // Not 127.x.x.x (loopback)
            firstOctet !== 127 &&
            // Not 0.x.x.x
            firstOctet !== 0 &&
            // Not 169.254.x.x (APIPA)
            !(firstOctet === 169 && secondOctet === 254) &&
            // Not 224.x.x.x to 239.x.x.x (multicast)
            !(firstOctet >= 224 && firstOctet <= 239) &&
            // Not 255.255.255.255 (broadcast)
            !(firstOctet === 255 && secondOctet === 255 && thirdOctet === 255 && fourthOctet === 255)
          ) {
            validIpv4 = true;
            publicIp = `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
          }
        }
        
        return publicIp;

      case "loopback":
        return `127.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}`;

      case "link-local":
        return `169.254.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}`;

      case "all":
      default:
        return `${getRandomInt(1, 255)}.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}.${getRandomInt(0, 255)}`;
    }
  };

  // Generate random IPv6 address
  const generateRandomIPv6 = (type: string = "all"): string => {
    const generateHextet = () => {
      return Math.floor(Math.random() * 65536).toString(16).padStart(4, '0');
    };
    
    // Generate random for specific types
    switch (type) {
      case "private":
        // ULA (Unique Local Address) fc00::/7
        const firstByte = getRandomInt(252, 253).toString(16); // fc or fd
        return `${firstByte}${generateHextet().substr(2)}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}`;

      case "link-local":
        // Link-local fe80::/10
        return `fe80:${generateHextet().substr(2)}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}`;

      case "loopback":
        // Loopback ::1
        return "::1";

      case "public":
        let validIpv6 = false;
        let ipv6Address = "";
        
        while (!validIpv6) {
          const firstHextet = generateHextet();
          
          // Ensure it's not a private or special address
          if (
            !(firstHextet.startsWith("fc") || firstHextet.startsWith("fd")) && // Not ULA
            !(firstHextet.startsWith("fe80")) && // Not link-local
            firstHextet !== "0000" && // Not unspecified/loopback
            !firstHextet.startsWith("ff") // Not multicast
          ) {
            validIpv6 = true;
            ipv6Address = `${firstHextet}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}`;
          }
        }
        
        return ipv6Address;

      case "all":
      default:
        return `${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}:${generateHextet()}`;
    }
  };

  // Add CIDR notation
  const addCidrNotation = (ip: string, version: string): string => {
    if (!includeCidr) return ip;

    const cidrMax = version === "ipv4" ? 32 : 128;
    const min = Math.min(cidrRangeMin, cidrMax);
    const max = Math.min(cidrRangeMax, cidrMax);
    
    const cidr = getRandomInt(min, max);
    return `${ip}/${cidr}`;
  };

  const generateRandomIpAddresses = () => {
    try {
      if (count < 1 || count > 100) {
        setError("Number of IP addresses must be between 1 and 100.");
        return;
      }

      if (useCustomSubnet && !customSubnet) {
        setError("Please enter a custom subnet or disable the custom subnet option.");
        return;
      }
      
      if (cidrRangeMin > cidrRangeMax) {
        setError("Minimum CIDR value cannot be greater than maximum CIDR value.");
        return;
      }

      // For IPv4, validate CIDR range
      if (ipVersion === "ipv4" && (cidrRangeMin < 0 || cidrRangeMax > 32)) {
        setError("CIDR range for IPv4 must be between 0 and 32.");
        return;
      }
      
      // For IPv6, validate CIDR range
      if (ipVersion === "ipv6" && (cidrRangeMin < 0 || cidrRangeMax > 128)) {
        setError("CIDR range for IPv6 must be between 0 and 128.");
        return;
      }

      setError("");

      // Generate random IP addresses
      const addresses: IpAddressResult[] = [];
      
      for (let i = 0; i < count; i++) {
        let ipAddress = "";
        let cidr: string | undefined = undefined;

        if (ipVersion === "ipv4") {
          ipAddress = generateRandomIPv4(ipType, customSubnet);
          if (includeCidr) {
            const cidrValue = getRandomInt(cidrRangeMin, cidrRangeMax);
            ipAddress = `${ipAddress}/${cidrValue}`;
            cidr = `/${cidrValue}`;
          }
        } else { // ipVersion === "ipv6"
          ipAddress = generateRandomIPv6(ipType);
          if (includeCidr) {
            const cidrValue = getRandomInt(cidrRangeMin, cidrRangeMax);
            ipAddress = `${ipAddress}/${cidrValue}`;
            cidr = `/${cidrValue}`;
          }
        }
        
        addresses.push({
          ipAddress,
          version: ipVersion === "ipv4" ? "IPv4" : "IPv6",
          type: ipType,
          cidr
        });
      }
      
      setResults(addresses);
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.map(r => r.ipAddress).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([results.map(r => r.ipAddress).join('\n')], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "random-ip-addresses.txt";
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
        This tool generates random IP addresses in both IPv4 and IPv6 formats. You can customize the type of IP addresses generated, including private, public, loopback, and link-local addresses.
      </p>
      <p className="text-gray-300 mb-4">Common uses include:</p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Creating test data for network applications</li>
        <li>Testing IP address validation in software</li>
        <li>Generating sample data for network documentation</li>
        <li>Testing firewall and routing configurations</li>
        <li>Learning about different IP address formats and types</li>
      </ul>
      <p className="text-gray-300">
        Simply set your preferred options, choose how many IP addresses you need, and click the generate button.
      </p>
    </>
  );

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="count">Number of IP Addresses</Label>
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
            <Label className="mb-2 block">IP Version</Label>
            <RadioGroup value={ipVersion} onValueChange={setIpVersion} className="space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="ipv4" value="ipv4" />
                <Label htmlFor="ipv4">IPv4 (e.g., 192.168.1.1)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="ipv6" value="ipv6" />
                <Label htmlFor="ipv6">IPv6 (e.g., 2001:0db8:85a3:0000:0000:8a2e:0370:7334)</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label className="mb-2 block">IP Type</Label>
            <RadioGroup value={ipType} onValueChange={setIpType} className="space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="all" value="all" />
                <Label htmlFor="all">Any (Public or Private)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="public" value="public" />
                <Label htmlFor="public">
                  Public Only 
                  {ipVersion === "ipv4" && " (Non RFC1918)"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="private" value="private" />
                <Label htmlFor="private">
                  Private Only
                  {ipVersion === "ipv4" && " (10.x.x.x, 172.16-31.x.x, 192.168.x.x)"}
                  {ipVersion === "ipv6" && " (ULA fc00::/7)"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="loopback" value="loopback" />
                <Label htmlFor="loopback">
                  Loopback
                  {ipVersion === "ipv4" && " (127.x.x.x)"}
                  {ipVersion === "ipv6" && " (::1)"}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="link-local" value="link-local" />
                <Label htmlFor="link-local">
                  Link-local
                  {ipVersion === "ipv4" && " (169.254.x.x)"}
                  {ipVersion === "ipv6" && " (fe80::/10)"}
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {ipVersion === "ipv4" && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="useCustomSubnet"
                  checked={useCustomSubnet}
                  onCheckedChange={(checked) => setUseCustomSubnet(checked as boolean)}
                />
                <Label htmlFor="useCustomSubnet">
                  Use Custom Subnet Template
                </Label>
              </div>
              
              {useCustomSubnet && (
                <div className="pl-6">
                  <Label htmlFor="customSubnet">Custom Subnet (use * or x for random octets)</Label>
                  <Input
                    id="customSubnet"
                    placeholder="192.168.*.* or 10.x.x.x or 172.16-31.x.x"
                    value={customSubnet}
                    onChange={(e) => setCustomSubnet(e.target.value)}
                    className="bg-zinc-700 text-white border-zinc-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Examples: "192.168.*.*", "10.x.x.x", "172.16-31.x.x" (Use ranges like "1-100" for specific ranges)
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeCidr"
                checked={includeCidr}
                onCheckedChange={(checked) => setIncludeCidr(checked as boolean)}
              />
              <Label htmlFor="includeCidr">
                Include CIDR Notation
              </Label>
            </div>
            
            {includeCidr && (
              <div className="pl-6 space-y-4">
                <Label>CIDR Range: {cidrRangeMin} - {cidrRangeMax}</Label>
                <div className="flex space-x-4 items-center">
                  <span>1</span>
                  <Slider
                    value={[cidrRangeMin, cidrRangeMax]}
                    min={1}
                    max={ipVersion === "ipv4" ? 32 : 128}
                    step={1}
                    onValueChange={(values) => {
                      setCidrRangeMin(values[0]);
                      setCidrRangeMax(values[1]);
                    }}
                    className="flex-1"
                  />
                  <span>{ipVersion === "ipv4" ? 32 : 128}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Label className="mb-2">Generated IP Addresses</Label>
        <div className="min-h-[250px] max-h-[450px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
          {results.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {results.map((result, index) => (
                <li key={index} className="break-words">
                  {result.ipAddress}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">
              Your random IP addresses will appear here
            </p>
          )}
        </div>
        
        <div className="text-sm text-gray-400">
          {results.length > 0 && (
            <p>Generated {results.length} random {ipVersion.toUpperCase()} address{results.length !== 1 ? 'es' : ''}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <RandomGeneratorLayout
      title="Random IP Address Generator"
      description="Generate random IP addresses in IPv4 and IPv6 formats with various options."
      error={error}
      result={results.length > 0 ? results.map(r => r.ipAddress) : null}
      onGenerate={generateRandomIpAddresses}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      copied={copied}
      generateButtonText="Generate IP Addresses"
      aboutContent={aboutContent}
    >
      {content}
    </RandomGeneratorLayout>
  );
};

export default RandomIpAddressGenerator;
