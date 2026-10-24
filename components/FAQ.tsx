import { site } from "@/content/site";
import { RevealSection } from "@/components/motion/RevealSection";

export function FAQ() {
  return (
    <RevealSection id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 data-reveal className="font-display text-center text-3xl font-semibold text-white sm:text-4xl">
          Частые вопросы
        </h2>
        <div className="mt-12 space-y-3">
          {site.faq.map((item) => (
            <details
              key={item.q}
              data-reveal
              className="group rounded-xl border border-white/8 bg-white/[0.02] px-5 py-4 open:bg-white/[0.04]"
            >
              <summary className="cursor-pointer list-none font-medium text-slate-100 marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.q}
                  <span className="text-teal-400 transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}
