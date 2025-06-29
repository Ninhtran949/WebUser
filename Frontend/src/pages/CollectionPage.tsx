import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRightIcon, ChevronDownIcon } from 'lucide-react';
import Masonry from 'react-masonry-css';
import { Book } from '../types/book';
import { getBooksByCategory } from '../services/bookService';
import { validateAndProcessImage } from '../utils/imageUtils';
import './CollectionPage.css';
import { useLanguage } from '../contexts/LanguageContext';

// Map categories theo rule từ backend
const collectionCategoryMap = {
  literature: { key: 'collection.literature', codeCategory: '1' },
  economics: { key: 'collection.economics', codeCategory: '2' },
  psychology: { key: 'collection.psychology', codeCategory: '3' },
  education: { key: 'collection.education', codeCategory: '4' },
  childrensBooks: { key: 'collection.childrensBooks', codeCategory: '5' },
  memoir: { key: 'collection.memoir', codeCategory: '6' },
  textbooks: { key: 'collection.textbooks', codeCategory: '7' },
  foreignLanguages: { key: 'collection.foreignLanguages', codeCategory: '8' },
};

const breakpointColumns = {
  default: 4,
  1440: 4,
  1280: 3,
  1024: 3,
  768: 2,
  640: 1
};

const CollectionPage = () => {
  const { category: categoryParam } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'books');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  useEffect(() => {
    if (categoryParam && collectionCategoryMap[categoryParam as keyof typeof collectionCategoryMap]) {
      setSelectedCategory(categoryParam);
    } else {
      navigate('/collection/books');
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchBooks = async () => {
      const category = collectionCategoryMap[selectedCategory as keyof typeof collectionCategoryMap];
      if (!category) return;

      setLoading(true);
      setError(null);
      try {
        // Lấy danh sách Book chuẩn từ service (đã có đủ detail)
        const books = await getBooksByCategory(category.codeCategory);
        // Map lại APIBook thành Book chuẩn cho BookGrid
        let transformedBooks = books.map(book => ({
          _id: book._id,
          id: book._id,
          title: book.productId?.nameProduct || book.title || 'Untitled',
          author: book.productId?.userPartner || book.author || 'Unknown',
          price: parseFloat(book.productId?.priceProduct || '0'),
          coverImage: book.productId?.imgProduct || '',
          category: t(category.key),
          productId: book.productId || null,
          isbn13: book.isbn13 || '',
          publisher: book.publisher || '',
          publicationDate: book.publicationDate || new Date().toISOString(),
          pages: book.pages || 0,
          overview: book.overview || '',
          editorialReviews: book.editorialReviews || [],
          customerReviews: book.customerReviews || []
        }));
        // Sort books based on selected order
        switch (sortOrder) {
          case 'price-low':
            transformedBooks.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            transformedBooks.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            transformedBooks.sort((a, b) => new Date(b.publicationDate).getTime() - new Date(a.publicationDate).getTime());
            break;
          default:
            // Featured - no sorting needed
            break;
        }
        setBooks(transformedBooks);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch books';
        setError(errorMessage);
        console.error('Error fetching books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategory, sortOrder]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as typeof sortOrder);
  };

  const handleCategorySelect = (categoryKey: string) => {
    navigate(`/collection/${categoryKey}`);
    setSelectedCategory(categoryKey);
    setExpandedCategory(expandedCategory === categoryKey ? null : categoryKey);
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Hidden on mobile, shown as overlay */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="hidden md:block bg-white rounded-lg shadow-md p-4 sticky top-4">
              <h2 className="hidden md:block text-lg font-bold mb-4 text-gray-800">
                Collections
              </h2>
              <nav>
                <ul className="hidden md:block space-y-2">
                  {Object.entries(collectionCategoryMap).map(([key, { key: tKey }]) => (
                    <li key={key}>
                      <div className="relative">
                        <button
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between ${
                            selectedCategory === key
                              ? 'bg-blue-50 text-blue-800'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleCategorySelect(key)}
                        >
                          <span className="font-medium">{t(tKey)}</span>
                          {expandedCategory === key ? (
                            <ChevronDownIcon size={16} />
                          ) : (
                            <ChevronRightIcon size={16} />
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {t(collectionCategoryMap[selectedCategory as keyof typeof collectionCategoryMap]?.key || '')}
                  </h1>
                  <div className="flex items-center gap-4">
                    <select 
                      className="border rounded-md px-3 py-2 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={sortOrder}
                      onChange={handleSortChange}
                    >
                      <option value="featured">Sort by: Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest Arrivals</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Books Grid */}
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center py-8">{error}</div>
                ) : books.length === 0 ? (
                  <div className="text-gray-500 text-center py-8">No books found in this category</div>
                ) : (
                  <Masonry
                    breakpointCols={breakpointColumns}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                  >
                    {books.map((book) => (
                      <div
                        key={book.id}
                        className="mb-4 break-inside-avoid book-card"
                        onClick={() => navigate(`/book/${book._id}`)}
                      >
                        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
                          <div className="relative aspect-[2/3] overflow-hidden">
                            <img
                              src={validateAndProcessImage(book.coverImage)}
                              alt={book.title}
                              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                              <p className="text-sm font-medium line-clamp-2">{book.overview}</p>
                            </div>
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 group-hover:text-blue-800 transition-colors duration-300 line-clamp-2">
                              {book.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{book.author}</p>
                            <div className="mt-2 flex justify-between items-center">
                              <span className="font-bold text-blue-800">
                                ${book.price.toFixed(2)}
                              </span>
                              {book.publicationDate && (
                                <span className="text-xs text-gray-500">
                                  {new Date(book.publicationDate).getFullYear()}
                                </span>
                              )}
                            </div>
                            {book.customerReviews && book.customerReviews.length > 0 && (
                              <div className="mt-2 flex items-center gap-1">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.round(
                                          book.customerReviews.reduce((acc, review) => acc + review.rating, 0) /
                                            book.customerReviews.length
                                        )
                                          ? 'fill-current'
                                          : 'fill-gray-300'
                                      }`}
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500">
                                  ({book.customerReviews.length})
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </Masonry>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CollectionPage;
