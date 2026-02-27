<template>
  <v-container
    class="px-6 pb-6 px-sm-10 pb-sm-10 bg-grey-lighten-4"
    style="padding-top: 13px"
    fluid
  >
    <AppBreadcrumbs class="mb-2" />

    <div v-if="loading" class="text-center py-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="56"
        width="6"
      ></v-progress-circular>
      <p class="text-subtitle-1 mt-4 text-grey-darken-1">
        Cargando detalle del trámite...
      </p>
    </div>

    <div v-else-if="error" class="text-center py-8">
      <v-icon icon="mdi-alert-circle-outline" size="56" color="error"></v-icon>
      <p class="text-h6 mt-3 text-error">{{ error }}</p>
      <v-btn class="mt-4" color="primary" @click="loadDetalle"
        >Reintentar</v-btn
      >
    </div>

    <template v-else-if="detalle">
      <v-row class="mb-4" align="center">
        <v-col cols="12">
          <div class="d-flex flex-wrap align-center ga-3">
            <h1 class="font-bitter text-h4 text-grey-darken-4 font-weight-bold">
              {{ detalle.tramiteType_id?.nombre || "Detalle del trámite" }}
            </h1>
            <v-chip
              :color="statusConfig.color"
              text-color="white"
              class="font-weight-bold text-capitalize"
              size="small"
            >
              {{ statusConfig.label }}
            </v-chip>
          </div>
          <p class="text-subtitle-1 text-grey-darken-1">
            Número de seguimiento:
            <span class="text-primary font-weight-bold">{{
              detalle.numero_seguimiento || "N/A"
            }}</span>
          </p>
        </v-col>
      </v-row>

      <v-row align="stretch">
        <v-col cols="12" md="7" class="d-flex flex-column">
          <v-card class="pa-4 rounded-lg mb-4" elevation="1">
            <h2 class="font-bitter text-subtitle-1 font-weight-bold mb-3">
              INFORMACIÓN GENERAL
            </h2>
            <v-row dense>
              <v-col cols="12" sm="6">
                <p class="field-label">Nombre del Trámite:</p>
                <p class="text-body-2 mb-2">
                  {{ detalle.tramiteType_id?.nombre || "No disponible" }}
                </p>

                <p class="field-label">Vigencia:</p>
                <p class="text-body-2 mb-2">
                  {{ formatDate(detalle.fecha_solicitud) }} -
                  {{ formatDate(detalle.fecha_estimada) }}
                </p>

                <p class="field-label">Fecha solicitada:</p>
                <p class="text-body-2 mb-0">
                  {{ formatDate(detalle.fecha_solicitud) }}
                </p>
              </v-col>
              <v-col cols="12" sm="6">
                <p class="field-label">Requisitos:</p>
                <p class="text-body-2">
                  {{
                    detalle.tramiteType_id?.descripcion ||
                    "Documento oficial emitido por la coordinación académica."
                  }}
                </p>
              </v-col>
            </v-row>
          </v-card>

          <v-card class="pa-4 rounded-lg flex-grow-1" elevation="1">
            <h2 class="font-bitter text-subtitle-1 font-weight-bold mb-3">
              SEGUIMIENTO
            </h2>
            <p class="text-body-2 font-weight-bold mb-2">Observaciones</p>
            <v-text-field
              v-model="form.observaciones"
              variant="solo-filled"
              flat
              density="comfortable"
              hide-details
              placeholder="Ingresa las observaciones"
              class="mb-4"
            />

            <p class="text-body-2 font-weight-bold mb-2">Estado</p>
            <v-select
              v-model="form.estado"
              :items="estadoOptions"
              item-title="label"
              item-value="value"
              variant="solo-filled"
              flat
              density="comfortable"
              hide-details
              placeholder="Selecciona el estado de la solicitud"
            />
          </v-card>
        </v-col>

        <v-col cols="12" md="5" class="d-flex flex-column">
          <v-card class="pa-4 rounded-lg mb-4" elevation="1">
            <h2 class="font-bitter text-subtitle-1 font-weight-bold mb-3">
              INFORMACIÓN DE PAGO
            </h2>
            <v-row>
              <v-col cols="12" sm="6" class="pb-2">
                <div class="info-grid-item">
                  <v-avatar color="primary" size="30">
                    <v-icon size="16" color="white">mdi-account-school</v-icon>
                  </v-avatar>
                  <div>
                    <p class="label">Estudiante</p>
                    <p class="value value-link">{{ fullName }}</p>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6" class="pb-2">
                <div class="info-grid-item">
                  <v-avatar color="accent" size="30">
                    <v-icon size="16" color="white"
                      >mdi-credit-card-outline</v-icon
                    >
                  </v-avatar>
                  <div>
                    <p class="label">Cta. de origen</p>
                    <p class="value">{{ cuentaOrigen }}</p>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6" class="py-2">
                <div class="info-grid-item">
                  <v-avatar color="accent" size="30">
                    <v-icon size="16" color="white">mdi-cash</v-icon>
                  </v-avatar>
                  <div>
                    <p class="label">Monto de pago</p>
                    <p class="value">
                      {{ formatAmount(detalle.datos_formulario?.monto) }}
                    </p>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6" class="py-2">
                <div class="info-grid-item">
                  <v-avatar color="secondary" size="30">
                    <v-icon size="16" color="white">mdi-calendar</v-icon>
                  </v-avatar>
                  <div>
                    <p class="label">Fecha de pago</p>
                    <p class="value">
                      {{ formatDate(detalle.datos_formulario?.fecha_pago) }}
                    </p>
                  </div>
                </div>
              </v-col>

              <v-col cols="12" sm="6" class="pt-2">
                <div class="info-grid-item">
                  <v-avatar color="primary" size="30">
                    <v-icon size="16" color="white">mdi-receipt-text</v-icon>
                  </v-avatar>
                  <div>
                    <p class="label">Referencia</p>
                    <p class="value">
                      {{ detalle.datos_formulario?.referencia_pago || "N/A" }}
                    </p>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <v-card class="pa-4 rounded-lg flex-grow-1" elevation="1">
            <h2 class="font-bitter text-subtitle-1 font-weight-bold mb-3">
              Acciones
            </h2>
            <v-btn
              block
              color="secondary"
              class="text-none mb-3 btn-text-white"
              @click="downloadDocumento"
              :disabled="!hasDownloadableDocument"
            >
              Descargar Documentos
            </v-btn>
            <v-btn
              block
              color="primary"
              class="text-none btn-text-white"
              @click="sendNotification"
            >
              Enviar Notificación
            </v-btn>
          </v-card>
        </v-col>
      </v-row>

      <div class="d-flex justify-center mt-6 mb-4">
        <v-btn
          color="primary"
          class="text-none btn-text-white"
          @click="saveCambios"
          :loading="saving"
        >
          Guardar cambios
        </v-btn>
      </div>

      <v-btn
        variant="outlined"
        color="primary"
        prepend-icon="mdi-arrow-u-left-top"
        class="text-none"
        @click="router.push('/admin-home')"
      >
        Volver a Inicio
      </v-btn>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import solicitudService, {
  type TramiteResponse,
} from "@/services/solicitudService";

const route = useRoute();
const router = useRouter();

const detalle = ref<TramiteResponse | null>(null);
const loading = ref(false);
const saving = ref(false);
const error = ref<string | null>(null);

const form = ref({
  observaciones: "",
  estado: "pendiente",
});

const estadoOptions = [
  { label: "Pendiente", value: "pendiente" },
  { label: "En Proceso", value: "en_proceso" },
  { label: "Completado", value: "completado" },
  { label: "Rechazado", value: "rechazado" },
];

const tramiteId = computed(() => {
  const id = route.query.id;
  return typeof id === "string" ? id : "";
});

const fullName = computed(() => {
  if (!detalle.value) return "No disponible";
  const nombre = detalle.value.datos_formulario?.nombre || "";
  const apellido = detalle.value.datos_formulario?.apellido || "";
  return `${nombre} ${apellido}`.trim() || "No disponible";
});

const statusConfig = computed(() => {
  const estado = detalle.value?.estado || "pendiente";
  const label = solicitudService.formatEstado(estado);
  const color = solicitudService.getStatusColor(estado);
  return { label, color };
});

const comprobantePath = computed(() => {
  const comprobante = detalle.value?.comprobante_id as
    | { ruta_comprobante?: string }
    | undefined;
  return comprobante?.ruta_comprobante || "";
});

const downloadablePath = computed(
  () => detalle.value?.documento_final || comprobantePath.value || "",
);

const hasDownloadableDocument = computed(() => !!downloadablePath.value);
const cuentaOrigen = computed(
  () => detalle.value?.datos_formulario?.cuenta_bancaria || "N/A",
);

const normalizeFilePath = (path: string) => {
  const marker = "/uploads/";
  const index = path.indexOf(marker);
  if (index >= 0) return path.slice(index);
  if (path.startsWith("uploads/")) return `/${path}`;
  return path;
};

const formatDate = (date?: string | Date) => {
  if (!date) return "No disponible";
  return solicitudService.formatDate(String(date));
};

const formatAmount = (amount?: number) => {
  if (amount === undefined || amount === null) return "N/A";
  return `${amount} bs`;
};

const hydrateForm = () => {
  form.value = {
    observaciones: detalle.value?.observaciones || "",
    estado: detalle.value?.estado || "pendiente",
  };
};

const loadDetalle = async () => {
  if (!tramiteId.value) {
    error.value = "No se recibió el ID del trámite para mostrar el detalle.";
    return;
  }

  loading.value = true;
  error.value = null;
  try {
    detalle.value = await solicitudService.getById(tramiteId.value);
    hydrateForm();
  } catch (err) {
    console.error("Error cargando detalle admin:", err);
    error.value = "No se pudo cargar el detalle del trámite.";
  } finally {
    loading.value = false;
  }
};

const saveCambios = async () => {
  if (!tramiteId.value) return;
  saving.value = true;
  try {
    await solicitudService.updateEstado(tramiteId.value, {
      estado: form.value.estado,
      observaciones: form.value.observaciones,
    });
    await loadDetalle();
  } catch (err) {
    console.error("Error guardando cambios:", err);
    error.value = "No se pudieron guardar los cambios del trámite.";
  } finally {
    saving.value = false;
  }
};

const downloadDocumento = () => {
  if (!downloadablePath.value) return;
  const path = normalizeFilePath(downloadablePath.value);
  const url = `${import.meta.env.VITE_API_URL || ""}${path}`;
  window.open(url, "_blank");
};

const sendNotification = () => {
  // Placeholder de UX alineado al wireframe.
  console.log("TODO: integrar envío de notificaciones");
};

watch(
  () => tramiteId.value,
  () => {
    loadDetalle();
  },
  { immediate: true },
);
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}

.field-title {
  color: #6f7285;
  font-size: 1.6rem;
  line-height: 1.2;
  margin-bottom: 2px;
}

.info-grid-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.label {
  font-size: 1.3rem;
  line-height: 1.15;
  margin-bottom: 2px;
  color: #2c2d34;
  font-weight: 600;
}

.value {
  font-size: 1.2rem;
  color: #6f7285;
}

.value-link {
  color: #075e68;
  text-decoration: underline;
}

:deep(.btn-text-white .v-btn__content) {
  color: white;
  font-weight: 700;
}

@media (max-width: 960px) {
  .field-title {
    font-size: 1.15rem;
  }
}
</style>
