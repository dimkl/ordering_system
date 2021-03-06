/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/integrationTest/"
  ],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 50,
      lines: 80,
      statements: -50
    }
  },
  globalSetup: "<rootDir>/config/jest/setup.js",
  globalTeardown: "<rootDir>/config/jest/teardown.js",
  rootDir: "../..",
  roots: ["src/"],
  testEnvironment: "<rootDir>/config/jest/testEnvironment.js",
};
