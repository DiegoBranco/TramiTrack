describe("Flujo admin: actualizar estado de solicitud", () => {
    beforeEach(() => {
        // Interceptar llamadas a la API con las rutas correctas
        cy.intercept("POST", "**/api/users/login").as("loginRequest");
        cy.intercept("GET", "**/api/solicitudes").as("getAllSolicitudes");
        cy.intercept("GET", "**/api/solicitudes/*").as("getDetalleTramite");
        cy.intercept("PATCH", "**/api/solicitudes/*/estado").as("updateEstado");
    });

    it("Cambia el estado a en proceso y luego a completado", () => {
        const abrirSelectorEstado = () => {
            cy.contains("p", "Estado").parent().find(".v-select").click();
        };

        const seleccionarEstado = (label) => {
            abrirSelectorEstado();
            cy.contains(".v-list-item", label).click();
        };

        // =====================
        // PASO 1: Login admin
        // =====================
        cy.visit("/login");

        // Verificar que estamos en la página de login
        cy.contains("Iniciar Sesión").should("be.visible");
        cy.contains("TRAMITRACK").should("be.visible"); // Nota: está en mayúsculas en el template

        cy.contains("Correo electrónico")
            .parents(".v-input")
            .find("input")
            .type("admin@tramitrack.com"); // Datos admin

        cy.contains("Contraseña").parents(".v-input").find("input").type("admin");

        // Marcar "Recuérdame"
        cy.contains("Recuérdame").click();

        // Enviar formulario - encontrar el botón por su texto
        cy.contains("button", "Iniciar Sesión").click();

        cy.wait("@loginRequest");

        // ============================================
        // PASO 2: Verificar home admin después del login
        // ============================================
        
        cy.contains("Trámites Activos").should("be.visible");

        cy.wait("@getAllSolicitudes");

        // ============================================
        // PASO 3: Abrir detalle desde el icono de ojo (verificando estado Pendiente)
        // ============================================
        cy.contains("tr", "Constancia")
            .should("be.visible")
            .within(() => {
                cy.get('tbody, *').then(($ctx) => {
                    const found = $ctx
                        .find('*')
                        .filter(function () {
                            return /pendiente/i.test(this.innerText) && Cypress.$(this).is(':visible');
                        }).length > 0;

                    if (found) {
                        cy.contains(/pendiente/i).should('be.visible');
                        cy.get('button').first().click();
                    } else {
                        cy.log('No se encontró un estado "Pendiente" visible en la fila de Constancia');
                        throw new Error('No se encontró un estado "Pendiente" visible en la fila de Constancia');
                    }
                });
            });

        cy.wait("@getDetalleTramite");
        cy.url().should("include", "/admin-info-tramite");
        cy.contains("SEGUIMIENTO").should("be.visible");
        cy.contains("Estado").should("be.visible");

        // ============================================
        // PASO 4: Cambiar estado a en proceso y guardar
        // ============================================
        seleccionarEstado("En Proceso");
        cy.contains("button", "Guardar cambios").click();
        cy.wait("@updateEstado")
            .its("response.statusCode")
            .should("be.oneOf", [200, 201]);

        // ============================================
        // PASO 5: Cambiar estado a completado y guardar
        // ============================================
        seleccionarEstado("Completado");
        cy.contains("button", "Guardar cambios").click();
        cy.wait("@updateEstado")
            .its("response.statusCode")
            .should("be.oneOf", [200, 201]);
    });
});
