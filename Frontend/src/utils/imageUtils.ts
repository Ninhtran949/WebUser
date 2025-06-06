export const isValidBase64Image = (str: string): boolean => {
  try {
    return str.startsWith('data:image') || str.startsWith('/9j') || str.startsWith('9j');
  } catch {
    return false;
  }
};

export const getFallbackImage = (): string => {
  return '/images/default-book.jpg';
};

export const validateAndProcessImage = (imageData: string): string => {
  if (!imageData) {
    console.log('No image data provided');
    return getFallbackImage();
  }

  // Nếu đã là data:image thì return luôn
  if (imageData.startsWith('data:image')) {
    return imageData;
  }

  // Nếu là URL thì return luôn  
  if (imageData.startsWith('http')) {
    return imageData;
  }

  // Xử lý raw base64 
  try {
    // Kiểm tra cả 2 trường hợp /9j và 9j
    if (imageData.startsWith('/9j') || imageData.startsWith('9j')) {
      // Giữ nguyên cả dấu / nếu có
      return `data:image/jpeg;base64,${imageData}`;
    }

    console.log('Invalid base64 format:', imageData.substring(0, 50));
    return getFallbackImage();

  } catch (error) {
    console.error('Error processing image:', error);
    return getFallbackImage();
  }
};