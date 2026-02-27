<template>
  <v-container class="px-6 pb-6 px-sm-10 pb-sm-10 bg-grey-lighten-4" style="padding-top: 13px;" fluid>
    <AppBreadcrumbs class="mb-2" />
    <v-row>
      <v-col cols="12">
        <h1 class="font-bitter text-h3 text-primary font-weight-bold mb-6">
          ¡BIENVENIDO!
        </h1>
      </v-col>
    </v-row>

    <v-row class="mb-10" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card
          class="pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
          elevation="1"
        >
          <v-icon color="primary" size="48" class="mb-2">
            mdi-file-document-edit
          </v-icon>

          <h2 class="font-bitter text-h5 font-weight-bold mb-1">
            Solicitar Trámite
          </h2>

          <p class="text-body-2 text-grey-darken-1 mb-4">
            Solicita cualquier trámite académico o administrativo
          </p>

          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="text-none"
            @click="irASolicitarTramite"
          >
            Solicitar Trámite
          </v-btn>
        </v-card>
      </v-col>
      <v-col cols="12" sm="8" md="4">
        <v-card
          class="pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
          elevation="1"
        >
          <v-icon color="secondary" size="48" class="mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
		<path fill="currentColor" d="M12.838 17.638q.362-.363.362-.888t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362t.888-.363M11.05 14.15h1.85q0-.825.188-1.3t1.062-1.3q.65-.65 1.025-1.238T15.55 8.9q0-1.4-1.025-2.15T12.1 6q-1.425 0-2.312.75T8.55 8.55l1.65.65q.125-.45.563-.975T12.1 7.7q.8 0 1.2.438t.4.962q0 .5-.3.938t-.75.812q-1.1.975-1.35 1.475t-.25 1.825M12 22q-2.075 0-3.9-.787t-3.175-2.138T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" />
	</svg>
          </v-icon>

          <h2 class="font-bitter text-h5 font-weight-bold mb-1">
            Soporte y Contacto
          </h2>

          <p class="text-body-2 text-grey-darken-1 mb-4">
            Obtén ayuda rápidamente
          </p>

          <v-btn
            color="secondary"
            class="text-none text-white btn-secondary"
            to="/soporte"
          >
            Ir a Soporte
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
    

    <v-card class="rounded-lg" elevation="1">
      <v-toolbar color="transparent" density="compact">
        <v-toolbar-title class="font-bitter text-h5 font-weight-bold">
          Mis Trámites
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          icon="mdi-refresh"
          variant="text"
          color="secondary"
          size="small"
          @click="loadMisTramites"
          :loading="loading"
        ></v-btn>
      </v-toolbar>

      <v-divider></v-divider>

      <div style="max-height: 400px; overflow-y: auto">
        <v-data-table
          :headers="headers"
          :items="filteredTramites"
          :search="search"
          density="compact"
          class="compact-table"
          hide-default-footer
          :loading="loading"
          loading-text="Cargando trámites..."
          no-data-text="No tienes trámites solicitados"
        >
          <template v-slot:item.numero_seguimiento="{ item }">
            <span class="text-body-2 font-weight-medium">{{
              item.numero_seguimiento
            }}</span>
          </template>

          <template v-slot:item.tipo="{ item }">
            <span class="text-body-2">{{ item.tipo }}</span>
          </template>

          <template v-slot:item.fecha_solicitud="{ item }">
            <span class="text-body-2">{{
              formatDate(item.fecha_solicitud)
            }}</span>
          </template>

          <template v-slot:item.estado="{ item }">
            <v-chip
              text-color="white"
              :color="getStatusColor(item.estado)"
              size="x-small"
              class="font-weight-bold text-uppercase text-white"
              variant="flat"
            >
              {{ formatEstado(item.estado) }}
            </v-chip>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              icon="mdi-eye"
              variant="text"
              color="primary"
              size="small"
              @click="verDetalle(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </div>

      <v-divider></v-divider>

      <div class="d-flex justify-end pa-2 text-caption text-grey">
        Mostrando {{ filteredTramites.length }}
        {{ filteredTramites.length === 1 ? "trámite" : "trámites" }}
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import solicitudService, {
  type TramiteResponse,
} from "@/services/solicitudService";
import { v } from "vue-router/dist/router-CWoNjPRp.mjs";

const router = useRouter();
const authStore = useAuthStore();
const search = ref("");
const loading = ref(false);
const tramites = ref<any[]>([]);

// Headers de la tabla
const headers = [
  {
    title: "N° Seguimiento",
    key: "numero_seguimiento",
    align: "start" as const,
  },
  { title: "Tipo de Trámite", key: "tipo", align: "start" as const },
  {
    title: "Fecha Solicitud",
    key: "fecha_solicitud",
    align: "start" as const,
    width: "120px",
  },
  { title: "Estatus", key: "estado", align: "center" as const, width: "100px" },
  {
    title: "Acciones",
    key: "actions",
    align: "center" as const,
    width: "60px",
    sortable: false,
  },
];

// Trámites filtrados por búsqueda
const filteredTramites = computed(() => {
  if (!search.value) return tramites.value;

  const searchLower = search.value.toLowerCase();
  return tramites.value.filter(
    (t) =>
      t.numero_seguimiento?.toLowerCase().includes(searchLower) ||
      t.tipo?.toLowerCase().includes(searchLower),
  );
});

// Usar métodos del servicio para formateo
const formatEstado = (estado: string) => solicitudService.formatEstado(estado);
const getStatusColor = (estado: string) =>
  solicitudService.getStatusColor(estado);
const formatDate = (date: string) => solicitudService.formatDate(date);

// Navegar a la página de solicitar trámite
const irASolicitarTramite = () => {
  router.push("/tipo-tramite");
};

// Cargar trámites del usuario
const loadMisTramites = async () => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  loading.value = true;
  try {
    const data = await solicitudService.getMy(authStore.user!._id);
    tramites.value = solicitudService.transformToTableFormat(data);

    // Ordenar por fecha (más reciente primero)
    tramites.value.sort(
      (a, b) =>
        new Date(b.fecha_solicitud).getTime() -
        new Date(a.fecha_solicitud).getTime(),
    );
  } catch (error) {
    console.error("Error cargando trámites:", error);
    tramites.value = [];
  } finally {
    loading.value = false;
  }
};

// Función para ver detalle del trámite
const verDetalle = (item: any) => {
  router.push(`/tramites/${item._id}`);
};

onMounted(() => {
  loadMisTramites();
});
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}

.max-width-200 {
  max-width: 200px;
}

.compact-table {
  font-size: 0.875rem;
}

.compact-table :deep(th) {
  padding: 8px 12px !important;
  font-size: 0.75rem !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.5px !important;
  color: #666 !important;
  background-color: #f5f5f5 !important;
  position: sticky;
  top: 0;
  z-index: 1;
}

.compact-table :deep(td) {
  padding: 8px 12px !important;
}

.compact-table :deep(.v-data-table__tr) {
  border-bottom: 1px solid #e0e0e0;
}

.compact-table :deep(.v-data-table__tr:last-child) {
  border-bottom: none;
}

.compact-table :deep(.v-data-table__loader) {
  padding: 16px;
}
</style>
