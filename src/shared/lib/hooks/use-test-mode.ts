import { useSearchParams } from "react-router-dom";

export function useSkeletonTestMode(): boolean {
  const [params] = useSearchParams();
  const qp = (params.get("test") || "").toLowerCase();
  const qpOn = ["skeleton", "1", "true", "skel", "s"].includes(qp);
  const envVal = import.meta.env.VITE_TEST_SKELETON as string | undefined;
  const envOn = envVal === "1" || envVal === "true";
  return qpOn || envOn;
}

