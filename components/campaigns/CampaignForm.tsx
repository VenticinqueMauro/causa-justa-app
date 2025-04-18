'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import BrutalButton from '@/components/ui/BrutalButton';
import { CampaignCategory, CampaignFormData } from '@/types/campaign';
import { Toast } from '@/components/ui/Toast';
import { Loader2, Upload, X, Check } from 'lucide-react';

export default function CampaignForm() {
  const { getToken, user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('error');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugGenerated, setSlugGenerated] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState<CampaignFormData>({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    category: CampaignCategory.HEALTH,
    goalAmount: undefined,
    images: [],
    location: {
      city: '',
      province: '',
      country: 'Argentina',
    },
    recipient: {
      name: '',
      age: undefined,
      condition: '',
    },
    creator: {
      relation: '',
      contact: '',
    },
    tags: [],
  });
  
  // Estado para el monto formateado y cálculos de costos
  const [formattedAmount, setFormattedAmount] = useState('');
  const [costCalculation, setCostCalculation] = useState<{
    platformFee: number;
    mercadoPagoFee: number;
    totalNet: number;
  } | null>(null);
  
  // Valores de comisiones obtenidos del backend
  const [commissionRates, setCommissionRates] = useState({
    platformCommission: 0.05, // Valor por defecto: 5%
    mercadoPagoFee: 0.0405    // Valor por defecto: 4.05%
  });
  
  // Obtener las comisiones desde el endpoint público
  useEffect(() => {
    const fetchCommissionRates = async () => {
      try {
        // Asegurarse de que la URL termine con /
        const baseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
        const apiUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        
        const response = await fetch(`${apiUrl}campaigns/commission-rates`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Tasas de comisión obtenidas del backend:', data);
          
          setCommissionRates({
            platformCommission: data.platformCommission,
            mercadoPagoFee: data.mercadoPagoFee
          });
        }
      } catch (error) {
        console.error('Error al obtener tasas de comisión:', error);
        // Mantener los valores por defecto en caso de error
      }
    };
    
    fetchCommissionRates();
  }, []);

  // Formatear número con separadores de miles
  const formatNumber = (num: number | string | undefined): string => {
    if (num === undefined || num === '') return '';
    // Convertir a string y eliminar caracteres no numéricos
    const numStr = num.toString().replace(/[^0-9]/g, '');
    // Formatear con separadores de miles
    return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  
  // Convertir string formateado a número
  const parseFormattedNumber = (formattedValue: string): number | undefined => {
    if (!formattedValue) return undefined;
    // Eliminar todos los separadores y convertir a número
    const numStr = formattedValue.replace(/[^0-9]/g, '');
    return numStr ? parseInt(numStr) : undefined;
  };
  
  // Convertir número a palabras en español
  const numberToWords = (num: number | undefined): string => {
    if (num === undefined || num === 0) return '';
    
    const unidades = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const especiales = ['', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
    const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    
    const convertirGrupo = (n: number): string => {
      let resultado = '';
      
      // Manejar centenas
      if (n >= 100) {
        if (n === 100) {
          return 'cien';
        }
        resultado += centenas[Math.floor(n / 100)] + ' ';
        n %= 100;
      }
      
      // Manejar decenas y unidades
      if (n > 0) {
        if (n < 10) {
          resultado += unidades[n];
        } else if (n < 20) {
          resultado += especiales[n - 10];
        } else {
          const unidad = n % 10;
          if (n === 20) {
            resultado += 'veinte';
          } else if (n < 30) {
            resultado += 'veinti' + unidades[unidad];
          } else {
            resultado += decenas[Math.floor(n / 10)];
            if (unidad > 0) {
              resultado += ' y ' + unidades[unidad];
            }
          }
        }
      }
      
      return resultado.trim();
    };
    
    if (num === 1) return 'un peso argentino';
    if (num === 1000000) return 'un millón de pesos argentinos';
    if (num === 1000000000) return 'mil millones de pesos argentinos';
    
    let resultado = '';
    
    // Manejar miles de millones
    if (num >= 1000000000) {
      const miles = Math.floor(num / 1000000000);
      if (miles === 1) {
        resultado += 'mil';
      } else {
        resultado += convertirGrupo(miles) + ' mil';
      }
      resultado += ' millones';
      num %= 1000000000;
      if (num > 0) resultado += ' ';
    }
    
    // Manejar millones
    if (num >= 1000000) {
      const millones = Math.floor(num / 1000000);
      if (millones === 1) {
        resultado += 'un millón';
      } else {
        resultado += convertirGrupo(millones) + ' millones';
      }
      num %= 1000000;
      if (num > 0) resultado += ' ';
    }
    
    // Manejar miles
    if (num >= 1000) {
      const miles = Math.floor(num / 1000);
      if (miles === 1) {
        resultado += 'mil';
      } else {
        resultado += convertirGrupo(miles) + ' mil';
      }
      num %= 1000;
      if (num > 0) resultado += ' ';
    }
    
    // Manejar el resto
    if (num > 0) {
      resultado += convertirGrupo(num);
    }
    
    return resultado.trim() + ' pesos argentinos';
  };
  
  // Calcular costos basados en el monto
  const calculateCosts = (amount: number | undefined) => {
    if (!amount || amount <= 0) {
      setCostCalculation(null);
      return;
    }
    
    // Cálculo de comisiones usando los valores obtenidos del backend
    const platformFee = Math.round(amount * commissionRates.platformCommission);
    const mercadoPagoFee = Math.round(amount * commissionRates.mercadoPagoFee);
    const totalNet = amount - platformFee - mercadoPagoFee;
    
    setCostCalculation({
      platformFee,
      mercadoPagoFee,
      totalNet
    });
  };
  
  // Manejar cambio específico para el monto
  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Actualizar el valor formateado
    const cleanValue = value.replace(/[^0-9]/g, '');
    setFormattedAmount(formatNumber(cleanValue));
    
    // Convertir a número
    const numericValue = cleanValue ? parseInt(cleanValue) : undefined;
    
    // Actualizar el valor numérico en el formData
    setFormData({
      ...formData,
      goalAmount: numericValue,
    });
    
    // Calcular costos
    calculateCosts(numericValue);
  };
  
  // Manejar cambios en campos simples
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Manejar campos anidados (location, recipient, creator)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      
      if (parent === 'location') {
        setFormData({
          ...formData,
          location: {
            ...formData.location,
            [child]: value,
          },
        });
      } else if (parent === 'recipient') {
        setFormData({
          ...formData,
          recipient: {
            ...formData.recipient,
            [child]: child === 'age' ? (value ? parseInt(value) : undefined) : value,
          },
        });
      } else if (parent === 'creator') {
        setFormData({
          ...formData,
          creator: {
            ...formData.creator,
            [child]: value,
          },
        });
      }
    } else {
      // Manejar campos normales (excepto goalAmount que tiene su propio handler)
      if (name !== 'goalAmount') {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    }

    // Limpiar error del campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Generar slug a partir del título
  useEffect(() => {
    if (formData.title && !slugGenerated) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      setFormData({
        ...formData,
        slug,
      });
    }
  }, [formData.title, slugGenerated]);
  
  // Inicializar el monto formateado cuando cambia el valor numérico
  useEffect(() => {
    setFormattedAmount(formatNumber(formData.goalAmount));
  }, [formData.goalAmount]);

  // Manejar cambio de slug manualmente
  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlugGenerated(true);
    handleChange(e);
  };
  
  // Autocompletar datos del creador con información del usuario
  const autoCompleteCreatorInfo = () => {
    if (user) {
      setFormData({
        ...formData,
        creator: {
          ...formData.creator,
          contact: user.email,
          relation: formData.creator.relation || 'Yo mismo' // Mantener la relación si ya existe, o usar 'Yo mismo'
        }
      });
      
      setToastMessage('Datos de contacto completados automáticamente');
      setToastType('success');
      setShowToast(true);
    }
  };

  // Manejar cambios en el input de etiquetas
  const [tagInput, setTagInput] = useState('');

  // Agregar una nueva etiqueta
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    // Evitar duplicados
    if (formData.tags?.includes(tagInput.trim())) {
      setTagInput('');
      return;
    }
    
    setFormData({
      ...formData,
      tags: [...(formData.tags || []), tagInput.trim()],
    });
    setTagInput('');
  };
  
  // Eliminar una etiqueta
  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter(tag => tag !== tagToRemove) || [],
    });
  };
  
  // Manejar tecla Enter para agregar etiqueta
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evitar envío del formulario
      addTag();
    }
  };

  // Manejar selección de archivos
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      
      // Validar número máximo de imágenes (5)
      if (files.length + uploadedImages.length > 5) {
        setToastMessage('Máximo 5 imágenes permitidas');
        setToastType('error');
        setShowToast(true);
        return;
      }
      
      // Validar tamaño máximo por imagen (5MB)
      const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
      if (invalidFiles.length > 0) {
        setToastMessage('Una o más imágenes exceden el tamaño máximo de 5MB');
        setToastType('error');
        setShowToast(true);
        return;
      }
      
      setSelectedFiles([...selectedFiles, ...files]);
    }
  };

  // Eliminar archivo seleccionado
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Eliminar imagen ya subida
  const removeUploadedImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  // Subir imágenes al servidor
  const uploadImages = async (campaignId?: string) => {
    if (selectedFiles.length === 0) return;
    
    // Verificar cantidad máxima de imágenes
    if (selectedFiles.length > 5) {
      setToastMessage('Solo puedes subir un máximo de 5 imágenes a la vez');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    // Verificar formato y tamaño de archivos antes de intentar subirlos
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    
    // Validar cada archivo
    const invalidFiles = [];
    for (const file of selectedFiles) {
      // Validar formato
      if (!validFormats.includes(file.type)) {
        invalidFiles.push(`${file.name} (formato no válido: ${file.type})`);
        continue;
      }
      
      // Validar tamaño
      if (file.size > maxSize) {
        invalidFiles.push(`${file.name} (excede los 5MB: ${Math.round(file.size / 1024 / 1024 * 10) / 10}MB)`);
      }
    }
    
    // Si hay archivos inválidos, mostrar error y no continuar
    if (invalidFiles.length > 0) {
      const errorMsg = `No se pueden subir los siguientes archivos:\n${invalidFiles.join('\n')}`;
      setToastMessage(errorMsg);
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    setUploadingImages(true);
    
    try {
      console.log('Iniciando subida de imágenes...');
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      // Crear FormData exactamente como lo espera el backend
      const formData = new FormData();
      
      // Añadir cada imagen con el mismo nombre de campo 'images'
      // tal como lo especifica la documentación del backend
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });
      
      // Logging para depuración
      console.log(`FormData creado con ${selectedFiles.length} imágenes`);
      
      // Si se proporciona un ID de campaña, añadirlo para organizar las imágenes
      if (campaignId) {
        formData.append('campaignId', campaignId);
        console.log(`Usando campaignId: ${campaignId} para organizar imágenes`);
      }
      
      // Asegurarse de que la URL termine con /
      const baseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
      const apiUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const uploadUrl = `${apiUrl}campaigns/images/upload`;
      
      console.log(`Enviando petición a: ${uploadUrl}`);
      console.log(`Total de imágenes a subir: ${selectedFiles.length}`);
      
      // Importante: No incluir Content-Type en las peticiones con FormData
      // El navegador lo establecerá automáticamente con el boundary correcto
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          // No incluir Content-Type aquí para que el navegador lo maneje
        },
        body: formData,
        credentials: 'include', // Incluir credenciales en la petición
      });
      
      console.log(`Respuesta recibida con estado: ${response.status}`);
      
      // Manejar errores específicos según la documentación
      if (response.status === 429) {
        throw new Error('Has excedido el límite de solicitudes (15 por minuto). Por favor, espera un momento e intenta nuevamente.');
      }
      
      if (response.status === 404) {
        throw new Error('Campaña no encontrada. Verifica el ID proporcionado.');
      }
      
      // Manejar otros errores
      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.error('Error del servidor:', errorData);
          throw new Error(errorData.message || `Error al subir imágenes (${response.status})`);
        } catch (parseError) {
          // Si no se puede parsear como JSON, obtener el texto de la respuesta
          const responseText = await response.text().catch(() => 'Sin detalles disponibles');
          console.error('Respuesta de error (texto):', responseText);
          throw new Error(`Error al subir imágenes (${response.status}): ${responseText}`);
        }
      }
      
      // Procesar respuesta exitosa
      try {
        const data = await response.json();
        console.log('Respuesta exitosa:', data);
        
        if (data.success && data.imageUrls && data.imageUrls.length > 0) {
          // Actualizar el estado con las URLs de las imágenes
          setUploadedImages([...uploadedImages, ...data.imageUrls]);
          
          // Actualizar el formulario con las nuevas imágenes
          setFormData(prevFormData => ({
            ...prevFormData,
            images: [...prevFormData.images, ...data.imageUrls],
          }));
          
          // Limpiar los archivos seleccionados
          setSelectedFiles([]);
          
          // Mostrar mensaje de éxito con información de la carpeta
          const folderInfo = data.folder ? ` (Guardadas en: ${data.folder})` : '';
          setToastMessage(`${data.imageUrls.length} ${data.imageUrls.length === 1 ? 'imagen subida' : 'imágenes subidas'} correctamente${folderInfo}`);
          setToastType('success');
          setShowToast(true);
        } else {
          throw new Error('No se recibieron URLs de imágenes del servidor');
        }
      } catch (error) {
        console.error('Error al procesar la respuesta:', error);
        throw new Error('Error al procesar la respuesta del servidor');
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      
      // Mejorar el mensaje de error para proporcionar más información
      let errorMessage = 'Error al subir imágenes. Intenta nuevamente.';
      
      if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
        console.log('Detalles del error:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      } else {
        console.log('Error no estándar:', error);
      }
      
      setToastMessage(errorMessage);
      setToastType('error');
      setShowToast(true);
    } finally {
      setUploadingImages(false);
    }
  };
  
  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar campos obligatorios
    if (!formData.title) newErrors['title'] = 'El título es obligatorio';
    if (!formData.slug) newErrors['slug'] = 'El slug es obligatorio';
    if (!formData.description) newErrors['description'] = 'La descripción es obligatoria';
    if (!formData.shortDescription) newErrors['shortDescription'] = 'La descripción corta es obligatoria';
    if (!formData.location.city) newErrors['location.city'] = 'La ciudad es obligatoria';
    if (!formData.location.province) newErrors['location.province'] = 'La provincia es obligatoria';
    if (!formData.location.country) newErrors['location.country'] = 'El país es obligatorio';
    if (!formData.recipient.name) newErrors['recipient.name'] = 'El nombre del beneficiario es obligatorio';
    if (!formData.recipient.condition) newErrors['recipient.condition'] = 'La condición del beneficiario es obligatoria';
    if (!formData.creator.relation) newErrors['creator.relation'] = 'La relación con el beneficiario es obligatoria';
    if (!formData.creator.contact) newErrors['creator.contact'] = 'El contacto es obligatorio';
    
    // Validar que haya al menos una imagen
    if (formData.images.length === 0) {
      newErrors['images'] = 'Debes subir al menos una imagen';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
      setToastMessage('Por favor, completa todos los campos obligatorios');
      setToastType('error');
      setShowToast(true);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No se pudo obtener el token de autenticación');
      }
      
      // Asegurarse de que la URL termine con /
      const baseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
      const apiUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      
      const response = await fetch(`${apiUrl}campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      
      if (response.status === 409) {
        setErrors({
          ...errors,
          slug: 'Este slug ya está en uso. Por favor, elige otro.',
        });
        throw new Error('Slug duplicado');
      }
      
      if (!response.ok) {
        throw new Error(`Error al crear campaña: ${response.status}`);
      }
      
      const data = await response.json();
      
      setToastMessage('Campaña creada exitosamente. Será revisada por nuestro equipo.');
      setToastType('success');
      setShowToast(true);
      
      // Redirigir después de un breve retraso
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Error al crear campaña:', error);
      
      if ((error as Error).message !== 'Slug duplicado') {
        setToastMessage('Error al crear campaña. Intenta nuevamente.');
        setToastType('error');
        setShowToast(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Información básica */}
      <div className="border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] p-6 bg-white">
        <h2 className="text-xl font-bold text-[#002C5B] mb-4">Información básica</h2>
        
        <div className="space-y-4">
          {/* Título */}
          <div>
            <label htmlFor="title" className="block text-[#002C5B] font-medium mb-1">
              Título de la campaña *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors.title ? 'border-red-500' : 'border-[#002C5B]'}`}
              placeholder="Ej: Ayuda para Juan Pérez"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>
          
          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-[#002C5B] font-medium mb-1">
              URL personalizada *
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">porunacausajusta.org/campana/</span>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleSlugChange}
                className={`flex-1 p-2 border-2 ${errors.slug ? 'border-red-500' : 'border-[#002C5B]'}`}
                placeholder="ayuda-para-juan-perez"
              />
            </div>
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug}</p>}
            <p className="text-gray-500 text-sm mt-1">
              La URL se genera automáticamente a partir del título, pero puedes personalizarla.
            </p>
          </div>
          
          {/* Categoría */}
          <div>
            <label htmlFor="category" className="block text-[#002C5B] font-medium mb-1">
              Categoría *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-2 border-2 border-[#002C5B]"
            >
              <option value={CampaignCategory.HEALTH}>Salud</option>
              <option value={CampaignCategory.EDUCATION}>Educación</option>
              <option value={CampaignCategory.FOOD}>Alimentación</option>
              <option value={CampaignCategory.PEOPLE}>Personas</option>
              <option value={CampaignCategory.OTHERS}>Otras</option>
            </select>
          </div>
          
          {/* Monto objetivo */}
          <div>
            <label htmlFor="goalAmount" className="block text-[#002C5B] font-medium mb-1">
              Monto objetivo (opcional)
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">$</span>
              <input
                type="text"
                id="goalAmount"
                name="goalAmount"
                value={formattedAmount}
                onChange={handleAmountChange}
                className="flex-1 p-2 border-2 border-[#002C5B]"
                placeholder="50.000"
              />
            </div>
            <div className="mt-1 space-y-1">
              {formData.goalAmount && formData.goalAmount > 0 && (
                <p className="text-[#002C5B] text-sm font-medium italic">
                  {numberToWords(formData.goalAmount)}
                </p>
              )}
              
              {costCalculation && (
                <div className="mt-3 p-3 bg-gray-50 border border-[#002C5B] rounded">
                  <h4 className="text-sm font-bold text-[#002C5B] mb-2">Desglose estimado:</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Monto bruto:</span>
                      <span className="font-medium">${formatNumber(formData.goalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>- Comisión de Mercado Pago ({(commissionRates.mercadoPagoFee * 100).toFixed(2)}%):</span>
                      <span>-${formatNumber(costCalculation.mercadoPagoFee)}</span>
                    </div>
                    <div className="flex justify-between text-red-500">
                      <span>- Comisión de plataforma ({(commissionRates.platformCommission * 100).toFixed(2)}%):</span>
                      <span>-${formatNumber(costCalculation.platformFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-[#002C5B] pt-1 mt-1">
                      <span>Monto neto estimado:</span>
                      <span className="text-green-600">${formatNumber(costCalculation.totalNet)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-gray-500 text-sm">
                Deja en blanco si no tienes un monto específico.
              </p>
            </div>
          </div>
          
          {/* Descripción corta */}
          <div>
            <label htmlFor="shortDescription" className="block text-[#002C5B] font-medium mb-1">
              Descripción corta *
            </label>
            <input
              type="text"
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors.shortDescription ? 'border-red-500' : 'border-[#002C5B]'}`}
              placeholder="Breve descripción para listados (máx. 100 caracteres)"
              maxLength={100}
            />
            {errors.shortDescription && <p className="text-red-500 text-sm mt-1">{errors.shortDescription}</p>}
          </div>
          
          {/* Descripción completa */}
          <div>
            <label htmlFor="description" className="block text-[#002C5B] font-medium mb-1">
              Descripción completa *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors.description ? 'border-red-500' : 'border-[#002C5B]'} min-h-[150px]`}
              placeholder="Describe detalladamente la situación y por qué necesitas ayuda..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          
          {/* Tags */}
          <div>
            <label htmlFor="tagInput" className="block text-[#002C5B] font-medium mb-1">
              Etiquetas (opcional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags && formData.tags.length > 0 && formData.tags.map((tag, index) => (
                <div 
                  key={index} 
                  className="flex items-center bg-[#EDFCA7] px-2 py-1 rounded border border-[#002C5B]"
                >
                  <span className="text-sm text-[#002C5B] mr-1">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-[#002C5B] hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="flex-1 p-2 border-2 border-[#002C5B] rounded-l"
                placeholder="Escribe una etiqueta y presiona Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-[#002C5B] text-white px-3 rounded-r border-2 border-[#002C5B] hover:bg-[#002C5B]/90"
              >
                Agregar
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Escribe una etiqueta y presiona Enter o el botón Agregar.
            </p>
          </div>
        </div>
      </div>
      
      {/* Ubicación */}
      <div className="border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] p-6 bg-white">
        <h2 className="text-xl font-bold text-[#002C5B] mb-4">Ubicación</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ciudad */}
          <div>
            <label htmlFor="location.city" className="block text-[#002C5B] font-medium mb-1">
              Ciudad *
            </label>
            <input
              type="text"
              id="location.city"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors['location.city'] ? 'border-red-500' : 'border-[#002C5B]'}`}
              placeholder="Buenos Aires"
            />
            {errors['location.city'] && <p className="text-red-500 text-sm mt-1">{errors['location.city']}</p>}
          </div>
          
          {/* Provincia */}
          <div>
            <label htmlFor="location.province" className="block text-[#002C5B] font-medium mb-1">
              Provincia *
            </label>
            <input
              type="text"
              id="location.province"
              name="location.province"
              value={formData.location.province}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors['location.province'] ? 'border-red-500' : 'border-[#002C5B]'}`}
              placeholder="CABA"
            />
            {errors['location.province'] && <p className="text-red-500 text-sm mt-1">{errors['location.province']}</p>}
          </div>
          
          {/* País */}
          <div className="md:col-span-2">
            <label htmlFor="location.country" className="block text-[#002C5B] font-medium mb-1">
              País *
            </label>
            <input
              type="text"
              id="location.country"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors['location.country'] ? 'border-red-500' : 'border-[#002C5B]'}`}
              placeholder="Argentina"
            />
            {errors['location.country'] && <p className="text-red-500 text-sm mt-1">{errors['location.country']}</p>}
          </div>
        </div>
      </div>
      
      {/* Beneficiario */}
      <div className="border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] p-6 bg-white">
        <h2 className="text-xl font-bold text-[#002C5B] mb-4">Información del beneficiario</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nombre */}
          <div>
            <label htmlFor="recipient.name" className="block text-[#002C5B] font-medium mb-1">
              Nombre completo *
            </label>
            <input
              type="text"
              id="recipient.name"
              name="recipient.name"
              value={formData.recipient.name}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors['recipient.name'] ? 'border-red-500' : 'border-[#002C5B]'}`}
              placeholder="Juan Pérez"
            />
            {errors['recipient.name'] && <p className="text-red-500 text-sm mt-1">{errors['recipient.name']}</p>}
          </div>
          
          {/* Edad */}
          <div>
            <label htmlFor="recipient.age" className="block text-[#002C5B] font-medium mb-1">
              Edad (opcional)
            </label>
            <input
              type="number"
              id="recipient.age"
              name="recipient.age"
              value={formData.recipient.age || ''}
              onChange={handleChange}
              className="w-full p-2 border-2 border-[#002C5B]"
              placeholder="35"
              min="0"
              max="120"
            />
          </div>
          
          {/* Condición */}
          <div className="md:col-span-2">
            <label htmlFor="recipient.condition" className="block text-[#002C5B] font-medium mb-1">
              Condición o situación *
            </label>
            <textarea
              id="recipient.condition"
              name="recipient.condition"
              value={formData.recipient.condition}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors['recipient.condition'] ? 'border-red-500' : 'border-[#002C5B]'} min-h-[80px]`}
              placeholder="Describe la condición o situación del beneficiario"
            />
            {errors['recipient.condition'] && <p className="text-red-500 text-sm mt-1">{errors['recipient.condition']}</p>}
          </div>
        </div>
      </div>
      
      {/* Creador */}
      <div className="border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#002C5B]">Información del creador</h2>
          
          <button
            type="button"
            onClick={autoCompleteCreatorInfo}
            className="text-sm text-[#002C5B] border border-[#002C5B] px-3 py-1 rounded hover:bg-[#EDFCA7] transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Usar mis datos
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Relación */}
          <div>
            <label htmlFor="creator.relation" className="block text-[#002C5B] font-medium mb-1">
              Relación con el beneficiario *
            </label>
            <input
              type="text"
              id="creator.relation"
              name="creator.relation"
              value={formData.creator.relation}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors['creator.relation'] ? 'border-red-500' : 'border-[#002C5B]'}`}
              placeholder="Familiar, Amigo, Organización, etc."
            />
            {errors['creator.relation'] && <p className="text-red-500 text-sm mt-1">{errors['creator.relation']}</p>}
          </div>
          
          {/* Contacto */}
          <div>
            <label htmlFor="creator.contact" className="block text-[#002C5B] font-medium mb-1">
              Email de contacto *
            </label>
            <input
              type="email"
              id="creator.contact"
              name="creator.contact"
              value={formData.creator.contact}
              onChange={handleChange}
              className={`w-full p-2 border-2 ${errors['creator.contact'] ? 'border-red-500' : 'border-[#002C5B]'}`}
              placeholder="contacto@email.com"
            />
            {errors['creator.contact'] && <p className="text-red-500 text-sm mt-1">{errors['creator.contact']}</p>}
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mt-2">
          Puedes usar el botón "Usar mis datos" para completar automáticamente con tu información.
        </p>
      </div>
      
      {/* Imágenes */}
      <div className="border-2 border-[#002C5B] shadow-[5px_5px_0_0_rgba(0,44,91,0.8)] p-6 bg-white">
        <h2 className="text-xl font-bold text-[#002C5B] mb-4">Imágenes</h2>
        
        <div className="space-y-4">
          {/* Selector de archivos */}
          <div>
            <label htmlFor="images" className="block text-[#002C5B] font-medium mb-1">
              Seleccionar imágenes *
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/jpeg,image/png,image/gif,image/jpg"
              multiple
            />
            <div className="flex flex-col space-y-2">
              <label
                htmlFor="images"
                className="cursor-pointer border-2 border-dashed border-[#002C5B] p-4 text-center hover:bg-gray-50"
              >
                <Upload className="h-6 w-6 mx-auto mb-2 text-[#002C5B]" />
                <span className="text-[#002C5B]">Haz clic para seleccionar imágenes</span>
                <p className="text-gray-500 text-sm">
                  Máximo 5 imágenes, 5MB por imagen. Formatos: JPG, JPEG, PNG, GIF
                </p>
              </label>
              
              {/* Botón para subir imágenes */}
              {selectedFiles.length > 0 && (
                <BrutalButton
                  type="button"
                  onClick={() => uploadImages()}
                  disabled={uploadingImages}
                  className="mt-2 flex items-center justify-center w-fit"
                >
                  {uploadingImages ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir {selectedFiles.length} {selectedFiles.length === 1 ? 'imagen' : 'imágenes'}
                    </>
                  )}
                </BrutalButton>
              )}
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-1">{errors.images}</p>}
          </div>
          
          {/* Archivos seleccionados */}
          {selectedFiles.length > 0 && (
            <div>
              <h3 className="text-[#002C5B] font-medium mb-2">Imágenes seleccionadas:</h3>
              <ul className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between border p-2">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeSelectedFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Imágenes ya subidas */}
          {uploadedImages.length > 0 && (
            <div>
              <h3 className="text-[#002C5B] font-medium mb-2">Imágenes subidas:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {uploadedImages.map((url, index) => (
                  <div key={index} className="relative border-2 border-[#002C5B] p-1">
                    <img src={url} alt={`Imagen ${index + 1}`} className="w-full h-32 object-cover" />
                    <button
                      type="button"
                      onClick={() => removeUploadedImage(index)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <BrutalButton
          type="button"
          variant="outline"
          onClick={() => router.push('/')}
        >
          Cancelar
        </BrutalButton>
        
        <BrutalButton
          type="submit"
          size='sm'
          className='flex items-center justify-center'
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creando campaña...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Crear campaña
            </>
          )}
        </BrutalButton>
      </div>
      
      {/* Toast */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </form>
  );
}
