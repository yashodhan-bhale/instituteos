import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './page';
import '@testing-library/jest-dom';

// Mock useRouter and useSearchParams
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
    useSearchParams: () => ({
        get: vi.fn().mockReturnValue(null),
    }),
}));

describe('LoginPage', () => {
    beforeEach(() => {
        // Reset window.location
        delete (window as any).location;
        (window as any).location = {
            hostname: 'localhost',
            search: '',
        };
    });

    it('renders the login form', async () => {
        render(<LoginPage />);
        const emailLabel = await screen.findByText(/Email Address/i);
        expect(emailLabel).toBeInTheDocument();
        expect(screen.getByText(/Institute Login/i)).toBeInTheDocument();
    });

    it('detects platform context from hostname', async () => {
        (window as any).location.hostname = 'platform.localhost';

        render(<LoginPage />);

        const title = await screen.findByText(/Platform Admin/i);
        expect(title).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/admin@instituteos.com/i)).toBeInTheDocument();
    });
});
