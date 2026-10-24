"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { useLeadForm } from "@/components/providers/LeadFormContext";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const layerBack = useRef<HTMLDivElement>(null);
  const layerMid = useRef<HTMLDivElement>(null);
  const layerFront = useRef<HTMLDivElement>(null);
  const { scrollToForm, openAssistant } = useLeadForm();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    if (layerBack.current) tl.to(layerBack.current, { yPercent: 25, ease: "none" }, 0);
    if (layerMid.current) tl.to(layerMid.current, { yPercent: 45, ease: "none" }, 0);
    if (layerFront.current) tl.to(layerFront.current, { yPercent: 70, ease: "none" }, 0);

    gsap.from("[data-hero-enter]", {
      opacity: 0,
      y: 48,
      duration: 1,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.15,
    });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[92vh] items-center overflow-hidden pt-24 pb-20"
    >
      <div
        ref={layerBack}
        className="pointer-events-none absolute -left-1/4 top-0 h-[520px] w-[520px] rounded-full bg-teal-500/10 blur-3xl"
        aria-hidden
      />
      <div
        ref={layerMid}
        className="pointer-events-none absolute -right-1/4 top-1/4 h-[420px] w-[420px] rounded-full bg-indigo-500/15 blur-3xl"
        aria-hidden
      />
      <div
        ref={layerFront}
        className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-cyan-400/10 blur-2xl"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p
            data-hero-enter
            className="mb-4 text-sm text-teal-300/90"
          >
            {site.tagline}
          </p>
          <h1
            data-hero-enter
            className="font-display max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {site.hero.title}
          </h1>
          <p
            data-hero-enter
            className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
          >
            {site.hero.subtitle}
          </p>
          <div data-hero-enter className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={scrollToForm}
              className="rounded-full bg-teal-400 px-6 py-3 text-sm font-semibold text-[#0c1222] transition hover:bg-teal-300"
            >
              {site.hero.primaryCta}
            </button>
            <button
              type="button"
              onClick={openAssistant}
              className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition hover:border-teal-400/60 hover:bg-white/5"
            >
              {site.hero.secondaryCta}
            </button>
          </div>
        </div>

        <div
          data-hero-enter
          className="relative rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/40 backdrop-blur-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            Пилот за 14 дней
          </div>
          <ul className="space-y-4 text-sm text-slate-200">
            <li className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-slate-400">Сценарий</span>
              <span>Поддержка / продажи</span>
            </li>
            <li className="flex justify-between border-b border-white/5 pb-3">
              <span className="text-slate-400">Интеграции</span>
              <span>CRM, Telegram</span>
            </li>
            <li className="flex justify-between">
              <span className="text-slate-400">Метрика</span>
              <span>Время ответа −30%</span>
            </li>
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-slate-500">
            Цифры — пример типового пилота; фактические KPI согласуем на аудите.
          </p>
        </div>
      </div>
    </section>
  );
}
