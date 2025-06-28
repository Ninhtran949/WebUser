import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import CategorySection from '../components/CategorySection';
import PromotionalBanner from '../components/PromotionalBanner';
import { Book, APIBook } from '../data/books';
import { BookOpenIcon, TrendingUpIcon, SparklesIcon, UsersIcon } from 'lucide-react';
import { ChevronRightIcon } from 'lucide-react';
import {
  getBestsellerBooks,
  getTrendingBooks,
  getFeaturedBooks,
  getNewArrivals,
  getChildrensBooks
} from '../services/bookService';
import { useNavigate } from 'react-router-dom';


const HomePage = () => {
  const [bestsellerBooks, setBestsellerBooks] = useState<Book[]>([]); // using react hook useState để quản lý trạng thái của bestsellerBooks
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [childrensBooks, setChildrensBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<null | 'success' | 'error'>(null);
  const navigate = useNavigate()

  const transformAPIBook = (book: APIBook): Book => ({
    _id: book._id,
    id: book._id,
    title: book.productId?.nameProduct || book.title || 'Untitled',
    author: book.productId?.userPartner || book.author || 'Unknown',
    price: parseFloat(book.productId?.priceProduct || '0'),
    coverImage: book.productId?.imgProduct || '',
    category: book.category || 'Uncategorized',
    productId: book.productId || null,  // Changed from undefined to null
    isbn13: book.isbn13 || '',
    publisher: book.publisher || '',
    publicationDate: book.publicationDate || new Date().toISOString(),
    pages: book.pages || 0,
    overview: book.overview || '',
    editorialReviews: book.editorialReviews || [],
    customerReviews: book.customerReviews || []
  });

  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        setLoading(true);
        const [bestsellers, trending, featured, newArrivalsData, childrens] = await Promise.all([
          getBestsellerBooks(),
          getTrendingBooks(),
          getFeaturedBooks(),
          getNewArrivals(),
          getChildrensBooks()
        ]);

        setBestsellerBooks(bestsellers.map(transformAPIBook));
        setTrendingBooks(trending.map(transformAPIBook));
        setFeaturedBooks(featured.map(transformAPIBook));
        setNewArrivals(newArrivalsData.map(transformAPIBook));
        setChildrensBooks(childrens.map(transformAPIBook));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllBooks();
  }, []);

  const handleSubscribe = () => {
    if (!email || !email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setSubscribeStatus('error');
      return;
    }
    
    // Here you would typically call an API to register the email
    // For now, we'll just simulate success
    setSubscribeStatus('success');
    setEmail('');
    
    // Reset the status after 5 seconds
    setTimeout(() => {
      setSubscribeStatus(null);
    }, 5000);
  };

  const handleNavigateAndScroll = (path: string) => {
    // Nếu đang ở homepage thì chỉ scroll
    if (path === '/' || window.location.pathname === '/') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Nếu đang ở trang khác thì navigate và scroll
      navigate(path);
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return <main className="flex-grow">
    <HeroBanner />
    <section className="bg-white py-6 border-b">
      <div className="container mx-auto px-4 animate-gradient-x bg-gradient-to-r from-blue-200 via-white-200 to-yellow-200 bg-[length:200%_200%]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => handleNavigateAndScroll("/collection/bestsellers")}
            className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <TrendingUpIcon size={24} className="text-blue-800" />
            </div>
            <h3 className="font-medium text-2xl font-bold text-blue-800">Bestsellers</h3>
            <p className="text-xs text-gray-600 mt-1">Top books this month</p>
          </div>

          <div
            onClick={() => handleNavigateAndScroll("/collection/new-releases")}
            className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <div className="bg-green-100 p-3 rounded-full mb-3">
              <SparklesIcon size={24} className="text-green-800" />
            </div>
            <h3 className="font-medium text-2xl font-bold text-blue-800">New Releases</h3>
            <p className="text-xs text-gray-600 mt-1">Fresh off the press</p>
          </div>

          <div
            onClick={() => handleNavigateAndScroll("/collection/fiction")}
            className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <div className="bg-purple-100 p-3 rounded-full mb-3">
              <BookOpenIcon size={24} className="text-purple-800" />
            </div>
            <h3 className="font-medium text-2xl font-bold text-blue-800">Fiction</h3>
            <p className="text-xs text-gray-600 mt-1">Popular stories</p>
          </div>

          <div
            onClick={() => handleNavigateAndScroll("/collection/non-fiction")}
            className="flex flex-col items-center text-center p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer"
            role="button"
            tabIndex={0}
          >
            <div className="bg-amber-100 p-3 rounded-full mb-3">
              <UsersIcon size={24} className="text-amber-800" />
            </div>
            <h3 className="font-medium text-2xl font-bold text-blue-800">Non-Fiction</h3>
            <p className="text-xs text-gray-600 mt-1">Real-world knowledge</p>
          </div>
        </div>
      </div>
    </section>
    <PromotionalBanner title="NEW RELEASES" discount="10% OFF" bgColor="bg-gradient-to-r from-purple-900 to-indigo-800" textColor="text-white" />
    {loading ? (
      <div className="text-center py-8">Loading books...</div>
    ) : error ? (
      <div className="text-center text-red-600 py-8">Error: {error}</div>
    ) : (
      <>
        <div id="bestseller-section">
          <CategorySection title="Bestsellers" books={bestsellerBooks} columns={6} />
        </div>
        <PromotionalBanner title="BESTSELLING BOOKS" discount="20% OFF" bgColor="bg-gradient-to-r from-blue-900 to-blue-700" textColor="text-white" />
        <CategorySection title="Trending Books" books={trendingBooks} columns={6} />
        <div className="bg-gradient-to-b from-amber-50 to-amber-100 py-10 px-4 my-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold mb-2 md:mb-0">
                Featured Author Collections
              </h2>
              <button className="text-blue-800 font-medium flex items-center hover:underline">
                View All Featured Authors{' '}
                <ChevronRightIcon size={16} className="ml-1" />
              </button>
            </div>
            <CategorySection title='Featured author' books={featuredBooks} columns={7} showTitle={false} />
          </div>
        </div>
        <PromotionalBanner title="SPECIAL OFFERS" discount="50% OFF" bgColor="bg-gradient-to-r from-gray-900 to-gray-700" textColor="text-white" />
        <CategorySection title="New Arrivals" books={newArrivals} columns={6} />
        <div className="bg-gradient-to-b from-pink-50 to-pink-100 py-10 px-4 my-8">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold mb-2 md:mb-0">
                Children's Books
              </h2>
              <button className="text-blue-800 font-medium flex items-center hover:underline">
                Explore Children's Collection{' '}
                <ChevronRightIcon size={16} className="ml-1" />
              </button>
            </div>
            <CategorySection title='' books={childrensBooks} columns={6} showTitle={false} />
          </div>
        </div>
        <section className="bg-blue-800 text-white py-12 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-2">
              Stay Updated with Bookify
            </h2>
            <p className="mb-6">
              Subscribe to our newsletter for new releases, reading
              recommendations, and exclusive offers
            </p>
            
            {subscribeStatus === 'success' && (
              <div className="bg-green-600 text-white p-3 rounded-md mb-4 animate-fade-in">
                Thank you for subscribing! We'll keep you updated with the latest news and offers.
              </div>
            )}
            
            {subscribeStatus === 'error' && (
              <div className="bg-red-600 text-white p-3 rounded-md mb-4 animate-fade-in">
                Please enter a valid email address to subscribe.
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-l text-gray-800 focus:outline-none" 
                aria-label="Email for newsletter" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium px-6 py-3 rounded-r transition"
                onClick={handleSubscribe}
              >
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </>
    )}
  </main>;
};

export default HomePage;