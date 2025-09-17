import type { Config } from "jest";

const config: Config = {
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
        name: "unit",
        color: "blue",
      },
      testMatch: ["<root>/**/*.test.ts"],
      coveragePathIgnorePatterns: [
        "<root>/node_modules",
        "<root>/openapi",
        "<root>/cdk",
        "<root>/src/utils",
      ],
    },
  ],
};
