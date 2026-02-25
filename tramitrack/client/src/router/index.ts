/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from "vue-router";
import { setupLayouts } from "virtual:generated-layouts";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
});

// --- CONFIGURACIÓN DE REDIRECCIÓN Y RUTAS ---

router.beforeEach((to, from, next) => {
  // obtener todos los nombres de rutas registradas
  const routeExists = router
    .getRoutes()
    .some((route) => route.path === to.path);

  if (to.path === "/") {
    next("/login");
  } else if (!routeExists) {
    next("/login");
  }
  // 4. Lógica de protección futura (ej. si no está logueado y no es la página login)
  // else if (to.path !== '/login' && !isLoggedIn) { next('/login') }
  else {
    next();
  }
});

// Workaround for https://github.com/vitejs/vite/issues/11804
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
