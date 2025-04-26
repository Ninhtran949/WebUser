export interface EditorialReview {
  content: string;
  source: string;
}
export interface CustomerReview {
  rating: number;
  content: string;
  author: string;
  date: string;
}
export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category: string;
  discount?: string;
  originalPrice?: number;
  overview?: string;
  isbn13?: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;
  editorialReviews?: EditorialReview[];
  customerReviews?: CustomerReview[];
}
export interface APIBook {
  _id: string;
  productId?: {
    nameProduct: string;
    priceProduct: number;
    imgProduct: string;
  };
  author: string;
  category?: string;
}
const generateBooks = (count: number, category: string, startId = 1, discountPercent?: string): Book[] => {
  return Array.from({
    length: count
  }, (_, i) => {
    const id = startId + i;
    const price = 9.99 + Math.floor(Math.random() * 20);
    const hasDiscount = discountPercent || Math.random() > 0.7;
    const originalPrice = hasDiscount ? price * 1.2 : undefined;
    return {
      id,
      title: `${category} Book Title ${id}`,
      author: `Author ${id}`,
      price: hasDiscount ? Math.round((originalPrice as number) * (1 - parseInt(discountPercent || '10') / 100) * 100) / 100 : price,
      originalPrice: hasDiscount ? originalPrice : undefined,
      discount: hasDiscount ? discountPercent || '10% OFF' : undefined,
      coverImage: `https://source.unsplash.com/random/200x300?book,${category},${id}`,
      category
    };
  });
};
export const bookCategories = {
  bestsellers: generateBooks(12, 'Bestseller', 1, '20%'),
  trending: generateBooks(12, 'Trending', 100),
  featured: generateBooks(7, 'Featured', 200, '15%'),
  newArrivals: generateBooks(12, 'New', 300),
  childrens: generateBooks(6, 'Children', 400, '10%')
};
export const findBookById = (id: number): Book | undefined => {
  const allBooks = [...bookCategories.bestsellers, ...bookCategories.trending, ...bookCategories.featured, ...bookCategories.newArrivals, ...bookCategories.childrens];
  const book = allBooks.find(book => book.id === id);
  if (book) {
    return {
      ...book,
      overview: "A heartwarming tale that explores themes of love, loss, and redemption. Follow our protagonist through an unforgettable journey that will keep you turning pages until the very end.",
      isbn13: "978-1234567890",
      publisher: "Literary Press",
      publicationDate: "April 1, 2024",
      pages: 324,
      editorialReviews: [{
        content: "A masterful work that will stay with readers long after they've turned the last page.",
        source: "Book Review Weekly"
      }, {
        content: "Beautifully crafted and deeply moving. A must-read for fans of contemporary fiction.",
        source: "Literary Times"
      }],
      customerReviews: [{
        rating: 5,
        content: "Couldn't put it down! One of the best books I've read this year.",
        author: "BookLover123",
        date: "March 15, 2024"
      }, {
        rating: 4,
        content: "Very engaging story with well-developed characters.",
        author: "ReadingEnthusiast",
        date: "March 20, 2024"
      }]
    };
  }
  return undefined;
};
export const getRelatedBooks = (category: string, currentBookId: number): Book[] => {
  const categoryBooks = Object.values(bookCategories).flat().filter(book => book.category === category && book.id !== currentBookId);
  return categoryBooks.slice(0, 6);
};