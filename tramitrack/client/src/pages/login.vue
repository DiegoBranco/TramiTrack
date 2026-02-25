<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card
          elevation="2"
          class="pa-6 pa-sm-10 rounded-lg"
          style="border-top: 8px solid rgb(var(--v-theme-primary))"
        >
          <div class="d-flex flex-column align-center mb-8">
            <v-img
              src="/TramitrackLogo.png"
              alt="TramiTrack Logo"
              width="60"
              height="60"
              class="mb-4"
            />
            <h1 class="logo-text text-h4">
              <span class="text-grey-darken-4">TRAMI</span>
              <span class="text-secondary">TRACK</span>
            </h1>
            <p class="text-body-2 text-grey-darken-1 mt-2">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <v-form @submit.prevent="handleLogin">
            <v-text-field
              v-model="email"
              label="Correo electrónico"
              prepend-inner-icon="mdi-email-outline"
              variant="outlined"
              color="primary"
              autocomplete="email"
              class="mb-2"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Contraseña"
              prepend-inner-icon="mdi-lock-outline"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              variant="outlined"
              color="primary"
              @click:append-inner="showPassword = !showPassword"
              class="mb-2"
            ></v-text-field>

            <div
              class="d-flex flex-column align-center justify-space-between mb-6"
            >
              <v-checkbox
                v-model="rememberMe"
                label="Recuérdame"
                color="primary"
                hide-details
                density="comfortable"
              ></v-checkbox>
              <a
                href="#"
                class="text-caption text-primary font-weight-bold text-decoration-none"
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <v-btn
              type="submit"
              color="primary"
              block
              size="large"
              class="text-none font-weight-bold rounded-pill"
              elevation="1"
            >
              Iniciar Sesión
            </v-btn>
          </v-form>

          <div class="mt-8 text-center">
            <span class="text-body-2 text-grey-darken-1">
              ¿No tienes una cuenta?
              <a
                href="#"
                class="text-secondary font-weight-bold text-decoration-none"
              >
                Regístrate
              </a>
            </span>
          </div>
        </v-card>

        <p class="text-center text-caption text-grey-darken-1 mt-6">
          &copy; 2026 TramiTrack. Todos los derechos reservados.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// Estados del formulario
const email = ref("");
const password = ref("");
const showPassword = ref(false);

const handleLogin = () => {
  // validar credenciales
  router.push("/admin-home");
};
</script>

<style scoped>
.logo-text {
  font-family: "Bitter", "Georgia", serif !important;
  font-weight: 700 !important;
  letter-spacing: -1px;
}

:deep(.v-label) {
  font-size: 0.875rem;
}

.fill-height {
  min-height: 100vh;
}
</style>
