import React, { useState, useEffect } from "react";
import { Check, Copy, Trash2, Share2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Types
type UnicodeStyle =
  | "normal" | "bold" | "italic" | "boldItalic" | "sans" | "sansBold" | "sansItalic" | "sansBoldItalic"
  | "monospace" | "scriptCursive" | "frakturGothic" | "doubleStruck" | "circled" | "negativeCircled"
  | "squared" | "negativeSquared" | "parenthesized" | "smallCaps" | "superscript" | "subscript"
  | "fullWidth" | "strikethrough" | "underline" | "regional" | "dotted" | "wideStretched"
  | "inverted" | "brackets" | "customFrame1" | "customFrame2" | "waveAbove" | "waveBelow"
  | "dotAbove" | "dotBelow";

interface StyleCardProps {
  styleKey: UnicodeStyle;
  style: UnicodeStyle;
  compatiblePlatforms: string[];
  setStyle: (style: UnicodeStyle) => void;
}

// Constants
const styleCategories: Record<string, UnicodeStyle[]> = {
  mathematical: ["bold", "italic", "boldItalic", "sans", "sansBold", "sansItalic", "sansBoldItalic", "monospace", "doubleStruck"],
  aesthetics: ["scriptCursive", "frakturGothic", "smallCaps", "wideStretched", "inverted"],
  symbols: ["circled", "negativeCircled", "squared", "negativeSquared", "parenthesized", "regional"],
  decorations: ["strikethrough", "underline", "dotted", "waveAbove", "waveBelow", "dotAbove", "dotBelow", "brackets", "customFrame1", "customFrame2"],
  specialty: ["superscript", "subscript", "fullWidth"]
};

const styleNames: Record<UnicodeStyle, string> = {
  normal: "Normal", bold: "𝐁𝐨𝐥𝐝", italic: "𝐼𝑡𝑎𝑙𝑖𝑐", boldItalic: "𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄", sans: "𝖲𝖺𝗇𝗌",
  sansBold: "𝗦𝗮𝗻𝘀 𝗕𝗼𝗹𝗱", sansItalic: "𝘚𝘢𝘯𝘴 𝘐𝘵𝘢𝘭𝘪𝘤", sansBoldItalic: "𝙎𝙖𝙣𝙨 𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘",
  monospace: "𝚖𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎", scriptCursive: "𝓒𝓾𝓻𝓼𝓲𝓿𝓮", frakturGothic: "𝔉𝔯𝔞𝔨𝔱𝔲𝔯",
  doubleStruck: "𝕯𝖔𝖚𝖇𝖑𝖊 𝕾𝖙𝖗𝖚𝖈𝖐", circled: "Ⓒⓘⓡⓒⓛⓔⓓ", negativeCircled: "🅝🅔🅖🅐🅣🅘🅥🅔",
  squared: "🅂🅀🅄🄰🅁🄴🄳", negativeSquared: "🆂🆀🆄🅰🆁🅴🅳", parenthesized: "⒫⒜⒭⒠⒩⒯⒣⒠⒮⒤⒵⒠⒟",
  smallCaps: "ꜱᴍᴀʟʟ ᴄᴀᴘꜱ", superscript: "ˢᵘᵖᵉʳˢᶜʳⁱᵖᵗ", subscript: "ₛᵤᵦₛ𝒸ᵣᵢₚₜ",
  fullWidth: "Ｆｕｌｌ　Ｗｉｄｔｈ", strikethrough: "S̶t̶r̶i̶k̶e̶", underline: "U̲n̲d̲e̲r̲l̲i̲n̲e̲",
  regional: "🇷 🇪 🇬 🇮 🇴 🇳 🇦 🇱", dotted: "D̾o̾t̾t̾e̾d̾", wideStretched: "W i d e",
  inverted: "pǝʇɹǝʌuI", brackets: "⟦Text⟧", customFrame1: "『Text』", customFrame2: "「Text」",
  waveAbove: "W̴a̴v̴e̴", waveBelow: "W̳a̳v̳e̳", dotAbove: "Ḋȯṫ", dotBelow: "Ḍọṭ"
};

const compatibilityInfo: Record<string, UnicodeStyle[]> = {
  facebook: ["bold", "italic", "boldItalic", "sans", "sansBold", "sansItalic", "circled", "regional"],
  twitter: ["bold", "italic", "scriptCursive", "circled", "smallCaps", "strikethrough", "regional"],
  instagram: ["bold", "italic", "scriptCursive", "doubleStruck"],
  whatsapp: ["bold", "italic", "strikethrough", "monospace"],
  linkedin: ["bold", "italic", "underline"],
  reddit: ["bold", "italic", "strikethrough", "superscript", "subscript"],
  discord: ["bold", "italic", "strikethrough", "underline"]
};

const unicodeCharacterMap: Record<string, Record<string, string>> = {
  bold: {'A':'𝐀','B':'𝐁','C':'𝐂','D':'𝐃','E':'𝐄','F':'𝐅','G':'𝐆','H':'𝐇','I':'𝐈','J':'𝐉','K':'𝐊','L':'𝐋','M':'𝐌','N':'𝐍','O':'𝐎','P':'𝐏','Q':'𝐐','R':'𝐑','S':'𝐒','T':'𝐓','U':'𝐔','V':'𝐕','W':'𝐖','X':'𝐗','Y':'𝐘','Z':'𝐙','a':'𝐚','b':'𝐛','c':'𝐜','d':'𝐝','e':'𝐞','f':'𝐟','g':'𝐠','h':'𝐡','i':'𝐢','j':'𝐣','k':'𝐤','l':'𝐥','m':'𝐦','n':'𝐧','o':'𝐨','p':'𝐩','q':'𝐪','r':'𝐫','s':'𝐬','t':'𝐭','u':'𝐮','v':'𝐯','w':'𝐰','x':'𝐱','y':'𝐲','z':'𝐳','0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'},
  italic: {'A':'𝐴','B':'𝐵','C':'𝐶','D':'𝐷','E':'𝐸','F':'𝐹','G':'𝐺','H':'𝐻','I':'𝐼','J':'𝐽','K':'𝐾','L':'𝐿','M':'𝑀','N':'𝑁','O':'𝑂','P':'𝑃','Q':'𝑄','R':'𝑅','S':'𝑆','T':'𝑇','U':'𝑈','V':'𝑉','W':'𝑊','X':'𝑋','Y':'𝑌','Z':'𝑍','a':'𝑎','b':'𝑏','c':'𝑐','d':'𝑑','e':'𝑒','f':'𝑓','g':'𝑔','h':'ℎ','i':'𝑖','j':'𝑗','k':'𝑘','l':'𝑙','m':'𝑚','n':'𝑛','o':'𝑜','p':'𝑝','q':'𝑞','r':'𝑟','s':'𝑠','t':'𝑡','u':'𝑢','v':'𝑣','w':'𝑤','x':'𝑥','y':'𝑦','z':'𝑧'},
  boldItalic: {'A':'𝑨','B':'𝑩','C':'𝑪','D':'𝑫','E':'𝑬','F':'𝑭','G':'𝑮','H':'𝑯','I':'𝑰','J':'𝑱','K':'𝑲','L':'𝑳','M':'𝑴','N':'𝑵','O':'𝑶','P':'𝑷','Q':'𝑸','R':'𝑹','S':'𝑺','T':'𝑻','U':'𝑼','V':'𝑽','W':'𝑾','X':'𝑿','Y':'𝒀','Z':'𝒁','a':'𝒂','b':'𝒃','c':'𝒄','d':'𝒅','e':'𝒆','f':'𝒇','g':'𝒈','h':'𝒉','i':'𝒊','j':'𝒋','k':'𝒌','l':'𝒍','m':'𝒎','n':'𝒏','o':'𝒐','p':'𝒑','q':'𝒒','r':'𝒓','s':'𝒔','t':'𝒕','u':'𝒖','v':'𝒗','w':'𝒘','x':'𝒙','y':'𝒚','z':'𝒛'},
  sans: {'A':'𝖠','B':'𝖡','C':'𝖢','D':'𝖣','E':'𝖤','F':'𝖥','G':'𝖦','H':'𝖧','I':'𝖨','J':'𝖩','K':'𝖪','L':'𝖫','M':'𝖬','N':'𝖭','O':'𝖮','P':'𝖯','Q':'𝖰','R':'𝖱','S':'𝖲','T':'𝖳','U':'𝖴','V':'𝖵','W':'𝖶','X':'𝖷','Y':'𝖸','Z':'𝖹','a':'𝖺','b':'𝖻','c':'𝖼','d':'𝖽','e':'𝖾','f':'𝖿','g':'𝗀','h':'𝗁','i':'𝗂','j':'𝗃','k':'𝗄','l':'𝗅','m':'𝗆','n':'𝗇','o':'𝗈','p':'𝗉','q':'𝗊','r':'𝗋','s':'𝗌','t':'𝗍','u':'𝗎','v':'𝗏','w':'𝗐','x':'𝗑','y':'𝗒','z':'𝗓'},
  sansBold: {'A':'𝗔','B':'𝗕','C':'𝗖','D':'𝗗','E':'𝗘','F':'𝗙','G':'𝗚','H':'𝗛','I':'𝗜','J':'𝗝','K':'𝗞','L':'𝗟','M':'𝗠','N':'𝗡','O':'𝗢','P':'𝗣','Q':'𝗤','R':'𝗥','S':'𝗦','T':'𝗧','U':'𝗨','V':'𝗩','W':'𝗪','X':'𝗫','Y':'𝗬','Z':'𝗭','a':'𝗮','b':'𝗯','c':'𝗰','d':'𝗱','e':'𝗲','f':'𝗳','g':'𝗴','h':'𝗵','i':'𝗶','j':'𝗷','k':'𝗸','l':'𝗹','m':'𝗺','n':'𝗻','o':'𝗼','p':'𝗽','q':'𝗾','r':'𝗿','s':'𝘀','t':'𝘁','u':'𝘂','v':'𝘃','w':'𝘄','x':'𝘅','y':'𝘆','z':'𝘇','0':'𝟬','1':'𝟭','2':'𝟮','3':'𝟯','4':'𝟰','5':'𝟱','6':'𝟲','7':'𝟳','8':'𝟴','9':'𝟵'},
  sansItalic: {'A':'𝘈','B':'𝘉','C':'𝘊','D':'𝘋','E':'𝘌','F':'𝘍','G':'𝘎','H':'𝘏','I':'𝘐','J':'𝘑','K':'𝘒','L':'𝘓','M':'𝘔','N':'𝘕','O':'𝘖','P':'𝘗','Q':'𝘘','R':'𝘙','S':'𝘚','T':'𝘛','U':'𝘜','V':'𝘝','W':'𝘞','X':'𝘟','Y':'𝘠','Z':'𝘡','a':'𝘢','b':'𝘣','c':'𝘤','d':'𝘥','e':'𝘦','f':'𝘧','g':'𝘨','h':'𝘩','i':'𝘪','j':'𝘫','k':'𝘬','l':'𝘭','m':'𝘮','n':'𝘯','o':'𝘰','p':'𝘱','q':'𝘲','r':'𝘳','s':'𝘴','t':'𝘵','u':'𝘶','v':'𝘷','w':'𝘸','x':'𝘹','y':'𝘺','z':'𝘻'},
  sansBoldItalic: {'A':'𝙀','B':'𝙁','C':'𝙂','D':'𝙃','E':'𝙄','F':'𝙅','G':'𝙆','H':'𝙇','I':'𝙈','J':'𝙉','K':'𝙊','L':'𝙋','M':'𝙌','N':'𝙍','O':'𝙎','P':'𝙏','Q':'𝙐','R':'𝙑','S':'𝙒','T':'𝙓','U':'𝙔','V':'𝙕','W':'𝙖','X':'𝙗','Y':'𝙘','Z':'𝙙','a':'𝙚','b':'𝙛','c':'𝙜','d':'𝙝','e':'𝙞','f':'𝙟','g':'𝙠','h':'𝙡','i':'𝙢','j':'𝙣','k':'𝙤','l':'𝙥','m':'𝙦','n':'𝙧','o':'𝙨','p':'𝙩','q':'𝙪','r':'𝙫','s':'𝙬','t':'𝙭','u':'𝙮','v':'𝙯','w':'𝙰','x':'𝙱','y':'𝙲','z':'𝙳'},
  monospace: {'A':'𝙰','B':'𝙱','C':'𝙲','D':'𝙳','E':'𝙴','F':'𝙵','G':'𝙶','H':'𝙷','I':'𝙸','J':'𝙹','K':'𝙺','L':'𝙻','M':'𝙼','N':'𝙽','O':'𝙾','P':'𝙿','Q':'𝚀','R':'𝚁','S':'𝚂','T':'𝚃','U':'𝚄','V':'𝚅','W':'𝚆','X':'𝚇','Y':'𝚈','Z':'𝚉','a':'𝚊','b':'𝚋','c':'𝚌','d':'𝚍','e':'𝚎','f':'𝚏','g':'𝚐','h':'𝚑','i':'𝚒','j':'𝚓','k':'𝚔','l':'𝚕','m':'𝚖','n':'𝚗','o':'𝚘','p':'𝚙','q':'𝚚','r':'𝚛','s':'𝚜','t':'𝚝','u':'𝚞','v':'𝚟','w':'𝚠','x':'𝚡','y':'𝚢','z':'𝚣','0':'𝟶','1':'𝟷','2':'𝟸','3':'𝟹','4':'𝟺','5':'𝟻','6':'𝟼','7':'𝟽','8':'𝟾','9':'𝟿'},
  scriptCursive: {'A':'𝓐','B':'𝓑','C':'𝓒','D':'𝓓','E':'𝓔','F':'𝓕','G':'𝓖','H':'𝓗','I':'𝓘','J':'𝓙','K':'𝓚','L':'𝓛','M':'𝓜','N':'𝓝','O':'𝓞','P':'𝓟','Q':'𝓠','R':'𝓡','S':'𝓢','T':'𝓣','U':'𝓤','V':'𝓥','W':'𝓦','X':'𝓧','Y':'𝓨','Z':'𝓩','a':'𝓪','b':'𝓫','c':'𝓬','d':'𝓭','e':'𝓮','f':'𝓯','g':'𝓰','h':'𝓱','i':'𝓲','j':'𝓳','k':'𝓴','l':'𝓵','m':'𝓶','n':'𝓷','o':'𝓸','p':'𝓹','q':'𝓺','r':'𝓻','s':'𝓼','t':'𝓽','u':'𝓾','v':'𝓿','w':'𝔀','x':'𝔁','y':'𝔂','z':'𝔃'},
  frakturGothic: {'A':'𝔄','B':'𝔅','C':'𝕮','D':'𝕯','E':'𝔈','F':'𝔉','G':'𝔊','H':'𝕳','I':'𝕴','J':'𝕵','K':'𝕶','L':'𝕷','M':'𝕸','N':'𝕹','O':'𝕺','P':'𝕻','Q':'𝕼','R':'𝕽','S':'𝕾','T':'𝕿','U':'𝖀','V':'𝖁','W':'𝖂','X':'𝖃','Y':'𝖄','Z':'𝖅','a':'𝖆','b':'𝖇','c':'𝖈','d':'𝖉','e':'𝖊','f':'𝖋','g':'𝖌','h':'𝖍','i':'𝖎','j':'𝖏','k':'𝖐','l':'𝖑','m':'𝖒','n':'𝖓','o':'𝖔','p':'𝖕','q':'𝖖','r':'𝖗','s':'𝖘','t':'𝖙','u':'𝖚','v':'𝖛','w':'𝖜','x':'𝖝','y':'𝖞','z':'𝖟'},
  doubleStruck: {'A':'𝔸','B':'𝔹','C':'ℂ','D':'𝔻','E':'𝔼','F':'𝔽','G':'𝔾','H':'ℍ','I':'𝕀','J':'𝕁','K':'𝕂','L':'𝕃','M':'𝕄','N':'ℕ','O':'𝕆','P':'ℙ','Q':'ℚ','R':'ℝ','S':'𝕊','T':'𝕋','U':'𝕌','V':'𝕍','W':'𝕎','X':'𝕏','Y':'𝕐','Z':'ℤ','a':'𝕒','b':'𝕓','c':'𝕔','d':'𝕕','e':'𝕖','f':'𝕗','g':'𝕘','h':'𝕙','i':'𝕚','j':'𝕛','k':'𝕜','l':'𝕝','m':'𝕞','n':'𝕟','o':'𝕠','p':'𝕡','q':'𝕢','r':'𝕣','s':'𝕤','t':'𝕥','u':'𝕦','v':'𝕧','w':'𝕨','x':'𝕩','y':'𝕪','z':'𝕫','0':'𝟘','1':'𝟙','2':'𝟚','3':'𝟛','4':'𝟜','5':'𝟝','6':'𝟞','7':'𝟟','8':'𝟠','9':'𝟡'},
  circled: {'A':'Ⓐ','B':'Ⓑ','C':'Ⓒ','D':'Ⓓ','E':'Ⓔ','F':'Ⓕ','G':'Ⓖ','H':'Ⓗ','I':'Ⓘ','J':'Ⓙ','K':'Ⓚ','L':'Ⓛ','M':'Ⓜ','N':'Ⓝ','O':'Ⓞ','P':'Ⓟ','Q':'Ⓠ','R':'Ⓡ','S':'Ⓢ','T':'Ⓣ','U':'Ⓤ','V':'Ⓥ','W':'Ⓦ','X':'Ⓧ','Y':'Ⓨ','Z':'Ⓩ','a':'ⓐ','b':'ⓑ','c':'ⓒ','d':'ⓓ','e':'ⓔ','f':'ⓕ','g':'ⓖ','h':'ⓗ','i':'ⓘ','j':'ⓙ','k':'ⓚ','l':'ⓛ','m':'ⓜ','n':'ⓝ','o':'ⓞ','p':'ⓟ','q':'ⓠ','r':'ⓡ','s':'ⓢ','t':'ⓣ','u':'ⓤ','v':'ⓥ','w':'ⓦ','x':'ⓧ','y':'ⓨ','z':'ⓩ','0':'⓪','1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨'},
  negativeCircled: {'A':'🅐','B':'🅑','C':'🅒','D':'🅓','E':'🅔','F':'🅕','G':'🅖','H':'🅗','I':'🅘','J':'🅙','K':'🅚','L':'🅛','M':'🅜','N':'🅝','O':'🅞','P':'🅟','Q':'🅠','R':'🅡','S':'🅢','T':'🅣','U':'🅤','V':'🅥','W':'🅦','X':'🅧','Y':'🅨','Z':'🅩','a':'🅐','b':'🅑','c':'🅒','d':'🅓','e':'🅔','f':'🅕','g':'🅖','h':'🅗','i':'🅘','j':'🅙','k':'🅚','l':'🅛','m':'🅜','n':'🅝','o':'🅞','p':'🅟','q':'🅠','r':'🅡','s':'🅢','t':'🅣','u':'🅤','v':'🅥','w':'🅦','x':'🅧','y':'🅨','z':'🅩','0':'⓿','1':'❶','2':'❷','3':'❸','4':'❹','5':'❺','6':'❻','7':'❼','8':'❽','9':'❾'},
  squared: {'A':'🄰','B':'🄱','C':'🄲','D':'🄳','E':'🄴','F':'🄵','G':'🄶','H':'🄷','I':'🄸','J':'🄹','K':'🄺','L':'🄻','M':'🄼','N':'🄽','O':'🄾','P':'🄿','Q':'🅀','R':'🅁','S':'🅂','T':'🅃','U':'🅄','V':'🅅','W':'🅆','X':'🅇','Y':'🅈','Z':'🅉','a':'🄰','b':'🄱','c':'🄲','d':'🄳','e':'🄴','f':'🄵','g':'🄶','h':'🄷','i':'🄸','j':'🄹','k':'🄺','l':'🄻','m':'🄼','n':'🄽','o':'🄾','p':'🄿','q':'🅀','r':'🅁','s':'🅂','t':'🅃','u':'🅄','v':'🅅','w':'🅆','x':'🅇','y':'🅈','z':'🅉'},
  negativeSquared: {'A':'🅰','B':'🅱','C':'🅲','D':'🅳','E':'🅴','F':'🅵','G':'🅶','H':'🅷','I':'🅸','J':'🅹','K':'🅺','L':'🅻','M':'🅼','N':'🅽','O':'🅾','P':'🅿','Q':'🆀','R':'🆁','S':'🆂','T':'🆃','U':'🆄','V':'🆅','W':'🆆','X':'🆇','Y':'🆈','Z':'🆉','a':'🅰','b':'🅱','c':'🅲','d':'🅳','e':'🅴','f':'🅵','g':'🅶','h':'🅷','i':'🅸','j':'🅹','k':'🅺','l':'🅻','m':'🅼','n':'🅽','o':'🅾','p':'🅿','q':'🆀','r':'🆁','s':'🆂','t':'🆃','u':'🆄','v':'🆅','w':'🆆','x':'🆇','y':'🆈','z':'🆉'},
  parenthesized: {'A':'🄐','B':'🄑','C':'🄒','D':'🄓','E':'🄔','F':'🄕','G':'🄖','H':'🄗','I':'🄘','J':'🄙','K':'🄚','L':'🄛','M':'🄜','N':'🄝','O':'🄞','P':'🄟','Q':'🄠','R':'🄡','S':'🄢','T':'🄣','U':'🄤','V':'🄥','W':'🄦','X':'🄧','Y':'🄨','Z':'🄩','a':'⒜','b':'⒝','c':'⒞','d':'⒟','e':'⒠','f':'⒡','g':'⒢','h':'⒣','i':'⒤','j':'⒥','k':'⒦','l':'⒧','m':'⒨','n':'⒩','o':'⒪','p':'⒫','q':'⒬','r':'⒭','s':'⒮','t':'⒯','u':'⒰','v':'⒱','w':'⒲','x':'⒳','y':'⒴','z':'⒵','1':'⑴','2':'⑵','3':'⑶','4':'⑷','5':'⑸','6':'⑹','7':'⑺','8':'⑻','9':'⑼','0':'⑽'},
  smallCaps: {'A':'A','B':'B','C':'C','D':'D','E':'E','F':'F','G':'G','H':'H','I':'I','J':'J','K':'K','L':'L','M':'M','N':'N','O':'O','P':'P','Q':'Q','R':'R','S':'S','T':'T','U':'U','V':'V','W':'W','X':'X','Y':'Y','Z':'Z','a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'ǫ','r':'ʀ','s':'s','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'},
  superscript: {'A':'ᴬ','B':'ᴮ','C':'ᶜ','D':'ᴰ','E':'ᴱ','F':'ᶠ','G':'ᴳ','H':'ᴴ','I':'ᴵ','J':'ᴶ','K':'ᴷ','L':'ᴸ','M':'ᴹ','N':'ᴺ','O':'ᴼ','P':'ᴾ','Q':'Q','R':'ᴿ','S':'ˢ','T':'ᵀ','U':'ᵁ','V':'ⱽ','W':'ᵂ','X':'ˣ','Y':'ʸ','Z':'ᶻ','a':'ᵃ','b':'ᵇ','c':'ᶜ','d':'ᵈ','e':'ᵉ','f':'ᶠ','g':'ᵍ','h':'ʰ','i':'ⁱ','j':'ʲ','k':'ᵏ','l':'ˡ','m':'ᵐ','n':'ⁿ','o':'ᵒ','p':'ᵖ','q':'q','r':'ʳ','s':'ˢ','t':'ᵗ','u':'ᵘ','v':'ᵛ','w':'ʷ','x':'ˣ','y':'ʸ','z':'ᶻ','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹','+':'⁺','-':'⁻','=':'⁼','(':'⁽',')':'⁾'},
  subscript: {'A':'ₐ','B':'B','C':'C','D':'D','E':'ₑ','F':'F','G':'G','H':'ₕ','I':'ᵢ','J':'ⱼ','K':'ₖ','L':'ₗ','M':'ₘ','N':'ₙ','O':'ₒ','P':'ₚ','Q':'Q','R':'ᵣ','S':'ₛ','T':'ₜ','U':'ᵤ','V':'ᵥ','W':'W','X':'ₓ','Y':'Y','Z':'Z','a':'ₐ','b':'b','c':'c','d':'d','e':'ₑ','f':'f','g':'g','h':'ₕ','i':'ᵢ','j':'ⱼ','k':'ₖ','l':'ₗ','m':'ₘ','n':'ₙ','o':'ₒ','p':'ₚ','q':'q','r':'ᵣ','s':'ₛ','t':'ₜ','u':'ᵤ','v':'ᵥ','w':'w','x':'ₓ','y':'y','z':'z','0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉','+':'₊','-':'₋','=':'₌','(':'₍',')':'₎'},
  fullWidth: {'A':'Ａ','B':'Ｂ','C':'Ｃ','D':'Ｄ','E':'Ｅ','F':'Ｆ','G':'Ｇ','H':'Ｈ','I':'Ｉ','J':'Ｊ','K':'Ｋ','L':'Ｌ','M':'Ｍ','N':'Ｎ','O':'Ｏ','P':'Ｐ','Q':'Ｑ','R':'Ｒ','S':'Ｓ','T':'Ｔ','U':'Ｕ','V':'Ｖ','W':'Ｗ','X':'Ｘ','Y':'Ｙ','Z':'Ｚ','a':'ａ','b':'ｂ','c':'ｃ','d':'ｄ','e':'ｅ','f':'ｆ','g':'ｇ','h':'ｈ','i':'ｉ','j':'ｊ','k':'ｋ','l':'ｌ','m':'ｍ','n':'ｎ','o':'ｏ','p':'ｐ','q':'ｑ','r':'ｒ','s':'ｓ','t':'ｔ','u':'ｕ','v':'ｖ','w':'ｗ','x':'ｘ','y':'ｙ','z':'ｚ','0':'０','1':'１','2':'２','3':'３','4':'４','5':'５','6':'６','7':'７','8':'８','9':'９',' ':'　','!':'！','"':'＂','#':'＃','$':'＄','%':'％','&':'＆',"'":'＇','(':'（',')':'）','*':'＊','+':'＋',',':'，','-':'－','.':'．','/':'／',':':'：',';':'；','<':'＜','=':'＝','>':'＞','?':'？','@':'＠','[':'［','\\':'＼',']':'］','^':'＾','_':'＿','`':'｀','{':'｛','|':'｜','}':'｝','~':'～'},
  regional: {'A':'🇦','B':'🇧','C':'🇨','D':'🇩','E':'🇪','F':'🇫','G':'🇬','H':'🇭','I':'🇮','J':'🇯','K':'🇰','L':'🇱','M':'🇲','N':'🇳','O':'🇴','P':'🇵','Q':'🇶','R':'🇷','S':'🇸','T':'🇹','U':'🇺','V':'🇻','W':'🇼','X':'🇽','Y':'🇾','Z':'🇿','a':'🇦','b':'🇧','c':'🇨','d':'🇩','e':'🇪','f':'🇫','g':'🇬','h':'🇭','i':'🇮','j':'🇯','k':'🇰','l':'🇱','m':'🇲','n':'🇳','o':'🇴','p':'🇵','q':'🇶','r':'🇷','s':'🇸','t':'🇹','u':'🇺','v':'🇻','w':'🇼','x':'🇽','y':'🇾','z':'🇿'},
  inverted: {}, strikethrough: {}, underline: {}, waveAbove: {}, waveBelow: {}, dotted: {}, dotAbove: {}, dotBelow: {}, brackets: {}, customFrame1: {}, customFrame2: {}, normal: {}
};

// Style Card Component
const StyleCard: React.FC<StyleCardProps> = ({ styleKey, style, compatiblePlatforms, setStyle }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Card 
          className={`cursor-pointer transition-all overflow-hidden border ${
            style === styleKey
              ? 'bg-zinc-700 text-white border-zinc-500'
              : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'
          }`}
          onClick={() => setStyle(styleKey)}
        >
          <CardContent className="p-4 py-5 text-center">
            <div className="text-lg font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {styleNames[styleKey]}
            </div>
            {/* Removed compatibility platform badges */}
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent className="bg-zinc-800 border-zinc-700">
        <p className="font-medium">{styleNames[styleKey]}</p>
        {/* Removed compatibility info from tooltip */}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Main Component
const UnicodeTextConverter: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [style, setStyle] = useState<UnicodeStyle>("scriptCursive");
  const [copied, setCopied] = useState(false);
  const [recentStyles, setRecentStyles] = useState<UnicodeStyle[]>([]);
  const [activeTab, setActiveTab] = useState<keyof typeof styleCategories | "all">("all");
  const [examples] = useState([
    "𝕌𝕟𝕚𝕔𝕠𝕕𝕖 𝕋𝕖𝕩𝕥 ℂ𝕠𝕟𝕧𝕖𝕣𝕥𝕖𝕣",
    "𝓤𝓷𝓲𝓬𝓸𝓭𝓮 𝓣𝓮𝔁𝓽 𝓒𝓸𝓷𝓿𝓮𝓻𝓽𝓮𝓻",
    "Ⓤⓝⓘⓒⓞⓓⓔ Ⓣⓔⓧⓣ Ⓒⓞⓝⓥⓔⓡⓣⓔⓡ",
    "𝒰𝓃𝒾𝒸ℴ𝒹ℯ 𝒯ℯ𝓍𝓉 𝒞ℴ𝓃𝓋ℯ𝓇𝓉ℯ𝓇"
  ]);

  // Filter styles based on active tab
  const filteredStyles = activeTab === "all" 
    ? Object.keys(styleNames) as UnicodeStyle[]
    : styleCategories[activeTab] || [];

  useEffect(() => {
    updateOutput(inputText, style);
  }, [inputText, style]);

  const updateOutput = (text: string, selectedStyle: UnicodeStyle) => {
    setOutputText(convertText(text, selectedStyle));
    if (!recentStyles.includes(selectedStyle)) {
      setRecentStyles(prev => [selectedStyle, ...prev.slice(0, 4)]);
    }
  };

  const convertText = (text: string, selectedStyle: UnicodeStyle): string => {
    if (!text) return "";
    let result = "";
    const map = unicodeCharacterMap[selectedStyle];

    if (map) {
      result = text.split('').map(char => map[char] || char).join('');
    } else {
      switch (selectedStyle) {
        case "inverted":
          const invertedChars: Record<string, string> = {'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ᴉ','j':'ɾ','k':'ʞ','l':'l','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z','A':'∀','B':'q','C':'Ɔ','D':'p','E':'Ǝ','F':'Ⅎ','G':'פ','H':'H','I':'I','J':'ſ','K':'ʞ','L':'˥','M':'W','N':'N','O':'O','P':'Ԁ','Q':'Q','R':'ꓤ','S':'S','T':'┴','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z','0':'0','1':'Ɩ','2':'ᄅ','3':'Ɛ','4':'ㄣ','5':'ϛ','6':'9','7':'ㄥ','8':'8','9':'6',',':'\'','\'':',','!':'¡','?':'¿','.':'˙','"':'„','(':')',')':'(','[':']',']':'[','{':'}','}':'{','<':'>','>':'<','&':'⅋','_':'‾'};
          result = text.split('').reverse().map(c => invertedChars[c] || c).join('');
          break;
        case "wideStretched": result = text.split('').join(' '); break;
        case "strikethrough": result = text.split('').map(c => c + '\u0336').join(''); break;
        case "underline": result = text.split('').map(c => c + '\u0332').join(''); break;
        case "dotted": result = text.split('').map(c => c + '\u0307').join(''); break;
        case "waveAbove": result = text.split('').map(c => c + '\u0334').join(''); break;
        case "waveBelow": result = text.split('').map(c => c + '\u0330').join(''); break;
        case "dotAbove": result = text.split('').map(c => c + '\u0307').join(''); break;
        case "dotBelow": result = text.split('').map(c => c + '\u0323').join(''); break;
        case "brackets": result = text.split('').map(c => '【' + c + '】').join(''); break;
        case "customFrame1": result = text.split('').map(c => '『' + c + '』').join(''); break;
        case "customFrame2": result = text.split('').map(c => '「' + c + '」').join(''); break;
        case "regional":
          const regionalMap = unicodeCharacterMap[selectedStyle];
          result = text.split('').map(char => (regionalMap[char.toUpperCase()] || char) + ' ').join('');
          break;
        default: result = text;
      }
    }
    return result;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExampleClick = (example: string) => {
    setInputText(example);
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
  };

  const getCompatiblePlatforms = (styleKey: UnicodeStyle) => {
    return Object.entries(compatibilityInfo)
      .filter(([_, styles]) => styles.includes(styleKey))
      .map(([platform]) => platform);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="bg-zinc-800 text-white p-6 rounded-lg mb-6">
        <h1 className="text-3xl font-bold mb-2">Unicode Text Converter 2025</h1>
        <p className="text-gray-300 mb-4">
          Transform your text into beautiful Unicode styles for social media!
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {examples.map((example, i) => (
            <Badge 
              key={i}
              className="bg-white/20 hover:bg-white/30 text-white cursor-pointer px-3 py-1.5 text-base"
              onClick={() => handleExampleClick(example)}
            >
              {example}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Input/Output Section */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Input Text</h2>
            <Textarea
              placeholder="Type or paste your text here..."
              className="w-full min-h-[200px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded text-lg"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">Output Text</h2>
            <Textarea
              readOnly
              className="w-full min-h-[150px] bg-zinc-700 text-white border-zinc-600 mb-4 p-4 rounded text-lg"
              value={outputText}
              placeholder="Unicode styled text will appear here"
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleCopy}
                disabled={!outputText}
              >
                {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy to Clipboard"}
              </Button>
              <Button
                variant="outline"
                className="border-zinc-600 text-white hover:bg-zinc-600"
                onClick={handleClear}
                disabled={!inputText && !outputText}
              >
                <Trash2 className="w-4 h-4 mr-2" /> Clear
              </Button>
              {navigator.share && (
                <Button
                  variant="outline"
                  className="border-zinc-600 text-white hover:bg-zinc-600"
                  onClick={() => {
                    navigator.share({
                      title: 'Unicode Text',
                      text: outputText,
                    });
                  }}
                  disabled={!outputText}
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Styles Selection Section */}
        <div className="md:col-span-1">
          <Tabs defaultValue="all" value={activeTab} onValueChange={(value) => setActiveTab(value as keyof typeof styleCategories | "all")}>
            <div className="mb-6">
              <h2 className="text-xl font-bold flex items-center mb-4">
                <span className="mr-2">🎨</span> Style Categories
              </h2>
              <TabsList className="grid grid-cols-2 gap-2">
                <TabsTrigger value="all" className="px-4 py-2 rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 data-[state=active]:bg-indigo-600">All Styles</TabsTrigger>
                <TabsTrigger value="mathematical" className="px-4 py-2 rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 data-[state=active]:bg-indigo-600">Math & Text</TabsTrigger>
                <TabsTrigger value="aesthetics" className="px-4 py-2 rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 data-[state=active]:bg-indigo-600">Aesthetic</TabsTrigger>
                <TabsTrigger value="symbols" className="px-4 py-2 rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 data-[state=active]:bg-indigo-600">Symbols</TabsTrigger>
                <TabsTrigger value="decorations" className="px-4 py-2 rounded-md border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 data-[state=active]:bg-indigo-600">Decorations</TabsTrigger>
              </TabsList>
            </div>

            {/* Recently Used section removed */}

            <TabsContent value={activeTab} className="mt-32"> {/* Increased top margin from mt-8 to mt-16 */}
              <div className="grid grid-cols-2 gap-4">
                {filteredStyles.map((styleKey) => (
                  <StyleCard
                    key={styleKey}
                    styleKey={styleKey}
                    style={style}
                    compatiblePlatforms={getCompatiblePlatforms(styleKey)}
                    setStyle={setStyle}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Info className="mr-2 h-5 w-5" /> About Unicode Text Converter
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">What is Unicode text conversion?</h3>
            <p className="text-gray-300 mb-4">
              This app transforms text into Unicode characters for creative expression on various platforms.
            </p>
            <h3 className="text-xl font-bold mb-4">Where can I use the converted text?</h3>
            <p className="text-gray-300 mb-4">
              Works on Facebook, WhatsApp, Twitter/X, LinkedIn, Instagram, Discord, and more.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">How does it work?</h3>
            <p className="text-gray-300 mb-4">
              Maps standard characters to Unicode counterparts for fancy, readable text.
            </p>
            <h3 className="text-xl font-bold mb-4">Key Features</h3>
            <ul className="list-disc list-inside text-gray-300 mb-4 space-y-1 pl-4">
              <li>35+ Unicode Styles</li>
              <li>Social Media Compatible</li>
              <li>Real-time Conversion</li>
              <li>Mobile Friendly</li>
              <li>One-Click Copy</li>
            </ul>
          </div>
        </div>
        <div className="bg-zinc-800 p-6 rounded-lg">
          <p className="text-gray-300">
            Try our Unicode Text Converter today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnicodeTextConverter;