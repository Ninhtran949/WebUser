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

export interface ProductId {
  _id: string;
  codeCategory: string;
  codeProduct: string;
  imgProduct: string;
  nameProduct: string;
  priceProduct: string;
  userPartner: string;
}

export interface Book {
  _id: string;
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category: string;
  productId: ProductId | null; // Thay đổi undefined thành null
  isbn13: string;
  publisher: string;
  publicationDate: string;
  pages: number;
  overview: string;
  editorialReviews: EditorialReview[];
  customerReviews: CustomerReview[];
  description?: string;
  language?: string;
  rating?: number;
}

export interface APIBook {
  _id: string;
  productId?: ProductId;
  title?: string;
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