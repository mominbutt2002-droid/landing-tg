"use client";

import { useCallback, useEffect, useState } from "react";

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string;
  meta: unknown;
  created_at: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadLeads = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/leads");
      if (res.status === 401) {
        setAuthed(false);
        return;
      }
      const data = (await res.json()) as { leads?: Lead[]; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Ошибка загрузки");
      setLeads(data.leads ?? []);
      setAuthed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Неверный пароль");
      return;
    }
    setPassword("");
    await loadLeads();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setLeads([]);
  }

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c1222] px-4">
        <form
          onSubmit={login}
          className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.03] p-8"
        >
          <h1 className="font-display text-xl font-semibold text-white">Админ-панель</h1>
          <p className="mt-2 text-sm text-slate-400">Введите пароль для просмотра заявок</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-6 w-full rounded-xl border border-white/10 bg-[#0c1222] px-4 py-3 text-white outline-none focus:ring-2 focus:ring-teal-400/40"
            placeholder="Пароль"
          />
          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-full bg-teal-400 py-3 text-sm font-semibold text-[#0c1222]"
          >
            Войти
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0c1222] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-semibold text-white">Заявки</h1>
            <p className="text-sm text-slate-500">Всего: {leads.length}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadLeads()}
              disabled={loading}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
            >
              Обновить
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="rounded-full bg-white/10 px-4 py-2 text-sm text-white"
            >
              Выйти
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Дата</th>
                <th className="px-4 py-3 font-medium">Имя</th>
                <th className="px-4 py-3 font-medium">Телефон</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Источник</th>
                <th className="px-4 py-3 font-medium">Комментарий</th>
                <th className="px-4 py-3 font-medium">Meta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {leads.map((lead) => (
                <tr key={lead.id} className="align-top hover:bg-white/[0.02]">
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {new Date(lead.created_at).toLocaleString("ru-RU")}
                  </td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3">{lead.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-teal-400/15 px-2 py-0.5 text-xs text-teal-300">
                      {lead.source}
                    </span>
                  </td>
                  <td className="max-w-xs px-4 py-3 text-slate-400">{lead.message ?? "—"}</td>
                  <td className="max-w-xs px-4 py-3">
                    {lead.meta ? (
                      <pre className="whitespace-pre-wrap text-xs text-slate-500">
                        {JSON.stringify(lead.meta, null, 2)}
                      </pre>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
              {!leads.length && !loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    Заявок пока нет
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
