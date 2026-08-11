export interface TbmmVoteItem {
  id: string;
  title: string;
  requiredVotes: 151 | 200 | 301 | 360 | 400;
  majorityName: string; // e.g. "Salt Çoğunluk (301)", "Beşte Üç Çoğunluk (360)", "Üçte İki Çoğunluk (400)", "Basit Çoğunluk (151/200)"
  categoryBadge: string;
  explanation: string;
}

export const TBMM_VOTE_ITEMS: TbmmVoteItem[] = [
  // SALT ÇOĞUNLUK (301 OY)
  {
    id: "tbmm_301_1",
    title: "Meclis Başkanı Seçiminin 3. Turu",
    requiredVotes: 301,
    majorityName: "Salt Çoğunluk (301)",
    categoryBadge: "301 Oy",
    explanation: "Meclis Başkanı seçiminde 1. ve 2. turlarda 400 oy (2/3) arandıktan sonra 3. turda üye tam sayısının salt çoğunluğu olan 301 oy aranır."
  },
  {
    id: "tbmm_301_2",
    title: "Kamu Başdenetçisi Seçiminin 3. Turu",
    requiredVotes: 301,
    majorityName: "Salt Çoğunluk (301)",
    categoryBadge: "301 Oy",
    explanation: "Kamu Başdenetçisi (Ombudsman) seçiminde 3. turda üye tam sayısının salt çoğunluğu (301 oy) yeterlidir."
  },
  {
    id: "tbmm_301_3",
    title: "Devamsızlık Nedeniyle Milletvekilliğinin Düşürülmesi",
    requiredVotes: 301,
    majorityName: "Salt Çoğunluk (301)",
    categoryBadge: "301 Oy",
    explanation: "1 ay içinde izinsiz veya özürsüz toplam 5 birleşim günü toplantıya katılmayan vekilin düşürülmesine TBMM üye tam sayısının salt çoğunluğuyla (301) karar verilir."
  },
  {
    id: "tbmm_301_4",
    title: "Cumhurbaşkanınca Geri Gönderilen (Veto Edilen) Kanunun Aynen Kabulü",
    requiredVotes: 301,
    majorityName: "Salt Çoğunluk (301)",
    categoryBadge: "301 Oy",
    explanation: "Cumhurbaşkanınca veto edilen kanunların TBMM tarafından yeniden aynen kabul edilebilmesi için üye tam sayısının salt çoğunluğu (301) gerekir."
  },
  {
    id: "tbmm_301_5",
    title: "Anayasa Mahkemesi'ne Üye Seçiminin 2. Turu",
    requiredVotes: 301,
    majorityName: "Salt Çoğunluk (301)",
    categoryBadge: "301 Oy",
    explanation: "TBMM'nin AYM'ye üye seçiminde 1. turda 400 oy (2/3) arandıktan sonra 2. turda salt çoğunluk olan 301 oy aranır."
  },
  {
    id: "tbmm_301_6",
    title: "Meclis Soruşturması Açılması İçin Önerge Verilmesi",
    requiredVotes: 301,
    majorityName: "Salt Çoğunluk (301)",
    categoryBadge: "301 Oy",
    explanation: "CB Yardımcıları ve Bakanlar hakkında meclis soruşturması açılması teklifi TBMM üye tam sayısının salt çoğunluğu (301) tarafından verilebilir."
  },

  // BEŞTE ÜÇ ÇOĞUNLUK (360 OY)
  {
    id: "tbmm_360_1",
    title: "Genel ve Özel Af Kanunu Oylaması",
    requiredVotes: 360,
    majorityName: "Beşte Üç Çoğunluk (360)",
    categoryBadge: "360 Oy (3/5)",
    explanation: "Genel ve özel af ilanını içeren kanunların kabulü için TBMM üye tam sayısının 3/5 çoğunluğu olan 360 oy zorunludur."
  },
  {
    id: "tbmm_360_2",
    title: "Anayasanın Değiştirilmesi Teklifinin Kabulü (Referandumlu/Referandumsuz Alt Sınır)",
    requiredVotes: 360,
    majorityName: "Beşte Üç Çoğunluk (360)",
    categoryBadge: "360 Oy (3/5)",
    explanation: "Anayasa değişikliklerinin kabul edilebilmesi için en az 3/5 çoğunluk (360 oy) şarttır. 360-399 arası oylarda zorunlu referanduma gidilir."
  },
  {
    id: "tbmm_360_3",
    title: "TBMM Seçimlerinin Yenilenmesi Kararı (Erken Seçim)",
    requiredVotes: 360,
    majorityName: "Beşte Üç Çoğunluk (360)",
    categoryBadge: "360 Oy (3/5)",
    explanation: "TBMM'nin kendi seçimlerini yenileme (erken seçim) kararı alabilmesi için üye tam sayısının 3/5 çoğunluğunun (360 oy) evet oyu gerekir."
  },
  {
    id: "tbmm_360_4",
    title: "Meclis Soruşturması Açılmasına Karar Vermek",
    requiredVotes: 360,
    majorityName: "Beşte Üç Çoğunluk (360)",
    categoryBadge: "360 Oy (3/5)",
    explanation: "Verilen meclis soruşturması önergesinin kabul edilerek soruşturma açılmasına karar verilmesi için 3/5 çoğunluk (360 oy) aranır."
  },
  {
    id: "tbmm_360_5",
    title: "Hâkimler ve Savcılar Kurulu'na (HSK) Üye Seçimi 2. Turu",
    requiredVotes: 360,
    majorityName: "Beşte Üç Çoğunluk (360)",
    categoryBadge: "360 Oy (3/5)",
    explanation: "TBMM tarafından HSK üye seçiminde 1. turda 400 oy (2/3) arandıktan sonra 2. turda 3/5 çoğunluk olan 360 oy aranır."
  },

  // ÜÇTE İKİ ÇOĞUNLUK (400 OY)
  {
    id: "tbmm_400_1",
    title: "Meclis Başkanı Seçiminin 1. ve 2. Turu",
    requiredVotes: 400,
    majorityName: "Üçte İki Çoğunluk (400)",
    categoryBadge: "400 Oy (2/3)",
    explanation: "Meclis Başkanı seçiminde ilk iki turda üye tam sayısının 2/3 çoğunluğu olan 400 oy aranır."
  },
  {
    id: "tbmm_400_2",
    title: "Kamu Başdenetçisi Seçiminin 1. ve 2. Turu",
    requiredVotes: 400,
    majorityName: "Üçte İki Çoğunluk (400)",
    categoryBadge: "400 Oy (2/3)",
    explanation: "Kamu Başdenetçisi seçiminde 1. ve 2. turlarda 2/3 nitelikli çoğunluk (400 oy) aranır."
  },
  {
    id: "tbmm_400_3",
    title: "Hâkimler ve Savcılar Kurulu'na (HSK) Üye Seçimi 1. Turu",
    requiredVotes: 400,
    majorityName: "Üçte İki Çoğunluk (400)",
    categoryBadge: "400 Oy (2/3)",
    explanation: "TBMM'nin HSK'ya üye seçiminde 1. turda üye tam sayısının 2/3 çoğunluğu (400 oy) aranır."
  },
  {
    id: "tbmm_400_4",
    title: "Anayasa Değişikliğinin Doğrudan (Referandumsuz) Onaylanabilmesi",
    requiredVotes: 400,
    majorityName: "Üçte İki Çoğunluk (400)",
    categoryBadge: "400 Oy (2/3)",
    explanation: "Anayasa değişikliği 400 ve üzeri oyla kabul edilirse Cumhurbaşkanı referandumsuz doğrudan onaylayabilir veya isterse halkoyuna sunabilir."
  },
  {
    id: "tbmm_400_5",
    title: "Cumhurbaşkanı, Bakanlar ve CB Yardımcılarının Yüce Divan'a Sevki",
    requiredVotes: 400,
    majorityName: "Üçte İki Çoğunluk (400)",
    categoryBadge: "400 Oy (2/3)",
    explanation: "Meclis soruşturması tamamlanan Yürütme mensuplarının Yüce Divan'a sevk kararı için üye tam sayısının 2/3 çoğunluğu olan 400 oy şarttır."
  },
  {
    id: "tbmm_400_6",
    title: "Anayasa Mahkemesi'ne Üye Seçiminin 1. Turu",
    requiredVotes: 400,
    majorityName: "Üçte İki Çoğunluk (400)",
    categoryBadge: "400 Oy (2/3)",
    explanation: "TBMM'nin AYM'ye üye seçiminde ilk turda 2/3 çoğunluk (400 oy) aranır."
  },

  // TOPLANTI VE KARAR YETER SAYILARI (200 / 151)
  {
    id: "tbmm_200_1",
    title: "TBMM Toplantı Yeter Sayısı (TYS)",
    requiredVotes: 200,
    majorityName: "Toplantı Yeter Sayısı (200)",
    categoryBadge: "200 Oy (1/3)",
    explanation: "TBMM Genel Kurulu en az üye tam sayısının 1/3'ü olan 200 milletvekili ile toplanabilir."
  },
  {
    id: "tbmm_151_1",
    title: "TBMM Karar Yeter Sayısı Alt Sınırı (KYS Alt Sınırı)",
    requiredVotes: 151,
    majorityName: "Karar Yeter Sayısı Alt Sınırı (151)",
    categoryBadge: "151 Oy (1/4 + 1)",
    explanation: "Adi/basit çoğunlukla alınan kararlarda karar yeter sayısı üye tam sayısının 1/4'ünün 1 fazlası olan 151 oydan az olamaz."
  }
];
