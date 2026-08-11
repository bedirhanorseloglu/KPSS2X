export interface YuksekYargiItem {
  id: string;
  court: "Anayasa Mahkemesi" | "Yargıtay" | "Danıştay" | "Uyuşmazlık Mahkemesi" | "HSK";
  courtIcon: string;
  question: string;
  correctSelector: "CB" | "TBMM" | "HSK" | "Yargıtay/Danıştay" | "AYM";
  selectorName: string;
  ratioOrCount: string;
  explanation: string;
  isExamTrap?: boolean;
  trapWarning?: string;
}

export const YUKSEK_YARGI_ITEMS: YuksekYargiItem[] = [
  {
    id: "aym-cb",
    court: "Anayasa Mahkemesi",
    courtIcon: "🏛️",
    question: "Anayasa Mahkemesi'nin 12 üyesini kim seçer?",
    correctSelector: "CB",
    selectorName: "Cumhurbaşkanı (CB)",
    ratioOrCount: "12 Üye (15 Üyenin 12'si)",
    explanation: "Anayasa Mahkemesi toplam 15 üyeden oluşur. 12 üyesini doğrudan Cumhurbaşkanı seçer.",
  },
  {
    id: "aym-tbmm",
    court: "Anayasa Mahkemesi",
    courtIcon: "🏛️",
    question: "Anayasa Mahkemesi'nin 3 üyesini kim seçer?",
    correctSelector: "TBMM",
    selectorName: "TBMM",
    ratioOrCount: "3 Üye (2010 Anayasa Değişikliği)",
    explanation: "Anayasa Mahkemesi'nin 3 üyesini TBMM gizli oyla seçer (Sayıştay ve Baro başkanlarının gösterdiği adaylar arasından).",
  },
  {
    id: "yargitay-hsk",
    court: "Yargıtay",
    courtIcon: "⚖️",
    question: "Yargıtay üyelerinin TAMAMINI kim seçer?",
    correctSelector: "HSK",
    selectorName: "Hakimler ve Savcılar Kurulu (HSK)",
    ratioOrCount: "Üyelerin TAMAMINI",
    explanation: "Yargıtay üyelerinin tamamını HSK (Hakimler ve Savcılar Kurulu) seçer.",
    isExamTrap: true,
    trapWarning: "ÇIKTI! DİKKAT! Cumhurbaşkanı Yargıtay'a ASLA üye seçmez! Yargıtay üyelerinin TAMAMINI HSK seçer.",
  },
  {
    id: "yargitay-cb-bassavci",
    court: "Yargıtay",
    courtIcon: "⚖️",
    question: "Yargıtay Cumhuriyet Başsavcısı ve Başsavcıvekilini kim seçer?",
    correctSelector: "CB",
    selectorName: "Cumhurbaşkanı (CB)",
    ratioOrCount: "Başsavcı & Vekili",
    explanation: "Cumhurbaşkanı Yargıtay'a üye seçmez; ANCAK Yargıtay Genel Kurulunun gösterdiği adaylar arasından Yargıtay Cumhuriyet Başsavcısı ve Vekilini seçer.",
    isExamTrap: true,
    trapWarning: "ÖSYM TUZAĞI: CB Yargıtay üyesi seçmez ama Başsavcı ve Vekilini seçer!",
  },
  {
    id: "danistay-cb",
    court: "Danıştay",
    courtIcon: "📜",
    question: "Danıştay üyelerinin 1/4'ünü (çeyreğini) kim seçer?",
    correctSelector: "CB",
    selectorName: "Cumhurbaşkanı (CB)",
    ratioOrCount: "1/4'ünü (25%)",
    explanation: "Danıştay üyelerinin 1/4'ünü Cumhurbaşkanı seçer.",
  },
  {
    id: "danistay-hsk",
    court: "Danıştay",
    courtIcon: "📜",
    question: "Danıştay üyelerinin 3/4'ünü kim seçer?",
    correctSelector: "HSK",
    selectorName: "Hakimler ve Savcılar Kurulu (HSK)",
    ratioOrCount: "3/4'ünü (75%)",
    explanation: "Danıştay üyelerinin 3/4'ünü HSK (Hakimler ve Savcılar Kurulu) seçer.",
  },
  {
    id: "uyusmazlik-uyeler",
    court: "Uyuşmazlık Mahkemesi",
    courtIcon: "⚖️",
    question: "Uyuşmazlık Mahkemesi üyelerini kim belirler?",
    correctSelector: "Yargıtay/Danıştay",
    selectorName: "Yargıtay ve Danıştay Genel Kurulları",
    ratioOrCount: "6 Asıl + 6 Yedek Üye",
    explanation: "Uyuşmazlık Mahkemesi üyelerini Yargıtay ve Danıştay Genel Kurulları kendi üyeleri arasından seçer (3 Yargıtay + 3 Danıştay).",
  },
  {
    id: "uyusmazlik-baskan",
    court: "Uyuşmazlık Mahkemesi",
    courtIcon: "⚖️",
    question: "Uyuşmazlık Mahkemesi Başkanını kim seçer/görevlendirir?",
    correctSelector: "AYM",
    selectorName: "Anayasa Mahkemesi (AYM)",
    ratioOrCount: "Mahkeme Başkanı",
    explanation: "Uyuşmazlık Mahkemesi Başkanı, Anayasa Mahkemesi tarafından kendi üyeleri arasından görevlendirilir.",
  },
  {
    id: "hsk-tbmm",
    court: "HSK",
    courtIcon: "🛡️",
    question: "HSK'nın 7 üyesini kim seçer?",
    correctSelector: "TBMM",
    selectorName: "TBMM",
    ratioOrCount: "7 Üye (13 Üyenin 7'si)",
    explanation: "HSK 13 üyeden oluşur. 7 üyesini TBMM niteklikli çoğunlukla seçer.",
  },
  {
    id: "hsk-cb",
    court: "HSK",
    courtIcon: "🛡️",
    question: "HSK'nın 4 üyesini kim seçer?",
    correctSelector: "CB",
    selectorName: "Cumhurbaşkanı (CB)",
    ratioOrCount: "4 Üye",
    explanation: "HSK'nın 4 üyesini doğrudan Cumhurbaşkanı seçer. (Kalan 2 doğal üye: Adalet Bakanı ve Adalet Bakan Yardımcısı'dır).",
  }
];

export interface CourtInfoSummary {
  name: string;
  icon: string;
  totalSeats: string;
  cbShare: string;
  hskShare: string;
  tbmmShare: string;
  otherShare: string;
  color: string;
  note: string;
}

export const COURT_SUMMARIES: CourtInfoSummary[] = [
  {
    name: "Anayasa Mahkemesi",
    icon: "🏛️",
    totalSeats: "15 Üye",
    cbShare: "12 Üye",
    tbmmShare: "3 Üye",
    hskShare: "0 Üye",
    otherShare: "-",
    color: "#af52de",
    note: "12 CB + 3 TBMM = 15 Üye"
  },
  {
    name: "Yargıtay",
    icon: "⚖️",
    totalSeats: "Değişken",
    cbShare: "0 Üye (Üye Seçmez!)",
    hskShare: "Üyelerin TAMAMI",
    tbmmShare: "0 Üye",
    otherShare: "-",
    color: "#10B981",
    note: "🚨 DİKKAT: CB sadece Başsavcı ve Vekilini seçer!"
  },
  {
    name: "Danıştay",
    icon: "📜",
    totalSeats: "Değişken",
    cbShare: "1/4'ünü seçer",
    hskShare: "3/4'ünü seçer",
    tbmmShare: "0 Üye",
    otherShare: "-",
    color: "#1cb0f6",
    note: "1/4 CB + 3/4 HSK"
  },
  {
    name: "Uyuşmazlık Mahkemesi",
    icon: "⚖️",
    totalSeats: "6 Asıl + 6 Yedek",
    cbShare: "0 Üye",
    hskShare: "0 Üye",
    tbmmShare: "0 Üye",
    otherShare: "Yargıtay & Danıştay GK (Başkan AYM'den)",
    color: "#ff9500",
    note: "Üyeler Yargıtay & Danıştay'dan; Başkan AYM'den"
  },
  {
    name: "HSK",
    icon: "🛡️",
    totalSeats: "13 Üye",
    cbShare: "4 Üye",
    hskShare: "-",
    tbmmShare: "7 Üye",
    otherShare: "2 Doğal Üye (Bakan + Yardımcısı)",
    color: "#5856d6",
    note: "4 CB + 7 TBMM + 2 Doğal Üye = 13"
  }
];
