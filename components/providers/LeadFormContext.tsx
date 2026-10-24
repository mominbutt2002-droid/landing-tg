"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LeadPrefill = {
  message?: string;
  source?: "form" | "ai-quiz";
  meta?: Record<string, unknown>;
};

type LeadFormContextValue = {
  prefill: LeadPrefill;
  applyPrefill: (data: LeadPrefill) => void;
  scrollToForm: () => void;
  openAssistant: () => void;
  registerOpenAssistant: (fn: () => void) => void;
};

const LeadFormContext = createContext<LeadFormContextValue | null>(null);

export function LeadFormProvider({ children }: { children: ReactNode }) {
  const [prefill, setPrefill] = useState<LeadPrefill>({});
  const [openFn, setOpenFn] = useState<(() => void) | null>(null);

  const scrollToForm = useCallback(() => {
    document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const applyPrefill = useCallback((data: LeadPrefill) => {
    setPrefill((prev) => ({ ...prev, ...data }));
  }, []);

  const registerOpenAssistant = useCallback((fn: () => void) => {
    setOpenFn(() => fn);
  }, []);

  const openAssistant = useCallback(() => {
    openFn?.();
  }, [openFn]);

  const value = useMemo(
    () => ({
      prefill,
      applyPrefill,
      scrollToForm,
      openAssistant,
      registerOpenAssistant,
    }),
    [prefill, applyPrefill, scrollToForm, openAssistant, registerOpenAssistant]
  );

  return (
    <LeadFormContext.Provider value={value}>{children}</LeadFormContext.Provider>
  );
}

export function useLeadForm() {
  const ctx = useContext(LeadFormContext);
  if (!ctx) {
    throw new Error("useLeadForm must be used within LeadFormProvider");
  }
  return ctx;
}
