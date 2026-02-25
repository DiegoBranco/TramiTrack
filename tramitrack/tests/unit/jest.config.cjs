/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',

  // Dónde buscar los tests
    testMatch: ['**/tests/unit/**/*.test.js'],

  // Configuración de jest-junit
    reporters: [
        'default',
        ['jest-junit', {
        outputDirectory: '.',   // relativo al dir donde se ejecuta jest
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        }]
    ]
};

module.exports = config;