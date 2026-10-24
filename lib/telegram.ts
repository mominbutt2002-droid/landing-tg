function collectChatIds(): string[] {
  const values = [
    process.env.TELEGRAM_CHAT_ID,
    process.env.TELEGRAM_GROUP_CHAT_ID,
  ]
    .filter(Boolean)
    .flatMap((value) => value!.split(","))
    .map((id) => id.trim())
    .filter(Boolean);

  return [...new Set(values)];
}

function alternateGroupId(chatId: string): string | null {
  if (!/^-?\d+$/.test(chatId)) return null;
  if (chatId.startsWith("-100")) {
    const rest = chatId.slice(4);
    return rest ? `-${rest}` : null;
  }
  if (chatId.startsWith("-") && !chatId.startsWith("-100")) {
    return `-100${chatId.slice(1)}`;
  }
  return null;
}

async function sendTelegramMessage(
  token: string,
  chatId: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  let res: Response;
  try {
    res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }

  const data = (await res.json()) as { ok?: boolean; description?: string };
  if (!res.ok || !data.ok) {
    return { ok: false, error: data.description ?? "Telegram API error" };
  }
  return { ok: true };
}

export async function notifyTelegramLead(payload: {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
  meta?: unknown;
}): Promise<{ ok: boolean; error?: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = collectChatIds();

  if (!token || chatIds.length === 0) {
    return { ok: false, error: "Telegram not configured" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const metaText =
    payload.meta != null
      ? `\n\nКвиз / meta:\n${JSON.stringify(payload.meta, null, 2).slice(0, 1500)}`
      : "";

  const text = [
    "Новая заявка с лендинга",
    "",
    `Имя: ${payload.name}`,
    `Телефон: ${payload.phone}`,
    payload.email ? `Email: ${payload.email}` : null,
    `Источник: ${payload.source}`,
    payload.message ? `Комментарий: ${payload.message}` : null,
    `Сайт: ${siteUrl}`,
  ]
    .filter(Boolean)
    .join("\n")
    .concat(metaText);

  const errors: string[] = [];
  let sent = 0;

  for (const chatId of chatIds) {
    try {
      let result = await sendTelegramMessage(token, chatId, text);
      const alt = alternateGroupId(chatId);

      if (
        !result.ok &&
        alt &&
        /chat not found|chat_id is empty/i.test(result.error ?? "")
      ) {
        result = await sendTelegramMessage(token, alt, text);
      }

      if (result.ok) {
        sent += 1;
      } else {
        errors.push(`${chatId}: ${result.error}`);
      }
    } catch (e) {
      const message =
        e instanceof Error && e.name === "TimeoutError"
          ? "таймаут запроса к Telegram"
          : e instanceof Error
            ? e.message
            : "Telegram request failed";
      errors.push(`${chatId}: ${message}`);
    }
  }

  if (sent === 0) {
    console.error("Telegram notify failed", errors);
    return { ok: false, error: errors.join("; ") };
  }

  if (errors.length) {
    console.error("Telegram notify partial", errors);
  }

  return {
    ok: true,
    error: errors.length ? errors.join("; ") : undefined,
  };
}
