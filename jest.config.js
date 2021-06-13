module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      compilerHost: true,
      isolatedModules: true
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testPathIgnorePatterns: ['packages/api/build'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/*.test.(ts|tsx)'],
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  //globalSetup: '<rootDir>/jest.setup.js',
  //globalTeardown: '<rootDir>/jest.teardown.js',
  //maxWorkers: parseInt(process.env.JEST_MAX_WORKERS) || 2
};
