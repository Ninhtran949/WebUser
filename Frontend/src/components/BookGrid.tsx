import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../data/books';
import { EyeIcon, ShoppingCartIcon } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  columns?: number;
}

const BookGrid: React.FC<BookGridProps> = ({
  books,
  columns = 6
}) => {
  const navigate = useNavigate();
  const gridCols = {
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    6: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6',
    7: 'grid-cols-2 md:grid-cols-4 lg:grid-cols-7'
  };
  const colClass = gridCols[columns as keyof typeof gridCols] || gridCols[6];

  const handleBookClick = (bookId: string) => {
    navigate(`/book/${bookId}`);
  };

  return <div className={`grid ${colClass} gap-4 sm:gap-6 pl-8`}>
    {books.map(book => <div key={book.id} className="flex flex-col group hover:shadow-lg transition duration-300 rounded-md overflow-hidden bg-white">
      <div className="relative pb-[150%] mb-2 overflow-hidden cursor-pointer" onClick={() => handleBookClick(book._id)}>
        <img src={book.coverImage} alt={book.title} className="absolute inset-0 w-full h-full object-cover rounded-sm group-hover:scale-105 transition duration-300" loading="lazy" />
        {book.discount && <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold p-1 px-2 rounded-bl">
          {book.discount}
        </div>}
        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button className="bg-white text-gray-800 p-2 rounded-full hover:bg-blue-100 transition" aria-label="Quick view" onClick={e => {
            e.stopPropagation();
            handleBookClick(book._id);
          }}>
            <EyeIcon size={18} />
          </button>
          <button className="bg-blue-800 text-white p-2 rounded-full hover:bg-blue-900 transition" aria-label="Add to cart" onClick={e => {
            e.stopPropagation();
          }}>
            <ShoppingCartIcon size={18} />
          </button>
        </div>
      </div>
      <div className="p-2 flex flex-col flex-grow">
        <h3 className="font-semibold text-sm line-clamp-2 cursor-pointer hover:text-blue-800" onClick={() => handleBookClick(book._id)}>
          {book.title}
        </h3>
        <p className="text-xs text-gray-600 mb-1">{book.author}</p>
        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="font-bold text-sm">
              ${Number(book.price).toFixed(2)}
            </span>
            {book.originalPrice && <span className="text-xs text-gray-500 line-through ml-2">
              ${book.originalPrice.toFixed(2)}
            </span>}
          </div>
        </div>
      </div>
    </div>)}
  </div>;
};

export default BookGrid;