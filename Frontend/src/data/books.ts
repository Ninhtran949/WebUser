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

// Re-export Book interface using 'export type'
export type { 
  Book,
  ProductId,
} from '../types/book';
export interface APIBook {
  _id: string;
  productId?: {
    _id: string;
    codeCategory: string;
    codeProduct: string;
    imgProduct: string;
    nameProduct: string;
    priceProduct: string;
    userPartner: string;
  };
  title?: string;  // Thêm title optional
  author: string;
  isbn13: string;
  publisher: string;
  publicationDate: string;
  pages: number;
  overview: string;
  editorialReviews: EditorialReview[];
  customerReviews: CustomerReview[];
  category?: string;
}