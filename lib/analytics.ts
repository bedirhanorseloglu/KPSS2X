import { analytics } from "./firebase";
import { logEvent } from "firebase/analytics";

/**
 * Safely log analytics events on client side without blocking UI execution
 */
export async function safeLogEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window === "undefined") return;
  try {
    const instance = await analytics;
    if (instance) {
      logEvent(instance, eventName, eventParams);
    }
  } catch (err) {
    // Fail silently in production
    console.debug("[Analytics Error]", err);
  }
}

export const logExamCompleted = (score: number, net: number, examType: string) => {
  safeLogEvent("exam_completed", { score, net, exam_type: examType });
};

export const logActivityCompleted = (activityId: string, activityTitle: string) => {
  safeLogEvent("activity_completed", { activity_id: activityId, activity_title: activityTitle });
};

export const logPomodoroFinished = (minutes: number, mode: string) => {
  safeLogEvent("pomodoro_finished", { minutes, mode });
};
