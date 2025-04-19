'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';

// Iconos (puedes reemplazarlos con una biblioteca como react-icons si lo prefieres)
const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
  </svg>
);

const CausesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
  </svg>
);

const CreateIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
  </svg>
);

const DonationsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
  </svg>
);

const StatsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
  </svg>
);

const ProfileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
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
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

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

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
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
        <div className="flex items-center justify-between h-16 px-6 border-b bg-gray-700 text-white">
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
        </div>
        
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.fullName}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {user.role === 'ADMIN' ? 'Administrador' : user.role === 'BENEFICIARY' ? 'Beneficiario' : 'Donante'}
              </span>
            </div>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          <Link 
            href="/dashboard" 
            className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <DashboardIcon />
            <span className="ml-3">Dashboard</span>
          </Link>
          
          {/* Menú para BENEFICIARY */}
          {user.role === 'BENEFICIARY' && (
            <>
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gestión de Causas</p>
              <Link 
                href="/dashboard/mis-causas" 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/mis-causas') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <CausesIcon />
                <span className="ml-3">Mis Causas</span>
              </Link>
              <Link 
                href="/dashboard/crear-causa" 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/crear-causa') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <CreateIcon />
                <span className="ml-3">Crear Causa</span>
              </Link>
              <Link 
                href="/dashboard/donaciones" 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/donaciones') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <DonationsIcon />
                <span className="ml-3">Donaciones</span>
              </Link>
            </>
          )}
          
          {/* Menú para ADMIN */}
          {user.role === 'ADMIN' && (
            <>
              <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Administración</p>
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
                <CausesIcon />
                <span className="ml-3">Causas</span>
              </Link>
              <Link 
                href="/dashboard/estadisticas" 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/estadisticas') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <StatsIcon />
                <span className="ml-3">Estadísticas</span>
              </Link>
            </>
          )}
          
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tu cuenta</p>
            <Link 
              href="/dashboard/perfil" 
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${isActive('/dashboard/perfil') ? 'bg-gray-700 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <ProfileIcon />
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
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
