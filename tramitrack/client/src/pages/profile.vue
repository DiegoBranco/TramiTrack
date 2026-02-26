<template>
  <v-container class="pa-6 pa-sm-10 bg-grey-lighten-4" fluid>
    <AppBreadcrumbs class="mb-4" />

    <h1 class="font-bitter text-h3 font-weight-bold mb-6">
      Perfil de usuario
    </h1>

    <v-card class="rounded-lg pa-8 mx-auto" max-width="700" elevation="1">
      <div class="d-flex justify-center mb-6">
        <v-avatar size="120" color="blue-grey-lighten-3">
          <v-icon size="80" color="blue-grey-lighten-1">mdi-account</v-icon>
        </v-avatar>
      </div>

      <h2 class="text-center text-subtitle-1 font-weight-bold text-uppercase mb-6">
        Información General
      </h2>

      <v-row>
        <v-col cols="12" sm="6">
          <p class="text-caption font-weight-bold mb-1">Nombre</p>
          <v-text-field
            :model-value="auth.user?.nombre"
            variant="outlined"
            density="compact"
            readonly
            hide-details
            class="mb-4"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <p class="text-caption font-weight-bold mb-1">Apellido</p>
          <v-text-field
            :model-value="auth.user?.apellido"
            variant="outlined"
            density="compact"
            readonly
            hide-details
            class="mb-4"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <p class="text-caption font-weight-bold mb-1">Rol</p>
          <v-text-field
            :model-value="auth.user?.rol"
            variant="outlined"
            density="compact"
            readonly
            hide-details
            class="mb-4"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <p class="text-caption font-weight-bold mb-1">Correo Electrónico</p>
          <v-text-field
            :model-value="auth.user?.correo"
            variant="outlined"
            density="compact"
            readonly
            hide-details
            class="mb-4"
          />
        </v-col>
      </v-row>
    </v-card>

    <div class="mt-6 d-flex justify-space-between">
      <v-btn
        variant="outlined"
        color="primary"
        prepend-icon="mdi-arrow-left"
        @click="router.push(auth.isAdmin ? '/admin-home' : '/home')"
      >
        Volver a Inicio
      </v-btn>
      <v-btn
        variant="outlined"
        color="error"
        prepend-icon="mdi-logout"
        @click="handleLogout"
      >
        Cerrar sesión
      </v-btn>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

function handleLogout() {
  auth.logout();
  router.push("/login");
}
</script>

<style scoped>
.font-bitter {
  font-family: "Bitter", serif !important;
}
</style>
