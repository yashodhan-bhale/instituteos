import { describe, it, expect, vi, beforeEach } from 'vitest';
import { middleware } from './middleware';
import { NextResponse } from 'next/server';

// Mock Next.js classes
vi.mock('next/server', () => {
    return {
        NextResponse: {
            next: vi.fn().mockReturnValue({ type: 'next' }),
            rewrite: vi.fn((url) => ({ type: 'rewrite', url })),
            redirect: vi.fn((url) => ({ type: 'redirect', url })),
        }
    };
});

// Mock jose
vi.mock('jose', () => ({
    jwtVerify: vi.fn()
}));

describe('Middleware', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createRequest = (hostname: string, pathname: string = '/', token?: string) => {
        return {
            nextUrl: { pathname, protocol: 'http:' },
            url: `http://${hostname}${pathname}`,
            headers: {
                get: (key: string) => (key === 'host' ? hostname : null)
            },
            cookies: {
                get: (key: string) => (key === 'auth_token' ? { value: token } : null)
            }
        } as any;
    };

    it('should rewrite requests on platform.localhost to /platform when authenticated', async () => {
        const { jwtVerify } = await import('jose');
        (jwtVerify as any).mockResolvedValue({ payload: { target: 'platform', roles: ['ADMIN'] } });

        const req = createRequest('platform.localhost:3000', '/dashboard', 'valid-token');
        await middleware(req);

        expect(NextResponse.rewrite).toHaveBeenCalled();
        const callUrl = (NextResponse.rewrite as any).mock.calls[0][0];
        expect(callUrl.pathname).toBe('/platform/dashboard');
    });

    it('should rewrite requests on institute.localhost to /institute when authenticated', async () => {
        const { jwtVerify } = await import('jose');
        (jwtVerify as any).mockResolvedValue({ payload: { target: 'institute' } });

        const req = createRequest('institute.localhost:3000', '/staff', 'valid-token');
        await middleware(req);

        expect(NextResponse.rewrite).toHaveBeenCalled();
        const callUrl = (NextResponse.rewrite as any).mock.calls[0][0];
        expect(callUrl.pathname).toBe('/institute/staff');
    });

    it('should rewrite root domain to /site', async () => {
        const req = createRequest('localhost:3000', '/');
        await middleware(req);

        expect(NextResponse.rewrite).toHaveBeenCalled();
        const callUrl = (NextResponse.rewrite as any).mock.calls[0][0];
        expect(callUrl.pathname).toBe('/site');
    });

    it('should redirect platform domain to login if no token is present', async () => {
        const req = createRequest('platform.localhost:3000', '/dashboard');
        // No token
        await middleware(req);

        expect(NextResponse.redirect).toHaveBeenCalled();
        const callUrl = (NextResponse.redirect as any).mock.calls[0][0];
        expect(callUrl.pathname).toBe('/login');
        expect(callUrl.searchParams.get('target')).toBe('platform');
    });

    it('should redirect to platform domain if platform token used on institute domain', async () => {
        const { jwtVerify } = await import('jose');
        (jwtVerify as any).mockResolvedValue({ payload: { target: 'platform' } });

        const req = createRequest('my-school.localhost:3000', '/dashboard', 'platform-token');
        await middleware(req);

        expect(NextResponse.redirect).toHaveBeenCalled();
        const callUrl = (NextResponse.redirect as any).mock.calls[0][0];
        expect(callUrl.host).toBe('platform.localhost:3000');
    });
});
