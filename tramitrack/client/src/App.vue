<template>
  <v-app>
    <AppHeader v-if="showNavbar" />
    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AppHeader from "./components/AppHeader.vue";
import AppBreadcrumbs from "./components/AppBreadcrumbs.vue";

const route = useRoute();

// Oculta componentes en login y root
const showNavbar = computed(() => {
  return route.path !== "/login" && route.path !== "/";
});
</script>

<style>
html {
  overflow-y: auto !important;
}
</style>
