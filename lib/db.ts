import { neon } from "@neondatabase/serverless";
import { insertLeadFile, listLeadsFile } from "@/lib/leads-file";

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  source: string;
  meta: unknown;
  created_at: string;
};

function usePostgres() {
  return Boolean(process.env.POSTGRES_URL?.trim());
}

function getSql() {
  const url = process.env.POSTGRES_URL?.trim();
  if (!url) {
    throw new Error("POSTGRES_URL is not configured");
  }
  return neon(url);
}

export async function insertLead(input: {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  meta?: unknown;
}): Promise<LeadRow> {
  if (!usePostgres()) {
    return insertLeadFile(input);
  }

  const sql = getSql();
  const rows = await sql`
    INSERT INTO leads (name, phone, email, message, source, meta)
    VALUES (
      ${input.name},
      ${input.phone},
      ${input.email ?? null},
      ${input.message ?? null},
      ${input.source},
      ${input.meta ? JSON.stringify(input.meta) : null}::jsonb
    )
    RETURNING id, name, phone, email, message, source, meta, created_at
  `;
  return rows[0] as LeadRow;
}

export async function listLeads(): Promise<LeadRow[]> {
  if (!usePostgres()) {
    return listLeadsFile();
  }

  const sql = getSql();
  const rows = await sql`
    SELECT id, name, phone, email, message, source, meta, created_at
    FROM leads
    ORDER BY created_at DESC
    LIMIT 500
  `;
  return rows as LeadRow[];
}
