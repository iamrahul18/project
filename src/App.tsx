import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ProductManagement } from './components/ProductManagement';
import { OrderManagement } from './components/OrderManagement';
import { Analytics } from './components/Analytics';
import { useProducts } from './hooks/useProducts';
import { useOrders } from './hooks/useOrders';

function App() {
  const [activeTab, setActiveTab] = useState('products');
  const [refreshKey, setRefreshKey] = useState(0); // Add this for forcing Analytics refresh
  const { products } = useProducts();
  const { orders } = useOrders();

  // Initialize with sample data if empty
  useEffect(() => {
    const existingProducts = localStorage.getItem('store_products');
    if (!existingProducts) {
      const sampleProducts = [
        {
          id: 'sample1',
          name: 'Laptop',
          price: 1200,
          stock_quantity: 15,
          is_available: true
        },
        {
          id: 'sample2',
          name: 'Wireless Mouse',
          price: 25.99,
          stock_quantity: 50,
          is_available: true
        },
        {
          id: 'sample3',
          name: 'Mechanical Keyboard',
          price: 89.99,
          stock_quantity: 5,
          is_available: true
        }
      ];
      localStorage.setItem('store_products', JSON.stringify(sampleProducts));
    }
  }, []);

  // Add this function to handle data changes
  const handleDataChange = () => {
    setRefreshKey(prev => prev + 1);
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement onDataChange={handleDataChange} />;
      case 'orders':
        return <OrderManagement onDataChange={handleDataChange} />;
      case 'analytics':
        return <Analytics key={refreshKey} orders={orders} products={products} />;
      default:
        return <ProductManagement onDataChange={handleDataChange} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {renderActiveTab()}
      </main>
    </div>
  );
}

export default App;