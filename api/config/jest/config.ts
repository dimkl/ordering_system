import type { Config } from "jest";

const config: Config = {
  // moduleNameMapper: {
  //   "^(\\.{1,2}/.*)\\.js$": "$1"
  // },
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  clearMocks: true,
  verbose: true,
  // collectCoverage: true,
  // coverageDirectory: "coverage",
  // coveragePathIgnorePatterns: [
  //   // "<rootDir>/e2e/",
  //   "<rootDir>/config/"
  //   // TODO: remove the next line
  //   // "<rootDir>/src/shared/"
  // ],
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 50,
  //     lines: 80,
  //     statements: -50
  //   }
  // },
  globalSetup: "<rootDir>/config/jest/setup.ts",
  globalTeardown: "<rootDir>/config/jest/teardown.ts",
  rootDir: "../..",
  roots: ["<rootDir>/src"],
  testEnvironment: "<rootDir>/config/jest/testEnvironment.ts"
};

export default config;
