import { NextResponse } from "next/server";
import { z } from "zod";
import { generateChatReply } from "@/lib/gemini";
import { checkRateLimit } from "@/lib/rate-limit";

const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "model"]),
        text: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(30),
  quizAnswers: z.record(z.string(), z.string()).optional(),
});

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "anonymous";

  const rate = checkRateLimit(`chat:${ip}`, 25, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Слишком много запросов. Подождите немного." },
      {
        status: 429,
        headers: rate.retryAfterSec
          ? { "Retry-After": String(rate.retryAfterSec) }
          : undefined,
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
    }

    const result = await generateChatReply(parsed.data);
    return NextResponse.json(result);
  } catch (e) {
    console.error("POST /api/chat", e);
    return NextResponse.json(
      { error: "ИИ временно недоступен. Попробуйте позже или оставьте заявку." },
      { status: 503 }
    );
  }
}
