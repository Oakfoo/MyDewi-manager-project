// import React, { useState, useEffect } from 'react';
import { useState } from 'react';
import { CategoryProduct } from '../../types';
import { useFirebaseCollection } from '../../hooks/useFirebaseCollection';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { ProductCategoryForm } from './ProductCategoryForm';
// import { Plus, Edit, Trash2, Search, Package, Euro } from 'lucide-react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

export function ProductCategoryList() {
  const { data: categories, loading, create, update, remove } = useFirebaseCollection<CategoryProduct>('ProductCategory');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryProduct | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.fr.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch;
  });

  const handleSubmit = async (data: Omit<CategoryProduct, 'id'>) => {
    if (editingCategory) {
      await update(editingCategory.id!, data);
    } else {
      await create(data);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const handleEdit = (category: CategoryProduct) => {
    setEditingCategory(category);
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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600 mt-1">Gérez vos bracelets et colliers personnalisables</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Nouvelle catégorie
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
          </div>
        </CardHeader>
        {/* Liste des produits */ }
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-gray-900 text-lg">{category.name.fr}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {category.isActive ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-2 pt-3 border-t border-gray-100">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleEdit(category)}
                        icon={Edit}
                        className="flex-1"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(category.id!)}
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
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Modifier le produit' : 'Nouveau produit'}
        size="xl"
      >
        <ProductCategoryForm
          initialData={editingCategory}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
        />
      </Modal>
    </div>
  );
}