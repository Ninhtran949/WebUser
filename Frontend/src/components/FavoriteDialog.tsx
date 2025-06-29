import { XIcon, TrashIcon, HeartIcon, ShoppingCartIcon, CheckIcon } from 'lucide-react';
import { useFavorites } from '../contexts/FavoriteContext';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../types/book';

interface FavoriteDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const FavoriteDialog = ({ isOpen, onClose }: FavoriteDialogProps) => {
  const { favorites, removeFromFavorites, clearFavorites, favoriteCount } = useFavorites();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [addedToCart, setAddedToCart] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const handleBookClick = (bookId: string) => {
    onClose();
    navigate(`/book/${bookId}`);
  };

  const handleAddToCart = (book: Book) => {
    addItem(book);
    setAddedToCart(prev => ({ ...prev, [book.id]: true }));
    setTimeout(() => {
      setAddedToCart(prev => ({ ...prev, [book.id]: false }));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl relative">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Favorites</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XIcon size={20} />
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {favorites.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                <HeartIcon size={64} className="text-gray-300" />
              </div>
              <p className="text-gray-500 mb-4">Your favorites list is empty</p>
              <button onClick={onClose} className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 transition">
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {favorites.map(book => (
                  <div key={book.id} className="flex border-b border-gray-200 pb-4">
                    <div className="w-20 h-28 flex-shrink-0">
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80 transition"
                        onClick={() => handleBookClick(book.id)}
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <h3 
                        className="font-semibold cursor-pointer hover:text-blue-800 transition"
                        onClick={() => handleBookClick(book.id)}
                      >
                        {book.title}
                      </h3>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold">{book.price.toFixed(2)}đ</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleAddToCart(book)}
                            className={`p-2 rounded-full transition ${
                              addedToCart[book.id]
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-blue-800 text-white hover:bg-blue-900'
                            }`}
                            aria-label={addedToCart[book.id] ? "Added to cart" : "Add to cart"}
                          >
                            {addedToCart[book.id] ? (
                              <CheckIcon size={18} />
                            ) : (
                              <ShoppingCartIcon size={18} />
                            )}
                          </button>
                          <button 
                            onClick={() => removeFromFavorites(book.id)} 
                            className="text-gray-500 hover:text-red-500 transition"
                          >
                            <TrashIcon size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <button 
                  onClick={clearFavorites} 
                  className="text-blue-800 hover:underline flex items-center"
                >
                  <TrashIcon size={16} className="mr-1" />
                  Clear All
                </button>
                <span className="text-sm text-gray-600">
                  {favoriteCount} {favoriteCount === 1 ? 'item' : 'items'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoriteDialog;