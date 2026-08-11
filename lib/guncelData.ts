export interface GuncelQuestion {
  id: string;
  category: "Edebiyat_ve_Sanat" | "Tarih_ve_Bilim" | "Kurumlar_ve_Politika" | "Uluslararası_Kültür";
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const CATEGORY_LABELS: Record<GuncelQuestion["category"], { name: string; emoji: string; color: string }> = {
  Edebiyat_ve_Sanat: { name: "Edebiyat ve Sanat", emoji: "📚", color: "#af52de" },
  Tarih_ve_Bilim: { name: "Tarih ve Bilim", emoji: "🔬", color: "#ff9500" },
  Kurumlar_ve_Politika: { name: "Kurumlar ve Politika", emoji: "🏛️", color: "#5856d6" },
  Uluslararası_Kültür: { name: "Uluslararası Kültür", emoji: "🌍", color: "#1cb0f6" }
};

export const GUNCEL_QUESTIONS: GuncelQuestion[] = [
  {
    id: "gk_001",
    category: "Edebiyat_ve_Sanat",
    question: "Sinekli Bakkal, Ateşten Gömlek ve Vurun Kahpeye adlı romanlarıyla tanınan Milli Edebiyat dönemi kadın yazarımız kimdir?",
    options: ["Halide Edip Adıvar", "Yakup Kadri Karaosmanoğlu", "Reşat Nuri Güntekin", "Halide Nusret Zorlutuna", "Nezihe Muhiddin"],
    correctAnswer: "Halide Edip Adıvar",
    explanation: "Kurtuluş Savaşı yıllarını hem cephede hem edebiyatta bizzat yaşayan Halide Edip Adıvar, Ateşten Gömlek ve Sinekli Bakkal gibi Türk edebiyatının başyapıtlarını kaleme almıştır."
  },
  {
    id: "gk_002",
    category: "Edebiyat_ve_Sanat",
    question: "Türk edebiyatında sahnelenen ilk tiyatro eseri kabul edilen 'Vatan yahut Silistre' kimin eseridir?",
    options: ["Şinasi", "Namık Kemal", "Ziya Paşa", "Recaizade Mahmut Ekrem", "Abdülhak Hamit Tarhan"],
    correctAnswer: "Namık Kemal",
    explanation: "Vatan Şairi olarak bilinen Namık Kemal'in kaleme aldığı 'Vatan yahut Silistre', Osmanlı tiyatro tarihinde sahnelenen ilk oyun olma özelliğine sahiptir."
  },
  {
    id: "gk_003",
    category: "Edebiyat_ve_Sanat",
    question: "Kuyucaklı Yusuf, Kürk Mantolu Madonna ve İçimizdeki Şeytan romanlarının yazarı olan Toplumcu Gerçekçi edebiyatçımız kimdir?",
    options: ["Orhan Kemal", "Sabahattin Ali", "Yaşar Kemal", "Kemal Tahir", "Rıfat Ilgaz"],
    correctAnswer: "Sabahattin Ali",
    explanation: "Sabahattin Ali, insan psikolojisini ve toplumsal gerçekliği ustalıkla harmanladığı Kürk Mantolu Madonna ve Kuyucaklı Yusuf eserleriyle edebiyatımızda derin iz bırakmıştır."
  },
  {
    id: "gk_004",
    category: "Edebiyat_ve_Sanat",
    question: "Türk edebiyatında 'Şair-i Azam' (Büyük Şair) unvanıyla bilinen ve eşinin ölümü üzerine ünlü 'Makber' şiirini yazan edebiyatçı kimdir?",
    options: ["Abdülhak Hamit Tarhan", "Muallim Naci", "Ahmet Haşim", "Tevfik Fikret", "Cenap Şahabettin"],
    correctAnswer: "Abdülhak Hamit Tarhan",
    explanation: "Tanzimat II. Dönem sanatçısı Abdülhak Hamit Tarhan, şiire getirdiği yenilikler ve coşkulu üslubu nedeniyle 'Şair-i Azam' olarak adlandırılmıştır."
  },
  {
    id: "gk_005",
    category: "Edebiyat_ve_Sanat",
    question: "Özellikle 'Fahriye Abla', 'Olvido' ve 'Serenad' şiirleriyle hafızalara kazınan ve hece ölçüsünü ustalıkla kullanan şairimiz kimdir?",
    options: ["Ahmet Hamdi Tanpınar", "Ahmet Muhip Dıranas", "Cahit Sıtkı Tarancı", "Necip Fazıl Kısakürek", "Orhan Veli Kanık"],
    correctAnswer: "Ahmet Muhip Dıranas",
    explanation: "Ahmet Muhip Dıranas, sembolist etkilerle biçim ve ahenge önem veren saf şiir anlayışının ve Fahriye Abla şiirinin unutulmaz ismidir."
  },
  {
    id: "gk_006",
    category: "Tarih_ve_Bilim",
    question: "Fatih Sultan Mehmet tarafından İstanbul'a davet edilen, Ayasofya Medresesi başmüderrisliğine getirilen ve astronomi alanındaki çalışmalarıyla bilinen ünlü matematikçi kimdir?",
    options: ["Ali Kuşçu", "Takiyüddin", "Katip Çelebi", "Matrakçı Nasuh", "Akşemseddin"],
    correctAnswer: "Ali Kuşçu",
    explanation: "Akkoyunlu elçisi olarak gelip Fatih'in takdiriyle İstanbul'da kalan Ali Kuşçu, Osmanlı'da matematik ve astronominin gelişmesinde öncü rol oynamıştır."
  },
  {
    id: "gk_007",
    category: "Tarih_ve_Bilim",
    question: "2015 Nobel Kimya Ödülü'nü kazanarak hücrelerin hasar gören DNA'ları nasıl onardığını haritalandıran Türk bilim insanı kimdir?",
    options: ["Gazi Yaşargil", "Aziz Sancar", "Cahit Arf", "Uğur Şahin", "Oktay Sinanoğlu"],
    correctAnswer: "Aziz Sancar",
    explanation: "Prof. Dr. Aziz Sancar, 'DNA Onarımı' üzerine yaptığı çığır açıcı çalışmalarıyla 2015 Nobel Kimya Ödülü'ne layık görülmüştür."
  },
  {
    id: "gk_008",
    category: "Tarih_ve_Bilim",
    question: "Avrupa Hun Devleti'nin en parlak dönemini yaşatan ve Hristiyan dünyasında 'Tanrı'nın Kırbacı' (Flagellum Dei) olarak bilinen hükümdar kimdir?",
    options: ["Teoman", "Mete Han", "Attila", "Balamir", "Rua"],
    correctAnswer: "Attila",
    explanation: "Doğu ve Batı Roma İmparatorluklarına diz çöktüren Attila, Avrupalılar tarafından günahları nedeniyle Tanrı tarafından gönderilmiş bir ceza sayılarak bu lakabı almıştır."
  },
  {
    id: "gk_009",
    category: "Tarih_ve_Bilim",
    question: "Kanuni Sultan Süleyman döneminde Hint Deniz Seferlerine katılan ve yaşadıklarını 'Mir'atü'l-Memalik' (Memleketlerin Aynası) adlı eserde toplayan ünlü denizci kimdir?",
    options: ["Piri Reis", "Barbaros Hayreddin Paşa", "Seydi Ali Reis", "Turgut Reis", "Salih Reis"],
    correctAnswer: "Seydi Ali Reis",
    explanation: "Seydi Ali Reis, fırtınalı Hint Seferi dönüşünde karadan yaptığı zorlu seyahatini gezi ve anı niteliğindeki Mir'atü'l-Memalik eserinde anlatmıştır."
  },
  {
    id: "gk_010",
    category: "Tarih_ve_Bilim",
    question: "Sahneye çıkan ilk Müslüman Türk kadın tiyatro oyuncusu kabul edilen ve Türk tiyatrosunun öncü ismi kimdir?",
    options: ["Afife Jale", "Bedia Muvahhit", "Cahide Sonku", "Halide Pişkin", "Suna Pekuysal"],
    correctAnswer: "Afife Jale",
    explanation: "1919 yılında Kadıköy'deki Apollon Tiyatrosu'nda sahneye çıkarak tüm engellere rağmen Türk kadınının tiyatrodaki meşalesini yakan isim Afife Jale'dir."
  },
  {
    id: "gk_011",
    category: "Kurumlar_ve_Politika",
    question: "Türkiye'nin öncülüğünde 1992 yılında kurulan Karadeniz Ekonomik İşbirliği Örgütü'nün (KEİ / BSEC) Daimi Uluslararası Sekretaryası hangi şehirdedir?",
    options: ["Ankara", "İstanbul", "Trabzon", "Bükreş", "Sofya"],
    correctAnswer: "İstanbul",
    explanation: "Karadeniz'e kıyısı olan ve bölgeye yakın ülkelerin ekonomik işbirliğini hedefleyen KEİ'nin genel sekretaryası İstanbul'dadır."
  },
  {
    id: "gk_012",
    category: "Kurumlar_ve_Politika",
    question: "Birleşmiş Milletler (BM) bünyesinde çocuk hakları, çocuk sağlığı ve eğitimi konularında uluslararası yardım faaliyetleri yürüten uzman kuruluş hangisidir?",
    options: ["UNICEF", "UNESCO", "WHO", "FAO", "UNHCR"],
    correctAnswer: "UNICEF",
    explanation: "UNICEF (Birleşmiş Milletler Çocuklara Yardım Fonu), dünyadaki çocukların haklarını korumak ve yaşam standartlarını artırmak için kurulmuştur."
  },
  {
    id: "gk_013",
    category: "Kurumlar_ve_Politika",
    question: "Türkiye Cumhuriyeti'nin ilk ulusal özel bankası olarak 1924 yılında İzmir İktisat Kongresi kararları doğrultusunda kurulan banka hangisidir?",
    options: ["Ziraat Bankası", "Halkbank", "İş Bankası", "VakıfBank", "Sümerbank"],
    correctAnswer: "İş Bankası",
    explanation: "Mustafa Kemal Atatürk'ün talimatıyla ve Celal Bayar'ın ilk genel müdürlüğünde 1924'te kurulan İş Bankası, Cumhuriyet'in ilk özel ulusal bankasıdır."
  },
  {
    id: "gk_014",
    category: "Kurumlar_ve_Politika",
    question: "1944 yılında ABD'de toplanan ve IMF ile Dünya Bankası'nın (IBRD) kurulmasına zemin hazırlayan uluslararası finans konferansı hangisidir?",
    options: ["Yalta Konferansı", "Bretton Woods Konferansı", "Potsdam Konferansı", "San Francisco Konferansı", "Paris Barış Konferansı"],
    correctAnswer: "Bretton Woods Konferansı",
    explanation: "İkinci Dünya Savaşı sonrası küresel finans sistemini şekillendiren anlaşmalar Bretton Woods Konferansı'nda kararlaştırılmıştır."
  },
  {
    id: "gk_015",
    category: "Kurumlar_ve_Politika",
    question: "Yurt dışında Türkçe öğretimini yaygınlaştırmak ve Türk kültürünü tanıtmak amacıyla 2007 yılında kanunla kurulan kamu vakfı enstitüsü hangisidir?",
    options: ["TİKA", "Yunus Emre Enstitüsü", "Türk Dil Kurumu", "YTB", "Maarif Vakfı"],
    correctAnswer: "Yunus Emre Enstitüsü",
    explanation: "Yunus Emre Enstitüsü, uluslararası alanda Türkçe öğretimi yapan ve kültür merkezleri işleten resmi kuruluştur."
  },
  {
    id: "gk_016",
    category: "Uluslararası_Kültür",
    question: "UNESCO Dünya Mirası Listesi'nde yer alan ve 'Tarihin Sıfır Noktası' olarak adlandırılan Şanlıurfa'daki antik tapınak alanı hangisidir?",
    options: ["Göbeklitepe", "Çatalhöyük", "Alacahöyük", "Yassıhöyük", "Arslantepe"],
    correctAnswer: "Göbeklitepe",
    explanation: "Yaklaşık 12.000 yıllık geçmişiyle bilinen en eski tapınak kompleksi Göbeklitepe, insanlık tarihi anlayışını kökten değiştirmiştir."
  },
  {
    id: "gk_017",
    category: "Uluslararası_Kültür",
    question: "979 metre düşüş yüksekliği ile dünyanın en yüksek kesintisiz şelalesi kabul edilen Angel Şelalesi hangi ülkededir?",
    options: ["Brezilya", "Kosta Rika", "Venezuela", "Kanada", "Kolombiya"],
    correctAnswer: "Venezuela",
    explanation: "Angel Şelalesi, Venezuela'daki Canaima Ulusal Parkı sınırları içinde yer alan dünyanın en yüksek kesintisiz şelalesidir."
  },
  {
    id: "gk_018",
    category: "Uluslararası_Kültür",
    question: "Nobel Barış Ödülü hariç diğer tüm Nobel Ödülleri (Fizik, Kimya, Tıp, Edebiyat, Ekonomi) her yıl hangi ülkede düzenlenen törenle verilir?",
    options: ["Norveç", "İsveç", "İsviçre", "Danimarka", "Avusturya"],
    correctAnswer: "İsveç",
    explanation: "Nobel Ödülleri İsveç'in başkenti Stokholm'de verilirken; yalnız Barış Ödülü Norveç'in başkenti Oslo'da sahiplerini bulur."
  },
  {
    id: "gk_019",
    category: "Uluslararası_Kültür",
    question: "UNESCO tarafından Dünya Mirası Kalıcı Listesi'ne dâhil edilen ve Malatya sınırlarında yer alan kerpiç saray yapısıyla ünlü höyük hangisidir?",
    options: ["Gordion", "Arslantepe Höyüğü", "Troya", "Aphrodisias", "Hattuşa"],
    correctAnswer: "Arslantepe Höyüğü",
    explanation: "Malatya'daki Arslantepe Höyüğü, ilk bürokratik devlet yapısının ve kerpiç saray mimarisinin görüldüğü UNESCO mirası antik kentimizdir."
  },
  {
    id: "gk_020",
    category: "Uluslararası_Kültür",
    question: "UNESCO Yaratıcı Şehirler Ağı'na Türkiye'den 'Müzik' alanında dâhil edilen ilk şehir hangisidir?",
    options: ["Şanlıurfa", "Kırşehir", "Nevşehir", "Edirne", "İzmir"],
    correctAnswer: "Kırşehir",
    explanation: "Abdal geleneği ve Neşet Ertaş mirasının simge kenti Kırşehir, Türkiye'den UNESCO Müzik Şehri unvanı alan ilk kenttir."
  },
  {
    id: "eylul_1",
    category: "Uluslararası_Kültür",
    question: "Türkiye'nin ilk bal mumu müzesi olan Yılmaz Büyükerşen Bal Mumu Heykeller Müzesi hangi şehrimizde bulunmaktadır?",
    options: ["Ankara", "İstanbul", "İzmir", "Eskişehir", "Bursa"],
    correctAnswer: "Eskişehir",
    explanation: "Türkiye'nin ilk bal mumu müzesi olan Yılmaz Büyükerşen Bal Mumu Heykeller Müzesi Eskişehir'de bulunmaktadır."
  },
  {
    id: "eylul_2",
    category: "Tarih_ve_Bilim",
    question: "Sovyet Rusya'da Komünist Parti Genel Sekreteri olarak iktidara gelen ve Lenin'in ölümünden sonra diktatör olan lider kimdir?",
    options: ["Mihail Gorbaçov", "Nikita Kruşçev", "Joseph Stalin", "Vladimir Putin", "Leon Troçki"],
    correctAnswer: "Joseph Stalin",
    explanation: "Sovyetler Birliği'ni uzun yıllar yöneten lider Joseph Stalin'dir."
  },
  {
    id: "eylul_3",
    category: "Edebiyat_ve_Sanat",
    question: "Zeybekler ve Gülü Koklayan Kadın gibi eserlerin sahibi olan, Türk resim sanatında önemli yere sahip ressamımız kimdir?",
    options: ["Osman Hamdi Bey", "İbrahim Çallı", "Şeker Ahmet Paşa", "Abidin Dino", "Bedri Rahmi Eyüboğlu"],
    correctAnswer: "İbrahim Çallı",
    explanation: "Zeybekler ve Gülü Koklayan Kadın gibi önemli tablolar ünlü Türk ressamı İbrahim Çallı'ya aittir."
  },
  {
    id: "eylul_4",
    category: "Tarih_ve_Bilim",
    question: "Osmanlı Devleti'nin temel devlet politikası olarak Osmanlıcılık, İslamcılık ve Türkçülük olmak üzere 'Üç Tarz-ı Siyaset'i kıyaslayarak inceleyen isim kimdir?",
    options: ["Ziya Gökalp", "Namık Kemal", "Yusuf Akçura", "Tevfik Fikret", "Mehmet Akif Ersoy"],
    correctAnswer: "Yusuf Akçura",
    explanation: "Osmanlıcılık, İslamcılık ve Türkçülük akımlarını Üç Tarz-ı Siyaset eserinde inceleyen kişi Yusuf Akçura'dır."
  },
  {
    id: "eylul_5",
    category: "Tarih_ve_Bilim",
    question: "Türkiye'de Cumhuriyet tarihinin ilk kadın amirali ve ilk kadın gemi komutanı olan isim kimdir?",
    options: ["Sabiha Gökçen", "Afife Jale", "Gökçen Fırat", "Türkan Akyol", "Tansu Çiller"],
    correctAnswer: "Gökçen Fırat",
    explanation: "Cumhuriyet tarihinin ilk kadın amirali ve ilk kadın gemi komutanı unvanına sahip kişi Gökçen Fırat'tır."
  },
  {
    id: "eylul_6",
    category: "Uluslararası_Kültür",
    question: "Dünyanın yeni yedi harikasından biri olan, renginden dolayı 'Gül Şehri' olarak da bilinen Petra Antik Kenti hangi ülkededir?",
    options: ["Mısır", "Ürdün", "İran", "Meksika", "Peru"],
    correctAnswer: "Ürdün",
    explanation: "Kumtaşı dağlarına oyulmuş ve gül şehri olarak bilinen Petra Antik Kenti Ürdün sınırları içerisindedir."
  },
  {
    id: "ocak_1",
    category: "Kurumlar_ve_Politika",
    question: "Aşağıdaki ülkelerden hangisi Türk Devletleri Teşkilatı üyeleri arasında yer almamaktadır?",
    options: ["Azerbaycan", "Kazakistan", "Özbekistan", "Tacikistan", "Türkiye"],
    correctAnswer: "Tacikistan",
    explanation: "Türk Devletleri Teşkilatı üyeleri arasında Azerbaycan, Kazakistan, Kırgızistan, Özbekistan ve Türkiye bulunurken, Tacikistan üye değildir."
  },
  {
    id: "ocak_2",
    category: "Kurumlar_ve_Politika",
    question: "2016 yılında hayatını kaybeden ve Özbekistan'ı uzun yıllar yöneten ilk cumhurbaşkanı kimdir?",
    options: ["Nursultan Nazarbayev", "İlham Aliyev", "İslam Kerimov", "Şevket Mirziyoyev", "Saparmurat Niyazov"],
    correctAnswer: "İslam Kerimov",
    explanation: "Özbekistan'ın ilk cumhurbaşkanı olan ve ülkeyi uzun süre yöneten lider İslam Kerimov'dur."
  },
  {
    id: "ocak_3",
    category: "Edebiyat_ve_Sanat",
    question: "İlk yerli tiyatro eseri olarak bilinen 'Şair Evlenmesi' oyununun yazarı kimdir?",
    options: ["Namık Kemal", "Şemsettin Sami", "İbrahim Şinasi", "Ahmet Mithat Efendi", "Recaizade Mahmut Ekrem"],
    correctAnswer: "İbrahim Şinasi",
    explanation: "Türk edebiyatının ilk yerli tiyatro eseri kabul edilen Şair Evlenmesi, İbrahim Şinasi tarafından yazılmıştır."
  },
  {
    id: "ocak_4",
    category: "Tarih_ve_Bilim",
    question: "Çanak çömleksiz Neolitik döneme ait olan ve dünyanın en eski tapınağının bulunduğu Göbeklitepe hangi şehrimizde yer almaktadır?",
    options: ["Gaziantep", "Şanlıurfa", "Diyarbakır", "Mardin", "Hatay"],
    correctAnswer: "Şanlıurfa",
    explanation: "Dünyanın bilinen en eski tapınak merkezi olan Göbeklitepe, Şanlıurfa ilimizde bulunmaktadır."
  },
  {
    id: "ocak_5",
    category: "Uluslararası_Kültür",
    question: "Türkiye'nin kuş cenneti olarak bilinen Manyas Gölü aşağıdaki illerden hangisinde yer almaktadır?",
    options: ["Bursa", "Çanakkale", "İzmir", "Balıkesir", "Manisa"],
    correctAnswer: "Balıkesir",
    explanation: "Kuş cenneti olarak ünlenen Manyas Gölü, Balıkesir'in Bandırma ilçesi sınırlarında yer almaktadır."
  },
  {
    id: "ocak_6",
    category: "Uluslararası_Kültür",
    question: "Türkiye'nin ilk Safari Parkı aşağıdaki şehirlerin hangisinde yer almaktadır?",
    options: ["Antalya", "Gaziantep", "İzmir", "Muğla", "Adana"],
    correctAnswer: "Gaziantep",
    explanation: "Türkiye'de kurulan ilk safari parkı, Gaziantep ilimizde yer almaktadır."
  },
  {
    id: "ekim_1",
    category: "Uluslararası_Kültür",
    question: "UNESCO Dünya Miras Listesi'nde yer alan ve sakin şehirler (Cittaslow) ağına da dahil edilen Safranbolu ilçemiz hangi şehrimizde yer almaktadır?",
    options: ["Zonguldak", "Bartın", "Karabük", "Kastamonu", "Bolu"],
    correctAnswer: "Karabük",
    explanation: "Tarihi evleriyle meşhur Safranbolu, Karabük ilimize bağlı bir ilçedir ve sakin şehirler ağındadır."
  },
  {
    id: "ekim_2",
    category: "Uluslararası_Kültür",
    question: "Geç klasik, Helenistik ve ağırlıklı olarak Roma döneminin izlerini taşıyan Perge Antik Kenti hangi ilimizde bulunmaktadır?",
    options: ["İzmir", "Aydın", "Muğla", "Antalya", "Denizli"],
    correctAnswer: "Antalya",
    explanation: "Önemli antik kentlerimizden biri olan Perge Antik Kenti, Antalya ilimizde yer almaktadır."
  },
  {
    id: "ekim_3",
    category: "Tarih_ve_Bilim",
    question: "Nobel ödülüne layık görülen ilk kadın olan ve günümüzde hala iki farklı bilimsel kategoride iki Nobel ödülüne sahip tek kişi kimdir?",
    options: ["Marie Curie", "Rosalind Franklin", "Ada Lovelace", "Jane Goodall", "Dorothy Hodgkin"],
    correctAnswer: "Marie Curie",
    explanation: "İki farklı bilim dalında (fizik ve kimya) Nobel Ödülü kazanan tek kadın bilim insanı Marie Curie'dir."
  },
  {
    id: "ekim_4",
    category: "Tarih_ve_Bilim",
    question: "Bilginin insanda doğuştan olduğunu, bilgilerin kazanılmayıp doğurtulduğunu savunan ve 'doğurtma yöntemini' kullanan filozof kimdir?",
    options: ["Platon", "Aristoteles", "Sokrates", "Kant", "Descartes"],
    correctAnswer: "Sokrates",
    explanation: "İnsanlara sorular sorarak bilgilerini açığa çıkarma olan doğurtma (maiyotik) yöntemini kullanan filozof Sokrates'tir."
  },
  {
    id: "ekim_5",
    category: "Uluslararası_Kültür",
    question: "Filistin'de yaşanan savaş sebebiyle İsrail'i protesto etmek için kullanılan, bayrak renklerini taşıdığı için direniş sembolü haline gelen meyve hangisidir?",
    options: ["Elma", "Karpuz", "Portakal", "Kavun", "Çilek"],
    correctAnswer: "Karpuz",
    explanation: "Filistin bayrağının renklerini (kırmızı, siyah, beyaz, yeşil) barındırdığı için karpuz, direnişin ve protestonun bir sembolü olmuştur."
  },
  {
    id: "ekim_6",
    category: "Edebiyat_ve_Sanat",
    question: "Osmanlı Devleti'nin ilk kadın roman yazarı ve ilk kadın hakları savunucusu olarak bilinen isim kimdir?",
    options: ["Halide Edip Adıvar", "Suat Derviş", "Fatma Aliye", "Sabiha Sertel", "Nakiye Elgün"],
    correctAnswer: "Fatma Aliye",
    explanation: "Osmanlı'nın ilk kadın romancısı ve kadın hakları konusundaki çalışmalarıyla öne çıkan isim Fatma Aliye'dir."
  },
  {
    id: "haziran_1",
    category: "Tarih_ve_Bilim",
    question: "İngiltere ile Fransa arasında yer alan Manş Denizi'ni 1979 yılında yüzerek geçen ilk Türk kadın sporcumuz kimdir?",
    options: ["Aysu Türkoğlu", "Bengisu Avcı", "Şahika Ercümen", "Nesrin Olgun Arslan", "Derya Büyükuncu"],
    correctAnswer: "Nesrin Olgun Arslan",
    explanation: "Manş Denizi'ni 1979'da yüzerek geçmeyi başaran ilk Türk kadın yüzücü Nesrin Olgun Arslan'dır."
  },
  {
    id: "haziran_2",
    category: "Edebiyat_ve_Sanat",
    question: "Açık arttırmada rekor bir fiyata satılmış olan 'Yeşil Cami Önü' adlı yağlı boya tablosu hangi ressamımıza aittir?",
    options: ["Şeker Ahmet Paşa", "Osman Hamdi Bey", "İbrahim Çallı", "Hikmet Onat", "Fikret Mualla"],
    correctAnswer: "Osman Hamdi Bey",
    explanation: "Önemli eserlerden biri olan Yeşil Cami Önü tablosu, Türk müzeciliğinin ve resminin öncüsü Osman Hamdi Bey'e aittir."
  },
  {
    id: "haziran_3",
    category: "Edebiyat_ve_Sanat",
    question: "Aşağıda belirtilen tablo ve ressam eşleştirmelerinden hangisi yanlıştır?",
    options: ["Ağlayan Kadın - Pablo Picasso", "Mona Lisa - Leonardo da Vinci", "Yıldızlı Gece - Vincent Van Gogh", "Çığlık - Sandro Botticelli", "Adem'in Yaratılışı - Michelangelo"],
    correctAnswer: "Çığlık - Sandro Botticelli",
    explanation: "Çığlık tablosu Edvard Munch'a aittir, Botticelli'ye ait değildir, bu yüzden bu eşleştirme yanlıştır."
  },
  {
    id: "haziran_4",
    category: "Edebiyat_ve_Sanat",
    question: "'Sefiller' ve 'Notre Dame'ın Kamburu' gibi dev eserlerin sahibi olan, romantizm akımına bağlı Fransız yazar kimdir?",
    options: ["Emile Zola", "Gustave Flaubert", "Victor Hugo", "Honoré de Balzac", "Alexandre Dumas"],
    correctAnswer: "Victor Hugo",
    explanation: "Fransız ihtilali sonrası dönemi yansıtan Sefiller ve Notre Dame'ın Kamburu eserleri Victor Hugo'ya aittir."
  },
  {
    id: "haziran_5",
    category: "Uluslararası_Kültür",
    question: "Cumhurbaşkanı kararı ile milli park ilan edilen yerlerden biri olan 'Derebucak Çamlık Mağaraları' hangi ilimizde bulunmaktadır?",
    options: ["Antalya", "Isparta", "Konya", "Mersin", "Burdur"],
    correctAnswer: "Konya",
    explanation: "Milli park statüsü kazanan Derebucak Çamlık Mağaraları, Konya ilimizde yer almaktadır."
  },
  {
    id: "haziran_6",
    category: "Uluslararası_Kültür",
    question: "Türklerin en eski milli oyunlarından birisi olan, içine saman doldurularak dikilen oğlak derisiyle oynanan atlı sporun adı nedir?",
    options: ["Cirit", "Kökbörü", "Gökbörü", "Çevgan", "Matrak"],
    correctAnswer: "Kökbörü",
    explanation: "At üzerinde içi saman doldurulmuş oğlak derisi kapılarak oynanan eski Türk sporu Kökbörü'dür."
  },
  {
    id: "subat_1",
    category: "Uluslararası_Kültür",
    question: "Kaz tüyünden yapılma bir top ve raketle oynanan, tenis benzeri 'tüytop' olarak da isimlendirilen spor dalı hangisidir?",
    options: ["Squash", "Badminton", "Masa Tenisi", "Voleybol", "Kriket"],
    correctAnswer: "Badminton",
    explanation: "Tüytop adıyla da bilinen, kaz tüyünden topla oynanan raket sporu badmintondur."
  },
  {
    id: "subat_2",
    category: "Tarih_ve_Bilim",
    question: "Urartu Kralı Menua tarafından yapılmış olan tarihi 'Şamram Su Kanalı' hangi ilimizde yer almaktadır?",
    options: ["Erzurum", "Kars", "Van", "Hakkari", "Ağrı"],
    correctAnswer: "Van",
    explanation: "Tarihte Urartular döneminde inşa edilen Şamram Su Kanalı, Van sınırları içerisinde bulunmaktadır."
  },
  {
    id: "subat_3",
    category: "Kurumlar_ve_Politika",
    question: "İlk defa 1930 yılında organize edilen Dünya Kupası'nı Arjantin'i finalde yenerek kazanan ülke hangisi olmuştur?",
    options: ["Brezilya", "İtalya", "Fransa", "Uruguay", "Almanya"],
    correctAnswer: "Uruguay",
    explanation: "1930 yılında düzenlenen ilk FIFA Dünya Kupası'nı kazanan ülke Uruguay olmuştur."
  },
  {
    id: "subat_4",
    category: "Tarih_ve_Bilim",
    question: "Dünyada kalorifer sisteminin kullanıldığı ilk saray olarak bilinen 'İshak Paşa Sarayı' hangi ilimizde yer almaktadır?",
    options: ["Erzurum", "Sivas", "Kars", "Ağrı", "Ardahan"],
    correctAnswer: "Ağrı",
    explanation: "Osmanlı, Selçuklu ve Pers mimarisini harmanlayan ve ilk kalorifer sistemine sahip olan İshak Paşa Sarayı Ağrı'dadır."
  },
  {
    id: "subat_5",
    category: "Edebiyat_ve_Sanat",
    question: "'İnce Memed' adlı eseriyle tanınan ve Nobel Edebiyat Ödülü'ne aday gösterilen ilk Türk yazarımız kimdir?",
    options: ["Orhan Pamuk", "Yaşar Kemal", "Ahmet Hamdi Tanpınar", "Sabahattin Ali", "Tarık Buğra"],
    correctAnswer: "Yaşar Kemal",
    explanation: "İnce Memed eseriyle dünyaca üne kavuşan ve Nobel'e aday gösterilen ilk Türk yazarımız Yaşar Kemal'dir."
  },
  {
    id: "subat_6",
    category: "Uluslararası_Kültür",
    question: "Dünyanın en derin gölü olarak bilinen Baykal Gölü aşağıdaki ülkelerin hangisinde bulunmaktadır?",
    options: ["ABD", "Kanada", "Çin", "Rusya", "Brezilya"],
    correctAnswer: "Rusya",
    explanation: "Dünyanın en derin gölü unvanını taşıyan Baykal Gölü, Rusya sınırları içerisindedir."
  },
  {
    id: "kasim_1",
    category: "Edebiyat_ve_Sanat",
    question: "Dünya tarihinin en iyi yazarlarından birisi olarak bilinen 'Savaş ve Barış' ile 'Anna Karenina' gibi eserlerin sahibi yazar kimdir?",
    options: ["Dostoyevski", "Maksim Gorki", "Anton Çehov", "Lev Tolstoy", "İvan Turgenyev"],
    correctAnswer: "Lev Tolstoy",
    explanation: "Rus edebiyatının başyapıtları arasında yer alan Savaş ve Barış ile Anna Karenina, Tolstoy tarafından yazılmıştır."
  },
  {
    id: "kasim_2",
    category: "Uluslararası_Kültür",
    question: "Dünyanın yedi harikasından biri sayılan ve M.Ö. 550 yıllarında tamamlanmış olan Artemis Tapınağı hangi ilimizde yer almaktadır?",
    options: ["Antalya", "Muğla", "Aydın", "İzmir", "Çanakkale"],
    correctAnswer: "İzmir",
    explanation: "Antik dünyanın yedi harikasından biri kabul edilen Artemis Tapınağı, günümüzde İzmir sınırları içindedir."
  },
  {
    id: "kasim_3",
    category: "Tarih_ve_Bilim",
    question: "Türkiye'de ilk 'Şehir Hologram Merkezi' aşağıdaki illerimizin hangisinde açılmıştır?",
    options: ["Kastamonu", "Ankara", "İstanbul", "Eskişehir", "Gaziantep"],
    correctAnswer: "Kastamonu",
    explanation: "Tarihte ilk şehir hologram merkezi olma unvanını Kastamonu ilimiz taşımaktadır."
  },
  {
    id: "kasim_4",
    category: "Edebiyat_ve_Sanat",
    question: "İdeal toplum düzenini anlattığı 'Ütopya' adlı eseriyle ünlenmiş meşhur yazar kimdir?",
    options: ["Platon", "Thomas More", "George Orwell", "Aldous Huxley", "Campanella"],
    correctAnswer: "Thomas More",
    explanation: "İdeal bir toplum hayalini anlatan 'Ütopya' kavramını edebiyata kazandıran isim Thomas More'dur."
  },
  {
    id: "kasim_5",
    category: "Tarih_ve_Bilim",
    question: "Mustafa Kemal Atatürk'ün 'Fikirlerimin babası' diyerek hitap ettiği önemli Türk düşünürü kimdir?",
    options: ["Namık Kemal", "Ziya Gökalp", "Mehmet Emin Yurdakul", "Yusuf Akçura", "Tevfik Fikret"],
    correctAnswer: "Ziya Gökalp",
    explanation: "Atatürk'ün düşünce yapısının şekillenmesinde büyük rol oynayan ve 'fikirlerimin babası' dediği kişi Ziya Gökalp'tir."
  },
  {
    id: "kasim_6",
    category: "Tarih_ve_Bilim",
    question: "NASA tarafından uzaya fırlatılan ve dünyanın en büyük uzay teleskobu olan aracın adı nedir?",
    options: ["Hubble", "Kepler", "James Webb", "Spitzer", "Chandra"],
    correctAnswer: "James Webb",
    explanation: "Uzaya gönderilmiş en güçlü ve en büyük teleskop olma özelliğini taşıyan araç James Webb Uzay Teleskobu'dur."
  },
  {
    id: "aralik_1",
    category: "Kurumlar_ve_Politika",
    question: "Türk Devletleri Teşkilatı tarafından 2026 yılı Turizm Başkenti olarak seçilen şehrimiz hangisidir?",
    options: ["Antalya", "İstanbul", "Ankara", "Bursa", "İzmir"],
    correctAnswer: "Ankara",
    explanation: "Türk Devletleri Teşkilatı kararıyla 2026 Turizm Başkenti olarak Türkiye'nin başkenti Ankara belirlenmiştir."
  },
  {
    id: "aralik_2",
    category: "Uluslararası_Kültür",
    question: "16.000 metrelik uzunluğu ile Türkiye'nin en uzun mağarası konumunda olan Pınargözü Mağarası hangi ilimizde bulunmaktadır?",
    options: ["Burdur", "Isparta", "Antalya", "Karaman", "Mersin"],
    correctAnswer: "Isparta",
    explanation: "Türkiye'nin keşfedilmiş en uzun mağarası olan Pınargözü Mağarası, Isparta ilimizde yer almaktadır."
  },
  {
    id: "aralik_3",
    category: "Tarih_ve_Bilim",
    question: "Uluslararası Uzay İstasyonunda geçirdiği toplam 878 gün ile en uzun süre uzayda kalma rekorunu kıran Rus astronot kimdir?",
    options: ["Yuri Gagarin", "Oleg Kononenko", "Valeri Polyakov", "Sergey Krikalev", "Gennady Padalka"],
    correctAnswer: "Oleg Kononenko",
    explanation: "Uzayda en uzun süre (878 gün) kalarak yeni bir rekora imza atan Rus kozmonot Oleg Kononenko'dur."
  },
  {
    id: "aralik_4",
    category: "Kurumlar_ve_Politika",
    question: "2024 yılında Avrupa Konseyi Genel Sekreteri olarak seçilen isim aşağıdakilerden hangisidir?",
    options: ["Ursula von der Leyen", "Jens Stoltenberg", "Alain Berset", "Charles Michel", "Marija Pejčinović Burić"],
    correctAnswer: "Alain Berset",
    explanation: "Avrupa Konseyi Genel Sekreterliği görevine 2024 yılında seçilen siyasetçi Alain Berset'dir."
  },
  {
    id: "aralik_5",
    category: "Edebiyat_ve_Sanat",
    question: "'Anna Karenina' ve 'Savaş ve Barış' gibi eserlerin sahibi olan, dünya tarihinin en iyi yazarlarından biri olarak bilinen yazar kimdir?",
    options: ["Anton Çehov", "Fyodor Dostoyevski", "Lev Tolstoy", "İvan Turgenyev", "Maksim Gorki"],
    correctAnswer: "Lev Tolstoy",
    explanation: "Savaş ve Barış ile Anna Karenina gibi kült eserler, dünyaca ünlü Rus yazar Tolstoy'a aittir."
  },
  {
    id: "aralik_6",
    category: "Tarih_ve_Bilim",
    question: "Antalya'da yetişen, 'Çin greyfurtu' olarak da bilinen ve turunçgiller içinde en büyük meyvelere sahip olan tür hangisidir?",
    options: ["Mandalina", "Bergamot", "Kamkat", "Pomelo", "Limon"],
    correctAnswer: "Pomelo",
    explanation: "Turunçgiller ailesinin en büyük meyvesi olan ve Antalya yöresinde de yetişen türe Pomelo adı verilir."
  },
  {
    id: "mart_1",
    category: "Uluslararası_Kültür",
    question: "Fransa'nın başkenti Paris'te gerçekleştirilen uluslararası yarışmada 'Altın Bal Ödülü'ne layık görülen yerli balımız hangisidir?",
    options: ["Anzer Balı", "Muğla Çam Balı", "Bitlis Balı", "Kars Balı", "Hakkari Balı"],
    correctAnswer: "Bitlis Balı",
    explanation: "Paris'teki uluslararası bal yarışmasında kalitesiyle altın bal ödülü kazanan ürün Bitlis balıdır."
  },
  {
    id: "mart_2",
    category: "Edebiyat_ve_Sanat",
    question: "1991'de Devlet Sanatçısı unvanını alan ve Cumhuriyetin 100. yılında Cumhurbaşkanlığı Kültür ve Sanat Vefa Ödülü'nün sahibi olan şair/yazar kimdir?",
    options: ["Cemal Süreya", "Attila İlhan", "Orhan Veli Kanık", "Necip Fazıl Kısakürek", "Sezai Karakoç"],
    correctAnswer: "Attila İlhan",
    explanation: "Hem devlet sanatçısı unvanı almış hem de vefa ödülüne layık görülmüş olan usta kalem Attila İlhan'dır."
  },
  {
    id: "mart_3",
    category: "Tarih_ve_Bilim",
    question: "İngiltere ile Fransa arasında yer alan Manş Denizi'ni 1979'da yüzerek geçmeyi başaran ilk Türk kadın sporcumuz kimdir?",
    options: ["Aysu Türkoğlu", "Sümeyye Boyacı", "Şahika Ercümen", "Nesrin Olgun Arslan", "Bengisu Avcı"],
    correctAnswer: "Nesrin Olgun Arslan",
    explanation: "Manş denizi geçişini 1979 yılında tamamlayarak tarihe geçen ilk Türk kadın sporcu Nesrin Olgun Arslan'dır."
  },
  {
    id: "mart_4",
    category: "Edebiyat_ve_Sanat",
    question: "Birçok filmin yönetmenliğini yapan, canlandırdığı 'Tarkan' karakteriyle de ün kazanan ve aramızdan ayrılan Türk sinema oyuncusu kimdir?",
    options: ["Cüneyt Arkın", "Kemal Sunal", "Kartal Tibet", "Tarık Akan", "Kadir İnanır"],
    correctAnswer: "Kartal Tibet",
    explanation: "Yeşilçam'da Tarkan karakterine hayat veren ve çok sayıda filmin de yönetmenliğini üstlenen isim Kartal Tibet'tir."
  },
  {
    id: "mart_5",
    category: "Edebiyat_ve_Sanat",
    question: "20. yüzyıl sanatının en ünlü isimlerinden olan İspanyol ressam Pablo Picasso'nun ABD'de düzenlenen açık arttırmada 103 milyon dolara satılan eseri hangisidir?",
    options: ["Guernica", "Ağlayan Kadın", "Yaşlı Gitarist", "Pencerenin Yanında Oturan Kadın", "Avignonlu Kızlar"],
    correctAnswer: "Pencerenin Yanında Oturan Kadın",
    explanation: "Picasso'ya ait olan ve müzayedede 103 milyon dolar gibi rekor bir ücrete satılan tablosu 'Pencerenin Yanında Oturan Kadın'dır."
  },
  {
    id: "mart_6",
    category: "Uluslararası_Kültür",
    question: "Dünyanın en uzun halı motifli caddesi hangi şehrimizde yer almaktadır?",
    options: ["Kayseri", "Isparta", "Mardin", "Gaziantep", "Şanlıurfa"],
    correctAnswer: "Mardin",
    explanation: "Sokaklarında dünyanın en uzun halı motifli caddesini barındıran şehrimiz Mardin'dir."
  },
  {
    id: "nisan_1",
    category: "Uluslararası_Kültür",
    question: "Dünyanın en derin gölü olarak bilinen Baykal Gölü hangi ülkededir?",
    options: ["Kanada", "Brezilya", "Rusya", "ABD", "Hindistan"],
    correctAnswer: "Rusya",
    explanation: "Baykal gölü, tatlı su rezervi bakımından da önemli olup Rusya'da yer almaktadır."
  },
  {
    id: "nisan_2",
    category: "Kurumlar_ve_Politika",
    question: "Birleşmiş Milletler yılın hangi gününü 'Uluslararası Salgınla Hazırlık Günü' olarak ilan etmiştir?",
    options: ["1 Aralık", "27 Aralık", "14 Mart", "7 Nisan", "10 Ekim"],
    correctAnswer: "27 Aralık",
    explanation: "Birleşmiş Milletler tarafından kabul edilen Uluslararası Salgınla Hazırlık Günü, her yıl 27 Aralık'ta kutlanır."
  },
  {
    id: "nisan_3",
    category: "Uluslararası_Kültür",
    question: "İnşaat kazısı sırasında tesadüfen gün ışığına çıkarılan 'Aydıntepe Yeraltı Şehri' hangi ilimiz sınırları içerisinde bulunmaktadır?",
    options: ["Nevşehir", "Kayseri", "Aksaray", "Bayburt", "Erzincan"],
    correctAnswer: "Bayburt",
    explanation: "Tesadüfen keşfedilen tarihi Aydıntepe Yeraltı Şehri, Bayburt ilimizde yer almaktadır."
  },
  {
    id: "nisan_4",
    category: "Uluslararası_Kültür",
    question: "'Dünyanın nazar boncuğu' olarak adlandırılan Meke Krater Gölü hangi ilimizde yer almaktadır?",
    options: ["Burdur", "Isparta", "Konya", "Van", "Bitlis"],
    correctAnswer: "Konya",
    explanation: "Görünümü nedeniyle dünyanın nazar boncuğu yakıştırması yapılan Meke Krater Gölü Konya'dadır."
  },
  {
    id: "nisan_5",
    category: "Edebiyat_ve_Sanat",
    question: "Sinema tarihimizde ilk renkli yerli film olan 'Halıcı Kız'ın yönetmeni kimdir?",
    options: ["Muhsin Ertuğrul", "Lütfi Akad", "Metin Erksan", "Atıf Yılmaz", "Halit Refiğ"],
    correctAnswer: "Muhsin Ertuğrul",
    explanation: "İlk yerli renkli film olma özelliğine sahip Halıcı Kız'ın yönetmen koltuğunda Muhsin Ertuğrul oturmuştur."
  },
  {
    id: "nisan_6",
    category: "Edebiyat_ve_Sanat",
    question: "Eşi tarafından öldürülerek kadına karşı şiddetin sembol ismi olan ve kendi adını taşıyan filmle hayatı anlatılan 'Acıların Kadını' lakaplı kişi kimdir?",
    options: ["Kamuran Akkor", "Bergen", "Esengül", "Müslüm Gürses", "Dilber Ay"],
    correctAnswer: "Bergen",
    explanation: "Arabesk müziğin kraliçesi olarak bilinen, asıl adı Belgin Sarılmışer olan sanatçımız Bergen'dir."
  },
  {
    id: "mayis_1",
    category: "Tarih_ve_Bilim",
    question: "Güneş merkezli sistemi savunduğu ve evrenin sonsuz olduğunu ileri sürdüğü için 1600 yılında Roma'da diri diri yakılarak idam edilen bilim insanı kimdir?",
    options: ["Kopernik", "Galileo Galilei", "Giordano Bruno", "Johannes Kepler", "Isaac Newton"],
    correctAnswer: "Giordano Bruno",
    explanation: "Fikirlerinden dönmeyi reddettiği için engizisyon tarafından idam edilen bilim insanı Giordano Bruno'dur."
  },
  {
    id: "mayis_2",
    category: "Edebiyat_ve_Sanat",
    question: "İslam düşünce tarihinde fıkıh, kelam, felsefe ve tasavvuf alanlarında derin izler bırakan, 'İhyaül Ulumiddin' adlı eserin sahibi mutasavvıf kimdir?",
    options: ["Farabi", "İbn Sina", "İbn Rüşd", "Gazali", "Mevlana"],
    correctAnswer: "Gazali",
    explanation: "İslam felsefesine yön veren İhyaül Ulumiddin adlı eser, büyük alim Gazali'ye aittir."
  },
  {
    id: "mayis_3",
    category: "Tarih_ve_Bilim",
    question: "Vücudun ani stres, tehlike veya heyecan durumlarında tepki vermesini sağlayan, böbrek üstü bezlerinde salgılanan hormon hangisidir?",
    options: ["İnsülin", "Adrenalin", "Melatonin", "Tiroksin", "Serotonin"],
    correctAnswer: "Adrenalin",
    explanation: "Heyecan ve korku anlarında vücudu hazırlayan ve böbrek üstü bezlerinden salgılanan hormon adrenalindir."
  },
  {
    id: "mayis_4",
    category: "Tarih_ve_Bilim",
    question: " 'Tek bildiğim şey hiçbir şey bilmediğim' sözüyle kişinin kendi bilgisizliğinin farkında olmasının bilgeliğin temeli olduğunu vurgulayan filozof kimdir?",
    options: ["Platon", "Aristoteles", "Sokrates", "Descartes", "Kant"],
    correctAnswer: "Sokrates",
    explanation: "Gerçek bilgeliğin insanın kendi cehaletini kabul etmesinden geçtiğini belirten kişi Sokrates'tir."
  },
  {
    id: "mayis_5",
    category: "Tarih_ve_Bilim",
    question: "1. Dünya Savaşı sırasında Çanakkale Cephesi'nde Seyit Onbaşı'nın top mermilerini sırtlayarak vurduğu ve batmasına sebep olduğu düşman gemisi hangisidir?",
    options: ["Bouvet", "Ocean", "Irresistible", "Agamemnon", "Queen Elizabeth"],
    correctAnswer: "Ocean",
    explanation: "Seyit Onbaşı'nın ağır top mermisiyle isabet ettirerek kontrolden çıkardığı savaş gemisi Ocean zırhlısıdır."
  },
  {
    id: "mayis_6",
    category: "Uluslararası_Kültür",
    question: "Baharın gelişini, iyiliğin kötülüğe karşı zaferini kutlayan antik bir bayram geleneği olan 'Holi (Poli) Festivali' hangi ülkede düzenlenmektedir?",
    options: ["Japonya", "Hindistan", "Çin", "Meksika", "Tayland"],
    correctAnswer: "Hindistan",
    explanation: "Renklerin festivali olarak da bilinen antik gelenek Holi festivali Hindistan'da kutlanmaktadır."
  },
  {
    id: "yasin_01",
    category: "Tarih_ve_Bilim",
    question: "2026 Avustralya Açık tenis turnuvasında ikinci tura çıkarak bu başarıyı elde eden ilk Türk kadın tenisçi kimdir?",
    options: ["Çağla Büyükakçay", "Zeynep Sönmez", "İpek Soylu", "Melis Sezer", "Başak Eraydın"],
    correctAnswer: "Zeynep Sönmez",
    explanation: "Zeynep Sönmez, Avustralya Açık'ta ikinci tura yükselerek Türk tenisi adına tarihi bir başarı kazanmıştır."
  },
  {
    id: "yasin_02",
    category: "Tarih_ve_Bilim",
    question: "Japonya'daki zorlu Tsugaru Kanalı'nı 13 saat 49 dakikada yüzerek geçen 'dünyanın en genç Türk sporcusu' kimdir?",
    options: ["Nesrin Olgun Arslan", "Aysu Türkoğlu", "Bengisu Avcı", "Şahika Ercümen", "Merve Tuncel"],
    correctAnswer: "Aysu Türkoğlu",
    explanation: "Aysu Türkoğlu, Tsugaru Kanalı geçişiyle açık su yüzücülüğünde dünyanın en genç Türk sporcusu rekorunu kırmıştır."
  },
  {
    id: "yasin_03",
    category: "Edebiyat_ve_Sanat",
    question: "İnsan ruhunun derinliklerini ve vicdan tahlillerini işlediği 'Suç ve Ceza' başyapıtının yazarı dünya edebiyatçısı kimdir?",
    options: ["Lev Tolstoy", "Fyodor Dostoyevski", "Anton Çehov", "Maksim Gorki", "İvan Turgenyev"],
    correctAnswer: "Fyodor Dostoyevski",
    explanation: "Suç ve Ceza, Raskolnikov karakterinin vicdan ve ahlak çatışmalarını işleyen Dostoyevski eseridir."
  },
  {
    id: "yasin_04",
    category: "Tarih_ve_Bilim",
    question: "Türkiye'nin tamamen yerli ve milli imkanlarla geliştirilen ilk kıtalararası balistik füzesi aşağıdakilerden hangisidir?",
    options: ["Gökdoğan", "Yıldırım Han Füzesi", "Bozdoğan", "Atmaca", "Som-J"],
    correctAnswer: "Yıldırım Han Füzesi",
    explanation: "Yıldırım Han Füzesi, Türkiye'nin savunma sanayiinde geliştirdiği ilk kıtalararası balistik füzedir."
  },
  {
    id: "yasin_05",
    category: "Kurumlar_ve_Politika",
    question: "FIFA tarafından dünya barışına katkıları nedeniyle Barış Ödülü'ne layık görülen lider aşağıdakilerden hangisidir?",
    options: ["Vladimir Putin", "Donald Trump", "Xi Jinping", "Emmanuel Macron", "Olaf Scholz"],
    correctAnswer: "Donald Trump",
    explanation: "FIFA Barış Ödülü, Washington'da düzenlenen kura çekimi etkinliğinde Donald Trump'a takdim edilmiştir."
  },
  {
    id: "yasin_06",
    category: "Uluslararası_Kültür",
    question: "2026 FIFA Dünya Kupası finalinde Arjantin'i yenerek dünya şampiyonluğunu elde eden ülke hangisidir?",
    options: ["Brezilya", "İspanya", "Fransa", "İtalya", "Almanya"],
    correctAnswer: "İspanya",
    explanation: "2026 FIFA Dünya Kupası finalinde Arjantin'i mağlup eden İspanya şampiyonluğu kazanmıştır."
  }
];
