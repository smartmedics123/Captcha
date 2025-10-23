// utils/urlBuilder.js
export const buildUploadUrl = (filePath) => {
  if (!filePath) return null;
  
  // If already complete URL, return as is
  if (filePath.startsWith('http')) {
    return filePath;
  }
  
  // Get base URL from environment and construct upload URL
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL; // e.g., https://api.smartmedics.pk:8000/api
  
  // Extract domain and port, remove /api suffix
  let baseUrl;
  try {
    const url = new URL(apiBaseUrl);
    baseUrl = `${url.protocol}//${url.host}`; // https://api.smartmedics.pk:8000
  } catch (error) {
    console.error('Invalid API_BASE_URL:', apiBaseUrl);
    baseUrl = 'http://localhost:8000';
  }
  
  // Ensure proper path formatting
  const cleanPath = filePath.startsWith('/') ? filePath : `/${filePath}`;
  
  const fullUrl = `${baseUrl}${cleanPath}`;
  
  // Debug logging
  console.log('🔗 URL Builder Debug:', {
    originalPath: filePath,
    apiBaseUrl,
    extractedBaseUrl: baseUrl,
    cleanPath,
    finalUrl: fullUrl
  });
  
  return fullUrl;
};

// Specific function for prescription images
export const buildPrescriptionImageUrl = (imagePath) => {
  return buildUploadUrl(imagePath);
};

