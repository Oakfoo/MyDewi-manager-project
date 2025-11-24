import { useState } from 'react';
import { CharmCategory, Charm } from '../../types';
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';

// import { Plus, Edit, Trash2, Search, Package, Euro } from 'lucide-react';
import { Plus, Edit, Trash2, Search} from 'lucide-react';
import { CharmForm } from './CharmForm';

export function CharmList() {
  const { data: products, loading, create, update, remove } = useFirebaseCollection<Charm>('Charms', "name", "asc");
  const { data: categories } = useFirebaseCollection<CharmCategory>('CharmCategory', "createdAt", "desc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Charm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name.fr || 'Catégorie inconnue';
  };

  const handleSubmit = async (data: Omit<Charm, 'id'>) => {
    if (editingProduct) {
      await update(editingProduct.id!, data);
    } else {
      await create(data);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: Charm) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      await remove(id);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */ }
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catalogue des Charmes</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Nouvelle Breloque
        </Button>
      </div>
      {/* Barre d'outils */ }
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name.fr}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        {/* Liste des produits */ }
        <CardContent className="p-0 overflow-y-auto min-h-80">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-contain"
                    />
                </div>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Prix de base:</span>
                        <div className="flex items-center font-medium text-gray-900">
                            {product.price} XPF
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Catégorie:</span>
                        <span className="font-medium">{getCategoryName(product.categoryId)}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-3 border-t border-gray-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        icon={Edit}
                        className="flex-1"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(product.id!)}
                        icon={Trash2}
                        className="flex-1"
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Modal Création/Modification */ }
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
        size="xl"
      >
        <CharmForm
          initialData={editingProduct}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      </Modal>
    </div>
  );
}