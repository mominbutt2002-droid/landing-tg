import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg text-white">{site.brand}</p>
          <p className="mt-1 text-sm text-slate-500">{site.tagline}</p>
        </div>
        <div className="text-sm text-slate-400">
          <p>{site.footer.email}</p>
          <p>{site.footer.phone}</p>
        </div>
      </div>
    </footer>
  );
}
