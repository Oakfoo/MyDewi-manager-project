import { useForm } from 'react-hook-form';
import { CategoryProduct } from '../../types';
import { Button } from '../UI/Button';
import { productCategoryService } from '../../services/data/ProductCategoryService';
import { Card, CardContent, CardHeader } from '../UI/Card';

interface ProductCategoryFormProps {
  initialData?: CategoryProduct | null;
  onSubmit: (data: Omit<CategoryProduct, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function ProductCategoryForm({ initialData, onSubmit, onCancel }: ProductCategoryFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<Omit<CategoryProduct, 'id'>>({
    defaultValues: initialData ? {
      name: initialData.name,
      displayOrder: initialData.displayOrder,
      properties: initialData.properties,
      isActive: initialData.isActive
    } : {
      isActive: true,
      properties: {
        useClasp: true,
        useCharms: true,
        minAmountCharm: 1,
        canBeMixed: true
      }
    }
  });

  /** Contrôler parmi les catégories si un équivalent existe */ 
  const sameDisplayOrder = () => {
    const cdo = watch("displayOrder")
    const same = productCategoryService.getAll().filter((el) => el.displayOrder === cdo && el.id != initialData?.id)
    return same.length > 0 ? true : false;
  }

  const handleFormSubmit = async (data: Omit<CategoryProduct, 'id'>) => {
    const formattedData = {
      ...data,
      id: initialData?.id || '',
      createdAt: initialData?.createdAt || new Date().getTime(),
      updatedAt: new Date().getTime(),
    };
    await onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {initialData?.id ? (
        <div className='text-gray-400 text-xs'>
          ID: {initialData.id}
        </div>
      ) : ''}
      <Card>
        <CardHeader>
          <h1>Informations générales</h1>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <h1>Informations techniques</h1>
        </CardHeader>
        
        <div className='flex flex-col md:flex-row space-x-5 p-5'>
          {/* Ordre d'affichage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre d'affichage *
            </label>
            <input type="number"
              min="1"
              {...register('displayOrder', { valueAsNumber: true, required: "L'ordre de passage est requis" })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          {/* Propriétés de la catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Détails de la catégorie
            </label>
            <ul className='my-5 space-y-4'>
              <li className={`px-5 py-2 space-x-5 border ${watch("properties.useClasp") === true ? "bg-green-200 border-green-100" : "bg-gray-100 border-gray-200"} rounded-full`}>
                <input id="chkbx-clasp" className='text-right' type="checkbox" {...register("properties.useClasp")}/>
                <label htmlFor='chkbx-clasp'>Utilise les fermoirs</label>
              </li>
              <li className={`px-5 py-2 space-x-5 border ${watch("properties.useCharms") === true ? "bg-green-200 border-green-100" : "bg-gray-100 border-gray-200"} rounded-full`}>
                <input id="chkbx-charms" type="checkbox" {...register("properties.useCharms")}/>
                <label htmlFor='chkbx-charms'>Utilise les charmes</label>
                {
                  watch("properties.useCharms") === true && (
                    <div className='flex gap-1'>
                      <label htmlFor="min-amount-charms">Quantité minimale : </label>
                      <input id="min-amount-charms" type="number" min="1" {... register("properties.minAmountCharm")} aria-label="Quantité minimale" />
                    </div>
                    
                  )
                }
              </li>
              <li className={`px-5 py-2 space-x-5 border ${watch("properties.canBeMixed") === true ? "bg-green-200 border-green-100" : "bg-gray-100 border-gray-200"} rounded-full`}>
                <input id="chkbx-mixed" type="checkbox" {...register("properties.canBeMixed")}/>
                <label htmlFor='chkbx-mixed'>Peut être mixé (2nd Produit)</label>
              </li>
            </ul>
          </div>
        </div>
        
      </Card>

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
        <Button type="submit" loading={isSubmitting} disabled={sameDisplayOrder()}>
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  );
}