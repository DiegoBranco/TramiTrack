<template>
  <v-container class="px-6 pb-6 px-sm-10 pb-sm-10 bg-grey-lighten-4" style="padding-top: 13px;" fluid>
    <AppBreadcrumbs class="mb-2" />
    
    <v-row class="align-center mb-6">
      <v-col cols="12" sm="8">
        <h1 class="font-bitter text-h3 text-primary font-weight-bold">
          Métricas y Estadísticas
        </h1>
        <p class="text-body-1 text-grey-darken-1 mt-2">
          Resumen visual del estado de todos los trámites registrados.
        </p>
      </v-col>
      <v-col cols="12" sm="4" class="text-sm-right">
        <v-btn
          color="secondary"
          prepend-icon="mdi-file-pdf-box"
          class="text-none font-weight-bold"
          size="large"
          @click="exportToPdf"
          :loading="exporting"
        >
          Exportar a PDF
        </v-btn>
      </v-col>
    </v-row>

    <!-- Contenedor que será exportado a PDF -->
    <div id="pdf-content" class="pa-2 pa-md-4 rounded" style="max-width: 850px; margin: 0 auto; background-color: transparent;">
      <v-row v-if="loading" justify="center" class="my-10">
        <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      </v-row>

      <template v-else>
        <v-row>
          <!-- Gráfico de Estados (Dona) -->
          <v-col cols="12">
            <v-card class="pa-4 rounded-lg fill-height d-flex flex-column" elevation="2">
              <v-card-title class="font-bitter text-h5 font-weight-bold text-center mb-4 text-primary">
                Trámites por Estado
              </v-card-title>
              <div class="chart-container flex-grow-1" style="position: relative; height: 350px;">
                <Doughnut v-if="chartDataEstados" :data="chartDataEstados" :options="chartOptions" />
                <p v-else class="text-center text-grey">No hay datos disponibles.</p>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4 pdf-page-break">
          <!-- Gráfico de Tipos de Trámite (Barras) -->
          <v-col cols="12">
            <v-card class="pa-4 rounded-lg fill-height d-flex flex-column" elevation="2">
              <v-card-title class="font-bitter text-h5 font-weight-bold text-center mb-4 text-primary">
                Solicitudes por Tipo
              </v-card-title>
              <div class="chart-container flex-grow-1" style="position: relative; height: 350px;">
                <Bar v-if="chartDataTipos" :data="chartDataTipos" :options="chartOptionsBar" />
                <p v-else class="text-center text-grey">No hay datos disponibles.</p>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-4 pdf-page-break">
          <!-- Gráfico a lo largo del tiempo (Línea) -->
          <v-col cols="12">
            <v-card class="pa-4 rounded-lg" elevation="2">
              <v-card-title class="font-bitter text-h5 font-weight-bold text-center mb-4 text-primary">
                Volumen de Solicitudes (Últimos 30 días)
              </v-card-title>
              <div class="chart-container" style="position: relative; height: 350px;">
                <Line v-if="chartDataTiempo" :data="chartDataTiempo" :options="chartOptions" />
                <p v-else class="text-center text-grey">No hay datos suficientes.</p>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </template>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { useAuthStore } from '@/stores/auth';

// Importaciones de Chart.js y vue-chartjs
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, PointElement, LineElement, Title, Tooltip, Legend);

const loading = ref(true);
const exporting = ref(false);
const authStore = useAuthStore();

// Datos y opciones de gráficos
const chartDataEstados = ref<any>(null);
const chartDataTipos = ref<any>(null);
const chartDataTiempo = ref<any>(null);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false as const, // Importante para la exportación PDF
  plugins: {
    legend: { position: 'bottom' as const }
  }
};

const chartOptionsBar = {
  responsive: true,
  maintainAspectRatio: false,
  animation: false as const,
  plugins: { legend: { display: false } }
};

const getEstadoConfig = (estado: string) => {
  const configs: Record<string, { label: string, color: string }> = {
    pendiente: { label: 'Pendiente', color: '#FFB74D' }, // Naranja
    en_proceso: { label: 'En Proceso', color: '#42A5F5' }, // Azul
    completado: { label: 'Completado', color: '#66BB6A' }, // Verde
    rechazado: { label: 'Rechazado', color: '#EF5350' }, // Rojo
    entregado: { label: 'Entregado', color: '#9C27B0' }, // Morado
  };
  return configs[estado.toLowerCase()] || { label: estado, color: '#9E9E9E' };
};

const cargarMetricas = async () => {
  loading.value = true;
  try {
    const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";
    const { data } = await axios.get(`${apiBaseUrl}/api/solicitudes/metricas`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });

    // Procesar datos para la Dona (Estados)
    if (data.estados && data.estados.length > 0) {
      const labels: string[] = [];
      const dataValues: number[] = [];
      const bgColors: string[] = [];
      
      data.estados.forEach((item: any) => {
        const config = getEstadoConfig(item._id);
        labels.push(config.label);
        dataValues.push(item.count);
        bgColors.push(config.color);
      });

      chartDataEstados.value = {
        labels,
        datasets: [{ data: dataValues, backgroundColor: bgColors }]
      };
    }

    // Procesar datos para las Barras (Tipos)
    if (data.tipos && data.tipos.length > 0) {
      chartDataTipos.value = {
        labels: data.tipos.map((t: any) => t._id?.nombre || 'Desconocido'),
        datasets: [{
          label: 'Cantidad',
          data: data.tipos.map((t: any) => t.count),
          backgroundColor: '#42A5F5'
        }]
      };
    }

    // Procesar datos para la Línea (Tiempo)
    if (data.tiempo && data.tiempo.length > 0) {
      chartDataTiempo.value = {
        labels: data.tiempo.map((t: any) => t._id),
        datasets: [{
          label: 'Nuevas Solicitudes',
          data: data.tiempo.map((t: any) => t.count),
          borderColor: '#FFA726',
          backgroundColor: 'rgba(255, 167, 38, 0.2)',
          tension: 0.3,
          fill: true
        }]
      };
    }

  } catch (error) {
    console.error("Error al cargar métricas:", error);
  } finally {
    loading.value = false;
  }
};

const exportToPdf = () => {
  exporting.value = true;
  
  // Pausa mínima para permitir que la UI de Vue muestre el loading del botón
  setTimeout(() => {
    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      const canvases = document.querySelectorAll('canvas');
      
      if (canvases.length < 3) {
        exporting.value = false;
        return;
      }

      // Título y Cabecera del Documento
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(22);
      doc.text('Reporte de Métricas - TramiTrack', 105, 20, { align: 'center' });
      
      doc.setFontSize(10);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 105, 28, { align: 'center' });

      // Función Helper matemática para dibujar gráficos sin desproporcionarlos
      const addScaledCanvas = (canvas: HTMLCanvasElement, x: number, y: number, maxWidth: number) => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const ratio = canvas.height / canvas.width;
        const height = maxWidth * ratio;
        doc.addImage(imgData, 'PNG', x, y, maxWidth, height);
        return height; 
      };

      // 1. Gráfico de Torta / Estados
      doc.setFontSize(14);
      doc.text('Trámites por Estado', 105, 45, { align: 'center' });
      // Dona en página 1, centrada (ancho de 100mm en vez de expandirlo a full pantalla)
      addScaledCanvas(canvases[0] as HTMLCanvasElement, 55, 52, 100);

      // 2. Gráfico de Barras / Tipos
      doc.text('Solicitudes por Tipo', 105, 160, { align: 'center' });
      // Barras abajo en página 1, más grande (ancho de 180mm usando casi todo el A4)
      addScaledCanvas(canvases[1] as HTMLCanvasElement, 15, 167, 180);

      // 3. Gráfico de Líneas / Tráfico
      // Creamos una nueva página para que respire completamente
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Volumen de Solicitudes (Últimos 30 días)', 105, 20, { align: 'center' });
      addScaledCanvas(canvases[2] as HTMLCanvasElement, 15, 30, 180);

      // Descargamos el reporte impecable
      doc.save(`Reporte_Metricas_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch(e) {
      console.error("Error generando el PDF nativo:", e);
    } finally {
      exporting.value = false;
    }
  }, 100);
};
onMounted(() => {
  cargarMetricas();
});
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}
.chart-container {
  width: 100%;
}
/* Salto de página forzado en la fila del gráfico de líneas cuando imprimimos a PDF */
.pdf-page-break {
  page-break-before: always;
}
</style>
