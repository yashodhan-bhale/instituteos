import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InstitutesPage from './page';
import '@testing-library/jest-dom';

// Mock fetch
global.fetch = vi.fn();

describe('InstitutesPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock cookies
        Object.defineProperty(document, 'cookie', {
            writable: true,
            value: 'auth_token=abc',
        });
    });

    it('renders loading state initially', () => {
        (global.fetch as any).mockImplementation(() => new Promise(() => { })); // Never resolves
        render(<InstitutesPage />);
        expect(screen.getByText(/Retrieving institute records/i)).toBeInTheDocument();
    });

    it('renders institutes list after fetching data', async () => {
        const mockInstitutes = [
            {
                id: '1',
                name: 'Test Institute',
                domain: 'test.example.com',
                adminEmail: 'admin@test.com',
                adminName: 'Admin User',
                createdAt: new Date().toISOString(),
                status: 'ACTIVE'
            }
        ];

        (global.fetch as any).mockResolvedValue({
            ok: true,
            json: async () => mockInstitutes
        });

        render(<InstitutesPage />);

        // Wait for data to load
        const nameElement = await screen.findByText(/Test Institute/i);
        expect(nameElement).toBeInTheDocument();
        expect(screen.getByText(/test.example.com/i)).toBeInTheDocument();
        expect(screen.getByText(/admin@test.com/i)).toBeInTheDocument();
    });

    it('renders error message if fetch fails', async () => {
        (global.fetch as any).mockResolvedValue({
            ok: false
        });

        render(<InstitutesPage />);

        const errorMessage = await screen.findByText(/Failed to fetch institutes/i);
        expect(errorMessage).toBeInTheDocument();
    });
});
