<template>
  <nav
    v-if="breadcrumbs.length > 0"
    class="breadcrumb-container mb-4"
    aria-label="Breadcrumb"
  >
    <ol class="d-flex align-center ga-2 list-none pa-0 ma-0">
      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="d-flex align-center ga-2"
      >
        <router-link
          v-if="index < breadcrumbs.length - 1"
          :to="crumb.path"
          class="text-caption text-grey-darken-1 text-decoration-none hover-underline"
        >
          {{ crumb.title }}
        </router-link>

        <span v-else class="text-caption font-weight-bold text-primary">
          {{ crumb.title }}
        </span>

        <v-icon
          v-if="index < breadcrumbs.length - 1"
          size="x-small"
          color="grey-lighten-1"
        >
          mdi-chevron-right
        </v-icon>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const breadcrumbs = computed(() => {
  // Limpiamos la ruta para obtener la llave del mapa (quitamos el primer /)
  const pathKey = route.path.startsWith("/")
    ? route.path.substring(1)
    : route.path;

  // Verificar si es una ruta dinámica de trámite (ej: tramites/69a0bb4062f2366728dd176a)
  const tramiteMatch = pathKey.match(/^tramites\/(.+)$/);

  if (tramiteMatch) {
    // Es una ruta de detalle de trámite - solo Inicio > Detalles de trámite
    return [
      { title: "Inicio", path: "/home" },
      { title: "Detalles de trámite", path: route.path },
    ];
  }

  // Mapa de jerarquías manual para rutas estáticas
  const hierarchyMap: Record<string, { title: string; path: string }[]> = {
    home: [{ title: "Inicio", path: "/home" }],
    "tipo-tramite": [
      { title: "Inicio", path: "/home" },
      { title: "Tipos de Trámite", path: "/tipo-tramite" },
    ],
    "solicitar-constancia": [
      { title: "Inicio", path: "/home" },
      { title: "Tipos de Trámite", path: "/tipo-tramite" },
      { title: "Solicitud", path: "/solicitar-constancia" },
    ],
    "info-tramite": [
      { title: "Inicio", path: "/home" },
      { title: "Detalles del trámite", path: "/info-tramite" },
    ],
    "admin-home": [{ title: "Inicio", path: "/admin-home" }],
    "admin-profile": [
      { title: "Inicio", path: "/admin-home" },
      { title: "Perfil de usuario", path: "/admin-profile" },
    ],
    "admin-tipo-tramite": [
      { title: "Inicio", path: "/admin-home" },
      { title: "Gestión de Trámites", path: "/admin-tipo-tramite" },
    ],
    "admin-info-tramite": [
      { title: "Inicio", path: "/admin-home" },
      { title: "Detalles", path: "/admin-info-tramite" },
    ],
  };

  // Retornar el mapa o un fallback si no existe
  if (hierarchyMap[pathKey]) {
    return hierarchyMap[pathKey];
  }

  // Fallback genérico
  return [
    {
      title: "Inicio",
      path: route.path.includes("admin") ? "/admin-home" : "/home",
    },
    {
      title: pathKey.split("/").pop()?.replace(/-/g, " ") || "Inicio",
      path: route.path,
    },
  ];
});
</script>

<style scoped>
.list-none {
  list-style: none;
}
.hover-underline:hover {
  text-decoration: underline !important;
}
.breadcrumb-container {
  min-height: 24px;
  display: block !important;
}
</style>
