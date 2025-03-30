import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("telegram", "routes/telegram.tsx"),
  route("start", "routes/start-tg-welcome.tsx"),
] satisfies RouteConfig;
