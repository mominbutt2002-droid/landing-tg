"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { site } from "@/content/site";
import { RevealSection } from "@/components/motion/RevealSection";

gsap.registerPlugin(ScrollTrigger);

export function Reviews() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bg = bgRef.current;
    if (!bg) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    gsap.to(bg, {
      xPercent: -8,
      ease: "none",
      scrollTrigger: {
        trigger: "#reviews",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });
  }, []);

  return (
    <RevealSection id="reviews" className="relative overflow-hidden py-24">
      <div
        ref={bgRef}
        className="pointer-events-none absolute inset-y-0 -left-20 w-[120%] bg-[radial-gradient(ellipse_at_center,_rgba(45,212,191,0.08),_transparent_60%)]"
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <h2 data-reveal className="font-display text-3xl font-semibold text-white sm:text-4xl">
          Отзывы клиентов
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {site.reviews.map((review) => (
            <blockquote
              key={review.name}
              data-reveal
              className="flex h-full flex-col rounded-2xl border border-white/8 bg-[#111a2e]/80 p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-slate-300">&ldquo;{review.text}&rdquo;</p>
              <footer className="mt-6 border-t border-white/5 pt-4">
                <cite className="not-italic font-medium text-white">{review.name}</cite>
                <p className="text-xs text-slate-500">{review.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
