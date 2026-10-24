"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealSectionProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  id?: string;
};

export function RevealSection({
  children,
  className = "",
  stagger = 0.08,
  id,
}: RevealSectionProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.style.opacity = "1";
      return;
    }

    const items = el.querySelectorAll("[data-reveal]");
    gsap.set(items.length ? items : el, { opacity: 0, y: 36 });

    const tween = gsap.to(items.length ? items : el, {
      opacity: 1,
      y: 0,
      duration: 0.85,
      ease: "power3.out",
      stagger: items.length ? stagger : 0,
      scrollTrigger: {
        trigger: el,
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [stagger]);

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
