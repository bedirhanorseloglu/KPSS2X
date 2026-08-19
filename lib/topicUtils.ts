import { initialData } from "./data";

export type TopicItem = {
  id: string;
  title: string;
  questionRange?: string;
  questionCount?: string;
};

export type TopicErrorRecord = {
  subjectId: string;
  topicId: string;
  topicTitle: string;
  wrongCount: number;
  emptyCount: number;
};

/**
 * Derse ait müfredat konularını döner.
 */
export function getSubjectTopics(subjectId: string): TopicItem[] {
  if (!subjectId) return [];

  const found = initialData.find((s) => s.id === subjectId);
  if (found) {
    let topics = found.topics.map((t) => ({
      id: t.id,
      title: t.title,
      questionRange: t.questionRange,
      questionCount: t.questionCount,
    }));

    // Eğer Matematik ise, Geometri konularını da ekleyelim (Matematik 30 soruluk testin son 4-8 sorusu Geometri)
    if (subjectId === "matematik") {
      const geo = initialData.find((s) => s.id === "geometri");
      if (geo) {
        topics = [
          ...topics,
          ...geo.topics.map((t) => ({
            id: t.id,
            title: `[Geometri] ${t.title}`,
            questionRange: t.questionRange,
            questionCount: t.questionCount,
          })),
        ];
      }
    }
    return topics;
  }

  return [];
}

/**
 * Tüm derslerdeki müfredat konularının haritasını döner.
 */
export function getAllCurriculumTopicsMap(): Record<string, { topicId: string; topicTitle: string; subjectId: string }> {
  const map: Record<string, { topicId: string; topicTitle: string; subjectId: string }> = {};

  initialData.forEach((s) => {
    s.topics.forEach((t) => {
      map[t.id] = {
        topicId: t.id,
        topicTitle: t.title,
        subjectId: s.id,
      };
    });
  });

  return map;
}
