import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RandomGeneratorLayout from "./RandomGeneratorLayout";

interface MonthResult {
  number: number;
  name: string;
  shortName: string;
  season: string;
  days: number;
  formatted: string;
}

const RandomMonthGenerator = () => {
  const [count, setCount] = useState<number>(5);
  const [format, setFormat] = useState<string>("name");
  const [language, setLanguage] = useState<string>("english");
  const [seasonFilter, setSeasonFilter] = useState<string>("all");
  const [includeYear, setIncludeYear] = useState<boolean>(false);
  const [yearRangeStart, setYearRangeStart] = useState<number>(1950);
  const [yearRangeEnd, setYearRangeEnd] = useState<number>(2050);
  const [results, setResults] = useState<MonthResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // Month data
  const monthsData = {
    english: [
      { name: "January", shortName: "Jan", season: "winter", days: 31 },
      { name: "February", shortName: "Feb", season: "winter", days: 28 },
      { name: "March", shortName: "Mar", season: "spring", days: 31 },
      { name: "April", shortName: "Apr", season: "spring", days: 30 },
      { name: "May", shortName: "May", season: "spring", days: 31 },
      { name: "June", shortName: "Jun", season: "summer", days: 30 },
      { name: "July", shortName: "Jul", season: "summer", days: 31 },
      { name: "August", shortName: "Aug", season: "summer", days: 31 },
      { name: "September", shortName: "Sep", season: "fall", days: 30 },
      { name: "October", shortName: "Oct", season: "fall", days: 31 },
      { name: "November", shortName: "Nov", season: "fall", days: 30 },
      { name: "December", shortName: "Dec", season: "winter", days: 31 }
    ],
    spanish: [
      { name: "Enero", shortName: "Ene", season: "invierno", days: 31 },
      { name: "Febrero", shortName: "Feb", season: "invierno", days: 28 },
      { name: "Marzo", shortName: "Mar", season: "primavera", days: 31 },
      { name: "Abril", shortName: "Abr", season: "primavera", days: 30 },
      { name: "Mayo", shortName: "May", season: "primavera", days: 31 },
      { name: "Junio", shortName: "Jun", season: "verano", days: 30 },
      { name: "Julio", shortName: "Jul", season: "verano", days: 31 },
      { name: "Agosto", shortName: "Ago", season: "verano", days: 31 },
      { name: "Septiembre", shortName: "Sep", season: "otoño", days: 30 },
      { name: "Octubre", shortName: "Oct", season: "otoño", days: 31 },
      { name: "Noviembre", shortName: "Nov", season: "otoño", days: 30 },
      { name: "Diciembre", shortName: "Dic", season: "invierno", days: 31 }
    ],
    french: [
      { name: "Janvier", shortName: "Jan", season: "hiver", days: 31 },
      { name: "Février", shortName: "Fév", season: "hiver", days: 28 },
      { name: "Mars", shortName: "Mar", season: "printemps", days: 31 },
      { name: "Avril", shortName: "Avr", season: "printemps", days: 30 },
      { name: "Mai", shortName: "Mai", season: "printemps", days: 31 },
      { name: "Juin", shortName: "Jun", season: "été", days: 30 },
      { name: "Juillet", shortName: "Jul", season: "été", days: 31 },
      { name: "Août", shortName: "Aou", season: "été", days: 31 },
      { name: "Septembre", shortName: "Sep", season: "automne", days: 30 },
      { name: "Octobre", shortName: "Oct", season: "automne", days: 31 },
      { name: "Novembre", shortName: "Nov", season: "automne", days: 30 },
      { name: "Décembre", shortName: "Déc", season: "hiver", days: 31 }
    ]
  };

  const seasonMap = {
    english: { winter: "winter", spring: "spring", summer: "summer", fall: "fall" },
    spanish: { winter: "invierno", spring: "primavera", summer: "verano", fall: "otoño" },
    french: { winter: "hiver", spring: "printemps", summer: "été", fall: "automne" }
  };

  const generateRandomMonths = () => {
    try {
      if (count < 1 || count > 100) {
        setError("Number of months must be between 1 and 100.");
        return;
      }

      if (includeYear && (yearRangeStart > yearRangeEnd)) {
        setError("Start year cannot be greater than end year.");
        return;
      }

      setError("");

      const months = monthsData[language as keyof typeof monthsData] || monthsData.english;
      
      // Filter months by season if needed
      let filteredMonths = [...months];
      if (seasonFilter !== "all") {
        const targetSeason = seasonMap[language as keyof typeof seasonMap]?.[seasonFilter as keyof (typeof seasonMap)["english"]] || seasonFilter;
        filteredMonths = months.filter(month => month.season === targetSeason);
        
        if (filteredMonths.length === 0) {
          setError(`No months found for the selected season: ${seasonFilter}`);
          return;
        }
      }

      // Generate random months
      const selectedMonths: MonthResult[] = [];
      
      for (let i = 0; i < count; i++) {
        const randomMonthIndex = Math.floor(Math.random() * filteredMonths.length);
        const randomMonth = filteredMonths[randomMonthIndex];
        
        let year = "";
        if (includeYear) {
          const randomYear = Math.floor(Math.random() * (yearRangeEnd - yearRangeStart + 1)) + yearRangeStart;
          year = ` ${randomYear}`;
        }
        
        let formattedMonth = "";
        switch (format) {
          case "name":
            formattedMonth = randomMonth.name + year;
            break;
          case "short":
            formattedMonth = randomMonth.shortName + year;
            break;
          case "number":
            // Find the index in the original array to get the correct month number
            const monthIndex = months.findIndex(m => m.name === randomMonth.name);
            formattedMonth = `${(monthIndex + 1).toString().padStart(2, '0')}${year}`;
            break;
          case "season":
            formattedMonth = `${randomMonth.name} (${randomMonth.season})${year}`;
            break;
          default:
            formattedMonth = randomMonth.name + year;
        }
        
        selectedMonths.push({
          number: months.findIndex(m => m.name === randomMonth.name) + 1,
          name: randomMonth.name,
          shortName: randomMonth.shortName,
          season: randomMonth.season,
          days: randomMonth.days,
          formatted: formattedMonth
        });
      }
      
      setResults(selectedMonths);
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.map(result => result.formatted).join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([results.map(result => result.formatted).join('\n')], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "random-months.txt";
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
        This tool generates random months in various formats. It's useful for creating test data, simulating events across seasons, or adding temporal variety to your content.
      </p>
      <p className="text-gray-300 mb-4">Common uses include:</p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Creating test data with monthly distribution</li>
        <li>Selecting random months for event planning</li>
        <li>Generating seasonal data for simulations</li>
        <li>Educational purposes related to calendar systems</li>
        <li>Adding variety to content creation</li>
      </ul>
      <p className="text-gray-300">
        Simply set your preferred options, choose how many months you need, and click the generate button.
      </p>
    </>
  );

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="count">Number of Months</Label>
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
            <Label htmlFor="format" className="mb-2 block">Month Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format" className="bg-zinc-700 text-white border-zinc-600">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                <SelectItem value="name">Full Name (January)</SelectItem>
                <SelectItem value="short">Short Name (Jan)</SelectItem>
                <SelectItem value="number">Number (01)</SelectItem>
                <SelectItem value="season">With Season (January (winter))</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="language" className="mb-2 block">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language" className="bg-zinc-700 text-white border-zinc-600">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="mb-2 block">Season Filter</Label>
            <RadioGroup value={seasonFilter} onValueChange={setSeasonFilter} className="space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="all" value="all" />
                <Label htmlFor="all">All Seasons</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="winter" value="winter" />
                <Label htmlFor="winter">Winter Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="spring" value="spring" />
                <Label htmlFor="spring">Spring Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="summer" value="summer" />
                <Label htmlFor="summer">Summer Only</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="fall" value="fall" />
                <Label htmlFor="fall">Fall/Autumn Only</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeYear"
                checked={includeYear}
                onCheckedChange={(checked) => setIncludeYear(checked as boolean)}
              />
              <Label htmlFor="includeYear">
                Include Random Year
              </Label>
            </div>
            
            {includeYear && (
              <div className="grid grid-cols-2 gap-2 pl-6">
                <div>
                  <Label htmlFor="yearRangeStart">Start Year</Label>
                  <Input
                    id="yearRangeStart"
                    type="number"
                    min="1"
                    max="9999"
                    value={yearRangeStart}
                    onChange={(e) => setYearRangeStart(parseInt(e.target.value) || 1950)}
                    className="bg-zinc-700 text-white border-zinc-600"
                  />
                </div>
                <div>
                  <Label htmlFor="yearRangeEnd">End Year</Label>
                  <Input
                    id="yearRangeEnd"
                    type="number"
                    min="1"
                    max="9999"
                    value={yearRangeEnd}
                    onChange={(e) => setYearRangeEnd(parseInt(e.target.value) || 2050)}
                    className="bg-zinc-700 text-white border-zinc-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Label className="mb-2">Generated Months</Label>
        <div className="min-h-[250px] max-h-[450px] bg-zinc-700 border border-zinc-600 rounded-md p-4 text-white overflow-auto resize-y">
          {results.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {results.map((result, index) => (
                <li key={index} className="break-words">
                  {result.formatted}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">
              Your random months will appear here
            </p>
          )}
        </div>
        
        <div className="text-sm text-gray-400">
          {results.length > 0 && (
            <p>Generated {results.length} random month{results.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <RandomGeneratorLayout
      title="Random Month Generator"
      description="Generate random months with options for format, language, and season filtering."
      error={error}
      result={results.length > 0 ? results.map(r => r.formatted) : null}
      onGenerate={generateRandomMonths}
      onCopy={handleCopy}
      onDownload={handleDownload}
      onReset={handleReset}
      copied={copied}
      generateButtonText="Generate Months"
      aboutContent={aboutContent}
    >
      {content}
    </RandomGeneratorLayout>
  );
};

export default RandomMonthGenerator;
