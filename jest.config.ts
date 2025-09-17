module.exports = {
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
        "<rootDir>/src/services",
      ],
    },
    {
      preset: "ts-jest",
      clearMocks: true,
      resetMocks: true,
      displayName: {
        name: "Utilities",
        color: "green",
      },
      testMatch: ["<rootDir>/src/utils/**/*.test.ts"],
    },
    {
      preset: "ts-jest",
      clearMocks: true,
      resetMocks: true,
      displayName: {
        name: "Services",
        color: "blue",
      },
      testMatch: ["<rootDir>/src/services/**/*.test.ts"],
    },
  ],
  transformIgnorePatterns: ["node_modules/"],
};
