import { MinimalOrderItem } from "../../types";
import { Card, CardContent, CardHeader } from "../UI/Card";

interface SeeOrderDetailsProps {
    data: MinimalOrderItem[];
    comment: string;
}

export function SeeOrderDetails ({
    data,
    comment
}: SeeOrderDetailsProps) {
    function ItemCard(_item: MinimalOrderItem, idOrderItem: number) {
        return (
            <Card key={`OIL-${idOrderItem}`} className="w-full mb-5">
                <CardHeader key={`OIL-header-${idOrderItem}`} className="bg-white flex flex-col md:flex-row gap-2 align-middle">
                    <h2 className="w-full">Lot n° {idOrderItem+1}</h2>
                    <div className="p-1 bg-green-500 rounded-2xl h-10 w-10 text-center">
                        x {_item.productQuantity}
                    </div>
                </CardHeader>
                <CardContent key={`OIL-content-${idOrderItem}`} className="p-3 space-x-3 bg-gray-200 grid grid-cols-2 gap-4">
                    <div className="text-center gap-5 flex flex-col items-center">
                        <img src={_item.productImage} alt={_item.productName} className="w-15 h-15" />
                        <h3 className="uppercase text-sm text-nowrap">{_item.productName}</h3>
                    </div>
                    <div className="grid grid-cols-1 overflow-y-auto">
                        {_item.selectedCharms?.map((_charm, _idCharm) => (
                            <div key={`OIL-charm-${_idCharm}`} className="relative border border-gray-300 grid grid-cols-2 mb-2 min-h-15 max-h-18 space-y-2">
                                <img src={_charm.productImage} alt={_charm.productName} className="w-full h-full object-contain" />
                                <div className="absolute bottom-0 right-0 p-1 bg-green-500 rounded-tl-2xl">
                                    <p className="text-xs">x {_charm.productQuantity}</p>
                                </div>
                                <div className="flex flex-col gap-2 p-2 overflow-hidden">
                                    <p className="uppercase text-xs">{_charm.productName}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="w-full h-full gap-4">
            <div>
                <h4>Commentaire du client: </h4>
                <div className="p-2 border border-gray-200 rounded-xl mb-5">
                    {comment}
                </div>
            </div>
            
            {data.map((item, idOrderItem) => (
                ItemCard(item, idOrderItem)
            ))} 
        </div>
    )
}