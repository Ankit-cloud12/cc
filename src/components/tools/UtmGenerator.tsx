import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

type CampaignMedium = "cpc" | "email" | "social" | "display" | "banner" | "affiliate" | "referral" | "custom";
type CampaignSource = "google" | "facebook" | "twitter" | "linkedin" | "instagram" | "newsletter" | "custom";
type ValidationType = "success" | "warning" | "error" | "none";

interface UtmParams {
  campaign_id?: string;
  campaign_source: string;
  campaign_medium: string;
  campaign_name: string;
  campaign_term?: string;
  campaign_content?: string;
}

const UtmGenerator = () => {
  // Base URL
  const [url, setUrl] = useState<string>("");
  const [urlValid, setUrlValid] = useState<ValidationType>("none");
  
  // UTM Parameters
  const [campaignSource, setCampaignSource] = useState<string>("google");
  const [customSource, setCustomSource] = useState<string>("");
  const [campaignMedium, setCampaignMedium] = useState<string>("cpc");
  const [customMedium, setCustomMedium] = useState<string>("");
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignTerm, setCampaignTerm] = useState<string>("");
  const [campaignContent, setCampaignContent] = useState<string>("");
  const [campaignId, setCampaignId] = useState<string>("");
  
  // Generated URL
  const [generatedUrl, setGeneratedUrl] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  
  // URL shortening
  const [shortenUrl, setShortenUrl] = useState<boolean>(false);
  const [shortUrl, setShortUrl] = useState<string>("");
  
  // Validation
  const [error, setError] = useState<string | null>(null);
  
  // History
  const [history, setHistory] = useState<string[]>([]);
  
  // Validate URL
  useEffect(() => {
    if (!url) {
      setUrlValid("none");
      return;
    }
    
    try {
      const urlObj = new URL(url);
      if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
        setUrlValid("success");
      } else {
        setUrlValid("warning");
      }
    } catch (e) {
      setUrlValid("error");
    }
  }, [url]);
  
  // Generate the UTM URL
  const generateUtmUrl = () => {
    setError(null);
    
    // Validate URL
    if (!url) {
      setError("Please enter a valid URL");
      return;
    }
    
    try {
      const urlObj = new URL(url);
      
      if (!campaignName) {
        setError("Campaign Name is required");
        return;
      }
      
      // Get source value
      const sourceValue = campaignSource === "custom" ? customSource : campaignSource;
      if (!sourceValue) {
        setError("Campaign Source is required");
        return;
      }
      
      // Get medium value
      const mediumValue = campaignMedium === "custom" ? customMedium : campaignMedium;
      if (!mediumValue) {
        setError("Campaign Medium is required");
        return;
      }
      
      // Build UTM parameters
      const utmParams: UtmParams = {
        campaign_source: sourceValue,
        campaign_medium: mediumValue,
        campaign_name: campaignName,
      };
      
      // Add optional parameters
      if (campaignTerm) utmParams.campaign_term = campaignTerm;
      if (campaignContent) utmParams.campaign_content = campaignContent;
      if (campaignId) utmParams.campaign_id = campaignId;
      
      // Apply UTM parameters
      Object.entries(utmParams).forEach(([key, value]) => {
        urlObj.searchParams.set(`utm_${key}`, value);
      });
      
      const result = urlObj.toString();
      setGeneratedUrl(result);
      
      // Add to history
      setHistory(prev => [result, ...prev.slice(0, 4)]);
      
      // Reset shortening
      setShortUrl("");
      
    } catch (e) {
      setError("Invalid URL format");
    }
  };
  
  // Copy URL to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // For demo purposes, this simulates URL shortening
  // In a real implementation, this would call an actual API service
  const simulateUrlShortening = () => {
    if (!generatedUrl) return;
    
    // Show loading state
    setShortUrl("Shortening...");
    
    // Simulate API call delay
    setTimeout(() => {
      // Create a simple hash (for demo only)
      const hash = Math.random().toString(36).substring(2, 8);
      setShortUrl(`https://short.url/${hash}`);
    }, 800);
  };
  
  // Handle URL shortening request
  useEffect(() => {
    if (shortenUrl && generatedUrl && !shortUrl) {
      simulateUrlShortening();
    }
    if (!shortenUrl) {
      setShortUrl("");
    }
  }, [shortenUrl, generatedUrl]);
  
  // Reset all fields
  const handleReset = () => {
    setUrl("");
    setCampaignSource("google");
    setCustomSource("");
    setCampaignMedium("cpc");
    setCustomMedium("");
    setCampaignName("");
    setCampaignTerm("");
    setCampaignContent("");
    setCampaignId("");
    setGeneratedUrl("");
    setShortUrl("");
    setShortenUrl(false);
    setError(null);
  };
  
  // Load sample values
  const loadExample = (example: string) => {
    handleReset();
    
    switch (example) {
      case "google-ad":
        setUrl("https://www.example.com/product");
        setCampaignSource("google");
        setCampaignMedium("cpc");
        setCampaignName("spring_sale");
        setCampaignTerm("buy+shoes+online");
        setCampaignContent("textad_variant1");
        break;
      case "email":
        setUrl("https://www.example.com/newsletter");
        setCampaignSource("newsletter");
        setCampaignMedium("email");
        setCampaignName("weekly_digest");
        setCampaignContent("header_link");
        break;
      case "social":
        setUrl("https://www.example.com/promo");
        setCampaignSource("facebook");
        setCampaignMedium("social");
        setCampaignName("summer_contest");
        setCampaignContent("sponsored_post");
        break;
      default:
        break;
    }
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">UTM Generator</h1>
      <p className="text-gray-300 mb-6">
        Create UTM tracking parameters for your marketing campaigns.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Input Form */}
        <div>
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>
                Enter your URL and campaign information
              </CardDescription>
              <div className="flex gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample("google-ad")}
                >
                  Google Ad
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample("email")}
                >
                  Email
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={() => loadExample("social")}
                >
                  Social
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="url" className="mb-2 block">Website URL <span className="text-red-500">*</span></Label>
                <div className={`relative ${
                  urlValid === "error" ? "border-red-500" :
                  urlValid === "warning" ? "border-yellow-500" : 
                  urlValid === "success" ? "border-green-500" : ""
                }`}>
                  <Input
                    id="url"
                    className="w-full bg-zinc-700 text-white border-zinc-600"
                    placeholder="https://www.example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  {urlValid !== "none" && (
                    <div className="absolute right-3 top-3">
                      {urlValid === "error" && (
                        <div className="h-2 w-2 rounded-full bg-red-500"></div>
                      )}
                      {urlValid === "warning" && (
                        <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                      )}
                      {urlValid === "success" && (
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      )}
                    </div>
                  )}
                </div>
                {urlValid === "error" && (
                  <div className="text-xs text-red-500 mt-1">
                    Please enter a valid URL (including http:// or https://)
                  </div>
                )}
                {urlValid === "warning" && (
                  <div className="text-xs text-yellow-500 mt-1">
                    URL protocol should be http:// or https://
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign-source" className="mb-2 block">Campaign Source <span className="text-red-500">*</span></Label>
                  <Select
                    value={campaignSource}
                    onValueChange={setCampaignSource}
                  >
                    <SelectTrigger id="campaign-source" className="w-full bg-zinc-700 border-zinc-600">
                      <SelectValue placeholder="Select campaign source" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 border-zinc-600">
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="newsletter">Newsletter</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {campaignSource === "custom" && (
                    <Input
                      className="w-full mt-2 bg-zinc-700 text-white border-zinc-600"
                      placeholder="Enter custom source"
                      value={customSource}
                      onChange={(e) => setCustomSource(e.target.value)}
                    />
                  )}
                </div>
                
                <div>
                  <Label htmlFor="campaign-medium" className="mb-2 block">Campaign Medium <span className="text-red-500">*</span></Label>
                  <Select
                    value={campaignMedium}
                    onValueChange={setCampaignMedium}
                  >
                    <SelectTrigger id="campaign-medium" className="w-full bg-zinc-700 border-zinc-600">
                      <SelectValue placeholder="Select campaign medium" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 border-zinc-600">
                      <SelectItem value="cpc">CPC</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="social">Social</SelectItem>
                      <SelectItem value="display">Display</SelectItem>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="affiliate">Affiliate</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  {campaignMedium === "custom" && (
                    <Input
                      className="w-full mt-2 bg-zinc-700 text-white border-zinc-600"
                      placeholder="Enter custom medium"
                      value={customMedium}
                      onChange={(e) => setCustomMedium(e.target.value)}
                    />
                  )}
                </div>
              </div>
              
              <div>
                <Label htmlFor="campaign-name" className="mb-2 block">Campaign Name <span className="text-red-500">*</span></Label>
                <Input
                  id="campaign-name"
                  className="w-full bg-zinc-700 text-white border-zinc-600"
                  placeholder="e.g. spring_sale, product_launch"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="campaign-term" className="mb-2 block">Campaign Term</Label>
                  <Input
                    id="campaign-term"
                    className="w-full bg-zinc-700 text-white border-zinc-600"
                    placeholder="e.g. running+shoes"
                    value={campaignTerm}
                    onChange={(e) => setCampaignTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <Label htmlFor="campaign-content" className="mb-2 block">Campaign Content</Label>
                  <Input
                    id="campaign-content"
                    className="w-full bg-zinc-700 text-white border-zinc-600"
                    placeholder="e.g. top_banner, text_link"
                    value={campaignContent}
                    onChange={(e) => setCampaignContent(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="campaign-id" className="mb-2 block">Campaign ID</Label>
                <Input
                  id="campaign-id"
                  className="w-full bg-zinc-700 text-white border-zinc-600"
                  placeholder="e.g. abc123"
                  value={campaignId}
                  onChange={(e) => setCampaignId(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="shorten-url" 
                  checked={shortenUrl}
                  onCheckedChange={(checked) => setShortenUrl(!!checked)}
                />
                <Label htmlFor="shorten-url" className="cursor-pointer text-gray-300">
                  Shorten the generated URL
                </Label>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={generateUtmUrl}
                >
                  Generate URL
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
                  onClick={handleReset}
                >
                  Clear All
                </Button>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column - Results */}
        <div className="space-y-6">
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle>Generated URL</CardTitle>
              <CardDescription>
                Copy and use this URL for your marketing campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedUrl ? (
                <div className="space-y-4">
                  <div className="bg-zinc-700 p-3 rounded-md border border-zinc-600 break-all font-mono text-sm">
                    {generatedUrl}
                  </div>
                  
                  {shortenUrl && shortUrl && shortUrl !== "Shortening..." && (
                    <div>
                      <Label className="mb-1 block">Shortened URL</Label>
                      <div className="bg-zinc-700 p-3 rounded-md border border-zinc-600 break-all font-mono text-sm">
                        {shortUrl}
                      </div>
                    </div>
                  )}
                  
                  {shortenUrl && shortUrl === "Shortening..." && (
                    <div className="bg-zinc-700 p-3 rounded-md border border-zinc-600 text-gray-400">
                      {shortUrl}
                    </div>
                  )}
                  
                  <Button
                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white"
                    onClick={() => copyToClipboard(shortUrl && shortUrl !== "Shortening..." ? shortUrl : generatedUrl)}
                  >
                    {copied ? "Copied!" : "Copy to Clipboard"}
                  </Button>
                </div>
              ) : (
                <div className="bg-zinc-700 p-4 rounded-md text-center text-gray-400">
                  Generated URL will appear here
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
              <CardTitle>UTM Parameters</CardTitle>
              <CardDescription>
                What these parameters mean
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="required">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="required">Required</TabsTrigger>
                  <TabsTrigger value="optional">Optional</TabsTrigger>
                </TabsList>
                
                <TabsContent value="required" className="mt-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">utm_source</div>
                      <div className="text-gray-400 text-sm">
                        Identifies which site sent the traffic (e.g., google, newsletter, facebook)
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">utm_medium</div>
                      <div className="text-gray-400 text-sm">
                        The marketing medium (e.g., cpc, email, social, banner)
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">utm_campaign</div>
                      <div className="text-gray-400 text-sm">
                        The campaign name, slogan, promo code, etc. (e.g., spring_sale)
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="optional" className="mt-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-medium">utm_term</div>
                      <div className="text-gray-400 text-sm">
                        Identifies search terms (e.g., running+shoes, marketing+software)
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">utm_content</div>
                      <div className="text-gray-400 text-sm">
                        Differentiates ads or links that point to the same URL (e.g., logo_link, text_link)
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">utm_id</div>
                      <div className="text-gray-400 text-sm">
                        Campaign ID for easier tracking across multiple systems
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {history.length > 0 && (
            <Card className="bg-zinc-800 border-zinc-700">
              <CardHeader>
                <CardTitle>Recent URLs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {history.map((url, index) => (
                    <div 
                      key={index}
                      className="bg-zinc-700 p-2 rounded-md text-sm break-all cursor-pointer hover:bg-zinc-600"
                      onClick={() => copyToClipboard(url)}
                    >
                      {url}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* About Section */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About UTM Parameters</h2>
        <p className="text-gray-300 mb-4">
          UTM parameters are tags added to URLs to track the effectiveness of digital marketing campaigns.
          They help identify which campaigns and channels are driving traffic to your website.
        </p>
        <p className="text-gray-300 mb-4">
          When you add UTM parameters to your URLs and share them in marketing campaigns,
          the data is captured by analytics tools like Google Analytics, allowing you to see which campaigns
          are most effective at driving traffic and conversions.
        </p>
        <h3 className="text-lg font-bold mb-2">Best Practices</h3>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li><strong>Be consistent:</strong> Use a consistent naming convention for your parameters</li>
          <li><strong>Use lowercase:</strong> UTM parameters are case-sensitive, so stick to lowercase</li>
          <li><strong>Avoid spaces:</strong> Use underscores or hyphens instead of spaces</li>
          <li><strong>Keep it simple:</strong> Don't make your URLs too long or complex</li>
          <li><strong>Document your naming conventions:</strong> Create a reference guide for your team</li>
        </ul>
        <h3 className="text-lg font-bold mb-2">Common UTM Parameter Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-md font-bold mb-1">Campaign Sources</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>google, bing, yahoo (search engines)</li>
              <li>facebook, twitter, instagram (social platforms)</li>
              <li>newsletter, email (email campaigns)</li>
              <li>partner, affiliate (referral sources)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-bold mb-1">Campaign Mediums</h4>
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              <li>cpc (paid search)</li>
              <li>organic (organic search)</li>
              <li>email (email campaigns)</li>
              <li>social, social-paid (social media)</li>
              <li>display, banner (display advertising)</li>
              <li>referral (referral traffic)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UtmGenerator;
