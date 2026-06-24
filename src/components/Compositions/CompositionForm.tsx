import { useForm } from "react-hook-form";
import { Composition } from "../../types";
import { charmCategoryService } from "../../services/data/CharmCategoryService";
import { charmService } from "../../services/data/CharmService";
import { claspService } from "../../services/data/ClaspService";
import { matterService } from "../../services/data/MatterService";
import { productCategoryService } from "../../services/data/ProductCategoryService";
import { productService } from "../../services/data/ProductService";
import { useState } from "react";
import { Button } from "../UI/Button";
import { ProductSelector } from "./components/select-product";
import { ListSelectedProducts } from "./components/list-selected-products";
import { Check, X } from "lucide-react";

interface CompositionFormProps {
    initialData: Composition | null;
    onSubmit: (data: Omit<Composition, 'id'>) => Promise<void>;
    onCancel: () => void
}

export interface ProductResponse {
    prod1: string;
    prod2?: string;
    mixed: boolean;
}

export function CompositionForm({initialData, onSubmit, onCancel }: CompositionFormProps) {
    const {
        control, register, handleSubmit, formState: { errors, isSubmitting }
    } = useForm<Omit<Composition, 'id'>>({
        defaultValues: initialData ? {
            name: initialData.name,
            isActive: initialData.isActive,
            products: initialData.products,
            mixedProducts: initialData.mixedProducts,
            clasp: initialData.clasp,
            selectedCharms: initialData.selectedCharms,
            totalPrice: initialData.totalPrice,
            createdAt: initialData.createdAt,
            updatedAt: initialData.updatedAt
        } : {
            name: '',
            isActive: true,
            products: [],
            selectedCharms: [],

        }
    })

    const products = productService.getAll();
    const productCategories = productCategoryService.getAll();
    const matters = matterService.getAll();
    const charms = charmService.getAll();
    const charmCategories = charmCategoryService.getAll();
    const clasps = claspService.getAll();

    const [selectorOpened, setSelectorOpened] = useState<boolean>(false);
    const [isProductSelectorOpened, setProductSelectorOpen] = useState<boolean>(false)

    return (
        <div className="space-y-5">
            {/* Base du produit */}
            <div className="border-b-2 border-gray-300">
                <div className="flex items-center justify-center gap">
                    {isProductSelectorOpened && 
                        <Button variant="success" className="text-white" onClick={() => {
                            setProductSelectorOpen(!isProductSelectorOpened);
                            setSelectorOpened(!selectorOpened);
                        }}>
                            {isProductSelectorOpened && <Check />}
                            {!isProductSelectorOpened && "Modifier"}
                        </Button>
                    }

                    <h3 className="w-full">Base du produit</h3>
                    <Button variant="danger" className="text-white" onClick={() => {
                        setProductSelectorOpen(!isProductSelectorOpened);
                        setSelectorOpened(!selectorOpened);
                    }}>
                        {isProductSelectorOpened && <X />}
                        {!isProductSelectorOpened && "Modifier"}
                    </Button>
                </div>
                <ListSelectedProducts 
                    isSelectorOpened={isProductSelectorOpened}
                    products={initialData?.products}
                />
                <ProductSelector 
                    isOpen={isProductSelectorOpened}
                    list={products}
                    categories={productCategories.filter(f => f.isActive)}
                    matters={matters}
                    setProducts={(data: ProductResponse) => {
                        data.mixed 
                            ? register("products", { value: [data.prod1, data.prod2!]})
                            : register("products", { value: [data.prod1]});
                        register("mixedProducts", {value: data.mixed})
                    }}
                />
            </div>

            {/* Fermoirs si utilisable */}
            

            {/* Zone d'action */}
            {!selectorOpened && <div className="static bottom-0">
                <Button variant="secondary" className="float-left" onClick={() => onCancel()}>
                    Annuler
                </Button>
                <Button className="float-right" onClick={() => onSubmit}>
                    Sauvegarder
                </Button>
            </div>}
        </div>
    )
}