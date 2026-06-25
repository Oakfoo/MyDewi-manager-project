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
import { ListSelectedProducts } from "./components/list-selected-products";
import { ClaspSelector } from "./components/select-clasp";
import { CharmSelector } from "./components/select-charms";
import { Check, X } from "lucide-react";

interface CompositionFormProps {
    initialData: Composition | null;
    onSubmit: (data: Omit<Composition, "id">) => Promise<void>;
    onCancel: () => void;
}

export interface ProductResponse {
    prod1: string;
    prod2?: string;
    mixed: boolean;
}

export function CompositionForm({ initialData, onSubmit, onCancel }: CompositionFormProps) {
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
                  clasp: initialData.clasp,
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

    function handleProductsChange(data: ProductResponse) {
        const newProducts = data.mixed ? [data.prod1, data.prod2!].filter(Boolean) : [data.prod1].filter(Boolean);
        setFormProducts(newProducts);
        setFormMixed(data.mixed);
    }

    function handleClaspChange(claspId: string | undefined) {
        setFormClasp(claspId);
    }

    function handleCharmsChange(charms: typeof formCharms) {
        setFormCharms(charms);
    }

    const useClasp = selectedCategory?.properties.useClasp ?? false;
    const useCharms = selectedCategory?.properties.useCharms ?? false;
    const minAmountCharm = selectedCategory?.properties.minAmountCharm ?? 0;

    const onFormSubmit = (data: Omit<Composition, "id">) => {
        const firstProduct = productService.getById(formProducts[0]);
        const totalPrice = firstProduct?.basePrice ?? 0;

        const payload: Omit<Composition, "id"> = {
            ...data,
            categoryId: selectedCategoryId,
            matterId: selectedMatterId,
            products: formProducts,
            mixedProducts: formMixed,
            clasp: useClasp ? formClasp : undefined,
            selectedCharms: useCharms ? formCharms : [],
            totalPrice,
            updatedAt: Date.now(),
        };

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
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
                <div className="border-b-2 border-gray-300">
                    <div className="flex items-center justify-center gap-2">
                        {isProductSelectorOpen && (
                            <Button
                                type="button"
                                variant="success"
                                className="text-white"
                                onClick={() => {
                                    setProductSelectorOpen(false);
                                    setAnySelectorOpen(false);
                                }}
                            >
                                <Check />
                                Valider
                            </Button>
                        )}
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
                    <ListSelectedProducts isSelectorOpened={isProductSelectorOpen} products={formProducts} />
                    <ProductSelector
                        isOpen={isProductSelectorOpen}
                        list={products}
                        selectedCategoryId={selectedCategoryId}
                        selectedMatterId={selectedMatterId}
                        canBeMixed={selectedCategory?.properties.canBeMixed ?? false}
                        setProducts={handleProductsChange}
                    />
                </div>
            )}

            {/* Fermoir */}
            {useClasp && selectedMatterId && (
                <div className="border-b-2 border-gray-300">
                    <div className="flex items-center justify-center gap-2">
                        {isClaspSelectorOpen && (
                            <Button
                                type="button"
                                variant="success"
                                className="text-white"
                                onClick={() => {
                                    setClaspSelectorOpen(false);
                                    setAnySelectorOpen(false);
                                }}
                            >
                                <Check />
                                Valider
                            </Button>
                        )}
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
                        selectedClasp={formClasp}
                        onSelect={handleClaspChange}
                    />
                </div>
            )}

            {/* Charms */}
            {useCharms && selectedMatterId && (
                <div className="border-b-2 border-gray-300">
                    <div className="flex items-center justify-center gap-2">
                        {isCharmSelectorOpen && (
                            <Button
                                type="button"
                                variant="success"
                                className="text-white"
                                onClick={() => {
                                    setCharmSelectorOpen(false);
                                    setAnySelectorOpen(false);
                                }}
                            >
                                <Check />
                                Valider
                            </Button>
                        )}
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
                        selectedCharms={formCharms}
                        minAmount={minAmountCharm}
                        onSelect={handleCharmsChange}
                    />
                </div>
            )}

            {/* Zone d'action */}
            {!anySelectorOpen && (
                <div className="static bottom-0">
                    <Button variant="secondary" className="float-left" onClick={() => onCancel()}>
                        Annuler
                    </Button>
                    <Button type="submit" className="float-right" disabled={isSubmitting}>
                        Sauvegarder
                    </Button>
                </div>
            )}
        </form>
    );
}
