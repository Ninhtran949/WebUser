import React from 'react';
import { getRelatedBooks } from '../data/books';
import BookGrid from './BookGrid';
interface RelatedBooksProps {
  category: string;
  currentBookId: number;
}
const RelatedBooks = ({
  category,
  currentBookId
}: RelatedBooksProps) => {
  const relatedBooks = getRelatedBooks(category, currentBookId);
  return <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
      <BookGrid books={relatedBooks} columns={6} />
    </section>;
};
export default RelatedBooks;