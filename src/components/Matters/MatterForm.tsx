import { Matter } from "../../types";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardContent } from "../UI/Card";
import { Button } from "../UI/Button";

interface MatterFormProps {
  initialData?: Matter | null;
  onSubmit: (data: Omit<Matter, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export function MatterForm({
  initialData,
  onSubmit,
  onCancel
}: MatterFormProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Omit<Matter, "id">>({
    defaultValues: initialData ? {
      name: initialData.name,
      isActive: initialData.isActive,
    } : {
      isActive: true
    }
  })

  const handleFormSubmit = async (data: Omit<Matter, 'id'>) => {
    const formattedData = {
      ...data,
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

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onCancel} type="button">
          Annuler
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initialData ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
    )
}