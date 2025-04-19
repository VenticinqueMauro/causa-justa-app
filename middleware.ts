import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const userDataCookie = request.cookies.get('auth_user')?.value;
    let userData = null;

    if (userDataCookie) {
        try {
            userData = JSON.parse(userDataCookie);
        } catch (e) {
            console.error('Error parsing user data cookie:', e);
        }
    }

    // Rutas protegidas que requieren autenticación
    const authProtectedPaths = [
        '/dashboard',
        '/dashboard/perfil',
        '/dashboard/mis-causas',
        '/dashboard/crear-causa',
        '/dashboard/donaciones',
        '/dashboard/usuarios',
        '/dashboard/causas',
        '/dashboard/estadisticas'
    ];

    // Rutas específicas para ADMIN
    const adminPaths = [
        '/dashboard/usuarios',
        '/dashboard/causas',
        '/dashboard/estadisticas'
    ];

    // Rutas específicas para BENEFICIARY
    const beneficiaryPaths = [
        '/dashboard/mis-causas',
        '/dashboard/crear-causa',
        '/dashboard/donaciones'
    ];

    // Verificar si la ruta actual está protegida
    const isProtectedPath = authProtectedPaths.some(path => 
        request.nextUrl.pathname === path || 
        request.nextUrl.pathname.startsWith(`${path}/`)
    );

    // Verificar si la ruta es específica para ADMIN
    const isAdminPath = adminPaths.some(path => 
        request.nextUrl.pathname === path || 
        request.nextUrl.pathname.startsWith(`${path}/`)
    );

    // Verificar si la ruta es específica para BENEFICIARY
    const isBeneficiaryPath = beneficiaryPaths.some(path => 
        request.nextUrl.pathname === path || 
        request.nextUrl.pathname.startsWith(`${path}/`)
    );

    // Redireccionar a login si no hay token y la ruta está protegida
    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Verificar permisos de rol si hay datos de usuario
    if (userData && token) {
        // Redireccionar a dashboard si un ADMIN intenta acceder a rutas de BENEFICIARY
        if (userData.role === 'ADMIN' && isBeneficiaryPath) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Redireccionar a dashboard si un BENEFICIARY intenta acceder a rutas de ADMIN
        if (userData.role === 'BENEFICIARY' && isAdminPath) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }

        // Redireccionar a dashboard si un DONOR intenta acceder a rutas de ADMIN o BENEFICIARY
        if (userData.role === 'DONOR' && (isAdminPath || isBeneficiaryPath)) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
    ],
};
