import { useState } from 'react';
import { Charm } from '../../types';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';

import { Plus, Edit, Trash2, Search} from 'lucide-react';
import { CharmForm } from './CharmForm';
import { charmService } from '../../services/data/CharmService';
import { matterService } from '../../services/data/MatterService';
import { charmCategoryService } from '../../services/data/CharmCategoryService';

export function CharmList() {
  const charms = charmService.getAll();
  const categories = charmCategoryService.getAll();
  const matters = matterService.getAll();
  const [loading, setLoading] = useState<boolean>(charmService.getLoading());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Charm | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [matterFilter, setMatterFilter] = useState('');

  const filteredCharms = charms.filter(charm => {
    const matchesSearch = charm.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || charm.categoryId === categoryFilter;
    const matchesMatter = !matterFilter || charm.matterId === matterFilter;
    return matchesSearch && matchesCategory && matchesMatter;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name.fr || 'Catégorie inconnue';
  };

  const handleSubmit = async (data: Omit<Charm, 'id'>) => {
    setLoading(true)
    if (editingProduct) {
      await charmService.update(editingProduct.id!, data);
    } else {
      await charmService.create(data);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setLoading(false);
  };

  const handleEdit = (charm: Charm) => {
    setEditingProduct(charm);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setLoading(true);
      await charmService.delete(id);
      setLoading(false);
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
          <h1>Catalogue des Charmes</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Nouvelle Breloque
        </Button>
      </div>
      {/* Barre d'outils */ }
      <Card className='p-2 sticky top-5 left-5 right-5 bg-white z-20'>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex flex-col flex-1 justify-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un charm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <p>Catégories</p>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choisir...</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name.fr}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p>Matières</p>
              <select
                value={matterFilter}
                onChange={(e) => setMatterFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choisir...</option>
                {matters.map(matter => (
                  <option key={matter.id} value={matter.id}>
                    {matter.name.fr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        
      </Card>

      {/* Liste des produits */ }
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 md:gap-6">
        {filteredCharms.map((charm) => (
          <Card key={charm.id} className="bg-white overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="p-0 relative aspect-w-16 aspect-h-9">
              <img
                src={charm.image}
                alt={charm.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute w-full bottom-0 left-0 space-y-2 p-2 bg-gradient-to-l from-white via-transparent to-white">
                <div>
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 text-lg">{charm.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${charm.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}>
                      {charm.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Prix de base:</span>
                    <div className="flex items-center font-medium text-gray-900">
                      {charm.price} XPF
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Catégorie:</span>
                    <span className="font-medium">{getCategoryName(charm.categoryId)}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              
              <div className="flex space-x-2 pt-3 border-t border-gray-100">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEdit(charm)}
                    icon={Edit}
                    className="flex-1"
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(charm.id!)}
                    icon={Trash2}
                    className="flex-1"
                  >
                    Supprimer
                  </Button>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
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
          matters={matters}
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