export interface Book {
  id: string;
  _id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  category: string;
  isbn13?: string;
  publisher?: string;
  publicationDate?: string;
  description?: string;
  language?: string;
  pageCount?: number;
  rating?: number;
}