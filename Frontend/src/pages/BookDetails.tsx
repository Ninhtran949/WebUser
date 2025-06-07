import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCartIcon, CheckIcon, HeartIcon } from 'lucide-react';
import { getBookById } from '../services/bookService';
import RelatedBooks from '../components/RelatedBooks';
import EditorialReviews from '../components/EditorialReviews';
import CustomerReviews from '../components/CustomerReviews';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import SignInDialog from '../components/SignInDialog';
import { Book, APIBook } from '../data/books';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isAddedToFavorite, setIsAddedToFavorite] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      try {
        setError(null);
        const bookData: APIBook = await getBookById(id);
        // Transform API data to Book format
        const transformedBook: Book = {
          _id: bookData._id,
          id: bookData._id,
          title: bookData.productId?.nameProduct || bookData.title || 'Untitled',
          author: bookData.productId?.userPartner || bookData.author || 'Unknown',
          price: parseFloat(bookData.productId?.priceProduct || '0'),
          coverImage: bookData.productId?.imgProduct || '',
          category: bookData.category || 'Uncategorized',
          productId: bookData.productId || null, // Changed from undefined to null
          isbn13: bookData.isbn13 || '',
          publisher: bookData.publisher || '',
          publicationDate: bookData.publicationDate || new Date().toISOString(),
          pages: bookData.pages || 0,
          overview: bookData.overview || '',
          editorialReviews: bookData.editorialReviews || [],  
          customerReviews: bookData.customerReviews || []
        };
        setBook(transformedBook);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load book details';
        setError(errorMessage);
        console.error('Error fetching book details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      addItem(book);
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
    }
  };

  const handleToggleFavorite = () => {
    if (!book) return;
    
    if (isFavorite(book.id)) {
      removeFromFavorites(book.id);
      setIsAddedToFavorite(false);
    } else {
      addToFavorites(book);
      setIsAddedToFavorite(true);
      setTimeout(() => setIsAddedToFavorite(false), 2000);
    }
  };

  useEffect(() => {
    if (book) {
      setIsAddedToFavorite(isFavorite(book.id));
    }
  }, [book, isFavorite]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-600">Error: {error}</div>
    </div>;
  }

  if (!book) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-gray-600">Book not found</div>
    </div>;
  }

  return <main className="flex-grow bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Image */}
          <div className="md:w-1/3 relative group">
            <img src={book.coverImage || book.productId?.imgProduct} alt={book.title} className="w-full rounded-lg shadow-lg" />
            <button 
              onClick={handleToggleFavorite}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100"
              aria-label={isAddedToFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <HeartIcon 
                size={20} 
                className={isAddedToFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}
              />
            </button>
          </div>
          {/* Right Column - Details */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title || book.productId?.nameProduct}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            {/* Price Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold">
                  ${Number(book.price || book.productId?.priceProduct).toFixed(2)}
                </span>
              </div>
              <div className="flex gap-3">
                {/* Add to Cart Button */}
                <button 
                  className={`flex-1 px-8 py-3 rounded-md flex items-center justify-center gap-2 transition 
                    ${isAddedToCart ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-800 text-white hover:bg-blue-900'}`} 
                  onClick={handleAddToCart}
                >
                  {isAddedToCart ? (
                    <>
                      <CheckIcon size={20} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCartIcon size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
                {/* Add to Favorites Button */}
                <button 
                  onClick={handleToggleFavorite}
                  className={`px-4 py-3 rounded-md flex items-center justify-center transition
                    ${isAddedToFavorite 
                      ? 'bg-red-50 text-red-500 border-2 border-red-500' 
                      : 'border-2 border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500'}`}
                >
                  <HeartIcon 
                    size={20} 
                    className={isAddedToFavorite ? "fill-red-500" : ""}
                  />
                </button>
              </div>
            </div>
            {/* Overview */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Overview</h2>
              <p className="text-gray-700 leading-relaxed">{book.overview}</p>
            </div>
            {/* Product Details */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-bold mb-4">Product Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">ISBN-13:</p>
                  <p className="font-medium">{book.isbn13}</p>
                </div>
                <div>
                  <p className="text-gray-600">Publisher:</p>
                  <p className="font-medium">{book.publisher}</p>
                </div>
                <div>
                  <p className="text-gray-600">Publication date:</p>
                  <p className="font-medium">
                    {book.publicationDate 
                      ? new Date(book.publicationDate).toLocaleDateString()
                      : 'Not available'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Pages:</p>
                  <p className="font-medium">{book.pages}</p>
                </div>
                <div>
                  <p className="text-gray-600">Category:</p>
                  <p className="font-medium">{book.category}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Editorial Reviews */}
        {book.editorialReviews && book.editorialReviews.length > 0 && (
          <EditorialReviews reviews={book.editorialReviews} />
        )}
        {/* Customer Reviews */}
        {book.customerReviews && book.customerReviews.length > 0 && (
          <CustomerReviews reviews={book.customerReviews} />
        )}
        {/* Related Books */}
        {book.category && book._id && (
          <RelatedBooks category={book.category} currentBookId={book._id} />
        )}
      </div>
      <SignInDialog isOpen={isSignInDialogOpen} onClose={() => setIsSignInDialogOpen(false)} />
    </main>;
};

export default BookDetails;