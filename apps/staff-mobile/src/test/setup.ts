import '@testing-library/jest-native/extend-expect';
import { vi } from 'vitest';

// Basic mocks for React Native
vi.mock('react-native', async () => {
    const actual = await vi.importActual('react-native-web');
    return {
        ...actual,
        // Add specific RN mocks here if needed
    };
});

// Mock Expo constants or other native modules if necessary
vi.mock('expo-constants', () => ({
    default: {
        manifest: {},
        expoConfig: {},
    },
}));
