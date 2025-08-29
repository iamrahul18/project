import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Product, OrderFormData } from '../types';
import { validateOrder } from '../utils/validation';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: { customer_name: string; items: Array<{ product_id: string; quantity: number }> }) => Promise<{ success: boolean; errors?: string[] }>;
  products: Product[];
}

export const OrderForm: React.FC<OrderFormProps> = ({ isOpen, onClose, onSave, products }) => {
  const [formData, setFormData] = useState<OrderFormData>({
    customer_name: '',
    items: [{ product_id: '', quantity: '1' }]
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const availableProducts = products.filter(p => p.is_available && p.stock_quantity > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateOrder(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const orderData = {
        customer_name: formData.customer_name.trim(),
        items: formData.items.map(item => ({
          product_id: item.product_id,
          quantity: parseInt(item.quantity)
        }))
      };

      const result = await onSave(orderData);
      if (result.success) {
        setFormData({
          customer_name: '',
          items: [{ product_id: '', quantity: '1' }]
        });
        onClose();
      } else {
        setErrors({ general: result.errors?.join(', ') || 'Failed to create order' });
      }
    } catch (error) {
      setErrors({ general: 'Failed to create order' });
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { product_id: '', quantity: '1' }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: 'product_id' | 'quantity', value: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Create New Order</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              id="customer_name"
              value={formData.customer_name}
              onChange={(e) => setFormData(prev => ({ ...prev, customer_name: e.target.value }))}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                errors.customer_name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter customer name"
            />
            {errors.customer_name && <p className="text-red-500 text-sm mt-1">{errors.customer_name}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Order Items</label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center px-3 py-1 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors[`item_${index}_product`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select a product</option>
                      {availableProducts.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name} (Stock: {product.stock_quantity}) - ${product.price}
                        </option>
                      ))}
                    </select>
                    {errors[`item_${index}_product`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_product`]}</p>
                    )}
                  </div>
                  
                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        errors[`item_${index}_quantity`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Qty"
                    />
                    {errors[`item_${index}_quantity`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`item_${index}_quantity`]}</p>
                    )}
                  </div>
                  
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.items && <p className="text-red-500 text-sm mt-1">{errors.items}</p>}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Save className="h-4 w-4 mr-1" />
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};