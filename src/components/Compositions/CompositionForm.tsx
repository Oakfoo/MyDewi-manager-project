import { useState } from "react";
import { useForm } from "react-hook-form";
import { Composition, CategoryProduct } from "../../types";
import { charmService } from "../../services/data/CharmService";
import { claspService } from "../../services/data/ClaspService";
import { matterService } from "../../services/data/MatterService";
import { productCategoryService } from "../../services/data/ProductCategoryService";
import { productService } from "../../services/data/ProductService";
import { Button } from "../UI/Button";
import { TypeSelector } from "./components/select-type";
import { ProductSelector } from "./components/select-product";
import { ClaspSelector } from "./components/select-clasp";
import { CharmSelector } from "./components/select-charms";
import { Trash, X } from "lucide-react";

interface CompositionFormProps {
    initialData: Composition | null;
    onSubmit: (data: Omit<Composition, "id">) => Promise<void>;
    onCancel: () => void;
    onDelete: (id: string) => void;
}

export interface ProductResponse {
    prod1: string;
    prod2?: string;
    mixed: boolean;
}

export function CompositionForm({ initialData, onSubmit, onCancel, onDelete }: CompositionFormProps) {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<Omit<Composition, "id">>({
        defaultValues: initialData
            ? {
                  name: initialData.name,
                  isActive: initialData.isActive,
                  products: initialData.products,
                  categoryId: initialData.categoryId,
                  matterId: initialData.matterId,
                  mixedProducts: initialData.mixedProducts,
                  clasp: initialData.clasp ?? '',
                  selectedCharms: initialData.selectedCharms,
                  totalPrice: initialData.totalPrice,
                  createdAt: initialData.createdAt,
                  updatedAt: initialData.updatedAt,
              }
            : {
                  name: "",
                  isActive: true,
                  products: [],
                  categoryId: "",
                  matterId: "",
                  mixedProducts: false,
                  selectedCharms: [],
                  totalPrice: 0,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
              },
    });

    const products = productService.getAll();
    const productCategories = productCategoryService.getAll();
    const matters = matterService.getAll();
    const charms = charmService.getAll();
    const clasps = claspService.getAll();

    const [selectedCategoryId, setSelectedCategoryId] = useState<string>(initialData?.categoryId ?? "");
    const [selectedMatterId, setSelectedMatterId] = useState<string>(initialData?.matterId ?? "");
    const [selectedCategory, setSelectedCategory] = useState<CategoryProduct | undefined>(
        productCategories.find((c) => c.id === selectedCategoryId)
    );
    const [formProducts, setFormProducts] = useState<string[]>(initialData?.products ?? []);
    const [formMixed, setFormMixed] = useState<boolean>(initialData?.mixedProducts ?? false);
    const [formClasp, setFormClasp] = useState<string | undefined>(initialData?.clasp);
    const [formCharms, setFormCharms] = useState(initialData?.selectedCharms ?? []);

    const [isProductSelectorOpen, setProductSelectorOpen] = useState(false);
    const [isClaspSelectorOpen, setClaspSelectorOpen] = useState(false);
    const [isCharmSelectorOpen, setCharmSelectorOpen] = useState(false);
    const [anySelectorOpen, setAnySelectorOpen] = useState(false);

    function handleTypeChange(categoryId: string, matterId: string) {
        setSelectedCategoryId(categoryId);
        setSelectedMatterId(matterId);
        const cat = productCategories.find((c) => c.id === categoryId);
        setSelectedCategory(cat);
        setFormProducts([]);
        setFormMixed(false);
        setFormClasp(undefined);
        setFormCharms([]);
    }

    function handleProductsValidate(data: ProductResponse) {
        const newProducts = data.mixed ? [data.prod1, data.prod2!].filter(Boolean) : [data.prod1].filter(Boolean);
        setFormProducts(newProducts);
        setFormMixed(data.mixed);
        setProductSelectorOpen(false);
        setAnySelectorOpen(false);
    }

    function handleClaspValidate(claspId: string | undefined) {
        setFormClasp(claspId);
        setClaspSelectorOpen(false);
        setAnySelectorOpen(false);
    }

    function handleCharmsValidate(charms: typeof formCharms) {
        setFormCharms(charms);
        setCharmSelectorOpen(false);
        setAnySelectorOpen(false);
    }

    const useClasp = selectedCategory?.properties.useClasp ?? false;
    const useCharms = selectedCategory?.properties.useCharms ?? false;
    const minAmountCharm = selectedCategory?.properties.minAmountCharm ?? 0;
    const getTotalPrice = () => {
        // Prix du premier produit
        let total: number = productService.getById(formProducts[0])?.basePrice ?? 0;
        // Ajout des prix des charmes
        formCharms.forEach((el) => {
            const charm = charmService.getById(el.charmId);

            total += charm ? ((charm?.price!) * el.charmQuantity) : 0;
        })
        return total;
    }

    const onFormSubmit = async (data: Omit<Composition, "id">) => {
        const totalPrice = getTotalPrice();

        const payload: Omit<Composition, "id"> = {
            ...data,
            categoryId: selectedCategoryId,
            matterId: selectedMatterId,
            products: formProducts,
            
            mixedProducts: formMixed,
            selectedCharms: useCharms ? formCharms : [],
            totalPrice,
            updatedAt: Date.now(),
        };

        // if(!useClasp && "clasp" in payload) {
        //     delete payload["clasp"];
        // }
        // if(useClasp) {
        //     payload.clasp = formClasp;
        // }
        if(!useClasp) {
            if("clasp" in payload) delete payload["clasp"];
            
        } else {
            payload.clasp = formClasp;
        }
        await onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 mb-20">
            {/* Nom */}
            <div className="flex items-center gap-3">
                <label htmlFor="comp-name" className="font-medium">
                    Nom :
                </label>
                <input
                    id="comp-name"
                    {...register("name", { required: true })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nom de la composition"
                />
            </div>

            {/* Type (catégorie + matière) */}
            <div className="border-b-2 border-gray-300 pb-4">
                <h3 className="w-full mb-3">Type de composition</h3>
                <TypeSelector
                    categories={productCategories.filter((c) => c.isActive)}
                    matters={matters.filter((m) => m.isActive)}
                    selectedCategoryId={selectedCategoryId}
                    selectedMatterId={selectedMatterId}
                    onChange={handleTypeChange}
                />
            </div>

            {/* Base du produit */}
            {selectedCategoryId && selectedMatterId && (
                <div className="border-b-2 border-gray-300 pb-4">
                    <div className="flex items-center justify-center gap-2">
                        <h3 className="w-full">Base du produit</h3>
                        <Button
                            type="button"
                            variant="danger"
                            className="text-white"
                            onClick={() => {
                                setProductSelectorOpen(!isProductSelectorOpen);
                                setAnySelectorOpen(!isProductSelectorOpen);
                            }}
                        >
                            {isProductSelectorOpen ? <X /> : "Modifier"}
                        </Button>
                    </div>
                    <ProductSelector
                        isOpen={isProductSelectorOpen}
                        list={products}
                        selectedCategoryId={selectedCategoryId}
                        selectedMatterId={selectedMatterId}
                        canBeMixed={selectedCategory?.properties.canBeMixed ?? false}
                        validatedProducts={formProducts}
                        onValidate={handleProductsValidate}
                    />
                </div>
            )}

            {/* Fermoir */}
            {useClasp && selectedMatterId && (
                <div className="border-b-2 border-gray-300 pb-4">
                    <div className="flex items-center justify-center gap-2">
                        <h3 className="w-full">Fermoir</h3>
                        <Button
                            type="button"
                            variant="danger"
                            className="text-white"
                            onClick={() => {
                                setClaspSelectorOpen(!isClaspSelectorOpen);
                                setAnySelectorOpen(!isClaspSelectorOpen);
                            }}
                        >
                            {isClaspSelectorOpen ? <X /> : "Modifier"}
                        </Button>
                    </div>
                    <ClaspSelector
                        isOpen={isClaspSelectorOpen}
                        list={clasps.filter((c) => c.matterId === selectedMatterId)}
                        validatedClasp={formClasp}
                        onValidate={handleClaspValidate}
                    />
                </div>
            )}

            {/* Charms */}
            {useCharms && selectedMatterId && (
                <div className="border-b-2 border-gray-300 pb-4">
                    <div className="flex items-center justify-center gap-2">
                        <h3 className="w-full">Charms</h3>
                        <Button
                            type="button"
                            variant="danger"
                            className="text-white"
                            onClick={() => {
                                setCharmSelectorOpen(!isCharmSelectorOpen);
                                setAnySelectorOpen(!isCharmSelectorOpen);
                            }}
                        >
                            {isCharmSelectorOpen ? <X /> : "Modifier"}
                        </Button>
                    </div>
                    <CharmSelector
                        isOpen={isCharmSelectorOpen}
                        list={charms.filter((c) => c.matterId === selectedMatterId)}
                        validatedCharms={formCharms}
                        minAmount={minAmountCharm}
                        onValidate={handleCharmsValidate}
                    />
                </div>
            )}

            { 
                <div className="grid grid-cols-2">
                    <div className="flex gap-[1rem]">
                        <label>Montant total: {getTotalPrice()}</label>
                    </div>
                    <div className="flex gap-[1rem]">

                    </div>
                </div>
            }

            {/* Zone d'action */}
            {!anySelectorOpen && (
                <div className="static bottom-0 flex items-center justify-center gap-[1rem]">
                    {initialData && <Button variant="danger" onClick={() => onDelete(initialData.id!)}>
                        <Trash className="w-4 h-4"/>
                    </Button>}
                    <Button variant="secondary" onClick={onCancel}>
                        Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        Sauvegarder
                    </Button>
                </div>
            )}
        </form>
    );
}
