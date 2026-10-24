"use client";

import { FormEvent, useEffect, useState } from "react";
import { site } from "@/content/site";
import { useLeadForm } from "@/components/providers/LeadFormContext";
import { RevealSection } from "@/components/motion/RevealSection";

export function LeadForm() {
  const { prefill, applyPrefill } = useLeadForm();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [source, setSource] = useState<"form" | "ai-quiz">("form");
  const [meta, setMeta] = useState<Record<string, unknown> | undefined>();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    if (prefill.message) setMessage(prefill.message);
    if (prefill.source) setSource(prefill.source);
    if (prefill.meta) setMeta(prefill.meta);
  }, [prefill]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorText("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message,
          source,
          meta,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        telegram_ok?: boolean;
        telegram_error?: string | null;
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Ошибка отправки");
      }

      if (data.telegram_ok === false) {
        setStatus("error");
        setErrorText(
          `Заявка сохранена, но в Telegram не ушла: ${data.telegram_error ?? "проверьте бота и id группы"}`
        );
        return;
      }

      setStatus("success");
      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
      setSource("form");
      setMeta(undefined);
      applyPrefill({});
    } catch (err) {
      setStatus("error");
      setErrorText(err instanceof Error ? err.message : "Не удалось отправить");
    }
  }

  return (
    <RevealSection id="lead-form" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div data-reveal>
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              {site.form.title}
            </h2>
            <p className="mt-4 max-w-md text-slate-400">{site.form.subtitle}</p>
          </div>

          <form
            data-reveal
            onSubmit={onSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
          >
            <div className="space-y-4">
              <label className="block text-sm text-slate-300">
                Имя
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0c1222] px-4 py-3 text-white outline-none ring-teal-400/40 focus:ring-2"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Телефон
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0c1222] px-4 py-3 text-white outline-none ring-teal-400/40 focus:ring-2"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Email (необязательно)
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-white/10 bg-[#0c1222] px-4 py-3 text-white outline-none ring-teal-400/40 focus:ring-2"
                />
              </label>
              <label className="block text-sm text-slate-300">
                Комментарий
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="mt-1.5 w-full resize-none rounded-xl border border-white/10 bg-[#0c1222] px-4 py-3 text-white outline-none ring-teal-400/40 focus:ring-2"
                />
              </label>
            </div>

            {status === "success" && (
              <p className="mt-4 text-sm text-teal-300">
                Заявка отправлена. Мы свяжемся с вами в ближайшее время.
              </p>
            )}
            {status === "error" && (
              <p className="mt-4 text-sm text-red-400">{errorText}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 w-full rounded-full bg-teal-400 py-3 text-sm font-semibold text-[#0c1222] transition hover:bg-teal-300 disabled:opacity-60"
            >
              {status === "loading" ? "Отправка…" : "Отправить заявку"}
            </button>
          </form>
        </div>
      </div>
    </RevealSection>
  );
}
