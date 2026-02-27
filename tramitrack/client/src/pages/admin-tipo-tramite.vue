<template>
  <v-container class="pa-6 pa-sm-10 bg-grey-lighten-4" fluid>
    <AppBreadcrumbs class="mb-4" />

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="60"
        width="6"
      ></v-progress-circular>
      <p class="text-h6 mt-4 text-grey-darken-1">Cargando trámites...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10">
      <v-icon icon="mdi-alert-circle" size="60" color="error"></v-icon>
      <p class="text-h6 mt-4 text-error">{{ error }}</p>
      <v-btn color="primary" variant="flat" class="mt-4" @click="fetchTramites">
        Reintentar
      </v-btn>
    </div>

    <!-- Content -->
    <template v-else>
      <header class="mb-10">
        <h1
          class="font-bitter text-h3 text-grey-darken-4 font-weight-bold mb-2"
        >
          Tipos de Trámites
        </h1>
        <p class="text-h6 text-grey-darken-1 font-weight-regular">
          Selecciona el tipo de trámite que deseas solicitar
        </p>
      </header>

      <v-row justify="center" class="mx-auto" style="max-width: 1200px">
        <!-- Card para crear un nuevo trámite -->
        <v-col cols="12" sm="6" md="4" class="d-flex justify-center">
          <TramiteCard
            title="Crear nuevo trámite"
            description="Agrega un nuevo tipo de trámite al sistema"
            icon="mdi-plus-box"
            :meta="''"
            :iconBgColor="'secondary'"
            style="background: #ffffff; border: 1px solid var(--v-theme-secondary);"
          >
            <template #actions>
              <v-btn
                color="secondary"
                variant="outlined"
                class="text-none px-6 rounded-lg font-weight-bold"
                @click="$router.push({ path: '/admin-edit-tramite', query: { id: 'nuevo' } })"
              >
                Crear
              </v-btn>
            </template>
          </TramiteCard>
        </v-col>
        <v-col
          v-for="tramite in tramites"
          :key="tramite._id"
          cols="12"
          sm="6"
          md="4"
          class="d-flex justify-center"
        >
          <TramiteCard
            :title="tramite.nombre"
            :description="tramite.descripcion"
            :icon="getIcon(tramite.icono)"
            :meta="`${tramite.dias_habiles} días`"
            :iconBgColor="getIconColor(tramite._id)"
          >
            <template #actions>
              <v-btn
                color="primary"
                variant="outlined"
                class="text-none px-6 rounded-lg font-weight-bold"
                @click="$router.push({ path: '/admin-edit-tramite', query: { id: tramite._id } })"
              >
                Editar
              </v-btn>
            </template>
          </TramiteCard>
        </v-col>
      </v-row>

      <v-row class="mt-12">
        <v-col cols="12">
          <v-btn
            variant="outlined"
            color="primary"
            prepend-icon="mdi-arrow-left"
            class="text-none rounded-lg px-4"
            to="/home"
          >
            Volver a Inicio
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import TramiteCard from "@/components/TramiteCard.vue";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import tramiteTypeService, {
  type TramiteType,
} from "@/services/tramiteTypeService";

const router = useRouter();
const tramites = ref<TramiteType[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

// Mapa de colores para los iconos (puedes personalizarlo)
const colorMap: Record<string, string> = {
  primary: "#00535a",
  secondary: "#2E7D32",
  accent: "#B71C1C",
};

// Mapa de iconos por defecto basado en el nombre o puedes usar el icono de la BD
const getIcon = (icono?: string) => {
  if (icono) return icono;

  // Iconos por defecto basados en el nombre
  const nombre =
    tramites.value.find((t) => t.icono === icono)?.nombre.toLowerCase() || "";
  if (nombre.includes("estudio")) return "mdi-certificate";
  if (nombre.includes("inscripción")) return "mdi-file-check";
  if (nombre.includes("nota")) return "mdi-book-open-variant";
  return "mdi-file-document";
};

// Asignar colores basados en el índice o ID
const getIconColor = (id: string) => {
  const colors = [
    "primary",
    "secondary",
    "accent",
    "info",
    "success",
    "warning",
  ];
  const index = parseInt(id.slice(-2), 16) % colors.length;
  return colors[index];
};

const fetchTramites = async () => {
  loading.value = true;
  error.value = null;

  try {
    const data = await tramiteTypeService.getAll();
    tramites.value = data;
  } catch (err) {
    error.value = "Error al cargar los trámites. Por favor, intenta de nuevo.";
    console.error("Error fetching tramites:", err);
  } finally {
    loading.value = false;
  }
};

const irASolicitud = (tramite: TramiteType) => {
  router.push({
    path: "/solicitar-constancia",
    query: {
      id: tramite._id,
      nombre: tramite.nombre,
      costo: tramite.costo.toString(),
      dias: tramite.dias_habiles.toString(),
    },
  });
};

onMounted(() => {
  fetchTramites();
});
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}
</style>
