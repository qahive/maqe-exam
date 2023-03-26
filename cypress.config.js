const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.bnn.in.th/th/',
    language: 'th',
    defaultCommandTimeout: 15000,
    requestTimeout: 40000,
    responseTimeout: 40000,
    chromeWebSecurity: false,
    viewportHeight: 1080,
    viewportWidth: 1920,
    testIsolation: true
  },
})