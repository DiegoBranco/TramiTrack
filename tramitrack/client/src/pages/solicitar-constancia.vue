<template>
  <v-container class="px-6 pb-6 px-sm-10 pb-sm-10 bg-grey-lighten-4" style="padding-top: 13px;" fluid>
    <app-breadcrumbs class="mb-2" />

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <v-progress-circular
        indeterminate
        color="primary"
        size="60"
        width="6"
      ></v-progress-circular>
      <p class="text-h6 mt-4 text-grey-darken-1">
        Cargando datos del trámite...
      </p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-10">
      <v-icon icon="mdi-alert-circle" size="60" color="error"></v-icon>
      <p class="text-h6 mt-4 text-error">{{ error }}</p>
      <v-btn
        color="primary"
        variant="flat"
        class="mt-4"
        @click="fetchTramiteData"
      >
        Reintentar
      </v-btn>
    </div>

    <!-- Content -->
    <template v-else>
      <header class="mb-6">
        <h1
          class="font-bitter text-h4 text-grey-darken-4 font-weight-bold mb-1"
        >
          Solicitar {{ tramiteData?.nombre || nombreTramite }}
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 font-weight-regular">
          Completa el formulario con tus datos para procesar tu solicitud
        </p>
      </header>

      <v-row>
        <v-col cols="12" md="4" lg="3">
          <!-- Card de Requisitos -->
          <v-card class="pa-4 rounded-lg mb-4" elevation="1">
            <h2 class="font-bitter text-h6 font-weight-bold text-center mb-4">
              REQUISITOS
            </h2>

            <div class="mb-4">
              <p class="text-body-2 font-weight-bold mb-1">
                Subir el comprobante de pago
              </p>
              <p class="text-h6 text-primary font-weight-bold">
                Monto a pagar : {{ tramiteData?.costo || 10 }}$
              </p>
            </div>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item class="px-0 mb-4" min-height="40">
                <template v-slot:prepend>
                  <v-avatar color="accent" size="28" class="mr-2">
                    <v-icon size="16" color="white">mdi-clock-outline</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption font-weight-bold"
                  >Tiempo de procesamiento</v-list-item-title
                >
                <v-list-item-subtitle class="text-caption"
                  >{{ tramiteData?.dias_habiles || 3 }} días
                  hábiles</v-list-item-subtitle
                >
              </v-list-item>
            </v-list>

            <v-alert
              color="info"
              variant="tonal"
              class="rounded-lg"
              border="start"
              density="compact"
            >
              <template v-slot:prepend>
                <v-icon color="info" size="small"
                  >mdi-information-outline</v-icon
                >
              </template>
              <div class="text-caption font-weight-bold mb-1">
                Información importante
              </div>
              <div
                class="text-caption text-grey-darken-2"
                style="line-height: 1.2"
              >
                Una vez enviada tu solicitud, recibirás un número de seguimiento
                por correo. El tiempo de procesamiento estimado es de
                {{ tramiteData?.dias_habiles || 3 }} días hábiles.
              </div>
            </v-alert>
          </v-card>

          <!-- Card: Datos Bancarios -->
          <v-card class="pa-4 rounded-lg" elevation="1">
            <h2 class="font-bitter text-h6 font-weight-bold text-center mb-4">
              DATOS BANCARIOS
            </h2>

            <v-list density="compact" class="bg-transparent pa-0">
              <v-list-item class="px-0 mb-3" min-height="36">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="28" class="mr-2">
                    <v-icon size="16" color="white">mdi-bank</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption font-weight-bold"
                  >Banco</v-list-item-title
                >
                <v-list-item-subtitle class="text-caption font-weight-medium"
                  >Banco de Venezuela</v-list-item-subtitle
                >
              </v-list-item>

              <v-list-item class="px-0 mb-3" min-height="36">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="28" class="mr-2">
                    <v-icon size="16" color="white">mdi-credit-card</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption font-weight-bold"
                  >Número de Cuenta</v-list-item-title
                >
                <v-list-item-subtitle class="text-caption font-weight-medium"
                  >0102-0541-32-1234567890</v-list-item-subtitle
                >
              </v-list-item>

              <v-list-item class="px-0" min-height="36">
                <template v-slot:prepend>
                  <v-avatar color="primary" size="28" class="mr-2">
                    <v-icon size="16" color="white"
                      >mdi-card-account-details</v-icon
                    >
                  </v-avatar>
                </template>
                <v-list-item-title class="text-caption font-weight-bold"
                  >RIF</v-list-item-title
                >
                <v-list-item-subtitle class="text-caption font-weight-medium"
                  >J-12345678-9</v-list-item-subtitle
                >
              </v-list-item>
            </v-list>

            <v-divider class="my-3"></v-divider>

            <p class="text-caption text-grey-darken-2 text-center">
              Realiza el pago en esta cuenta y adjunta el comprobante
            </p>
          </v-card>
        </v-col>

        <v-col cols="12" md="8" lg="9">
          <v-card class="pa-6 rounded-lg" elevation="1">
            <v-form ref="form" v-model="valid">
              <v-row dense>
                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Nombre *</label
                  >
                  <v-text-field
                    v-model="formData.nombre"
                    placeholder="Ingresa tu nombre"
                    variant="solo-filled"
                    flat
                    density="compact"
                    hide-details="auto"
                    class="mt-0"
                    :rules="[rules.required]"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Apellido *</label
                  >
                  <v-text-field
                    v-model="formData.apellido"
                    placeholder="Ingresa tu apellido"
                    variant="solo-filled"
                    flat
                    density="compact"
                    hide-details="auto"
                    class="mt-0"
                    :rules="[rules.required]"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Cédula de Identidad *</label
                  >
                  <v-text-field
                    v-model="formData.cedula"
                    placeholder="12345678"
                    variant="solo-filled"
                    flat
                    density="compact"
                    hide-details="auto"
                    class="mt-0"
                    :rules="[rules.required]"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Correo Electrónico *</label
                  >
                  <v-text-field
                    v-model="formData.correo"
                    placeholder="nombre@ejemplo.com"
                    variant="solo-filled"
                    flat
                    density="compact"
                    hide-details="auto"
                    class="mt-0"
                    :rules="[rules.required, rules.email]"
                    readonly
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Cuenta Bancaria de origen *</label
                  >
                  <v-text-field
                    v-model="formData.cuentaOrigen"
                    placeholder="091052507122"
                    variant="solo-filled"
                    flat
                    density="compact"
                    hide-details="auto"
                    class="mt-0"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Nro. de Referencia de pago *</label
                  >
                  <v-text-field
                    v-model="formData.referenciaPago"
                    placeholder="091052507122"
                    variant="solo-filled"
                    flat
                    density="compact"
                    hide-details="auto"
                    class="mt-0"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Fecha del pago *</label
                  >
                  <v-text-field
                    v-model="formData.fechaPago"
                    type="date"
                    variant="solo-filled"
                    flat
                    density="compact"
                    hide-details="auto"
                    class="mt-0"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Monto *</label
                  >
                  <v-text-field
                    v-model="formData.monto"
                    placeholder="1850"
                    variant="solo-filled"
                    flat
                    density="compact"
                    hide-details="auto"
                    class="mt-0"
                    :rules="[rules.required, rules.numeric]"
                  ></v-text-field>
                </v-col>

                <v-col cols="12" class="mt-4">
                  <label class="text-caption font-weight-bold mb-4 mt-4 d-block"
                    >Comprobante de Pago *</label
                  >
                  <v-file-input
                    v-model="formData.comprobante"
                    label="Arrastra el archivo aquí o haz clic para seleccionar"
                    variant="outlined"
                    prepend-icon=""
                    prepend-inner-icon="mdi-upload"
                    class="mt-0 file-input-custom"
                    persistent-placeholder
                    accept=".png,.jpg,.jpeg,.pdf"
                    :rules="[rules.required]"
                    hint="PNG, JPG o PDF (máx. 5MB)"
                    persistent-hint
                    density="compact"
                    hide-details="auto"
                  ></v-file-input>
                </v-col>
              </v-row>

              <div class="d-flex justify-end ga-3 mt-6">
                <v-btn
                  variant="flat"
                  color="grey-lighten-2"
                  class="text-grey-darken-2 font-weight-bold px-6 rounded-lg text-none"
                  to="/tipo-tramite"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  variant="flat"
                  color="primary"
                  class="font-weight-bold px-6 rounded-lg text-none"
                  :loading="submitting"
                  :disabled="!valid"
                  @click="enviarSolicitud"
                >
                  Enviar Solicitud
                </v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import tramiteTypeService, {
  type TramiteType,
} from "@/services/tramiteTypeService";
import solicitudService, {
  type SolicitudPayload,
} from "@/services/solicitudService";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

// Actualizar la interfaz User en el store para incluir cédula
const userWithCedula = authStore.user as typeof authStore.user & {
  cedula?: number;
};

// Estados
const valid = ref(false);
const submitting = ref(false);
const loading = ref(true);
const error = ref<string | null>(null);
const tramiteData = ref<TramiteType | null>(null);
const form = ref(null);

// Datos del formulario
const formData = ref({
  nombre: authStore.user?.nombre?.split(" ")[0] || "",
  apellido: authStore.user?.apellido || "",
  cedula: userWithCedula?.cedula?.toString() || "",
  correo: authStore.user?.correo || "",
  cuentaOrigen: "",
  referenciaPago: "",
  fechaPago: new Date().toISOString().split("T")[0],
  monto: "",
  comprobante: null as File | null,
});

// Reglas de validación
const rules = {
  required: (value: any) => !!value || "Este campo es obligatorio",
  email: (value: string) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(value) || "Correo electrónico inválido";
  },
  numeric: (value: string) => {
    return /^\d+$/.test(value) || "Solo números";
  },
};

// Nombre del trámite desde query params
const nombreTramite = computed(
  () => route.query.nombre || "Constancia de Estudios",
);

// Cargar datos del trámite
const fetchTramiteData = async () => {
  loading.value = true;
  error.value = null;

  try {
    const tramiteId = route.query.id as string;
    if (tramiteId) {
      tramiteData.value = await tramiteTypeService.getById(tramiteId);
    }
  } catch (err) {
    error.value = "Error al cargar los datos del trámite";
    console.error("Error fetching tramite:", err);
  } finally {
    loading.value = false;
  }
};

// Enviar solicitud
const enviarSolicitud = async () => {
  if (!valid.value) return;

  submitting.value = true;

  try {
    const payload: SolicitudPayload = {
      estudiante_id: authStore.user?._id || "",
      tramiteType_id: route.query.id as string,
      datos_formulario: {
        nombre: formData.value.nombre,
        apellido: formData.value.apellido,
        cedula: formData.value.cedula,
        correo: formData.value.correo,
        cuenta_bancaria: formData.value.cuentaOrigen,
        referencia_pago: formData.value.referenciaPago,
        monto: Number(formData.value.monto),
        fecha_pago: formData.value.fechaPago!,
      },
    };

    const result = await solicitudService.create(
      payload,
      formData.value.comprobante || undefined,
    );

    // Redirigir a página de éxito o seguimiento
    router.push({
      path: "/seguimiento",
      query: { id: result._id },
    });
  } catch (err) {
    console.error("Error enviando solicitud:", err);
    error.value = "Error al enviar la solicitud. Por favor, intenta de nuevo.";
  } finally {
    submitting.value = false;
  }
};

// Verificar autenticación
onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push("/login");
    return;
  }

  fetchTramiteData();
});
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}

/* Estilo para que los campos se parezcan al wireframe (grises y sin bordes fuertes) */
:deep(.v-field--variant-solo-filled) {
  background: #f0f2f5 !important;
  border-radius: 6px !important;
  min-height: 40px !important;
}

:deep(.v-field--variant-solo-filled .v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
  font-size: 0.875rem !important;
  min-height: 40px !important;
}

/* Estilo para el file input - corregido */
:deep(.file-input-custom .v-field--variant-outlined) {
  border-radius: 6px !important;
}

:deep(.file-input-custom .v-field__outline) {
  --v-field-border-width: 1px;
  border: 1px dashed #b0bec5 !important;
  border-radius: 6px !important;
}

:deep(.file-input-custom .v-field--focused .v-field__outline) {
  border: 2px dashed #00535a !important;
}

:deep(.file-input-custom .v-field__input) {
  min-height: 40px !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  font-size: 0.875rem !important;
}

:deep(.file-input-custom .v-field__prepend-inner) {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

/* Estilo para el hint/mensaje de ayuda */
:deep(.file-input-custom .v-messages) {
  font-size: 0.75rem !important;
  min-height: 16px !important;
  padding-top: 2px !important;
}

/* Eliminar bordes duplicados */
:deep(.file-input-custom .v-field--variant-outlined .v-field__outline__start),
:deep(.file-input-custom .v-field--variant-outlined .v-field__outline__end),
:deep(.file-input-custom .v-field--variant-outlined .v-field__outline__notch) {
  border: none !important;
}

/* Estilo para campos readonly */
:deep(.v-field--variant-solo-filled .v-field__input[readonly]) {
  color: rgba(0, 0, 0, 0.87);
  font-weight: 500;
}

/* Reducir espaciado entre campos */
.v-col {
  padding-bottom: 8px !important;
}

/* Ajustar etiquetas */
.d-block {
  display: block;
  line-height: 1.2;
  margin-bottom: 2px !important;
}

/* Reducir padding del card principal */
:deep(.v-card.pa-6) {
  padding: 20px !important;
}

/* Ajustar altura de los botones */
.v-btn.size-small {
  height: 36px !important;
}
</style>
