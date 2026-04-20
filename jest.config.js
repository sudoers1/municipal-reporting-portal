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


