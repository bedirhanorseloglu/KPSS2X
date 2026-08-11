export type RiverFeature = {
  id: string;
  name: string;
  story: string;
  blank: string;
  options: string[];
  type: "yurtdisina_dokulen" | "yurt_icinden_gelen" | "karstik" | "acik_havza" | "diger";
};

export const RIVER_FEATURES: RiverFeature[] = [
  {
    id: "coruh",
    name: "Çoruh Nehri",
    story: "Doğu Karadeniz'den doğarım. Akış hızım ve hidroelektrik potansiyelim çok yüksektir. Sularımı Gürcistan (Batum) üzerinden _____ dökerim.",
    blank: "Karadeniz'e",
    options: ["Karadeniz'e", "Hazar'a", "Basra'ya", "Ege'ye"],
    type: "yurtdisina_dokulen"
  },
  {
    id: "firat",
    name: "Fırat Nehri",
    story: "Kaynağımı Türkiye'den alır, Mezopotamya'yı oluştururum. Üzerimde Atatürk ve Keban barajları bulunur. Suriye üzerinden geçip _____ dökülürüm.",
    blank: "Basra Körfezi'ne",
    options: ["Hazar Gölü'ne", "Basra Körfezi'ne", "Kızıldeniz'e", "Akdeniz'e"],
    type: "yurtdisina_dokulen"
  },
  {
    id: "dicle",
    name: "Dicle Nehri",
    story: "Türkiye'den doğup Fırat ile birleşirim (Şattül Arap). Önemli kollarım Botan Çayı ve _____ suyudur.",
    blank: "Zap",
    options: ["Arpaçay", "Zap", "Karasu", "Murat"],
    type: "yurtdisina_dokulen"
  },
  {
    id: "aras",
    name: "Aras Nehri",
    story: "Türkiye'de doğup Ermenistan ile doğal sınır çizerim. Okyanusa bağlantım olmadığı için sularımı _____ döker ve kapalı havza oluştururum.",
    blank: "Hazar Gölü'ne",
    options: ["Karadeniz'e", "Aral Gölü'ne", "Hazar Gölü'ne", "Basra'ya"],
    type: "yurtdisina_dokulen"
  },
  {
    id: "kura",
    name: "Kura Nehri",
    story: "Tıpkı Aras nehri gibi ben de Türkiye'de doğup Hazar Gölü'ne döküldüğüm için bir _____ havzasıyım.",
    blank: "Kapalı",
    options: ["Açık", "Kapalı", "Karstik", "Karma"],
    type: "yurtdisina_dokulen"
  },
  {
    id: "meric",
    name: "Meriç Nehri",
    story: "Bulgaristan'dan doğar, Yunanistan ile sınır çizerim. Kendi adımla bir delta oluşturur ve en çok _____ tarımıyla öne çıkarım.",
    blank: "Pirinç",
    options: ["Pamuk", "Buğday", "Pirinç", "Mısır"],
    type: "yurt_icinden_gelen"
  },
  {
    id: "asi",
    name: "Asi Nehri",
    story: "Lübnan dağlarından kaynağımı alıp, Suriye üzerinden _____ ilimize geçerek Akdeniz'e dökülürüm.",
    blank: "Hatay",
    options: ["Adana", "Mersin", "Hatay", "Antalya"],
    type: "yurt_icinden_gelen"
  },
  {
    id: "kopru_cayi",
    name: "Köprü Çayı",
    story: "Antalya çevresinde karstik yeraltı sularından beslenirim. Debim yüksek olduğu için _____ faaliyetlerine çok uygunum.",
    blank: "Rafting",
    options: ["Taşımacılık", "Rafting", "Balıkçılık", "Sörf"],
    type: "karstik"
  },
  {
    id: "manavgat",
    name: "Manavgat Nehri",
    story: "Karstik kaynakla beslendiğim için (kireçtaşı arazisi) yıl içinde su seviyem fazla değişmez. Bu yüzden rejimim daha _____.",
    blank: "Düzenlidir",
    options: ["Düzensizdir", "Düzenlidir", "Kurudur", "Taşkındır"],
    type: "karstik"
  },
  {
    id: "kizilirmak",
    name: "Kızılırmak",
    story: "Sivas Kızıldağ'dan doğup Karadeniz'e dökülürüm. Sınırlarımız içinde doğup dökülen en _____ akarsuyum. Bafra Deltası'nı ben oluştururum.",
    blank: "Uzun",
    options: ["Kısa", "Kirli", "Temiz", "Uzun"],
    type: "acik_havza"
  },
  {
    id: "yesilirmak",
    name: "Yeşilırmak",
    story: "Orta Karadeniz'den denize dökülerek _____ Deltası'nı oluştururum. Önemli kollarım Kelkit ve Çekerek sularıdır.",
    blank: "Çarşamba",
    options: ["Bafra", "Çarşamba", "Çukurova", "Silifke"],
    type: "acik_havza"
  },
  {
    id: "sakarya",
    name: "Sakarya Nehri",
    story: "Ege'den doğup İç Anadolu, Karadeniz ve Marmara gibi tam dört bölge değiştiririm. Çok bölge geçtiğim için _____ oranım fazladır.",
    blank: "Kirlenme",
    options: ["Buharlaşma", "Kirlenme", "Debi", "Aşındırma"],
    type: "acik_havza"
  },
  {
    id: "susurluk",
    name: "Susurluk Nehri",
    story: "Güney Marmara'dan doğarak Marmara Denizi'ne dökülürüm. Yükseltinin az olduğu yerlerde aktığım için enerji potansiyelim _____.",
    blank: "Düşüktür",
    options: ["Yüksektir", "Düşüktür", "Değişkendir", "Düzenlidir"],
    type: "acik_havza"
  },
  {
    id: "goksu",
    name: "Göksu Nehri",
    story: "Akdeniz'e döküldüğüm yerde Silifke Deltası'nı oluştururum. Benim sularım Mavi Tünel projesiyle _____ ovasını sulamak için taşınır.",
    blank: "Konya",
    options: ["Çukurova", "Konya", "Harran", "Antalya"],
    type: "acik_havza"
  },
  {
    id: "bartin",
    name: "Bartın Çayı",
    story: "Türkiye'nin akarsuları genellikle denge profiline ulaşmadığı için taşımacılığa uygun değildir. Ancak ben istisnayım, üzerimde _____ yapılabilir.",
    blank: "Taşımacılık",
    options: ["Elektrik Üretimi", "Taşımacılık", "İnci Avcılığı", "Rafting"],
    type: "diger"
  },
  {
    id: "dragon",
    name: "Dragon Çayı",
    story: "Kuzey Kıbrıs Su Temini projesi kapsamında, borularla deniz altından sularım _____ adasına taşınır.",
    blank: "Kıbrıs",
    options: ["Girit", "Kıbrıs", "Rodos", "Malta"],
    type: "diger"
  }
];

export type RiverPath = {
  id: string;
  name: string;
  coordinates: [number, number][]; // [lng, lat]
};

// Gerçekçi kavisler ve doğal akış rotaları eklenmiş koordinatlar
export const RIVER_PATHS: RiverPath[] = [
  {
    id: "kizilirmak",
    name: "Kızılırmak",
    coordinates: [
      [38.0, 39.8], // Sivas
      [37.5, 39.5], 
      [36.8, 39.2],
      [36.0, 39.0], // Kayseri civarı
      [35.3, 38.8],
      [34.8, 38.9],
      [34.0, 39.2], // Kırşehir civarı
      [33.5, 39.6], 
      [33.4, 40.0], // Ankara civarı kıvrım
      [33.8, 40.5],
      [34.5, 41.0], // Çorum
      [35.0, 41.4],
      [35.5, 41.6],
      [36.0, 41.7]  // Bafra Deltası (Samsun)
    ]
  },
  {
    id: "yesilirmak",
    name: "Yeşilırmak",
    coordinates: [
      [38.5, 40.2], // Sivas kuzeyi
      [38.0, 40.4],
      [37.4, 40.5],
      [37.0, 40.6], // Tokat
      [36.5, 40.8],
      [36.2, 41.0], // Amasya
      [36.4, 41.2],
      [36.6, 41.4]  // Çarşamba Deltası
    ]
  },
  {
    id: "sakarya",
    name: "Sakarya",
    coordinates: [
      [31.0, 39.0], // Afyonkarahisar / Eskişehir sınırı
      [30.8, 39.4],
      [30.5, 39.8], // Eskişehir
      [30.8, 40.0],
      [31.2, 40.2], // Ankara batısı
      [31.0, 40.5],
      [30.7, 40.7],
      [30.4, 40.8], // Adapazarı
      [30.5, 40.95],
      [30.6, 41.1]  // Karadeniz (Karasu)
    ]
  },
  {
    id: "susurluk",
    name: "Susurluk",
    coordinates: [
      [29.0, 39.2], // Kütahya/Balıkesir
      [28.7, 39.5],
      [28.4, 39.7],
      [28.2, 39.8], // Susurluk
      [28.1, 40.1],
      [28.3, 40.3],
      [28.4, 40.4]  // Marmara Denizi
    ]
  },
  {
    id: "bakircay",
    name: "Bakırçay",
    coordinates: [
      [28.0, 39.2], // Manisa kuzeyi
      [27.6, 39.15],
      [27.3, 39.1], // Bergama
      [27.1, 39.0],
      [26.9, 38.9]  // Çandarlı Körfezi
    ]
  },
  {
    id: "gediz",
    name: "Gediz",
    coordinates: [
      [29.0, 39.0], // Murat Dağı
      [28.6, 38.8],
      [28.2, 38.6], // Salihli
      [27.8, 38.55],
      [27.4, 38.6], // Manisa
      [27.1, 38.65],
      [26.8, 38.6]  // İzmir Körfezi
    ]
  },
  {
    id: "kucuk_menderes",
    name: "Küçük Menderes",
    coordinates: [
      [28.2, 38.2], // Bozdağlar
      [27.9, 38.15],
      [27.7, 38.1], // Ödemiş
      [27.5, 38.0],
      [27.3, 37.9]  // Selçuk / Ege Denizi
    ]
  },
  {
    id: "buyuk_menderes",
    name: "Büyük Menderes",
    coordinates: [
      [30.0, 38.0], // Dinar / Afyon
      [29.5, 37.9],
      [29.0, 37.8], // Denizli
      [28.4, 37.85],
      [27.8, 37.8], // Aydın
      [27.5, 37.7],
      [27.2, 37.5]  // Milet / Ege Denizi
    ]
  },
  {
    id: "firat",
    name: "Fırat",
    coordinates: [
      [41.5, 39.9], // Erzurum (Karasu/Murat)
      [40.8, 39.5],
      [40.0, 39.2],
      [39.0, 38.8], // Elazığ (Keban)
      [38.5, 38.4],
      [38.0, 37.8], // Adıyaman (Atatürk)
      [37.9, 37.3],
      [38.0, 36.8], // Suriye sınırı çıkışı
      [38.5, 36.0],
      [40.0, 34.0]  // Irak'a doğru uzantı
    ]
  },
  {
    id: "dicle",
    name: "Dicle",
    coordinates: [
      [39.5, 38.5], // Elazığ Hazar gölü
      [39.7, 38.2],
      [40.0, 37.9], // Diyarbakır
      [40.5, 37.7],
      [41.0, 37.5], // Batman
      [41.8, 37.3],
      [42.5, 37.2], // Şırnak/Cizre Suriye/Irak sınırı
      [42.8, 36.6],
      [43.0, 36.0]  // Irak içine
    ]
  },
  {
    id: "coruh",
    name: "Çoruh",
    coordinates: [
      [40.0, 40.2], // Bayburt
      [40.5, 40.5],
      [41.0, 40.8], // Artvin
      [41.3, 41.2],
      [41.6, 41.5]  // Gürcistan Batum Karadeniz
    ]
  },
  {
    id: "meric",
    name: "Meriç",
    coordinates: [
      [26.3, 42.0], // Bulgaristan
      [26.4, 41.8],
      [26.5, 41.6], // Edirne
      [26.4, 41.2],
      [26.2, 40.9],
      [26.1, 40.7]  // Enez Ege Denizi
    ]
  },
  {
    id: "aras",
    name: "Aras",
    coordinates: [
      [41.5, 39.5], // Erzurum Bingöl dağları
      [42.2, 39.8],
      [43.0, 40.0], // Kars Arpaçay birleşimi
      [43.8, 39.9],
      [44.5, 39.8], // Iğdır Ermenistan sınırı
      [45.2, 39.6],
      [46.0, 39.5]  // Hazar'a doğru
    ]
  },
  {
    id: "kura",
    name: "Kura",
    coordinates: [
      [42.5, 41.0], // Ardahan Göle
      [42.8, 41.05],
      [43.0, 41.1], // Ardahan
      [43.2, 41.15],
      [43.5, 41.2], // Gürcistan sınırı
      [44.2, 40.8],
      [45.0, 40.5]  // Hazar'a doğru
    ]
  },
  {
    id: "seyhan",
    name: "Seyhan",
    coordinates: [
      [36.0, 38.5], // Kayseri/Sivas güneyi
      [35.8, 38.0],
      [35.5, 37.5], // Adana Toroslar
      [35.2, 37.1],
      [34.9, 36.7]  // Çukurova
    ]
  },
  {
    id: "ceyhan",
    name: "Ceyhan",
    coordinates: [
      [37.5, 38.2], // Elbistan / Maraş kuzeyi
      [37.2, 37.9],
      [36.9, 37.5], // Maraş
      [36.4, 37.2],
      [35.8, 37.0], // Osmaniye batısı
      [35.7, 36.8],
      [35.6, 36.6]  // İskenderun Körfezi / Çukurova
    ]
  },
  {
    id: "goksu",
    name: "Göksu",
    coordinates: [
      [32.5, 37.0], // Hadim / Konya güneyi
      [32.8, 36.8],
      [33.2, 36.5], // Mut
      [33.6, 36.4],
      [34.0, 36.3]  // Silifke
    ]
  },
  {
    id: "asi",
    name: "Asi",
    coordinates: [
      [36.5, 34.0], // Lübnan
      [36.6, 35.0], 
      [36.5, 36.0], // Suriye
      [36.3, 36.1],
      [36.2, 36.2], // Hatay
      [36.0, 36.15],
      [35.9, 36.1]  // Samandağ Akdeniz
    ]
  },
  {
    id: "kopru_cayi",
    name: "Köprü Çayı",
    coordinates: [
      [31.2, 37.5], // Isparta / Antalya sınırı
      [31.1, 37.3],
      [31.2, 37.1], // Beşkonak / Köprülü Kanyon
      [31.15, 36.9],
      [31.2, 36.8]  // Antalya Körfezi
    ]
  },
  {
    id: "manavgat",
    name: "Manavgat",
    coordinates: [
      [31.8, 37.3], // Toroslar
      [31.6, 37.1],
      [31.4, 36.8], // Manavgat şelalesi
      [31.4, 36.7]  // Akdeniz
    ]
  },
  {
    id: "aksu",
    name: "Aksu",
    coordinates: [
      [30.8, 37.6], // Eğirdir güneyi
      [30.7, 37.3],
      [30.8, 37.0], // Antalya ovası
      [30.85, 36.9],
      [30.9, 36.8]  // Akdeniz
    ]
  },
  {
    id: "bartin",
    name: "Bartın",
    coordinates: [
      [32.5, 41.5], // Küre Dağları
      [32.4, 41.55],
      [32.3, 41.6], // Bartın
      [32.25, 41.65],
      [32.2, 41.7]  // Karadeniz
    ]
  },
  {
    id: "filyos",
    name: "Filyos",
    coordinates: [
      [32.6, 40.6], // Gerede / Karabük civarı
      [32.3, 40.9],
      [32.0, 41.2], // Çaycuma
      [32.05, 41.4],
      [32.0, 41.6]  // Filyos Karadeniz
    ]
  },
  {
    id: "dalaman",
    name: "Dalaman",
    coordinates: [
      [29.4, 37.2], // Gölhisar / Burdur
      [29.1, 37.0],
      [28.8, 36.8], // Dalaman
      [28.75, 36.75],
      [28.7, 36.7]  // Akdeniz
    ]
  }
];
