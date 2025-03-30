import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    const protectedRoutes = ['/dashboard', '/profile', '/campaigns/create'];

    if (protectedRoutes.includes(request.nextUrl.pathname) && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard', '/profile', '/campaigns/create'],
};
