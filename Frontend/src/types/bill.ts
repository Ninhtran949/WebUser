export interface Cart {
  idCart: number;
  idCategory: number;
  idPartner: string;
  idProduct: number;
  imgProduct: string;
  nameProduct: string;
  numberProduct: number;
  priceProduct: number;
  totalPrice: number;
  userClient: string;
}

export interface Bill {
  Cart: Cart[];
  dayOut: string;
  idBill: number;
  idClient: string;
  idPartner: string;
  status: string;
  timeOut: string;
  total: number;
}

export interface OrderHistory {
  idBill: string;
  dayOut: string;
  total: number;
  status: string;
  Cart: Cart[];
}

export type TransformedBill = {
  [key: string]: Cart[];
}