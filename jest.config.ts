import nextJest from 'next/jest.js';
import type { Config } from 'jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next-intl$': '<rootDir>/__test__/__mocks__/next-intl/server.ts',
    '^next-intl/navigation$':
      '<rootDir>/__test__/__mocks__/next-intl/navigation.ts',
    '^next-intl/routing$': '<rootDir>/__test__/__mocks__/next-intl/routing.ts',
    '^@/components/ui/sonner$': '<rootDir>/__test__/__mocks__/sonner.ts',
  },
  testEnvironment: 'jsdom',

  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>'],

  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!<rootDir>/.next/**',
    '!src/**/types.ts',
    '!src/**/index.ts',
    '!src/**/layout.tsx',
  ],

  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

export default createJestConfig(config);
