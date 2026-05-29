module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/*.test.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
  ],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 65,
      lines: 70,
      statements: 70
    }
  },
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true
};
