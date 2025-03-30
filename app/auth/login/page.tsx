import GoogleButton from "@/components/auth/GoogleButton";

export default function LoginPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    Iniciar Sesión
                </h2>

                <GoogleButton />

                <p className="mt-4 text-sm text-center text-gray-600">
                    ¿No tienes una cuenta? <a href="/auth/register" className="text-blue-500">Regístrate aquí</a>
                </p>
            </div>
        </div>
    );
}
