"use client";

import { site } from "@/content/site";
import { useLeadForm } from "@/components/providers/LeadFormContext";

export function Header() {
  const { scrollToForm, openAssistant } = useLeadForm();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/5 bg-[#0c1222]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="font-display text-lg font-semibold tracking-tight text-white">
          {site.brand}
        </a>
        <nav className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
          <a href="#benefits" className="transition hover:text-teal-300">
            Преимущества
          </a>
          <a href="#reviews" className="transition hover:text-teal-300">
            Отзывы
          </a>
          <a href="#faq" className="transition hover:text-teal-300">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openAssistant}
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 transition hover:border-teal-400/50 hover:text-white sm:inline-flex"
          >
            ИИ-помощник
          </button>
          <button
            type="button"
            onClick={scrollToForm}
            className="rounded-full bg-teal-400 px-4 py-2 text-sm font-medium text-[#0c1222] transition hover:bg-teal-300"
          >
            Заявка
          </button>
        </div>
      </div>
    </header>
  );
}
