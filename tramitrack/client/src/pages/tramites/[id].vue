<template>
  <v-container class="px-6 pb-6 px-sm-10 pb-sm-10 bg-grey-lighten-4" style="padding-top: 13px;" fluid>
    <AppBreadcrumbs class="mb-2" />

    <!-- Loading state -->
    <v-row v-if="loading" justify="center">
      <v-col cols="12" class="text-center py-10">
        <v-progress-circular
          indeterminate
          color="primary"
          size="60"
        ></v-progress-circular>
        <p class="mt-4 text-body-1 text-grey-darken-1">
          Cargando detalles del trámite...
        </p>
      </v-col>
    </v-row>

    <!-- Error state -->
    <v-row v-else-if="error" justify="center">
      <v-col cols="12" md="6" class="text-center py-10">
        <v-icon color="error" size="60">mdi-alert-circle-outline</v-icon>
        <p class="mt-4 text-h6 font-weight-medium">{{ error }}</p>
        <v-btn
          color="primary"
          class="mt-4"
          to="/inicio"
          prepend-icon="mdi-arrow-left"
        >
          Volver al Inicio
        </v-btn>
      </v-col>
    </v-row>

    <!-- Detalle del trámite -->
    <template v-else-if="tramite">
      <v-row>
        <v-col cols="12">
          <h1 class="font-bitter text-h4 text-primary font-weight-bold mb-1">
            {{ tramite.tramiteType_id?.nombre || "Detalle del Trámite" }}
          </h1>
          <p class="text-subtitle-1 text-grey-darken-1 mb-4">
            Número de seguimiento:
            <span class="font-weight-medium">{{
              tramite.numero_seguimiento
            }}</span>
          </p>
        </v-col>
      </v-row>

      <v-divider class="mb-6"></v-divider>

      <v-row>
        <!-- Columna izquierda - Información general -->
        <v-col cols="12" md="7">
          <v-card class="rounded-lg mb-4" elevation="1">
            <v-card-item class="pb-1">
              <v-card-title
                class="font-bitter text-subtitle-1 font-weight-bold px-0 pt-0"
              >
                INFORMACIÓN GENERAL
              </v-card-title>
            </v-card-item>

            <v-card-text class="pt-1">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <p class="text-caption text-grey-darken-1 mb-0">Nombre del Trámite:</p>
                  <p class="text-body-2 font-weight-medium mb-2">
                    {{ tramite.tramiteType_id?.nombre || "No especificado" }}
                  </p>

                  <p class="text-caption text-grey-darken-1 mb-0">Vigencia:</p>
                  <p class="text-body-2 font-weight-medium mb-2">
                    {{ formatVigencia(tramite.fecha_solicitud, tramite.fecha_estimada) }}
                  </p>

                  <p class="text-caption text-grey-darken-1 mb-0">Fecha solicitada:</p>
                  <p class="text-body-2 font-weight-medium mb-0">
                    {{ formatDate(tramite.fecha_solicitud) }}
                  </p>
                </v-col>

                <v-col cols="12" sm="6">
                  <p class="text-caption text-grey-darken-1 mb-0">Requisitos:</p>
                  <p class="text-body-2">
                    {{
                      tramite.tramiteType_id?.descripcion ||
                      "Documento oficial que certifica las materias cursadas y las calificaciones obtenidas durante el período de estudios."
                    }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Información adicional del formulario -->
          <v-card
            class="rounded-lg"
            elevation="1"
            v-if="tramite.datos_formulario"
          >
            <v-card-item class="pb-1">
              <v-card-title
                class="font-bitter text-subtitle-1 font-weight-bold px-0 pt-0"
              >
                DATOS DEL FORMULARIO
              </v-card-title>
            </v-card-item>

            <v-card-text class="pt-1">
              <v-row dense>
                <v-col
                  cols="12"
                  sm="6"
                  md="4"
                  v-for="(value, key) in datosFormularioFiltrados"
                  :key="key"
                >
                  <p class="text-caption text-grey-darken-1 mb-0">
                    {{ formatLabel(key) }}:
                  </p>
                  <p class="text-body-2 font-weight-medium mb-2">
                    {{ formatValue(key, value) }}
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Columna derecha - Información, seguimiento y acciones -->
        <v-col cols="12" md="5">
          <!-- Tarjeta de información -->
          <v-card
            class="rounded-lg mb-4"
            elevation="1"
            color="primary-lighten-5"
          >
            <v-card-text>
              <div class="d-flex align-center mb-3">
                <v-avatar color="primary" size="36" class="mr-3">
                  <span class="text-white font-weight-bold text-body-2">{{
                    getInitials
                  }}</span>
                </v-avatar>
                <div>
                  <p class="text-caption text-grey-darken-1 mb-0">Estudiante</p>
                  <p class="text-body-2 font-weight-bold mb-0">
                    {{ estudianteNombre }}
                  </p>
                </div>
              </div>

              <v-divider class="my-2"></v-divider>

              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2 text-grey-darken-1">Fecha estimada:</span>
                <span class="text-body-2 font-weight-medium">{{
                  formatDate(tramite.fecha_estimada)
                }}</span>
              </div>

              <div class="d-flex justify-space-between align-center mb-1">
                <span class="text-body-2 text-grey-darken-1">Tiempo restante:</span>
                <span
                  class="text-body-2 font-weight-medium"
                  :class="tiempoRestanteColor"
                >
                  {{ calcularTiempoRestante }}
                </span>
              </div>

              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2 text-grey-darken-1">Estado actual:</span>
                <v-chip
                  :color="getStatusColor(tramite.estado)"
                  size="small"
                  class="font-weight-bold text-uppercase text-white"
                  text-color="white"
                  variant="flat"
                >
                  {{ formatEstado(tramite.estado) }}
                </v-chip>
              </div>

              <v-divider class="my-2"></v-divider>

              <!-- Acciones -->
              <div class="d-flex flex-column ga-2">
                <v-btn
                  v-if="tramite.comprobante_id"
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-download"
                  block
                  size="small"
                  @click="descargarComprobante"
                >
                  Descargar Comprobante
                </v-btn>

                <v-btn
                  v-if="tramite.documento_final && tramite.estado === 'completado'"
                  color="success"
                  variant="outlined"
                  prepend-icon="mdi-file-pdf-box"
                  block
                  size="small"
                  @click="descargarDocumentoFinal"
                >
                  Descargar Documento Final
                </v-btn>

                <v-btn
                  color="secondary"
                  variant="text"
                  prepend-icon="mdi-headset"
                  block
                  size="small"
                  href="mailto:soporte@tramitrack.com"
                >
                  Contactar Soporte
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- SEGUIMIENTO -->
          <v-card class="rounded-lg mb-4" elevation="1">
            <v-card-item class="pb-1">
              <v-card-title class="font-bitter text-subtitle-1 font-weight-bold px-0 pt-0">
                SEGUIMIENTO
              </v-card-title>
            </v-card-item>

            <v-card-text class="pt-2">
              <div class="horizontal-stepper py-1">
                <!-- Recibido -->
                <div class="stepper-step">
                  <div class="step-circle step-completed">
                    <v-icon size="16" color="white">mdi-check-bold</v-icon>
                  </div>
                  <span class="step-label">Recibido</span>
                  <span class="step-date">{{ formatDate(tramite.fecha_solicitud) }}</span>
                </div>

                <div class="step-connector" :class="{ 'connector-active': estadoProgreso.procesando.color !== 'grey' }"></div>

                <!-- Procesando -->
                <div class="stepper-step">
                  <div class="step-circle" :class="getStepCircleClass(estadoProgreso.procesando.color)">
                    <v-icon v-if="estadoProgreso.procesando.color === 'success'" size="16" color="white">mdi-check-bold</v-icon>
                    <v-icon v-else-if="estadoProgreso.procesando.color === 'error'" size="16" color="white">mdi-close-thick</v-icon>
                    <div v-else-if="estadoProgreso.procesando.color !== 'grey'" class="inner-dot"></div>
                  </div>
                  <span class="step-label">{{ estadoProgreso.procesando.color === 'error' ? 'Rechazado' : 'Procesando' }}</span>
                  <span class="step-date">{{ estadoProgreso.procesando.fecha || 'Pendiente' }}</span>
                </div>

                <div class="step-connector" :class="{ 'connector-active': estadoProgreso.listo.color !== 'grey' }"></div>

                <!-- Listo -->
                <div class="stepper-step">
                  <div class="step-circle" :class="getStepCircleClass(estadoProgreso.listo.color)">
                    <v-icon v-if="estadoProgreso.listo.color === 'success'" size="16" color="white">mdi-check-bold</v-icon>
                    <div v-else-if="estadoProgreso.listo.color !== 'grey'" class="inner-dot"></div>
                  </div>
                  <span class="step-label">Listo</span>
                  <span class="step-date">{{ estadoProgreso.listo.fecha || 'Pendiente' }}</span>
                </div>

                <div class="step-connector" :class="{ 'connector-active': estadoProgreso.entregado.color !== 'grey' }"></div>

                <!-- Entregado -->
                <div class="stepper-step">
                  <div class="step-circle" :class="getStepCircleClass(estadoProgreso.entregado.color)">
                    <v-icon v-if="estadoProgreso.entregado.color === 'success'" size="16" color="white">mdi-check-bold</v-icon>
                    <div v-else-if="estadoProgreso.entregado.color !== 'grey'" class="inner-dot"></div>
                  </div>
                  <span class="step-label">Entregado</span>
                  <span class="step-date">{{ estadoProgreso.entregado.fecha || 'Pendiente' }}</span>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Observaciones (si existen) -->
          <v-card class="rounded-lg" elevation="1" v-if="tramite.observaciones">
            <v-card-item class="pb-1">
              <v-card-title
                class="font-bitter text-subtitle-1 font-weight-bold px-0 pt-0"
              >
                OBSERVACIONES
              </v-card-title>
            </v-card-item>
            <v-card-text>
              <p class="text-body-2">{{ tramite.observaciones }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Botón volver -->
      <v-row class="mt-6">
        <v-col cols="12">
          <v-btn
            variant="outlined"
            color="primary"
            prepend-icon="mdi-arrow-left"
            to="/inicio"
          >
            Volver al Inicio
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import solicitudService from "@/services/solicitudService";
import type { TramiteResponse } from "@/services/solicitudService";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(true);
const error = ref<string | null>(null);
const tramite = ref<TramiteResponse | null>(null);

// Obtener ID de la ruta de forma segura
const tramiteId = computed(() => {
  const id = (route.params as Record<string, any>)?.id;
  if (typeof id === "string") return id;
  if (Array.isArray(id)) return id[0];
  return "";
});

// Usar métodos del servicio para formateo
const formatEstado = (estado: string) => solicitudService.formatEstado(estado);
const getStatusColor = (estado: string) =>
  solicitudService.getStatusColor(estado);
const formatDate = (date?: string) =>
  date ? solicitudService.formatDate(date) : "No disponible";

// Nombre completo del estudiante
const estudianteNombre = computed(() => {
  if (!tramite.value) return "No disponible";
  const estudiante = tramite.value.estudiante_id as any;
  if (estudiante && (estudiante.nombre || estudiante.apellido)) {
    return `${estudiante.nombre || ""} ${estudiante.apellido || ""}`.trim();
  }
  const form = tramite.value.datos_formulario as any;
  if (form && (form.nombre || form.apellido)) {
    return `${form.nombre || ""} ${form.apellido || ""}`.trim();
  }
  return "No disponible";
});

// Iniciales del estudiante
const getInitials = computed(() => {
  if (!tramite.value) return "??";
  const estudiante = tramite.value.estudiante_id as any;
  let nombre = "", apellido = "";
  if (estudiante && (estudiante.nombre || estudiante.apellido)) {
    nombre = estudiante.nombre || "";
    apellido = estudiante.apellido || "";
  } else {
    const form = tramite.value.datos_formulario as any;
    nombre = form?.nombre || "";
    apellido = form?.apellido || "";
  }
  return (nombre.charAt(0) + apellido.charAt(0)).toUpperCase() || "??";
});

// Datos del formulario filtrados (excluir campos vacíos)
const datosFormularioFiltrados = computed(() => {
  if (!tramite.value?.datos_formulario) return {};

  return Object.fromEntries(
    Object.entries(tramite.value.datos_formulario).filter(
      ([_, value]) => value !== null && value !== undefined && value !== "",
    ),
  );
});

// Formatear vigencia
const formatVigencia = (fechaSolicitud?: string, fechaEstimada?: string) => {
  if (!fechaSolicitud || !fechaEstimada) return "No disponible";
  return `${formatDate(fechaSolicitud)} - ${formatDate(fechaEstimada)}`;
};

// Formatear etiqueta de campo
const formatLabel = (key: string) => {
  const labels: Record<string, string> = {
    nombre: "Nombre",
    apellido: "Apellido",
    cedula: "Cédula",
    correo: "Correo",
    cuenta_bancaria: "Cuenta Bancaria",
    referencia_pago: "Referencia de Pago",
    monto: "Monto",
    fecha_pago: "Fecha de Pago",
  };
  return labels[key] || key;
};

// Formatear valor según el tipo
const formatValue = (key: string, value: any) => {
  if (key === "monto" && typeof value === "number") {
    return `Bs. ${value.toLocaleString()}`;
  }
  if (key === "fecha_pago" && value) {
    return formatDate(value);
  }
  return value || "No especificado";
};

// Calcular tiempo restante
const calcularTiempoRestante = computed(() => {
  if (!tramite.value?.fecha_estimada) return "No disponible";

  const hoy = new Date();
  const fechaEstimada = new Date(tramite.value.fecha_estimada);
  const diffTime = fechaEstimada.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Vencido";
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "1 día hábil";
  return `${diffDays} días hábiles`;
});

// Color del tiempo restante
const tiempoRestanteColor = computed(() => {
  if (!tramite.value?.fecha_estimada) return "";

  const hoy = new Date();
  const fechaEstimada = new Date(tramite.value.fecha_estimada);
  const diffTime = fechaEstimada.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "text-error";
  if (diffDays <= 2) return "text-warning";
  return "text-success";
});

// Definir tipo para los items del timeline
type TimelineItem = { color: string; fecha: string | null };

const getStepCircleClass = (color: string) => {
  const map: Record<string, string> = {
    success: "step-completed",
    primary: "step-active",
    warning: "step-active",
    error: "step-error",
    grey: "step-pending",
  };
  return map[color] || "step-pending";
};

// Progreso del estado para el timeline
const estadoProgreso = computed(() => {
  const estado = tramite.value?.estado;

  const progreso: {
    procesando: TimelineItem;
    listo: TimelineItem;
    entregado: TimelineItem;
  } = {
    procesando: { color: "grey", fecha: null },
    listo: { color: "grey", fecha: null },
    entregado: { color: "grey", fecha: null },
  };

  switch (estado) {
    case "en_proceso":
      progreso.procesando = {
        color: "primary",
        fecha: formatDate(tramite.value?.updatedAt),
      };
      break;
    case "completado":
      progreso.procesando = {
        color: "success",
        fecha: formatDate(tramite.value?.updatedAt),
      };
      progreso.listo = {
        color: "success",
        fecha: formatDate(tramite.value?.updatedAt),
      };
      progreso.entregado = {
        color: "success",
        fecha: formatDate(tramite.value?.updatedAt),
      };
      break;
    case "rechazado":
      progreso.procesando = {
        color: "error",
        fecha: formatDate(tramite.value?.updatedAt),
      };
      break;
    default: // pendiente
      // Todos en gris (valores iniciales)
      break;
  }

  return progreso;
});

// Descargar comprobante de pago
const descargarComprobante = () => {
  if (!tramite.value?.comprobante_id) return;
  const id =
    typeof tramite.value.comprobante_id === "string"
      ? tramite.value.comprobante_id
      : (tramite.value.comprobante_id as any)?._id;
  if (!id) return;
  const url = `${import.meta.env.VITE_API_URL || ""}/api/payment-stubs/stubFile/${id}`;
  window.open(url, "_blank");
};

// Descargar documento final del trámite
const descargarDocumentoFinal = () => {
  if (!tramite.value?.documento_final) return;
  const filePath = tramite.value.documento_final;
  const marker = "/uploads/";
  const idx = filePath.indexOf(marker);
  const normalizedPath =
    idx >= 0
      ? filePath.slice(idx)
      : filePath.startsWith("uploads/")
        ? `/${filePath}`
        : filePath;
  const url = `${import.meta.env.VITE_API_URL || ""}${normalizedPath}`;
  window.open(url, "_blank");
};

// Cargar detalle del trámite
const loadTramite = async () => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  if (!tramiteId.value) {
    error.value = "ID de trámite no proporcionado";
    loading.value = false;
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    tramite.value = await solicitudService.getById(tramiteId.value);
  } catch (err: any) {
    console.error("Error cargando trámite:", err);
    error.value =
      err.response?.data?.message || "Error al cargar los detalles del trámite";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadTramite();
});
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}

/* Horizontal stepper */
.horizontal-stepper {
  display: flex;
  align-items: flex-start;
}

.stepper-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 0 0 auto;
  min-width: 60px;
}

.step-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e0e0e0;
  border: 2px solid #bdbdbd;
}

.step-completed {
  background-color: #00535a;
  border-color: #00535a;
}

.step-active {
  background-color: #fb8c00;
  border-color: #fb8c00;
}

.step-error {
  background-color: #f44336;
  border-color: #f44336;
}

.step-pending {
  background-color: #e0e0e0;
  border-color: #bdbdbd;
}

.inner-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.9);
}

.step-connector {
  flex: 1;
  height: 2px;
  background-color: #e0e0e0;
  align-self: flex-start;
  margin-top: 17px;
  min-width: 10px;
}

.connector-active {
  background-color: #00535a;
}

.step-label {
  font-size: 0.875rem;
  font-weight: 600;
  margin-top: 8px;
  text-align: center;
}

.step-date {
  font-size: 0.75rem;
  color: #757575;
  text-align: center;
}

/* Colores personalizados */
.bg-primary-lighten-5 {
  background-color: #e8f0fe !important;
}

.text-warning {
  color: #fb8c00 !important;
}

.text-error {
  color: #f44336 !important;
}

.text-success {
  color: #4caf50 !important;
}
</style>
