// import React, { useState, useEffect } from 'react';
import { useState } from 'react';
import { Product } from '../../types';
import { Card, CardContent, CardHeader } from '../UI/Card';
import { Button } from '../UI/Button';
import { Modal } from '../UI/Modal';
import { ProductForm } from './ProductForm';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import { productService } from '../../services/data/ProductService';
import { productCategoryService } from '../../services/data/ProductCategoryService';
import { matterService } from '../../services/data/MatterService';

export function ProductList() {
  const products = productService.getAll();
  const categories = productCategoryService.getAll();
  const matters = matterService.getAll();
  const [loading, setLoading] = useState<boolean>(productService.getLoading());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [matterFilter, setMatterFilter] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.categoryId === categoryFilter;
    const matchesMatter = !matterFilter || product.matterId === matterFilter;
    return matchesSearch && matchesCategory && matchesMatter;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name.fr || 'Catégorie inconnue';
  };

  const getMatterName = (matterId: string) => {
    const matter = matters.find(mat => mat.id === matterId);
    return matter?.name.fr || "Matière inconnue"
  }

  const handleSubmit = async (data: Omit<Product, 'id'>) => {
    setLoading(true);
    if (editingProduct) {
      await productService.update(editingProduct.id!, data);
    } else {
      await productService.create(data);
    }
    setIsModalOpen(false);
    setEditingProduct(null);
    setLoading(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setLoading(true);
      await productService.delete(id);
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
          <h1>Catalogue des Produits</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Nouveau Produit
        </Button>
      </div>
      {/* Barre d'outils */ }
      <Card className='sticky top-5 bg-white z-20 p-2'>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex flex-col flex-1 justify-center">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
      
      <div className='grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3 md:gap-6'>
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
            <CardHeader className="relative">
              <div className="absolute w-full top-0 left-0 flex p-2 items-start justify-between">
                <h3 className="font-semibold text-gray-900 text-lg">{product.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {product.isActive ? 'Actif' : 'Inactif'}
                </span>
              </div>
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                  <Package className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute w-full bottom-0 left-0 space-y-1 p-2 bg-gradient-to-b from-transparent via-white to-white">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Collection:</span>
                  <div className="flex items-center font-medium text-gray-900">
                    {getMatterName(product.matterId)}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Prix de base:</span>
                  <div className="flex items-center font-medium text-gray-900">
                    {product.basePrice} XPF
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Catégorie:</span>
                  <span className="font-medium">{getCategoryName(product.categoryId)}</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex space-x-2">
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
        <ProductForm
          initialData={editingProduct}
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