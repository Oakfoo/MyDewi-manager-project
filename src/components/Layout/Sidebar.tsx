import { NavLink } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { Button } from '../UI/Button';
import {
  // BookMarked,
  Users,
  ShoppingBag,
  Package,
  Tags,
  Sparkles,
  Gem,
  TrendingUp,
  LogOut,
  DollarSign,
  Settings,
  X,
  GitCommitHorizontalIcon,
  Palette
} from 'lucide-react';

// const navigation = [
//   { name: 'Tableau de bord', href: '/', icon: BookMarked},
//   { name: 'Clients', href: '/customers', icon: Users },
//   { name: 'Commandes', href: '/orders', icon: ShoppingBag },
//   { name: 'Produits', href: '/products', icon: Package },
//   { name: 'Breloques', href: '/charms', icon: Sparkles },
//   { name: 'Gestion stocks', href: '/stocks', icon: TrendingUp },
//   { name: 'Catégories Produits', href: '/product-categories', icon: Tags },
//   { name: 'Catégories Breloques', href: '/charm-categories', icon: Tags },
//   { name: 'Codes promo', href: '/promo-codes', icon: DollarSign},
//   { name: 'Paramètres', href: '/configuration', icon: Settings },
// ];

const suiviNavigation = [
  // { name: 'Tableau de bord', href: '/', icon: BookMarked},
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Commandes', href: '/orders', icon: ShoppingBag },
  // { name: 'Agenda', href: '/agenda', icon: Notebook},
  { name: 'Gestion stocks', href: '/stocks', icon: TrendingUp },
  { name: 'Promotions', href: '/promotions', icon: DollarSign},
]

const stockNavigation = [
  { name: 'Compositions', href: '/compositions', icon: Palette},
  { name: 'Produits', href: '/products', icon: Package },
  { name: 'Breloques', href: '/charms', icon: Sparkles },
  { name: 'Fermoirs', href: '/clasps', icon: GitCommitHorizontalIcon},
]

const categoryNavigation = [
  { name: 'Produits', href: '/product-categories', icon: Tags },
  { name: 'Breloques', href: '/charm-categories', icon: Tags },
  { name: 'Matières', href: '/matters', icon: Tags}
]

const parametersNavigation = [
  { name: 'Paramètres', href: '/configuration', icon: Settings }
]

export function Sidebar() {
  const { logout, currentUser } = useAuth();
  const { isOpen, close } = useSidebar();
  

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <div>
      {/* Mobile menu */}
      <div className='md:hidden'>
        {/* Overlay pour mobile */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={close}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed overflow-y-auto pb-2 lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header avec bouton fermer sur mobile */}
          <div className="flex items-center justify-between h-16 bg-gradient-to-r from-blue-600 to-purple-600 px-4">
            <div className="flex items-center text-center">
              <Gem className="h-8 w-8 text-white mr-2" />
              <p className="text-white text-xl font-bold">MY DEWI</p>
            </div>
            <button
              onClick={close}
              className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          {/* Données utilisateur connecté */}
          <div className="p-4 border-t border-gray-200">
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
              className="w-full mx-auto"
            >
              Déconnexion
            </Button>
          </div>
          {/* Barre de navigation mobile */}
          <nav>
            <div className="px-4 space-y-1">
              <h4>
                Suivi
              </h4>
              {suiviNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `navLink ${isActive
                      ? 'activeLink'
                      : 'inactiveLink'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
              <h4>
                Catalogues
              </h4>
              {stockNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `navLink ${isActive
                      ? 'activeLink'
                      : 'inactiveLink'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
              <h4>
                Catégories
              </h4>
              {categoryNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `navLink ${isActive
                      ? 'activeLink'
                      : 'inactiveLink'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
              <h4>
                Options
              </h4>
              {parametersNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `navLink ${isActive
                      ? 'activeLink'
                      : 'inactiveLink'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* Menu ecran large */}
      <div className="hidden md:flex items-center justify-center h-16 bg-gradient-to-b from-purple-400 to-blue-700">
        <Gem className="h-8 w-8 text-white mr-2" />
        <span className="text-white text-xl font-bold">My DEWI</span>
      </div>
      <div className="hidden md:block bottom-0 left-0 p-4 border-t border-gray-200">
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
      {/* Barre de navigation ordinateur */}
      <nav className="hidden md:block mb-2">
        <div className="px-4 space-y-2">
          <h4>
            Suivi
          </h4>
          {suiviNavigation.map((item) => (
            <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `navLink ${isActive
                  ? 'activeLink'
                  : 'inactiveLink'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <p className='w-full'>{item.name}</p>
          </NavLink>
          ))}
          <h4>
            Catalogues
          </h4>
          {stockNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `navLink ${isActive
                  ? 'activeLink'
                  : 'inactiveLink'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <p className='w-full'>{item.name}</p>
            </NavLink>
          ))}
          <h4>
            Catégories
          </h4>
          {categoryNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `navLink ${isActive
                  ? 'activeLink'
                  : 'inactiveLink'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <p className='w-full'>{item.name}</p>
            </NavLink>
          ))}
          <h4>
            Options
          </h4>
          {parametersNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `navLink ${isActive
                  ? 'activeLink'
                  : 'inactiveLink'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <p className='w-full'>{item.name}</p>
            </NavLink>
          ))}
        </div>
      </nav>
      
    </div>
  )
}