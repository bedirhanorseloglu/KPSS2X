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
    color: "#F43F5E",
    category: "Genel Yetenek",
    subCategory: "Sözel",
    icon: "📘",
    topics: [
      { id: "tr-1", title: "Sözcükte Anlam", done: false, questionCount: "1-2 Soru" },
      { id: "tr-2", title: "Söz Öbeklerinde Anlam, Deyim & Atasözleri", done: false, questionCount: "1-2 Soru" },
      { id: "tr-3", title: "Cümlede Anlam & Cümle Yorumu", done: false, isRoutine: true, questionCount: "3-4 Soru" },
      { id: "tr-4", title: "Paragrafta Anlam & Ana Düşünce", done: false, isRoutine: true, questionCount: "12-14 Soru" },
      { id: "tr-5", title: "Paragrafta Yapı & Paragraf Oluşturma", done: false, isRoutine: true, questionCount: "3-4 Soru" },
      { id: "tr-6", title: "Paragrafta Anlatım Biçimleri & Düşünceyi Geliştirme Yolları", done: false, questionCount: "1-2 Soru" },
      { id: "tr-7", title: "Ses Bilgisi", done: false, questionCount: "1 Soru" },
      { id: "tr-8", title: "Sözcükte Yapı (Kök, Ek ve Gövde)", done: false, questionCount: "1 Soru" },
      { id: "tr-9", title: "Sözcük Türleri (İsim, Sıfat, Zamir, Zarf, Edat, Bağlaç, Ünlem)", done: false, questionCount: "1-2 Soru" },
      { id: "tr-12", title: "Fiiller, Ek Fiil ve Fiilimsiler", done: false, questionCount: "1-2 Soru" },
      { id: "tr-13", title: "Cümlenin Ögeleri", done: false, questionCount: "1 Soru" },
      { id: "tr-14", title: "Cümle Türleri", done: false, questionCount: "1 Soru" },
      { id: "tr-15", title: "Yazım Kuralları", done: false, questionCount: "1-2 Soru" },
      { id: "tr-16", title: "Noktalama İşaretleri", done: false, questionCount: "1-2 Soru" },
      { id: "tr-17", title: "Anlatım Bozuklukları", done: false, questionCount: "0-1 Soru" },
      { id: "tr-18", title: "Sözel Mantık ve Akıl Yürütme", done: false, isRoutine: true, questionCount: "4 Soru" }
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
      { id: "mat-1", title: "Temel Kavramlar & Sayı Kümeleri", done: false, questionCount: "2-3 Soru" },
      { id: "mat-2", title: "Tek-Çift Sayılar & Pozitif-Negatif Sayılar", done: false, questionCount: "1-2 Soru" },
      { id: "mat-3", title: "Ardışık Sayılar ve Faktöriyel", done: false, questionCount: "1-2 Soru" },
      { id: "mat-4", title: "Sayı Basamakları ve Çözümleme", done: false, questionCount: "1-2 Soru" },
      { id: "mat-5", title: "Bölme ve Bölünebilme Kuralları", done: false, questionCount: "1 Soru" },
      { id: "mat-6", title: "Asal Çarpanlar ve EBOB - EKOK", done: false, questionCount: "1-2 Soru" },
      { id: "mat-7", title: "Rasyonel ve Ondalık Sayılar", done: false, questionCount: "2-3 Soru" },
      { id: "mat-8", title: "Basit Eşitsizlikler", done: false, questionCount: "1 Soru" },
      { id: "mat-9", title: "Mutlak Değer", done: false, questionCount: "1 Soru" },
      { id: "mat-10", title: "Üslü Sayılar", done: false, questionCount: "2-3 Soru" },
      { id: "mat-11", title: "Köklü Sayılar", done: false, questionCount: "2-3 Soru" },
      { id: "mat-12", title: "Çarpanlara Ayırma ve Sadeleştirme", done: false, questionCount: "1-2 Soru" },
      { id: "mat-13", title: "Oran - Orantı ve Denklem Çözme", done: false, questionCount: "1-2 Soru" },
      { id: "mat-14", title: "Sayı ve Kesir Problemleri", done: false, isRoutine: true, questionCount: "3-4 Soru" },
      { id: "mat-15", title: "Yaş Problemleri", done: false, isRoutine: true, questionCount: "1 Soru" },
      { id: "mat-16", title: "İşçi ve Havuz Problemleri", done: false, isRoutine: true, questionCount: "1 Soru" },
      { id: "mat-17", title: "Hareket (Hız) Problemleri", done: false, isRoutine: true, questionCount: "1 Soru" },
      { id: "mat-18", title: "Yüzde, Kar - Zarar Problemleri", done: false, isRoutine: true, questionCount: "2-3 Soru" },
      { id: "mat-19", title: "Karışım Problemleri", done: false, isRoutine: true, questionCount: "1 Soru" },
      { id: "mat-20", title: "Grafik ve Tablo Okuma Problemleri", done: false, isRoutine: true, questionCount: "2-3 Soru" },
      { id: "mat-21", title: "Kümeler ve Fonksiyonlar", done: false, questionCount: "1-2 Soru" },
      { id: "mat-22", title: "Permütasyon, Kombinasyon ve Olasılık", done: false, questionCount: "1-2 Soru" },
      { id: "mat-23", title: "Sayısal Mantık ve Akıl Yürütme", done: false, questionCount: "3-4 Soru" }
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
      { id: "geo-1", title: "Doğruda ve Üçgende Açılar", done: false, questionCount: "1 Soru" },
      { id: "geo-2", title: "Dik Üçgen, İkizkenar ve Eşkenar Üçgen", done: false, questionCount: "1-2 Soru" },
      { id: "geo-3", title: "Üçgende Açıortay, Kenarortay ve Benzerlik", done: false, questionCount: "1 Soru" },
      { id: "geo-4", title: "Üçgende Alan", done: false, questionCount: "1 Soru" },
      { id: "geo-5", title: "Çokgenler ve Özel Dörtgenler (Paralelkenar, Kare, Dikdörtgen)", done: false, questionCount: "1-2 Soru" },
      { id: "geo-6", title: "Çember ve Daire", done: false, questionCount: "1 Soru" },
      { id: "geo-7", title: "Analitik Geometri", done: false, questionCount: "1 Soru" },
      { id: "geo-8", title: "Katı Cisimler (Prizma, Silindir, Koni)", done: false, questionCount: "1 Soru" }
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
      { id: "hist-1", title: "İslamiyet Öncesi Türk Tarihi", done: false, questionCount: "1 Soru" },
      { id: "hist-2", title: "İlk Türk-İslam Devletleri ve Türkiye Selçukluları", done: false, questionCount: "2 Soru" },
      { id: "hist-3", title: "Osmanlı Devleti Kuruluş Dönemi", done: false, questionCount: "1 Soru" },
      { id: "hist-4", title: "Osmanlı Devleti Yükselme Dönemi", done: false, questionCount: "1 Soru" },
      { id: "hist-5", title: "Osmanlı Devleti Kültür ve Medeniyeti", done: false, questionCount: "3-4 Soru" },
      { id: "hist-6", title: "Osmanlı Devleti Duraklama Dönemi (XVII. Yüzyıl)", done: false, questionCount: "1 Soru" },
      { id: "hist-7", title: "Osmanlı Devleti Gerileme Dönemi (XVIII. Yüzyıl)", done: false, questionCount: "1 Soru" },
      { id: "hist-8", title: "Osmanlı Devleti Dağılma Dönemi (XIX. Yüzyıl)", done: false, questionCount: "1-2 Soru" },
      { id: "hist-9", title: "XX. Yüzyıl Başlarında Osmanlı Devleti & Savaşlar", done: false, questionCount: "2 Soru" },
      { id: "hist-10", title: "Kurtuluş Savaşı Hazırlık Dönemi (Genelge & Kongreler)", done: false, questionCount: "2-3 Soru" },
      { id: "hist-11", title: "I. TBMM Dönemi ve Ayaklanmalar", done: false, questionCount: "1-2 Soru" },
      { id: "hist-12", title: "Kurtuluş Savaşı Muharebeler Dönemi & Antlaşmalar", done: false, questionCount: "2-3 Soru" },
      { id: "hist-13", title: "Atatürk İlke ve İnkılapları", done: false, questionCount: "3-4 Soru" },
      { id: "hist-14", title: "Atatürk Dönemi İç ve Dış Politika", done: false, questionCount: "1-2 Soru" },
      { id: "hist-15", title: "Çağdaş Türk ve Dünya Tarihi", done: false, questionCount: "3 Soru" }
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
      { id: "cog-1", title: "Türkiye'nin Coğrafi Konumu ve Özellikleri", done: false, questionCount: "1 Soru" },
      { id: "cog-2", title: "Türkiye'nin Dağları, Ovaları ve Platoları", done: false, questionCount: "2 Soru" },
      { id: "cog-3", title: "Türkiye'nin Akarsuları, Gölleri ve Su Kaynakları", done: false, questionCount: "1-2 Soru" },
      { id: "cog-4", title: "Türkiye'nin İklimi ve Bitki Örtüsü", done: false, questionCount: "2-3 Soru" },
      { id: "cog-5", title: "Türkiye'de Nüfusun Dağılışı, Yapısı ve Göçler", done: false, questionCount: "2-3 Soru" },
      { id: "cog-6", title: "Türkiye'de Yerleşme Tipleri ve Özellikleri", done: false, questionCount: "1 Soru" },
      { id: "cog-7", title: "Türkiye'de Tarım ve Hayvancılık", done: false, questionCount: "2 Soru" },
      { id: "cog-8", title: "Türkiye'de Madenler ve Çıkarıldığı Yerler", done: false, questionCount: "1-2 Soru" },
      { id: "cog-9", title: "Türkiye'de Enerji Kaynakları", done: false, questionCount: "1-2 Soru" },
      { id: "cog-10", title: "Türkiye'de Sanayi Tesisleri ve Dağılışı", done: false, questionCount: "2 Soru" },
      { id: "cog-11", title: "Türkiye'de Ulaşım Ağları ve Ticaret", done: false, questionCount: "1-2 Soru" },
      { id: "cog-12", title: "Türkiye'de Turizm Varlıkları", done: false, questionCount: "1 Soru" },
      { id: "cog-13", title: "Bölgesel Kalkınma Projeleri (GAP, DAP, DOKAP vb.)", done: false, questionCount: "1 Soru" }
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
      { id: "vat-1", title: "Hukukun Temel Kavramları ve Hukuk Kuralları", done: false, questionCount: "1-2 Soru" },
      { id: "vat-2", title: "Hak Kavramı, Hakların Kazanılması ve Korunması", done: false, questionCount: "1 Soru" },
      { id: "vat-3", title: "Kişilik Hukuku ve Ehliyet Türleri", done: false, questionCount: "1 Soru" },
      { id: "vat-4", title: "Devlet Biçimleri ve Hükümet Sistemleri", done: false, questionCount: "1 Soru" },
      { id: "vat-5", title: "Türk Anayasa Tarihi (1876-1961)", done: false, questionCount: "1 Soru" },
      { id: "vat-6", title: "1982 Anayasası'nın Genel Esasları", done: false, questionCount: "1 Soru" },
      { id: "vat-7", title: "Temel Hak ve Hürriyetler", done: false, questionCount: "1 Soru" },
      { id: "vat-8", title: "Yasama Organı (TBMM Görev ve Yetkileri)", done: false, questionCount: "1 Soru" },
      { id: "vat-9", title: "Yürütme Organı (Cumhurbaşkanı & Kararnameler)", done: false, questionCount: "1 Soru" },
      { id: "vat-10", title: "Yargı Organı ve Yüksek Mahkemeler", done: false, questionCount: "1 Soru" },
      { id: "vat-11", title: "İdare Hukuku Temelleri & Örgüt Yapısı", done: false, questionCount: "2 Soru" },
      { id: "vat-12", title: "Devlet Memurluğu Kanunu (657 DMK)", done: false, questionCount: "1 Soru" },
      { id: "vat-13", title: "Uluslararası Kuruluşlar (BM, AB, NATO vb.)", done: false, questionCount: "1-2 Soru" },
      { id: "vat-14", title: "Güncel Bilgiler ve Genel Kültür", done: false, questionCount: "4-5 Soru" }
    ]
  }
]
