import '@testing-library/jest-native/extend-expect';

// Basic mocks for React Native
// jest-expo handles most of these, but keeping the structure for compatibility
jest.mock('expo-constants', () => ({
    default: {
        manifest: {},
        expoConfig: {},
    },
}));
