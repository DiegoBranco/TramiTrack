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
  const routeExists = to.matched.length > 0;

  if (!routeExists || to.path === "/") {
    if (!auth.isAuthenticated) {
      return next("/login");
    } else {
      return next(auth.user?.rol === "admin" ? "/admin-home" : "/home");
    }
  }

  if (to.path !== "/login" && !auth.isAuthenticated) {
    return next("/login");
  }

  if (to.path === "/login" && auth.isAuthenticated) {
    return next(auth.user?.rol === "admin" ? "/admin-home" : "/home");
  }

  if (
    to.path.includes("admin") &&
    auth.isAuthenticated &&
    auth.user?.rol !== "admin"
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
