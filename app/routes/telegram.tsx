import type { Route } from "../+types/root";

export const action = async ({ request, context }: Route.ActionArgs) => {
  // Проверяем, что метод запроса POST
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    // Обрабатываем входящий JSON от Telegram
    const update:any = await request.json();
    console.log("Получен update:", JSON.stringify(update, null, 2));

    if (!update.message) {
      return new Response("No message in update", { status: 400 });
    }

    const chatId = update.message.chat.id;
    const text = update.message.text || "Нет текста";

    // Ответ на команды
    let replyText = `Вы сказали: ${text}`;
    if (text.startsWith("/start")) {
      replyText = "Привет! Я ваш бот.";
    } else if (text.startsWith("/help")) {
      replyText = "Доступные команды:\n/start - Начало\n/help - Справка";
    }

    // Отправка ответа через Telegram API
    const response = await fetch(
      `https://api.telegram.org/bot${context.cloudflare.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: replyText }),
      }
    );

    console.log("Ответ от Telegram:", await response.json());
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Ошибка обработки Webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
};

export default function TelegramWebhook() {
  return <p>Telegram Webhook Handler</p>;
}
