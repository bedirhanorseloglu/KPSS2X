"use client";

import React, { useMemo } from "react";
import AppleEmoji from "@/components/AppleEmoji";
import { Section, Tip } from "./AnalyticsCommon";
import { DenemeRecord } from "@/lib/denemeUtils";
import { DENEME_SUBJECTS } from "@/lib/denemeConfig";

export default function SmartRecommendationsSection({
  denemeler,
  stats,
  viewType = "genel",
  selectedBransSubjectId,
}: {
  denemeler: DenemeRecord[];
  stats: any;
  viewType?: "genel" | "brans";
  selectedBransSubjectId?: string;
}) {
  const topicStats: Record<
    string,
    {
      topicId: string;
      topicTitle: string;
      subjectId: string;
      totalWrong: number;
      totalEmpty: number;
    }
  > = {};

  const recordsToProcess = useMemo(() => {
    if (viewType === "brans" && selectedBransSubjectId) {
      return denemeler.filter(
        (d) => d.examType === "brans" && d.bransSubjectId === selectedBransSubjectId
      );
    }
    return denemeler.filter((d) => d.examType !== "brans");
  }, [denemeler, viewType, selectedBransSubjectId]);

  recordsToProcess.forEach((d) => {
    d.scores.forEach((s) => {
      if (
        viewType === "brans" &&
        selectedBransSubjectId &&
        s.subjectId !== selectedBransSubjectId
      ) {
        return;
      }
      if (s.topicErrors && s.topicErrors.length > 0) {
        s.topicErrors.forEach((te) => {
          if (!topicStats[te.topicId]) {
            topicStats[te.topicId] = {
              topicId: te.topicId,
              topicTitle: te.topicTitle,
              subjectId: s.subjectId,
              totalWrong: te.wrongCount || 0,
              totalEmpty: te.emptyCount || 0,
            };
          } else {
            topicStats[te.topicId].totalWrong += te.wrongCount || 0;
            topicStats[te.topicId].totalEmpty += te.emptyCount || 0;
          }
        });
      }
    });
  });

  const activeSubjectConfig = DENEME_SUBJECTS.find(
    (s) => s.id === selectedBransSubjectId
  );
  const recColor =
    viewType === "brans" && activeSubjectConfig
      ? activeSubjectConfig.color
      : "#1cb0f6";
  const recIcon =
    viewType === "brans" && activeSubjectConfig
      ? activeSubjectConfig.icon
      : "💡";

  const list = Object.values(topicStats);
  const topWrongTopic = [...list]
    .sort((a, b) => b.totalWrong - a.totalWrong)
    .find((t) => t.totalWrong > 0);
  const topEmptyTopic = [...list]
    .sort((a, b) => b.totalEmpty - a.totalEmpty)
    .find((t) => t.totalEmpty > 0);

  return (
    <Section
      title={
        viewType === "brans" && activeSubjectConfig
          ? `${activeSubjectConfig.title} - Akıllı Tavsiyeler`
          : "Akıllı Tavsiyeler"
      }
      desc={
        viewType === "brans" && activeSubjectConfig
          ? `Seçili ${activeSubjectConfig.title} branşındaki konu hatalarınız ve kişisel koçluk tavsiyeleri.`
          : "İşaretlediğiniz konu hatalarınız ve genel sınav sonuçlarınıza göre oluşturulan kişisel koçluk tavsiyeleri."
      }
      icon={<AppleEmoji emoji={recIcon} size={32} color={recColor} />}
    >
      <div className="grid md:grid-cols-2 gap-5">
        {/* 1. Konu Bazlı Kritik Hata Uyarısı */}
        {topWrongTopic ? (
          <Tip
            emoji="🚨"
            title={`Öncelikli Konu Tekrarı: ${topWrongTopic.topicTitle.split("(")[0]}`}
            accentColor="#ff4b4b"
          >
            <span
              className="font-black px-2.5 py-0.5 rounded-lg text-white text-xs inline-block mr-1.5 shadow-2xs"
              style={{
                backgroundColor:
                  DENEME_SUBJECTS.find((s) => s.id === topWrongTopic.subjectId)
                    ?.color || "#ff4b4b",
              }}
            >
              {DENEME_SUBJECTS.find((s) => s.id === topWrongTopic.subjectId)
                ?.title || topWrongTopic.subjectId}
            </span>
            dersinde{" "}
            <strong className="font-black text-slate-800 dark:text-white">
              &quot;{topWrongTopic.topicTitle}&quot;
            </strong>{" "}
            konusunda toplam{" "}
            <strong className="font-mono font-black text-[#ff4b4b]">
              {topWrongTopic.totalWrong} Yanlış
            </strong>{" "}
            yaptın. Bu konuyu soru bankasından tekrar etmeden yeni denemeye geçme!
          </Tip>
        ) : stats?.mostWrong ? (
          <Tip
            emoji="⚠️"
            title="Dikkat: Çok Hata Yapıyorsun"
            accentColor="#ff4b4b"
          >
            <span
              className="font-black px-2 py-0.5 rounded-lg text-white text-xs inline-block mr-1.5 shadow-2xs"
              style={{ backgroundColor: stats.mostWrong.color }}
            >
              {stats.mostWrong.title}
            </span>
            dersinde soruların{" "}
            <strong className="font-black font-mono text-[#ff4b4b]">
              %{Math.round(stats.mostWrong.wr * 100)}
            </strong>
            &apos;ini yanlış yapıyorsun. Yanlış yaptığın konuları tekrar etmeden
            yeni denemeye geçme!
          </Tip>
        ) : null}

        {/* 2. Konu Bazlı Boş Uyarısı */}
        {topEmptyTopic ? (
          <Tip
            emoji="⚪"
            title={`Boş Bırakılan Konu Analizi: ${topEmptyTopic.topicTitle.split("(")[0]}`}
            accentColor="#ff9500"
          >
            <span
              className="font-black px-2.5 py-0.5 rounded-lg text-white text-xs inline-block mr-1.5 shadow-2xs"
              style={{
                backgroundColor:
                  DENEME_SUBJECTS.find((s) => s.id === topEmptyTopic.subjectId)
                    ?.color || "#ff9500",
              }}
            >
              {DENEME_SUBJECTS.find((s) => s.id === topEmptyTopic.subjectId)
                ?.title || topEmptyTopic.subjectId}
            </span>
            dersinde{" "}
            <strong className="font-black text-slate-800 dark:text-white">
              &quot;{topEmptyTopic.topicTitle}&quot;
            </strong>{" "}
            konusundan{" "}
            <strong className="font-mono font-black text-[#ff9500]">
              {topEmptyTopic.totalEmpty} soru
            </strong>{" "}
            boş bıraktın. 15 dakikalık konu özetiyle bu boşları nete
            çevirebilirsin.
          </Tip>
        ) : stats?.mostEmpty ? (
          <Tip
            emoji="⏱️"
            title="Süre veya Bilgi Eksikliği"
            accentColor="#ff9500"
          >
            <span
              className="font-black px-2 py-0.5 rounded-lg text-white text-xs inline-block mr-1.5 shadow-2xs"
              style={{ backgroundColor: stats.mostEmpty.color }}
            >
              {stats.mostEmpty.title}
            </span>
            dersinde soruların{" "}
            <strong className="font-black font-mono text-[#ff9500]">
              %{Math.round(stats.mostEmpty.er * 100)}
            </strong>
            &apos;ini boş bırakıyorsun. Turlama tekniğini daha iyi kullanabilirsin.
          </Tip>
        ) : null}

        {/* 3. Denge veya Branş Koçluğu */}
        {viewType === "brans" && activeSubjectConfig ? (
          <Tip
            emoji={activeSubjectConfig.icon}
            title={`${activeSubjectConfig.title} Branş Odağı`}
            accentColor={activeSubjectConfig.color}
          >
            <span className="font-black text-slate-800 dark:text-white">
              {activeSubjectConfig.title}
            </span>{" "}
            branşında nokta atışı konu analizi yaparak eksiklerinizi
            tamamlayabilir, soru bankası tekrarlarıyla isabet oranınızı
            yükseltebilirsiniz.
          </Tip>
        ) : (
          <Tip emoji="⚖️" title="Dengeli Net Dağılımı" accentColor="#58cc02">
            Genel Yetenek ve Genel Kültür bölümlerindeki net dengesini koruyarak
            özellikle puan getirisinin yüksek olduğu standart sapmalı derslere
            odaklanın.
          </Tip>
        )}
      </div>
    </Section>
  );
}
