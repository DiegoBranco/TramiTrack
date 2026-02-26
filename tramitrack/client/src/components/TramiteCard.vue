<script setup lang="ts">
interface Props {
  title: string;
  description: string;
  icon: string;
  iconBgColor?: string;
  meta?: string;
}

defineProps<Props>();

defineEmits<{
  (e: "click"): void;
}>();
</script>

<template>
  <v-card
    class="pa-6 rounded-xl fill-height d-flex flex-column custom-card"
    elevation="0"
  >
    <v-avatar
      :color="iconBgColor || '#00535a'"
      rounded="lg"
      size="44"
      class="mb-6"
    >
      <v-icon :icon="icon" size="24" color="white"></v-icon>
    </v-avatar>

    <h3
      class="font-bitter text-h6 font-weight-bold mb-2 text-grey-darken-4 leading-tight"
    >
      {{ title }}
    </h3>

    <p class="text-body-2 text-grey-darken-1 mb-6 flex-grow-1 card-description">
      {{ description }}
    </p>

    <div class="d-flex align-center justify-space-between mt-auto">
      <div v-if="meta">
        <v-chip
          size="small"
          variant="flat"
          color="grey-lighten-4"
          class="text-grey-darken-1 font-weight-medium"
        >
          {{ meta }}
        </v-chip>
      </div>

      <slot name="actions">
        <v-btn
          color="primary"
          variant="flat"
          class="text-none px-6 font-weight-bold rounded-md"
          @click="$emit('click')"
        >
          Solicitar
        </v-btn>
      </slot>
    </div>
  </v-card>
</template>

<style scoped>
.custom-card {
  border: 1.5px dashed #90caf9 !important;
  background-color: white !important;
  transition: all 0.2s ease;
  max-width: 350px;
}

.custom-card:hover {
  transform: translateY(-4px);
  border-style: solid !important;
}

.leading-tight {
  line-height: 1.25rem;
}

.font-bitter {
  font-family: "Bitter", serif !important;
}
</style>
