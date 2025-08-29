import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { OrderList } from './OrderList';
import { OrderForm } from './OrderForm';
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';

export const OrderManagement: React.FC = () => {
  const { orders, loading: ordersLoading, addOrder, updateStatus, refreshOrders } = useOrders();
  const { products, refreshProducts } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSaveOrder = async (orderData: { customer_name: string; items: Array<{ product_id: string; quantity: number }> }) => {
    const result = await addOrder(orderData);
    if (result.success) {
      refreshOrders();
      refreshProducts(); // Refresh products to update stock quantities
    }
    return result;
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'pending' | 'completed' | 'cancelled') => {
    await updateStatus(orderId, status);
    refreshOrders();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  if (ordersLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm hover:shadow-md"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Order
        </button>
      </div>

      <OrderList orders={orders} onUpdateOrderStatus={handleUpdateOrderStatus} />

      <OrderForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSave={handleSaveOrder}
        products={products}
      />
    </div>
  );
};