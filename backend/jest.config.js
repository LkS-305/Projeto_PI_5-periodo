module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    // Força o uuid a usar o arquivo que o Node entende (CommonJS)
    '^uuid$': '<rootDir>/node_modules/uuid/dist/index.js',
  },
};
