import { Product, Order } from '../types';

const PRODUCTS_KEY = 'store_products';
const ORDERS_KEY = 'store_orders';

// Product storage operations
export const getProducts = (): Product[] => {
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveProducts = (products: Product[]): void => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
};

export const getProductById = (id: string): Product | null => {
  const products = getProducts();
  return products.find(product => product.id === id) || null;
};

export const createProduct = (productData: Omit<Product, 'id'>): Product => {
  const products = getProducts();
  const newProduct: Product = {
    ...productData,
    id: generateId()
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
};

export const updateProduct = (id: string, updates: Partial<Product>): Product | null => {
  const products = getProducts();
  const index = products.findIndex(product => product.id === id);
  if (index === -1) return null;
  
  products[index] = { ...products[index], ...updates };
  saveProducts(products);
  return products[index];
};

export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filteredProducts = products.filter(product => product.id !== id);
  if (filteredProducts.length === products.length) return false;
  
  saveProducts(filteredProducts);
  return true;
};

// Order storage operations
export const getOrders = (): Order[] => {
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveOrders = (orders: Order[]): void => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const getOrderById = (id: string): Order | null => {
  const orders = getOrders();
  return orders.find(order => order.id === id) || null;
};

export const createOrder = (orderData: Omit<Order, 'id' | 'created_at'>): Order => {
  const orders = getOrders();
  const newOrder: Order = {
    ...orderData,
    id: generateId(),
    created_at: new Date().toISOString()
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
};

export const updateOrderStatus = (id: string, status: 'pending' | 'completed' | 'cancelled'): Order | null => {
  const orders = getOrders();
  const index = orders.findIndex(order => order.id === id);
  if (index === -1) return null;
  
  orders[index] = { ...orders[index], status };
  saveOrders(orders);
  return orders[index];
};

// Utility functions
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const calculateOrderTotal = (items: Array<{ product_id: string; quantity: number }>): number => {
  const products = getProducts();
  return items.reduce((total, item) => {
    const product = products.find(p => p.id === item.product_id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
};

export const validateStockAvailability = (items: Array<{ product_id: string; quantity: number }>): { valid: boolean; errors: string[] } => {
  const products = getProducts();
  const errors: string[] = [];
  
  for (const item of items) {
    const product = products.find(p => p.id === item.product_id);
    if (!product) {
      errors.push(`Product not found`);
      continue;
    }
    if (!product.is_available) {
      errors.push(`Product "${product.name}" is not available`);
      continue;
    }
    if (product.stock_quantity < item.quantity) {
      errors.push(`Not enough stock for "${product.name}". Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
    }
  }
  
  return { valid: errors.length === 0, errors };
};

export const updateProductStock = (items: Array<{ product_id: string; quantity: number }>): void => {
  const products = getProducts();
  
  for (const item of items) {
    const productIndex = products.findIndex(p => p.id === item.product_id);
    if (productIndex !== -1) {
      products[productIndex].stock_quantity -= item.quantity;
    }
  }
  
  saveProducts(products);
};

export const getTotalRevenue = (): number => {
  const orders = getOrders();
  return orders.reduce((total, order) => total + order.total_amount, 0);
};