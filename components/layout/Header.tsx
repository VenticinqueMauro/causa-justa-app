'use client';

import BrutalButton from '@/components/ui/BrutalButton';
import StartCauseButton from '@/components/actions/StartCauseButton';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronDown, Heart, KeyRound, LogOut, Menu, PlusCircle, User, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

// Botón flotante para iniciar causa
const FloatingStartCauseButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // Detectar si estamos en un dispositivo móvil
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(hover: none)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Manejar hover solo en dispositivos desktop
  const handleMouseEnter = () => {
    if (!isMobile) setIsExpanded(true);
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) setIsExpanded(false);
  };

  const handleClick = () => {
    // Siempre expandir/contraer en móvil
    if (isMobile) {
      setIsExpanded(!isExpanded);
    }
    
    // Redirigir a la página de creación de causa o login
    if (!isAuthenticated) {
      router.push('/login?redirect=create-cause');
    } else {
      router.push('/create-cause');
    }
  };
  
  return (
    <div className="fixed bottom-5 right-3 md:bottom-20 md:right-10 z-[9999]">
      <button 
        className={`
          flex items-center bg-[#EDFCA7] border-2 border-[#002C5B] shadow-[4px_4px_0_0_rgba(0,44,91,0.8)]
          transition-all duration-300 ease-in-out overflow-hidden
          ${isExpanded ? 'px-4 py-2' : 'p-2'}
          hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[1px_1px_0_0_rgba(0,44,91,0.8)]
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="flex items-center justify-center">
          <PlusCircle className={`h-5 w-5 text-[#002C5B] flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`} />
          <div 
            className={`
              overflow-hidden transition-all duration-300 ease-in-out
              ${isExpanded ? 'w-[90px] opacity-100 ml-2' : 'w-0 opacity-0 ml-0'}
            `}
          >
            <span className="text-xs font-bold uppercase text-[#002C5B] whitespace-nowrap">
              Iniciar causa
            </span>
          </div>
        </div>
      </button>
    </div>
  );
};

const Header = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout();
  };
  
  // Close mobile menu when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };
    
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b-2 border-[#002C5B] bg-[#ECECE2] shadow-[0_4px_0_0_rgba(0,44,91,0.2)]">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-10 w-10 items-center justify-center border-2 border-[#002C5B] bg-white shadow-[2px_2px_0_0_rgba(0,44,91,0.8)]">
              <Heart className="h-5 w-5 text-[#002C5B]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xs font-medium text-[#002C5B] uppercase tracking-tight">Por una</span>
              <span className="text-lg font-bold text-[#002C5B] uppercase tracking-tight -mt-1">Causa Justa</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Link href="#" className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80 whitespace-nowrap">Causas</Link>
            <Link href="#" className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80 whitespace-nowrap">Cómo funciona</Link>
            <Link href="#" className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80 whitespace-nowrap">Sobre nosotros</Link>
            <Link href="#" className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80 whitespace-nowrap">Contacto</Link>
          </nav>

          {/* Right side: Auth buttons or user menu */}
          <div className="flex items-center gap-2 md:gap-4">
            {isLoading ? (
              // Mostrar un espacio reservado mientras se carga el estado de autenticación
              <div className="w-[100px] md:w-[180px] h-10"></div>
            ) : isAuthenticated ? (
              // Usuario autenticado
              <>
                {/* User dropdown menu */}
                <UserDropdownMenu user={user} handleLogout={handleLogout} />
              </>
            ) : (
              // Usuario no autenticado
              <div className="flex items-center gap-2 md:gap-3">
                {/* Botones de autenticación - responsive */}
                <BrutalButton 
                  variant="outline" 
                  className="flex text-xs sm:text-sm" 
                  size="xs"
                  href="/login"
                >
                  <span className="hidden md:inline">Iniciar sesión</span>
                  <span className="md:hidden">Login</span>
                </BrutalButton>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden ml-1 p-1 text-[#002C5B] hover:bg-[#002C5B]/10 rounded"
              aria-label="Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile menu - slide down when open */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out border-t-2 border-[#002C5B]/20 bg-[#ECECE2] ${mobileMenuOpen ? 'max-h-64' : 'max-h-0'}`}
        >
          <div className="container mx-auto px-4 py-3">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="#" 
                className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Causas
              </Link>
              <Link 
                href="#" 
                className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cómo funciona
              </Link>
              <Link 
                href="#" 
                className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sobre nosotros
              </Link>
              <Link 
                href="#" 
                className="text-sm font-medium text-[#002C5B] hover:text-[#002C5B]/80 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contacto
              </Link>
              {/* StartCause button in mobile menu */}
              <div className="py-2">
                <StartCauseButton 
                  variant='secondary'
                  size='sm'
                  showIcon={true}
                  iconPosition="left"
                  className="w-full justify-center"
                />
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Botón flotante para iniciar causa */}
      <FloatingStartCauseButton />
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
        className="flex items-center gap-1 sm:gap-2 py-1 sm:py-2 px-2 sm:px-3 hover:bg-[#002C5B]/5 rounded-md"
        aria-label="Menú de usuario"
      >
        <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-[#002C5B] bg-white shrink-0 overflow-hidden">
          {user?.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={user.fullName || 'Usuario'} 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Si hay error al cargar la imagen, mostrar icono por defecto
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = `<svg class="h-3 w-3 sm:h-4 sm:w-4 text-[#002C5B]" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                }
              }}
            />
          ) : (
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-[#002C5B]" />
          )}
        </div>
        <span className="hidden sm:block text-xs md:text-sm font-medium truncate max-w-[80px] md:max-w-[120px]">
          {user?.fullName || 'Usuario'}
        </span>
        <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] z-10">
          <div className="py-1">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 text-sm text-[#002C5B] hover:bg-[#EDFCA7] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
              Dashboard
            </Link>
            <Link
              href="/dashboard/perfil"
              className="flex items-center px-4 py-2 text-sm text-[#002C5B] hover:bg-[#EDFCA7] transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <svg className="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              Mi Perfil
            </Link>
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
