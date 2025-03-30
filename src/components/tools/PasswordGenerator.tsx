import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    generatePassword();
  }, []); // Generate a password on component mount

  const generatePassword = () => {
    // Validate that at least one character type is selected
    if (
      !includeUppercase &&
      !includeLowercase &&
      !includeNumbers &&
      !includeSymbols
    ) {
      setError("Please select at least one character type.");
      return;
    }

    setError("");

    // Define character sets
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
    const numberChars = "0123456789";
    const symbolChars = "!@#$%^&*()_+~`|}{[]\\:;?><,./-=";

    // Remove similar characters if option is selected
    const similarChars = "il1Lo0O";

    let availableChars = "";
    if (includeUppercase) availableChars += uppercaseChars;
    if (includeLowercase) availableChars += lowercaseChars;
    if (includeNumbers) availableChars += numberChars;
    if (includeSymbols) availableChars += symbolChars;

    if (excludeSimilar) {
      for (const char of similarChars) {
        availableChars = availableChars.replace(char, "");
      }
    }

    // Generate password
    let newPassword = "";
    const availableCharsLength = availableChars.length;

    // Ensure at least one character from each selected type
    const requiredChars = [];
    if (includeUppercase) requiredChars.push(getRandomChar(uppercaseChars));
    if (includeLowercase) requiredChars.push(getRandomChar(lowercaseChars));
    if (includeNumbers) requiredChars.push(getRandomChar(numberChars));
    if (includeSymbols) requiredChars.push(getRandomChar(symbolChars));

    // Add required characters
    for (let i = 0; i < requiredChars.length; i++) {
      newPassword += requiredChars[i];
    }

    // Fill the rest of the password with random characters
    for (let i = requiredChars.length; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableCharsLength);
      newPassword += availableChars[randomIndex];
    }

    // Shuffle the password to mix the required characters
    newPassword = shuffleString(newPassword);

    setPassword(newPassword);
    calculatePasswordStrength(newPassword);
  };

  const getRandomChar = (charSet: string) => {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet[randomIndex];
  };

  const shuffleString = (str: string) => {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  };

  const calculatePasswordStrength = (pwd: string) => {
    // Simple password strength calculation
    let strength = 0;

    // Length contribution (up to 40 points)
    strength += Math.min(pwd.length * 2.5, 40);

    // Character variety contribution (up to 60 points)
    if (/[A-Z]/.test(pwd)) strength += 15; // Uppercase
    if (/[a-z]/.test(pwd)) strength += 15; // Lowercase
    if (/[0-9]/.test(pwd)) strength += 15; // Numbers
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 15; // Symbols

    // Determine strength category
    if (strength < 30) {
      setPasswordStrength("Very Weak");
    } else if (strength < 50) {
      setPasswordStrength("Weak");
    } else if (strength < 70) {
      setPasswordStrength("Moderate");
    } else if (strength < 90) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("Very Strong");
    }
  };

  const getStrengthColor = () => {
    switch (passwordStrength) {
      case "Very Weak":
        return "bg-red-600";
      case "Weak":
        return "bg-orange-500";
      case "Moderate":
        return "bg-yellow-500";
      case "Strong":
        return "bg-green-500";
      case "Very Strong":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <>
      <h1 className="text-3xl font-bold mb-2">Strong Password Generator</h1>
      <p className="text-gray-300 mb-6">
        Generate secure, random passwords for your accounts.
      </p>

      {error && (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Input
            readOnly
            value={password}
            className="bg-zinc-700 text-white border-zinc-600 flex-grow mr-2"
          />
          <Button
            onClick={handleCopy}
            className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          >
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        {passwordStrength && (
          <div className="flex items-center space-x-2">
            <div className="h-2 flex-grow rounded-full bg-zinc-700 overflow-hidden">
              <div
                className={`h-full ${getStrengthColor()}`}
                style={{
                  width:
                    passwordStrength === "Very Weak"
                      ? "20%"
                      : passwordStrength === "Weak"
                        ? "40%"
                        : passwordStrength === "Moderate"
                          ? "60%"
                          : passwordStrength === "Strong"
                            ? "80%"
                            : "100%",
                }}
              ></div>
            </div>
            <span className="text-sm">{passwordStrength}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="length" className="mb-2 block">
            Password Length: {length}
          </Label>
          <div className="flex items-center space-x-4">
            <span>8</span>
            <Slider
              id="length"
              min={8}
              max={64}
              step={1}
              value={[length]}
              onValueChange={(value) => setLength(value[0])}
              className="flex-grow"
            />
            <span>64</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeUppercase"
              checked={includeUppercase}
              onCheckedChange={(checked) =>
                setIncludeUppercase(checked as boolean)
              }
            />
            <Label htmlFor="includeUppercase">
              Include Uppercase Letters (A-Z)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeLowercase"
              checked={includeLowercase}
              onCheckedChange={(checked) =>
                setIncludeLowercase(checked as boolean)
              }
            />
            <Label htmlFor="includeLowercase">
              Include Lowercase Letters (a-z)
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeNumbers"
              checked={includeNumbers}
              onCheckedChange={(checked) =>
                setIncludeNumbers(checked as boolean)
              }
            />
            <Label htmlFor="includeNumbers">Include Numbers (0-9)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="includeSymbols"
              checked={includeSymbols}
              onCheckedChange={(checked) =>
                setIncludeSymbols(checked as boolean)
              }
            />
            <Label htmlFor="includeSymbols">Include Symbols (!@#$%^&*)</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="excludeSimilar"
              checked={excludeSimilar}
              onCheckedChange={(checked) =>
                setExcludeSimilar(checked as boolean)
              }
            />
            <Label htmlFor="excludeSimilar">
              Exclude Similar Characters (i, l, 1, L, o, 0, O)
            </Label>
          </div>
        </div>
      </div>

      <Button
        onClick={generatePassword}
        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
      >
        Generate New Password
      </Button>

      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">
          About Strong Password Generator
        </h2>
        <p className="text-gray-300 mb-4">
          This tool creates secure, random passwords that help protect your
          accounts from unauthorized access. Strong passwords are an essential
          part of your online security.
        </p>
        <p className="text-gray-300 mb-4">Tips for using passwords securely:</p>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li>Use a different password for each account</li>
          <li>Never share your passwords with others</li>
          <li>
            Consider using a password manager to store your passwords securely
          </li>
          <li>
            Change your passwords periodically, especially for important
            accounts
          </li>
          <li>
            Enable two-factor authentication when available for additional
            security
          </li>
        </ul>
        <p className="text-gray-300 mb-4">
          The passwords generated by this tool are created locally in your
          browser and are never stored or transmitted to any server.
        </p>
      </div>
    </>
  );

  return content;
};

export default PasswordGenerator;
