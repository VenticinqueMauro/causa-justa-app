'use client';

import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import BrutalButton from './BrutalButton';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  title: string;
  message: string;
  buttonText: string;
  redirectUrl: string;
  onClose?: () => void;
  autoRedirectTime?: number; 
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  title,
  message,
  buttonText,
  redirectUrl,
  onClose,
  autoRedirectTime = 5000
}) => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(redirectUrl);
    }, autoRedirectTime);

    return () => clearTimeout(timer);
  }, [redirectUrl, autoRedirectTime, router]);

  const handleRedirect = () => {
    if (onClose) onClose();
    router.push(redirectUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-[#ECECE2] border-2 border-[#002C5B] p-3 md:p-6 max-w-md w-full shadow-[8px_8px_0_0_rgba(0,44,91,0.8)] relative">
        {/* Botón de cerrar */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 text-[#002C5B] hover:text-[#002C5B]/70"
          >
            <X size={24} />
          </button>
        )}
        
        {/* Icono de éxito */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-[#EDFCA7] rounded-full flex items-center justify-center border-2 border-[#002C5B]">
            <CheckCircle size={32} className="text-[#002C5B]" />
          </div>
        </div>
        
        {/* Título */}
        <h3 className="text-xl font-bold text-[#002C5B] text-center mb-2">
          {title}
        </h3>
        
        {/* Mensaje */}
        <p className="text-[#002C5B]/80 text-center mb-6">
          {message}
        </p>
        
        {/* Contador de redirección */}
        <p className="text-sm text-[#002C5B]/60 text-center mb-4">
          Serás redirigido automáticamente en unos segundos...
        </p>
        
        {/* Botón de acción */}
        <BrutalButton 
          variant="primary" 
          className="w-full"
          onClick={handleRedirect}
        >
          {buttonText}
        </BrutalButton>
      </div>
    </div>
  );
};

export default SuccessModal;
