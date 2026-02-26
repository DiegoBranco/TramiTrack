<template>
    <v-container class="pa-6 pa-sm-10 bg-grey-lighten-4" fluid>
        <AppBreadcrumbs class="mb-4" />
        <div class="title d-flex flex-column align-center mb-8">
            <h1 class="font-bitter text-h3 text-black font-weight-bold mb-6">
                Contacto y Soporte
            </h1>
            <h6 class="font-bitter text-h6 text-gray">Obtén ayuda rápidamente, estamos aquí para ti</h6>
        </div>

        <v-row class="mb-10" justify="center">
            <v-col cols="12" sm="6" md="4">
                <v-card
                    class="email-cont card-hover pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
                    elevation="1">

                    <h2 class="font-bitter text-h5 font-weight-bold mb-1">
                        <v-icon color="primary" size="35" class="mb-2">mdi-email-outline</v-icon>
                        Correo de soporte
                    </h2>
                    <a href="mailto:soporte@tramitrack.ucv.com" class="font-bitter text-success font-weight-bold mb-1">
                        soporte@tramitrack.ucv.com
                    </a>

                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
                <v-card
                    class="email-cont card-hover pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
                    elevation="1">

                    <h2 class="font-bitter text-h5 font-weight-bold mb-1">
                        <svg class="text-primary" xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                            viewBox="0 0 24 24">
                            <path fill="currentColor"
                                d="M19 12q0-2.925-2.037-4.962T12 5V3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12zm-4 0q0-1.25-.875-2.125T12 9V7q2.075 0 3.538 1.463T17 12zm4.95 9q-3.125 0-6.175-1.362t-5.55-3.863t-3.862-5.55T3 4.05q0-.45.3-.75t.75-.3H8.1q.35 0 .625.238t.325.562l.65 3.5q.05.4-.025.675T9.4 8.45L6.975 10.9q.5.925 1.187 1.787t1.513 1.663q.775.775 1.625 1.438T13.1 17l2.35-2.35q.225-.225.588-.337t.712-.063l3.45.7q.35.1.575.363T21 15.9v4.05q0 .45-.3.75t-.75.3M6.025 9l1.65-1.65L7.25 5H5.025q.125 1.025.35 2.025T6.025 9m8.95 8.95q.975.425 1.988.675T19 18.95v-2.2l-2.35-.475zm0 0" />
                        </svg>
                        Teléfono de soporte
                    </h2>
                    <a href="tel:+582123456789" class="font-bitter text-success font-weight-bold mb-1">
                        +58 212 345 6789
                    </a>

                </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="4">
                <v-card
                    class="email-cont card-hover pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
                    elevation="1">

                    <h2 class="font-bitter text-h5 font-weight-bold mb-3">
                        <v-icon color="primary" size="35" class="mb-2">mdi-earth</v-icon>
                        Redes Sociales
                    </h2>
                    <div>
                        <v-icon color="primary" size="35" class="mb-2">mdi-facebook</v-icon>
                        <span class="font-bitter text-black font-weight-bold ml-2">TramiTrack UCV</span>
                    </div>
                    <div>
                        <v-icon color="primary" size="35" class="mb-2">mdi-instagram</v-icon>
                        <span class="font-bitter text-black font-weight-bold ml-2">TramiTrack UCV</span>
                    </div>
                    <div>
                        <v-icon color="primary" size="35" class="mb-2">mdi-twitter</v-icon>
                        <span class="font-bitter text-black font-weight-bold ml-2">TramiTrack UCV</span>
                    </div>

                </v-card>
            </v-col>
        </v-row>

        <div class="mt-6 d-flex justify-space-between">
            <v-btn variant="outlined" color="primary" prepend-icon="mdi-arrow-left"
                @click="$router.push('/home')">
                Volver a Inicio
            </v-btn>
        </div>

    </v-container>
</template>



<style scoped>
a {
    text-decoration: none;
}

.card-hover {
    cursor: pointer;
    transition: all 0.2s ease !important;

}

.card-hover:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);

}

.card-hover:hover a {
    color: rgb(var(--v-theme-primary)) !important;
    text-decoration: underline;
}


.font-bitter {
    font-family: "Bitter", serif !important;
}

.max-width-300 {
    max-width: 300px;
}

.email-cont:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    transition: box-shadow 0.3s ease;

}

:deep(.v-data-table-header) {
    background-color: #f9f9f9;
}

:deep(.v-chip .v-chip__content) {
    color: white !important;
}

:deep(.btn-secondary .v-btn__content) {
    color: white !important;
}
</style>
