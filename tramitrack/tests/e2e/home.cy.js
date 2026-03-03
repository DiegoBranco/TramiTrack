describe('Prueba de login', () => {
  it('Página de login accesible (smoke)', () => {
    cy.visit('/login')
    cy.contains('Iniciar Sesión').should('be.visible')
  })
})
