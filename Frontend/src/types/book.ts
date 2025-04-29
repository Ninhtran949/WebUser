export interface Book {
  _id: string;
  id: string;
  title: string;
  price: number;
  coverImage: string;
  category: string;
  discount?: string;
  originalPrice?: number;
  productId?: {
    _id: string;
    codeCategory: string;
    codeProduct: string;
    imgProduct: string;
    nameProduct: string;
    priceProduct: string;
    userPartner: string;
  } | null;
  author: string;
  isbn13: string;
  publisher: string;
  publicationDate: string;
  pages: number;
  overview: string;
  editorialReviews: Array<{
    content: string;
    source: string;
  }>;
  customerReviews: Array<{
    rating: number;
    content: string;
    author: string;
    date: string;
  }>;
}