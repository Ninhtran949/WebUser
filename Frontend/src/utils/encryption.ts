import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'your-secret-key'; // Thêm fallback key

export const decryptData = (encryptedData: string): string => {
  if (!encryptedData) return '';
  
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted || encryptedData; // Trả về dữ liệu gốc nếu giải mã thất bại
  } catch (error) {
    console.error('Decryption error:', error);
    return encryptedData; // Trả về dữ liệu gốc nếu có lỗi
  }
};