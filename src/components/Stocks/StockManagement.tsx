import React, { useState, useEffect } from 'react';
import { Product, Charm, CategoryProduct, CharmCategory } from '../../types';
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { StockUpdateForm } from './StockUpdateForm';
import { 
  Package, 
  Sparkles, 
  Search, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Edit,
  Filter
} from 'lucide-react';

type StockItem = (Product | Charm) & {
  type: 'product' | 'charm';
  categoryName: string;
};

export function StockManagement() {
  const { data: products, update: updateProduct } = useFirebaseCollection<Product>('Products');
  const { data: charms, update: updateCharm } = useFirebaseCollection<Charm>('Charms');
  const { data: productCategories } = useFirebaseCollection<CategoryProduct>('ProductCategory');
  const { data: charmCategories } = useFirebaseCollection<CharmCategory>('CharmCategory');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'product' | 'charm'>('all');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StockItem | null>(null);

  // Combiner les produits et breloques avec leurs catégories
  const stockItems: StockItem[] = [
    ...products.map(product => ({
      ...product,
      type: 'product' as const,
      categoryName: productCategories.find(cat => cat.id === product.categoryId)?.name.fr || 'Catégorie inconnue'
    })),
    ...charms.map(charm => ({
      ...charm,
      type: 'charm' as const,
      categoryName: charmCategories.find(cat => cat.id === charm.categoryId)?.name.fr || 'Catégorie inconnue'
    }))
  ];

  // Filtrer les éléments
  const filteredItems = stockItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.categoryName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || item.type === filterType;
    
    const matchesStock = filterStock === 'all' || 
                        (filterStock === 'low' && item.stock <= item.minStock && item.stock > 0) ||
                        (filterStock === 'out' && item.stock === 0);
    
    return matchesSearch && matchesType && matchesStock;
  });

  // Statistiques
  const stats = {
    totalProducts: products.length,
    totalCharms: charms.length,
    lowStockItems: stockItems.filter(item => item.stock <= item.minStock && item.stock > 0).length,
    outOfStockItems: stockItems.filter(item => item.stock === 0).length,
  };

  const handleStockUpdate = async (data: { stock: number; minStock: number }) => {
    if (!editingItem) return;

    try {
      if (editingItem.type === 'product') {
        await updateProduct(editingItem.id!, { 
          stock: data.stock, 
          minStock: data.minStock 
        });
      } else {
        await updateCharm(editingItem.id!, { 
          stock: data.stock, 
          minStock: data.minStock 
        });
      }
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du stock:', error);
    }
  };

  const getStockStatus = (item: StockItem) => {
    if (item.stock === 0) {
      return { status: 'out', color: 'bg-red-100 text-red-800', label: 'Rupture' };
    } else if (item.stock <= item.minStock) {
      return { status: 'low', color: 'bg-orange-100 text-orange-800', label: 'Stock faible' };
    } else {
      return { status: 'good', color: 'bg-green-100 text-green-800', label: 'En stock' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Stocks</h1>
          <p className="text-gray-600 mt-1">Gérez les stocks de vos produits et breloques</p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Breloques</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCharms}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingDown className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Stock faible</p>
                <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rupture</p>
                <p className="text-2xl font-bold text-gray-900">{stats.outOfStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit ou une breloque..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'product' | 'charm')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="product">Produits</option>
              <option value="charm">Breloques</option>
            </select>

            <select
              value={filterStock}
              onChange={(e) => setFilterStock(e.target.value as 'all' | 'low' | 'out')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les stocks</option>
              <option value="low">Stock faible</option>
              <option value="out">Rupture</option>
            </select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Article
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock actuel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock minimum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => {
                  const stockStatus = getStockStatus(item);
                  return (
                    <tr key={`${item.type}-${item.id}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {item.type === 'product' && (item as Product).images.length > 0 ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={(item as Product).images[0]}
                                alt={item.name}
                              />
                            ) : (item as Charm).image ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={(item as Charm).image}
                                alt={item.name}
                              />
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                {item.type === 'product' ? (
                                  <Package className="h-5 w-5 text-gray-400" />
                                ) : (
                                  <Sparkles className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            {item.description && (
                              <div className="text-sm text-gray-500 truncate max-w-xs">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {item.type === 'product' ? (
                            <Package className="h-4 w-4 mr-2 text-blue-500" />
                          ) : (
                            <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                          )}
                          <span className="text-sm text-gray-900 capitalize">
                            {item.type === 'product' ? 'Produit' : 'Breloque'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.categoryName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-semibold text-gray-900">
                          {item.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.minStock}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setEditingItem(item);
                            setIsModalOpen(true);
                          }}
                          icon={Edit}
                        >
                          Modifier
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Modal de modification du stock */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        title={`Modifier le stock - ${editingItem?.name}`}
        size="md"
      >
        {editingItem && (
          <StockUpdateForm
            initialData={{
              stock: editingItem.stock,
              minStock: editingItem.minStock
            }}
            onSubmit={handleStockUpdate}
            onCancel={() => {
              setIsModalOpen(false);
              setEditingItem(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}