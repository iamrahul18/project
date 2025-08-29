import { useState, useEffect } from 'react';
import { Product } from '../types';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../utils/storage';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const data = getProducts();
      setProducts(data);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const addProduct = async (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct = createProduct(productData);
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const editProduct = async (id: string, updates: Partial<Product>): Promise<Product | null> => {
    const updatedProduct = updateProduct(id, updates);
    if (updatedProduct) {
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
    }
    return updatedProduct;
  };

  const removeProduct = async (id: string): Promise<boolean> => {
    const success = deleteProduct(id);
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
    return success;
  };

  const refreshProducts = () => {
    const data = getProducts();
    setProducts(data);
  };

  return {
    products,
    loading,
    addProduct,
    editProduct,
    removeProduct,
    refreshProducts
  };
};