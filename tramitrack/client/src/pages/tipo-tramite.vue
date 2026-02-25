<template>
  <v-container class="pa-6 pa-sm-10 bg-grey-lighten-4" fluid>
    <AppBreadcrumbs class="mb-4" />
    <header class="mb-10">
      <h1 class="font-bitter text-h3 text-grey-darken-4 font-weight-bold mb-2">
        Tipos de Trámites
      </h1>
      <p class="text-h6 text-grey-darken-1 font-weight-regular">
        Selecciona el tipo de trámite que deseas solicitar
      </p>
    </header>

    <v-row>
      <v-col
        v-for="tramite in listaTramites"
        :key="tramite.id"
        cols="12"
        sm="6"
        md="4"
      >
        <TramiteCard
          :title="tramite.titulo"
          :description="tramite.descripcion"
          :icon="tramite.icon"
          :meta="tramite.tiempo"
          :iconBgColor="tramite.color"
        >
          <template #actions>
            <v-btn
              color="primary"
              variant="flat"
              class="text-none px-6 rounded-pill font-weight-bold"
              @click="irASolicitud(tramite)"
            >
              Solicitar
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
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import TramiteCard from "@/components/TramiteCard.vue";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";

const router = useRouter();

// Datos basados en tus imágenes (Estudiante)
const listaTramites = [
  {
    id: "estudios",
    titulo: "Constancias de Estudios",
    descripcion:
      "Documento oficial que certifica las materias que estás cursando actualmente.",
    icon: "mdi-certificate",
    tiempo: "3-5 días",
    color: "primary", //
  },
  {
    id: "inscripcion",
    titulo: "Constancia de Inscripción",
    descripcion:
      "Documento que certifica tu inscripción actual en la institución.",
    icon: "mdi-file-check",
    tiempo: "2-3 días",
    color: "secondary",
  },
  {
    id: "notas",
    titulo: "Constancia de Notas",
    descripcion:
      "Documento oficial que certifica las materias cursadas y sus respectivas calificaciones.",
    icon: "mdi-book-open-variant",
    tiempo: "5-10 días",
    color: "accent",
  },
];

const irASolicitud = (tramite: any) => {
  // Pasamos el ID y el nombre por query
  router.push({
    path: "/solicitar-constancia",
    query: {
      id: tramite.id,
      nombre: tramite.titulo,
    },
  });
};
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}
</style>
