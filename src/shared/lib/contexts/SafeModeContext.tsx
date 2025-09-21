import { createContext, useContext, useEffect, useMemo, useState } from "react";

type SafeModeContextType = {
  safeMode: boolean;
  setSafeMode: (v: boolean) => void;
  toggle: () => void;
};

const SafeModeContext = createContext<SafeModeContextType | undefined>(undefined);

export const SafeModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [safeMode, setSafeMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("safe-mode");
    if (saved === null) {
      localStorage.setItem("safe-mode", "0");
      return false;
    }
    return saved === "1";
  });

  useEffect(() => {
    localStorage.setItem("safe-mode", safeMode ? "1" : "0");
  }, [safeMode]);

  const value = useMemo(
    () => ({ safeMode, setSafeMode, toggle: () => setSafeMode(v => !v) }),
    [safeMode]
  );

  return <SafeModeContext.Provider value={value}>{children}</SafeModeContext.Provider>;
};

export const useSafeMode = () => {
  const ctx = useContext(SafeModeContext);
  if (!ctx) throw new Error("useSafeMode must be used within SafeModeProvider");
  return ctx;
};
