import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { LeadRow } from "@/lib/db";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");

async function readAll(): Promise<LeadRow[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as LeadRow[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(leads: LeadRow[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf8");
}

export async function insertLeadFile(input: {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  meta?: unknown;
}): Promise<LeadRow> {
  const leads = await readAll();
  const lead: LeadRow = {
    id: crypto.randomUUID(),
    name: input.name,
    phone: input.phone,
    email: input.email ?? null,
    message: input.message ?? null,
    source: input.source,
    meta: input.meta ?? null,
    created_at: new Date().toISOString(),
  };
  leads.unshift(lead);
  await writeAll(leads);
  return lead;
}

export async function listLeadsFile(): Promise<LeadRow[]> {
  const leads = await readAll();
  return leads.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
