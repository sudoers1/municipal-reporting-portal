module.exports = {
  preset: "ts-jest",                 // TypeScript support
  testEnvironment: "node",           // Runtime environment

  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8", // The provider v8 is faster than babble

  collectCoverageFrom: [
    "app/**/*.ts",
    "lib/**/*.ts",
    "!**/*.d.ts"
  ],

  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
    moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
    transformIgnorePatterns: [
    "node_modules/(?!(better-auth)/)"
  ],
      coverageReporters: [
      "json-summary",
      "text",
      "lcov"
    ]
};