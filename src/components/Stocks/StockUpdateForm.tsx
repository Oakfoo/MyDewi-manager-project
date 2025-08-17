import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../UI/Button';
import { Package, AlertTriangle } from 'lucide-react';

interface StockUpdateFormProps {
  initialData: {
    stock: number;
    minStock: number;
  };
  onSubmit: (data: { stock: number; minStock: number }) => Promise<void>;
  onCancel: () => void;
}

export function StockUpdateForm({ initialData, onSubmit, onCancel }: StockUpdateFormProps) {
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<{ stock: number; minStock: number }>({
    defaultValues: initialData
  });

  const currentStock = watch('stock');
  const currentMinStock = watch('minStock');

  const handleFormSubmit = async (data: { stock: number; minStock: number }) => {
    await onSubmit({
      stock: Number(data.stock),
      minStock: Number(data.minStock)
    });
  };

  const getStockStatus = () => {
    if (currentStock === 0) {
      return { color: 'text-red-600', icon: AlertTriangle, label: 'Rupture de stock' };
    } else if (currentStock <= currentMinStock) {
      return { color: 'text-orange-600', icon: AlertTriangle, label: 'Stock faible' };
    } else {
      return { color: 'text-green-600', icon: Package, label: 'Stock suffisant' };
    }
  };

  const status = getStockStatus();
  const StatusIcon = status.icon;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center">
          <StatusIcon className={`h-5 w-5 mr-2 ${status.color}`} />
          <span className={`font-medium ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock actuel *
          </label>
          <input
            type="number"
            min="0"
            {...register('stock', { 
              required: 'Le stock actuel est requis',
              min: { value: 0, message: 'Le stock ne peut pas être négatif' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.stock && (
            <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Stock minimum *
          </label>
          <input
            type="number"
            min="0"
            {...register('minStock', { 
              required: 'Le stock minimum est requis',
              min: { value: 0, message: 'Le stock minimum ne peut pas être négatif' }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.minStock && (
            <p className="mt-1 text-sm text-red-600">{errors.minStock.message}</p>
          )}
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Informations sur le stock</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Le stock minimum déclenche une alerte quand le stock actuel l'atteint</li>
          <li>• Un stock à 0 indique une rupture de stock</li>
          <li>• Les alertes vous aident à anticiper les réapprovisionnements</li>
        </ul>
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Mettre à jour le stock
        </Button>
      </div>
    </form>
  );
}