import { useForm } from "react-hook-form";
import { PromoCode } from "../../types";
import { Button } from "../UI/Button";


interface PromoCodeFormProps {
    initialData?: PromoCode | null;
    onSubmit: (data: Omit<PromoCode, 'id'>) => Promise<void>;
    onCancel: () => void;
}

export function PromoCodeForm({ initialData, onSubmit, onCancel}: PromoCodeFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Omit<PromoCode, 'id'>>({
        defaultValues: initialData ? {
            label: initialData.label,
            deliveryFree: initialData.deliveryFree,
            reduction: initialData.reduction,
            isActive: initialData.isActive || true
        } : undefined
    });

    const handleFormSubmit = async (data: PromoCode) => {
        const formattedData = {
          ...data,
          reduction: Number(data.reduction),
          createdAt: initialData?.createdAt || new Date(),
          updatedAt: new Date(),
        };
        await onSubmit(formattedData);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Libellé *
                </label>
                <input
                    type="text"
                    {...register('label', { required: 'Un nom est requis' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.label && (
                    <p className="mt-1 text-sm text-red-600">{errors.label.message}</p>
                )}
            </div>
    
            <div className="grid grid-cols-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Livraison offerte 
                </label>
                <input
                    type="checkbox"
                    {...register('deliveryFree')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
    
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Réduction appliquée
                </label>
                <input
                    type="number"
                    {...register('reduction')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
            </div>
            <div className="grid grid-cols-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Actif 
                </label>
                <input
                    type="checkbox"
                    {...register('isActive')}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
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