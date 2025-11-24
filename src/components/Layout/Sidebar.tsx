import { NavLink } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { useSidebar } from '../../contexts/SidebarContext';
import { Button } from '../UI/Button';
import {
  BookMarked,
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
  LogIn
} from 'lucide-react';

const navigation = [
  { name: 'Tableau de bord', href: '/', icon: BookMarked},
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Commandes', href: '/orders', icon: ShoppingBag },
  { name: 'Produits', href: '/products', icon: Package },
  { name: 'Breloques', href: '/charms', icon: Sparkles },
  { name: 'Gestion stocks', href: '/stocks', icon: TrendingUp },
  { name: 'Catégories Produits', href: '/product-categories', icon: Tags },
  { name: 'Catégories Breloques', href: '/charm-categories', icon: Tags },
  { name: 'Codes promo', href: '/promo-codes', icon: DollarSign},
  // { name: 'Paramètres', href: '/configuration', icon: Settings },
];

const suiviNavigation = [
  // { name: 'Tableau de bord', href: '/', icon: BookMarked},
  { name: 'Clients', href: '/customers', icon: Users },
  { name: 'Commandes', href: '/orders', icon: ShoppingBag },
  { name: 'Gestion stocks', href: '/stocks', icon: TrendingUp },
  { name: 'Promotions', href: '/promo-codes', icon: DollarSign},
]

const stockNavigation = [
  { name: 'Produits', href: '/products', icon: Package },
  { name: 'Breloques', href: '/charms', icon: Sparkles },
  { name: 'Fermoirs', href: '/clasps', icon: LogIn},
  
]

const categoryNavigation = [
  { name: 'Produits', href: '/product-categories', icon: Tags },
  { name: 'Breloques', href: '/charm-categories', icon: Tags },
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

  // return (
  //   <div className="relative bg-white shadow-xl min-w-64 min-h-64">
  //     <div className="flex items-center justify-center h-16 bg-gradient-to-r from-blue-600 to-purple-600">
  //       <Gem className="h-8 w-8 text-white mr-2" />
  //       <span className="text-white text-xl font-bold">MY DEWI - Gestion</span>
  //     </div>
      
  //     {/* Connexion */}
  //     <div className="p-4 border-t border-gray-200 bg-white">
  //         <div className="mb-3">
  //           <p className="text-xs text-gray-500 mb-1">Connecté en tant que:</p>
  //           <p className="text-sm font-medium text-gray-900 truncate">
  //             {currentUser?.email}
  //           </p>
  //         </div>
  //         <Button
  //           variant="danger"
  //           size="sm"
  //           onClick={handleLogout}
  //           icon={LogOut}
  //           className="w-full"
  //         >
  //           Déconnexion
  //         </Button>
  //     </div>

  //     {/* Navigation */}
  //     <div className="p-4 border-t border-gray-200 bg-white overflow-auto">
  //       <nav className="mt-8">
  //         <div className="px-4 space-y-2">
  //           {navigation.map((item) => (
  //             <NavLink
  //               key={item.name}
  //               to={item.href}
  //               className={({ isActive }) =>
  //                 `group flex items-center min-w-full px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
  //                   isActive
  //                     ? 'bg-gradient-to-r from-blue-500 to-purple-700 text-white shadow-lg'
  //                     : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
  //                 }`
  //               }
  //             >
  //               <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
  //               {item.name}
  //             </NavLink>
  //           ))}
  //         </div>
          
  //       </nav>
  //     </div>
  //   </div>
  // );
  return (
    <div>
      {/* Mobile menu */}
      <div className='lg:hidden'>
        {/* Overlay pour mobile */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={close}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Header avec bouton fermer sur mobile */}
          <div className="flex items-center justify-between h-16 bg-gradient-to-r from-blue-600 to-purple-600 px-4">
            <div className="flex items-center">
              <Gem className="h-8 w-8 text-white mr-2" />
              <span className="text-white text-xl font-bold">My DEWI</span>
            </div>
            <button
              onClick={close}
              className="lg:hidden text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="p-4 mb-5 border-t border-gray-200">
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
          <nav className="mt-8 flex-1">
            <div className="px-4 space-y-2">
              <h4>Suivi</h4>
              {suiviNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
              <h4>Catalogues</h4>
              {stockNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  {item.name}
                </NavLink>
              ))}
              <div className="bt-2 bl-2 ">
                <h4>Catégories</h4>
                {categoryNavigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      `group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive
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
      <nav className="hidden lg:block mt-8 mb-10">
        <div className="px-4 space-y-2">
          <h4 className='p-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-700 text-center text-white uppercase'>
            Suivi
          </h4>
          {suiviNavigation.map((item) => (
            <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `group flex items-center p-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg text-right'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 text-left'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <p className='w-full'>{item.name}</p>
          </NavLink>
          ))}
          <h4 className='p-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-700 text-center text-white uppercase'>
            Catalogues
          </h4>
          {stockNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center p-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg text-right'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 text-left'
                }`
              }
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <p className='w-full'>{item.name}</p>
            </NavLink>
          ))}
          <h4 className='p-1 rounded-full bg-gradient-to-r from-blue-400 to-purple-700 text-center text-white uppercase'>
            Catégories
          </h4>
          {categoryNavigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center p-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg text-right'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600 text-left'
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