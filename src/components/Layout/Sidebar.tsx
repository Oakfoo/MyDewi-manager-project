import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../UI/Button';
import { 
  Users, 
  ShoppingBag, 
  Package, 
  Tags, 
  Sparkles,
  Gem,
  TrendingUp,
  LogOut
} from 'lucide-react';

const navigation = [
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Commandes', href: '/orders', icon: ShoppingBag },
  { name: 'Produits', href: '/products', icon: Package },
  { name: 'Breloques', href: '/charms', icon: Sparkles },
  { name: 'Gestion des stocks', href: '/stocks', icon: TrendingUp },
  { name: 'Catégories Produits', href: '/product-categories', icon: Tags },
  { name: 'Catégories Breloques', href: '/charm-categories', icon: Tags },
  
];

export function Sidebar() {
  const { logout, currentUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div className="relative bg-white shadow-xl w-64 min-h-screen">
      <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <Gem className="h-8 w-8 text-white mr-2" />
        <span className="text-white text-xl font-bold">Gestion My Dewi</span>
      </div>
      
      <nav className="mt-8">
        <div className="px-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </NavLink>
          ))}
        </div>
        
      </nav>
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1">Connecté en tant que:</p>
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser?.email}
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleLogout}
            icon={LogOut}
            className="w-full"
          >
            Déconnexion
          </Button>
        </div>
    </div>
  );
}