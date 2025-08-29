import { ProductFormData, OrderFormData } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateProduct = (data: ProductFormData): ValidationResult => {
  const errors: Record<string, string> = {};
  
  if (!data.name.trim()) {
    errors.name = 'Name cannot be empty';
  }
  
  const price = parseFloat(data.price);
  if (isNaN(price) || price <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  
  const stockQuantity = parseInt(data.stock_quantity);
  if (isNaN(stockQuantity) || stockQuantity < 0) {
    errors.stock_quantity = 'Stock quantity cannot be negative';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateOrder = (data: OrderFormData): ValidationResult => {
  const errors: Record<string, string> = {};
  
  if (!data.customer_name.trim()) {
    errors.customer_name = 'Customer name cannot be empty';
  }
  
  if (data.items.length === 0) {
    errors.items = 'Order must contain at least one item';
  }
  
  data.items.forEach((item, index) => {
    if (!item.product_id) {
      errors[`item_${index}_product`] = 'Product must be selected';
    }
    
    const quantity = parseInt(item.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      errors[`item_${index}_quantity`] = 'Quantity must be greater than 0';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};