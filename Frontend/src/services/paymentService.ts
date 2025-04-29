import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Request types
export interface PaymentRequest {
  app_user: string;
  amount: number;
  description: string;
}

export interface StatusCheckRequest {
  app_trans_id: string;
}

// Response types
export interface ZaloPaymentResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  order_url: string;
  app_trans_id: string;
}

export interface ZaloStatusResponse {
  return_code: number;
  return_message: string;
  sub_return_code: number;
  sub_return_message: string;
  is_processing?: boolean;
  amount?: number;
}

// API functions
export const createPayment = async (paymentData: PaymentRequest): Promise<ZaloPaymentResponse> => {
  const response = await axios.post<ZaloPaymentResponse>(`${API_URL}/zalopay/payment`, paymentData);
  return response.data;
};

export const checkPaymentStatus = async (statusData: StatusCheckRequest): Promise<ZaloStatusResponse> => {
  const response = await axios.post<ZaloStatusResponse>(`${API_URL}/zalopay/check-status-order`, statusData);
  return response.data;
};