import { useState } from "react";
import { Product } from "../../../types";
import { Card, CardContent, CardHeader } from "../../UI/Card";
import { CheckCircle } from "lucide-react";
import { ProductResponse } from "../CompositionForm";

interface ProductSelectorProps {
    isOpen: boolean;
    list: Product[];
    selectedCategoryId: string;
    selectedMatterId: string;
    canBeMixed: boolean;
    setProducts: (data: ProductResponse) => void;
}

export function ProductSelector({
    isOpen,
    list,
    selectedCategoryId,
    selectedMatterId,
    canBeMixed,
    setProducts,
}: ProductSelectorProps) {
    const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);
    const [secondProduct, setSecondProduct] = useState<string | undefined>(undefined);
    const [isProductMixed, setProductMixed] = useState<boolean>(false);

    const currentList = list.filter(
        (product) => product.categoryId === selectedCategoryId && product.matterId === selectedMatterId
    );

    function handleSelection(id: string) {
        if (isProductMixed) {
            if (selectedProduct === id) {
                setSelectedProduct(undefined);
            } else if (secondProduct === id) {
                setSecondProduct(undefined);
            } else {
                if (selectedProduct && selectedProduct !== id) {
                    setSecondProduct(id);
                } else {
                    setSelectedProduct(id);
                }
            }
            setProducts({
                prod1: selectedProduct!,
                prod2: secondProduct ? secondProduct : undefined,
                mixed: isProductMixed,
            });
        } else {
            if (selectedProduct !== id) {
                setSelectedProduct(id);
            } else {
                setSelectedProduct(undefined);
            }
            setProducts({
                prod1: selectedProduct!,
                mixed: isProductMixed,
            });
        }
    }

    return (
        <div className={`space-y-5 transition-all duration-200 ${isOpen ? "h-full" : "h-0"}`}>
            {isOpen && (
                <div>
                    {/* Mixable */}
                    {canBeMixed && (
                        <div className="flex items-center justify-even gap-[1rem] mb-3">
                            <label htmlFor="mixed-input">Mix</label>
                            <input
                                type="checkbox"
                                checked={isProductMixed}
                                title="Produits mixés"
                                onChange={() => {
                                    setProductMixed(!isProductMixed);
                                    if (!isProductMixed && secondProduct) {
                                        setSecondProduct(undefined);
                                    }
                                }}
                            />
                        </div>
                    )}

                    <div className="flex items-center gap-3 overflow-x-auto py-2">
                        {currentList.map((prod) => (
                            <Card
                                key={prod.id}
                                className={`min-w-40 max-w-40 h-40 relative cursor-pointer ${
                                    selectedProduct === prod.id || secondProduct === prod.id
                                        ? "border-2 border-pink-300"
                                        : ""
                                }`}
                                onClick={() => handleSelection(prod.id!)}
                            >
                                <CardHeader className="relative">
                                    <CheckCircle
                                        className={`absolute right-5 top-5 text-purple-600 ${
                                            selectedProduct === prod.id || secondProduct === prod.id ? "" : "hidden"
                                        }`}
                                    />
                                    <img src={prod.images[0]} title={prod.name} className="h-full w-full object-cover z-1" />
                                </CardHeader>
                                <CardContent className="absolute bg-white bottom-0 text-xs text-nowrap z-5">
                                    {prod.name}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
