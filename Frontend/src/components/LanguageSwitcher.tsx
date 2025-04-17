import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
const LanguageSwitcher = () => {
  const {
    language,
    setLanguage
  } = useLanguage();
  return <div className="flex items-center bg-gray-100 rounded-full p-1">
      <button className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${language === 'en' ? 'bg-white text-blue-800 shadow-sm transform scale-105' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`} onClick={() => setLanguage('en')} aria-label="Switch to English">
        <span role="img" aria-label="English" className={`transform transition-transform duration-300 ${language === 'en' ? 'scale-110' : ''}`}>
          🇺🇸
        </span>
        <span className={`text-sm font-medium transition-colors duration-300 ${language === 'en' ? 'font-semibold' : ''}`}>
          EN
        </span>
      </button>
      <button className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300 ${language === 'vi' ? 'bg-white text-blue-800 shadow-sm transform scale-105' : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'}`} onClick={() => setLanguage('vi')} aria-label="Switch to Vietnamese">
        <span role="img" aria-label="Vietnamese" className={`transform transition-transform duration-300 ${language === 'vi' ? 'scale-110' : ''}`}>
          🇻🇳
        </span>
        <span className={`text-sm font-medium transition-colors duration-300 ${language === 'vi' ? 'font-semibold' : ''}`}>
          VI
        </span>
      </button>
    </div>;
};
export default LanguageSwitcher;