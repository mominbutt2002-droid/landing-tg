import { site } from "@/content/site";
import { RevealSection } from "@/components/motion/RevealSection";

export function Benefits() {
  return (
    <RevealSection id="benefits" className="py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div data-reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Что получает бизнес
          </h2>
          <p className="mt-4 text-slate-400">
            Фокус на одном процессе, измеримый результат и понятный план масштабирования.
          </p>
        </div>
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {site.benefits.map((item) => (
            <li
              key={item.title}
              data-reveal
              className="group rounded-2xl border border-white/8 bg-white/[0.03] p-6 transition hover:border-teal-400/30 hover:bg-white/[0.05]"
            >
              <h3 className="font-display text-lg font-medium text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </RevealSection>
  );
}
