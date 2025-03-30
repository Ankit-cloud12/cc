import { createBrowserRouter, Outlet } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import Home from "./home";
import TextCaseConverter from "./TextCaseConverter";
import CsvToJsonConverter from "./tools/CsvToJsonConverter";
import JsonToCsvConverter from "./tools/JsonToCsvConverter"; // Added import
import SqlToJsonConverter from "./tools/SqlToJsonConverter";
import CsvJsonToJsonConverter from "./tools/CsvJsonToJsonConverter"; // Import the new CSVJSON component
import { UppercaseConverter } from "./tools/UppercaseConverter";
import { LowercaseConverter } from "./tools/LowercaseConverter";
import { TitleCaseConverter } from "./tools/TitleCaseConverter";
import { SentenceCaseConverter } from "./tools/SentenceCaseConverter";
import { AlternatingCaseConverter } from "./tools/AlternatingCaseConverter";
import { InverseCaseConverter } from "./tools/InverseCaseConverter";
import { WhitespaceRemover } from "./tools/WhitespaceRemover";
import { RemoveTextFormatting } from "./tools/RemoveTextFormatting";
import { LineBreakRemover } from "./tools/LineBreakRemover";
import DuplicateLineRemover from "./tools/DuplicateLineRemover";
import CursedTextGenerator from "./tools/CursedTextGenerator";
import DiscordFontsGenerator from "./tools/DiscordFontsGenerator";
import UnicodeTextConverter from "./tools/UnicodeTextConverter";
import BigTextGenerator from "./tools/BigTextGenerator";
import BoldTextGenerator from "./tools/BoldTextGenerator";
import BubbleTextGenerator from "./tools/BubbleTextGenerator";
import ItalicTextGenerator from "./tools/ItalicTextGenerator";
import ReverseTextGenerator from "./tools/ReverseTextGenerator";
import SmallTextGenerator from "./tools/SmallTextGenerator";
import StrikethroughTextGenerator from "./tools/StrikethroughTextGenerator";
import SubscriptGenerator from "./tools/SubscriptGenerator";
import SuperscriptGenerator from "./tools/SuperscriptGenerator";
import UnderlineTextGenerator from "./tools/UnderlineTextGenerator";
import WideTextGenerator from "./tools/WideTextGenerator";
import SlashTextGenerator from "./tools/SlashTextGenerator";
import StackedTextGenerator from "./tools/StackedTextGenerator";
import FacebookFontGenerator from "./tools/FacebookFontGenerator";
import InstagramFontGenerator from "./tools/InstagramFontGenerator";
import TwitterFontGenerator from "./tools/TwitterFontGenerator";
import InvisibleTextGenerator from "./tools/InvisibleTextGenerator";
import MirrorTextGenerator from "./tools/MirrorTextGenerator";
import UpsideDownTextGenerator from "./tools/UpsideDownTextGenerator";
import WingdingsConverter from "./tools/WingdingsConverter";
import BinaryCodeTranslator from "./tools/BinaryCodeTranslator";
import MorseCodeTranslator from "./tools/MorseCodeTranslator";
import RandomNumberGenerator from "./tools/RandomNumberGenerator";
import PasswordGenerator from "./tools/PasswordGenerator";
import Base64Converter from "./tools/Base64Converter";
import WordFrequencyCounter from "./tools/WordFrequencyCounter";
import PhoneticSpellingGenerator from "./tools/PhoneticSpellingGenerator";
import PigLatinTranslator from "./tools/PigLatinTranslator";
import PlainTextConverter from "./tools/PlainTextConverter";
import ApaFormatConverter from "./tools/ApaFormatConverter";
import ZalgoTextGenerator from "./tools/ZalgoTextGenerator";
import LetterCharacterRemovalTool from "./tools/LetterCharacterRemovalTool";
import JsonBeautifier from "./tools/JsonBeautifier"; // Import the new JSON Beautifier component
import JpgToPngConverter from "./tools/JpgToPngConverter"; // Import the JPG to PNG converter
import PngToJpgConverter from "./tools/PngToJpgConverter"; // Import the PNG to JPG converter
import ImageToTextConverter from "./tools/ImageToTextConverter"; // Import the Image to Text converter
import WebpToJpgConverter from "./tools/WebpToJpgConverter"; // Import the WebP to JPG converter
import WebpToPngConverter from "./tools/WebpToPngConverter"; // Import the WebP to PNG converter
import AsciiArtGenerator from "./tools/AsciiArtGenerator"; // Import the ASCII Art Generator
import JpgToWebpConverter from "./tools/JpgToWebpConverter"; // Import the JPG to WebP converter
import PngToWebpConverter from "./tools/PngToWebpConverter"; // Import the PNG to WebP converter
import SvgToPngConverter from "./tools/SvgToPngConverter"; // Import the SVG to PNG converter
import RandomChoiceGenerator from "./tools/RandomChoiceGenerator"; // Import the Random Choice Generator
import RandomDateGenerator from "./tools/RandomDateGenerator"; // Import the Random Date Generator
import RandomLetterGenerator from "./tools/RandomLetterGenerator"; // Import the Random Letter Generator
import RandomMonthGenerator from "./tools/RandomMonthGenerator"; // Import the Random Month Generator
import RandomIpAddressGenerator from "./tools/RandomIpAddressGenerator"; // Import the Random IP Generator
import UuidGenerator from "./tools/UuidGenerator"; // Import the UUID Generator
import CaesarCipherEncryption from "./tools/CaesarCipherEncryption"; // Import the Caesar Cipher Encryption tool
import HexToTextConverter from "./tools/HexToTextConverter"; // Import the Hex to Text Converter
import ThemeSwitcherDemo from "./ui/theme-switcher-demo"; // Import the Theme Switcher Demo component
import UrlEncodeDecode from "./tools/UrlEncodeDecode"; // Import the URL Encode/Decode tool
import Md5HashGenerator from "./tools/Md5HashGenerator"; // Import the MD5 Hash Generator
import Utf8Encoding from "./tools/Utf8Encoding"; // Import the UTF-8 Encoding tool
import NatoAlphabetTranslator from "./tools/NatoAlphabetTranslator"; // Import the NATO Phonetic Alphabet Translator
import OnlineNotepad from "./tools/OnlineNotepad"; // Import the Online Notepad component
import OnlineSentenceCounter from "./tools/OnlineSentenceCounter"; // Import the Online Sentence Counter component
import RepeatTextGenerator from "./tools/RepeatTextGenerator"; // Import the Repeat Text Generator
import SortAlphabetically from "./tools/SortAlphabetically"; // Import the Sort Alphabetically tool
import ReplaceText from "./tools/ReplaceText"; // Import the Text Replacement Tool
import RomanNumeralDateConverter from "./tools/RomanNumeralDateConverter"; // Import the Roman Numeral Date Converter
import NumberSorter from "./tools/NumberSorter"; // Import the Number Sorter tool
import Rot13EncoderDecoder from "./tools/Rot13EncoderDecoder"; // Import the ROT13 Encoder/Decoder
import SlugifyUrlGenerator from "./tools/SlugifyUrlGenerator"; // Import the Slugify URL Generator
import RegexTesterTool from "./tools/RegexTesterTool"; // Import the Regex Tester Tool
import UtmGenerator from "./tools/UtmGenerator"; // Import the UTM Generator
import JsonStringifyTextTool from "./tools/JsonStringifyTextTool"; // Import the JSON Stringify Text Tool


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout><Outlet /></MainLayout>,
    children: [
      {
        path: "/",
        element: <TextCaseConverter />,
      },
      // Text Case Conversion routes
      { path: "/uppercase-converter", element: <UppercaseConverter /> },
      { path: "/lowercase-converter", element: <LowercaseConverter /> },
      { path: "/title-case-converter", element: <TitleCaseConverter /> },
      { path: "/sentence-case", element: <SentenceCaseConverter /> },
      { path: "/alternating-case", element: <AlternatingCaseConverter /> },
      { path: "/inverse-case", element: <InverseCaseConverter /> },
      { path: "/whitespace-remover", element: <WhitespaceRemover /> },
      { path: "/remove-text-formatting", element: <RemoveTextFormatting /> },
      { path: "/remove-line-breaks", element: <LineBreakRemover /> },

      // Text Modification/Formatting routes
      { path: "/apa-format-converter-generator", element: <ApaFormatConverter /> },
      { path: "/big-text-generator", element: <BigTextGenerator /> },
      { path: "/bold-text-converter", element: <BoldTextGenerator /> },
      { path: "/bubble-text-generator", element: <BubbleTextGenerator /> },
      { path: "/cursed-text", element: <CursedTextGenerator /> },
      { path: "/discord-fonts-generator", element: <DiscordFontsGenerator /> },
      { path: "/duplicate-line-remover", element: <DuplicateLineRemover /> },
      { path: "/facebook-font-generator", element: <FacebookFontGenerator /> },
      { path: "/glitch-text-converter", element: <ZalgoTextGenerator /> },
      { path: "/instagram-fonts", element: <InstagramFontGenerator /> },
      { path: "/twitter-font-generator", element: <TwitterFontGenerator /> },
      { path: "/invisible-text-generator", element: <InvisibleTextGenerator /> },
      { path: "/italic-text-converter", element: <ItalicTextGenerator /> },
      { path: "/mirror-text-generator", element: <MirrorTextGenerator /> },
      { path: "/slash-text-generator", element: <SlashTextGenerator /> },
      { path: "/small-text-generator", element: <SmallTextGenerator /> },
      { path: "/stacked-text-generator", element: <StackedTextGenerator /> },
      { path: "/strikethrough-text-generator", element: <StrikethroughTextGenerator /> },
      { path: "/subscript-generator", element: <SubscriptGenerator /> },
      { path: "/superscript-generator", element: <SuperscriptGenerator /> },
      { path: "/underline-text", element: <UnderlineTextGenerator /> },
      { path: "/unicode-text-converter", element: <UnicodeTextConverter /> },
      { path: "/vaporwave-wide-text-generator", element: <WideTextGenerator /> },
      { path: "/reverse-text-generator", element: <ReverseTextGenerator /> },
      { path: "/upside-down-text-generator", element: <UpsideDownTextGenerator /> },
      { path: "/wingdings-converter", element: <WingdingsConverter /> },

      // Code & Data Translation routes
      { path: "/base64-decode-encode", element: <Base64Converter /> },
      { path: "/base64-decode-encode", element: <Base64Converter /> },
      { path: "/binary-code-translator", element: <BinaryCodeTranslator /> },
      { path: "/json-beautifier", element: <JsonBeautifier /> }, // Add route for JSON Beautifier
      { path: "/morse-code-translator", element: <MorseCodeTranslator /> },
      { path: "/random-number-generator", element: <RandomNumberGenerator /> },
      { path: "/strong-password-generator", element: <PasswordGenerator /> },
      { path: "/word-frequency-counter", element: <WordFrequencyCounter /> },

      // Random Generator tools
      { path: "/random-choice-generator", element: <RandomChoiceGenerator /> },
      { path: "/random-date-generator", element: <RandomDateGenerator /> },
      { path: "/random-ip-address-generator", element: <RandomIpAddressGenerator /> },
      { path: "/random-letter-generator", element: <RandomLetterGenerator /> },
      { path: "/random-month-generator", element: <RandomMonthGenerator /> },
      { path: "/uuid-generator", element: <UuidGenerator /> },

      // Routes using default TextCaseConverter for now
      { path: "/phonetic-spelling-generator", element: <PhoneticSpellingGenerator /> },
      { path: "/pig-latin-translator", element: <PigLatinTranslator /> },
      { path: "/letter-character-removal-tool", element: <LetterCharacterRemovalTool /> },
      { path: "/csv-to-json", element: <CsvToJsonConverter /> },
      { path: "/json-to-csv", element: <JsonToCsvConverter /> },
      { path: "/sql-to-json", element: <SqlToJsonConverter /> },
      { path: "/csvjson-to-json", element: <CsvJsonToJsonConverter /> }, // Add the new CSVJSON route
      // { path: "/json-beautifier", element: <JsonBeautifier /> }, // Already added above
      { path: "/caesar-cipher-encryption", element: <CaesarCipherEncryption /> },
      { path: "/hex-to-text-converter", element: <HexToTextConverter /> },
      { path: "/json-stringify-text", element: <JsonStringifyTextTool /> },
      { path: "/md5-hash-generator", element: <Md5HashGenerator /> },
      { path: "/number-sorter", element: <NumberSorter /> },
      { path: "/rot13-encoder-decoder", element: <Rot13EncoderDecoder /> },
      { path: "/regex-tester-tool", element: <RegexTesterTool /> },
      { path: "/slugify-url-handle-generator", element: <SlugifyUrlGenerator /> },
      { path: "/url-encode-decode", element: <UrlEncodeDecode /> },
      { path: "/utf8-encoding", element: <Utf8Encoding /> },
      { path: "/utm-generator", element: <UtmGenerator /> },

      // Image Tools routes (using placeholder for now)
      { path: "/image-to-text-converter", element: <ImageToTextConverter /> },
      { path: "/ascii-art-generator", element: <AsciiArtGenerator /> },
      { path: "/jpg-to-png", element: <JpgToPngConverter /> },
      { path: "/jpg-to-webp", element: <JpgToWebpConverter /> },
      { path: "/png-to-jpg", element: <PngToJpgConverter /> },
      { path: "/png-to-webp", element: <PngToWebpConverter /> },
      { path: "/svg-to-png", element: <SvgToPngConverter /> },
      { path: "/webp-to-jpg", element: <WebpToJpgConverter /> },
      { path: "/webp-to-png", element: <WebpToPngConverter /> },

      // Misc Tools routes
      { path: "/nato-alphabet-translator", element: <NatoAlphabetTranslator /> },
      { path: "/online-notepad", element: <OnlineNotepad /> },
      { path: "/online-sentence-counter", element: <OnlineSentenceCounter /> },
      { path: "/repeat-text", element: <RepeatTextGenerator /> },
      { path: "/roman-numeral-date-converter", element: <RomanNumeralDateConverter /> },
      { path: "/sort-alphabetically", element: <SortAlphabetically /> },
      { path: "/replace-text", element: <ReplaceText /> },
      { path: "/theme-switcher-demo", element: <ThemeSwitcherDemo /> },

      // Language routes
      { path: "/de", element: <TextCaseConverter /> },
      { path: "/el", element: <TextCaseConverter /> },
      { path: "/es", element: <TextCaseConverter /> },
      { path: "/fil", element: <TextCaseConverter /> },
      { path: "/fr", element: <TextCaseConverter /> },
      { path: "/hi", element: <TextCaseConverter /> },
      { path: "/it", element: <TextCaseConverter /> },
      { path: "/hu", element: <TextCaseConverter /> },
      { path: "/pl", element: <TextCaseConverter /> },
      { path: "/pt", element: <TextCaseConverter /> },
      { path: "/tr", element: <TextCaseConverter /> },
      { path: "/ua", element: <TextCaseConverter /> },

      // Mobile App routes
      { path: "/mobile-app", element: <TextCaseConverter /> },
      { path: "/online-text-tools", element: <TextCaseConverter /> },

      { path: "/plain-text-converter", element: <PlainTextConverter /> },
      { path: "/twitter-fonts", element: <TwitterFontGenerator /> },
    ],
  },
]);

export default router;
