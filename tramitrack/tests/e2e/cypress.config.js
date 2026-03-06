const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_baseUrl || "http://localhost:3000",
    supportFile: false,
    specPattern: "*.cy.js",
  },
});
