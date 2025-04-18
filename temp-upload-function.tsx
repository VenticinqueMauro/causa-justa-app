// Subir imágenes al servidor
const uploadImages = async (campaignId?: string) => {
  if (selectedFiles.length === 0) return;
  
  setUploadingImages(true);
  
  try {
    console.log('Iniciando subida de imágenes...');
    const token = await getToken();
    if (!token) {
      throw new Error('No se pudo obtener el token de autenticación');
    }
    
    const formDataObj = new FormData();
    console.log(`Preparando ${selectedFiles.length} archivos para subir`);
    selectedFiles.forEach((file, index) => {
      console.log(`Archivo ${index + 1}: ${file.name} (${file.size} bytes)`);
      formDataObj.append('images', file);
    });
    
    // Si se proporciona un ID de campaña, añadirlo para organizar las imágenes
    if (campaignId) {
      console.log(`Usando campaignId: ${campaignId} para organizar imágenes`);
      formDataObj.append('campaignId', campaignId);
    }
    
    // Asegurarse de que la URL termine con /
    const baseUrl = process.env.NEXT_PUBLIC_NEST_API_URL || '';
    const apiUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
    const uploadUrl = `${apiUrl}campaigns/images/upload`;
    
    console.log(`Enviando petición a: ${uploadUrl}`);
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formDataObj,
    });
    
    console.log(`Respuesta recibida con estado: ${response.status}`);
    
    // Manejar errores específicos
    if (response.status === 429) {
      throw new Error('Has excedido el límite de solicitudes. Por favor, espera un momento e intenta nuevamente.');
    }
    
    if (response.status === 404) {
      throw new Error('Campaña no encontrada. Verifica el ID proporcionado.');
    }
    
    if (!response.ok) {
      // Intentar obtener el cuerpo de la respuesta para más detalles
      let responseText = '';
      try {
        responseText = await response.text();
        console.log('Respuesta de error completa:', responseText);
        
        // Intentar parsear como JSON si es posible
        const errorData = JSON.parse(responseText);
        const errorMessage = errorData?.message || `Error al subir imágenes: ${response.status}`;
        throw new Error(errorMessage);
      } catch (parseError) {
        // Si no se puede parsear como JSON, usar el texto crudo
        throw new Error(`Error al subir imágenes (${response.status}): ${responseText || 'Sin detalles disponibles'}`);
      }
    }
    
    // Parsear la respuesta exitosa
    let data;
    try {
      const responseText = await response.text();
      console.log('Respuesta exitosa:', responseText);
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear la respuesta:', parseError);
      throw new Error('Error al procesar la respuesta del servidor');
    }
    
    if (data.success && data.imageUrls) {
      setUploadedImages([...uploadedImages, ...data.imageUrls]);
      setFormData({
        ...formData,
        images: [...formData.images, ...data.imageUrls],
      });
      setSelectedFiles([]);
      
      // Mostrar mensaje con información de la carpeta si está disponible
      const folderInfo = data.folder ? ` (Guardadas en: ${data.folder})` : '';
      setToastMessage(`Imágenes subidas correctamente${folderInfo}`);
      setToastType('success');
      setShowToast(true);
    } else {
      throw new Error('No se recibieron URLs de imágenes del servidor');
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
