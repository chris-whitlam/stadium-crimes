module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      compilerHost: true,
      isolatedModules: true
    }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest'
  },
  testMatch: ['**/*.test.(ts|tsx)'],
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
};
