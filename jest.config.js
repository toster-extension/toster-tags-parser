module.exports = {
    bail: true,
    verbose: true,
    clearMocks: true,
    testEnvironment: 'node',
    testMatch: ['**/bin/**/*.spec.js'],
    testPathIgnorePatterns: ['/node_modules/'],
    transformIgnorePatterns: ['/node_modules/']
};
