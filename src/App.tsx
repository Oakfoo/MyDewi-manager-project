import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/Auth/ProtectedRoute';
import { Layout } from './components/Layout/Layout';
import { CustomerList } from './components/Customers/CustomerList';
import { ProductList } from './components/Products/ProductList';
import { ProductCategoryList } from './components/ProductCategories/ProductCategoryList';
import { CharmCategoryList } from './components/CharmsCategories/CharmCategoryList';
import { CharmList } from './components/Charms/CharmList';
import { StockManagement } from './components/Stocks/StockManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/customers" replace />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/orders" element={<div className="text-center p-8">Section Commandes - En développement</div>} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/product-categories" element={<ProductCategoryList />} />
                <Route path="/charms" element={<CharmList />} />
                <Route path="/charm-categories" element={<CharmCategoryList />} />
                <Route path="/stocks" element={<StockManagement />} />
              </Route>
            </Routes>
          </ProtectedRoute>
          <Toaster position="top-right" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;