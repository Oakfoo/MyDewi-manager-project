import { useState } from "react";
import { CategoryProduct, Matter, Product } from "../../../types";
import { Card, CardContent, CardHeader } from "../../UI/Card";
import { CheckCircle } from "lucide-react";
import { ProductResponse } from "../CompositionForm";

interface ProductSelectorProps {
    isOpen: boolean;
    list: Product[];
    categories: CategoryProduct[];
    matters: Matter[];
    setProducts: (data: ProductResponse) => void;
}

export function ProductSelector({isOpen, list, categories, matters, setProducts}: ProductSelectorProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>("j12XS7J4bzkr0FgSII04");
    const [selectedMatter, setSelectedMatter] = useState<string>("MrJdaoMfdnameyibJNfs");
    const [selectedProduct, setSelectedProduct] = useState<string | undefined>(undefined);
    const [secondProduct, setSecondProduct] = useState<string | undefined>(undefined);
    const [isProductMixed, setProductMixed] = useState<boolean>(false);
    const currentList = list.filter(
        product => {
            const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
            const matchesMatter = !selectedMatter || product.matterId === selectedMatter;
            return matchesCategory && matchesMatter;
        }
    )

    function handleSelection(id: string) {
        if(isProductMixed) {
            if(selectedProduct === id) {
                setSelectedProduct(undefined);
            } else if(secondProduct === id) {
                setSecondProduct(undefined);
            } else {
                if(selectedProduct && selectedProduct != id) {
                    setSecondProduct(id);
                } else {
                    setSelectedProduct(id);
                }
            }
            setProducts({
                prod1: selectedProduct!,
                prod2: secondProduct ? secondProduct : undefined,
                mixed: isProductMixed
            })
        } else {
            if (selectedProduct != id) {
                setSelectedProduct(id);
            } else {
                setSelectedProduct(undefined);
            }
            setProducts({
                prod1: selectedProduct!,
                mixed: isProductMixed
            })
        }
        
        
    }

    return (
        <div className={`space-y-5 transition-all duration-200 ${isOpen 
            ? 'h-full' 
            : 'h-0'
        }`}
        >
            {isOpen && <div>
                {/* Catégories + Matières + Mixable */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex items-center justify-even gap-[1rem]">
                        <label htmlFor="categories">Catégorie choisie : </label>
                        <select 
                            id="categories"
                            value={selectedCategory!}
                            onChange={(ev) => {setSelectedCategory(ev.target.value)}}
                            className="border-black md:border-r-2 "
                        >
                        {categories.map((cat, catId) => (
                            <option
                                key={catId}
                                value={cat.id}
                                className={`${cat.isActive ? '' : 'hidden'} text-nowrap border-b-2 transition-all duration-300 ${cat.id === selectedCategory ? 'border-pink-400' : 'border-transparent'} `}
                            >
                                {cat.name.fr}
                            </option>
                        ))}
                        </select>
                    </div>
                    

                    <div className="flex items-center justify-even gap-[1rem]">
                        <label htmlFor="matters">Matière choisie : </label>
                        <select 
                            id="matters"
                            value={selectedMatter!}
                            onChange={(ev) => {setSelectedMatter(ev.target.value)}}
                            className="border-black md:border-r-2 "
                        >
                        {matters.map((mat, matId) => (
                            <option
                                key={matId}
                                value={mat.id}
                                className={`${mat.isActive ? '' : 'hidden'} text-nowrap border-b-2 transition-all duration-300 ${mat.id === selectedMatter ? 'border-pink-400' : 'border-transparent'} `}
                            >
                                {mat.name.fr}
                            </option>
                        ))}
                        </select>
                    </div>
                    
                    <div className="flex items-center justify-even gap-[1rem]">
                        <label htmlFor="mixed-input">Mix</label>
                        <input 
                        type="checkbox"
                        checked={isProductMixed}
                        title="Produits mixés"
                        onChange={() => {
                            setProductMixed(!isProductMixed);
                            if(!isProductMixed && secondProduct) {
                                setSecondProduct(undefined);
                            }
                        }}/>
                    </div>
                    

                </div>

                <div>
                    
                </div>
                
                <div className="flex items-center gap-3 overflow-x-auto py-2">
                    {currentList.map((prod, prodId) => (
                        <Card 
                        key={prodId}
                        className={`min-w-40 max-w-40 h-40 relative 
                            ${selectedProduct === prod.id || secondProduct === prod.id 
                                ? 'border-2 border-pink-300'
                                : ''
                            }`}
                        onClick={() => {
                            handleSelection(prod.id!);
                        }}
                        >
                            <CardHeader className="relative">
                                <CheckCircle 
                                    className={`absolute right-5 top-5 text-purple-600 ${
                                        selectedProduct === prod.id || secondProduct === prod.id
                                        ? ''
                                        : 'hidden'
                                    }`}
                                />
                                <img src={prod.images[0]} title={prod.name} className="h-full w-full object-cover z-1"/>
                            </CardHeader>
                            <CardContent className="absolute bg-white bottom-0 text-xs text-nowrap z-5">
                                {prod.name}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            }
        </div>
    )
}