import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RandomGeneratorLayout from "./RandomGeneratorLayout";
interface DateResult {
  date: Date;
  formatted: string;
  iso: string;
}

const RandomDateGenerator = () => {
  const [startDate, setStartDate] = useState<string>("1970-01-01");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]); // Today
  const [count, setCount] = useState<number>(1);
  const [includeTime, setIncludeTime] = useState<boolean>(false);
  const [format, setFormat] = useState<string>("long");
  const [results, setResults] = useState<DateResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const formatOptions = [
    { value: "short", label: "Short (MM/DD/YYYY)" },
    { value: "long", label: "Long (Month DD, YYYY)" },
    { value: "iso", label: "ISO (YYYY-MM-DD)" },
    { value: "custom", label: "Custom (Based on locale)" },
  ];

  const generateRandomDate = () => {
    try {
      // Validate dates
      const startTimestamp = new Date(startDate).getTime();
      const endTimestamp = new Date(endDate).getTime();
      
      if (isNaN(startTimestamp) || isNaN(endTimestamp)) {
        setError("Please enter valid dates.");
        return;
      }
      
      if (startTimestamp > endTimestamp) {
        setError("Start date cannot be after end date.");
        return;
      }
      
      if (count < 1 || count > 1000) {
        setError("Number of dates must be between 1 and 1000.");
        return;
      }
      
      setError("");
      
      // Generate random dates
      const dates: DateResult[] = [];
      
      for (let i = 0; i < count; i++) {
        // Generate random timestamp between start and end dates
        const randomTimestamp = Math.floor(Math.random() * (endTimestamp - startTimestamp + 1)) + startTimestamp;
        const randomDate = new Date(randomTimestamp);
        
        // If includeTime is false, set time to 00:00:00
        if (!includeTime) {
          randomDate.setHours(0, 0, 0, 0);
        }
        
        // Format the date according to selected format
        let formattedDate = "";
        
        switch (format) {
          case "short":
            formattedDate = `${(randomDate.getMonth() + 1).toString().padStart(2, '0')}/${randomDate.getDate().toString().padStart(2, '0')}/${randomDate.getFullYear()}`;
            if (includeTime) {
              formattedDate += ` ${randomDate.getHours().toString().padStart(2, '0')}:${randomDate.getMinutes().toString().padStart(2, '0')}:${randomDate.getSeconds().toString().padStart(2, '0')}`;
            }
            break;
          case "long":
            const months = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            formattedDate = `${months[randomDate.getMonth()]} ${randomDate.getDate()}, ${randomDate.getFullYear()}`;
            if (includeTime) {
              const hours = randomDate.getHours();
              const minutes = randomDate.getMinutes();
              const ampm = hours >= 12 ? 'PM' : 'AM';
              const displayHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
              formattedDate += ` ${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
            }
            break;
          case "iso":
            formattedDate = randomDate.toISOString().split('T')[0];
            if (includeTime) {
              formattedDate += ` ${randomDate.toTimeString().split(' ')[0]}`;
            }
            break;
          case "custom":
            // Using toLocaleDateString for locale-based formatting
            const options: Intl.DateTimeFormatOptions = {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              ...(includeTime && {
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true
              })
            };
            formattedDate = randomDate.toLocaleString(undefined, options);
            break;
          default:
            formattedDate = randomDate.toDateString();
            if (includeTime) {
              formattedDate += ` ${randomDate.toTimeString().split(' ')[0]}`;
            }
        }
        
        dates.push({
          date: randomDate,
          formatted: formattedDate,
          iso: randomDate.toISOString()
        });
      }
      
      setResults(dates);
    } catch (err) {
      setError(`An error occurred: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const handleCopy = () => {
    const textToCopy = results.map(result => result.formatted).join('\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = results.map(result => result.formatted).join('\n');
    const element = document.createElement("a");
    const file = new Blob([textToDownload], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "random-dates.txt";
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
        This tool generates random dates within your specified range. It's useful for creating test data, simulating events, planning activities, or just generating random dates for any purpose.
      </p>
      <p className="text-gray-300 mb-4">Common uses include:</p>
      <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
        <li>Creating test data for software development</li>
        <li>Generating random birthdates for fictional characters</li>
        <li>Scheduling random events or activities</li>
        <li>Randomizing timelines for simulations or games</li>
        <li>Statistical sampling across time periods</li>
      </ul>
      <p className="text-gray-300">
        Simply set your desired date range, specify how many dates you need, choose your preferred format, and click the generate button.
      </p>
    </>
  );

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
      <div className="flex flex-col space-y-4">
        <div className="space-y-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-zinc-700 text-white border-zinc-600"
            />
          </div>

          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-zinc-700 text-white border-zinc-600"
            />
          </div>

          <div>
            <Label htmlFor="count">Number of Dates</Label>
            <Input
              id="count"
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="bg-zinc-700 text-white border-zinc-600"
            />
          </div>

          <div>
            <Label htmlFor="format">Date Format</Label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger id="format" className="bg-zinc-700 text-white border-zinc-600">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-700 text-white border-zinc-600">
                {formatOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeTime"
              checked={includeTime}
              onCheckedChange={(checked) => setIncludeTime(checked as boolean)}
            />
            <Label htmlFor="includeTime">Include Time</Label>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <Label className="mb-2">Generated Dates</Label>
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
              Your random dates will appear here
            </p>
          )}
        </div>
        
        <div className="text-sm text-gray-400">
          {results.length > 0 && (
            <p>Generated {results.length} random date{results.length !== 1 ? 's' : ''} 
              between {new Date(startDate).toLocaleDateString()} and {new Date(endDate).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <RandomGeneratorLayout
        title="Random Date Generator"
        description="Generate random dates within a specified range."
        error={error}
        result={results.length > 0 ? results.map(r => r.formatted) : null}
        onGenerate={generateRandomDate}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onReset={handleReset}
        copied={copied}
        generateButtonText="Generate Dates"
        aboutContent={aboutContent}
      >
        {content}
      </RandomGeneratorLayout>
  );
};

export default RandomDateGenerator;
