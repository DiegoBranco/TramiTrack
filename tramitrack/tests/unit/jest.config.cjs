/** @type {import('jest').Config} */
const config = {
    testEnvironment: 'node',

  // Dónde buscar los tests (en el contexto `tests/unit` los archivos están en la raíz)
    testMatch: ['**/*.test.js'],

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