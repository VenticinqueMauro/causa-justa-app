import { Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#002C5B] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-white bg-white shadow-[2px_2px_0_0_rgba(255,255,255,0.3)]">
                <Heart className="h-5 w-5 text-[#002C5B]" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-medium text-white uppercase tracking-tight">Por una</span>
                <span className="text-lg font-bold text-white uppercase tracking-tight -mt-1">Causa Justa</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-300">
              Conectando corazones solidarios con causas que transforman vidas en nuestra comunidad.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Enlaces rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Causas
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Sobre nosotros
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Términos y condiciones
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Política de cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold uppercase mb-4">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-300">
                <span className="block">Email:</span>
                <a href="mailto:info@causajusta.org" className="text-white hover:underline">
                  info@causajusta.org
                </a>
              </li>
              <li className="text-sm text-gray-300">
                <span className="block">Teléfono:</span>
                <a href="tel:+123456789" className="text-white hover:underline">
                  +12 345 6789
                </a>
              </li>
              <li className="text-sm text-gray-300">
                <span className="block">Dirección:</span>
                <address className="not-italic text-white">
                  Av. Solidaridad 123, Ciudad
                </address>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Por una Causa Justa. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
