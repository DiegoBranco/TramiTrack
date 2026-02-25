/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";

// Composables
export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#075E68",
          secondary: "#F2B053",
          accent: "#A698F2",
          error: "#FF5252",
          info: "#075E68",
          success: "#4CAF50",
          warning: "#FB8C00",
        },
      },
      // También puedes definir el tema oscuro por separado
      dark: {
        colors: {
          primary: "#2196F3",
          secondary: "#424242",
        },
      },
    },
  },
});
