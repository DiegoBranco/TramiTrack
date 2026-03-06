describe("Flujo completo: Solicitar constancia de estudios", () => {
  beforeEach(() => {
    // Interceptar llamadas a la API con las rutas CORRECTAS
    cy.intercept("POST", "**/api/users/login").as("loginRequest");
    cy.intercept("GET", "**/api/tramite-types").as("getTramiteTypes");
    cy.intercept("POST", "**/api/solicitudes").as("createSolicitud");
    cy.intercept("GET", "**/api/solicitudes/mis").as("getMisTramites");
    cy.intercept("GET", "**/api/solicitudes/*").as("getDetalleTramite");
  });

  it("Completa el proceso de solicitud de constancia de estudios", () => {
    // ============================================
    // PASO 1: Login
    // ============================================
    cy.visit("/login");

    // Verificar que estamos en la página de login
    cy.contains("Iniciar Sesión").should("be.visible");
    cy.contains("TRAMITRACK").should("be.visible"); // Nota: está en mayúsculas en el template

    cy.contains("Correo electrónico")
      .parents(".v-input")
      .find("input")
      .type("maximilianoc@gmail.com");

    cy.contains("Contraseña").parents(".v-input").find("input").type("123");

    // Marcar "Recuérdame"
    cy.contains("Recuérdame").click();

    // Enviar formulario - encontrar el botón por su texto
    cy.contains("button", "Iniciar Sesión").click();

    // ============================================
    // PASO 2: Verificar home después del login
    // ============================================
    cy.contains("¡BIENVENIDO!").should("be.visible");
    cy.contains("Solicitar Trámite").should("be.visible");

    // ============================================
    // PASO 3: Ir a solicitar trámite
    // ============================================
    cy.get('[data-testid="solicitar-tramite-btn"]').click();

    // Verificar redirección
    cy.url().should("include", "/tipo-tramite");

    // Esperar que carguen los tipos de trámite
    cy.wait("@getTramiteTypes");

    // ============================================
    // PASO 4: Seleccionar "Constancia de estudios"
    // ============================================
    // Buscar la tarjeta de Constancia de Estudios
    cy.contains("Constancia de Estudios").should("be.visible");

    // Hacer clic en el botón "Solicitar" de esa tarjeta
    cy.contains("Constancia de Estudios")
      .parents(".v-card")
      .within(() => {
        cy.contains("Solicitar").click();
      });

    // Verificar redirección al formulario
    cy.url().should("include", "/solicitar-constancia");
    cy.url().should("include", "id=");
    cy.url().should("include", "nombre=Constancia");

    // ============================================
    // PASO 5: Llenar formulario de solicitud
    // ============================================
    // Verificar que la página cargó completamente
    cy.contains("Solicitar Constancia de Estudios", { timeout: 10000 }).should(
      "be.visible",
    );
    cy.get(".v-progress-circular").should("not.exist");

    // Verificar que los inputs existen (aunque estén vacíos)
    cy.get('[data-testid="nombre-input"]').should("exist");
    cy.get('[data-testid="apellido-input"]').should("exist");
    cy.get('[data-testid="cedula-input"]').should("exist");
    cy.get('[data-testid="correo-input"]').should("exist");

    // Verificar que el monto está visible
    cy.contains("Monto a pagar :").should("be.visible");

    // Llenar campos bancarios (estos SÍ son editables)
    cy.get('[data-testid="cuenta-origen-input"]').type("01020304050607080900");
    cy.get('[data-testid="referencia-pago-input"]').type("1234567890");
    cy.get('[data-testid="fecha-pago-input"]').type(
      new Date().toISOString().split("T")[0],
    );
    cy.get('[data-testid="monto-input"]').type("10");

    // ============================================
    // PASO 6: Subir archivo de comprobante
    // ============================================
    cy.get('[data-testid="comprobante-input"]').then((input) => {
      const file = new File(["contenido de prueba"], "comprobante.pdf", {
        type: "application/pdf",
      });

      const fileInput = input[0].querySelector('input[type="file"]');
      if (fileInput) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        fileInput.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    // Verificar que se ve el nombre del archivo
    cy.get('[data-testid="comprobante-input"]').should(
      "contain",
      "comprobante.pdf",
    );
    // ============================================
    // PASO 7: Enviar solicitud
    // ============================================
    cy.get("button").contains("Enviar Solicitud").click();

    // Esperar que la solicitud se cree
    cy.wait("@createSolicitud").its("response.statusCode").should("eq", 201);

    // Verificar redirección a seguimiento
    cy.url().should("include", "/home", { timeout: 10000 });

    // ============================================
    // PASO 8: Verificar que la solicitud aparece en "Mis Trámites"
    // ============================================
    // Buscar la solicitud recién creada
    cy.contains("Constancia de Estudios").should("be.visible");
    cy.contains("Pendiente").should("be.visible");

    // ============================================
    // PASO 9: Ver detalle de la solicitud
    // ============================================
    cy.contains("Constancia de Estudios")
      .parents("tr")
      .within(() => {
        cy.get('[data-testid^="ver-detalle-"]').click();
      });

    cy.wait("@getDetalleTramite");

    // Verificar datos del trámite
    cy.url().should("include", "/tramites/");
    cy.contains("Constancia de Estudios").should("be.visible");
    cy.contains("Número de seguimiento:").should("be.visible");
    cy.contains("DATOS DEL FORMULARIO").should("be.visible");

    // Verificar datos del pago
    cy.contains("Bs. 10").should("be.visible");
    cy.contains("Referencia de Pago:").should("be.visible");
    cy.contains("1234567890").should("be.visible");

    // ============================================
    // PASO 10: Volver a inicio
    // ============================================
    cy.get('[data-testid="volver-inicio-btn"]').click();
    cy.url().should("include", "/home");
    cy.contains("¡BIENVENIDO!").should("be.visible");
  });
});
