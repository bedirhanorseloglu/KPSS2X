import { Suspense } from "react";
import DenemePageContent from "@/components/deneme/DenemePageContent";
import DenemeLoading from "@/components/deneme/DenemeLoading";

export default function DenemePage() {
  return (
    <Suspense fallback={<DenemeLoading />}>
      <DenemePageContent />
    </Suspense>
  );
}
