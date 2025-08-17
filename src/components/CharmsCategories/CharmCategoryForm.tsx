import { useForm } from 'react-hook-form';
import { CharmCategory } from '../../types';
import { Button } from '../UI/Button';

interface CharmCategoryFormProps {
  initialData?: CharmCategory | null;
  onSubmit: (data: Omit<CharmCategory, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function CharmCategoryForm({ initialData, onSubmit, onCancel }: CharmCategoryFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<Omit<CharmCategory, 'id'>>({
    defaultValues: initialData ? {
      name: initialData.name,
      isActive: initialData.isActive
    } : {
      isActive: true
    }
  });

  const handleFormSubmit = async (data: Omit<CharmCategory, 'id'>) => {
    const formattedData = {
      ...data,
      createdAt: initialData?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <h4>Nom de la catégorie</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Français *
          </label>
          <input
            type="text"
            {...register('name.fr', { required: 'Le nom est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Anglais *
          </label>
          <input
            type="text"
            {...register('name.en', { required: 'Le nom est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          {...register('isActive')}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-900">
          Catégorie active
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