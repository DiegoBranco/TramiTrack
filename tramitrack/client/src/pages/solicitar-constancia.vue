<template>
  <v-container class="pa-6 pa-sm-10 bg-grey-lighten-4" fluid>
    <app-breadcrumbs class="mb-4" />
    <header class="mb-8">
      <h1 class="font-bitter text-h3 text-grey-darken-4 font-weight-bold mb-2">
        Solicitar {{ nombreTramite }}
      </h1>
      <p class="text-h6 text-grey-darken-1 font-weight-regular">
        Completa el formulario con tus datos para procesar tu solicitud
      </p>
    </header>

    <v-row>
      <v-col cols="12" md="4" lg="3">
        <v-card class="pa-6 rounded-lg fill-height" elevation="1">
          <h2 class="font-bitter text-h5 font-weight-bold text-center mb-6">
            REQUISITOS
          </h2>

          <div class="mb-6">
            <p class="text-subtitle-1 font-weight-bold mb-1">
              Subir el comprobante de pago
            </p>
            <p class="text-h6 text-primary font-weight-bold">
              Monto a pagar : 10$
            </p>
          </div>

          <v-list density="compact" class="bg-transparent pa-0">
            <v-list-item class="px-0 mb-2">
              <template v-slot:prepend>
                <v-avatar color="secondary" size="32" class="mr-3">
                  <v-icon size="18" color="white">mdi-calendar-clock</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-bold"
                >Fecha estimada</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption"
                >22/02/2026</v-list-item-subtitle
              >
            </v-list-item>

            <v-list-item class="px-0 mb-6">
              <template v-slot:prepend>
                <v-avatar color="accent" size="32" class="mr-3">
                  <v-icon size="18" color="white">mdi-clock-outline</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="text-body-2 font-weight-bold"
                >Tiempo restante</v-list-item-title
              >
              <v-list-item-subtitle class="text-caption"
                >3-5 días hábiles</v-list-item-subtitle
              >
            </v-list-item>
          </v-list>

          <v-alert
            color="info"
            variant="tonal"
            class="rounded-lg"
            border="start"
          >
            <template v-slot:prepend>
              <v-icon color="info">mdi-information-outline</v-icon>
            </template>
            <div class="text-caption font-weight-bold mb-1">
              Información importante
            </div>
            <div
              class="text-caption text-grey-darken-2"
              style="line-height: 1.2"
            >
              Una vez enviada tu solicitud, recibirás un número de seguimiento
              por correo. El tiempo de procesamiento estimado es de 3-5 días
              hábiles.
            </div>
          </v-alert>
        </v-card>
      </v-col>

      <v-col cols="12" md="8" lg="9">
        <v-card class="pa-8 pa-sm-10 rounded-lg" elevation="1">
          <v-form ref="form" v-model="valid">
            <v-row dense>
              <v-col cols="12" sm="6">
                <label class="text-subtitle-2 font-weight-bold">Nombre *</label>
                <v-text-field
                  placeholder="Ingresa tu nombre"
                  variant="solo-filled"
                  flat
                  density="comfortable"
                  class="mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="text-subtitle-2 font-weight-bold"
                  >Apellido *</label
                >
                <v-text-field
                  placeholder="Ingresa tu apellido"
                  variant="solo-filled"
                  flat
                  density="comfortable"
                  class="mt-1"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <label class="text-subtitle-2 font-weight-bold"
                  >Cédula de Identidad *</label
                >
                <v-text-field
                  placeholder="V-12345678"
                  variant="solo-filled"
                  flat
                  density="comfortable"
                  class="mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="text-subtitle-2 font-weight-bold"
                  >Correo Electrónico *</label
                >
                <v-text-field
                  placeholder="nombre@ejemplo.com"
                  variant="solo-filled"
                  flat
                  density="comfortable"
                  class="mt-1"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <label class="text-subtitle-2 font-weight-bold"
                  >Cuenta Bancaria de origen *</label
                >
                <v-text-field
                  placeholder="091052507122"
                  variant="solo-filled"
                  flat
                  density="comfortable"
                  class="mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="text-subtitle-2 font-weight-bold"
                  >Nro. de Referencia de pago *</label
                >
                <v-text-field
                  placeholder="091052507122"
                  variant="solo-filled"
                  flat
                  density="comfortable"
                  class="mt-1"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <label class="text-subtitle-2 font-weight-bold"
                  >Fecha del pago *</label
                >
                <v-text-field
                  type="date"
                  variant="solo-filled"
                  flat
                  density="comfortable"
                  class="mt-1"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <label class="text-subtitle-2 font-weight-bold">Monto *</label>
                <v-text-field
                  placeholder="1850"
                  variant="solo-filled"
                  flat
                  density="comfortable"
                  class="mt-1"
                ></v-text-field>
              </v-col>

              <v-col cols="12" class="mt-4">
                <label class="text-subtitle-2 font-weight-bold"
                  >Comprobante de Pago *</label
                >
                <v-file-input
                  label="Arrastra el archivo aquí o haz clic para seleccionar"
                  variant="outlined"
                  prepend-icon=""
                  prepend-inner-icon="mdi-upload"
                  class="mt-2 border-dashed"
                  persistent-placeholder
                  hint="PNG, JPG o PDF (máx. 5MB)"
                  persistent-hint
                ></v-file-input>
              </v-col>
            </v-row>

            <div class="d-flex justify-end ga-4 mt-10">
              <v-btn
                variant="flat"
                color="accent-lighten-4"
                class="text-accent font-weight-bold px-8 rounded-lg text-none"
                size="large"
                to="/tipo-tramite"
              >
                Cancelar
              </v-btn>
              <v-btn
                variant="flat"
                color="primary"
                class="font-weight-bold px-8 rounded-lg text-none"
                size="large"
              >
                Enviar Solicitud
              </v-btn>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Ahora 'valid' es reactivo. Vue ya puede escribir en él.
const valid = ref(false);

// El nombre del trámite se extrae de la URL
const nombreTramite = computed(
  () => route.query.nombre || "Constancia de Estudios",
);

// Referencia al formulario para disparar validaciones manualmente si quieres
const form = ref(null);

// Reglas básicas (opcional, pero recomendado para que v-model="valid" tenga sentido)
const rules = {
  required: (value: any) => !!value || "Este campo es obligatorio.",
};
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}

/* Estilo para que los campos se parezcan al wireframe (grises y sin bordes fuertes) */
:deep(.v-field--variant-solo-filled) {
  background: #f0f2f5 !important;
  border-radius: 8px !important;
}

/* Simular el área de drop con bordes punteados */
.border-dashed :deep(.v-field__outline) {
  border-style: dashed !important;
  border-width: 2px !important;
}
</style>
