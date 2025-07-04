import { useEffect, useState } from 'react';
import { MenuIcon, SearchIcon, UserIcon, ShoppingCartIcon, LogOutIcon, HomeIcon, HeartIcon, BookmarkIcon } from 'lucide-react';
import SignInDialog from './SignInDialog';
import CategoryDropdown from './CategoryDropdown';
import CartDialog from './CartDialog';
import FavoriteDialog from './FavoriteDialog';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [isCartDialogOpen, setIsCartDialogOpen] = useState(false);
  const [isFavoriteDialogOpen, setIsFavoriteDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { favoriteCount } = useFavorites();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const handleCategoryHover = (category: string) => {
    setActiveCategory(category);
  };
  const handleCategoryLeave = () => {
    setActiveCategory(null);
  };
  const handleCartClick = () => {
    setIsCartDialogOpen(true);
  };
  const handleFavoriteClick = () => {
    setIsFavoriteDialogOpen(true);
  };
  // Chỉ còn menu collection, dùng key dịch
  const navigationItems = [
    {
      title: t('collection.literature'),
      category: 'literature',
      featuredCategories: [],
      subcategories: [],
    },
    {
      title: t('collection.economics'),
      category: 'economics',
      featuredCategories: [],
      subcategories: [],
    },
    {
      title: t('collection.psychology'),
      category: 'psychology',
      featuredCategories: [],
      subcategories: [],
    },
    {
      title: t('collection.education'),
      category: 'education',
      featuredCategories: [],
      subcategories: [],
    },
    {
      title: t('collection.childrensBooks'),
      category: 'childrensBooks',
      featuredCategories: [],
      subcategories: [],
    },
    {
      title: t('collection.memoir'),
      category: 'memoir',
      featuredCategories: [],
      subcategories: [],
    },
    {
      title: t('collection.textbooks'),
      category: 'textbooks',
      featuredCategories: [],
      subcategories: [],
    },
    {
      title: t('collection.foreignLanguages'),
      category: 'foreignLanguages',
      featuredCategories: [],
      subcategories: [],
    },
  ];

  return (
    <>
      <header className={`w-full bg-white border-b border-gray-200 ${isScrolled ? 'sticky top-0 shadow-md z-50 transition-all duration-300' : ''}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <button className="mr-4 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              <MenuIcon size={20} />
            </button>
            <Link to="/" className="flex items-center group">
              <img src="/logo.png" className="mr-3 w-8 h-8 transition-all duration-300 group-hover:scale-110 drop-shadow-md" alt="Bookify Logo" />
              <div className="relative">
                <span className="text-3xl font-bold text-blue-800 tracking-wide relative">
                  <span className="relative z-10">Book</span>
                  <span className="text-2xl font-light text-blue-600 italic relative z-10">ify</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg -m-2 -z-10"></div>
                </span>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-400 group-hover:w-full transition-all duration-500"></div>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex flex-grow max-w-xl mx-8">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder={t('search.placeholder')} 
                className="w-full border border-gray-300 rounded-full py-2.5 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                aria-label="Search" 
              />
              <button className="absolute right-3 top-2.5" aria-label="Submit search">
                <SearchIcon size={20} className="text-gray-500" />
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:block scale-75 origin-right">
              <LanguageSwitcher />
            </div>
            <button className="md:hidden p-2" aria-label="Search">
              <SearchIcon size={18} />
            </button>
            <Link to="/" className="hidden md:flex hover:text-blue-800 items-center p-2">
              <HomeIcon size={18} />
            </Link>
            <button 
              className="hidden md:flex hover:text-blue-800 items-center relative p-2" 
              onClick={handleFavoriteClick}
              aria-label={`Favorites with ${favoriteCount} items`}
            >
              <HeartIcon size={18} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} 
                className="hover:text-blue-800 flex items-center p-2" 
                aria-label="User menu" 
                aria-expanded={isUserMenuOpen}
              >
                <UserIcon size={18} />
                {isAuthenticated && (
                  <span className="ml-2 text-sm hidden sm:inline">
                    {user?.name}
                  </span>
                )}
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.phoneNumber}</p>
                      </div>
                      <div className="py-1">
                        <Link to="/account/profile" className="w-full text-left px-4 py-2 hover:bg-gray-100 block">
                          My Account
                        </Link>
                        <Link to="/account/orders" className="w-full text-left px-4 py-2 hover:bg-gray-100 block">
                          Order History
                        </Link>
                        <Link to="/account/favorites" className="w-full text-left px-4 py-2 hover:bg-gray-100 block">
                          Saved Items
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button 
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }} 
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-600"
                        >
                          <LogOutIcon size={16} className="mr-2" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-3 text-center border-b border-gray-100">
                        <p className="font-medium">Welcome to Bookify</p>
                        <p className="text-xs text-gray-500">
                          Sign in to access your account
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setIsSignInDialogOpen(true);
                          setIsUserMenuOpen(false);
                        }} 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                      >
                        <UserIcon size={16} className="mr-2 text-blue-800" />
                        Sign In
                      </button>
                      <button 
                        onClick={() => {
                          setIsSignInDialogOpen(true);
                          setIsUserMenuOpen(false);
                        }} 
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                      >
                        <BookmarkIcon size={16} className="mr-2 text-blue-800" />
                        Create an Account
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <button 
              className="relative hover:text-blue-800 transition-colors p-2" 
              onClick={handleCartClick} 
              aria-label={`Shopping cart with ${itemCount} items`}
            >
              <ShoppingCartIcon size={18} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu: chỉ còn menu collection mới */}
        <nav className="hidden md:block bg-white text-gray-800 relative z-30" onMouseLeave={handleCategoryLeave}>
          <div className="max-w-7xl mx-auto">
            <ul className="flex justify-between items-stretch h-12">
              {navigationItems.map(item => (
                <li 
                  key={item.category} 
                  className="relative h-full" 
                  onMouseEnter={() => handleCategoryHover(item.category)}
                >
                  <div className="h-full flex items-center px-4">
                    <Link 
                      to={`/collection/${item.category}`}
                      className="flex items-center h-full hover:text-blue-800 transition-colors font-medium"
                    >
                      {item.title}
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {activeCategory && (
            <div className="absolute left-0 right-0 w-full shadow-lg z-40">
              {navigationItems.map(item => 
                activeCategory === item.category && (
                  <CategoryDropdown 
                    key={item.category} 
                    category={item.category} 
                    title={item.title} 
                    featuredCategories={item.featuredCategories} 
                    subcategories={item.subcategories} 
                  />
                )
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
            <div className="p-4">
              <div className="relative mb-4">
                <input 
                  type="text" 
                  placeholder={t('search.placeholder')} 
                  className="w-full border border-gray-300 rounded-full py-2 px-4 pr-10" 
                />
                <button className="absolute right-3 top-2.5">
                  <SearchIcon size={18} className="text-gray-500" />
                </button>
              </div>
              <nav>
                <ul className="space-y-3">
                  {navigationItems.map(item => (
                    <li key={item.category} className="py-2">
                      <Link to={`/collection/${item.category}`}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        )}
      </header>

      <CartDialog isOpen={isCartDialogOpen} onClose={() => setIsCartDialogOpen(false)} />
      <SignInDialog isOpen={isSignInDialogOpen} onClose={() => setIsSignInDialogOpen(false)} />
      <FavoriteDialog isOpen={isFavoriteDialogOpen} onClose={() => setIsFavoriteDialogOpen(false)} />
    </>
  );
};

export default Header;