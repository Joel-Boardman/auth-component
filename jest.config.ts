import type { Config } from "jest";

const config: Config = {
  roots: ["<rootDir>"],
  testEnvironment: "node",
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  projects: [
    {
      preset: "ts-jest",
      clearMocks: true,
      resetMocks: true,
      displayName: {
        name: "Lambdas",
        color: "yellow",
      },
      testMatch: ["<rootDir>/src/lambdas/**/*.test.ts"],
      coveragePathIgnorePatterns: [
        "<rootDir>/node_modules",
        "<rootDir>/openapi",
        "<rootDir>/cdk",
        "<rootDir>/src/utils",
      ],
    },
  ],
  transformIgnorePatterns: ["node_modules/"],
};

export default config;
