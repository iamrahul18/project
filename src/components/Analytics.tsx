import React from 'react';
import { DollarSign, Package, ShoppingCart, TrendingUp, Star } from 'lucide-react';
import { Order, Product } from '../types';

interface AnalyticsProps {
  orders: Order[];
  products: Product[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ orders, products }) => {
  // Only count completed orders for revenue
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalRevenue = completedOrders.reduce((sum, order) => sum + order.total_amount, 0);
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const averageOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
  
  const lowStockProducts = products.filter(p => p.stock_quantity < 10);
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0);
  
  const mostOrderedProducts = () => {
    const productQuantities: Record<string, number> = {};
    // Only count completed orders
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        productQuantities[item.product_id] = (productQuantities[item.product_id] || 0) + item.quantity;
      });
    });
    
    return Object.entries(productQuantities)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([productId, quantity]) => {
        const product = products.find(p => p.id === productId);
        return { product: product?.name || 'Unknown', quantity };
      });
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      icon: Package,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'Total Orders',
      value: `${totalOrders} (${completedOrders.length} completed)`,
      icon: ShoppingCart,
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    {
      title: 'Average Order Value',
      value: `$${averageOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Inventory Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h3>
          
          {outOfStockProducts.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-red-600 mb-2">Out of Stock</h4>
              <div className="space-y-2">
                {outOfStockProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-700">{product.name}</span>
                    <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">0 units</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {lowStockProducts.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-yellow-600 mb-2">Low Stock (&lt; 10 units)</h4>
              <div className="space-y-2">
                {lowStockProducts.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-700">{product.name}</span>
                    <span className="text-xs font-medium text-yellow-600 bg-yellow-100 px-2 py-1 rounded">
                      {product.stock_quantity} units
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {outOfStockProducts.length === 0 && lowStockProducts.length === 0 && (
            <div className="text-center py-4">
              <Star className="mx-auto h-8 w-8 text-green-500 mb-2" />
              <p className="text-sm text-gray-600">All products are well-stocked!</p>
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Ordered Products</h3>
          
          {mostOrderedProducts().length > 0 ? (
            <div className="space-y-3">
              {mostOrderedProducts().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-500 mr-3">#{index + 1}</span>
                    <span className="text-sm font-medium text-gray-900">{item.product}</span>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">{item.quantity} sold</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Package className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">No sales data available yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};