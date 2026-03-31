import React from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "../../UI/Button";
import { Plus, Trash } from "lucide-react";

interface ProductDetailFormProps {
  control: any;
  register: any;
  index?: number | null;
  remove: (id: number) => void;
}

const ProductDetailsForm: React.FC<ProductDetailFormProps> = (
  { control, register, index, remove }
) => {

  const { fields, append, remove: removeValue } = useFieldArray({
    control,
    name: `details.${index}.values`
  });

  const handlePropertyValueDelete = (idProperty: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette caractéristique ?')) {
      removeValue(idProperty);
    } else {
      return;
    }
  }

  return (
    <div className="flex gap-5 p-2 bg-blue-50 border border-gray-200 rounded-xl max-h-[16dvh]">
      {/* <Button type="button" size="sm" variant="danger" onClick={() => remove(index!)}>
                <Trash />
            </Button> */}
      <div className="flex flex-col gap-2 text-sm">
        <input {...register(`details.${index}.name.fr`)} placeholder="Nom FR" />
        <input {...register(`details.${index}.name.en`)} placeholder="Nom EN" />
        <div className="w-full flex gap-5 items-center">
          <label className="text-sm">Caractéristiques</label>
          <Button type="button" className="p-0" onClick={() => append("")}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-1 overflow-auto w-full">
        {fields.map((field: any, valueIndex) => (
          <div key={field.id} className="relative p-2 bg-white border border-black rounded-full overflow-hidden">
            <input
              {...register(`details.${index}.values.${valueIndex}`)}
              placeholder="Valeur"
              className="bg-white"
            />
            <button type="button" className="absolute top-1 right-1 p-1 rounded-full text-white bg-red-500" onClick={() => handlePropertyValueDelete(valueIndex)}>
              <Trash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductDetailsForm;