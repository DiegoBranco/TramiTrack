<template>
    <v-container class="pa-6 pa-sm-10 bg-grey-lighten-4" fluid>
        <AppBreadcrumbs class="mb-4" />
        <div class="title d-flex flex-column align-center mb-8">
            <h1 class="font-bitter text-h3 text-black font-weight-bold mb-6">
                Contacto y Soporte
            </h1>
            <h6 class="font-bitter text-h6 text-gray">Obtén ayuda rápidamente, estamos aquí para ti</h6>
        </div>
        <div class="card-container d-flex flex-row justify-space-evenly mb-8">
            <v-card class="email-cont pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
                elevation="1">
                
                <h2 class="font-bitter text-h5 font-weight-bold mb-1">
                    <v-icon color="primary" size="35" class="mb-2">mdi-email-outline</v-icon>
                    Correo de soporte
                </h2>
                <a href="mailto:soporte@tramitrack.ucv.com" class="font-bitter text-success font-weight-bold mb-1">
                    soporte@tramitrack.ucv.com
                </a>
                
            </v-card>

            <v-card class="email-cont pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
                elevation="1">
                
                <h2 class="font-bitter text-h5 font-weight-bold mb-1">
                    <v-icon color="primary" size="35" class="mb-2">mdi-phone</v-icon>
                    Teléfono de soporte
                </h2>
                <a href="tel:+582123456789" class="font-bitter text-success font-weight-bold mb-1">
                    +58 212 345 6789
                </a>
                
            </v-card>

            <v-card class="email-cont pa-6 rounded-lg text-center fill-height d-flex flex-column align-center justify-center"
                elevation="1">
                
                <h2 class="font-bitter text-h5 font-weight-bold mb-1">
                    <v-icon color="primary" size="35" class="mb-2">mdi-email-outline</v-icon>
                    Redes Sociales
                </h2>
                
                <v-icon color="primary" size="35" class="mb-2">mdi-facebook</v-icon>
                <v-icon color="primary" size="35" class="mb-2 ml-2">mdi-instagram</v-icon>
                <v-icon color="primary" size="35" class="mb-2 ml-2">mdi-twitter</v-icon>
                
            </v-card>

            
        </div>

    </v-container>
</template>



<style scoped>

a{
    
    text-decoration: none;
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
