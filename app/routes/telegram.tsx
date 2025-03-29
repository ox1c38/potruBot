import type { Route } from "./+types/telegram";

export function loader({ request, context }: Route.LoaderArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  return request.json().then(async (update:any) => {
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text || "Нет текста";

      // Проверяем команду
      let replyText = `Вы сказали: ${text}`;
      if (text.startsWith("/start")) {
        replyText = "Привет! Я ваш бот.";
      } else if (text.startsWith("/help")) {
        replyText = "Доступные команды:\n/start - Начало\n/help - Справка";
      }

      await fetch(`https://api.telegram.org/bot${context.cloudflare.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: replyText }),
      });
    }
    return new Response("OK", { status: 200 });
  });
}

export default function TelegramWebhook() {
  return <p>Telegram Webhook Handler</p>;
}
