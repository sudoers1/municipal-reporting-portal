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
    "components/wardmap.tsx",
    "app/**/*.ts",
    "lib/**/*.ts",
    "!components/LinkedInButton.tsx",
    "!components/complaintform.tsx",
    "!components/complaintbutton.tsx",
    "!components/dashboarditems.tsx",
    "!components/hamburgerMenu.tsx",
    "!components/login.tsx",
    "!components/signup.tsx",
    "!**/*.d.ts",
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
