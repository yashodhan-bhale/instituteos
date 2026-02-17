module.exports = {
    preset: 'jest-expo',
    transformIgnorePatterns: [
        'node_modules/(?!.*(?:@react-native|react-native|expo|@expo|react-navigation|@react-navigation|@unimodules|sentry-expo|native-base|react-native-svg))',
    ],
    setupFilesAfterEnv: [
        '<rootDir>/src/test/setup.ts'
    ],
    testMatch: [
        '**/__tests__/**/*.{ts,tsx}',
        '**/*.{spec,test}.{ts,tsx}'
    ],
};
