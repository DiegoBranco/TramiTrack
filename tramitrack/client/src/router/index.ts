/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";
import { useAuthStore } from "../stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// --- CONFIGURACIÓN DE REDIRECCIÓN Y RUTAS ---

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();

  const routeExists = router
    .getRoutes()
    .some((route) => route.path === to.path);

  // si la ruta no existe o es la raíz, redirigir según estado de auth
  if (!routeExists || to.path === "/") {
    if (!auth.isAuthenticated) {
      return next("/login");
    } else {
      // Si está autenticado pero la ruta no existe, mandarlo a su home correspondiente
      return next(auth.user?.rol === "admin" ? "/admin-home" : "/home");
    }
  }

  // si nO está autenticado y la ruta no es /login, mandarlo a /login
  if (to.path !== "/login" && !auth.isAuthenticated) {
    return next("/login");
  }

  // si ya está autenticado e intenta entrar a /login, redirigir según su rol
  if (to.path === "/login" && auth.isAuthenticated) {
    if (auth.user?.rol === "admin") {
      return next("/admin-home");
    } else {
      return next("/home");
    }
  }

  // Si la ruta contiene "admin" y el usuario no tiene ese rol, mandarlo al home normal
  if (
    to.path.includes("admin") &&
    auth.isAuthenticated &&
    auth.user?.rol !== "administrador"
  ) {
    return next("/home");
  }

  next();
});

// --- MANEJO DE ERRORES DE IMPORTACIÓN DINÁMICA ---

router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (localStorage.getItem("vuetify:dynamic-reload")) {
      console.error("Dynamic import error, reloading page did not fix it", err);
    } else {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
