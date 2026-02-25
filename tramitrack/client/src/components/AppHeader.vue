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
      <v-btn icon variant="text" color="primary" @click="toggleNotifications">
        <v-icon size="32">mdi-bell</v-icon>
        <v-badge
          v-if="notificationCount > 0"
          :content="notificationCount"
          color="secondary"
          floating
          location="top end"
        ></v-badge>
      </v-btn>

      <v-btn icon variant="text" color="primary" @click="router.push('/admin-profile')">
        <v-icon size="36">mdi-account-circle-outline</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const toggleNotifications = () => {
  // TODO: implementar panel de notificaciones
};
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
