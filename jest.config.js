const baseConfig = {
  roots: ['<rootDir>'],
  transform: {
    '\\.rego$': 'jest-raw-loader',
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.ts',
    '**/*.tsx',
    '!**/*.d.ts',
    '!cdk.out/**/*',
    '!bin/**/*',
    '!esbuild.ts',
    '!cdk/rego.fyi.ts',
    '!ui/index.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};

module.exports = {
  projects: [
    { ...baseConfig, displayName: 'dom', testEnvironment: 'jsdom', testMatch: ['**/*.spec.tsx'] },
    { ...baseConfig, displayName: 'node', testEnvironment: 'node', testMatch: ['**/*.spec.ts'] },
  ],
};
