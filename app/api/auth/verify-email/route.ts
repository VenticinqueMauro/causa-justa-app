// src/app/api/auth/verify-email/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
        return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 });
    }

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/verify/success`);
        } else {
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/auth/verify/failure?error=${data.message}`);
        }
    } catch (error) {
        return NextResponse.json({ error: 'Error al verificar el correo' }, { status: 500 });
    }
}
