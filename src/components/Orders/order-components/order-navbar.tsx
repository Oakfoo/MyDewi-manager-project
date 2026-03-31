import { useState } from "react";
import { CustomerInfos } from "./customer-infos";
import { OrderProductsList } from "./order-products-list";
import { Order } from "../../../types";

interface OrderNavBarProps {
    selectedOrder: Order;
}

export const OrderNavbar: React.FC<OrderNavBarProps> = ({selectedOrder}) => {

    const [selectedPage, setSelectedPage] = useState<number>(0);

    const pages = [
        {
            btnTitle: "Liste des produits",
            component: <OrderProductsList 
                items={selectedOrder.items}
                comment={selectedOrder.comment ? selectedOrder.comment : ""}
            />
        },
        {
            btnTitle: "Infos Client",
            component: <CustomerInfos 
                customerId={selectedOrder.customerId}
                shippingAddress={selectedOrder.shippingAddress}
            />
        }
    ]

    return (
        <div>
            <nav
                className="border-b border-black pb-2 space-x-3"
            >
                {pages.map((_p, indexP)=> (
                    <button 
                        key={indexP}
                        onClick={() => {
                            setSelectedPage(indexP)
                        }}
                        className={`p-2 md:p-3 border rounded-2xl border-black ${indexP === selectedPage ? "bg-blue-100" : ""}`}
                    >
                        {_p.btnTitle}
                    </button>
                ))}
            </nav>
            <div>
                {pages[selectedPage].component}
            </div>
        </div>
    )
}