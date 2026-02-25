<template>
  <v-card class="pa-5 rounded-lg fill-height d-flex flex-column" elevation="2">
    <v-avatar
      :color="iconBgColor || 'primary'"
      variant="tonal"
      rounded="lg"
      size="48"
      class="mb-4"
    >
      <v-icon :icon="icon" size="28"></v-icon>
    </v-avatar>

    <h3 class="font-bitter text-h6 font-weight-bold mb-2 line-clamp-2">
      {{ title }}
    </h3>

    <p class="text-body-2 text-grey-darken-1 mb-4 flex-grow-1">
      {{ description }}
    </p>

    <div v-if="meta" class="mb-4">
      <v-chip
        size="x-small"
        variant="flat"
        color="grey-lighten-3"
        class="text-grey-darken-2"
      >
        {{ meta }}
      </v-chip>
    </div>

    <div class="d-flex justify-end mt-auto">
      <slot name="actions">
        <v-btn
          color="primary"
          variant="flat"
          class="text-none px-6 rounded-pill"
          @click="$emit('click')"
        >
          Ver
        </v-btn>
      </slot>
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  icon: string;
  iconBgColor?: string;
  meta?: string; // Ej: "3-5 días"
}>();

defineEmits(["click"]);
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
