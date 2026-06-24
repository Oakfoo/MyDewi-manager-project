import { Card } from "../../UI/Card";
import { productService } from "../../../services/data/ProductService";
interface ListSelectedProductsProps {
    products?: string[];
    isSelectorOpened: boolean;
}

export function ListSelectedProducts({products, isSelectorOpened}: ListSelectedProductsProps) {


    return (
        <div className={`overflow-y-auto ${isSelectorOpened ? 'max-h-0' : 'max-h-40'}`}>
            { !isSelectorOpened && 
            <div className="flex gap-5">
                <div className={`flex items-center justify-center ${isSelectorOpened}`}>
                        {!products && <h4>Aucune base choisie</h4>}
                        {products && products.map((id, i) => {
                            const prod = productService.getById(id)!;

                            return (<Card>
                                <img src={prod.images[0]} className="w-full h-full object-cover" title={`product selected n°${(i + 1)}`} />
                            </Card>)
                        })}
                </div>
            </div>
            }
        </div>
    )
}