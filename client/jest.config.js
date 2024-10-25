module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',  // Transform TypeScript files with ts-jest
      '^.+\\.(js|jsx|mjs)$': 'babel-jest', // Use babel-jest for JavaScript files, including ES modules
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios)/',   // Don't ignore transforming axios or other ES modules
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  };
  