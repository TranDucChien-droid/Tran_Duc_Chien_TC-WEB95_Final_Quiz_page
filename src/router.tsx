import { AppLayout } from "@/components/AppLayout";
import { getToken } from "@/services/api";
import { AttemptsPage } from "@/routes/AttemptsPage";
import { LoginPage } from "@/routes/LoginPage";
import { QuizHomePage } from "@/routes/QuizHomePage";
import { QuizPlayPage } from "@/routes/QuizPlayPage";
import { RegisterPage } from "@/routes/RegisterPage";
import { Outlet, createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "login",
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "register",
  component: RegisterPage,
});

const appLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "appLayout",
  beforeLoad: () => {
    if (!getToken()) throw redirect({ to: "/login" });
  },
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "/",
  component: QuizHomePage,
});

const playRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "quiz/$quizId",
  component: QuizPlayPage,
});

const attemptsRoute = createRoute({
  getParentRoute: () => appLayoutRoute,
  path: "attempts",
  component: AttemptsPage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  appLayoutRoute.addChildren([indexRoute, playRoute, attemptsRoute]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
