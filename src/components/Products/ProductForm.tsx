import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Product, CategoryProduct } from '../../types';
import { Button } from '../UI/Button';
import { ImageService } from '../../services/firebaseService';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ProductFormProps {
  initialData?: Product | null;
  categories: CategoryProduct[];
  onSubmit: (data: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function ProductForm({ initialData, categories, onSubmit, onCancel }: ProductFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<Omit<Product, 'id'>>({
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description || '',
      basePrice: initialData.basePrice,
      categoryId: initialData.categoryId,
      isActive: initialData.isActive,
      images: initialData.images || []
    } : {
      images: [],
      isActive: true,
    }
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>(initialData?.images || []);
  const [uploading, setUploading] = useState(false);
  const imageService = new ImageService();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const path = `images/products/${Date.now()}_${file.name}`;
        return await imageService.uploadImage(file, path);
      });

      const urls = await Promise.all(uploadPromises);
      setUploadedImages([...uploadedImages, ...urls]);
    } catch (error) {
      console.error('Erreur lors de l\'upload:', error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleFormSubmit = async (data: Omit<Product, 'id'>) => {
    const formattedData = {
      ...data,
      images: uploadedImages,
      basePrice: Number(data.basePrice),
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom du produit *
          </label>
          <input
            type="text"
            {...register('name', { required: 'Le nom est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix de base (Francs XPF TTC) *
          </label>
          <input
            type="number"
            step="0.01"
            {...register('basePrice', { required: 'Le prix est requis', min: 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.basePrice && (
            <p className="mt-1 text-sm text-red-600">{errors.basePrice.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catégorie *
          </label>
          <select
            {...register('categoryId', { required: 'La catégorie est requise' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name.fr}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>
{/* 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre max de breloques *
          </label>
          <input
            type="number"
            min="1"
            max="20"
            {...register('maxCharms', { required: 'Le nombre max de breloques est requis', min: 1, max: 20 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.maxCharms && (
            <p className="mt-1 text-sm text-red-600">{errors.maxCharms.message}</p>
          )}
        </div> */}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images du produit
        </label>
        <div className="space-y-4">
          {uploadedImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquer pour uploader</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 10MB)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('isActive')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Produit actif
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" loading={isSubmitting || uploading}>
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}