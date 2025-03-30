import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { ToolLayout } from "./ToolLayout";

const FacebookFontGenerator = () => {
  console.log("FacebookFontGenerator component rendered");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const fontStyles = {
    "Normal Text": (text: string) => text,
    Enclosed: (text: string) => {
      const enclosedMap = {
        a: "🅐",
        b: "🅑",
        c: "🅒",
        d: "🅓",
        e: "🅔",
        f: "🅕",
        g: "🅖",
        h: "🅗",
        i: "🅘",
        j: "🅙",
        k: "🅚",
        l: "🅛",
        m: "🅜",
        n: "🅝",
        o: "🅞",
        p: "🅟",
        q: "🅠",
        r: "🅡",
        s: "🅢",
        t: "🅣",
        u: "🅤",
        v: "🅥",
        w: "🅦",
        x: "🅧",
        y: "🅨",
        z: "🅩",
        A: "🅐",
        B: "🅑",
        C: "🅒",
        D: "🅓",
        E: "🅔",
        F: "🅕",
        G: "🅖",
        H: "🅗",
        I: "🅘",
        J: "🅙",
        K: "🅚",
        L: "🅛",
        M: "🅜",
        N: "🅝",
        O: "🅞",
        P: "🅟",
        Q: "🅠",
        R: "🅡",
        S: "🅢",
        T: "🅣",
        U: "🅤",
        V: "🅥",
        W: "🅦",
        X: "🅧",
        Y: "🅨",
        Z: "🅩",
        "0": "⓪",
        "1": "①",
        "2": "②",
        "3": "③",
        "4": "④",
        "5": "⑤",
        "6": "⑥",
        "7": "⑦",
        "8": "⑧",
        "9": "⑨",
      };
      return text
        .split("")
        .map((char) => enclosedMap[char] || char)
        .join("");
    },
    "Bold Sans": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d5b2;
      const baseStartLower = 0x1d5ea;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7d8 + (charCode - 48));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Italic Math": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d434;
      const baseStartLower = 0x1d44e;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7c0 + (charCode - 48));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Full Width": (text: string) => {
      const fullWidthMap = {
        " ": "　",
        "!": "！",
        '"': "＂",
        "#": "＃",
        $: "＄",
        "%": "％",
        "&": "＆",
        "'": "＇",
        "(": "（",
        ")": "）",
        "*": "＊",
        "+": "＋",
        ",": "，",
        "-": "－",
        ".": "．",
        "/": "／",
        "0": "０",
        "1": "１",
        "2": "２",
        "3": "３",
        "4": "４",
        "5": "５",
        "6": "６",
        "7": "７",
        "8": "８",
        "9": "９",
        ":": "：",
        ";": "；",
        "<": "＜",
        "=": "＝",
        ">": "＞",
        "?": "？",
        "@": "＠",
        A: "Ａ",
        B: "Ｂ",
        C: "Ｃ",
        D: "Ｄ",
        E: "Ｅ",
        F: "Ｆ",
        G: "Ｇ",
        H: "Ｈ",
        I: "Ｉ",
        J: "Ｊ",
        K: "Ｋ",
        L: "Ｌ",
        M: "Ｍ",
        N: "Ｎ",
        O: "Ｏ",
        P: "Ｐ",
        Q: "Ｑ",
        R: "Ｒ",
        S: "Ｓ",
        T: "Ｔ",
        U: "Ｕ",
        V: "Ｖ",
        W: "Ｗ",
        X: "Ｘ",
        Y: "Ｙ",
        Z: "Ｚ",
        "[": "［",
        "\\": "＼",
        "]": "］",
        "^": "＾",
        _: "＿",
        "`": "｀",
        a: "ａ",
        b: "ｂ",
        c: "ｃ",
        d: "ｄ",
        e: "ｅ",
        f: "ｆ",
        g: "ｇ",
        h: "ｈ",
        i: "ｉ",
        j: "ｊ",
        k: "ｋ",
        l: "ｌ",
        m: "ｍ",
        n: "ｎ",
        o: "ｏ",
        p: "ｐ",
        q: "ｑ",
        r: "ｒ",
        s: "ｓ",
        t: "ｔ",
        u: "ｕ",
        v: "ｖ",
        w: "ｗ",
        x: "ｘ",
        y: "ｙ",
        z: "ｚ",
        "{": "｛",
        "|": "｜",
        "}": "｝",
        "~": "～",
      };
      return text
        .split("")
        .map((char) => fullWidthMap[char] || char)
        .join("");
    },
    "Hebrew Like": (text: string) => {
      const hebrewLikeMap = {
        a: "ץ",
        b: "ק",
        c: "є",
        d: "๏",
        e: "г",
        f: "ק",
        g: "ร",
        h: "Շ",
        i: "є",
        j: "ץ",
        k: "๏",
        l: "г",
        m: "ק",
        n: "ร",
        o: "Շ",
        p: "є",
        q: "ץ",
        r: "ק",
        s: "ร",
        t: "Շ",
        u: "ย",
        v: "ς",
        w: "ฬ",
        x: "χ",
        y: "ץ",
        z: "z",
        A: "ץ",
        B: "ק",
        C: "є",
        D: "๏",
        E: "г",
        F: "ק",
        G: "ร",
        H: "Շ",
        I: "є",
        J: "ץ",
        K: "๏",
        L: "г",
        M: "ק",
        N: "ร",
        O: "Շ",
        P: "є",
        Q: "ץ",
        R: "ק",
        S: "ร",
        T: "Շ",
        U: "ย",
        V: "ς",
        W: "ฬ",
        X: "χ",
        Y: "ץ",
        Z: "z",
      };
      return text
        .split("")
        .map((char) => hebrewLikeMap[char] || char)
        .join("");
    },
    "Negative Squared": (text: string) => {
      const negativeSquaredMap = {
        a: "🅰",
        b: "🅱",
        c: "🅲",
        d: "🅳",
        e: "🅴",
        f: "🅵",
        g: "🅶",
        h: "🅷",
        i: "🅸",
        j: "🅹",
        k: "🅺",
        l: "🅻",
        m: "🅼",
        n: "🅽",
        o: "🅾",
        p: "🅿",
        q: "🆀",
        r: "🆁",
        s: "🆂",
        t: "🆃",
        u: "🆄",
        v: "🆅",
        w: "🆆",
        x: "🆇",
        y: "🆈",
        z: "🆉",
        A: "🅰",
        B: "🅱",
        C: "🅲",
        D: "🅳",
        E: "🅴",
        F: "🅵",
        G: "🅶",
        H: "🅷",
        I: "🅸",
        J: "🅹",
        K: "🅺",
        L: "🅻",
        M: "🅼",
        N: "🅽",
        O: "🅾",
        P: "🅿",
        Q: "🆀",
        R: "🆁",
        S: "🆂",
        T: "🆃",
        U: "🆄",
        V: "🆅",
        W: "🆆",
        X: "🆇",
        Y: "🆈",
        Z: "🆉",
        "0": "⓪",
        "1": "①",
        "2": "②",
        "3": "③",
        "4": "④",
        "5": "⑤",
        "6": "⑥",
        "7": "⑦",
        "8": "⑧",
        "9": "⑨",
      };
      return text
        .split("")
        .map((char) => negativeSquaredMap[char] || char)
        .join("");
    },
    "Cursive Handwriting": (text: string) => {
      const cursiveHandwritingMap = {
        y: "ყ",
        s: "ʂ",
        c: "ƈ",
        h: "ԋ",
        e: "ҽ",
        r: "ɾ",
      };
      return text
        .split("")
        .map((char) => cursiveHandwritingMap[char] || char)
        .join("");
    },
    Lisu: (text: string) => {
      const lisuMap = {
        a: "ꁲ",
        b: "ꄳ",
        c: "ꄻ",
        d: "ꄍ",
        e: "ꄟ",
        f: "ꄦ",
        g: "ꄧ",
        h: "ꄢ",
        i: "ꄨ",
        j: "ꄩ",
        k: "ꄪ",
        l: "ꄫ",
        m: "ꄭ",
        n: "ꄧ",
        o: "ꄬ",
        p: "ꄱ",
        q: "ꄸ",
        r: "ꄲ",
        s: "ꄳ",
        t: "ꄮ",
        u: "ꄯ",
        v: "ꄲ",
        w: "ꄟ",
        x: "ꄗ",
        y: "ꌦ",
        z: "ꄞ",
        A: "ꐎ",
        B: "ꌩ",
        C: "ꄒ",
        D: "ꄟ",
        E: "ꄍ",
        F: "ꄞ",
        G: "ꌗ",
        H: "ꌠ",
        I: "ꌤ",
        J: "ꌞ",
        K: "ꌕ",
        L: "ꌗ",
        M: "ꌩ",
        N: "ꌦ",
        O: "ꌜ",
        P: "ꌤ",
        Q: "ꌚ",
        R: "ꌩ",
        S: "ꌪ",
        T: "ꌤ",
        U: "ꌬ",
        V: "ꌭ",
        W: "ꌮ",
        X: "ꌯ",
        Y: "ꌩ",
        Z: "ꌨ",
        "0": "ꄶ",
        "1": "ꄸ",
        "2": "ꄹ",
        "3": "ꄺ",
        "4": "ꄻ",
        "5": "ꄼ",
        "6": "ꄽ",
        "7": "ꄾ",
        "8": "ꄿ",
        "9": "ꅀ",
      };
      return text
        .split("")
        .map((char) => lisuMap[char] || char)
        .join("");
    },
    "Script Math": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d49c;
      const baseStartLower = 0x1d4b6;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7d0 + (charCode - 48));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Fraktur Math": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d504;
      const baseStartLower = 0x1d51e;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7da + (charCode - 48));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    Circled: (text: string) => {
      const circledMap = {
        A: "Ⓐ",
        B: "Ⓑ",
        C: "Ⓒ",
        D: "Ⓓ",
        E: "Ⓔ",
        F: "Ⓕ",
        G: "Ⓖ",
        H: "Ⓗ",
        I: "Ⓘ",
        J: "Ⓙ",
        K: "Ⓚ",
        L: "Ⓛ",
        M: "Ⓜ",
        N: "Ⓝ",
        O: "Ⓞ",
        P: "Ⓟ",
        Q: "Ⓠ",
        R: "Ⓡ",
        S: "Ⓢ",
        T: "Ⓣ",
        U: "Ⓤ",
        V: "Ⓥ",
        W: "Ⓦ",
        X: "Ⓧ",
        Y: "Ⓨ",
        Z: "Ⓩ",
        a: "ⓐ",
        b: "ⓑ",
        c: "ⓒ",
        d: "ⓓ",
        e: "ⓔ",
        f: "ⓕ",
        g: "ⓖ",
        h: "ⓗ",
        i: "ⓘ",
        j: "ⓙ",
        k: "ⓚ",
        l: "ⓛ",
        m: "ⓜ",
        n: "ⓝ",
        o: "ⓞ",
        p: "ⓟ",
        q: "ⓠ",
        r: "ⓡ",
        s: "ⓢ",
        t: "ⓣ",
        u: "ⓤ",
        v: "ⓥ",
        w: "ⓦ",
        x: "ⓧ",
        y: "ⓨ",
        z: "ⓩ",
        "0": "⓪",
        "1": "①",
        "2": "②",
        "3": "③",
        "4": "④",
        "5": "⑤",
        "6": "⑥",
        "7": "⑦",
        "8": "⑧",
        "9": "⑨",
      };
      return text
        .split("")
        .map((char) => circledMap[char] || char)
        .join("");
    },
    "Block Like": (text: string) => {
      const blockLikeMap = {
        T: "T",
        Y: "Y",
        P: "ᑭ",
        E: "E",
        O: "O",
        R: "ᖇ",
        A: "ᗩ",
        S: "ᔕ",
        C: "ᑕ",
        N: "ᑎ",
        H: "ᕼ",
      };
      return text
        .split("")
        .map((char) => blockLikeMap[char] || char)
        .join("");
    },
    "Georgian/Cyrillic Mix": (text: string) => {
      const map = {
        T: "T",
        y: "ყ",
        p: "ρ",
        e: "ҽ",
        o: "σ",
        r: "ɾ",
        a: "α",
        s: "ʂ",
        t: "ƚ",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    "Small Caps Font": (text: string) => {
      const map = {
        T: "T",
        y: "ꌦ",
        p: "ꉣ",
        e: "ꏂ",
        o: "ꄲ",
        r: "ꋪ",
        a: "ꋬ",
        s: "ꇙ",
        t: "ꇶ",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    "Gothic/Fraktur": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d504;
      const baseStartLower = 0x1d51e;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Fullwidth/Aesthetic": (text: string) => {
      const fullWidthMap = {
        " ": "　",
        "!": "！",
        '"': "＂",
        "#": "＃",
        $: "＄",
        "%": "％",
        "&": "＆",
        "'": "＇",
        "(": "（",
        ")": "）",
        "*": "＊",
        "+": "＋",
        ",": "，",
        "-": "－",
        ".": "．",
        "/": "／",
        "0": "０",
        "1": "１",
        "2": "２",
        "3": "３",
        "4": "４",
        "5": "５",
        "6": "６",
        "7": "７",
        "8": "８",
        "9": "９",
        ":": "：",
        ";": "；",
        "<": "＜",
        "=": "＝",
        ">": "＞",
        "?": "？",
        "@": "＠",
        A: "Ａ",
        B: "Ｂ",
        C: "Ｃ",
        D: "Ｄ",
        E: "Ｅ",
        F: "Ｆ",
        G: "Ｇ",
        H: "Ｈ",
        I: "Ｉ",
        J: "Ｊ",
        K: "Ｋ",
        L: "Ｌ",
        M: "Ｍ",
        N: "Ｎ",
        O: "Ｏ",
        P: "Ｐ",
        Q: "Ｑ",
        R: "Ｒ",
        S: "Ｓ",
        T: "Ｔ",
        U: "Ｕ",
        V: "Ｖ",
        W: "Ｗ",
        X: "Ｘ",
        Y: "Ｙ",
        Z: "Ｚ",
        "[": "［",
        "\\": "＼",
        "]": "］",
        "^": "＾",
        _: "＿",
        "`": "｀",
        a: "ａ",
        b: "ｂ",
        c: "ｃ",
        d: "ｄ",
        e: "ｅ",
        f: "ｆ",
        g: "ｇ",
        h: "ｈ",
        i: "ｉ",
        j: "ｊ",
        k: "ｋ",
        l: "ｌ",
        m: "ｍ",
        n: "ｎ",
        o: "ｏ",
        p: "ｐ",
        q: "ｑ",
        r: "ｒ",
        s: "ｓ",
        t: "ｔ",
        u: "ｕ",
        v: "ｖ",
        w: "ｗ",
        x: "ｘ",
        y: "ｙ",
        z: "ｚ",
        "{": "｛",
        "|": "｜",
        "}": "｝",
        "~": "～",
      };
      return text
        .split("")
        .map((char) => fullWidthMap[char] || char)
        .join("");
    },
    "Cursive Script": (text: string) => {
      const map = {
        T: "𝓣",
        y: "𝔂",
        p: "𝓹",
        e: "𝓮",
        o: "𝓸",
        r: "𝓻",
        a: "𝓪",
        s: "𝓼",
        t: "𝓽",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    "Squared Letters": (text: string) => {
      const map = {
        T: "🅃",
        y: "🅈",
        p: "🄿",
        e: "🄴",
        o: "🄾",
        r: "🅁",
        a: "🄰",
        s: "🅂",
        t: "🅃",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    "Circled Letters": (text: string) => {
      const map = {
        T: "Ⓣ",
        y: "ⓨ",
        p: "ⓟ",
        e: "ⓔ",
        o: "ⓞ",
        r: "ⓡ",
        a: "ⓐ",
        s: "ⓢ",
        t: "ⓣ",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    "Small Caps": (text: string) => {
      const map = {
        T: "T",
        y: "ʏ",
        p: "ᴘ",
        e: "ᴇ",
        o: "ᴏ",
        r: "ʀ",
        a: "ᴀ",
        s: "ꜱ",
        t: "ᴛ",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    Script: (text: string) => {
      const map = {
        T: "𝒯",
        y: "𝓎",
        p: "𝓅",
        e: "ℯ",
        o: "ℴ",
        r: "𝓇",
        a: "𝒶",
        s: "𝓈",
        t: "𝓉",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    Italic: (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d400;
      const baseStartLower = 0x1d41a;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    Bold: (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d400;
      const baseStartLower = 0x1d41a;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(0x1d400 + (charCode - 65)); // Bold Upper
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(0x1d41a + (charCode - 97)); // Bold Lower
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7ce + (charCode - 48)); // Bold number
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Currency/Symbol Mix": (text: string) => {
      const map = {
        T: "T",
        y: "Ɏ",
        p: "₱",
        e: "Ɇ",
        o: "Ø",
        r: "Ɽ",
        a: "₳",
        s: "₴",
        t: "₮",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    "Medieval/Gothic": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d504;
      const baseStartLower = 0x1d51e;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else {
          output += text[i];
        }
      }
      return output;
    },

    "Rune-like": (text: string) => {
      const map = {
        T: "T",
        y: "ꐞ",
        p: "ꉣ",
        e: "ꈼ",
        o: "ꂦ",
        r: "ꌅ",
        a: "ꁲ",
        s: "ꌚ",
        t: "ꅀ",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    "Thai-influenced": (text: string) => {
      const map = {
        T: "T",
        y: "ץ",
        p: "ק",
        e: "є",
        o: "๏",
        r: "г",
        a: "ค",
        s: "ร",
        t: "Շ",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    "Squared Bold": (text: string) => {
      const map = {
        T: "🆃",
        y: "🆈",
        p: "🅿",
        e: "🅴",
        o: "🅾",
        r: "🆁",
        a: "🅰",
        s: "🆂",
        t: "🆃",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },
    Monospace: (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d670;
      const baseStartLower = 0x1d68a;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7f6 + (charCode - 48));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Bold Sans-Serif": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1d5a0;
      const baseStartLower = 0x1d5ba;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(
            baseStartUpper + (charCode - baseOffset)
          );
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1d7d8 + (charCode - 48));
        } else {
          output += text[i];
        }
      }
      return output;
    },
    "Small Caps Bold": (text: string) => {
      const map = {
        T: "T",
        y: "Y",
        p: "ᑭ",
        e: "E",
        o: "O",
        r: "ᖇ",
        a: "A",
        s: "S",
        t: "T",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },

    "Japanese-inspired": (text: string) => {
      const map = {
        T: "T",
        y: "と",
        p: "尸",
        e: "ヨ",
        o: "回",
        r: "尺",
        a: "丹",
        s: "丂",
        t: "匕",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },

    "Armenian Mix": (text: string) => {
      const map = {
        T: "T",
        y: "ʏ",
        p: "ք",
        e: "ɛ",
        o: "օ",
        r: "ʀ",
        a: "ǟ",
        s: "ֆ",
        t: "ȶ",
      };
      return text
        .split("")
        .map((char) => map[char] || char)
        .join("");
    },

    // Mixed Styles and Math Symbols are too complex for simple char maps.  You would need more advanced logic to mix styles.
  };

  const generateFonts = (text: string) => {
    let generatedText = "";
    for (const styleName in fontStyles) {
      generatedText += fontStyles[styleName](text) + "\n";
    }
    setOutputText(generatedText);
  };

  return (
    <ToolLayout title="Facebook Font Generator" hideHeader={true}>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Facebook Font Generator</h1>
        <div className="grid grid-cols-2 gap-4 flex">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Input Text</h2>
            <Textarea
              placeholder="Type or paste your content here"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                generateFonts(e.target.value);
              }}
              className="w-full min-h-[300px] mb-4 flex-1"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">Output Text</h2>
            <Textarea
              readOnly
              placeholder="Styled text will appear here"
              value={outputText}
              className="flex-1 min-h-[300px]"
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

export default FacebookFontGenerator;
