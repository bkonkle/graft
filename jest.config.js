module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/(test|__tests__)/.*(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  testURL: 'http://localhost',
  roots: ['<rootDir>/packages'],
  testPathIgnorePatterns: ['/node_modules/', '/lib/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: ['src/**/*.{ts,tsx.js,jsx,mjs}'],
  setupFilesAfterEnv: ['<rootDir>/TestSetup.ts'],
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
}
