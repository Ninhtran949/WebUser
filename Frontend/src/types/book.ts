export interface Book {
  _id: string;
  id: string; // thêm id cho frontend
  title: string; // map với nameProduct
  price: string; // map với priceProduct
  coverImage: string; // map với imgProduct
  category: string; // map với codeCategory
  productId: {
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