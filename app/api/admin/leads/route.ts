import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminCookieName, verifyAdminSessionToken } from "@/lib/auth";
import { listLeads } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get(getAdminCookieName())?.value;

  if (!verifyAdminSessionToken(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const leads = await listLeads();
    return NextResponse.json({ leads });
  } catch (e) {
    console.error("GET /api/admin/leads", e);
    return NextResponse.json({ error: "Failed to load leads" }, { status: 500 });
  }
}
