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
import { HomePage } from './components/Home/Home';
import { SidebarProvider } from './contexts/SidebarContext';
import { ClaspList } from './components/Clasps/ClaspList';
import { PromotionPage } from './components/Promotions/promotionsPage';
import { ScheduleList } from './components/Schedule/ScheduleList';
import { MatterList } from './components/Matters/MatterList';
import { CompositionList } from './components/Compositions/CompositionList';

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
                  <Route path="/agenda" element={<ScheduleList />} />
                  <Route path="/stocks" element={<StockManagement />} />
                  <Route path="/promotions" element={<PromotionPage />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/clasps" element={<ClaspList />} />
                  <Route path="/charms" element={<CharmList />} />
                  <Route path="/compositions" element={<CompositionList />} />
                  <Route path="/product-categories" element={<ProductCategoryList />} />
                  <Route path="/charm-categories" element={<CharmCategoryList />} />
                  <Route path="/matters" element={<MatterList />} />
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