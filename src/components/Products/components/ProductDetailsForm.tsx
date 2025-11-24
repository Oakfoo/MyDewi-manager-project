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
    { control, register, index, remove}
) => {

    const { fields, append, remove: removeValue } = useFieldArray({
        control,
        name: `details.${index}.values`
      });

    return (
        <div className="flex gap-5 p-2 bg-blue-50 rounded-xl">
            <Button type="button" variant="danger" onClick={() => remove(index!)}><Trash /></Button>
            <div className="flex flex-col gap-2 text-sm">
                <label>Nom FR:</label>
                <input {...register(`details.${index}.name.fr`)} placeholder="Nom FR" />
                <label>Nom EN:</label>
                <input {...register(`details.${index}.name.en`)} placeholder="Nom EN" />
            </div>

            <div className="flex flex-col mt-5 gap-5">
                <div className="w-full flex gap-5 items-center">
                    <h6>Caractéristiques</h6>
                    <Button type="button" className="p-0" onClick={() => append("")}>
                        <Plus className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex gap-2">
                    {fields.map((field: any, valueIndex) => (
                    <div key={field.id} className="relative p-2">
                        <input
                            {...register(`details.${index}.values.${valueIndex}`)}
                            placeholder="Valeur"
                            className="relative w-[80px] p-1 rounded-full"
                        />
                        <button className="absolute top-3 right-3 rounded-xl" onClick={() => removeValue(valueIndex)}>
                                <Trash />
                        </button>
                    </div>
                    ))}
                </div>

                {/* <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <Button variant="secondary" onClick={onCancel} type="button">
                        Annuler
                    </Button>
                    <Button type="button" onClick={() => handleDetailSubmit}>
                        Mettre à jour
                    </Button>
                </div> */}
            </div>
        </div>
    );
}

export default ProductDetailsForm;