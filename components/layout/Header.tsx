import React from "react";
import { Heart } from "lucide-react";
import BrutalButton from "../ui/BrutalButton";
import BrutalLink from "../ui/BrutalLink";

const Header = () => {
  return (
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
          <BrutalLink href="#">Causas</BrutalLink>
          <BrutalLink href="#">Cómo funciona</BrutalLink>
          <BrutalLink href="#">Sobre nosotros</BrutalLink>
          <BrutalLink href="#">Contacto</BrutalLink>
        </nav>
        <div className="flex items-center gap-4">
          <BrutalButton variant="outline" className="hidden md:flex" href="/login">
            Iniciar sesión
          </BrutalButton>
          <BrutalButton variant="primary" href="/register">Registrarse</BrutalButton>
        </div>
      </div>
    </header>
  );
};

export default Header;
