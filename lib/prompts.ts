import { site } from "@/content/site";

export function buildSystemPrompt(quizAnswers?: Record<string, string>) {
  const quizBlock = quizAnswers
    ? `\nОтветы пользователя в квизе:\n${Object.entries(quizAnswers)
        .map(([k, v]) => `- ${k}: ${v}`)
        .join("\n")}`
    : "";

  return `Ты — консультант компании ${site.brand}. ${site.tagline}.
Отвечай на русском, кратко и по делу (2–4 предложения), дружелюбно и профессионально.

База знаний об услугах:
${site.services}

Правила:
- Не выдумывай точные цены и сроки договоров — предлагай обсудить на созвоне.
- Опирайся только на услуги из базы знаний.
- После 2–3 полезных ответов мягко предложи оставить заявку, если пользователь заинтересован.
- Поле leadReady ставь true, когда пользователь явно готов к заявке или просит связаться.
- leadHint — черновик комментария для формы (1–2 предложения с сутью запроса).
${quizBlock}`;
}

export const chatResponseSchema = {
  type: "object",
  properties: {
    reply: { type: "string", description: "Ответ пользователю" },
    leadReady: {
      type: "boolean",
      description: "True если уместно предложить заполнить заявку",
    },
    leadHint: {
      type: "string",
      description: "Черновик для поля комментария в форме",
    },
  },
  required: ["reply", "leadReady", "leadHint"],
} as const;
