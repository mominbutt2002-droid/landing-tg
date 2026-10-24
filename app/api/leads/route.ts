import { NextResponse } from "next/server";
import { z } from "zod";
import { insertLead } from "@/lib/db";
import { notifyTelegramLead } from "@/lib/telegram";

const leadSchema = z.object({
  name: z.string().min(2).max(120),
  phone: z.string().min(6).max(40),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
  source: z.enum(["form", "ai-quiz"]).default("form"),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Некорректные данные", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, phone, email, message, source, meta } = parsed.data;
    const lead = await insertLead({
      name,
      phone,
      email: email || null,
      message: message || null,
      source,
      meta,
    });

    const telegram = await notifyTelegramLead({
      name,
      phone,
      email: email || null,
      message: message || null,
      source,
      meta,
    });

    return NextResponse.json({
      ok: true,
      id: lead.id,
      telegram_ok: telegram.ok,
      telegram_error: telegram.error ?? null,
    });
  } catch (e) {
    console.error("POST /api/leads", e);
    return NextResponse.json(
      { error: "Не удалось сохранить заявку" },
      { status: 500 }
    );
  }
}
