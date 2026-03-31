import { OrderItem } from "../../../types"
import { productService } from "../../../services/data/ProductService";
import { productCategoryService } from "../../../services/data/ProductCategoryService";
import { charmService } from "../../../services/data/CharmService";
import { claspService } from "../../../services/data/ClaspService";
import { PlusCircle } from "lucide-react";
import { Card, CardHeader } from "../../UI/Card";


interface OrderProductsListProps {
    items: OrderItem[];
    comment: string;
}


export const OrderProductsList: React.FC<OrderProductsListProps> = ({items, comment}) => {

    const getClaspName = (idClasp: string) => {
        return claspService.getById(idClasp)?.name;
    }

    return (
        <div>
            {comment != "" && <div className="h-[5dvh] p-2 hover:h-[15dvh] transition-[height] border-b border-black overflow-hidden hover:overflow-y-auto">
                <label>Commentaire du client :</label>
                <p>{comment}</p>
            </div>}
            {items.map((item, itemX) => {
                const products = item.productIds.map(id => productService.getById(id))
                const categoryProducts = productCategoryService.getById(products[0]!.categoryId!);
                return (
                    <Card key={`order-item-${itemX}`} className="bg-blue-100 my-5 space-y-2">
                        <CardHeader className="bg-blue-200 flex relative">
                            <h1 className="uppercase w-full py-1">Lot n° {itemX+1}</h1>
                            <span className=" absolute right-5 rounded-lg px-2 py-2 bg-gray-500 text-white">x {item.productQuantity}</span>
                        </CardHeader>
                        
                        <div className="grid grid-cols-2 grid-rows-1">
                            {/* Détails produit(s) */}
                            <div>
                                <h1 className="text-center uppercase">{categoryProducts?.name.fr}</h1>
                                <div className="flex relative">
                                    {products.map((product, idX) => (
                                        <div key={idX} className="text-center relative h-[200px]">
                                            <img src={product?.images[0]} className="h-full mx-auto object-cover" aria-label={`product-image-${idX}`}/>
                                            <label className="absolute bottom-0 left-0 right-0 bg-white">{product?.name}</label>
                                        </div>
                                    ))}
                                    {item.productIds.length > 1 && <PlusCircle className="absolute h-8 w-8 top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"/>}
                                </div>
                            </div>
                            
                                
                            <div>
                                {/* Détails Commande */}
                                {(item.productDetailsSelection && item.productDetailsSelection.length > 0) && <div
                                    className="border-b border-black"
                                >
                                    <h1>Caractéristiques</h1>
                                    {products[0]?.details.map((detail, idDetail) => {

                                        return (
                                            <div key={"detail-item-" + idDetail}>{detail.name.fr} - {item.productDetailsSelection ? detail.values[item.productDetailsSelection[idDetail].idValue] : 'Aucun'}</div>
                                        );
                                    })}
                                </div>}
                                {/* Fermoir */}
                                {categoryProducts?.properties.useClasp && <div
                                    className="p-1 border-b border-black"
                                >
                                    <h1>Fermoir : </h1>
                                    {item?.selectedClasp && getClaspName(item?.selectedClasp)}
                                </div>}
                                {/* Charmes */}
                                {categoryProducts?.properties.useCharms && <div>
                                    <h1>Charmes</h1>
                                    {item.selectedCharms.map((sc, cX) => {
                                        const charm = charmService.getById(sc.charmId);

                                        return (
                                            <div 
                                            key={"charms-icn-" + cX}
                                            className="flex justify-items items-center gap-2 border-b border-black"
                                            >
                                                <label className="w-10 bg-green-200">+ {sc.charmQuantity}</label>
                                                <img 
                                                src={charm?.image} 
                                                aria-label={"charm-image-" + cX}
                                                className="h-5 w-5 object-cover" 
                                                />
                                                <label className="w-full text-wrap">{charm?.name}</label>
                                            </div>
                                        )
                                    })}
                                </div>}
                            </div>
                            
                        </div>
                    </Card>
                )
            })}

        </div>
    )
}