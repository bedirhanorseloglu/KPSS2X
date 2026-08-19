import { Subject, UniversityClass } from "@/types"

export const UNIVERSITY_CLASSES: UniversityClass[] = [
  {
    id: "yzk401-1",
    courseCode: "YZK-401",
    courseName: "Yapay Zekâ ve Kolaylaştırıcı Araçlar",
    date: "2026-04-28",   // Salı
    startTime: "14:00",
    endTime: "16:00",
    lessonNumber: 12,
    locked: true
  },
  {
    id: "yzk402-1",
    courseCode: "YZK-402",
    courseName: "Yapay Zekâ ve Makine Öğrenmesi",
    date: "2026-04-29",   // Çarşamba
    startTime: "10:00",
    endTime: "13:00",
    lessonNumber: 12,
    locked: true
  },
  {
    id: "yzk402-2",
    courseCode: "YZK-402",
    courseName: "Yapay Zekâ ve Makine Öğrenmesi",
    date: "2026-05-01",   // Cuma
    startTime: "14:00",
    endTime: "17:00",
    lessonNumber: 13,
    locked: true
  },
  {
    id: "yzk401-2",
    courseCode: "YZK-401",
    courseName: "Yapay Zekâ ve Kolaylaştırıcı Araçlar",
    date: "2026-05-05",   // Salı
    startTime: "14:00",
    endTime: "16:00",
    lessonNumber: 13,
    locked: true
  },
  {
    id: "yzk402-3",
    courseCode: "YZK-402",
    courseName: "Yapay Zekâ ve Makine Öğrenmesi",
    date: "2026-05-08",   // Cuma
    startTime: "14:00",
    endTime: "17:00",
    lessonNumber: 14,
    locked: true
  }
]

export const initialData: Subject[] = [
  {
    id: "turkce",
    title: "Türkçe",
    tip: "Anlam bilgisi temeldir ve her gün paragraf çözmek rutinin olmalıdır.",
    color: "#fa5fea",
    category: "Genel Yetenek",
    subCategory: "Sözel",
    icon: "📘",
    topics: [
      { id: "tr-1", title: "Sözcükte Anlam (Boşluk Doldurma)", questionRange: "1. Soru", questionCount: "1 Soru", done: false },
      { id: "tr-2", title: "Söz Öbeklerinde Anlam (Altı Çizili İfade & Deyimler)", questionRange: "2. Soru", questionCount: "1 Soru", done: false },
      { id: "tr-3", title: "Cümlede Anlam & Cümle Yorumu (Neden-Sonuç, Çıkarım, Öznel/Nesnel)", questionRange: "3-4. Sorular", questionCount: "2 Soru", isRoutine: true, done: false },
      { id: "tr-5", title: "Paragrafta Yapı (Akışı Bozan Cümle, Sıralama, Yer Değiştirme)", questionRange: "5-7. Sorular", questionCount: "3 Soru", isRoutine: true, done: false },
      { id: "tr-16", title: "Noktalama İşaretleri (Nokta, Virgül, Noktalı Virgül vb.)", questionRange: "8. Soru", questionCount: "1-2 Soru", done: false },
      { id: "tr-15", title: "Yazım Kuralları (Büyük Harfler, Ayrı/Bitişik Yazım)", questionRange: "9. Soru", questionCount: "1-2 Soru", done: false },
      { id: "tr-8", title: "Sözcükte Yapı (Kök, Çekim & Yapım Ekleri, Gövde)", questionRange: "10. Soru", questionCount: "1 Soru", done: false },
      { id: "tr-7", title: "Ses Bilgisi (Ünlü/Ünsüz Düşmesi, Benzeşme, Yumuşama)", questionRange: "11. Soru", questionCount: "1 Soru", done: false },
      { id: "tr-9", title: "Sözcük Türleri (İsim, Sıfat, Zamir, Zarf, Edat, Bağlaç)", questionRange: "12. Soru", questionCount: "1-2 Soru", done: false },
      { id: "tr-13", title: "Cümlenin Ögeleri ve Tamlamalar", questionRange: "13. Soru", questionCount: "1 Soru", done: false },
      { id: "tr-12", title: "Fiiller, Ek Fiil ve Fiilimsiler", questionRange: "14. Soru", questionCount: "1 Soru", done: false },
      { id: "tr-14", title: "Cümle Türleri ve Anlatım Bozuklukları", questionRange: "15. Soru", questionCount: "1 Soru", done: false },
      { id: "tr-4", title: "Paragrafta Anlam & Ana Düşünce (Tekli ve Çoklu Paragraflar)", questionRange: "16-26. Sorular", questionCount: "11 Soru", isRoutine: true, done: false },
      { id: "tr-18", title: "Sözel Mantık ve Akıl Yürütme (Tablo/Sıralama 4'lü Soru Grubu)", questionRange: "27-30. Sorular", questionCount: "4 Soru", isRoutine: true, done: false }
    ]
  },
  {
    id: "matematik",
    title: "Matematik",
    tip: "Matematik kümülatif bir derstir. Oran-Orantı ve Denklem Çözme problemlerin omurgasıdır.",
    color: "#af52de",
    category: "Genel Yetenek",
    subCategory: "Sayısal",
    icon: "📐",
    topics: [
      { id: "mat-7", title: "Rasyonel ve Ondalık Sayılarda Dört İşlem", questionRange: "1. Soru (GY 31)", questionCount: "1 Soru", done: false },
      { id: "mat-10", title: "Üslü Sayılar ve Üslü İfadeler", questionRange: "2. Soru (GY 32)", questionCount: "1 Soru", done: false },
      { id: "mat-11", title: "Köklü Sayılar ve Köklü İfadeler", questionRange: "3. Soru (GY 33)", questionCount: "1 Soru", done: false },
      { id: "mat-3", title: "Faktöriyel ve Ondalık Sayı Sadeleştirme", questionRange: "4. Soru (GY 34)", questionCount: "1 Soru", done: false },
      { id: "mat-4", title: "Sayı Basamakları ve Çözümleme (Harfli İşlemler)", questionRange: "5. Soru (GY 35)", questionCount: "1 Soru", done: false },
      { id: "mat-5", title: "Bölme ve Bölünebilme Kuralları", questionRange: "6. Soru (GY 36)", questionCount: "1 Soru", done: false },
      { id: "mat-6", title: "Asal Çarpanlar ve EBOB - EKOK", questionRange: "7. Soru (GY 37)", questionCount: "1 Soru", done: false },
      { id: "mat-8", title: "Basit Eşitsizlikler ve Sıralama", questionRange: "8. Soru (GY 38)", questionCount: "1 Soru", done: false },
      { id: "mat-9", title: "Mutlak Değer ve Mutlak Değerli Denklemler", questionRange: "9. Soru (GY 39)", questionCount: "1 Soru", done: false },
      { id: "mat-12", title: "Çarpanlara Ayırma ve Sadeleştirme", questionRange: "10. Soru (GY 40)", questionCount: "1 Soru", done: false },
      { id: "mat-1", title: "Özel Tanımlı İşlemler & Temel Kavramlar (Tek-Çift / Ardışık)", questionRange: "11. Soru (GY 41)", questionCount: "1 Soru", done: false },
      { id: "mat-21", title: "Kümeler ve Fonksiyonlar", questionRange: "12. Soru (GY 42)", questionCount: "1-2 Soru", done: false },
      { id: "mat-14", title: "Sayı, Kesir ve Denklem Kurma Problemleri", questionRange: "13-15. Sorular (GY 43-45)", questionCount: "3 Soru", isRoutine: true, done: false },
      { id: "mat-15", title: "Yaş Problemleri", questionRange: "16. Soru (GY 46)", questionCount: "1 Soru", isRoutine: true, done: false },
      { id: "mat-17", title: "Hareket (Hız) Problemleri", questionRange: "17. Soru (GY 47)", questionCount: "1 Soru", isRoutine: true, done: false },
      { id: "mat-18", title: "Yüzde, Kâr - Zarar ve İskonto Problemleri", questionRange: "18. Soru (GY 48)", questionCount: "1-2 Soru", isRoutine: true, done: false },
      { id: "mat-16", title: "İşçi - Havuz ve Karışım Problemleri", questionRange: "19. Soru (GY 49)", questionCount: "1 Soru", isRoutine: true, done: false },
      { id: "mat-22", title: "Permütasyon, Kombinasyon ve Olasılık", questionRange: "20. Soru (GY 50)", questionCount: "1 Soru", done: false },
      { id: "mat-20", title: "Grafik ve Tablo Okuma Problemleri (Daire/Sütun Grafik)", questionRange: "21-22. Sorular (GY 51-52)", questionCount: "2 Soru", isRoutine: true, done: false },
      { id: "mat-23", title: "Sayısal Mantık ve Akıl Yürütme (Kurgulu Soru Grupları)", questionRange: "23-26. Sorular (GY 53-56)", questionCount: "4 Soru", done: false }
    ]
  },
  {
    id: "geometri",
    title: "Geometri",
    tip: "Üçgenler tüm konuların temelidir. Üçgenleri anlamadan diğer konulara geçilmemelidir.",
    color: "#00c1d5",
    category: "Genel Yetenek",
    subCategory: "Sayısal",
    icon: "📐",
    topics: [
      { id: "geo-1", title: "Doğruda ve Üçgende Açılar / Özel Üçgenler", questionRange: "27. Soru (GY 57)", questionCount: "1 Soru", done: false },
      { id: "geo-4", title: "Üçgende Alan, Benzerlik ve Kenar Bağıntıları", questionRange: "28. Soru (GY 58)", questionCount: "1 Soru", done: false },
      { id: "geo-5", title: "Çokgenler, Dörtgenler ve Katı Cisimler", questionRange: "29. Soru (GY 59)", questionCount: "1 Soru", done: false },
      { id: "geo-6", title: "Çember - Daire ve Analitik Geometri", questionRange: "30. Soru (GY 60)", questionCount: "1 Soru", done: false }
    ]
  },
  {
    id: "tarih",
    title: "Tarih",
    tip: "Olayları sebep-sonuç ilişkisine göre kronolojik olarak çalışmalısın.",
    color: "#ff9500",
    category: "Genel Kültür",
    subCategory: "Sosyal",
    icon: "🏛",
    topics: [
      { id: "hist-1", title: "İslamiyet Öncesi Türk Tarihi (Devletler & Teşkilat)", questionRange: "1. Soru (GK 1)", questionCount: "1 Soru", done: false },
      { id: "hist-2", title: "İlk Türk-İslam Devletleri (Karahanlı, Gazneli, Selçuklu)", questionRange: "2. Soru (GK 2)", questionCount: "1 Soru", done: false },
      { id: "hist-3", title: "Türkiye Tarihi & Anadolu Selçukluları ve Beylikler", questionRange: "3. Soru (GK 3)", questionCount: "1 Soru", done: false },
      { id: "hist-4", title: "Osmanlı Devleti Kuruluş ve Yükselme Dönemi Olayları", questionRange: "4. Soru (GK 4)", questionCount: "1 Soru", done: false },
      { id: "hist-5", title: "Osmanlı Devleti Kültür ve Medeniyeti (Yönetim, Ordu, Hukuk, Sanat)", questionRange: "5-6. Sorular (GK 5-6)", questionCount: "2-3 Soru", done: false },
      { id: "hist-6", title: "Osmanlı Devleti Duraklama Dönemi (XVII. Yüzyıl Islahatları)", questionRange: "7. Soru (GK 7)", questionCount: "1 Soru", done: false },
      { id: "hist-7", title: "Osmanlı Devleti Gerileme Dönemi (XVIII. Yüzyıl Islahatları)", questionRange: "8. Soru (GK 8)", questionCount: "1 Soru", done: false },
      { id: "hist-8", title: "Osmanlı Devleti Dağılma Dönemi (XIX. Yüzyıl Islahatları)", questionRange: "9. Soru (GK 9)", questionCount: "1 Soru", done: false },
      { id: "hist-9", title: "Osmanlı Fikir Akımları, Meşrutiyet & Kanun-i Esasi", questionRange: "10. Soru (GK 10)", questionCount: "1 Soru", done: false },
      { id: "hist-10", title: "XX. Yüzyıl Başlarında Osmanlı (Trablusgarp, Balkan, I. Dünya Savaşı)", questionRange: "11-12. Sorular (GK 11-12)", questionCount: "2 Soru", done: false },
      { id: "hist-11", title: "Kurtuluş Savaşı Hazırlık Dönemi (Genelgeler, Kongreler, Misak-ı Milli)", questionRange: "13-15. Sorular (GK 13-15)", questionCount: "2-3 Soru", done: false },
      { id: "hist-12", title: "I. TBMM Dönemi, Ayaklanmalar ve Kurtuluş Savaşı Cepheleri", questionRange: "16-17. Sorular (GK 16-17)", questionCount: "2-3 Soru", done: false },
      { id: "hist-13", title: "Mudanya Mütarekesi ve Lozan Barış Antlaşması", questionRange: "18. Soru (GK 18)", questionCount: "1 Soru", done: false },
      { id: "hist-14", title: "Atatürk Dönemi İç Politika ve İnkılaplar", questionRange: "19-20. Sorular (GK 19-20)", questionCount: "2-3 Soru", done: false },
      { id: "hist-15", title: "Atatürk İlkeleri (Cumhuriyetçilik, Laiklik, Halkçılık vb.)", questionRange: "21. Soru (GK 21)", questionCount: "1 Soru", done: false },
      { id: "hist-16", title: "Atatürk Dönemi Kültür, Sanat, İktisat ve Medeniyet", questionRange: "22-23. Sorular (GK 22-23)", questionCount: "1-2 Soru", done: false },
      { id: "hist-17", title: "Atatürk Dönemi Dış Politika (Balkan Antantı, Sadabat, Boğazlar, Hatay)", questionRange: "24. Soru (GK 24)", questionCount: "1 Soru", done: false },
      { id: "hist-18", title: "Çağdaş Türk ve Dünya Tarihi (II. Dünya Savaşı, Soğuk Savaş, Küreselleşme)", questionRange: "25-27. Sorular (GK 25-27)", questionCount: "3 Soru", done: false }
    ]
  },
  {
    id: "cografya",
    title: "Coğrafya",
    tip: "Harita bilgisi gerektirir. Fiziki haritayı oturtmadan beşeri konulara geçilmemelidir.",
    color: "#10B981",
    category: "Genel Kültür",
    subCategory: "Sosyal",
    icon: "🗺",
    topics: [
      { id: "cog-1", title: "Türkiye'nin Coğrafi Konumu ve Etkileri (Mutlak & Göreceli Konum)", questionRange: "1. Soru (GK 28)", questionCount: "1 Soru", done: false },
      { id: "cog-2", title: "Türkiye'nin Yer Şekilleri (Dağlar, Ovalar, Platolar & Jeolojik Yapı)", questionRange: "2. Soru (GK 29)", questionCount: "2 Soru", done: false },
      { id: "cog-3", title: "Türkiye'nin Su Varlığı (Akarsular, Göller, Yeraltı Suları)", questionRange: "3. Soru (GK 30)", questionCount: "1-2 Soru", done: false },
      { id: "cog-4", title: "Türkiye'nin İklimi, Sıcaklık, Rüzgarlar ve Bitki Örtüsü", questionRange: "4-5. Sorular (GK 31-32)", questionCount: "2 Soru", done: false },
      { id: "cog-5", title: "Türkiye'nin Toprak Tipleri ve Erozyon", questionRange: "6. Soru (GK 33)", questionCount: "1 Soru", done: false },
      { id: "cog-6", title: "Türkiye'de Nüfusun Dağılışı, Nüfus Politikaları ve Göçler", questionRange: "7-8. Sorular (GK 34-35)", questionCount: "2 Soru", done: false },
      { id: "cog-7", title: "Türkiye'de Yerleşme Tipleri (Kentsel ve Geçici/Kalıcı Kırsal)", questionRange: "9. Soru (GK 36)", questionCount: "1 Soru", done: false },
      { id: "cog-8", title: "Türkiye'de Tarım ve Hayvancılık Faaliyetleri", questionRange: "10-11. Sorular (GK 37-38)", questionCount: "2-3 Soru", done: false },
      { id: "cog-9", title: "Türkiye'de Madenler ve Çıkarıldığı Yerler", questionRange: "12. Soru (GK 39)", questionCount: "1-2 Soru", done: false },
      { id: "cog-10", title: "Türkiye'de Enerji Kaynakları (Petrol, Doğalgaz, Jeotermal, Yenilenebilir)", questionRange: "13. Soru (GK 40)", questionCount: "1-2 Soru", done: false },
      { id: "cog-11", title: "Türkiye'de Sanayi Tesisleri ve Dağılışını Etkileyen Faktörler", questionRange: "14. Soru (GK 41)", questionCount: "1-2 Soru", done: false },
      { id: "cog-12", title: "Türkiye'de Ulaşım Ağları ve Dış Ticaret", questionRange: "15. Soru (GK 42)", questionCount: "1-2 Soru", done: false },
      { id: "cog-13", title: "Türkiye'de Turizm Varlıkları ve Turizm Merkezleri", questionRange: "16. Soru (GK 43)", questionCount: "1 Soru", done: false },
      { id: "cog-14", title: "Çevre, Doğal Afetler ve Koruma Alanları (Deprem, Heyelan vb.)", questionRange: "17. Soru (GK 44)", questionCount: "1 Soru", done: false },
      { id: "cog-15", title: "Bölgesel Kalkınma Projeleri (GAP, DAP, DOKAP, KOP, ZBK)", questionRange: "18. Soru (GK 45)", questionCount: "1 Soru", done: false }
    ]
  },
  {
    id: "vatandaslik",
    title: "Vatandaşlık",
    tip: "Unutmaya müsait olduğu için sınava son 3-4 ay kala başlanması veya sık tekrarı önerilir.",
    color: "#5856d6",
    category: "Vatandaşlık",
    subCategory: "Hukuk",
    icon: "⚖️",
    topics: [
      { id: "vat-1", title: "Hukukun Temel Kavramları ve Hukuk Kuralları Türleri", questionRange: "1. Soru (GK 46)", questionCount: "1 Soru", done: false },
      { id: "vat-2", title: "Hak Kavramı, Hakların Korunması ve Hükümsüzlük", questionRange: "2. Soru (GK 47)", questionCount: "1 Soru", done: false },
      { id: "vat-3", title: "Kişilik Hukuku, Ehliyet Türleri, Tüzel Kişiler ve Hısımlık", questionRange: "3. Soru (GK 48)", questionCount: "1 Soru", done: false },
      { id: "vat-4", title: "Devlet Biçimleri, Demokrasi ve Hükümet Sistemleri", questionRange: "4. Soru (GK 49)", questionCount: "1 Soru", done: false },
      { id: "vat-5", title: "Türk Anayasa Tarihi (1876 - 1921 - 1924 - 1961)", questionRange: "5. Soru (GK 50)", questionCount: "1 Soru", done: false },
      { id: "vat-6", title: "1982 Anayasası Temel Hak ve Ödevler (Kişi, Sosyal, Siyasi)", questionRange: "6. Soru (GK 51)", questionCount: "1 Soru", done: false },
      { id: "vat-7", title: "Yasama Organı (TBMM Yapısı, Görev ve Yetkileri, Seçimler)", questionRange: "7. Soru (GK 52)", questionCount: "1 Soru", done: false },
      { id: "vat-8", title: "Yürütme Organı (Cumhurbaşkanı, CBK ve Kararnameler)", questionRange: "8. Soru (GK 53)", questionCount: "1 Soru", done: false },
      { id: "vat-9", title: "Yargı Organı ve Yüksek Mahkemeler (AYM, Yargıtay, Danıştay)", questionRange: "9. Soru (GK 54)", questionCount: "1 Soru", done: false },
      { id: "vat-10", title: "İdare Hukuku (Merkezi İdare & Mahalli İdareler / Belediyeler)", questionRange: "10. Soru (GK 55)", questionCount: "1 Soru", done: false },
      { id: "vat-11", title: "Devlet Memurları Kanunu (657 DMK Temel İlkeler ve Disiplin)", questionRange: "11. Soru (GK 56)", questionCount: "1 Soru", done: false },
      { id: "vat-12", title: "Uluslararası Kuruluşlar (BM, NATO, AB, Türk Devletleri Teşkilatı)", questionRange: "12. Soru (GK 57)", questionCount: "1 Soru", done: false },
      { id: "vat-13", title: "Güncel Bilgiler ve Genel Kültür (Tarih, Sanat, Edebiyat, Spor, Ödüller)", questionRange: "13-15. Sorular (GK 58-60)", questionCount: "3 Soru", done: false }
    ]
  }
]
