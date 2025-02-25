const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './', // Caminho para a raiz do projeto Next.js
});

/** @type {import('jest').Config} */
const customJestConfig = {
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
