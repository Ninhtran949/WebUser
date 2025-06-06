import { Book } from './book';

export interface CartItemResponse {
  idProduct: number;
  idCart: number;
  idCategory: number;
  imgProduct: string;
  idPartner: string;
  nameProduct: string;
  userClient: string;
  priceProduct: number;
  numberProduct: number;
  totalPrice: number;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export interface CartPayload {
  idProduct: number;
  idCart: number;
  idCategory: number;
  imgProduct: string;
  idPartner: string;
  nameProduct: string;
  userClient: string;
  priceProduct: number;
  numberProduct: number;
  totalPrice: number;
}

export type CartAction = 
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { bookId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_ITEMS'; payload: CartItem[] };

export interface ApiCartItem {
  idProduct: number;
  idCart: number;
  idCategory: number;
  imgProduct: string;
  idPartner: string;
  nameProduct: string;
  userClient: string;
  priceProduct: number;
  numberProduct: number;
  totalPrice: number;
}

export interface CartPayload extends Omit<ApiCartItem, 'id'> {
  idProduct: number;
  idCart: number;
  idCategory: number;
  imgProduct: string;
  idPartner: string;
  nameProduct: string;
  userClient: string;
  priceProduct: number;
  numberProduct: number;
  totalPrice: number;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
}
