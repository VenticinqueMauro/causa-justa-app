'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart, Plus, DollarSign, BarChart, User } from 'lucide-react';

// Iconos (puedes reemplazarlos con una biblioteca como react-icons si lo prefieres)
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
  </svg>
);

export default function DashboardClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      // Redirigir a login si no está autenticado
      if (!isAuthenticated) {
        router.push('/login');
      }
      // Redirigir a la página principal si es DONOR
      else if (user?.role === 'DONOR') {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Cerrar sidebar en dispositivos móviles al cambiar de ruta
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // No renderizar nada mientras redirige
  }
  
  // Mostrar mensaje de redirección para usuarios DONOR
  if (user.role === 'DONOR') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 flex-col p-3 md:p-6">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceso no disponible</h2>
          <p className="text-gray-600 mb-6">
            El panel de administración no está disponible para usuarios donantes. 
            Estás siendo redirigido a la página principal donde podrás ver y apoyar causas.
          </p>
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Determinar si un enlace está activo
  const isActive = (path: string) => {
    if (path === '/dashboard' && pathname === '/dashboard') {
      return true;
    }
    return pathname.startsWith(path) && path !== '/dashboard';
  };


  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay para móviles */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Link href="/" className="flex items-center justify-between h-16 px-6 border-b bg-gray-700 text-white">
          <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center border-2 border-white bg-white shadow-[2px_2px_0_0_rgba(255,255,255,0.3)]">
                <Heart className="h-5 w-5 text-[#002C5B]" />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-xs font-medium text-white uppercase tracking-tight">Por una</span>
                <span className="text-lg font-bold text-white uppercase tracking-tight -mt-1">Causa Justa</span>
              </div>
            </div>
          <button 
            className="p-1 rounded-md lg:hidden focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setSidebarOpen(false)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </Link>
        
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {user.profilePicture ? (
                <img 
                  src={user.profilePicture} 
                  alt="Foto de perfil" 
                  className="w-10 h-10 rounded-full object-cover"
                  onError={(e) => {
                    // Si hay error al cargar la imagen, mostrar iniciales
                    e.currentTarget.style.display = 'none';
                    // El elemento padre debe tener un ID para poder encontrarlo
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = `
                        <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          ${user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                      `;
                    }
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {user.role === 'ADMIN' ? 'Administrador' : user.role === 'BENEFICIARY' ? 'Beneficiario' : 'Donante'}
              </span>
            </div>
          </div>
        </div>
        
        <nav className="p-4">
          {/* Sección principal */}
          <div className="mb-6">
            <Link 
              href="/dashboard" 
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <DashboardIcon />
              <span className="ml-3">Dashboard</span>
            </Link>
          </div>
          {user.role === 'BENEFICIARY' && (
            <div className="mb-6">
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">MIS CAMPAÑAS</h3>
              <div className="space-y-1">
                <Link 
                  href="/dashboard/mis-causas" 
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/mis-causas') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="ml-3">Mis Causas</span>
                </Link>
                <Link 
                  href="/dashboard/crear-causa" 
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/crear-causa') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="ml-3">Crear Causa</span>
                </Link>
                <Link 
                  href="/dashboard/donaciones" 
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/donaciones') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <DollarSign className="w-5 h-5" />
                  <span className="ml-3">Donaciones</span>
                </Link>
              </div>
            </div>
          )}
          
          {/* Sección de administración */}
          {user.role === 'ADMIN' && (
            <div className="mb-6">
              <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">ADMINISTRACIÓN</h3>
              <div className="space-y-1">
                <Link 
                  href="/dashboard/usuarios" 
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/usuarios') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <UsersIcon />
                  <span className="ml-3">Usuarios</span>
                </Link>
                <Link 
                  href="/dashboard/causas" 
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/causas') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="ml-3">Causas</span>
                </Link>
                <Link 
                  href="/dashboard/estadisticas" 
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/estadisticas') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <BarChart className="w-5 h-5" />
                  <span className="ml-3">Estadísticas</span>
                </Link>
              </div>
            </div>
          )}
          
          {/* Sección de cuenta */}
          <div className="mt-auto">
            <h3 className="px-4 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">TU CUENTA</h3>
            <div className="space-y-1">
              <Link 
                href="/dashboard/perfil" 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/perfil') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <User className="w-5 h-5" />
                <span className="ml-3">Mi Perfil</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogoutIcon />
                <span className="ml-3">Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navbar */}
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b lg:hidden">
          <button 
            className="p-1 mr-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon />
          </button>
          <h1 className="text-xl font-bold text-gray-700">Causa Justa</h1>
          <div className="flex items-center">
            <div className="relative">
              <button 
                className="flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-700 rounded-full"
                onClick={() => router.push('/dashboard/perfil')}
              >
                <div className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold">
                  {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
                </div>
              </button>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-3 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
