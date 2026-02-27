<template>
    <v-container class="px-6 pb-6 px-sm-10 pb-sm-10 bg-grey-lighten-4" style="padding-top: 13px;" fluid>
        <AppBreadcrumbs class="mb-2" />

        <!-- Hero Header -->
        <div class="hero-header rounded-xl pa-5 mb-6 text-center">
            <div class="d-flex align-center justify-center ga-3">
                <div class="hero-icon-wrap">
                    <v-icon size="22" color="white">mdi-headset</v-icon>
                </div>
                <h1 class="font-bitter text-h5 font-weight-bold text-white">
                    Centro de Soporte
                </h1>
            </div>
            <p class="text-body-1 text-white hero-subtitle mt-2">
                Encuentra respuestas a las preguntas más frecuentes y obtén ayuda rápidamente
            </p>
        </div>

        <!-- Main layout: FAQ + Sidebar -->
        <v-row align="start">

            <!-- LEFT: FAQ + Consejos -->
            <v-col cols="12" md="8">

                <!-- FAQ Accordion -->
                <v-card class="rounded-xl mb-6" elevation="1">
                    <v-card-text class="pa-6">
                        <h2 class="font-bitter text-h5 font-weight-bold mb-5">
                            Preguntas Frecuentes
                        </h2>
                        <v-expansion-panels variant="accordion" class="faq-panels">
                            <v-expansion-panel
                                v-for="(faq, i) in faqs"
                                :key="i"
                                class="faq-item mb-2"
                            >
                                <v-expansion-panel-title class="font-bitter font-weight-medium">
                                    {{ faq.pregunta }}
                                </v-expansion-panel-title>
                                <v-expansion-panel-text class="text-grey-darken-2">
                                    {{ faq.respuesta }}
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                </v-card>

                <!-- Consejos Útiles -->
                <v-card class="rounded-xl" elevation="1">
                    <v-card-text class="pa-6">
                        <h2 class="font-bitter text-h6 font-weight-bold mb-4">
                            Consejos Útiles
                        </h2>
                        <v-row>
                            <v-col
                                cols="12" sm="6"
                                v-for="(tip, i) in consejos"
                                :key="i"
                            >
                                <div class="d-flex align-start ga-3">
                                    <div class="tip-icon-wrap flex-shrink-0">
                                        <v-icon size="18" color="primary">{{ tip.icon }}</v-icon>
                                    </div>
                                    <span class="text-body-2 text-grey-darken-2">{{ tip.texto }}</span>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>

            </v-col>

            <!-- RIGHT: Contacto + Horarios -->
            <v-col cols="12" md="4">

                <!-- ¿Necesitas más ayuda? -->
                <v-card class="rounded-xl mb-4" elevation="1">
                    <v-card-text class="pa-6">
                        <h2 class="font-bitter text-h6 font-weight-bold mb-5">
                            ¿Necesitas más ayuda?
                        </h2>

                        <!-- Correo -->
                        <a href="mailto:soporte@tramitrack.ucv.com" class="contact-link">
                            <div class="contact-item d-flex align-center ga-3 mb-4">
                                <div class="contact-icon-wrap bg-primary">
                                    <v-icon size="20" color="white">mdi-email-outline</v-icon>
                                </div>
                                <div>
                                    <div class="font-weight-bold text-body-2 text-black">Correo de Soporte</div>
                                    <div class="text-caption text-primary">soporte@tramitrack.ucv.com</div>
                                </div>
                            </div>
                        </a>

                        <!-- Teléfono -->
                        <a href="tel:+582123456789" class="contact-link">
                            <div class="contact-item d-flex align-center ga-3 mb-4">
                                <div class="contact-icon-wrap bg-secondary">
                                    <v-icon size="20" color="white">mdi-phone-outline</v-icon>
                                </div>
                                <div>
                                    <div class="font-weight-bold text-body-2 text-black">Teléfono</div>
                                    <div class="text-caption text-grey-darken-1">+58 212 345 6789</div>
                                </div>
                            </div>
                        </a>

                        <v-divider class="mb-4" />

                        <!-- Redes Sociales -->
                        <div class="font-weight-bold text-body-2 text-black mb-3">
                            <v-icon size="18" color="accent" class="mr-1">mdi-earth</v-icon>
                            Redes Sociales
                        </div>

                        <div class="d-flex align-center ga-3 mb-3">
                            <div class="social-icon-wrap bg-facebook">
                                <v-icon size="18" color="white">mdi-facebook</v-icon>
                            </div>
                            <span class="text-body-2 text-grey-darken-2">TramiTrack UCV</span>
                        </div>

                        <div class="d-flex align-center ga-3 mb-3">
                            <div class="social-icon-wrap bg-instagram">
                                <v-icon size="18" color="white">mdi-instagram</v-icon>
                            </div>
                            <span class="text-body-2 text-grey-darken-2">TramiTrack UCV</span>
                        </div>

                        <div class="d-flex align-center ga-3">
                            <div class="social-icon-wrap bg-twitter">
                                <v-icon size="18" color="white">mdi-twitter</v-icon>
                            </div>
                            <span class="text-body-2 text-grey-darken-2">TramiTrack UCV</span>
                        </div>
                    </v-card-text>
                </v-card>

                <!-- Horarios de Atención -->
                <v-card class="rounded-xl" elevation="1">
                    <v-card-text class="pa-6">
                        <h2 class="font-bitter text-h6 font-weight-bold mb-5">
                            Horarios de Atención
                        </h2>

                        <div class="d-flex align-center ga-3 mb-4">
                            <v-icon size="22" color="primary">mdi-clock-outline</v-icon>
                            <div>
                                <div class="font-weight-bold text-body-2 text-black">Soporte Técnico</div>
                                <div class="text-caption text-grey-darken-1">Lunes a Viernes: 8:00 AM - 2:00 PM</div>
                            </div>
                        </div>

                        <div class="d-flex align-center ga-3">
                            <v-icon size="22" color="secondary">mdi-clock-outline</v-icon>
                            <div>
                                <div class="font-weight-bold text-body-2 text-black">Sistema en Línea</div>
                                <div class="text-caption text-grey-darken-1">Disponible 24/7</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>

            </v-col>
        </v-row>

        <!-- Back button -->
        <div class="mt-8">
            <v-btn variant="outlined" color="primary" prepend-icon="mdi-arrow-left"
                @click="$router.push('/home')">
                Volver a Inicio
            </v-btn>
        </div>

    </v-container>
</template>

<script setup lang="ts">
import AppBreadcrumbs from "@/components/AppBreadcrumbs.vue";

const faqs = [
    {
        pregunta: "¿Qué formas de pago acepta el sistema?",
        respuesta: "El sistema acepta comprobantes de pago bancario. Debes subir una imagen clara del comprobante al momento de realizar tu solicitud de trámite."
    },
    {
        pregunta: "¿Cómo puedo hacer seguimiento a mi trámite?",
        respuesta: "Puedes hacer seguimiento desde la sección 'Mis Trámites' en la página de inicio. Allí encontrarás el estado actualizado de cada solicitud junto a su número de seguimiento."
    },
    {
        pregunta: "¿Puedo modificar mi solicitud después de enviarla?",
        respuesta: "Una vez enviada la solicitud no es posible modificarla directamente. Si necesitas realizar cambios, contacta al equipo de soporte a través del correo indicado."
    },
    {
        pregunta: "¿Qué hago si mi comprobante de pago fue rechazado?",
        respuesta: "Si tu comprobante fue rechazado, verifica que la imagen sea legible y que los datos coincidan con los requeridos. Puedes contactarnos por correo o teléfono para recibir asistencia."
    },
    {
        pregunta: "¿Cómo actualizo mi información personal?",
        respuesta: "Puedes actualizar tu información personal desde la sección 'Perfil' en el menú de usuario. Asegúrate de guardar los cambios antes de salir."
    },
];

const consejos = [
    { icon: "mdi-bookmark-outline", texto: "Guarda siempre tu número de seguimiento para consultar el estado de tu trámite." },
    { icon: "mdi-file-check-outline", texto: "Verifica que tus documentos sean legibles antes de subirlos al sistema." },
    { icon: "mdi-account-edit-outline", texto: "Mantén actualizada tu información de contacto en tu perfil." },
    { icon: "mdi-refresh", texto: "Consulta regularmente el estado de tus trámites desde la página de inicio." },
];
</script>

<style scoped>
.font-bitter {
    font-family: "Bitter", serif !important;
}

/* Hero */
.hero-header {
    background: linear-gradient(135deg, #075E68 0%, #0a8a99 60%, #0ea5b5 100%);
}

.hero-icon-wrap {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.hero-subtitle {
    opacity: 0.88;
    max-width: 560px;
    margin: 0 auto;
}

/* FAQ */
.faq-panels {
    border: none !important;
}

.faq-item {
    border: 1px solid #e0e0e0 !important;
    border-radius: 10px !important;
    overflow: hidden;
}

/* Contact */
.contact-link {
    text-decoration: none;
}

.contact-item {
    border-radius: 10px;
    padding: 8px;
    transition: background 0.18s;
    cursor: pointer;
}

.contact-item:hover {
    background: #f5f5f5;
}

.contact-icon-wrap {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

/* Social */
.social-icon-wrap {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.bg-facebook  { background: #1877F2; }
.bg-instagram { background: #E1306C; }
.bg-twitter   { background: #1DA1F2; }
.bg-primary   { background: #075E68; }
.bg-secondary { background: #F2B053; }

/* Tips */
.tip-icon-wrap {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(7, 94, 104, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
