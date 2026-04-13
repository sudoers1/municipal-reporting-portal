module.exports = {
  preset: "ts-jest",                 // TypeScript support
  testEnvironment: "node",           // Runtime environment

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8", // The provider v8 is faster than babble

  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts"
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};