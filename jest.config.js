
module.exports = {
  clearMocks: true,
  roots: ['<rootDir>/src'],
  // coverageProvider: "v8",
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx, ts, tsx}'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  testMatch: [
    "<rootDir>/src/__tests__/**/*.spec.js",
  ],
  // setupFilesAfterEnv: ["<rootDir>/setupTest.js"],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testTimeout: 500
}