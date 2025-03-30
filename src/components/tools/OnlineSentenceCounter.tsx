import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Supported languages - will expand as needed
type Language = "auto" | "en" | "es" | "fr" | "de" | "zh" | "ja" | "ru" | "ar";

// Basic sentence statistics
interface SentenceStats {
  count: number;
  avgLength: number;
  shortestLength: number;
  longestLength: number;
}

// Readability scores
interface ReadabilityScores {
  fleschReadingEase: number | null;
  fleschKincaidGrade: number | null;
  gunningFog: number | null;
  smog: number | null;
  automatedReadabilityIndex: number | null;
  colemanLiauIndex: number | null;
}

const OnlineSentenceCounter: React.FC = () => {
  // Text and processing state
  const [inputText, setInputText] = useState<string>("");
  const [language, setLanguage] = useState<Language>("auto");
  const [sentences, setSentences] = useState<string[]>([]);
  const [stats, setStats] = useState<SentenceStats>({
    count: 0,
    avgLength: 0,
    shortestLength: Infinity,
    longestLength: 0
  });
  const [readability, setReadability] = useState<ReadabilityScores>({
    fleschReadingEase: null,
    fleschKincaidGrade: null,
    gunningFog: null,
    smog: null,
    automatedReadabilityIndex: null,
    colemanLiauIndex: null
  });
  
  // Settings
  const [includeQuestionMarks, setIncludeQuestionMarks] = useState<boolean>(true);
  const [includeExclamationMarks, setIncludeExclamationMarks] = useState<boolean>(true);
  const [showReadability, setShowReadability] = useState<boolean>(true);
  
  // UI state
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-detect language when text changes
  useEffect(() => {
    if (language === "auto" && inputText.trim()) {
      const detectedLang = detectLanguage(inputText);
      setLanguage(detectedLang);
    }
  }, [inputText, language]);

  // Process text when input or settings change
  useEffect(() => {
    if (inputText.trim()) {
      analyzeSentences();
    } else {
      resetStats();
    }
  }, [inputText, language, includeQuestionMarks, includeExclamationMarks]);

  // Simple language detection function
  const detectLanguage = (text: string): Language => {
    // This is a simplified implementation - in a real tool this would use
    // a language detection library or more sophisticated heuristics
    
    // Script detection
    const scripts = {
      latin: /[a-zA-Z]/,
      cyrillic: /[а-яА-Я]/,
      chinese: /[\u4e00-\u9fff]/, 
      japanese: /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]/,
      arabic: /[\u0600-\u06FF]/,
    };
    
    if (scripts.chinese.test(text)) return "zh";
    if (scripts.japanese.test(text)) return "ja";
    if (scripts.cyrillic.test(text)) return "ru";
    if (scripts.arabic.test(text)) return "ar";
    
    // For Latin scripts, we could implement further checks
    // For now, default to English
    return "en";
  };

  // Analyze sentences based on language
  const analyzeSentences = () => {
    // Get sentences based on language
    const sentenceList = splitIntoSentences(inputText, language);
    setSentences(sentenceList);
    
    // Calculate basic statistics
    const wordCounts = sentenceList.map(s => countWords(s, language));
    const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
    
    setStats({
      count: sentenceList.length,
      avgLength: sentenceList.length > 0 ? totalWords / sentenceList.length : 0,
      shortestLength: Math.min(...wordCounts, Infinity),
      longestLength: Math.max(...wordCounts, 0)
    });
    
    // Calculate readability metrics if enabled and language is supported
    if (showReadability && ["en", "es", "fr", "de"].includes(language)) {
      calculateReadabilityScores(inputText, sentenceList, totalWords, language);
    } else {
      // Reset readability scores for unsupported languages
      setReadability({
        fleschReadingEase: null,
        fleschKincaidGrade: null,
        gunningFog: null,
        smog: null,
        automatedReadabilityIndex: null,
        colemanLiauIndex: null
      });
    }
  };

  // Split text into sentences based on language
  const splitIntoSentences = (text: string, lang: Language): string[] => {
    // Default sentence ending patterns
    let endingPatterns = ['.', '?', '!'];
    if (!includeQuestionMarks) endingPatterns = endingPatterns.filter(p => p !== '?');
    if (!includeExclamationMarks) endingPatterns = endingPatterns.filter(p => p !== '!');
    
    // Language-specific patterns and handling
    switch (lang) {
      case "zh":
      case "ja":
        // For Chinese and Japanese, also split on specific end punctuation
        endingPatterns = [...endingPatterns, '。', '？', '！'];
        break;
      
      case "ar":
        // For Arabic, include Arabic question mark
        if (includeQuestionMarks) endingPatterns.push('؟');
        break;
    }
    
    // Create pattern string for regex
    const patternStr = endingPatterns.map(p => `\\${p}`).join('|');
    
    // Split sentences using regex
    const pattern = new RegExp(`[^${patternStr}]+(?:[${patternStr}]|$)`, 'g');
    const matches = text.match(pattern) || [];
    
    // Filter and clean sentences
    return matches
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  // Count words in a sentence based on language
  const countWords = (sentence: string, lang: Language): number => {
    switch (lang) {
      case "zh":
        // For Chinese, each character is roughly a word
        return sentence.replace(/[^\p{Script=Han}]/gu, '').length;
        
      case "ja":
        // For Japanese, count non-punctuation characters as a rough estimate
        return sentence.replace(/[^\p{L}\p{N}]/gu, '').length;
        
      default:
        // For most languages, split by whitespace
        return sentence.split(/\s+/).filter(Boolean).length;
    }
  };

  // Count syllables in English text
  const countSyllables = (text: string): number => {
    // This is a simplified syllable counter for English
    const words = text.toLowerCase().split(/\s+/);
    
    return words.reduce((count, word) => {
      // Remove non-alphabetic characters
      word = word.replace(/[^a-z]/g, '');
      
      // Edge cases: empty word or single letter
      if (!word || word.length <= 1) return count + 1;
      
      // Count vowel groups
      const syllables = word.match(/[aeiouy]{1,2}/g)?.length || 0;
      
      // Adjust for common patterns
      let adjustment = 0;
      
      // Words ending with 'e' (silent e)
      if (word.endsWith('e') && !word.endsWith('le')) adjustment -= 1;
      
      // Words ending with 'es' or 'ed' but not pronounced
      if (/[^aeiou]es$/.test(word) || /[^aeiou]ed$/.test(word)) adjustment -= 1;
      
      // Words ending with 'le' count as a syllable
      if (/le$/.test(word) && word.length > 2 && !/[aeiou]le$/.test(word)) adjustment += 1;
      
      return count + Math.max(1, syllables + adjustment);
    }, 0);
  };

  // Calculate readability scores
  const calculateReadabilityScores = (text: string, sentences: string[], totalWords: number, lang: Language) => {
    // Only calculate for supported languages
    if (!["en", "es", "fr", "de"].includes(lang)) {
      return;
    }
    
    // Count syllables (language dependent)
    const syllables = countSyllables(text);
    
    // Count characters (excluding spaces)
    const chars = text.replace(/\s/g, '').length;
    
    // Prepare scores object
    const scores: ReadabilityScores = {
      fleschReadingEase: null,
      fleschKincaidGrade: null,
      gunningFog: null,
      smog: null,
      automatedReadabilityIndex: null,
      colemanLiauIndex: null
    };
    
    // Only calculate if we have words and sentences
    if (totalWords > 0 && sentences.length > 0) {
      // Words per sentence
      const wordsPerSentence = totalWords / sentences.length;
      
      // Syllables per word
      const syllablesPerWord = syllables / totalWords;
      
      // Calculate Flesch Reading Ease
      scores.fleschReadingEase = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);
      
      // Calculate Flesch-Kincaid Grade Level
      scores.fleschKincaidGrade = (0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59;
      
      // Calculate Gunning-Fog Index
      // Count "complex" words (3+ syllables)
      const complexWords = text
        .toLowerCase()
        .split(/\s+/)
        .filter(word => {
          const wordClean = word.replace(/[^a-z]/g, '');
          if (!wordClean) return false;
          const syllableCount = (wordClean.match(/[aeiouy]{1,2}/g) || []).length;
          return syllableCount >= 3;
        }).length;
      
      scores.gunningFog = 0.4 * (wordsPerSentence + 100 * (complexWords / totalWords));
      
      // Calculate SMOG Index (requires 30+ sentences)
      if (sentences.length >= 30) {
        scores.smog = 1.043 * Math.sqrt(complexWords * (30 / sentences.length)) + 3.1291;
      }
      
      // Calculate Automated Readability Index
      scores.automatedReadabilityIndex = 
        4.71 * (chars / totalWords) + 0.5 * wordsPerSentence - 21.43;
      
      // Calculate Coleman-Liau Index
      const L = (chars / totalWords) * 100; // Average characters per 100 words
      const S = (sentences.length / totalWords) * 100; // Average sentences per 100 words
      scores.colemanLiauIndex = 0.0588 * L - 0.296 * S - 15.8;
    }
    
    setReadability(scores);
  };

  // Reset all statistics
  const resetStats = () => {
    setSentences([]);
    setStats({
      count: 0,
      avgLength: 0,
      shortestLength: Infinity,
      longestLength: 0
    });
    setReadability({
      fleschReadingEase: null,
      fleschKincaidGrade: null,
      gunningFog: null,
      smog: null,
      automatedReadabilityIndex: null,
      colemanLiauIndex: null
    });
  };

  // Copy results to clipboard
  const handleCopy = () => {
    const formattedStats = `
Sentence Analysis:
Total Sentences: ${stats.count}
Average Sentence Length: ${stats.avgLength.toFixed(1)} words
Shortest Sentence: ${stats.shortestLength === Infinity ? "N/A" : stats.shortestLength} words
Longest Sentence: ${stats.longestLength} words

Readability Metrics:${readability.fleschReadingEase !== null ? `
Flesch Reading Ease: ${readability.fleschReadingEase.toFixed(1)} (${interpretFleschScore(readability.fleschReadingEase)})` : ''}${readability.fleschKincaidGrade !== null ? `
Flesch-Kincaid Grade Level: ${readability.fleschKincaidGrade.toFixed(1)}` : ''}${readability.gunningFog !== null ? `
Gunning-Fog Index: ${readability.gunningFog.toFixed(1)}` : ''}${readability.smog !== null ? `
SMOG Index: ${readability.smog.toFixed(1)}` : ''}${readability.automatedReadabilityIndex !== null ? `
Automated Readability Index: ${readability.automatedReadabilityIndex.toFixed(1)}` : ''}${readability.colemanLiauIndex !== null ? `
Coleman-Liau Index: ${readability.colemanLiauIndex.toFixed(1)}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(formattedStats);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear input and results
  const handleClear = () => {
    setInputText("");
    resetStats();
  };

  // Interpret Flesch Reading Ease score
  const interpretFleschScore = (score: number): string => {
    if (score >= 90) return "Very Easy";
    if (score >= 80) return "Easy";
    if (score >= 70) return "Fairly Easy";
    if (score >= 60) return "Standard";
    if (score >= 50) return "Fairly Difficult";
    if (score >= 30) return "Difficult";
    return "Very Difficult";
  };

  // Render UI
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Online Sentence Counter</h1>
      <p className="text-gray-300 mb-6">
        Analyze your text to count sentences and get readability metrics. Supports multiple languages.
      </p>
      
      <Textarea
        placeholder="Type or paste your text here"
        className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      
      {/* Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Label htmlFor="language-select">Language</Label>
          <Select
            value={language}
            onValueChange={(value) => setLanguage(value as Language)}
          >
            <SelectTrigger id="language-select" className="bg-zinc-700 border-zinc-600">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-700 border-zinc-600">
              <SelectItem value="auto">Auto Detect</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="zh">Chinese</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
              <SelectItem value="ru">Russian</SelectItem>
              <SelectItem value="ar">Arabic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="question-marks" 
            checked={includeQuestionMarks}
            onCheckedChange={(checked) => setIncludeQuestionMarks(!!checked)}
          />
          <Label htmlFor="question-marks" className="cursor-pointer">Count question marks as sentence endings</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="exclamation-marks" 
            checked={includeExclamationMarks}
            onCheckedChange={(checked) => setIncludeExclamationMarks(!!checked)}
          />
          <Label htmlFor="exclamation-marks" className="cursor-pointer">Count exclamation marks as sentence endings</Label>
        </div>
      </div>
      
      {/* Results */}
      {stats.count > 0 && (
        <div className="bg-zinc-700 p-4 rounded mb-4">
          <h2 className="text-xl font-bold mb-3">Sentence Analysis</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="bg-zinc-800 p-3 rounded">
              <div className="text-sm text-gray-400">Total Sentences</div>
              <div className="text-2xl font-bold">{stats.count}</div>
            </div>
            <div className="bg-zinc-800 p-3 rounded">
              <div className="text-sm text-gray-400">Average Length</div>
              <div className="text-2xl font-bold">{stats.avgLength.toFixed(1)}</div>
            </div>
            <div className="bg-zinc-800 p-3 rounded">
              <div className="text-sm text-gray-400">Shortest Sentence</div>
              <div className="text-2xl font-bold">
                {stats.shortestLength === Infinity ? "N/A" : stats.shortestLength}
              </div>
            </div>
            <div className="bg-zinc-800 p-3 rounded">
              <div className="text-sm text-gray-400">Longest Sentence</div>
              <div className="text-2xl font-bold">{stats.longestLength}</div>
            </div>
          </div>
          
          {/* Readability metrics - only display for supported languages */}
          {readability.fleschReadingEase !== null && (
            <>
              <h3 className="text-lg font-semibold mb-2 mt-4">Readability Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-zinc-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Flesch Reading Ease</div>
                  <div className="text-xl font-bold">{readability.fleschReadingEase.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">
                    {interpretFleschScore(readability.fleschReadingEase)}
                  </div>
                </div>
                
                <div className="bg-zinc-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Flesch-Kincaid Grade</div>
                  <div className="text-xl font-bold">{readability.fleschKincaidGrade.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">US grade level</div>
                </div>
                
                <div className="bg-zinc-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Gunning-Fog Index</div>
                  <div className="text-xl font-bold">{readability.gunningFog.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">Years of education needed</div>
                </div>
                
                {readability.smog !== null && (
                  <div className="bg-zinc-800 p-3 rounded">
                    <div className="text-sm text-gray-400">SMOG Index</div>
                    <div className="text-xl font-bold">{readability.smog.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Years of education (requires 30+ sentences)</div>
                  </div>
                )}
                
                <div className="bg-zinc-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Automated Readability Index</div>
                  <div className="text-xl font-bold">{readability.automatedReadabilityIndex.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">US grade level</div>
                </div>
                
                <div className="bg-zinc-800 p-3 rounded">
                  <div className="text-sm text-gray-400">Coleman-Liau Index</div>
                  <div className="text-xl font-bold">{readability.colemanLiauIndex.toFixed(1)}</div>
                  <div className="text-xs text-gray-400">US grade level</div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={handleCopy}
          disabled={stats.count === 0}
        >
          {copied ? "Copied!" : "Copy Results"}
        </Button>
        <Button
          variant="outline"
          className="bg-zinc-700 hover:bg-zinc-600 text-white border-zinc-600"
          onClick={handleClear}
        >
          Clear
        </Button>
      </div>
      
      {/* About Section */}
      <div className="mt-8 mb-12">
        <h2 className="text-xl font-bold mb-4">About Online Sentence Counter</h2>
        <p className="text-gray-300 mb-4">
          This tool analyzes your text to count sentences and provide readability metrics. It supports multiple languages 
          and offers various readability scores for supported languages.
        </p>
        <h3 className="text-lg font-semibold mb-2">Readability Metrics</h3>
        <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1">
          <li><span className="font-medium">Flesch Reading Ease:</span> Higher scores (90-100) indicate text that is very easy to read, while lower scores (0-30) indicate very difficult text.</li>
          <li><span className="font-medium">Flesch-Kincaid Grade Level:</span> Indicates the US grade level required to understand the text.</li>
          <li><span className="font-medium">Gunning-Fog Index:</span> Estimates the years of formal education needed to understand the text.</li>
          <li><span className="font-medium">SMOG Index:</span> Predicts the years of education needed to understand a piece of writing (requires 30+ sentences).</li>
          <li><span className="font-medium">Automated Readability Index:</span> Produces an approximate representation of the US grade level needed to comprehend the text.</li>
          <li><span className="font-medium">Coleman-Liau Index:</span> Approximates the US grade level required to understand the text, based on characters rather than syllables.</li>
        </ul>
        <p className="text-gray-300">
          Note: Readability metrics are most accurate for English text but are also calculated for some other languages.
          Different languages have different natural sentence lengths and structures, so results may vary.
        </p>
      </div>
    </div>
  );
};

export default OnlineSentenceCounter;
