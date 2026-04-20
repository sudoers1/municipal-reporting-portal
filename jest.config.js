const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  ...tsjPreset,
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/*.(test|spec).(ts|tsx|js)'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    ...tsjPreset.transform,
  },
  collectCoverageFrom: [
    'components/wardmap.tsx',
    '!components/LinkedInButton.tsx',
    '!components/complaintform.tsx',
    '!components/complaintbutton.tsx',
    '!components/dashboarditems.tsx',
    '!components/hamburgerMenu.tsx',
    '!components/login.tsx',
    '!components/signup.tsx',
    '!**/*.d.ts',
  ],
};


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
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
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
