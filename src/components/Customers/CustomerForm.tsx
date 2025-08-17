import React from 'react';
import { useForm } from 'react-hook-form';
import { Customer } from '../../types';
import { Button } from '../UI/Button';

interface CustomerFormProps {
  initialData?: Customer | null;
  onSubmit: (data: Omit<Customer, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function CustomerForm({ initialData, onSubmit, onCancel }: CustomerFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Omit<Customer, 'id'>>({
    defaultValues: initialData ? {
      email: initialData.email,
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      phone: initialData.phone || '',
      address: initialData.address
    } : undefined
  });

  const handleFormSubmit = async (data: Omit<Customer, 'id'>) => {
    const formattedData = {
      ...data,
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
            Prénom *
          </label>
          <input
            type="text"
            {...register('firstName', { required: 'Le prénom est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom *
          </label>
          <input
            type="text"
            {...register('lastName', { required: 'Le nom est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email *
        </label>
        <input
          type="email"
          {...register('email', { 
            required: 'L\'email est requis',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Format d\'email invalide'
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Téléphone
        </label>
        <input
          type="tel"
          {...register('phone')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Adresse</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rue
          </label>
          <input
            type="text"
            {...register('address.street')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ville
            </label>
            <input
              type="text"
              {...register('address.city')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code postal
            </label>
            <input
              type="text"
              {...register('address.postalCode')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pays
            </label>
            <input
              type="text"
              {...register('address.country')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
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