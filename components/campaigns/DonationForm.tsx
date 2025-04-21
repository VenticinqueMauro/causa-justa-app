'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/Toast';
import BrutalButton from '@/components/ui/BrutalButton';
import { useAuth } from '@/contexts/AuthContext';

interface DonationFormProps {
  campaignId: string;
  campaignTitle: string;
}

interface DonationFormData {
  amount: number;
  donorEmail: string;
  donorName: string;
}

export default function DonationForm({ campaignId, campaignTitle }: DonationFormProps) {
  const { user, getToken } = useAuth();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DonationFormData>({
    defaultValues: {
      amount: 0,
      donorEmail: user?.email || '',
      donorName: user?.fullName || '',
    }
  });

  const watchAmount = watch('amount');

  // Predefined donation amounts
  const donationAmounts = [1000, 2000, 5000, 10000];

  // Handle predefined amount selection
  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setValue('amount', amount);
  };

  // Process the donation
  const onSubmit = async (data: DonationFormData) => {
    try {
      setIsLoading(true);
      
      // Validate amount
      if (data.amount < 1) {
        showToast('El monto mínimo de donación es $1', 'error');
        setIsLoading(false);
        return;
      }
      
      const apiUrl = process.env.NEXT_PUBLIC_NEST_API_URL;
      if (!apiUrl) {
        throw new Error('API URL no configurada');
      }
      
      const baseUrl = apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`;
      
      // Get token if user is authenticated
      let headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Obtener el token usando el método getToken del contexto de autenticación
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Preparar los datos para enviar al backend
      const paymentData: Record<string, any> = {
        campaignId,
        amount: data.amount,
      };
      
      // Agregar email y nombre solo si están presentes
      if (data.donorEmail) {
        paymentData.donorEmail = data.donorEmail;
      }
      
      if (data.donorName) {
        paymentData.donorName = data.donorName;
      }
      
      // Create payment preference
      const response = await fetch(`${baseUrl}mercadopago/payment/preference`, {
        method: 'POST',
        headers,
        body: JSON.stringify(paymentData),
      });
      
      // Mostrar la respuesta completa para depuración
      console.log('Respuesta del servidor:', response.status, response.statusText);
      
      if (!response.ok) {
        let errorMessage = 'Error al procesar la donación';
        try {
          const errorData = await response.json();
          console.error('Datos de error:', errorData);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('No se pudo parsear la respuesta de error:', e);
        }
        throw new Error(errorMessage);
      }
      
      // Obtener y mostrar los datos de la respuesta para depuración
      const responseText = await response.text();
      console.log('Respuesta del servidor (texto):', responseText);
      
      let preferenceData;
      try {
        preferenceData = JSON.parse(responseText);
        console.log('Datos de preferencia:', preferenceData);
      } catch (e) {
        console.error('Error al parsear la respuesta JSON:', e);
        throw new Error('La respuesta del servidor no es un JSON válido');
      }
      
      // Verificar si tenemos el punto de inicio del pago (nueva estructura)
      if (preferenceData && (preferenceData.initPoint || preferenceData.sandboxInitPoint)) {
        // Usar initPoint o sandboxInitPoint según lo que esté disponible
        const checkoutUrl = preferenceData.initPoint || preferenceData.sandboxInitPoint;
        console.log('Punto de inicio del pago:', checkoutUrl);
        console.log('ID de preferencia:', preferenceData.preferenceId);
        
        // Save donation info to localStorage for reference after return from MercadoPago
        localStorage.setItem('lastDonation', JSON.stringify({
          campaignId,
          campaignTitle,
          amount: data.amount,
          timestamp: new Date().toISOString(),
          preferenceId: preferenceData.preferenceId
        }));
        
        // Redirect to MercadoPago
        window.location.href = checkoutUrl;
      } 
      // Verificar si tenemos el formato antiguo (para compatibilidad)
      else if (preferenceData && preferenceData.init_point) {
        console.log('Punto de inicio del pago (formato antiguo):', preferenceData.init_point);
        
        localStorage.setItem('lastDonation', JSON.stringify({
          campaignId,
          campaignTitle,
          amount: data.amount,
          timestamp: new Date().toISOString(),
        }));
        
        window.location.href = preferenceData.init_point;
      } 
      else {
        console.error('Respuesta sin punto de inicio del pago:', preferenceData);
        throw new Error('No se recibió el punto de inicio del pago. Contacta al soporte técnico.');
      }
    } catch (error) {
      console.error('Error al procesar la donación:', error);
      showToast(
        error instanceof Error ? error.message : 'Error al procesar la donación',
        'error'
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Donar a esta causa</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Predefined amounts */}
        <div className="grid grid-cols-2 gap-2">
          {donationAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => handleAmountSelect(amount)}
              className={`py-2 px-4 border-2 border-[#002C5B] font-bold transition-colors ${
                selectedAmount === amount
                  ? 'bg-[#002C5B] text-white'
                  : 'bg-white text-[#002C5B] hover:bg-gray-100'
              }`}
            >
              ${amount.toLocaleString()}
            </button>
          ))}
        </div>
        
        {/* Custom amount */}
        <div className="space-y-1">
          <label htmlFor="amount" className="block text-sm font-medium">
            Monto personalizado
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              id="amount"
              type="number"
              min="1"
              step="1"
              className={`w-full border-2 border-[#002C5B] py-2 pl-8 pr-3 ${
                errors.amount ? 'border-red-500' : ''
              }`}
              {...register('amount', {
                required: 'El monto es requerido',
                min: {
                  value: 1,
                  message: 'El monto mínimo es $1',
                },
              })}
            />
          </div>
          {errors.amount && (
            <p className="text-red-500 text-sm">{errors.amount.message}</p>
          )}
        </div>
        
        {/* Donación anónima */}
        <div className="flex items-center space-x-2 mb-4 border-2 border-[#002C5B] p-3 bg-gray-50">
          <input
            id="anonymous"
            type="checkbox"
            className="h-4 w-4 text-[#002C5B] border-[#002C5B] focus:ring-[#002C5B]"
            checked={isAnonymous}
            onChange={(e) => {
              setIsAnonymous(e.target.checked);
              if (e.target.checked) {
                // Limpiar campos si se marca como anónimo
                setValue('donorEmail', '');
                setValue('donorName', '');
              }
            }}
          />
          <label htmlFor="anonymous" className="text-sm font-medium cursor-pointer">
            Realizar donación anónima
          </label>
        </div>
        
        {/* Campos de donante (solo visibles si no es anónimo) */}
        {!isAnonymous && (
          <>
            {/* Donor email (opcional) */}
            <div className="space-y-1">
              <label htmlFor="donorEmail" className="block text-sm font-medium">
                Email (opcional)
              </label>
              <input
                id="donorEmail"
                type="email"
                className={`w-full border-2 border-[#002C5B] py-2 px-3 ${
                  errors.donorEmail ? 'border-red-500' : ''
                }`}
                {...register('donorEmail', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido',
                  },
                })}
              />
              {errors.donorEmail && (
                <p className="text-red-500 text-sm">{errors.donorEmail.message}</p>
              )}
            </div>
            
            {/* Donor name (optional) */}
            <div className="space-y-1">
              <label htmlFor="donorName" className="block text-sm font-medium">
                Nombre (opcional)
              </label>
              <input
                id="donorName"
                type="text"
                className="w-full border-2 border-[#002C5B] py-2 px-3"
                {...register('donorName')}
              />
            </div>
          </>
        )}
        
        {/* Submit button */}
        <BrutalButton
          type="submit"
          className="w-full"
          disabled={isLoading || !watchAmount || watchAmount < 1}
        >
          {isLoading ? 'Procesando...' : 'Donar ahora'}
        </BrutalButton>
        
        <p className="text-xs text-gray-500 text-center">
          Al hacer clic en "Donar ahora", serás redirigido a MercadoPago para completar tu donación de forma segura.
        </p>
      </form>
    </div>
  );
}
