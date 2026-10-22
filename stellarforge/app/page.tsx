import { Suspense } from "react";
import Workspace from "@/components/Workspace";

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <Workspace />
    </Suspense>
  );
}
