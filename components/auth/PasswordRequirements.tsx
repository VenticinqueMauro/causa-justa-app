'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

export default function PasswordRequirements({ password }: PasswordRequirementsProps) {
  // Estado para cada requisito
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Actualizar el estado de los requisitos cuando cambia la contraseña
  useEffect(() => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&.]/.test(password),
    });
  }, [password]);

  // Función para renderizar un requisito con su estado
  const renderRequirement = (fulfilled: boolean, text: string) => (
    <li className="flex items-center gap-2 text-xs">
      {fulfilled ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          <span className="text-green-600">{text}</span>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <span className="text-gray-500">{text}</span>
        </>
      )}
    </li>
  );

  return (
    <div className="mt-2 text-xs text-[#002C5B]/70">
      <p className="mb-1">La contraseña debe cumplir con los siguientes requisitos:</p>
      <ul className="space-y-1">
        {renderRequirement(requirements.length, "Al menos 8 caracteres")}
        {renderRequirement(requirements.uppercase, "Al menos una letra mayúscula (A-Z)")}
        {renderRequirement(requirements.lowercase, "Al menos una letra minúscula (a-z)")}
        {renderRequirement(requirements.number, "Al menos un número (0-9)")}
        {renderRequirement(requirements.special, "Al menos un carácter especial (@, $, !, %, *, ?, &, .)")}
      </ul>
    </div>
  );
}
