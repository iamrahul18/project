import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { ProductList } from './ProductList';
import { ProductForm } from './ProductForm';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';

interface ProductManagementProps {
  onDataChange?: () => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({ onDataChange }) => {
  const { products, loading, addProduct, editProduct, removeProduct, refreshProducts } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleSaveProduct = async (productData: Omit<Product, 'id'>) => {
    if (editingProduct) {
      await editProduct(editingProduct.id, productData);
      setEditingProduct(null);
    } else {
      await addProduct(productData);
    }
    refreshProducts();
    onDataChange?.(); // Notify parent that data has changed
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await removeProduct(id);
      onDataChange?.(); // Notify parent that data has changed
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </button>
      </div>

      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />
    </div>
  );
};