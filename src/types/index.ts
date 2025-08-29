export interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  is_available: boolean;
}

export interface OrderItem {
  product_id: string;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
}

export interface ProductFormData {
  name: string;
  price: string;
  stock_quantity: string;
  is_available: boolean;
}

export interface OrderFormData {
  customer_name: string;
  items: Array<{
    product_id: string;
    quantity: string;
  }>;
}