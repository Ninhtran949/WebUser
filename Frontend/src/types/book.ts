export interface Book {
  id: string;
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category: string;
  productId?: {
    _id: string;
    codeCategory: string;
    codeProduct: string;
    imgProduct: string;
    nameProduct: string;
    priceProduct: string;
    userPartner: string;
  };
  isbn13?: string;
  publisher?: string;
  publicationDate?: string;
  pages?: number;  // Changed from pageCount to pages to match usage
  overview?: string;  // Added to match usage
  editorialReviews?: Array<{
    content: string;
    source: string;
  }>;
  customerReviews?: Array<{
    rating: number;
    content: string;
    author: string;
    date: string;
  }>;
  description?: string;
  language?: string;
  rating?: number;
}