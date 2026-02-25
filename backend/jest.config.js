module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  globals: {
    'ts-jest': {
      tsconfig: {
        types: ['jest', 'node'],
        esModuleInterop: true,
        strict: true,
        target: 'ES2020',
        module: 'commonjs',
        lib: ['ES2020'],
        baseUrl: './src',
      },
    },
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/index.ts',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
