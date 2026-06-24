import { useForm } from 'react-hook-form';
import { EventPromotion } from '../../types';
import { Button } from '../UI/Button';
import { productCategoryService } from '../../services/data/ProductCategoryService';

interface GlobalPromotionFormProps {
  initialData?: EventPromotion | null;
  onSubmit: (data: Omit<EventPromotion, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function EventPromotionForm({ initialData, onSubmit, onCancel }: GlobalPromotionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch
  } = useForm<Omit<EventPromotion, 'id'>>({
    defaultValues: initialData ? {
      label: initialData.label,
      value: initialData.value,
      promotedCategories: initialData.promotedCategories ? initialData.promotedCategories : [],
      isActive: initialData.isActive,
      pourcentage: initialData.pourcentage,
      createdAt: initialData.createdAt,
      updatedAt: initialData.updatedAt
    } : {}
  });
  const categories = productCategoryService.getAll();
    
  const handleFormSubmit = async (data: Omit<EventPromotion, 'id'>) => {
    const formattedData = {
      id: initialData?.id ? initialData.id : "",
      ...data,
      createdAt: initialData?.createdAt ? initialData.createdAt : new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {initialData?.id && (
        <div className='text-gray-400'>{initialData.id}</div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          {/* Nom de l'évènement */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Désignation de la promotion *
          </label>
          <input type="text"
            placeholder='Nom FR'
            {...register('label.fr', { required: 'Le nom est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.label?.fr && (
            <p className="mt-1 text-sm text-red-600">{errors.label?.fr.message}</p>
          )}
          <input type="text"
            placeholder='Nom EN'
            {...register('label.en', { required: 'Le nom est requis' })}
            className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.label?.en && (
            <p className="mt-1 text-sm text-red-600">{errors.label?.en.message}</p>
          )}

          
        </div>
        {/* Montant */}
        <div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Montant de la réduction *
            </label>
            <input 
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              {...register('value', { required: 'Une valeur est requise' })}
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
            )}
            <label className="block text-sm font-medium text-gray-700 mt-2">
              Pourcentage ?
              <input
              type="checkbox"
              {...register('pourcentage')}
              className="h-4 w-4 ml-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
          </div>
          
          <div>
            <h4>Paramêtres</h4>
            <label>
              Catégories 
              <input
              type="checkbox"
              {...register('appliedOnProducts')}
              className="h-4 w-4 ml-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </label>
            {watch("appliedOnProducts") && (
              <select
                {...register("promotedCategories")}
                multiple
                
              >
                <option key="all-categories" value="*">Toutes catégories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name.fr}</option>
                ))}
              </select>
            )}
          </div>
          
        </div>
      </div>

      <div className="flex items-center">
        
        <label className="ml-2 block text-sm text-gray-900">
            Promotion active ?
            <input
            type="checkbox"
            {...register('isActive')}
            className="h-4 w-4 ml-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
        </label>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}