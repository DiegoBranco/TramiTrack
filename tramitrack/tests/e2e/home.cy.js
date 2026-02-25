describe('Prueba de carga', () => {
  it('Debería cargar la página principal', () => {
    cy.visit('/')
    cy.contains('Vuetify')
  })
})
