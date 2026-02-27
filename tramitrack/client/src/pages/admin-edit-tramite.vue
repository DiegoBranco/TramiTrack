<template>
  <v-container class="px-6 pb-6 px-sm-10 pb-sm-10 bg-grey-lighten-4" style="padding-top: 13px;" fluid>
    <AppBreadcrumbs class="mb-2" />

    <div v-if="loading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" size="60" width="6"></v-progress-circular>
      <p class="text-h6 mt-4 text-grey-darken-1">Cargando...</p>
    </div>

    <div v-else-if="error" class="text-center py-10">
      <v-icon icon="mdi-alert-circle" size="60" color="error"></v-icon>
      <p class="text-h6 mt-4 text-error">{{ error }}</p>
      <v-btn color="primary" variant="flat" class="mt-4" @click="fetchTramiteData">Reintentar</v-btn>
    </div>

    <template v-else>
      <header class="mb-6">
        <h1 class="font-bitter text-h4 text-grey-darken-4 font-weight-bold mb-1">
          {{ isNew ? 'Crear nuevo trámite' : `Editar ${formData.nombre || 'trámite'}` }}
        </h1>
        <p class="text-subtitle-1 text-grey-darken-1 font-weight-regular">
          Completa los datos del tipo de trámite
        </p>
      </header>

      <v-row>
        <v-col cols="12" md="8">
          <v-card class="pa-6 rounded-lg" elevation="1">
            <v-form ref="form" v-model="valid">
              <v-row>
                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-2 d-block">Nombre del trámite *</label>
                  <v-text-field v-model="formData.nombre" :rules="[rules.required]" placeholder="Ej. Constancia de Estudios" />
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-2 d-block">Método de pago *</label>
                  <v-select v-model="formData.metodoPago" :items="metodosPago" label="Seleccionar" :rules="[rules.required]" dense />
                </v-col>

                <v-col cols="12">
                  <label class="text-caption font-weight-bold mb-2 d-block">Descripción</label>
                  <v-textarea v-model="formData.descripcion" rows="4" placeholder="Descripción del trámite" />
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-2 d-block">Costo *</label>
                  <v-text-field v-model="formData.costo" type="number" :rules="[rules.required]" placeholder="0" />
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-2 d-block">Días hábiles *</label>
                  <v-text-field v-model="formData.dias_habiles" type="number" :rules="[rules.required]" placeholder="3" />
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-2 d-block">Icono (opcional)</label>
                  <v-text-field v-model="formData.icono" placeholder="mdi-file-document" />
                </v-col>

                <!-- Datos bancarios para el trámite -->
                <v-col cols="12" sm="12">
                  <h3 class="text-subtitle-2 font-weight-bold mt-4">Datos Bancarios</h3>
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-2 d-block">Banco</label>
                  <v-text-field v-model="formData.banco" placeholder="Banco de Venezuela" />
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-2 d-block">Número de Cuenta</label>
                  <v-text-field v-model="formData.numeroCuenta" placeholder="0102-0541-32-1234567890" />
                </v-col>

                <v-col cols="12" sm="6">
                  <label class="text-caption font-weight-bold mb-2 d-block">RIF</label>
                  <v-text-field v-model="formData.rif" placeholder="J-12345678-9" />
                </v-col>

                <v-col cols="12" class="mt-4">
                  <label class="text-caption font-weight-bold mb-2 d-block">Requisitos (opcional)</label>
                  <v-textarea v-model="formData.requisitos" rows="3" placeholder="Lista de requisitos o instrucciones" />
                </v-col>
              </v-row>

              <div class="d-flex justify-end ga-3 mt-6">
                <v-btn variant="flat" color="grey-lighten-2" class="text-grey-darken-2 font-weight-bold px-6 rounded-lg text-none" to="/admin-tipo-tramite">Cancelar</v-btn>
                <v-btn :color="isNew ? 'secondary' : 'primary'" class="font-weight-bold px-6 rounded-lg text-none" :loading="submitting" :disabled="!valid" @click="onSubmit">Guardar</v-btn>
              </div>
            </v-form>
          </v-card>
        </v-col>

        <v-col cols="12" md="4">
            <v-card class="pa-4 rounded-lg" elevation="1">
            <h2 class="font-bitter text-h6 font-weight-bold text-center mb-4">Vista previa</h2>
            <div class="text-caption mb-2"><strong>Nombre:</strong> {{ formData.nombre }}</div>
            <div class="text-caption mb-2"><strong>Costo:</strong> {{ formData.costo }} $</div>
            <div class="text-caption mb-2"><strong>Días:</strong> {{ formData.dias_habiles }} hábiles</div>
            <div class="text-caption mb-2"><strong>Método:</strong> {{ formData.metodoPago }}</div>
            <div class="text-caption mb-2"><strong>Banco:</strong> {{ formData.banco }}</div>
            <div class="text-caption mb-2"><strong>Número de Cuenta:</strong> {{ formData.numeroCuenta }}</div>
            <div class="text-caption mb-2"><strong>RIF:</strong> {{ formData.rif }}</div>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AppBreadcrumbs from '@/components/AppBreadcrumbs.vue';
import tramiteTypeService, { type TramiteType } from '@/services/tramiteTypeService';

const route = useRoute();
const router = useRouter();

const loading = ref(true);
const error = ref<string | null>(null);
const submitting = ref(false);
const valid = ref(false);

const isNew = computed(() => (route.query.id as string) === 'nuevo');

const metodosPago = ['Transferencia'];

const formData = ref<Partial<TramiteType & { metodoPago?: string; banco?: string; numeroCuenta?: string; rif?: string }>>({
  nombre: '',
  descripcion: '',
  requisitos: '',
  costo: 0,
  dias_habiles: 3,
  icono: '',
  metodoPago: 'Transferencia',
  banco: 'Banco de Venezuela',
  numeroCuenta: '0102-0541-32-1234567890',
  rif: 'J-12345678-9',
});

const rules = {
  required: (v: any) => (v !== null && v !== undefined && v !== '') || 'Este campo es obligatorio',
};

const fetchTramiteData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const id = route.query.id as string;
    if (id && id !== 'nuevo') {
      const data = await tramiteTypeService.getById(id);
      formData.value = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        requisitos: data.requisitos,
        costo: data.costo,
        dias_habiles: data.dias_habiles,
        icono: data.icono,
        // si el backend no tiene estos campos, se mantienen los defaults
        banco: (data as any).banco || formData.value.banco,
        numeroCuenta: (data as any).numeroCuenta || formData.value.numeroCuenta,
        rif: (data as any).rif || formData.value.rif,
      };
    } else {
      // defaults
      formData.value = {
        ...formData.value,
        icono: 'mdi-file-document',
        metodoPago: 'Transferencia',
        banco: formData.value.banco || 'Banco de Venezuela',
        numeroCuenta: formData.value.numeroCuenta || '0102-0541-32-1234567890',
        rif: formData.value.rif || 'J-12345678-9',
      };
    }
  } catch (err) {
    console.error('Error cargando tramite:', err);
    error.value = 'Error al cargar datos del trámite';
  } finally {
    loading.value = false;
  }
};

const onSubmit = async () => {
  valid.value = true;
  if (!valid.value) return;
  submitting.value = true;
  try {
    const payload: Partial<TramiteType> = {
      nombre: String(formData.value.nombre || ''),
      descripcion: String(formData.value.descripcion || ''),
      requisitos: String(formData.value.requisitos || ''),
      costo: Number(formData.value.costo || 0),
      dias_habiles: Number(formData.value.dias_habiles || 3),
      icono: String(formData.value.icono || ''),
    };

    const id = route.query.id as string;
    if (isNew.value) {
      await tramiteTypeService.create(payload);
    } else if (id) {
      await tramiteTypeService.update(id, payload);
    }

    router.push('/admin-tipo-tramite');
  } catch (err) {
    console.error('Error guardando tramite:', err);
    error.value = 'Error al guardar el trámite';
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchTramiteData();
});
</script>

<style scoped>
.font-bitter { font-family: "Bitter", serif !important; }
</style>
