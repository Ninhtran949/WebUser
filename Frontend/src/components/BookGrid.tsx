import { EyeIcon, ShoppingCartIcon, HeartIcon } from 'lucide-react';
import { Book } from '../data/books';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

interface BookGridProps {
  books: Book[];
  columns?: number;
}

const BookGrid = ({ books, columns = 6 }: BookGridProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();

  const gridColumns = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
    7: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7'
  };

  const gridClass = gridColumns[columns as keyof typeof gridColumns] || gridColumns[6];

  const handleBookClick = (id: string, e: React.MouseEvent) => {
    // Kiểm tra xem click có xuất phát từ các button không
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || // Nếu click vào bất kỳ button nào
      target.closest('[role="button"]') || // Hoặc element có role="button"
      target.closest('.action-button') // Hoặc class action-button
    ) {
      return; // Không thực hiện navigation
    }
    
    // Scroll to top trước khi navigate
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Delay navigate một chút để scroll có thể hoàn thành
    setTimeout(() => {
      navigate(`/book/${id}`);
    }, 100);
  };

  const handleAddToCart = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation(); // Ngăn event bubble lên
    const phoneNumber = user?.phoneNumber;
    if (!phoneNumber || phoneNumber.trim() === '' || phoneNumber === ' ') {
      toast.error('Vui lòng cập nhật số điện thoại để sử dụng chức năng giỏ hàng!', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    addItem(book);
  };

  const handleFavoriteClick = (e: React.MouseEvent, book: Book) => {
    e.stopPropagation(); // Ngăn event bubble lên
    if (isFavorite(book.id)) {
      removeFromFavorites(book.id);
    } else {
      addToFavorites(book);
    }
  };

  return (
    <div className={`grid ${gridClass} gap-4`}>
      {books.map((book) => (
        <div 
          key={book._id} 
          onClick={(e) => handleBookClick(book._id, e)}
          className="flex flex-col border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        >
          <div className="relative h-48 group">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                className="action-button bg-white text-gray-800 p-2 rounded-full hover:bg-blue-100 transition" 
                onClick={(e) => {
                  e.stopPropagation();
                  // Scroll to top trước khi navigate
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setTimeout(() => navigate(`/book/${book._id}`), 100);
                }}
                aria-label="Quick view"
              >
                <EyeIcon size={18} />
              </button>
              <button 
                className="action-button bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition" 
                onClick={(e) => handleAddToCart(e, book)}
                aria-label="Add to cart"
              >
                <ShoppingCartIcon size={18} />
              </button>
              <button 
                className={`action-button p-2 rounded-full transition ${
                  isFavorite(book.id)
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-white text-gray-800 hover:bg-red-100'
                }`}
                onClick={(e) => handleFavoriteClick(e, book)}
                aria-label={isFavorite(book.id) ? "Remove from favorites" : "Add to favorites"}
              >
                <HeartIcon 
                  size={18} 
                  className={isFavorite(book.id) ? "fill-white" : ""}
                />
              </button>
            </div>
          </div>
          <div className="p-2 flex flex-col flex-grow">
            <h3 className="font-semibold text-sm line-clamp-2 hover:text-blue-800">
              {book.title}
            </h3>
            <p className="text-xs text-gray-600 mb-1">{book.author}</p>
            <div className="mt-auto flex items-center justify-between">
              <div>
                <span className="font-bold text-sm">
                  {book.price.toFixed(2)}đ
                </span>
              </div>
              <button
                className={`action-button p-2 transition ${
                  isFavorite(book._id) ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
                onClick={(e) => handleFavoriteClick(e, book)}
              >
                <HeartIcon 
                  size={18} 
                  className={isFavorite(book._id) ? "fill-current" : ""}
                />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookGrid;