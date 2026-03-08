<template>
  <v-app-bar
    color="surface"
    elevation="1"
    height="80"
    class="px-4 px-sm-8"
    style="border-bottom: 5px solid #075e68 !important"
  >
    <router-link to="/" class="d-flex align-center ga-3 text-decoration-none">
      <v-img
        src="/TramitrackLogo.png"
        alt="TramiTrack Logo"
        width="50"
        height="50"
        class="flex-shrink-0"
      />
      <span class="logo-text text-h4 text-sm-h3">
        <span class="text-grey-darken-4">TRAMI</span>
        <span class="text-secondary">TRACK</span>
      </span>
    </router-link>

    <v-spacer />

    <div class="d-flex align-center ga-4 ga-sm-6 flex-shrink-0">
      <!-- Panel de notificaciones con activator en el botón -->
      <v-menu
        v-model="notificationsMenu"
        :close-on-content-click="false"
        location="bottom end"
        offset="5"
      >
        <template v-slot:activator="{ props }">
          <v-btn icon variant="text" color="primary" v-bind="props">
            <v-icon size="32">mdi-bell</v-icon>
            <v-badge
              v-if="notificationCount > 0"
              :content="notificationCount"
              color="secondary"
              floating
              location="top end"
            ></v-badge>
          </v-btn>
        </template>

        <v-card min-width="300" max-width="400">
          <v-card-title class="d-flex align-center py-3">
            <span class="text-h6">Notificaciones</span>
            <v-spacer></v-spacer>
            <v-btn
              icon="mdi-close"
              variant="text"
              size="small"
              @click="notificationsMenu = false"
            ></v-btn>
          </v-card-title>

          <v-divider></v-divider>

          <!-- Contenido vacío por ahora -->
          <v-card-text class="text-center py-6">
            <v-icon size="48" color="grey-lighten-1" class="mb-2"
              >mdi-bell-outline</v-icon
            >
            <p class="text-body-1 text-grey-darken-1">
              No tienes notificaciones
            </p>
            <p class="text-caption text-grey"></p>
          </v-card-text>
        </v-card>
      </v-menu>

      <v-btn icon variant="text" color="primary" @click="goToProfile">
        <v-icon size="36">mdi-account-circle-outline</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const auth = useAuthStore();

// Estado para controlar el menú de notificaciones
const notificationsMenu = ref(false);

// Número de notificaciones (por ahora siempre 0)
const notificationCount = ref(0);

function goToProfile() {
  router.push("/profile");
}
</script>

<style scoped>
.logo-text {
  font-family: "Bitter", "Georgia", "Times New Roman", serif !important;
  font-weight: 600;
  letter-spacing: -0.5px;
}
.v-icon {
  opacity: 1;
}
</style>
