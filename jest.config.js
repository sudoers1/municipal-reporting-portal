const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  // Base preset for TypeScript
  preset: "ts-jest",

  // Default environment (can be overridden per test file)
  testEnvironment: "jest-environment-jsdom",

  // File extensions supported
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],

  // Test file patterns
  testMatch: ["**/*.(test|spec).(ts|tsx|js)"],

  // Setup for React Testing Library, etc.
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Path alias mapping
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // Transform rules
  transform: {
    ...tsjPreset.transform,
  },

  // Handle ESM dependencies
  transformIgnorePatterns: ["node_modules/(?!(better-auth)/)"],

  // Coverage settings
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",

  // Collect coverage from both frontend and backend
  collectCoverageFrom: [
    "!components/**/*.tsx",
    "!app/api/auth/**/*.ts",
    "app/**/*.ts",
    "lib/**/*.ts",
    "!lib/db/neon.ts",
    "!lib/db/types.ts",
    "!lib/auth.ts",
    "!lib/auth-client.ts",
    "!lib/generated/**/*.ts",  // Prisma generated files
    "!**/*.d.ts",
    "!lib/notifications/types.ts",
    "!app/api/notifications/stream/route.ts"
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },

  // Coverage reporters
  coverageReporters: ["json-summary", "text", "lcov"],
};
