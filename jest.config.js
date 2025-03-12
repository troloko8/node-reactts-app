module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/setupTests.js'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};