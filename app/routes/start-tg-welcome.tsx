import { useEffect, useState } from "react";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.cloudflare.env.VALUE_FROM_CLOUDFLARE };
}

// Определяем интерфейс для loaderData
interface LoaderData {
  message: string;
}

// Явно указываем `loaderData` в пропсах
export default function StartTgWelcome({ loaderData }: { loaderData: LoaderData }) {
  const [username, setUsername] = useState("Гость");

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready(); // Инициализируем WebApp
      setUsername(tg.initDataUnsafe?.user?.first_name || "Гость");
    }
  }, []);

  const startBot = () => {
    (window as any).Telegram?.WebApp?.sendData("/start"); // Отправляем команду боту
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold">Привет, {username}!</h1>
      <p className="text-gray-700">{loaderData?.message}</p>
      <button
        onClick={startBot}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        🚀 Начать
      </button>
    </div>
  );
}
