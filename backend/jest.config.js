module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Força o uuid a usar o arquivo que o Node entende (CommonJS)
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
  },
  // Só testes TypeScript em tests/ — evita Jest em cima de dist/*.js (node:test compilado).
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/tests/test\\.ts$'],
};
