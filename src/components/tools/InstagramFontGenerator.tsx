import React, { useState } from "react";
import { ToolLayout } from "./ToolLayout";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const InstagramFontGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [copied, setCopied] = useState(false);

  const fontStyles: { [key: string]: (text: string) => string } = {
    "Squared Blue": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': '🅃', 'Y': '🅈', 'P': '🄿', 'E': '🄴', 'O': '🄾', 'R': '🅁', 
        'A': '🄰', 'S': '🅂', 'C': '🄲', 'N': '🄽', 'H': '🄷', 'U': '🅄',
        'I': '🄸', 'D': '🄳', 'L': '🄻', 'M': '🄼', ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Mixed Style": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': 'T', 'Y': 'ʸ', 'P': 'Ⓟ', 'E': '𝐄', 'O': 'ㄖ', 'R': 'ℝ', 
        'A': '𝒶', 'S': '𝕤', 'C': '𝓬', 'N': '𝓝', 'H': '𝐄', 
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Thai Style": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': 'T', 'Y': 'ץ', 'P': 'ק', 'E': 'є', 'O': '๏', 'R': 'г', 
        'A': 'ค', 'S': 'ร', 'C': 'ς', 'N': 'ภ', 'H': 'ђ',
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Bold": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': '𝗧', 'Y': '𝗬', 'P': '𝗣', 'E': '𝗘', 'O': '𝗢', 'R': '𝗥', 
        'A': '𝗔', 'S': '𝗦', 'C': '𝗖', 'N': '𝗡', 'H': '𝗛',
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Gothic": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': '𝕿', 'Y': '𝖄', 'P': '𝖕', 'E': '𝖊', 'O': '𝖔', 'R': '𝖗', 
        'A': '𝖆', 'S': '𝖘', 'C': '𝖈', 'N': '𝖓', 'H': '𝖍',
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Cursive": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': '𝒯', 'Y': '𝒴', 'P': '𝒫', 'E': '𝐸', 'O': '𝒪', 'R': '𝑅', 
        'A': '𝒜', 'S': '𝒮', 'C': '𝒞', 'N': '𝒩', 'H': '𝐻',
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Squared": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': '🆃', 'Y': '🆈', 'P': '🅿', 'E': '🅴', 'O': '🅾', 'R': '🆁', 
        'A': '🅰', 'S': '🆂', 'C': '🅲', 'N': '🅽', 'H': '🅷',
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Blocks": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': 'T', 'Y': 'Y', 'P': 'ᑭ', 'E': 'E', 'O': 'O', 'R': 'ᖇ', 
        'A': 'ᗩ', 'S': 'ᔕ', 'C': 'ᑕ', 'N': 'ᑎ', 'H': 'ᕼ',
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Monospace": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': '𝚃', 'Y': '𝚈', 'P': '𝙿', 'E': '𝙴', 'O': '𝙾', 'R': '𝚁', 
        'A': '𝙰', 'S': '𝚂', 'C': '𝙲', 'N': '𝙽', 'H': '𝙷',
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Fullwidth": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': 'Ｔ', 'Y': 'Ｙ', 'P': 'Ｐ', 'E': 'Ｅ', 'O': 'Ｏ', 'R': 'Ｒ', 
        'A': 'Ａ', 'S': 'Ｓ', 'C': 'Ｃ', 'N': 'Ｎ', 'H': 'Ｈ',
        ' ': ' '
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    },
    "Output Text Style": (text: string) => {
      const chars: { [key: string]: string } = {
        'T': 'T', 'Y': 'ʸ', 'P': 'Ⓟ', 'E': '𝐄', 'O': 'ㄖ', 'R': 'ℝ', 
        'A': '𝒶', 'S': '𝕤', 'C': '𝓬', 'N': '𝓝', 'H': '𝓗', 'U': '𝓤',
        'I': '𝒾', 'D': '𝒹', 'L': '𝓁', 'M': '𝓂', ' ': ' ', 't': '𝓉'
      };
      return text.split("").map(char => chars[char.toUpperCase()] || char).join("");
    }
  };

  const generateFonts = (text: string) => {
    if (!text) {
      setOutputText("");
      return;
    }
    const styles = Object.entries(fontStyles).map(([_, styleFunc]) => 
      `${styleFunc(text)}\n`
    );
    setOutputText(styles.join("\n"));
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <ToolLayout title="Instagram Fonts Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Instagram Fonts Generator</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Input Text</h2>
            <Textarea
              placeholder="Type or paste your content here"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                generateFonts(e.target.value);
              }}
              className="min-h-[300px] mb-4"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Output Text</h2>
            <Textarea
              readOnly
              placeholder="Styled text will appear here"
              value={outputText}
              className="min-h-[300px] mb-4"
            />
            <Button onClick={handleCopy}>
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default InstagramFontGenerator;
