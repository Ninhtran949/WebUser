import { useState, useEffect } from 'react';
import { getRelatedBooks } from '../services/bookService';
import { Book, APIBook } from '../data/books';
import BookGrid from './BookGrid';

interface RelatedBooksProps {
  category: string;
  currentBookId: string;
}

const RelatedBooks = ({
  category,
  currentBookId
}: RelatedBooksProps) => {
  const [relatedBooks, setRelatedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformAPIBook = (book: APIBook): Book => ({
    _id: book._id,
    id: book._id,
    title: book.productId?.nameProduct || 'Untitled',
    author: book.author,
    price: Number(book.productId?.priceProduct) || 0,
    coverImage: book.productId?.imgProduct || '',
    category: book.category || 'Uncategorized',
    productId: book.productId || null,
    isbn13: book.isbn13 || '',
    publisher: book.publisher || '',
    publicationDate: book.publicationDate || new Date().toISOString(),
    pages: book.pages || 0,
    overview: book.overview || '',
    editorialReviews: book.editorialReviews || [],
    customerReviews: book.customerReviews || []
  });

  useEffect(() => {
    const fetchRelatedBooks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Skip API call if no category or currentBookId
        if (!category || !currentBookId) {
          setRelatedBooks([]);
          return;
        }

        const books = await getRelatedBooks(category.trim(), currentBookId);
        setRelatedBooks(books.map(transformAPIBook));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        console.error('Failed to fetch related books:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedBooks();
  }, [category, currentBookId]);

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800"></div>
        </div>
      </section>
    );
  }

  // Don't show anything if there are no related books
  if (!relatedBooks || relatedBooks.length === 0) {
    return null;
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      {error ? (
        <div className="text-center text-red-600 py-8">Error: {error}</div>
      ) : (
        <BookGrid books={relatedBooks} columns={6} />
      )}
    </section>
  );
};

export default RelatedBooks;