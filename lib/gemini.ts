import { GoogleGenAI } from "@google/genai";
import {
  buildSystemPrompt,
  chatResponseSchema,
} from "@/lib/prompts";

export type ChatMessage = { role: "user" | "model"; text: string };

export type ChatStructuredReply = {
  reply: string;
  leadReady: boolean;
  leadHint: string;
};

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateChatReply(input: {
  messages: ChatMessage[];
  quizAnswers?: Record<string, string>;
}): Promise<ChatStructuredReply> {
  const model = process.env.GEMINI_MODEL ?? "gemini-3.5-flash-lite";
  const ai = getClient();

  const contents = [
    {
      role: "user" as const,
      parts: [{ text: buildSystemPrompt(input.quizAnswers) }],
    },
    ...input.messages.map((m) => ({
      role: m.role === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: m.text }],
    })),
  ];

  const response = await ai.models.generateContent({
    model,
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema: chatResponseSchema,
    },
  });

  const raw = response.text?.trim();
  if (!raw) {
    throw new Error("Empty model response");
  }

  const parsed = JSON.parse(raw) as ChatStructuredReply;
  return {
    reply: parsed.reply ?? "Не удалось сформировать ответ. Попробуйте переформулировать вопрос.",
    leadReady: Boolean(parsed.leadReady),
    leadHint: parsed.leadHint ?? "",
  };
}
