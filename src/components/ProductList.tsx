import React, { useState } from 'react';
import { Edit, Trash2, Package, DollarSign, Hash, Eye, EyeOff } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium">${product.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Hash className="h-4 w-4 mr-2 text-blue-500" />
                    <span>Stock: {product.stock_quantity}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    {product.is_available ? (
                      <>
                        <Eye className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-green-600 font-medium">Available</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-red-600 font-medium">Unavailable</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${product.is_available ? 'bg-green-400' : 'bg-red-400'}`}></div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => onEdit(product)}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};