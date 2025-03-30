import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolLayout } from "./ToolLayout";

const ApaFormatConverter = () => {
  // Source type state
  const [sourceType, setSourceType] = useState<"website" | "book" | "journal">("website");
  
  // Common field states
  const [authors, setAuthors] = useState("");
  const [year, setYear] = useState("");
  const [title, setTitle] = useState("");
  
  // Website specific fields
  const [websiteName, setWebsiteName] = useState("");
  const [url, setUrl] = useState("");
  const [accessedDate, setAccessedDate] = useState("");
  
  // Book specific fields
  const [publisher, setPublisher] = useState("");
  const [edition, setEdition] = useState("");
  const [location, setLocation] = useState("");
  
  // Journal specific fields
  const [journalName, setJournalName] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [pages, setPages] = useState("");
  const [doi, setDoi] = useState("");
  
  // Output states
  const [referenceEntry, setReferenceEntry] = useState("");
  const [inTextCitation, setInTextCitation] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("format");
  const [infoTab, setInfoTab] = useState("guide");

  // Reset fields when source type changes
  useEffect(() => {
    clearFields();
  }, [sourceType]);

  const clearFields = () => {
    setAuthors("");
    setYear("");
    setTitle("");
    setWebsiteName("");
    setUrl("");
    setAccessedDate("");
    setPublisher("");
    setEdition("");
    setLocation("");
    setJournalName("");
    setVolume("");
    setIssue("");
    setPages("");
    setDoi("");
    setReferenceEntry("");
    setInTextCitation("");
  };

  const formatAuthors = (authorString: string) => {
    if (!authorString) return "";
    
    const authors = authorString.split(",").map(author => author.trim());
    
    if (authors.length === 1) {
      // Split the name into last name and first name/initials
      const nameParts = authors[0].split(" ");
      if (nameParts.length < 2) return authors[0];
      
      const lastName = nameParts.pop() || "";
      const firstNames = nameParts.join(" ");
      
      // Format as "Last name, F."
      return `${lastName}, ${firstNames.charAt(0)}.`;
    } else {
      // Format multiple authors
      return authors.map(author => {
        const nameParts = author.split(" ");
        if (nameParts.length < 2) return author;
        
        const lastName = nameParts.pop() || "";
        const firstNames = nameParts.join(" ");
        
        return `${lastName}, ${firstNames.charAt(0)}.`;
      }).join(", ");
    }
  };

  const generateCitation = () => {
    let reference = "";
    let inText = "";

    const formattedAuthors = formatAuthors(authors);

    switch (sourceType) {
      case "website":
        // Website citation format
        reference = formatApaWebsite(formattedAuthors);
        inText = formatInTextCitation(formattedAuthors);
        break;
      case "book":
        // Book citation format
        reference = formatApaBook(formattedAuthors);
        inText = formatInTextCitation(formattedAuthors);
        break;
      case "journal":
        // Journal article citation format
        reference = formatApaJournal(formattedAuthors);
        inText = formatInTextCitation(formattedAuthors);
        break;
    }

    setReferenceEntry(reference);
    setInTextCitation(inText);
  };

  const formatApaWebsite = (formattedAuthors: string) => {
    const authorText = formattedAuthors ? `${formattedAuthors}` : "";
    const yearText = year ? ` (${year}).` : "";
    const titleText = title ? ` ${title}.` : "";
    const websiteText = websiteName ? ` ${websiteName}.` : "";
    const urlText = url ? ` ${url}` : "";
    
    return `${authorText}${yearText}${titleText}${websiteText}${urlText}`;
  };

  const formatApaBook = (formattedAuthors: string) => {
    const authorText = formattedAuthors ? `${formattedAuthors}` : "";
    const yearText = year ? ` (${year}).` : "";
    const titleText = title ? ` ${title}` : "";
    const editionText = edition ? ` (${edition} ed.).` : ".";
    const locationText = location ? ` ${location}:` : "";
    const publisherText = publisher ? ` ${publisher}.` : "";
    
    return `${authorText}${yearText}${titleText}${editionText}${locationText}${publisherText}`;
  };

  const formatApaJournal = (formattedAuthors: string) => {
    const authorText = formattedAuthors ? `${formattedAuthors}` : "";
    const yearText = year ? ` (${year}).` : "";
    const titleText = title ? ` ${title}.` : "";
    const journalText = journalName ? ` ${journalName},` : "";
    const volumeText = volume ? ` ${volume}` : "";
    const issueText = issue ? `(${issue}),` : ",";
    const pagesText = pages ? ` ${pages}.` : "";
    const doiText = doi ? ` ${doi}` : "";
    
    return `${authorText}${yearText}${titleText}${journalText}${volumeText}${issueText}${pagesText}${doiText}`;
  };

  const formatInTextCitation = (formattedAuthors: string) => {
    if (!formattedAuthors && !year) {
      return "No author or year provided";
    }
    
    // Extract last name for in-text citation
    let lastNames;
    if (formattedAuthors) {
      const authorParts = formattedAuthors.split(",");
      lastNames = authorParts[0];
      
      // If there are multiple authors
      if (formattedAuthors.includes("&")) {
        const multiAuthors = formattedAuthors.split("&");
        const lastAuthor = multiAuthors[multiAuthors.length - 1].trim();
        const lastAuthorLastName = lastAuthor.split(",")[0];
        
        if (multiAuthors.length > 2) {
          lastNames = `${lastNames} et al.`;
        } else {
          lastNames = `${lastNames} & ${lastAuthorLastName}`;
        }
      }
    } else {
      lastNames = "Author";
    }
    
    return year ? `(${lastNames}, ${year})` : `(${lastNames}, n.d.)`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleDownload = () => {
    if (!referenceEntry && !inTextCitation) return;
    
    const downloadText = `APA Citation\n\nReference List Entry:\n${referenceEntry}\n\nIn-Text Citation:\n${inTextCitation}`;
    
    const element = document.createElement("a");
    const file = new Blob([downloadText], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "apa-citation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <ToolLayout title="APA Format Converter & Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-2">APA Format Converter & Generator</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Generate correctly formatted APA 7th Edition citations for your research papers.
        </p>

        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Input Column */}
          <div className="w-full md:w-3/5">
            <Card className="p-4 bg-zinc-800 border-zinc-700 mb-4">
              {/* Source Type Selection */}
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-3">Select Source Type</h2>
                <RadioGroup
                  value={sourceType}
                  onValueChange={(value: any) => setSourceType(value)}
                  className="flex flex-wrap gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="website" id="website" />
                    <Label htmlFor="website">Website</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="book" id="book" />
                    <Label htmlFor="book">Book</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="journal" id="journal" />
                    <Label htmlFor="journal">Journal Article</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Common Fields */}
              <div className="bg-zinc-700 p-4 rounded-md mb-4">
                <h2 className="text-lg font-semibold mb-3">Author & General Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="authors" className="block mb-2">
                      Author(s) <span className="text-gray-400 text-sm">(separate multiple with commas)</span>
                    </Label>
                    <Input
                      id="authors"
                      placeholder="e.g., John Smith, Jane Doe"
                      value={authors}
                      onChange={(e) => setAuthors(e.target.value)}
                      className="bg-zinc-600 text-white border-zinc-500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="year" className="block mb-2">
                      Publication Year
                    </Label>
                    <Input
                      id="year"
                      placeholder="e.g., 2023"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="bg-zinc-600 text-white border-zinc-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <Label htmlFor="title" className="block mb-2">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Enter title of the source"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-zinc-600 text-white border-zinc-500"
                  />
                </div>
              </div>

              {/* Website Specific Fields */}
              {sourceType === "website" && (
                <div className="bg-zinc-700 p-4 rounded-md mb-4">
                  <h2 className="text-lg font-semibold mb-3">Website Specific Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="websiteName" className="block mb-2">
                        Website Name
                      </Label>
                      <Input
                        id="websiteName"
                        placeholder="e.g., The New York Times"
                        value={websiteName}
                        onChange={(e) => setWebsiteName(e.target.value)}
                        className="bg-zinc-600 text-white border-zinc-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="accessedDate" className="block mb-2">
                        Date Accessed
                      </Label>
                      <Input
                        id="accessedDate"
                        placeholder="e.g., March 21, 2023"
                        value={accessedDate}
                        onChange={(e) => setAccessedDate(e.target.value)}
                        className="bg-zinc-600 text-white border-zinc-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="url" className="block mb-2">
                      URL
                    </Label>
                    <Input
                      id="url"
                      placeholder="e.g., https://www.example.com/article"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-zinc-600 text-white border-zinc-500"
                    />
                  </div>
                </div>
              )}

              {/* Book Specific Fields */}
              {sourceType === "book" && (
                <div className="bg-zinc-700 p-4 rounded-md mb-4">
                  <h2 className="text-lg font-semibold mb-3">Book Specific Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="publisher" className="block mb-2">
                        Publisher
                      </Label>
                      <Input
                        id="publisher"
                        placeholder="e.g., Oxford University Press"
                        value={publisher}
                        onChange={(e) => setPublisher(e.target.value)}
                        className="bg-zinc-600 text-white border-zinc-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edition" className="block mb-2">
                        Edition <span className="text-gray-400 text-sm">(if applicable)</span>
                      </Label>
                      <Input
                        id="edition"
                        placeholder="e.g., 2nd"
                        value={edition}
                        onChange={(e) => setEdition(e.target.value)}
                        className="bg-zinc-600 text-white border-zinc-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="location" className="block mb-2">
                      Publisher Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="e.g., New York, NY"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="bg-zinc-600 text-white border-zinc-500"
                    />
                  </div>
                </div>
              )}

              {/* Journal Specific Fields */}
              {sourceType === "journal" && (
                <div className="bg-zinc-700 p-4 rounded-md mb-4">
                  <h2 className="text-lg font-semibold mb-3">Journal Article Specific Information</h2>
                  
                  <div className="mb-4">
                    <Label htmlFor="journalName" className="block mb-2">
                      Journal Name
                    </Label>
                    <Input
                      id="journalName"
                      placeholder="e.g., Journal of Psychology"
                      value={journalName}
                      onChange={(e) => setJournalName(e.target.value)}
                      className="bg-zinc-600 text-white border-zinc-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <Label htmlFor="volume" className="block mb-2">
                        Volume
                      </Label>
                      <Input
                        id="volume"
                        placeholder="e.g., 42"
                        value={volume}
                        onChange={(e) => setVolume(e.target.value)}
                        className="bg-zinc-600 text-white border-zinc-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="issue" className="block mb-2">
                        Issue
                      </Label>
                      <Input
                        id="issue"
                        placeholder="e.g., 3"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        className="bg-zinc-600 text-white border-zinc-500"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pages" className="block mb-2">
                        Pages
                      </Label>
                      <Input
                        id="pages"
                        placeholder="e.g., 123-145"
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        className="bg-zinc-600 text-white border-zinc-500"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Label htmlFor="doi" className="block mb-2">
                      DOI or URL
                    </Label>
                    <Input
                      id="doi"
                      placeholder="e.g., https://doi.org/10.1000/xyz123"
                      value={doi}
                      onChange={(e) => setDoi(e.target.value)}
                      className="bg-zinc-600 text-white border-zinc-500"
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div>
                <Button
                  onClick={generateCitation}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4"
                >
                  Generate APA Citation
                </Button>
              </div>
            </Card>
          </div>
          
          {/* Output Column */}
          <div className="w-full md:w-2/5 flex flex-col">
            <Card className="p-4 bg-zinc-800 border-zinc-700 mb-4">
              <h2 className="text-lg font-semibold mb-3">References List Entry</h2>
              <div className="relative">
                <Textarea
                  readOnly
                  value={referenceEntry}
                  placeholder="Your APA reference will appear here..."
                  className="w-full min-h-[100px] bg-zinc-700 text-white border-zinc-600 p-4 mb-4"
                />
              </div>
              
              <h2 className="text-lg font-semibold mb-3">In-Text Citation</h2>
              <div className="relative">
                <Textarea
                  readOnly
                  value={inTextCitation}
                  placeholder="Your in-text citation will appear here..."
                  className="w-full min-h-[50px] bg-zinc-700 text-white border-zinc-600 p-4 mb-4"
                />
              </div>
              
              {/* Actions Row - Right aligned */}
              <div className="flex flex-wrap gap-2 mb-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => handleCopy(referenceEntry + "\n\n" + inTextCitation)}
                  disabled={!referenceEntry && !inTextCitation}
                  className="border-zinc-600"
                >
                  {copied ? "Copied!" : "Copy to Clipboard"}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleDownload}
                  disabled={!referenceEntry && !inTextCitation}
                  className="border-zinc-600"
                >
                  Download
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearFields}
                  className="border-zinc-600"
                >
                  Clear All
                </Button>
              </div>
            </Card>
          </div>
        </div>
        
        {/* Information Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="mb-2 bg-zinc-800">
            <TabsTrigger value="format" className="data-[state=active]:bg-zinc-700">APA Format Guide</TabsTrigger>
            <TabsTrigger value="about" className="data-[state=active]:bg-zinc-700">About This Tool</TabsTrigger>
            <TabsTrigger value="tips" className="data-[state=active]:bg-zinc-700">Usage Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="format" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-3">APA 7th Edition Quick Guide</h3>
            <div className="space-y-4">
              <p>
                <strong>General format for references:</strong>
              </p>
              <p className="pl-4">Author, A. A. (Year). Title of work. Source.</p>
              
              <p>
                <strong>In-text citations:</strong>
              </p>
              <ul className="list-disc pl-8 space-y-1">
                <li>One author: (Smith, 2020)</li>
                <li>Two authors: (Smith & Jones, 2020)</li>
                <li>Three or more authors: (Smith et al., 2020)</li>
                <li>No date: (Smith, n.d.)</li>
              </ul>
              
              <p>
                <strong>Tips for APA formatting:</strong>
              </p>
              <ul className="list-disc pl-8 space-y-1">
                <li>Italicize book titles, journal names, and volume numbers</li>
                <li>Only capitalize the first word of titles and subtitles, plus proper nouns</li>
                <li>For journal articles, include the DOI when available</li>
                <li>Arrange references alphabetically by the author's last name</li>
              </ul>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">About APA Format Generator</h3>
            <p className="mb-4">
              This tool helps you create properly formatted citations in the American Psychological Association (APA) 7th Edition style, 
              which is widely used in the social sciences, education, and other fields.
            </p>
            <p className="mb-4">
              Our APA citation generator creates:
            </p>
            <ul className="list-disc pl-5 space-y-1 mb-4">
              <li>Reference list entries for different source types</li>
              <li>In-text citations formatted according to APA guidelines</li>
              <li>Support for websites, books, and journal articles</li>
              <li>Properly formatted author names, dates, and titles</li>
            </ul>
            <p>
              Using our APA citation tool ensures that your references are consistent and follow the latest APA style guidelines,
              helping you avoid plagiarism and properly credit the sources you've used in your research.
            </p>
          </TabsContent>
          
          <TabsContent value="tips" className="p-4 bg-zinc-800 rounded-md border border-zinc-700">
            <h3 className="font-medium mb-2">Usage Tips</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>First, select the type of source you want to cite (website, book, or journal article)</li>
              <li>Enter the author names exactly as they appear on the source, separated by commas</li>
              <li>Include the full title with proper capitalization (only capitalize first word and proper nouns)</li>
              <li>For websites, include the full URL and the date you accessed the site if the content might change</li>
              <li>For books, specify the edition if it's not the first edition</li>
              <li>For journal articles, the DOI (Digital Object Identifier) is preferred over a URL when available</li>
              <li>After filling in all relevant fields, click "Generate APA Citation" to create your citation</li>
              <li>Copy both the reference list entry and in-text citation for your paper</li>
            </ul>
            <p className="text-sm text-gray-400">
              Note: While this tool follows APA 7th Edition guidelines, always double-check your citations against the
              official APA Publication Manual for specific cases or complex sources.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </ToolLayout>
  );
};

export default ApaFormatConverter;
