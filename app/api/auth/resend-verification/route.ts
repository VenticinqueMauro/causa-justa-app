import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: 'Correo electrónico requerido' }, { status: 400 });
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({ message: data.message }, { status: 200 });
        } else {
            return NextResponse.json({ error: data.message || 'Error al reenviar verificación' }, { status: 400 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Error al reenviar el correo de verificación' }, { status: 500 });
    }
}
