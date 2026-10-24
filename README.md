# Nexus AI Landing

Продающий лендинг с ИИ-помощником (Gemini), формой заявок, админ-панелью `/admin` и уведомлениями в Telegram.

## Стек

- Next.js (App Router), TypeScript, Tailwind CSS 4
- GSAP + ScrollTrigger, Lenis
- Neon Postgres (`@neondatabase/serverless`)
- `@google/genai` — модель `gemini-3.5-flash-lite`

## Локальный запуск

1. Скопируйте `.env.example` в `.env.local` и заполните переменные.
2. **Postgres (опционально локально):** если `POSTGRES_URL` пустой, заявки сохраняются в `data/leads.json` (удобно для разработки). Для production на Vercel задайте `POSTGRES_URL` и выполните SQL из [`db/schema.sql`](db/schema.sql) в консоли Neon.
3. Установите зависимости и запустите dev-сервер:

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000). Админка: [http://localhost:3000/admin](http://localhost:3000/admin).

## Telegram

1. Создайте бота через [@BotFather](https://t.me/BotFather) → `TELEGRAM_BOT_TOKEN`.
2. Создайте **группу**, добавьте бота и сделайте его **администратором** (право писать сообщения).
3. Напишите в группу любое сообщение.
4. Откройте `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найдите `"chat":{"id":-100...}` — это id группы.
5. В `.env.local`:
   - `TELEGRAM_CHAT_ID` — личный чат (положительное число), если заявки нужны и вам в личку
   - `TELEGRAM_GROUP_CHAT_ID` — id группы (`-100...`)
6. Перезапустите `npm run dev`. Заявка уйдёт и в админку, и в указанные чаты.

## Деплой на Vercel

1. Import репозитория в Vercel.
2. Подключите **Postgres** (Neon) → переменная `POSTGRES_URL`.
3. Добавьте остальные env из `.env.example`.
4. Выполните `db/schema.sql` в Neon.
5. Задайте `NEXT_PUBLIC_SITE_URL` на production URL.

## Контент

Тексты лендинга редактируются в [`content/site.ts`](content/site.ts).

## Скрипты

- `npm run dev` — разработка
- `npm run build` — production-сборка
- `npm run start` — запуск production
