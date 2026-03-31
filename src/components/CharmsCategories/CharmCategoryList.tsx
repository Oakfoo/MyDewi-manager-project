// import React, { useState, useEffect } from 'react';
import { useState } from 'react';
import { CharmCategory } from '../../types';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { CharmCategoryForm } from './CharmCategoryForm';
// import { Plus, Edit, Trash2, Search, Package, Euro } from 'lucide-react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { charmCategoryService } from '../../services/data/CharmCategoryService';

export function CharmCategoryList() {
  const categories = charmCategoryService.getAll("displayOrder", "asc");
  const [loading, setLoading] = useState<boolean>(charmCategoryService.getLoading())
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CharmCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(cat => {
    const matches = cat.name.fr.toLowerCase().includes(searchTerm.toLowerCase())
    || cat.name.en.toLowerCase().includes(searchTerm.toLowerCase());
    return matches;
  });

  const handleSubmit = async (data: Omit<CharmCategory, 'id'>) => {
    setLoading(true);
    if (editingCategory) {
      await charmCategoryService.update(editingCategory.id!, data);
    } else {
      await charmCategoryService.create(data);
    }
    setIsModalOpen(false);
    setEditingCategory(null);
    setLoading(false);
  };

  const handleEdit = (category: CharmCategory) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      setLoading(true);
      await charmCategoryService.delete(id);
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
          <h1>Catégories de breloques</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Nouvelle catégorie
        </Button>
      </div>
      {/* Barre d'outils */ }
      <Card className='sticky top-0 left-0 bg-white'>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 p-2 md:p-5">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="p-2 bg-white overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                  {category.displayOrder ? category.displayOrder : '?'}
                </span>
                <h3 className="font-semibold text-gray-900 text-lg">{category.name.fr}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {category.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex space-x-2 border-gray-100">
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
      
      {/* Modal Création/Modification */ }
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        size="xl"
      >
        <CharmCategoryForm
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