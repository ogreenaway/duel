module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
          isolatedModules: true, // Faster compilation
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
  // Removed config.ts from setupFiles - unit tests don't need full app config
  setupFilesAfterEnv: ["<rootDir>/tests/support/setup.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/index.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  maxWorkers: "50%", // Use half of available CPUs for parallel execution
  cache: true, // Enable Jest cache
  cacheDirectory: "<rootDir>/.jest-cache",
};
