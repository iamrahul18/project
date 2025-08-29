import React, { useState } from 'react';
import { Eye, EyeOff, DollarSign, User, Package } from 'lucide-react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'completed' | 'cancelled') => Promise<void>;
}

export const OrderList: React.FC<OrderListProps> = ({ orders, onUpdateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order =>
    order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new order.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
        <div className="w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:scale-105"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Order #{order.id}</h3>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2 text-blue-500" />
                    <span>{order.customer_name}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                    <span className="font-medium">${order.total_amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    {order.status === 'completed' ? (
                      <>
                        <Eye className="h-4 w-4 mr-2 text-green-500" />
                        <span className="text-green-600 font-medium">Completed</span>
                      </>
                    ) : order.status === 'cancelled' ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-gray-600 font-medium">Cancelled</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-4 w-4 mr-2 text-red-500" />
                        <span className="text-red-600 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={`w-3 h-3 rounded-full ${
                order.status === 'completed' ? 'bg-green-400' : 
                order.status === 'cancelled' ? 'bg-gray-400' : 
                'bg-red-400'
              }`}></div>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => onUpdateOrderStatus(order.id, order.status === 'completed' ? 'pending' : 'completed')}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors duration-200"
              >
                {order.status === 'completed' ? 'Mark Pending' : 'Complete'}
              </button>
              <button
                onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};