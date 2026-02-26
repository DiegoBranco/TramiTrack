<template>
  <v-container class="pa-6 pa-sm-10 bg-grey-lighten-4" fluid>
    <AppBreadcrumbs class="mb-4" />
    <v-row>
      <v-col cols="12">
        <h1 class="font-bitter text-h3 text-primary font-weight-bold mb-6">
          ¡BIENVENIDO!
        </h1>
      </v-col>
    </v-row>

    <v-row class="mb-10">
      <v-col cols="12" md="6">
        <v-card
          class="pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
          elevation="1"
        >
          <v-icon color="primary" size="48" class="mb-2"
            >mdi-file-document-edit</v-icon
          >
          <h2 class="font-bitter text-h5 font-weight-bold mb-1">
            Crear Trámite
          </h2>
          <p class="text-body-2 text-grey-darken-1 mb-4">
            Solicita cualquier trámite académico o administrativo
          </p>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            class="text-none "
          >
            Agregar Trámite
          </v-btn>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card
          class="pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
          elevation="1"
        >
          <v-icon color="secondary" size="48" class="mb-2"
            >mdi-chart-line</v-icon
          >
          <h2 class="font-bitter text-h5 font-weight-bold mb-1">
            Ver Estadísticas
          </h2>
          <p class="text-body-2 text-grey-darken-1 mb-4">
            Revisa métricas de los trámites e información general
          </p>
          <v-btn
            color="secondary"
            class="text-none text-white btn-secondary"
          >
            Ir a Estadísticas
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-card class="rounded-lg pa-4" elevation="1">
      <v-toolbar color="transparent" density="comfortable">
        <v-toolbar-title class="font-bitter text-h4 font-weight-bold">
          Trámites Activos
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Buscar..."
          variant="solo-filled"
          flat
          hide-details
          density="compact"
          class="max-width-300"
        ></v-text-field>
        <v-btn
          icon="mdi-filter-variant"
          variant="text"
          color="secondary"
        ></v-btn>
      </v-toolbar>

      <v-data-table
        :headers="headers"
        :items="tramites"
        :search="search"
        :loading="loading"
        loading-text="Cargando trámites..."
        class="mt-4"
      >
        <template v-slot:item.estudiante="{ item }">
          <div class="d-flex align-center ga-3 py-2">
            <v-avatar color="primary" size="32">
              <span class="text-caption text-white">{{
                getInitials(item.estudiante)
              }}</span>
            </v-avatar>
            <span class="text-body-2 font-weight-medium">{{
              item.estudiante
            }}</span>
          </div>
        </template>

        <template v-slot:item.estatus="{ item }">
          <v-chip
            :color="getStatusColor(item.estatus)"
            size="small"
            class="font-weight-bold text-uppercase"
            variant="flat"
          >
            {{ formatEstado(item.estatus) }}
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

      <div class="text-right text-caption text-grey mt-2">
        Mostrando {{ tramites.length }} de {{ tramites.length }}
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import solicitudService from "@/services/solicitudService";

const router = useRouter();
const search = ref("");
const loading = ref(false);

const headers = [
  { title: "Estudiante", key: "estudiante", align: "start" as const },
  { title: "Tipo de Trámite", key: "tipo", align: "start" as const },
  { title: "Fecha", key: "fecha", align: "start" as const },
  { title: "Estatus", key: "estatus", align: "center" as const },
  {
    title: "Acciones",
    key: "actions",
    align: "center" as const,
    sortable: false,
  },
];

const tramites = ref<any[]>([]);

const loadTramites = async () => {
  loading.value = true;
  try {
    const data = await solicitudService.getAll();
    tramites.value = data.map((item) => ({
      _id: item._id,
      estudiante: `${item.estudiante_id?.nombre || ""} ${item.estudiante_id?.apellido || ""}`.trim(),
      tipo: item.tramiteType_id?.nombre || "N/A",
      fecha: solicitudService.formatDate(item.fecha_solicitud),
      estatus: item.estado,
    }));
  } catch (error) {
    console.error("Error cargando trámites de admin:", error);
    tramites.value = [];
  } finally {
    loading.value = false;
  }
};

const getStatusColor = (status: string) => {
  return solicitudService.getStatusColor(status);
};

const formatEstado = (status: string) => solicitudService.formatEstado(status);

const getInitials = (name: string) => {
  if (!name) return "NA";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const verDetalle = (item: any) => {
  if (!item?._id) return;
  router.push({
    path: "/admin-info-tramite",
    query: { id: item._id },
  });
};

onMounted(() => {
  loadTramites();
});
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}

.max-width-300 {
  max-width: 300px;
}
:deep(.v-data-table-header) {
  background-color: #f9f9f9;
}

:deep(.v-chip .v-chip__content) {
  color: white !important;
}

:deep(.btn-secondary .v-btn__content) {
  color: white !important;
}
</style>
