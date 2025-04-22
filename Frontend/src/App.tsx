import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BookDetails from './pages/BookDetails'
import SupportButton from './components/SupportButton'
import LoadingScreen from './components/LoadingScreen'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { LanguageProvider } from './contexts/LanguageContext'
export function App() {
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <LoadingScreen isLoading={isLoading} />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen w-full bg-white">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book/:id" element={<BookDetails />} />
              </Routes>
              <Footer />
              <SupportButton />
            </div>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
