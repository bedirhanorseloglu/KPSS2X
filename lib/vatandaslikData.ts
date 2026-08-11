export interface VatandaslikQuestion {
  id: string;
  section: string; // e.g. "Bölüm 1: Hukuka Giriş"
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export const VATANDASLIK_SECTIONS = [
  "Tümü",
  "Bölüm 1: Hukuka Giriş",
  "Bölüm 2: Kişiler ve Aile Hukuku",
  "Bölüm 3: Anayasa Tarihi",
  "Bölüm 4: 1982 Anayasası - Genel Hükümler",
  "Bölüm 5: Temel Hak ve Hürriyetler",
  "Bölüm 6: Yasama",
  "Bölüm 7: Yürütme",
  "Bölüm 8: Yargı",
  "Bölüm 9: İdare Hukuku",
  "Bölüm 10: İnsan Hakları Hukuku"
];

export const VATANDASLIK_QUESTIONS: VatandaslikQuestion[] = [
  // BÖLÜM 1: TEMEL HUKUK KAVRAMLARI - 1 (HUKUKA GİRİŞ)
  {
    id: "v_1_1",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Aşağıdakilerden hangisi insan davranışlarını düzenleyen sosyal hayat kuralları arasında yer almaz?",
    options: ["Din kuralları", "Ahlak kuralları", "Matematik kuralları", "Görgü kuralları", "Hukuk kuralları"],
    correctAnswer: "Matematik kuralları",
    explanation: "Din, ahlak, görgü ve hukuk kuralları sosyal hayatı düzenleyen kurallardır. Matematik veya fizik kuralları ise doğa ve mantık kuralları olup sosyal hayatı düzenleme amacı gütmez."
  },
  {
    id: "v_1_2",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Hukuk kurallarının temel amaçları arasında aşağıdakilerden hangileri yer alır?\nI. Toplumda düzen ve güvenliği sağlamak\nII. Kişisel öç alma hakkını ortadan kaldırmak (İhkak-ı hak yasağı)\nIII. Toplumdaki tüm bireyleri her alanda mutlak eşit kılmak",
    options: ["Yalnız I", "I ve II", "I ve III", "II ve III", "I, II ve III"],
    correctAnswer: "I ve II",
    explanation: "Hukuk kuralları düzeni, güvenliği ve barışı sağlar; kişilerin kendi gücüyle hak aramasını (ihkak-ı hak) yasaklar. Ancak mutlak eşitlik imkansızdır; asıl amaç adaleti ve fırsat eşitliğini sağlamaktır."
  },
  {
    id: "v_1_3",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Hukuk kurallarının belli bir kişiye özgü olmaması, genel ve soyut olması hukuk kurallarının hangi niteliğini gösterir?",
    options: ["Yazılı olması", "Sürekliliği", "Kişilik dışı (genel) olması", "Devlet yaptırımlı olması", "Soyut olması"],
    correctAnswer: "Kişilik dışı (genel) olması",
    explanation: "Hukuk kuralları bireylere özel yazılmaz. Bireysel olmayan, genel ve herkesi kapsayan niteliğine 'kişilik dışı' veya 'genellik' ilkesi denir."
  },
  {
    id: "v_1_4",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Bir devlet memuruna, memurluk sıfatıyla bağdaşmayacak davranışları nedeniyle disiplin cezası verilmesi durumunda, bu işlemin hukuki niteliği ve iptal davası açılacak yargı yeri aşağıdakilerden hangisidir?",
    options: ["Adli işlem - Asliye Hukuk Mahkemesi", "İdari işlem - İdari Yargı", "Cezai işlem - Ağır Ceza Mahkemesi", "Hükümsüz işlem - Sulh Hukuk Mahkemesi", "Siyasi işlem - Anayasa Mahkemesi"],
    correctAnswer: "İdari işlem - İdari Yargı",
    explanation: "Disiplin cezaları idarenin tek taraflı irade açıklamasıyla tesis ettiği birer idari işlemdir. İdari işlemlerin hukuka aykırılığı durumunda idari yargıda iptal davası açılır."
  },
  {
    id: "v_1_5",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Aşağıdaki sözleşmelerden hangisinin yaptırımı 'kesin hükümsüzlük' (butlan) değildir?",
    options: ["Konusu hukuken ve fiilen imkansız olan sözleşmeler", "Ayırt etme gücü bulunmayan kişilerin yaptığı sözleşmeler", "Tehdit ve korkutma (ikrah) altında yapılan sözleşmeler", "Ahlaka ve kamu düzenine aykırı sözleşmeler", "Kanunun emredici hükümlerine aykırı sözleşmeler"],
    correctAnswer: "Tehdit ve korkutma (ikrah) altında yapılan sözleşmeler",
    explanation: "Hata, hile, korkutma (ikrah) ve aşırı yararlanma (gabin) durumlarında yapılan sözleşmeler 'tek taraflı bağlamazlık' (askıda geçersizlik) yaptırımına tabidir."
  },
  {
    id: "v_1_6",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Aşağıdakilerden hangisi tazminat yaptırımının ortaya çıkması için gereken unsurlardan biri değildir?",
    options: ["Hukuka aykırı bir fiil", "Kusur (kast veya ihmal)", "Bir zararın meydana gelmiş olması", "Zarar ile fiil arasında illiyet (sebep-sonuç) bağı", "Kamusal yetki belgesi"],
    correctAnswer: "Kamusal yetki belgesi",
    explanation: "Tazminat borcunun doğması için haksız fiil sorumluluğunun dört unsuru bulunmalıdır: Hukuka aykırı fiil, kusur, zarar ve illiyet bağı. Kamusal yetki belgesi şartı yoktur."
  },
  {
    id: "v_1_7",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Kira sözleşmesinde ödeme gününün sadece 'ay başı' olarak kararlaştırılması durumunda, kanunun bunu 'ayın birinci günü' olarak kabul etmesi ne tür bir hukuk kuralıdır?",
    options: ["Emredici kural", "Tamlayıcı kural", "Yorumlayıcı kural", "Tanımlayıcı kural", "Yetki verici kural"],
    correctAnswer: "Yorumlayıcı kural",
    explanation: "Birden fazla anlama gelebilecek beyanların ve kavramların ne anlama geldiğini açıklayan kurallara 'yorumlayıcı hukuk kuralları' denir."
  },
  {
    id: "v_1_8",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Belli bir ülkede belli bir dönemde yürürlükte olan, yetkili makamlarca konulmuş yazılı hukuk kurallarının bütününe ne ad verilir?",
    options: ["Pozitif hukuk", "Mevzu hukuk (Mevzuat)", "Tabii (Doğal) hukuk", "Tarihi hukuk", "İdeal hukuk"],
    correctAnswer: "Mevzu hukuk (Mevzuat)",
    explanation: "Sadece yetkili makamlarca konulan yazılı kuralların bütününe 'mevzu hukuk' (mevzuat) denir. Yazılı ve yazısız kuralların tamamına ise 'pozitif hukuk' denir."
  },
  {
    id: "v_1_9",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Aşağıdakilerden hangisi hakim için bağlayıcı olan 'Asli Kaynaklar' arasında yer almaz?",
    options: ["Anayasa", "Kanunlar", "Yönetmelikler", "Doktrin (Bilimsel Görüşler)", "Örf ve Adet Hukuku"],
    correctAnswer: "Doktrin (Bilimsel Görüşler)",
    explanation: "Doktrin (bilimsel görüşler) ve mahkeme içtihatları hakim için bağlayıcı olmayan 'yardımcı kaynaklar'dır."
  },
  {
    id: "v_1_10",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Normlar hiyerarşisinde aşağıdakilerden hangisi diğerlerine göre daha üst bir basamakta yer alır?",
    options: ["Kanunlar", "Yönetmelikler", "Olağan Dönem Cumhurbaşkanlığı Kararnameleri", "Temel hak ve özgürlüklere ilişkin milletlerarası anlaşmalar", "Genelgeler"],
    correctAnswer: "Temel hak ve özgürlüklere ilişkin milletlerarası anlaşmalar",
    explanation: "Anayasa 90. maddesine göre, temel hak ve özgürlüklere ilişkin milletlerarası anlaşmalar kanunların da üzerinde, Anayasa'nın hemen altında yer alırlar."
  },
  {
    id: "v_1_11",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Medeni Kanun'un 1. maddesine göre, önüne gelen bir uyuşmazlıkta yazılı ve yazısız kaynaklarda hiçbir hüküm bulamayan hakimin izleyeceği yol aşağıdakilerden hangisidir?",
    options: ["Davayı reddetmek", "Anayasa Mahkemesi'ne başvurmak", "Kendisi kanun koyucu olsaydı nasıl bir kural koyacak idiyse ona göre karar vermek (Hukuk yaratmak)", "İçişleri Bakanlığı'ndan görüş istemek", "Kıyas yoluna giderek davayı ertelemek"],
    correctAnswer: "Kendisi kanun koyucu olsaydı nasıl bir kural koyacak idiyse ona göre karar vermek (Hukuk yaratmak)",
    explanation: "Yazılı ve yazısız kaynaklarda hüküm bulunmaması 'hukuk boşluğu'dur. Hakim bu durumda Medeni Kanun gereğince kendisini kanun koyucu yerine koyarak 'hukuk yaratır'."
  },
  {
    id: "v_1_12",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Ceza muhakemesinde, suç şüphesinin yetkili mercilerce öğrenilmesinden iddianamenin kabulüne kadar geçen aşamaya ne ad verilir?",
    options: ["Kovuşturma", "Soruşturma", "İnfaz", "Tahkikat", "Beraat"],
    correctAnswer: "Soruşturma",
    explanation: "Suç şüphesinin öğrenilmesinden iddianamenin kabulüne kadar geçen aşamaya 'soruşturma' denir. İddianamenin kabulünden sonraki yargılama ise 'kovuşturma'dır."
  },
  {
    id: "v_1_13",
    section: "Bölüm 1: Hukuka Giriş",
    question: "Kişi hürriyeti ve güvenliğini kısıtlayan 'tutuklama' kararı vermeye yetkili tek merci aşağıdakilerden hangisidir?",
    options: ["Cumhuriyet Savcısı", "Kolluk Amiri", "Vali veya Kaymakam", "Hakim/Mahkeme", "İçişleri Bakanı"],
    correctAnswer: "Hakim/Mahkeme",
    explanation: "Anayasa ve ceza mevzuatına göre tutuklama kararı yalnızca bağımsız ve tarafsız hakimler/mahkemeler tarafından verilebilir."
  },

  // BÖLÜM 2: TEMEL HUKUK KAVRAMLARI - 2 (KİŞİLER VE AİLE HUKUKU)
  {
    id: "v_2_1",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Aşağıdakilerden hangisi harcamalar üzerinden alınan dolaylı (vasıtalı) bir vergidir?",
    options: ["Gelir Vergisi", "Motorlu Taşıtlar Vergisi (MTV)", "Özel Tüketim Vergisi (ÖTV)", "Emlak Vergisi", "Veraset ve İntikal Vergisi"],
    correctAnswer: "Özel Tüketim Vergisi (ÖTV)",
    explanation: "ÖTV, KDV ve Damga Vergisi dolaylı vergilerdir. Gelir, MTV, Emlak ve Veraset vergileri ise doğrudan gelir veya servet üzerinden alınan dolaysız vergilerdir."
  },
  {
    id: "v_2_2",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Aşağıdakilerden hangisi Türk Medeni Kanunu'nun kapsamı içinde yer alan kitaplardan biri değildir?",
    options: ["Kişiler Hukuku", "Aile Hukuku", "Miras Hukuku", "Borçlar Hukuku", "Eşya Hukuku"],
    correctAnswer: "Borçlar Hukuku",
    explanation: "Türk Medeni Kanunu kişiler, aile, miras ve eşya olmak üzere 4 ana kitaptan oluşur. Borçlar Hukuku ayrı bir kanun (Türk Borçlar Kanunu) olarak düzenlenmiştir."
  },
  {
    id: "v_2_3",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Türk Medeni Kanunu'na göre gerçek kişilik ne zaman başlar?",
    options: ["Çocuğun ana rahmine düşmesiyle", "Tam ve sağ doğumla", "Ergin (reşit) olmakla", "Ayırt etme gücünün kazanılmasıyla", "Nüfusa tescil edilmekle"],
    correctAnswer: "Tam ve sağ doğumla",
    explanation: "Gerçek kişilik, çocuğun anneden tamamen ayrıldığı (tam) ve bir an bile olsa yaşadığı (sağ) doğum anında başlar."
  },
  {
    id: "v_2_4",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Bir kimsenin ölümüne kesin gözüyle bakılmayı gerektiren durumlar içinde kaybolması halinde, mahkeme kararına gerek kalmaksızın en büyük mülki amirin emriyle kütüğe ölüm kaydı düşülmesine ne ad verilir?",
    options: ["Gaiplik", "Ölüm karinesi", "Birlikte ölüm karinesi", "Hak ehliyeti yitimi", "Fiili ölüm"],
    correctAnswer: "Ölüm karinesi",
    explanation: "Ölümüne kesin gözüyle bakılacak bir durumda kaybolan kişi için mülki amir kararıyla doğrudan ölüm kaydı düşülmesine 'ölüm karinesi' denir."
  },
  {
    id: "v_2_5",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Aşağıdakilerden hangisi fiil ehliyetine sahip olabilmek için aranan şartlardan biri değildir?",
    options: ["Ergin (reşit) olmak", "Ayırt etme gücüne sahip olmak (mümeyyiz olmak)", "Kısıtlı olmamak (mahcur olmamak)", "Türk vatandaşı olmak", "Akıl sağlığı yerinde olmak"],
    correctAnswer: "Türk vatandaşı olmak",
    explanation: "Fiil ehliyetinin üç şartı vardır: Ergin olmak, ayırt etme gücü ve kısıtlı olmamak. Vatandaşlık şart değildir."
  },
  {
    id: "v_2_6",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Türk Medeni Kanunu'na göre mahkeme kararıyla kısıtlanma (vesayet altına alınma) sebepleri arasında aşağıdakilerden hangisi yer almaz?",
    options: ["Akıl hastalığı veya akıl zayıflığı", "Savurganlık, alkol veya uyuşturucu madde bağımlığı", "Yaş küçüklüğü", "Kötü yaşam tarzı veya kötü yönetim", "5 yıl veya daha fazla süreyle kesinleşmiş hapis cezası almak"],
    correctAnswer: "Yaş küçüklüğü",
    explanation: "Yaşı küçük olanlar zaten velayet altındadır; yaş küçüklüğü bir kısıtlılık (vesayet) sebebi değildir."
  },
  {
    id: "v_2_7",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Kaza-i rüşt (mahkeme kararıyla ergin kılınma) talep edebilmek için en az kaç yaşın doldurulmuş olması gerekir?",
    options: ["15", "16", "17", "18", "12"],
    correctAnswer: "15",
    explanation: "15 yaşını doldurmuş bir küçük, kendi menfaati gerektiriyorsa velisinin izni ve mahkeme kararıyla ergin kılınabilir (kaza-i rüşt)."
  },
  {
    id: "v_2_8",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Olağanüstü evlenme yaşı ve bu evliliğe karar vermeye yetkili mercii aşağıdakilerden hangisinde doğru verilmiştir?",
    options: ["17 yaşın doldurulması - Veli izni", "16 yaşın doldurulması - Mahkeme kararı", "15 yaşın doldurulması - Vasi onayı", "18 yaşın doldurulması - Kişisel irade", "16 yaşın doldurulması - Nüfus Müdürlüğü izni"],
    correctAnswer: "16 yaşın doldurulması - Mahkeme kararı",
    explanation: "Olağanüstü durumlarda 16 yaşını doldurmuş kişi mahkeme kararıyla evlenebilir. Olağan evlenme yaşı ise veli izniyle 17 yaşın doldurulmasıdır."
  },
  {
    id: "v_2_9",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Ayırt etme gücü olmayan (tam ehliyetsiz) bir kişinin yaptığı tüm hukuki işlemlerin yaptırımı nedir?",
    options: ["İptal edilebilir olmak", "Tek taraflı bağlamazlık", "Kesin hükümsüzlük (yokluk/butlan)", "Askıda geçersizlik", "Nispi butlan"],
    correctAnswer: "Kesin hükümsüzlük (yokluk/butlan)",
    explanation: "Ayırt etme gücü olmayan kişilerin yaptıkları hukuki işlemler baştan itibaren kesin olarak hükümsüzdür."
  },
  {
    id: "v_2_10",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Kendilerine 'yasal danışman' atanmış olan kişiler, fiil ehliyeti sınıflandırmasına göre hangi grupta yer alırlar?",
    options: ["Tam ehliyetliler", "Sınırlı ehliyetliler", "Sınırlı ehliyetsizler", "Tam ehliyetsizler", "Sınırsız ehliyetliler"],
    correctAnswer: "Sınırlı ehliyetliler",
    explanation: "Ayırt etme gücü olan, ergin ve kısıtlı olmayan ancak bazı parasal/hukuki işlemleri için yasal danışman atanan kişilere 'sınırlı ehliyetli' denir."
  },
  {
    id: "v_2_11",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Özel hukuk tüzel kişilerinden 'dernekler' en az kaç kişiyle, 'siyasi partiler' en az kaç kişiyle kurulur?",
    options: ["Dernek en az 5 - Siyasi parti en az 20", "Dernek en az 7 - Siyasi parti en az 30", "Dernek en az 1 - Siyasi parti en az 100", "Dernek en az 7 - Siyasi parti en az 20", "Dernek en az 10 - Siyasi parti en az 50"],
    correctAnswer: "Dernek en az 7 - Siyasi parti en az 30",
    explanation: "Dernekler en az 7 kişiyle, siyasi partiler ise en az 30 Türk vatandaşıyla kurulur."
  },
  {
    id: "v_2_12",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Adını değiştirmek isteyen bir kişi, Türk Medeni Kanunu'na göre bu değişikliği hangi yolla gerçekleştirebilir?",
    options: ["E-devlet üzerinden başvuruyla doğrudan", "Nüfus Müdürlüğüne verilecek bir dilekçeyle", "Haklı bir sebep ileri sürerek açılacak dava sonucunda Mahkeme Kararıyla", "Noter huzurunda yapılacak beyanla", "Muhtarlık onayıyla"],
    correctAnswer: "Haklı bir sebep ileri sürerek açılacak dava sonucunda Mahkeme Kararıyla",
    explanation: "Adın değiştirilmesi ancak haklı sebeplere dayanılarak açılacak dava sonucu Mahkeme Kararıyla gerçekleştirilebilir."
  },
  {
    id: "v_2_13",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Baba bir (öz olmayan, sadece babaları ortak) kardeşler arasındaki hısımlığın türü ve derecesi aşağıdakilerden hangisidir?",
    options: ["1. derece üst soy tam kan hısımlığı", "2. derece yan soy yarım kan hısımlığı", "3. derece yan soy yarım kan hısımlığı", "2. derece yan soy tam kan hısımlığı", "4. derece yan soy yarım kan hısımlığı"],
    correctAnswer: "2. derece yan soy yarım kan hısımlığı",
    explanation: "Kardeşler arasında 2. derece hısımlık vardır. Tek ebeveyn ortaklığı yarım kan, kardeşlik ilişkisi ise yan soy hısımlığıdır."
  },
  {
    id: "v_2_14",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Kuzenler (teyze/hala/amca/dayı çocukları) arasındaki hısımlık derecesi ve türü nedir?",
    options: ["3. derece yan soy kan hısımlığı", "4. derece yan soy kan hısımlığı", "4. derece üst soy kan hısımlığı", "3. derece üst soy kayın hısımlığı", "Hısımlık ilişkisi yoktur"],
    correctAnswer: "4. derece yan soy kan hısımlığı",
    explanation: "Kuzenler ortak büyükanne/büyükbabadan türedikleri için aralarında 4. derece yan soy kan hısımlığı bulunur."
  },
  {
    id: "v_2_15",
    section: "Bölüm 2: Kişiler ve Aile Hukuku",
    question: "Maddi değeri olan bir eşya üzerinde sahibine kullanma, yararlanma ve tasarruf (satma/devretme) yetkilerinin tamamını veren en geniş kapsamlı ayni hak hangisidir?",
    options: ["İrtifak hakkı", "Rehin hakkı", "Mülkiyet hakkı", "İntifa hakkı", "Zilyetlik"],
    correctAnswer: "Mülkiyet hakkı",
    explanation: "Mülkiyet hakkı sahibine kullanma, yararlanma ve tasarruf etme yetkilerinin tamamını veren en geniş kapsamlı tam ayni haktır."
  },

  // BÖLÜM 3: ANAYASA HUKUKUNA GİRİŞ VE ANAYASA TARİHİ
  {
    id: "v_3_1",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "Mevcut ve yürürlükteki bir anayasanın öngördüğü usul ve kurallara bağlı kalarak, o anayasada değişiklik yapan iktidar türü aşağıdakilerden hangisidir?",
    options: ["Asli kurucu iktidar", "Tali kurucu iktidar", "Kurulmuş iktidar", "Siyasi iktidar", "De facto iktidar"],
    correctAnswer: "Tali kurucu iktidar",
    explanation: "Anayasayı sıfırdan yapan iktidara 'asli kurucu iktidar', mevcut anayasa kuralları dahilinde değişiklik yapan hukuka bağlı güce 'tali kurucu iktidar' denir."
  },
  {
    id: "v_3_2",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "Aşağıdakilerden hangisi bir anayasanın 'katı (sert) anayasa' niteliğinde olduğunu gösteren ölçütlerden biri değildir?",
    options: ["Değiştirilmesi için nitelikli (yüksek) çoğunluklar aranması", "Bazı maddelerinin değiştirilmesinin veya değiştirilmesinin teklif edilmesinin yasaklanması", "Değiştirilmesinin normal kanunlarla tamamen aynı usul ve çoğunluğa tabi olması", "Değişikliğin kabulü için halk oyuna (referandum) sunulma şartı bulunması", "Değişiklik tekliflerinin mecliste belirli aralıklarla birden fazla kez görüşülmesi kuralı"],
    correctAnswer: "Değiştirilmesinin normal kanunlarla tamamen aynı usul ve çoğunluğa tabi olması",
    explanation: "Bir anayasa normal kanunlar gibi kolayca değiştirilebiliyorsa 'yumuşak' anayasadır (1921 Anayasası gibi)."
  },
  {
    id: "v_3_3",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "Türk anayasa tarihinde hem 1876 Kanun-ı Esasi'de hem de 1961 Anayasası'nda yer alan ortak kurumsal yapı aşağıdakilerden hangisidir?",
    options: ["Anayasa Mahkemesi", "Çift Meclisli Parlamento Yapısı", "Cumhurbaşkanlığı Hükümet Sistemi", "Tek Partili Meclis", "Devlet Denetleme Kurulu"],
    correctAnswer: "Çift Meclisli Parlamento Yapısı",
    explanation: "1876 Kanun-ı Esasi'de Meclis-i Mebusan ve Meclis-i Ayan; 1961 Anayasası'nda ise Millet Meclisi ve Cumhuriyet Senatosu olmak üzere parlamento çift meclislidir."
  },
  {
    id: "v_3_4",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "1982 Anayasası'nı hazırlayan kurucu iktidarın sivil kanadını oluşturan meclis aşağıdakilerden hangisidir?",
    options: ["Temsilciler Meclisi", "Danışma Meclisi", "Milli Birlik Komitesi", "Milli Güvenlik Konseyi", "Kurucu Meclis Genel Kurulu"],
    correctAnswer: "Danışma Meclisi",
    explanation: "1982 Anayasası'nı hazırlayan sivil kanat 'Danışma Meclisi', askeri kanat ise 'Milli Güvenlik Konseyi'dir."
  },
  {
    id: "v_3_5",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "'Egemenlik kayıtsız şartsız milletindir' ifadesi ilk kez aşağıdaki anayasaların hangisinde yer almıştır?",
    options: ["1876 Kanun-ı Esasi", "1921 Anayasası (Teşkilat-ı Esasiye)", "1924 Anayasası", "1961 Anayasası", "1982 Anayasası"],
    correctAnswer: "1921 Anayasası (Teşkilat-ı Esasiye)",
    explanation: "Bu ilke ilk kez 1921 Teşkilat-ı Esasiye Kanunu'nun 1. maddesinde 'Egemenlik bila kaydü şart milletindir' şeklinde yer almıştır."
  },
  {
    id: "v_3_6",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "Ankara'nın başkent olması ilk kez hangi anayasada açıkça düzenlenmiştir?",
    options: ["1921 Anayasası", "1924 Anayasası", "1961 Anayasası", "1982 Anayasası", "1876 Kanun-ı Esasi"],
    correctAnswer: "1924 Anayasası",
    explanation: "Ankara 13 Ekim 1923'te kanunla başkent yapılmıştır ancak anayasa metnine ilk girişi 1924 Anayasası ile olmuştur."
  },
  {
    id: "v_3_7",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "Türkiye'de Cumhurbaşkanlığı makamı ilk defa ne zaman kurulmuş ve düzenlenmiştir?",
    options: ["1921 Anayasası'nın 1923 Değişikliğiyle", "1924 Anayasası'nın kabulüyle", "1961 Anayasası'yla", "1921 Anayasası'nın ilk halinde", "Saltanatın kaldırılmasıyla doğrudan"],
    correctAnswer: "1921 Anayasası'nın 1923 Değişikliğiyle",
    explanation: "29 Ekim 1923'te yapılan anayasa değişikliği ile cumhuriyet ilan edilmiş ve 'Türkiye Devletinin başkanı Cumhurbaşkanıdır' hükmü getirilmiştir."
  },
  {
    id: "v_3_8",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "Türk anayasa hukukunda hem parlamenter sistemin hem de meclis hükümeti sisteminin özelliklerini barındıran 'karma hükümet sistemi' hangi anayasa döneminde uygulanmıştır?",
    options: ["1921 Anayasası", "1924 Anayasası", "1961 Anayasası", "1982 Anayasası", "1876 Kanun-ı Esasi"],
    correctAnswer: "1924 Anayasası",
    explanation: "1924 Anayasası egemenliği TBMM'ye vererek kuvvetler birliğini benimsemiş ancak yürütmeyi CB ve Bakanlar Kurulu'na vererek görevleri ayırmıştır."
  },
  {
    id: "v_3_9",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "Gizli oy, açık sayım ve döküm esasına dayalı, yargı denetimi altında yapılan ilk milletvekili seçimleri hangi yılda gerçekleştirilmiştir?",
    options: ["1923", "1946", "1950", "1961", "1934"],
    correctAnswer: "1950",
    explanation: "Türkiye'de demokratik seçim standartlarına (gizli oy, açık tasnif, yargısal güvence) uygun ilk seçimler 1950 yılında yapılmıştır."
  },
  {
    id: "v_3_10",
    section: "Bölüm 3: Anayasa Tarihi",
    question: "Anayasa yargısını gerçekleştirmek ve kanunların anayasaya uygunluğunu denetlemek üzere 'Anayasa Mahkemesi' ilk kez hangi anayasa ile kurulmuştur?",
    options: ["1924 Anayasası", "1961 Anayasası", "1982 Anayasası", "1921 Anayasası", "1876 Kanun-ı Esasi"],
    correctAnswer: "1961 Anayasası",
    explanation: "Kanunların anayasal denetimini yapmak üzere Anayasa Mahkemesi ilk kez 1961 Anayasası ile kurulmuştur."
  },

  // BÖLÜM 4: 1982 ANAYASASI - GENEL HÜKÜMLER
  {
    id: "v_4_1",
    section: "Bölüm 4: 1982 Anayasası - Genel Hükümler",
    question: "1982 Anayasası'nın 11. maddesinde yer alan 'Kanunlar anayasaya aykırı olamaz' hükmü anayasa hukukunda hangi ilkeyi ifade eder?",
    options: ["Kuvvetler ayrılığı", "Anayasanın bağlayıcılığı ve üstünlüğü", "Kanuni idare ilkesi", "Sosyal devlet ilkesi", "Yasama dokunulmazlığı"],
    correctAnswer: "Anayasanın bağlayıcılığı ve üstünlüğü",
    explanation: "Anayasa'nın 11. maddesi 'Anayasanın Bağlayıcılığı ve Üstünlüğü' başlığını taşır ve kanunların anayasaya aykırı olamayacağını belirtir."
  },
  {
    id: "v_4_2",
    section: "Bölüm 4: 1982 Anayasası - Genel Hükümler",
    question: "Aşağıdakilerden hangisi 1982 Anayasası'nın 2. maddesinde düzenlenen Cumhuriyetin temel niteliklerinden biri değildir?",
    options: ["Demokratik devlet", "Laik devlet", "Resmi dinin İslam olduğu devlet", "Sosyal devlet", "Hukuk devleti"],
    correctAnswer: "Resmi dinin İslam olduğu devlet",
    explanation: "1982 Anayasası'nda devletin resmi dininin İslam olduğu yönünde bir hüküm yer almaz (bu hüküm 1928'de Anayasa'dan çıkarılmıştır)."
  },
  {
    id: "v_4_3",
    section: "Bölüm 4: 1982 Anayasası - Genel Hükümler",
    question: "Devletin görevinin sadece asayişi korumak olmadığı, aynı zamanda bireylerin ekonomik refahını sağlamak, milli geliri adaletli dağıtmak ve vergide adaleti gözetmek olduğunu savunan devlet modeli hangisidir?",
    options: ["Demokratik devlet", "Laik devlet", "Sosyal devlet", "Üniter devlet", "Polis devleti"],
    correctAnswer: "Sosyal devlet",
    explanation: "Fırsat eşitliği, sosyal yardımlar ve milli gelirin adil dağıtımı gibi sosyal-ekonomik müdahaleler 'sosyal devlet' ilkesinin gereğidir."
  },
  {
    id: "v_4_4",
    section: "Bölüm 4: 1982 Anayasası - Genel Hükümler",
    question: "1982 Anayasası'na göre aşağıdakilerden hangisi anayasa metnine dahil değildir?",
    options: ["Başlangıç Metni", "Maddelerin kendisi", "Geçici Maddeler", "Madde kenar başlıkları (konu başlıkları)", "Son Hükümler"],
    correctAnswer: "Madde kenar başlıkları (konu başlıkları)",
    explanation: "Anayasa'nın 176. maddesine göre, madde kenar başlıkları sadece ilgili maddelerin konusunu gösterir, anayasa metnine dahil değildir."
  },
  {
    id: "v_4_5",
    section: "Bölüm 4: 1982 Anayasası - Genel Hükümler",
    question: "1982 Anayasası'nın 4. maddesine göre ilk kaç madde değiştirilemez ve değiştirilmesi dahi teklif edilemez?",
    options: ["İlk 2 madde", "İlk 3 madde", "İlk 4 madde", "Yalnızca 1. madde", "Anayasa'nın hiçbir maddesi değiştirilemez değildir"],
    correctAnswer: "İlk 3 madde",
    explanation: "Anayasa'nın 4. maddesi, ilk 3 maddenin değiştirilemeyeceğini ve değiştirilmesinin teklif dahi edilemeyeceğini hükme bağlar."
  },
  {
    id: "v_4_6",
    section: "Bölüm 4: 1982 Anayasası - Genel Hükümler",
    question: "Kadınlar, çocuklar, yaşlılar, engelliler, şehit dul ve yetimleri ile gaziler için yapılacak koruyucu düzenlemelerin eşitlik ilkesine aykırı sayılmaması hukukta ne adla anılır?",
    options: ["Mutlak eşitlik", "Siyasi imtiyaz", "Pozitif ayrımcılık (Özel koruma)", "Negatif ayrımcılık", "Sınıfsal eşitlik"],
    correctAnswer: "Pozitif ayrımcılık (Özel koruma)",
    explanation: "Dezavantajlı grupların fiili eşitliğini sağlamak amacıyla devletçe yapılan koruyucu düzenlemelere 'pozitif ayrımcılık' denir."
  },
  {
    id: "v_4_7",
    section: "Bölüm 4: 1982 Anayasası - Genel Hükümler",
    question: "1982 Anayasası'na göre yürütme yetkisi ve görevi kime verilmiştir?",
    options: ["TBMM ve Cumhurbaşkanı'na ortaklaşa", "Yalnızca Cumhurbaşkanı'na", "Bakanlar Kurulu'na", "Cumhurbaşkanı ve Başbakan'a", "Devlet Denetleme Kurulu'na"],
    correctAnswer: "Yalnızca Cumhurbaşkanı'na",
    explanation: "2017 anayasa değişikliği ile yürütme yetkisi tek başına ve münhasıran 'Cumhurbaşkanı' tarafından kullanılır."
  },

  // BÖLÜM 5: TEMEL HAK VE HÜRRİYETLER
  {
    id: "v_5_1",
    section: "Bölüm 5: Temel Hak ve Hürriyetler",
    question: "1982 Anayasası'nın 13. maddesine göre, temel hak ve hürriyetler olağan dönemlerde ancak neyle sınırlandırılabilir?",
    options: ["Cumhurbaşkanlığı Kararnamesiyle", "Kanunla", "Yönetmelikle", "İçişleri Bakanlığı Genelgesiyle", "Olağanüstü Hal Kararnamesiyle"],
    correctAnswer: "Kanunla",
    explanation: "Olağan dönemde temel hak ve hürriyetlerin sınırlandırılması ancak ve ancak TBMM tarafından çıkarılacak bir 'kanun' ile yapılabilir."
  },
  {
    id: "v_5_2",
    section: "Bölüm 5: Temel Hak ve Hürriyetler",
    question: "Aşağıdakilerden hangisi olağanüstü dönemlerde (savaş, OHAL) dahi dokunulması kesinlikle yasak olan 'Sert Çekirdek Haklar' arasında yer almaz?",
    options: ["Kişinin yaşama hakkı (savaş hukuku hariç)", "Maddi ve manevi varlığının bütünlüğü", "Din, vicdan, düşünce açıklamaya zorlanamama", "Eğitim ve öğrenim hakkı", "Masumiyet karinesi"],
    correctAnswer: "Eğitim ve öğrenim hakkı",
    explanation: "Eğitim hakkı çekirdek haklardan değildir, olağanüstü durumlarda askıya alınabilir veya durdurulabilir."
  },
  {
    id: "v_5_3",
    section: "Bölüm 5: Temel Hak ve Hürriyetler",
    question: "Temel hak ve hürriyetleri 'Negatif Statü', 'Pozitif Statü' ve 'Aktif Statü' Hakları olarak üçlü sınıflandırmaya tabi tutan ünlü hukukçu kimdir?",
    options: ["Karel Vasak", "George Jelinek", "Thomas Hobbes", "John Locke", "Jean Jacques Rousseau"],
    correctAnswer: "George Jelinek",
    explanation: "Bu üçlü ayrım anayasa hukukunda 'Jelinek Sınıflandırması' olarak bilinir."
  },
  {
    id: "v_5_4",
    section: "Bölüm 5: Temel Hak ve Hürriyetler",
    question: "Aşağıdaki haklardan hangisi Jelinek'in 'Negatif Statü (Koruyucu/Kişi) Hakları' arasında yer almaz?",
    options: ["Konut dokunulmazlığı", "Kişi hürriyeti ve güvenliği", "Sendika kurma hakkı", "Mülkiyet hakkı", "Haberleşme hürriyeti"],
    correctAnswer: "Sendika kurma hakkı",
    explanation: "Sendika kurma hakkı, Toplu İş Sözleşmesi ve Grev hakları sosyal-ekonomik haklar (pozitif statü hakları) arasında yer alır."
  },
  {
    id: "v_5_5",
    section: "Bölüm 5: Temel Hak ve Hürriyetler",
    question: "Anayasa'nın 38. maddesinde düzenlenen suç ve cezalara ilişkin ilkelerden hangisi yanlış verilmiştir?",
    options: ["Ceza sorumluluğu şahsidir.", "Kanunun suç saymadığı fiilden dolayı ceza verilemez.", "Savaş ve yakın savaş tehdidi halleri dışında ölüm (idam) cezası verilebilir.", "Genel müsadere cezası verilemez.", "Kimse kendisini veya yakınlarını suçlayıcı beyanda bulunmaya zorlanamaz."],
    correctAnswer: "Savaş ve yakın savaş tehdidi halleri dışında ölüm (idam) cezası verilebilir.",
    explanation: "Anayasamızda ölüm (idam) cezası ve genel müsadere cezası 'hiçbir şekilde' uygulanamaz, tamamen kaldırılmıştır."
  },
  {
    id: "v_5_6",
    section: "Bölüm 5: Temel Hak ve Hürriyetler",
    question: "Vatandaşın yurt dışına çıkış hürriyeti anayasaya göre ancak hangi sebeple ve ne şekilde sınırlandırılabilir?",
    options: ["Salgın hastalık tehlikesi durumunda Sağlık Bakanlığı kararıyla", "Vergi borcu olması durumunda Maliye Bakanlığı kararıyla", "Suç soruşturması veya kovuşturması sebebiyle hakim kararıyla", "Cumhurbaşkanı kararnamesiyle genel güvenlik gerekçesiyle", "Emniyet Genel Müdürlüğü'nün idari kararıyla"],
    correctAnswer: "Suç soruşturması veya kovuşturması sebebiyle hakim kararıyla",
    explanation: "Vatandaşın yurt dışına çıkış hürriyeti ancak suç soruşturması veya kovuşturması sebebiyle, hakim kararına bağlı olarak sınırlandırılabilir."
  },
  {
    id: "v_5_7",
    section: "Bölüm 5: Temel Hak ve Hürriyetler",
    question: "Türkiye'de ikamet eden yabancıların dilek ve şikayetleri hakkında yetkili mercilere başvurabilmeleri için anayasada aranan özel şart hangisidir?",
    options: ["En az 5 yıl Türkiye'de ikamet etmiş olmak", "Karşılıklılık (mütekabiliyet) esası gözetilmek kaydıyla", "Türkçe bilmek ve okuryazar olmak", "Türk vatandaşı bir kefil göstermek", "Yabancılar için dilekçe hakkı anayasada düzenlenmemiştir"],
    correctAnswer: "Karşılıklılık (mütekabiliyet) esası gözetilmek kaydıyla",
    explanation: "Yabancıların Türkiye'de dilekçe hakkını kullanabilmesi için 'karşılıklılık' (mütekabiliyet) esası aranır."
  },

  // BÖLÜM 6: YASAMA (TBMM YAPISI VE GÖREVLERİ)
  {
    id: "v_6_1",
    section: "Bölüm 6: Yasama",
    question: "Anayasa'ya göre Türkiye Büyük Millet Meclisi genel oyla seçilen kaç milletvekilinden oluşur?",
    options: ["450", "550", "600", "500", "650"],
    correctAnswer: "600",
    explanation: "2017 anayasa değişikliği ile milletvekili sayısı 550'den 600'e çıkarılmıştır."
  },
  {
    id: "v_6_2",
    section: "Bölüm 6: Yasama",
    question: "TBMM seçimleri anayasaya göre kural olarak kaç yılda bir ve hangi seçimle birlikte aynı gün yapılır?",
    options: ["4 yılda bir - Mahalli İdareler seçimiyle", "5 yılda bir - Cumhurbaşkanlığı seçimiyle", "5 yılda bir - Muhtarlık seçimiyle", "3 yılda bir - Senato seçimiyle", "4 yılda bir - Cumhurbaşkanlığı seçimiyle"],
    correctAnswer: "5 yılda bir - Cumhurbaşkanlığı seçimiyle",
    explanation: "TBMM ve Cumhurbaşkanlığı seçimleri 5 yılda bir, aynı gün birlikte yapılır."
  },
  {
    id: "v_6_3",
    section: "Bölüm 6: Yasama",
    question: "Seçimlerin geriye bırakılması (ertelenmesi) kararı anayasaya göre yalnızca hangi sebeple, ne kadar süreyle ve kim tarafından verilebilir?",
    options: ["Salgın hastalık sebebiyle - 6 ay - Cumhurbaşkanı", "Savaş sebebiyle - 1 yıl - TBMM", "Savaş sebebiyle - 6 ay - Yüksek Seçim Kurulu", "Ekonomik buhran sebebiyle - 1 yıl - TBMM", "Seferberlik sebebiyle - 2 yıl - Anayasa Mahkemesi"],
    correctAnswer: "Savaş sebebiyle - 1 yıl - TBMM",
    explanation: "Seçimler sadece 'savaş' sebebiyle, 'TBMM' kararıyla, '1 yıl' süreyle geriye bırakılabilir."
  },
  {
    id: "v_6_4",
    section: "Bölüm 6: Yasama",
    question: "Aşağıdakilerden hangisi milletvekili seçilebilmek için aranan şartlardan biri değildir?",
    options: ["Türk vatandaşı olmak", "En az ilkokul mezunu olmak", "18 yaşını doldurmuş olmak", "Askerlik hizmetini fiilen yapmış olmak", "Kısıtlı olmamak"],
    correctAnswer: "Askerlik hizmetini fiilen yapmış olmak",
    explanation: "Milletvekilliği için 'askerlikle ilişiği olmamak' yeterlidir; askerliği fiilen yapmış olma şartı yoktur."
  },
  {
    id: "v_6_5",
    section: "Bölüm 6: Yasama",
    question: "Seçimlerin genel yönetim ve denetimini yürütmekle görevli, kararlarına karşı başka bir merciye başvurulamayan anayasal kurul hangisidir?",
    options: ["Anayasa Mahkemesi", "Hakimler ve Savcılar Kurulu (HSK)", "Yüksek Seçim Kurulu (YSK)", "TBMM Başkanlık Divanı", "Sayıştay"],
    correctAnswer: "Yüksek Seçim Kurulu (YSK)",
    explanation: "Seçimlerin yargısal denetimini ve yönetimini Yüksek Seçim Kurulu (YSK) yapar. YSK kararları kesindir."
  },
  {
    id: "v_6_6",
    section: "Bölüm 6: Yasama",
    question: "TBMM tarafından kaldırılan 'milletvekili yasama dokunulmazlığı' kararına karşı, kaç gün içinde Anayasa Mahkemesi'ne başvurulabilir ve AYM kaç gün içinde karar verir?",
    options: ["7 gün içinde başvuru - 15 gün içinde karar (715 Kuralı)", "10 gün içinde başvuru - 30 gün içinde karar", "15 gün içinde başvuru - 15 gün içinde karar", "7 gün içinde başvuru - 7 gün içinde karar", "30 gün içinde başvuru - 60 gün içinde karar"],
    correctAnswer: "7 gün içinde başvuru - 15 gün içinde karar (715 Kuralı)",
    explanation: "Dokunulmazlığın kaldırılması veya vekilliğin düşürülmesi kararlarına karşı 7 gün içinde AYM'ye başvurulur; AYM 15 gün içinde karara bağlar (715 Kuralı)."
  },
  {
    id: "v_6_7",
    section: "Bölüm 6: Yasama",
    question: "Aşağıdakilerden hangisi bir parlamento kararı niteliğindedir (kanun değildir)?",
    options: ["Bütçenin kabul edilmesi", "Genel ve özel af ilan edilmesi", "TBMM İçtüzüğünün yapılması veya değiştirilmesi", "Para basılmasına karar verilmesi", "Milletlerarası antlaşmaların onaylanmasının uygun bulunması"],
    correctAnswer: "TBMM İçtüzüğünün yapılması veya değiştirilmesi",
    explanation: "TBMM İçtüzüğü, dokunulmazlığın kaldırılması, vekilliğin düşürülmesi, savaş ilanı ve seçimlerin yenilenmesi kararları 'parlamento kararı'dır."
  },
  {
    id: "v_6_8",
    section: "Bölüm 6: Yasama",
    question: "Milletvekilleri tarafından, Cumhurbaşkanı yardımcıları ve bakanlara yazılı olarak cevaplandırılmak üzere yöneltilen bilgi edinme yolu ve cevap süresi kaç gündür?",
    options: ["Meclis Araştırması - 30 gün", "Yazılı Soru - 15 gün", "Gensoru - 10 gün", "Meclis Soruşturması - 3 ay", "Sözlü Soru - 15 gün"],
    correctAnswer: "Yazılı Soru - 15 gün",
    explanation: "'Yazılı Soru', en geç 15 gün içinde cevaplandırılmak üzere sorulan bilgi edinme yoludur. Sözlü soru ve Gensoru 2017'de kaldırılmıştır."
  },

  // BÖLÜM 7: YÜRÜTME (CUMHURBAŞKANLIĞI YAPISI VE GÖREVLERİ)
  {
    id: "v_7_1",
    section: "Bölüm 7: Yürütme",
    question: "Yürütme yetki ve görevi anayasanın 8. maddesine göre aşağıdakilerden hangisi tarafından kullanılır?",
    options: ["Cumhurbaşkanı ve Başbakan", "Bakanlar Kurulu", "Cumhurbaşkanı", "TBMM Başkanlığı", "Cumhurbaşkanı Yardımcıları ve Bakanlar Kurulu"],
    correctAnswer: "Cumhurbaşkanı",
    explanation: "Anayasa'ya göre yürütme organı tek başlıdır ve bu yetki/görev sadece Cumhurbaşkanı'na aittir."
  },
  {
    id: "v_7_2",
    section: "Bölüm 7: Yürütme",
    question: "Aşağıdakilerden hangisi bir kimsenin Cumhurbaşkanı seçilebilmesi için aranan şartlardan biri değildir?",
    options: ["Türk vatandaşı olmak", "40 yaşını doldurmuş olmak", "Yükseköğrenim (üniversite) mezunu olmak", "Milletvekili seçilme yeterliliğine sahip olmak", "Milletvekili olmak"],
    correctAnswer: "Milletvekili olmak",
    explanation: "Cumhurbaşkanı adayı olmak için milletvekili olma şartı yoktur; parlamento dışından da aday olunabilir."
  },
  {
    id: "v_7_3",
    section: "Bölüm 7: Yürütme",
    question: "Cumhurbaşkanlığı seçimine ilişkin aşağıdakilerden hangisi yanlıştır?",
    options: ["Cumhurbaşkanı halk tarafından doğrudan seçilir.", "İlk turda seçilebilmek için geçerli oyların salt çoğunluğunu (en az %50 + 1 oy) almak gerekir.", "İlk turda çoğunluk sağlanamazsa, bunu izleyen ikinci pazar günü ikinci tur oylama yapılır.", "İkinci tura en çok oy alan ilk üç aday katılır.", "Cumhurbaşkanının görev süresi 5 yıldır ve bir kimse en çok iki defa Cumhurbaşkanı seçilebilir."],
    correctAnswer: "İkinci tura en çok oy alan ilk üç aday katılır.",
    explanation: "İkinci tura en çok oy alan ilk üç aday değil, 'en çok oy alan ilk iki aday' katılır."
  },
  {
    id: "v_7_4",
    section: "Bölüm 7: Yürütme",
    question: "Aşağıdakilerden hangisi Cumhurbaşkanı'nın yasama organı (TBMM) ile ilişkili görevlerinden biri değildir?",
    options: ["Gerekli gördüğünde TBMM'yi açılış gününde açış konuşması yapmak", "Kanunları yayınlamak veya tekrar görüşülmek üzere TBMM'ye geri göndermek (Veto)", "Anayasa değişikliklerini gerekli gördüğünde halkoyuna sunmak", "Kanunların anayasaya aykırılığı gerekçesiyle AYM'ye iptal davası açmak", "Milletlerarası antlaşmaları onaylamak ve yayınlamak"],
    correctAnswer: "Milletlerarası antlaşmaları onaylamak ve yayınlamak",
    explanation: "Milletlerarası antlaşmaları onaylamak ve yayınlamak yürütme alanına giren bir görevdir."
  },
  {
    id: "v_7_5",
    section: "Bölüm 7: Yürütme",
    question: "Doğrudan Cumhurbaşkanlığına bağlı olan, yargı organları dışındaki tüm kamu kurumlarında denetleme, araştırma ve idari soruşturma yapma yetkisine sahip kurum hangisidir?",
    options: ["Sayıştay", "Devlet Denetleme Kurulu (DDK)", "Kamu Denetçiliği Kurumu (Ombudsmanlık)", "HSK", "Strateji ve Bütçe Başkanlığı"],
    correctAnswer: "Devlet Denetleme Kurulu (DDK)",
    explanation: "Devlet Denetleme Kurulu (DDK), doğrudan Cumhurbaşkanı'na bağlıdır ve yargı hariç tüm kamu kurumlarında soruşturma yürütülebilir."
  },
  {
    id: "v_7_6",
    section: "Bölüm 7: Yürütme",
    question: "Cumhurbaşkanı'nın olağan dönemde çıkaracağı Cumhurbaşkanlığı Kararnameleriyle ilgili aşağıdakilerden hangisi doğrudur?",
    options: ["Temel haklar, kişi hakları ve siyasi haklar kararnameyle düzenlenebilir.", "Kanunda açıkça düzenlenen konularda da kararname çıkarılabilir.", "Sadece anayasada belirtilen sosyal ve ekonomik haklar kararnameyle düzenlenebilir.", "Kararnameler kanunlardan üstündür.", "Olağan CB kararnameleri yargı denetimi dışındadır."],
    correctAnswer: "Sadece anayasada belirtilen sosyal ve ekonomik haklar kararnameyle düzenlenebilir.",
    explanation: "Olağan dönem CB kararnameleriyle kişi hakları ve siyasi haklar düzenlenemez; yalnızca sosyal ve ekonomik haklar düzenlenebilir."
  },
  {
    id: "v_7_7",
    section: "Bölüm 7: Yürütme",
    question: "Anayasa'ya göre 'Başkomutanlık' aşağıdakilerden hangisinin manevi varlığından ayrılmaz ve kim tarafından temsil olunur?",
    options: ["Cumhurbaşkanı - Genelkurmay Başkanı", "TBMM - Cumhurbaşkanı", "Türk Milleti - Milli Savunma Bakanı", "TSK - Genelkurmay Başkanı", "Cumhurbaşkanı - Milli Savunma Bakanı"],
    correctAnswer: "TBMM - Cumhurbaşkanı",
    explanation: "Başkomutanlık, 'TBMM'nin manevi varlığından ayrılamaz' ve 'Cumhurbaşkanı tarafından temsil olunur'."
  },

  // BÖLÜM 8: YARGI (MAHKEMELER VE HSK YAPISI)
  {
    id: "v_8_1",
    section: "Bölüm 8: Yargı",
    question: "Hakimlerin ve savcıların özlük işlerini (atama, nakil, terfi, disiplin, ihraç) yürütmek üzere kurulmuş anayasal kurul hangisidir?",
    options: ["Anayasa Mahkemesi", "Yargıtay Başkanlar Kurulu", "Hakimler ve Savcılar Kurulu (HSK)", "Danıştay Genel Kurulu", "Adalet Bakanlığı Yüksek Disiplin Kurulu"],
    correctAnswer: "Hakimler ve Savcılar Kurulu (HSK)",
    explanation: "Hakim ve savcıların tüm özlük işleri bağımsız Hakimler ve Savcılar Kurulu (HSK) tarafından yürütülür."
  },
  {
    id: "v_8_2",
    section: "Bölüm 8: Yargı",
    question: "Hakimler ve Savcılar Kurulu (HSK) kaç üyeden oluşur ve başkanlığını kim yürütür?",
    options: ["11 üye - Anayasa Mahkemesi Başkanı", "13 üye - Adalet Bakanı", "15 üye - Cumhurbaşkanı", "13 üye - Yargıtay Cumhuriyet Başsavcısı", "9 üye - Adalet Bakanı Yardımcısı"],
    correctAnswer: "13 üye - Adalet Bakanı",
    explanation: "HSK 13 üyeden oluşur ve başkanlığını Adalet Bakanı yürütür."
  },
  {
    id: "v_8_3",
    section: "Bölüm 8: Yargı",
    question: "HSK kararlarına karşı anayasal olarak açık olan tek yargısal başvuru yolu aşağıdakilerden hangisidir?",
    options: ["Meslekten çıkarma (ihraç) kararları", "Yer değiştirme kararları", "Uyarma ve kınama cezaları", "Derece yükseltmeme kararları", "HSK'nın hiçbir kararına karşı yargı yolu açık değildir"],
    correctAnswer: "Meslekten çıkarma (ihraç) kararları",
    explanation: "2010 anayasa değişikliği ile HSK'nın yalnızca 'meslekten çıkarma' (ihraç) kararlarına karşı yargı yolu (Danıştay) açılmıştır."
  },
  {
    id: "v_8_4",
    section: "Bölüm 8: Yargı",
    question: "Anayasa Mahkemesi kaç üyeden oluşur ve bu üyeleri hangi merciler seçer?",
    options: ["11 üye - Tamamı Cumhurbaşkanı tarafından", "15 üye - 12 üye Cumhurbaşkanı, 3 üye TBMM tarafından", "15 üye - 10 üye HSK, 5 üye Cumhurbaşkanı tarafından", "17 üye - 12 üye TBMM, 5 üye Cumhurbaşkanı tarafından", "13 üye - Tamamı TBMM tarafından"],
    correctAnswer: "15 üye - 12 üye Cumhurbaşkanı, 3 üye TBMM tarafından",
    explanation: "Anayasa Mahkemesi'nin 15 üyesi vardır (12'sini Cumhurbaşkanı, 3'ünü TBMM seçer)."
  },
  {
    id: "v_8_5",
    section: "Bölüm 8: Yargı",
    question: "Anayasa Mahkemesi üyelerinin görev süresi kaç yıldır ve bir üye en fazla kaç kez seçilebilir?",
    options: ["4 yıl - Sınırsız kez seçilebilir", "12 yıl - İkinci kez seçilemez (Bir kez seçilebilir)", "6 yıl - En fazla iki kez seçilebilir", "9 yıl - İkinci kez seçilemez", "Ömür boyu (65 yaşına kadar)"],
    correctAnswer: "12 yıl - İkinci kez seçilemez (Bir kez seçilebilir)",
    explanation: "AYM üyeleri 12 yıl için seçilirler ve ikinci kez seçilemezler. 65 yaşını doldurunca emekliye ayrılırlar."
  },
  {
    id: "v_8_6",
    section: "Bölüm 8: Yargı",
    question: "Anayasa Mahkemesi'nin karar alırken 'üçte iki (2/3) oy çokluğu' aradığı durumlar hangileridir?\nI. Siyasi partilerin kapatılması davası veya hazine yardımından mahrum bırakılması\nII. Anayasa değişikliklerinin şekil yönünden iptali kararı\nIII. Bireysel başvuruların karara bağlanması",
    options: ["Yalnız I", "I ve II", "I ve III", "II ve III", "I, II ve III"],
    correctAnswer: "I ve II",
    explanation: "AYM Genel Kurulu; Siyasi partilerin kapatılması/hazine mahrumiyeti ve anayasa değişikliklerinin şekil yönünden iptaline 2/3 oy çokluğu ile karar verir."
  },
  {
    id: "v_8_7",
    section: "Bölüm 8: Yargı",
    question: "Cumhurbaşkanı, Bakanlar, Meclis Başkanı, Genelkurmay Başkanı ve Yüksek Mahkeme üyelerinin görevleriyle ilgili suçlardan dolayı yargılandığı merci hangisidir?",
    options: ["Yargıtay Ceza Genel Kurulu", "Ankara Ağır Ceza Mahkemesi", "Yüce Divan sıfatıyla Anayasa Mahkemesi", "Askeri Yüksek İdare Mahkemesi", "HSK Özel Yetkili Mahkemesi"],
    correctAnswer: "Yüce Divan sıfatıyla Anayasa Mahkemesi",
    explanation: "Üst düzey devlet görevlileri, görevleriyle ilgili suçlardan dolayı Yüce Divan sıfatıyla Anayasa Mahkemesi'nde yargılanırlar."
  },

  // BÖLÜM 9: İDARE HUKUKU (DEVLET TEŞKİLATI VE STRÜKTÜRÜ)
  {
    id: "v_9_1",
    section: "Bölüm 9: İdare Hukuku",
    question: "İdari işlemlerin kodifiye edilmemiş (tedvin edilmemiş/dağınık bırakılmış) olması neyi ifade eder?",
    options: ["İdare hukukunun genç bir hukuk dalı olduğunu", "İdari işlemlerin yargı denetimi dışında tutulduğunu", "İdare hukuk kurallarının tek bir çatı altında toplandığı 'İdare Kanunu' adında genel bir kanunun bulunmadığını", "İdarenin her işleminin anayasaya uygun olduğunu", "İdarenin her alanda serbestçe karar alabildiğini"],
    correctAnswer: "İdare hukuk kurallarının tek bir çatı altında toplandığı 'İdare Kanunu' adında genel bir kanunun bulunmadığını",
    explanation: "Ceza veya Medeni Kanun gibi derli toplu tek bir kanun idari alanda yoktur; kurallar dağınık bırakılmıştır."
  },
  {
    id: "v_9_2",
    section: "Bölüm 9: İdare Hukuku",
    question: "Aşağıdakilerden hangisi idari fonksiyonun (idarenin işlemlerinin) özellikleri arasında yer almaz?",
    options: ["İdare ile özel kişiler (vatandaşlar) arasında her zaman mutlak eşitlik vardır.", "İdarenin nihai amacı her zaman kamu yararıdır.", "İdare, üstün ve ayrıcalıklı yetkilere (kamu gücüne) sahiptir.", "İdari fonksiyon sürekli ve kesintisizdir.", "İdari fonksiyon kendiliğinden harekete geçer."],
    correctAnswer: "İdare ile özel kişiler (vatandaşlar) arasında her zaman mutlak eşitlik vardır.",
    explanation: "İdare ile özel kişiler arasında eşitlik yoktur; idare kamu yararı için üstün kamu gücü yetkilerine sahiptir."
  },
  {
    id: "v_9_3",
    section: "Bölüm 9: İdare Hukuku",
    question: "Merkezi idarenin taşra teşkilatının başındaki amir olan Valilerin, merkeze danışmadan doğrudan karar alıp uygulayabilmelerini sağlayan anayasal yetki hangisidir?",
    options: ["Hiyerarşik denetim yetkisi", "İdari vesayet yetkisi", "Yetki genişliği", "Takdir yetkisi", "Bağlı yetki"],
    correctAnswer: "Yetki genişliği",
    explanation: "Yetki genişliği yalnızca Vali'ye tanınmış olup, merkeze sormadan merkez adına karar alma yetkisidir."
  },
  {
    id: "v_9_4",
    section: "Bölüm 9: İdare Hukuku",
    question: "Aşağıdaki idari ilişkilerden hangisi 'Hiyerarşi' ilişkisine örnektir?",
    options: ["İçişleri Bakanlığı - Erzurum Büyükşehir Belediyesi", "Adalet Bakanı - Bursa Barosu Başkanı", "İçişleri Bakanlığı - Ankara İl Emniyet Müdürü", "Vali - Kars İl Özel İdaresi", "YÖK - Marmara Üniversitesi"],
    correctAnswer: "İçişleri Bakanlığı - Ankara İl Emniyet Müdürü",
    explanation: "Aynı tüzel kişilik (Devlet Tüzel Kişiliği) içindeki ast-üst ilişkisine 'hiyerarşi' denir."
  },
  {
    id: "v_9_5",
    section: "Bölüm 9: İdare Hukuku",
    question: "Aşağıdaki kurumlardan hangisinin bizzat 'kamu tüzel kişiliği'ne sahip olduğu 1982 Anayasası metninde doğrudan belirtilmemiştir?",
    options: ["Üniversiteler", "Belediyeler", "TRT", "Diyanet İşleri Başkanlığı", "Köyler"],
    correctAnswer: "Diyanet İşleri Başkanlığı",
    explanation: "Diyanet İşleri Başkanlığı ayrı bir kamu tüzel kişiliğine sahip değildir; doğrudan devlet tüzel kişiliğinin içindedir."
  },
  {
    id: "v_9_6",
    section: "Bölüm 9: İdare Hukuku",
    question: "İdari işlemlerin unsurlarında hukuka aykırılık bulunması durumunda, işlemin idari yargı kararıyla geçmişe etkili ortadan kaldırılmasına ne ad verilir?",
    options: ["Yokluk", "İptal", "Cebri İcra", "Müsadere", "Tazminat"],
    correctAnswer: "İptal",
    explanation: "Hukuka aykırı idari işlemlerin yargı kararıyla ortadan kaldırılmasına 'iptal yaptırımı' denir."
  },
  {
    id: "v_9_7",
    section: "Bölüm 9: İdare Hukuku",
    question: "İdari bir makamın (örn: Kaymakamın) kendisini mahkemenin yerine koyarak adli bir boşanma kararı vermesi durumunda ortaya çıkan yetki sakatlığı ve yaptırımı nedir?",
    options: ["Yetki gaspı - İptal edilebilir", "Yetki tecavüzü - İptal davasına tabi", "Fonksiyon gaspı - Yok hükmünde (Yokluk)", "Ağır yetki tecavüzü - Nispi butlan", "Görev tecavüzü - Hükümsüz"],
    correctAnswer: "Fonksiyon gaspı - Yok hükmünde (Yokluk)",
    explanation: "İdarenin kendisini yasama veya yargı organı yerine koyup işlem yapması 'fonksiyon gaspı'dır ve yaptırımı 'yokluk'tur."
  },
  {
    id: "v_9_8",
    section: "Bölüm 9: İdare Hukuku",
    question: "Aşağıdakilerden hangisi idari kolluğun kamu düzenini sağlamak için korumaya çalıştığı temel unsurlardan biri değildir?",
    options: ["Genel güvenlik", "Genel sağlık", "Dirlik ve esenlik", "Genel ahlak", "Genel soruşturma"],
    correctAnswer: "Genel soruşturma",
    explanation: "Kamu düzeninin 4 temel unsuru: Genel güvenlik, genel sağlık, genel ahlak, dirlik ve esenliktir."
  },
  {
    id: "v_9_9",
    section: "Bölüm 9: İdare Hukuku",
    question: "İdarenin, kamu gücü kullanarak ve kamu yararıyla özel mülkiyetteki 'taşınmaz (gayrimenkul)' mallara el koyup mülkiyetini devralmasına ne ad verilir?",
    options: ["Kamulaştırma", "Devletleştirme", "İstimval", "Geçici işgal", "Satın alma"],
    correctAnswer: "Kamulaştırma",
    explanation: "Özel mülkiyetteki taşınmaz mallara kamu yararıyla el koyma işlemine 'kamulaştırma' denir."
  },
  {
    id: "v_9_10",
    section: "Bölüm 9: İdare Hukuku",
    question: "Savaş veya deprem gibi olağanüstü durumlarda idarenin, vatandaşların 'taşınır' mallarına ve 'beden gücü'ne el koymasını sağlayan yöntem hangisidir?",
    options: ["Kamulaştırma", "İstimval", "Geçici işgal", "Müsadere", "Devletleştirme"],
    correctAnswer: "İstimval",
    explanation: "Olağanüstü durumlarda taşınır mallara, araçlara ve kişilerin beden gücü çalışmalarına el koymaya 'istimval' denir."
  },

  // BÖLÜM 10: İNSAN HAKLARI HUKUKU (ULUSLARARASI KORUMA VE MEKANİZMALAR)
  {
    id: "v_10_1",
    section: "Bölüm 10: İnsan Hakları Hukuku",
    question: "İnsan haklarının doğuştan sahip olunan, evrensel ve mutlak nitelikte olduğunu açıklayan felsefi teori aşağıdakilerden hangisidir?",
    options: ["Toplum Sözleşmesi Kuramı", "Doğal Hukuk Kuramı", "Pozitivist Hukuk Teorisi", "Marksist Hukuk Teorisi", "Faydacı Hukuk Yaklaşımı"],
    correctAnswer: "Doğal Hukuk Kuramı",
    explanation: "Doğal Hukuk Kuramı, insan haklarının insan olmakla doğuştan kazanıldığını ve evrensel olduğunu savunur."
  },
  {
    id: "v_10_2",
    section: "Bölüm 10: İnsan Hakları Hukuku",
    question: "İnsan haklarının tarihsel gelişim süreçlerine göre 'kuşaklar' (1., 2. ve 3. kuşak haklar) ayrımını yapan ünlü hukukçu kimdir?",
    options: ["George Jelinek", "Karel Vasak", "Montesquieu", "Thomas Hobbes", "John Locke"],
    correctAnswer: "Karel Vasak",
    explanation: "İnsan haklarını tarihsel gelişimlerine göre 1., 2. ve 3. kuşak haklar olarak ayıran kişi Karel Vasak'tır."
  },
  {
    id: "v_10_3",
    section: "Bölüm 10: İnsan Hakları Hukuku",
    question: "Karel Vasak'ın 'Birinci Kuşak Haklar' (Sivil ve Siyasi Haklar) sınıflandırmasında aşağıdakilerden hangisi yer almaz?",
    options: ["Kişi hürriyeti ve güvenliği", "Seçme ve seçilme hakkı", "Din ve vicdan hürriyeti", "Sosyal güvenlik ve çalışma hakkı", "Yaşama hakkı"],
    correctAnswer: "Sosyal güvenlik ve çalışma hakkı",
    explanation: "Sosyal güvenlik ve çalışma hakları İkinci Kuşak Haklar (sosyal ve ekonomik haklar) arasında yer alır."
  },
  {
    id: "v_10_4",
    section: "Bölüm 10: İnsan Hakları Hukuku",
    question: "Birleşmiş Milletler Güvenlik Konseyi'nin veto yetkisine sahip daimi 5 üye devleti (FİRÇA) arasında aşağıdakilerden hangisi yer almaz?",
    options: ["Fransa", "İngiltere", "Rusya", "Almanya", "Çin"],
    correctAnswer: "Almanya",
    explanation: "BM Güvenlik Konseyi'nin veto yetkili daimi 5 üyesi 'FİRÇA' (Fransa, İngiltere, Rusya, Çin, ABD) olup Almanya aralarında yoktur."
  },
  {
    id: "v_10_5",
    section: "Bölüm 10: İnsan Hakları Hukuku",
    question: "Avrupa İnsan Hakları Mahkemesi'ne (AİHM) bireysel başvuruda bulunabilmek için, iç hukuk yollarının tüketilmesinden itibaren kaç ay içinde başvuru yapılmalıdır?",
    options: ["1 ay", "3 ay", "4 ay", "6 ay", "1 yıl"],
    correctAnswer: "4 ay",
    explanation: "Yapılan protokol değişikliği ile AİHM'e başvuru süresi 6 aydan '4 ay'a düşürülmüştür."
  },
  {
    id: "v_10_6",
    section: "Bölüm 10: İnsan Hakları Hukuku",
    question: "Aşağıdaki mercilerden hangisi Anayasa Mahkemesi'ne veya AİHM'e hak ihlali iddiasıyla 'bireysel başvuru'da bulunamaz?",
    options: ["Dernekler ve vakıflar", "Taraf devlet vatandaşları (Gerçek kişiler)", "Belediye ve valilikler (Kamu tüzel kişileri)", "Siyasi partiler", "Yabancı uyruklu gerçek kişiler"],
    correctAnswer: "Belediye ve valilikler (Kamu tüzel kişileri)",
    explanation: "Kamu tüzel kişileri (Belediyeler, Valilikler) bireysel başvuru hakkına sahip değildir."
  },
  {
    id: "v_10_7",
    section: "Bölüm 10: İnsan Hakları Hukuku",
    question: "Türkiye'nin soykırım ve savaş suçlarını yargılamak üzere kurulan Uluslararası Ceza Mahkemesi'nin (UCM) kurucu belgesi olan hangi statüye taraf olmadığı bilinmektedir?",
    options: ["Roma Statüsü", "İstanbul Protokolü", "Cenevre Sözleşmesi", "Helsinki Nihai Senedi", "New York Konvansiyonu"],
    correctAnswer: "Roma Statüsü",
    explanation: "Türkiye, Uluslararası Ceza Mahkemesi'ni kuran 'Roma Statüsü'ne taraf değildir."
  },
  {
    id: "v_10_8",
    section: "Bölüm 10: İnsan Hakları Hukuku",
    question: "Hak ihlaline uğrayan kişilerin Anayasa Mahkemesi'ne 'bireysel başvuru' yapabilmesi için, ihlal edilen hakkın Anayasa ile birlikte hangi uluslararası sözleşmede ortak güvenceye alınmış olması şarttır?",
    options: ["İnsan Hakları Evrensel Beyannamesi", "Avrupa İnsan Hakları Sözleşmesi (AİHS)", "BM Çocuk Hakları Sözleşmesi", "Paris Şartı", "Kyoto Protokolü"],
    correctAnswer: "Avrupa İnsan Hakları Sözleşmesi (AİHS)",
    explanation: "AYM'ye bireysel başvuru yapılabilmesi için, ihlal edilen hakkın hem T.C. Anayasası'nda hem de Avrupa İnsan Hakları Sözleşmesi'nde (AİHS) korunan haklardan olması zorunludur."
  }
];
