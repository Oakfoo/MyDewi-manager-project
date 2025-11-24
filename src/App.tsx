import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
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
import { OrderList } from './components/Orders/OrderList';
import { Configuration } from './components/Configurations/Configuration';
import { PromoCodesList } from './components/PromoCodes/PromoCodesList';
import { HomePage } from './components/Home/Home';
import { SidebarProvider } from './contexts/SidebarContext';
import { ClaspList } from './components/Clasps/ClaspList';

function App() {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Router>
          <div className="min-h-screen">
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/customers" element={<CustomerList />} />
                  <Route path="/orders" element={<OrderList />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/product-categories" element={<ProductCategoryList />} />
                  <Route path="/charms" element={<CharmList />} />
                  <Route path="/charm-categories" element={<CharmCategoryList />} />
                  <Route path="/clasps" element={<ClaspList />} />
                  <Route path="/stocks" element={<StockManagement />} />
                  <Route path="/promo-codes" element={<PromoCodesList />} />
                  <Route path="/configuration" element={<Configuration />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </ProtectedRoute>
            <Toaster position="top-right" />
          </div>
        </Router>
      </SidebarProvider>
    </AuthProvider>
  );
}

export default App;