'use client';

import BrutalButton from '@/components/ui/BrutalButton';
import StartCauseButton from '@/components/actions/StartCauseButton';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, Heart, KeyRound, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const Header = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    logout();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b-2 border-[#002C5B] bg-[#ECECE2] shadow-[0_4px_0_0_rgba(0,44,91,0.2)]">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-[#002C5B] bg-white shadow-[2px_2px_0_0_rgba(0,44,91,0.8)]">
              <Heart className="h-5 w-5 text-[#002C5B]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs font-medium text-[#002C5B] uppercase tracking-tight">Por una</span>
              <span className="text-lg font-bold text-[#002C5B] uppercase tracking-tight -mt-1">Causa Justa</span>
            </div>
          </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#" className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80">Causas</Link>
          <Link href="#" className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80">Cómo funciona</Link>
          <Link href="#" className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80">Sobre nosotros</Link>
          <Link href="#" className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80">Contacto</Link>
          
          {/* Botón destacado para iniciar una causa */}
          <StartCauseButton 
            variant='secondary'
            size='xs'
            showIcon={true}
            iconPosition="left"
          />
        </nav>

        {/* Mostrar botones de login/registro o menú de usuario según el estado de autenticación */}
        {isLoading ? (
          // Mostrar un espacio reservado mientras se carga el estado de autenticación
          <div className="w-[180px] h-10"></div>
        ) : isAuthenticated ? (
          // Usuario autenticado: mostrar menú desplegable con opciones de usuario
          <div className="flex items-center gap-4 relative">
            {/* Botón móvil de Iniciar causa cuando el usuario ya está autenticado */}
            <div className="md:hidden">
              <StartCauseButton 
                variant='secondary'
                size='xs'
                showIcon={true}
                text=""
                className="px-2 py-2"
              />
            </div>
            <UserDropdownMenu user={user} handleLogout={handleLogout} />
          </div>
        ) : (
          // Usuario no autenticado: mostrar botones de login/registro
          <div className="flex items-center gap-4">
            <BrutalButton variant="outline" className="hidden md:flex" href="/login">
              Iniciar sesión
            </BrutalButton>
            <BrutalButton variant="primary" href="/register">Registrarse</BrutalButton>

            {/* Versión móvil del botón Iniciar causa */}
            <div className="md:hidden">
              <StartCauseButton 
                variant='secondary'
                size='xs'
                showIcon={true}
                text=""
                className="px-2 py-2"
              />
            </div>
          </div>
        )}
        </div>
      </header>
      
      {/* El modal de error ahora está incluido en el componente StartCauseButton */}
    </>
  );
};

// Componente de menú desplegable para usuario autenticado
const UserDropdownMenu = ({ user, handleLogout }: { user: any, handleLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón para abrir/cerrar el menú */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 py-2 px-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#002C5B] bg-white">
          <User className="h-4 w-4 text-[#002C5B]" />
        </div>
        <span className="hidden md:block text-sm font-medium">
          {user?.fullName || 'Usuario'}
        </span>
        <ChevronDown className="h-4 w-4 ml-1" />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] z-10">
          <div className="py-1">
            <Link
              href="/auth/change-password"
              className="flex items-center px-4 py-2 text-sm text-[#002C5B] hover:bg-[#EDFCA7] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <KeyRound className="h-4 w-4 mr-2" />
              Cambiar contraseña
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-[#002C5B] hover:bg-[#EDFCA7] transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
