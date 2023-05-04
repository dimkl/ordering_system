/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm", // or other ESM presets
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/integrationTest/",
    "<rootDir>/config/",
    // TODO: remove the next line
    "<rootDir>/src/shared/",
  ],
  coverageProvider: "v8",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 50,
      lines: 80,
      statements: -50,
    },
  },
  globalSetup: "<rootDir>/config/jest/setup.ts",
  globalTeardown: "<rootDir>/config/jest/teardown.ts",
  rootDir: "../..",
  roots: ["src/"],
  testEnvironment: "<rootDir>/config/jest/testEnvironment.ts"
};
