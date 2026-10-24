"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { useLeadForm } from "@/components/providers/LeadFormContext";

type ChatMessage = { role: "user" | "model"; text: string };

type Step = "industry" | "teamSize" | "goal" | "chat";

const stepOrder: Step[] = ["industry", "teamSize", "goal", "chat"];

export function AiAssistant() {
  const { applyPrefill, scrollToForm, registerOpenAssistant } = useLeadForm();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("industry");
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [leadReady, setLeadReady] = useState(false);
  const [leadHint, setLeadHint] = useState("");
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  const openPanel = useCallback(() => setOpen(true), []);

  useEffect(() => {
    registerOpenAssistant(openPanel);
  }, [registerOpenAssistant, openPanel]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  function pickQuiz(key: keyof typeof site.quiz, value: string) {
    setQuizAnswers((prev) => ({ ...prev, [key]: value }));
    const idx = stepOrder.indexOf(key);
    const next = stepOrder[idx + 1];
    if (next === "chat") {
      setStep("chat");
      setMessages([
        {
          role: "model",
          text: `Спасибо! Кратко: ${site.brand} помогает внедрить ИИ в ваши процессы. Задайте любой вопрос об услугах — или попросите подсказать формат пилота.`,
        },
      ]);
    } else if (next) {
      setStep(next);
    }
  }

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    const nextMessages: ChatMessage[] = [...messages, { role: "user", text: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages, quizAnswers }),
      });
      const data = (await res.json()) as {
        reply?: string;
        leadReady?: boolean;
        leadHint?: string;
        error?: string;
      };

      if (!res.ok) {
        throw new Error(data.error ?? "Ошибка запроса");
      }

      setMessages((prev) => [...prev, { role: "model", text: data.reply ?? "" }]);
      setLeadReady(Boolean(data.leadReady));
      setLeadHint(data.leadHint ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось получить ответ");
    } finally {
      setLoading(false);
    }
  }

  function goToLeadForm() {
    applyPrefill({
      message: leadHint || messageSummary(),
      source: "ai-quiz",
      meta: { quiz: quizAnswers },
    });
    setOpen(false);
    scrollToForm();
  }

  function messageSummary() {
    return `Запрос через ИИ-квиз: ${Object.values(quizAnswers).join(", ")}`;
  }

  function resetChat() {
    setStep("industry");
    setQuizAnswers({});
    setMessages([]);
    setLeadReady(false);
    setLeadHint("");
    setError("");
  }

  const currentQuiz =
    step === "industry"
      ? site.quiz.industry
      : step === "teamSize"
        ? site.quiz.teamSize
        : step === "goal"
          ? site.quiz.goal
          : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-400 text-lg font-bold text-[#0c1222] shadow-lg shadow-teal-900/40 transition hover:scale-105 hover:bg-teal-300"
        aria-label="Открыть ИИ-помощника"
      >
        AI
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="Закрыть"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-[min(640px,90vh)] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111a2e] shadow-2xl">
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">ИИ-консультант</p>
                <p className="text-xs text-slate-500">Gemini · {site.brand}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-1 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {step !== "chat" && currentQuiz && (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-sm text-slate-200">{currentQuiz.question}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {currentQuiz.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          pickQuiz(
                            step as "industry" | "teamSize" | "goal",
                            opt
                          )
                        }
                        className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-slate-200 transition hover:border-teal-400/50 hover:text-white"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={`${m.role}-${i}`}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-teal-400/20 text-teal-50"
                      : "mr-auto bg-white/5 text-slate-200"
                  }`}
                >
                  {m.text}
                </div>
              ))}

              {loading && (
                <p className="text-xs text-slate-500">Печатает ответ…</p>
              )}
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>

            {step === "chat" && (
              <div className="border-t border-white/10 p-3">
                {leadReady && (
                  <button
                    type="button"
                    onClick={goToLeadForm}
                    className="mb-2 w-full rounded-full bg-teal-400 py-2 text-xs font-semibold text-[#0c1222]"
                  >
                    Заполнить заявку
                  </button>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendMessage(input);
                  }}
                  className="flex gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ваш вопрос…"
                    className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0c1222] px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-teal-400/40"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15 disabled:opacity-50"
                  >
                    →
                  </button>
                </form>
                <button
                  type="button"
                  onClick={resetChat}
                  className="mt-2 w-full text-center text-xs text-slate-500 hover:text-slate-300"
                >
                  Начать квиз заново
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
