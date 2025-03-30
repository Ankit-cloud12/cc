const fontStyles = {
    "Normal Text": (text: string) => text,
    "Enclosed": (text: string) => {
      const enclosedMap = {
        "a": "🅐", "b": "🅑", "c": "🅒", "d": "🅓", "e": "🅔", "f": "🅕", "g": "🅖", "h": "🅗", "i": "🅘", "j": "🅙", "k": "🅚", "l": "🅛", "m": "🅜", "n": "🅝", "o": "🅞", "p": "🅟", "q": "🅠", "r": "🅡", "s": "🅢", "t": "🅣", "u": "🅤", "v": "🅥", "w": "🅦", "x": "🅧", "y": "🅨", "z": "🅩",
        "A": "🅐", "B": "🅑", "C": "🅒", "D": "🅓", "E": "🅔", "F": "🅕", "G": "🅖", "H": "🅗", "I": "🅘", "J": "🅙", "K": "🅚", "L": "🅛", "M": "🅜", "N": "🅝", "O": "🅞", "P": "🅟", "Q": "🅠", "R": "🅡", "S": "🅢", "T": "🅣", "U": "🅤", "V": "🅥", "W": "🅦", "X": "🅧", "Y": "🅨", "Z": "🅩",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨"
      };
      return text
        .split("")
        .map((char) => enclosedMap[char] || char)
        .join("");
    },
     "Bold Sans": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1D5B2;
      const baseStartLower = 0x1D5EA;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(baseStartUpper + (charCode - baseOffset));
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1D7D8 + (charCode - 48));
        }
         else {
          output += text[i];
        }
      }
      return output;
    },
    "Italic Math": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1D434;
      const baseStartLower = 0x1D44E;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(baseStartUpper + (charCode - baseOffset));
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1D7C0 + (charCode - 48));
        }
         else {
          output += text[i];
        }
      }
      return output;
    },
    "Full Width": (text: string) => {
      const fullWidthMap = {
        " ": "　", "!": "！", '"': "＂", "#": "＃", "$": "＄", "%": "％", "&": "＆", "'": "＇", "(": "（", ")": "）", "*": "＊", "+": "＋", ",": "，", "-": "－", ".": "．", "/": "／", "0": "０", "1": "１", "2": "２", "3": "３", "4": "４", "5": "５", "6": "６", "7": "７", "8": "８", "9": "９", ":": "：", ";": "；", "<": "＜", "=": "＝", ">": "＞", "?": "？", "@": "＠", "A": "Ａ", "B": "Ｂ", "C": "Ｃ", "D": "Ｄ", "E": "Ｅ", "F": "Ｆ", "G": "Ｇ", "H": "Ｈ", "I": "Ｉ", "J": "Ｊ", "K": "Ｋ", "L": "Ｌ", "M": "Ｍ", "N": "Ｎ", "O": "Ｏ", "P": "Ｐ", "Q": "Ｑ", "R": "Ｒ", "S": "Ｓ", "T": "Ｔ", "U": "Ｕ", "V": "Ｖ", "W": "Ｗ", "X": "Ｘ", "Y": "Ｙ", "Z": "Ｚ", "[": "［", "\\": "＼", "]": "］", "^": "＾", "_": "＿", "`": "｀", "a": "ａ", "b": "ｂ", "c": "ｃ", "d": "ｄ", "e": "ｅ", "f": "ｆ", "g": "ｇ", "h": "ｈ", "i": "ｉ", "j": "ｊ", "k": "ｋ", "l": "ｌ", "m": "ｍ", "n": "ｎ", "o": "ｏ", "p": "ｐ", "q": "ｑ", "r": "ｒ", "s": "ｓ", "t": "ｔ", "u": "ｕ", "v": "ｖ", "w": "ｗ", "x": "ｘ", "y": "ｙ", "z": "ｚ", "{": "｛", "|": "｜", "}": "｝", "~": "～"
      };
      return text
        .split("")
        .map((char) => fullWidthMap[char] || char)
        .join("");
    },
    "Hebrew Like": (text: string) => {
      const hebrewLikeMap = {
        "a": "ץ", "b": "ק", "c": "є", "d": "๏", "e": "г", "f": "ק", "g": "ร", "h": "Շ", "i": "є", "j": "ץ", "k": "๏", "l": "г", "m": "ק", "n": "ร", "o": "Շ", "p": "є", "q": "ץ", "r": "ק", "s": "ร", "t": "Շ", "u": "ย", "v": "ς", "w": "ฬ", "x": "χ", "y": "ץ", "z": "z",
        "A": "ץ", "B": "ק", "C": "є", "D": "๏", "E": "г", "F": "ק", "G": "ร", "H": "Շ", "I": "є", "J": "ץ", "K": "๏", "L": "г", "M": "ק", "N": "ร", "O": "Շ", "P": "є", "Q": "ץ", "R": "ק", "S": "ร", "T": "Շ", "U": "ย", "V": "ς", "W": "ฬ", "X": "χ", "Y": "ץ", "Z": "z"
      };
      return text
        .split("")
        .map((char) => hebrewLikeMap[char] || char)
        .join("");
    },
    "Negative Squared": (text: string) => {
      const negativeSquaredMap = {
        "a": "🅰", "b": "🅱", "c": "🅲", "d": "🅳", "e": "🅴", "f": "🅵", "g": "🅶", "h": "🅷", "i": "🅸", "j": "🅹", "k": "🅺", "l": "🅻", "m": "🅼", "n": "🅽", "o": "🅾", "p": "🅿", "q": "🆀", "r": "🆁", "s": "🆂", "t": "🆃", "u": "🆄", "v": "🆅", "w": "🆆", "x": "🆇", "y": "🆈", "z": "🆉",
        "A": "🅰", "B": "🅱", "C": "🅲", "D": "🅳", "E": "🅴", "F": "🅵", "G": "🅶", "H": "🅷", "I": "🅘", "J": "🅙", "K": "🅺", "L": "🅻", "M": "🅼", "N": "🅽", "O": "🅾", "P": "🅿", "Q": "🆀", "R": "🆁", "S": "🆂", "T": "🆃", "U": "🆄", "V": "🆅", "W": "🆆", "X": "🆇", "Y": "🆈", "Z": "🆉",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨"
      };
      return text
        .split("")
        .map((char) => negativeSquaredMap[char] || char)
        .join("");
    },
     "Cursive Handwriting": (text: string) => {
      const cursiveHandwritingMap = {
        "y": "ყ", "s": "ʂ", "c": "ƈ", "h": "ԋ", "e": "ҽ", "r": "ɾ"
      };
      return text
        .split("")
        .map((char) => cursiveHandwritingMap[char] || char)
        .join("");
    },
    "CJK Like": (text: string) => {
      const cjkLikeMap = {
        "T": "T", "Y": "と", "P": "尸", "E": "ヨ", "O": "回", "R": "尺", "A": "丹", "S": "丂", "C": "と", "N": "刀", "H": "廾"
      };
      return text
        .split("")
        .map((char) => cjkLikeMap[char] || char)
        .join("");
    },
    "Lisu": (text: string) => {
      const lisuMap = {
        "a": "ꁲ", "b": "ꄳ", "c": "ꄻ", "d": "ꄍ", "e": "ꄟ", "f": "ꄦ", "g": "ꄧ", "h": "ꄢ", "i": "ꄨ", "j": "ꄩ", "k": "ꄪ", "l": "ꄫ", "m": "ꄭ", "n": "ꄧ", "o": "ꄬ", "p": "ꄱ", "q": "ꄸ", "r": "ꄲ", "s": "ꄳ", "t": "ꄮ", "u": "ꄯ", "v": "ꄲ", "w": "ꄟ", "x": "ꄗ", "y": "ꌦ", "z": "ꄞ",
        "A": "ꐎ", "B": "ꌩ", "C": "ꄒ", "D": "ꄟ", "E": "ꄍ", "F": "ꄞ", "G": "ꌗ", "H": "ꌠ", "I": "ꌤ", "J": "ꌞ", "K": "ꌕ", "L": "ꌗ", "M": "ꌩ", "N": "ꌦ", "O": "ꌜ", "P": "ꌤ", "Q": "ꌚ", "R": "ꌩ", "S": "ꌪ", "T": "ꌤ", "U": "ꌬ", "V": "ꌭ", "W": "ꌮ", "X": "ꌯ", "Y": "ꌩ", "Z": "ꌨ",
        "0": "ꄶ", "1": "ꄸ", "2": "ꄹ", "3": "ꄺ", "4": "ꄻ", "5": "ꄼ", "6": "ꄽ", "7": "ꄾ", "8": "ꄿ", "9": "ꅀ"
      };
      return text
        .split("")
        .map((char) => lisuMap[char] || char)
        .join("");
    },
     "Script Math": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1D49C;
      const baseStartLower = 0x1D4B6;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(baseStartUpper + (charCode - baseOffset));
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1D7D0 + (charCode - 48));
        }
         else {
          output += text[i];
        }
      }
      return text
        .split("")
        .map((char) => scriptMathMap[char] || char)
        .join("");
    },
    "Fraktur Math": (text: string) => {
      let output = "";
      const baseStartUpper = 0x1D504;
      const baseStartLower = 0x1D51E;
      const baseOffset = 65;
      for (let i = 0; i < text.length; i++) {
        let charCode = text.charCodeAt(i);
        if (charCode >= 65 && charCode <= 90) {
          output += String.fromCharCode(baseStartUpper + (charCode - baseOffset));
        } else if (charCode >= 97 && charCode <= 122) {
          output += String.fromCharCode(baseStartLower + (charCode - 97));
        } else if (charCode >= 48 && charCode <= 57) {
          output += String.fromCharCode(0x1D7DA + (charCode - 48));
        }
         else {
          output += text[i];
        }
      }
      return output;
    },
     "Circled": (text: string) => {
      const circledMap = {
        "A": "Ⓐ", "B": "Ⓑ", "C": "Ⓒ", "D": "Ⓓ", "E": "Ⓔ", "F": "Ⓕ", "G": "Ⓖ", "H": "Ⓗ", "I": "Ⓘ", "J": "Ⓙ", "K": "Ⓚ", "L": "Ⓛ", "M": "Ⓜ", "N": "Ⓝ", "O": "Ⓞ", "P": "Ⓟ", "Q": "Ⓠ", "R": "Ⓡ", "S": "Ⓢ", "T": "Ⓣ", "U": "Ⓤ", "V": "Ⓥ", "W": "Ⓦ", "X": "Ⓧ", "Y": "Ⓨ", "Z": "Ⓩ",
        "a": "ⓐ", "b": "ⓑ", "c": "ⓒ", "d": "ⓓ", "e": "ⓔ", "f": "ⓕ", "g": "ⓖ", "h": "ⓗ", "i": "ⓘ", "j": "ⓙ", "k": "ⓚ", "l": "ⓛ", "m": "ⓜ", "n": "ⓝ", "o": "ⓞ", "p": "ⓟ", "q": "ⓠ", "r": "ⓡ", "s": "ⓢ", "t": "ⓣ", "u": "ⓤ", "v": "ⓥ", "w": "ⓦ", "x": "ⓧ", "y": "ⓨ", "z": "ⓩ",
        "0": "⓪", "1": "①", "2": "②", "3": "③", "4": "④", "5": "⑤", "6": "⑥", "7": "⑦", "8": "⑧", "9": "⑨"
      };
      return text
        .split("")
        .map((char) => circledMap[char] || char)
        .join("");
    },
     "Block Like": (text: string) => {
      const blockLikeMap = {
        "T": "T", "Y": "Y", "P": "ᑭ", "E": "E", "O": "O", "R": "ᖇ", "A": "ᗩ", "S": "ᔕ", "C": "ᑕ", "N": "ᑎ", "H": "ᕼ"
      };
      return text
        .split("")
        .map((char) => blockLikeMap[char] || char)
        .join("");
    },
    // Other font styles...
  };

export { fontStyles };
</diff>
</replace_in_file>
