import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

// Roman numeral conversion mapping
const romanNumerals: { [key: number]: string } = {
  1000: "M",
  900: "CM",
  500: "D",
  400: "CD",
  100: "C",
  90: "XC",
  50: "L",
  40: "XL",
  10: "X",
  9: "IX",
  5: "V",
  4: "IV",
  1: "I"
};

// Month names
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

type DateFormat = "mdy" | "dmy" | "ymd" | "custom";
type DateSeparator = "slash" | "dash" | "dot" | "space" | "none";

const RomanNumeralDateConverter = () => {
  // Date input state
  const [day, setDay] = useState<number>(new Date().getDate());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  
  // Format settings
  const [dateFormat, setDateFormat] = useState<DateFormat>("mdy");
  const [separator, setSeparator] = useState<DateSeparator>("slash");
  const [customFormat, setCustomFormat] = useState<string>("m/d/y");
  
  // Conversion options
  const [convertDay, setConvertDay] = useState<boolean>(true);
  const [convertMonth, setConvertMonth] = useState<boolean>(true);
  const [convertYear, setConvertYear] = useState<boolean>(true);
  const [uppercase, setUppercase] = useState<boolean>(true);
  
  // Results
  const [result, setResult] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  
  // Generate the result whenever inputs change
  useEffect(() => {
    generateRomanDate();
  }, [
    day, month, year, 
    dateFormat, separator, customFormat,
    convertDay, convertMonth, convertYear, uppercase
  ]);
  
  // Convert a number to Roman numerals
  const toRoman = (num: number): string => {
    let result = "";
    const values = Object.keys(romanNumerals).map(Number).sort((a, b) => b - a);
    
    for (const value of values) {
      while (num >= value) {
        result += romanNumerals[value];
        num -= value;
      }
    }
    
    return uppercase ? result : result.toLowerCase();
  };
  
  // Generate the Roman numeral date
  const generateRomanDate = () => {
    try {
      // Validate inputs
      const validDay = Math.min(Math.max(1, day), 31);
      const validMonth = Math.min(Math.max(1, month), 12);
      const validYear = Math.min(Math.max(1, year), 9999);
      
      // Convert values to Roman if specified
      const romanDay = convertDay ? toRoman(validDay) : validDay.toString();
      const romanMonth = convertMonth ? toRoman(validMonth) : validMonth.toString();
      const romanYear = convertYear ? toRoman(validYear) : validYear.toString();
      
      // Determine separator string
      let sepStr = "";
      switch (separator) {
        case "slash": sepStr = "/"; break;
        case "dash": sepStr = "-"; break;
        case "dot": sepStr = "."; break;
        case "space": sepStr = " "; break;
        case "none": sepStr = ""; break;
        default: sepStr = "/";
      }
      
      // Format the date
      let formattedDate = "";
      switch (dateFormat) {
        case "mdy":
          formattedDate = `${romanMonth}${sepStr}${romanDay}${sepStr}${romanYear}`;
          break;
        case "dmy":
          formattedDate = `${romanDay}${sepStr}${romanMonth}${sepStr}${romanYear}`;
          break;
        case "ymd":
          formattedDate = `${romanYear}${sepStr}${romanMonth}${sepStr}${romanDay}`;
          break;
        case "custom":
          // Replace placeholders in custom format
          formattedDate = customFormat
            .replace(/m/g, romanMonth)
            .replace(/d/g, romanDay)
            .replace(/y/g, romanYear);
          break;
        default:
          formattedDate = `${romanMonth}${sepStr}${romanDay}${sepStr}${romanYear}`;
      }
      
      setResult(formattedDate);
    } catch (error) {
      setResult("Error: Invalid date");
    }
  };
  
  // Set today's date
  const setToday = () => {
    const today = new Date();
    setDay(today.getDate());
    setMonth(today.getMonth() + 1);
    setYear(today.getFullYear());
  };
  
  // Copy result to clipboard
  const handleCopy = () => {
    if (!result) return;
    
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Roman Numeral Date Converter</h1>
      <p className="text-gray-300 mb-6">
        Convert dates to Roman numerals with customizable formats and options.
      </p>
      
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="bg-zinc-700 p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-4">Date Input</h2>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="month-input" className="block mb-2">Month</Label>
                <Select
                  value={month.toString()}
                  onValueChange={(value) => setMonth(parseInt(value))}
                >
                  <SelectTrigger id="month-input" className="bg-zinc-700 border-zinc-600">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-700 border-zinc-600">
                    {months.map((name, index) => (
                      <SelectItem key={index + 1} value={(index + 1).toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="day-input" className="block mb-2">Day</Label>
                <Input
                  id="day-input"
                  type="number"
                  min="1"
                  max="31"
                  className="bg-zinc-700 text-white border-zinc-600"
                  value={day}
                  onChange={(e) => setDay(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div>
                <Label htmlFor="year-input" className="block mb-2">Year</Label>
                <Input
                  id="year-input"
                  type="number"
                  min="1"
                  max="9999"
                  className="bg-zinc-700 text-white border-zinc-600"
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value) || 2023)}
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 w-full"
              onClick={setToday}
            >
              Use Today's Date
            </Button>
          </div>
          
          <div className="bg-zinc-700 p-4 rounded">
            <h2 className="text-xl font-semibold mb-4">Format Options</h2>
            
            <Tabs defaultValue="standard" className="mb-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="standard">Standard Formats</TabsTrigger>
                <TabsTrigger value="custom">Custom Format</TabsTrigger>
              </TabsList>
              
              <TabsContent value="standard" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="date-format" className="block mb-2">Date Format</Label>
                  <Select
                    value={dateFormat}
                    onValueChange={(value) => setDateFormat(value as DateFormat)}
                  >
                    <SelectTrigger id="date-format" className="bg-zinc-700 border-zinc-600">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 border-zinc-600">
                      <SelectItem value="mdy">Month/Day/Year</SelectItem>
                      <SelectItem value="dmy">Day/Month/Year</SelectItem>
                      <SelectItem value="ymd">Year/Month/Day</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="separator" className="block mb-2">Separator</Label>
                  <Select
                    value={separator}
                    onValueChange={(value) => setSeparator(value as DateSeparator)}
                  >
                    <SelectTrigger id="separator" className="bg-zinc-700 border-zinc-600">
                      <SelectValue placeholder="Select separator" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-700 border-zinc-600">
                      <SelectItem value="slash">Slash (/)</SelectItem>
                      <SelectItem value="dash">Dash (-)</SelectItem>
                      <SelectItem value="dot">Dot (.)</SelectItem>
                      <SelectItem value="space">Space</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
              
              <TabsContent value="custom" className="mt-4">
                <div>
                  <Label htmlFor="custom-format" className="block mb-2">Custom Format</Label>
                  <Input
                    id="custom-format"
                    className="bg-zinc-700 text-white border-zinc-600 mb-2"
                    value={customFormat}
                    onChange={(e) => setCustomFormat(e.target.value)}
                    placeholder="m/d/y"
                  />
                  <p className="text-xs text-gray-400">
                    Use m for month, d for day, y for year, and any separators you want.
                    <br />Example: "d of m, y" gives "IV of II, MMXXIII"
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            <h3 className="text-lg font-medium mt-6 mb-3">Conversion Options</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="convert-day" 
                  checked={convertDay}
                  onCheckedChange={(checked) => setConvertDay(!!checked)}
                />
                <Label htmlFor="convert-day" className="cursor-pointer">Convert day</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="convert-month" 
                  checked={convertMonth}
                  onCheckedChange={(checked) => setConvertMonth(!!checked)}
                />
                <Label htmlFor="convert-month" className="cursor-pointer">Convert month</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="convert-year" 
                  checked={convertYear}
                  onCheckedChange={(checked) => setConvertYear(!!checked)}
                />
                <Label htmlFor="convert-year" className="cursor-pointer">Convert year</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="uppercase" 
                  checked={uppercase}
                  onCheckedChange={(checked) => setUppercase(!!checked)}
                />
                <Label htmlFor="uppercase" className="cursor-pointer">Uppercase numerals</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-zinc-700 p-4 rounded mb-6">
            <h2 className="text-xl font-semibold mb-4">Result</h2>
            
            <div className="bg-zinc-800 p-4 rounded mb-4 min-h-[100px] flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-4">{result}</div>
                <div className="text-gray-400 text-sm">
                  {month}/{day}/{year} in Roman numerals
                </div>
              </div>
            </div>
            
            <Button
              variant="outline"
              className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600 w-full"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>
          
          <div className="bg-zinc-700 p-4 rounded">
            <h2 className="text-xl font-semibold mb-3">Examples</h2>
            
            <div className="space-y-3">
              <div className="bg-zinc-800 p-2 rounded">
                <div className="text-sm text-gray-400">July 4, 1776</div>
                <div className="font-medium">VII/IV/MDCCLXXVI</div>
              </div>
              
              <div className="bg-zinc-800 p-2 rounded">
                <div className="text-sm text-gray-400">December 25, 2023</div>
                <div className="font-medium">XII/XXV/MMXXIII</div>
              </div>
              
              <div className="bg-zinc-800 p-2 rounded">
                <div className="text-sm text-gray-400">October 31, 1999 (custom format)</div>
                <div className="font-medium">day XXXI of month X, year MCMXCIX</div>
                <div className="text-xs text-gray-500">Format: "day d of month m, year y"</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Roman Numeral Date Converter</h2>
        <p className="text-gray-300 mb-4">
          This tool converts dates to Roman numerals with customizable formatting options. Roman numerals are a numeral system that originated in ancient Rome and remained the usual way of writing numbers throughout Europe well into the Late Middle Ages.
        </p>
        <p className="text-gray-300 mb-4">
          Key features:
        </p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Convert any date to Roman numerals</li>
          <li>Choose which parts of the date to convert (day, month, year)</li>
          <li>Select from standard date formats or create your own custom format</li>
          <li>Choose between uppercase (traditional) or lowercase Roman numerals</li>
          <li>Multiple separator options (/, -, ., space, or none)</li>
        </ul>
        <p className="text-gray-300 mb-4">
          Roman numerals use combinations of letters from the Latin alphabet to signify values:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          <div className="bg-zinc-700 p-2 rounded text-center">
            <span className="block font-bold">I = 1</span>
          </div>
          <div className="bg-zinc-700 p-2 rounded text-center">
            <span className="block font-bold">V = 5</span>
          </div>
          <div className="bg-zinc-700 p-2 rounded text-center">
            <span className="block font-bold">X = 10</span>
          </div>
          <div className="bg-zinc-700 p-2 rounded text-center">
            <span className="block font-bold">L = 50</span>
          </div>
          <div className="bg-zinc-700 p-2 rounded text-center">
            <span className="block font-bold">C = 100</span>
          </div>
          <div className="bg-zinc-700 p-2 rounded text-center">
            <span className="block font-bold">D = 500</span>
          </div>
          <div className="bg-zinc-700 p-2 rounded text-center">
            <span className="block font-bold">M = 1000</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RomanNumeralDateConverter;
