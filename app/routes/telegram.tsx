import type { Route } from "../+types/root";

export const action = async ({ request, context }: Route.ActionArgs) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const update: any = await request.json();
    console.log("Получен update:", JSON.stringify(update, null, 2));

    if (!update.message) {
      return new Response("No message in update", { status: 400 });
    }

    const chatId = update.message.chat.id;
    const text = update.message.text || "Нет текста";

    let replyText = `Вы написали: ${text}\n\nДля получения помощи, используйте в меню кнопку Помощь`;

    let replyMarkup = {
      reply_markup: {
        keyboard: [
          [{ text: "Главное меню" }]
        ],
        resize_keyboard: true,
        one_time_keyboard: false
      }
    };

    // Обработка команды /start
    if (text.startsWith("/start")) {
      replyText = "Приветствую! Выбирайте, что Вам нужно:";
      replyMarkup = {
        reply_markup: {
          keyboard: [
            [{ text: "Global Brand & Own Store" }],
            [{ text: "Развивать личный бренд (Зарубежный рынок)" }],
            [{ text: "Развивать личный бренд (РФ)" }],
            [{ text: "Главное меню" }]
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      };
    } 
    // Обработка запроса "Развивать личный бренд (Зарубежный рынок)"
    else if (text === "Развивать личный бренд (Зарубежный рынок)") {
      replyText = `✔️ Мгновенный старт онлайн на международном рынке\nЗапустите бизнес с вашим личным готовым сайтом и рекламой.\n\n✔️ Полная гибкость и универсальность\nМеняйте контент в любой момент — даже когда реклама в деле.\n\nПодходит для любого бизнеса и задач.\n\n✔️ Доступно без абонентской оплаты.\n\nОплата: криптовалюта или сервис Stripe.\n\n🔹 [Купить](https://storelikepinterest.pages.dev/init-payment/product-1/)`;
    } 
    else if (text === "Global Brand & Own Store") {
      replyText = `✔️ Instant Start in the Global Market\nLaunch your business with a ready-to-go website and advertising.\n\n✔️ Full Flexibility and Versatility\nUpdate content anytime—even while ads are running.\n\nSuitable for any business and goals.\n\n✔️ No Subscription Fees.\n\nPayment: Cryptocurrency or Stripe.\n\n🔹 [Buy Now](https://storelikepinterest.pages.dev/init-payment/product-1/)`;
    } 
    // Обработка запроса "Развивать личный бренд (РФ)"
    else if (text === "Развивать личный бренд (РФ)") {
      replyText = `[ETSTudio38Bot](https://t.me/ETSTudio38Bot)`;
    } 
    // Обработка запроса "Главное меню"
    else if (text === "Главное меню") {
      replyText = "Вы в главном меню. Выберите действие:";
      replyMarkup = {
        reply_markup: {
          keyboard: [
            [{ text: "Global Brand & Own Store" }],
            [{ text: "Развивать личный бренд (Зарубежный рынок)" }],
            [{ text: "Развивать личный бренд (РФ)" }],
            [{ text: "Помощь" }]
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        }
      };
    } 
    // Обработка запроса "Помощь"
    else if (text === "/help") {
      replyText = "Доступные команды:\n/start - Начало\n/help - Справка";
    } 
    else if (text === "Помощь") {
      replyText = "Доступные команды:\n/start - Начало\n/help - Справка";
    }
    // Если команда не распознана
    else {
      replyText = `Вы написали: ${text}\n\nДля получения помощи, используйте команду /help`;
    }

    // Отправка ответа через Telegram API с поддержкой Markdown
    const response = await fetch(
      `https://api.telegram.org/bot${context.cloudflare.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: replyText,
          parse_mode: "Markdown", // Указываем режим Markdown
          ...replyMarkup
        })
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
