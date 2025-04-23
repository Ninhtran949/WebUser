import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCartIcon, CheckIcon } from 'lucide-react';
import { findBookById } from '../data/books';
import RelatedBooks from '../components/RelatedBooks';
import EditorialReviews from '../components/EditorialReviews';
import CustomerReviews from '../components/CustomerReviews';
import { useCart } from '../contexts/CartContext';
import SignInDialog from '../components/SignInDialog';

const BookDetails = () => {
  const { id } = useParams();
  const book = findBookById(Number(id));
  const { addItem } = useCart();
  const [isSignInDialogOpen, setIsSignInDialogOpen] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  if (!book) {
    return <div>Book not found</div>;
  }
  const handleAddToCart = () => {
    addItem(book);
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
  };
  return <main className="flex-grow bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Book Header */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Image */}
          <div className="md:w-1/3">
            <img src={book.coverImage} alt={book.title} className="w-full rounded-lg shadow-lg" />
          </div>
          {/* Right Column - Details */}
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
            {/* Price Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl font-bold">
                  ${book.price.toFixed(2)}
                </span>
                {book.originalPrice && <span className="text-gray-500 line-through">
                    ${book.originalPrice.toFixed(2)}
                  </span>}
                {book.discount && <span className="text-red-600 font-semibold">
                    {book.discount}
                  </span>}
              </div>
              {/* Add to Cart Button */}
              <button className={`w-full md:w-auto px-8 py-3 rounded-md flex items-center justify-center gap-2 transition ${isAddedToCart ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-blue-800 text-white hover:bg-blue-900'}`} onClick={handleAddToCart}>
                {isAddedToCart ? <>
                    <CheckIcon size={20} />
                    Added to Cart
                  </> : <>
                    <ShoppingCartIcon size={20} />
                    Add to Cart
                  </>}
              </button>
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
                  <p className="font-medium">{book.publicationDate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Pages:</p>
                  <p className="font-medium">{book.pages}</p>
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
        <RelatedBooks category={book.category} currentBookId={book.id} />
      </div>
      <SignInDialog isOpen={isSignInDialogOpen} onClose={() => setIsSignInDialogOpen(false)} />
    </main>;
};
export default BookDetails;