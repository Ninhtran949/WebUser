import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SupportButton from './components/SupportButton';
import HomePage from './pages/HomePage';
import BookDetails from './pages/BookDetails';
import CollectionPage from './pages/CollectionPage';
import UserAccount from './pages/UserAccount';
import OAuthSuccess from './pages/OAuthSuccess';
import ToastProvider from './components/ToastProvider';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <FavoriteProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <ToastProvider />
                <Routes>
                  <Route path="/oauth-success" element={<OAuthSuccess />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/book/:id" element={<BookDetails />} />
                  <Route path="/collection/:category" element={<CollectionPage />} />
                  <Route path="/account/*" element={<UserAccount />} />
                </Routes>
                <Footer />
                <SupportButton />
              </div>
            </FavoriteProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
