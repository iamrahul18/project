import { useState, useEffect } from 'react';
import { Order } from '../types';
import { getOrders, createOrder, calculateOrderTotal, validateStockAvailability, updateProductStock, getTotalRevenue, updateOrderStatus } from '../utils/storage';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = getOrders();
      setOrders(data);
      setLoading(false);
    };
    loadOrders();
  }, []);

  const addOrder = async (orderData: { customer_name: string; items: Array<{ product_id: string; quantity: number }> }): Promise<{ success: boolean; order?: Order; errors?: string[] }> => {
    // Validate stock availability
    const stockValidation = validateStockAvailability(orderData.items);
    if (!stockValidation.valid) {
      return { success: false, errors: stockValidation.errors };
    }

    // Calculate total amount
    const total_amount = calculateOrderTotal(orderData.items);
    
    const newOrder = createOrder({
      ...orderData,
      total_amount,
      status: 'pending' as const
    });

    // Update product stock
    updateProductStock(orderData.items);

    setOrders(prev => [...prev, newOrder]);
    return { success: true, order: newOrder };
  };

  const updateStatus = async (orderId: string, status: 'pending' | 'completed' | 'cancelled'): Promise<Order | null> => {
    const updatedOrder = updateOrderStatus(orderId, status);
    if (updatedOrder) {
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
    }
    return updatedOrder;
  };

  const getRevenue = (): number => {
    return getTotalRevenue();
  };

  const refreshOrders = () => {
    const data = getOrders();
    setOrders(data);
  };

  return {
    orders,
    loading,
    addOrder,
    updateStatus,
    getRevenue,
    refreshOrders
  };
};